(function () {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".site-nav a[href^='#']");
  const yearEl = document.getElementById("year");
  const form = document.querySelector(".contact-form");
  const formNote = document.querySelector(".form-note");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

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
      if (nav.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = header ? header.offsetHeight : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - top - 8;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  if (form && formNote) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const message = form.querySelector("#message");
      if (!name || !email || !message) return;

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        formNote.textContent = "Please fill in all fields.";
        return;
      }

      formNote.textContent =
        "Thanks — this is a demo form. Connect it to your email or backend when you’re ready.";
      form.reset();
    });
  }
})();
