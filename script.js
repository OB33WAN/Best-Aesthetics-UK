(function () {
  "use strict";

  /* ─── Cached elements ─────────────────────────────────── */
  var header      = document.querySelector(".site-header");
  var nav         = document.querySelector(".site-nav");
  var toggle      = document.querySelector(".nav-toggle");
  var navLinks    = document.querySelectorAll(".site-nav a[href^='#']");
  var yearEl      = document.getElementById("year");
  var form        = document.querySelector(".contact-form");
  var formNote    = document.querySelector(".form-note");
  var backToTop   = document.getElementById("back-to-top");
  var lightbox      = document.getElementById("lightbox");
  var lightboxImg   = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");

  /* ─── Year ───────────────────────────────────────────── */
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ─── Mobile nav ─────────────────────────────────────── */
  function closeMenu() {
    if (!nav || !toggle || !header) return;
    nav.classList.remove("is-open");
    header.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  function openMenu() {
    if (!nav || !toggle || !header) return;
    nav.classList.add("is-open");
    header.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }

  if (toggle && nav && header) {
    toggle.addEventListener("click", function () {
      nav.classList.contains("is-open") ? closeMenu() : openMenu();
    });
    navLinks.forEach(function (link) { link.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ─── Smooth scroll ──────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var y = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  /* ─── Header scroll state + back-to-top visibility ───── */
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);

    if (backToTop) {
      if (window.scrollY > 600) {
        backToTop.removeAttribute("hidden");
        requestAnimationFrame(function () { backToTop.classList.add("is-visible"); });
      } else {
        backToTop.classList.remove("is-visible");
      }
    }
    updateActiveNav();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ─── Active nav link on scroll ─────────────────────── */
  var sections    = document.querySelectorAll("section[id], article[id]");
  var allNavLinks = document.querySelectorAll(".nav-list a[href^='#']");

  function updateActiveNav() {
    if (!sections.length || !allNavLinks.length) return;
    var scrollY = window.scrollY + (header ? header.offsetHeight : 0) + 80;
    var current = "";
    sections.forEach(function (s) { if (s.offsetTop <= scrollY) current = s.getAttribute("id"); });
    allNavLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + current);
    });
  }

  /* ─── Back to top ────────────────────────────────────── */
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ─── Scroll reveal ──────────────────────────────────── */
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ─── Stats counter animation ────────────────────────── */
  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el      = entry.target;
        var target  = parseInt(el.getAttribute("data-count"), 10);
        if (isNaN(target)) return;
        var suffix   = el.getAttribute("data-suffix") || "";
        var duration = 1600;
        var start    = performance.now();
        function step(now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target).toLocaleString("en-GB") + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.6 });

    document.querySelectorAll("[data-count]").forEach(function (el) { counterObserver.observe(el); });
  }

  /* ─── Gallery lightbox ───────────────────────────────── */
  if (lightbox && lightboxImg && lightboxClose) {
    document.querySelectorAll(".gallery-mosaic__item").forEach(function (item) {
      var img = item.querySelector("img");
      if (!img) return;
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", "View: " + (img.alt || "gallery image"));

      function openLightbox() {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || "";
        lightbox.removeAttribute("hidden");
        requestAnimationFrame(function () { lightbox.classList.add("is-open"); });
        document.body.style.overflow = "hidden";
        lightboxClose.focus();
      }

      item.addEventListener("click", openLightbox);
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(); }
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      setTimeout(function () {
        lightbox.setAttribute("hidden", "");
        lightboxImg.src = "";
        document.body.style.overflow = "";
      }, 300);
    }

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }

  /* ─── Contact form ───────────────────────────────────── */
  if (form && formNote) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name    = form.querySelector("#name");
      var email   = form.querySelector("#email");
      var message = form.querySelector("#message");
      if (!name || !email || !message) return;

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        formNote.textContent = "Please fill in all fields.";
        formNote.style.color = "var(--color-ink)";
        return;
      }

      formNote.textContent = "Thanks — this is a demo form. Connect it to your email or backend when you're ready.";
      formNote.style.color = "var(--color-gold-dark)";
      form.reset();
    });
  }

})();

