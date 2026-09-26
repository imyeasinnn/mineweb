/* ==========================================================================
   Bangor Generator Services Co — static site behavior
   Vanilla JS only: mobile nav, scroll-reveal animations, mailto contact form.
   ========================================================================== */

(function () {
  "use strict";

  /* --------------------------------- Footer year ------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* -------------------------------- Mobile nav -------------------------------- */

  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  function setMenu(open) {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileNav.hidden = !open;
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMenu(!isOpen);
    });

    // Close the menu when a link inside it is clicked.
    mobileNav.addEventListener("click", function (event) {
      if (event.target instanceof Element && event.target.closest("a")) {
        setMenu(false);
      }
    });

    // Close on Escape for keyboard users.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        navToggle.focus();
      }
    });
  }

  /* ------------------------------ Scroll reveal -------------------------------- */

  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Very old browsers: just show everything.
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ------------------------- Contact form (mailto only) ------------------------ */

  var form = document.getElementById("quoteForm");
  var success = document.getElementById("formSuccess");

  var BUSINESS_EMAIL = "info@bangorgeneratorservices.com"; // TODO: replace with the real inbox
  var BUSINESS_NAME = "Bangor Generator Services Co";

  if (form && success) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // Simple validation with inline error styling.
      var valid = true;
      var required = form.querySelectorAll("[required]");
      Array.prototype.forEach.call(required, function (field) {
        var empty = !field.value.trim();
        field.setAttribute("aria-invalid", empty ? "true" : "false");
        if (empty) valid = false;
      });

      if (!valid) {
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var data = new FormData(form);
      var subject =
        "Quote request from " +
        String(data.get("name") || "").trim() +
        " — " +
        BUSINESS_NAME;
      var bodyLines = [
        "Name: " + String(data.get("name") || "").trim(),
        "Phone: " + String(data.get("phone") || "").trim(),
        "Email: " + (String(data.get("email") || "").trim() || "(not provided)"),
        "",
        "Message:",
        String(data.get("message") || "").trim(),
      ];

      var mailto =
        "mailto:" +
        BUSINESS_EMAIL +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(bodyLines.join("\n"));

      // Open the user's email client with the composed message.
      window.location.href = mailto;

      // Show confirmation state (covers pop-up blockers / user canceling).
      form.hidden = true;
      success.hidden = false;
      success.setAttribute("tabindex", "-1");
      success.focus();
    });
  }
})();
