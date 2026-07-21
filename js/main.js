(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Nav: solid background after the first scroll step
     --------------------------------------------------------- */
  const nav = document.getElementById("site-nav");
  const sentinel = document.getElementById("scroll-sentinel");

  if (nav && sentinel && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      ([entry]) => {
        nav.classList.toggle("is-scrolled", !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    navObserver.observe(sentinel);
  }

  /* ---------------------------------------------------------
     Mobile nav: hamburger dropdown (below the 640px breakpoint
     where the inline link list is hidden)
     --------------------------------------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("nav-mobile-menu");

  if (navToggle && nav && mobileMenu) {
    function closeMobileMenu() {
      nav.classList.remove("is-menu-open");
      mobileMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }

    navToggle.addEventListener("click", () => {
      const isOpen = !nav.classList.contains("is-menu-open");
      nav.classList.toggle("is-menu-open", isOpen);
      mobileMenu.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileMenu();
    });
  }

  /* ---------------------------------------------------------
     Full-bleed carousels (hero, projects)
     Auto-advance on a timer, pause on hover/focus, can be driven
     manually via dots. Reduced motion: no autoplay, dots still work.
     --------------------------------------------------------- */
  function initCarousel(container, autoplayMs) {
    if (!container) return;
    const slides = Array.from(container.querySelectorAll(".hero-slide"));
    const dots = Array.from(container.querySelectorAll(".hero-dot"));
    if (slides.length < 2) return;

    let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
    if (activeIndex < 0) activeIndex = 0;
    let timer = null;

    function goToSlide(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === activeIndex));
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === activeIndex));
      slides.forEach((slide, i) => {
        const video = slide.querySelector("video");
        if (!video) return;
        if (i === activeIndex) video.play().catch(() => {});
        else video.pause();
      });
    }

    function startAutoplay() {
      if (reduceMotion) return;
      stopAutoplay();
      timer = window.setInterval(() => goToSlide(activeIndex + 1), autoplayMs);
    }

    function stopAutoplay() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        goToSlide(i);
        startAutoplay();
      });
    });

    container.addEventListener("mouseenter", stopAutoplay);
    container.addEventListener("mouseleave", startAutoplay);
    container.addEventListener("focusin", stopAutoplay);
    container.addEventListener("focusout", startAutoplay);

    goToSlide(activeIndex);
    startAutoplay();
  }

  initCarousel(document.getElementById("projets"), 5000);

  /* ---------------------------------------------------------
     Circular gallery (project pages)
     Scroll progress through a tall sticky-pinned stage rotates a
     set of photos through an arc: closest to center is sharp and
     large, others recede in scale/opacity/rotateY. Reduced motion:
     CSS collapses this to a plain static wrapped grid.
     --------------------------------------------------------- */
  function initCircularGallery(section) {
    if (!section || reduceMotion) return;
    const pin = section.querySelector(".circular-gallery-pin");
    const items = Array.from(section.querySelectorAll(".circular-gallery-item"));
    if (!pin || items.length < 2) return;

    let ticking = false;

    function update() {
      ticking = false;
      const pinH = pin.clientHeight;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - pinH;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const activeFloat = progress * (items.length - 1);

      items.forEach((item, i) => {
        const d = i - activeFloat;
        const ad = Math.abs(d);
        const scale = Math.max(0.55, 1 - ad * 0.18);
        const opacity = Math.max(0, 1 - ad * 0.35);
        const rot = Math.max(-18, Math.min(18, d * -12));
        item.style.transform = `translateX(${d * 42}%) scale(${scale}) rotateY(${rot}deg)`;
        item.style.opacity = String(opacity);
        item.style.zIndex = String(100 - Math.round(ad * 10));
      });
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  document.querySelectorAll(".circular-gallery").forEach(initCircularGallery);

  /* ---------------------------------------------------------
     Hero: parallax reveal
     Scroll progress through the tall wrapper drives: the central
     image's clip-path opening up to full-bleed, two side images
     drifting/fading, and the headline fading in near the end.
     --------------------------------------------------------- */
  const heroSection = document.getElementById("hero-parallax");
  const heroPin = document.getElementById("hero-pin");
  const heroCenter = document.getElementById("hero-center");
  const heroSideA = document.getElementById("hero-side-a");
  const heroSideB = document.getElementById("hero-side-b");
  const heroContentReveal = document.getElementById("hero-content-reveal");
  const heroHint = document.getElementById("hero-hint");

  if (heroSection && heroPin && heroCenter && !reduceMotion) {
    let ticking = false;

    function updateHero() {
      ticking = false;

      const pinH = heroPin.clientHeight;
      const rect = heroSection.getBoundingClientRect();
      const total = heroSection.offsetHeight - pinH;
      const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      const inset = 16 * (1 - progress);
      const insetSide = 24 * (1 - progress);
      const radius = 24 * (1 - progress);
      heroCenter.style.clipPath = `inset(${inset}% ${insetSide}% round ${radius}px)`;

      if (heroSideA) {
        heroSideA.style.opacity = String(Math.max(0, 0.9 - progress / 0.45));
        heroSideA.style.transform = `translate(${-progress * 60}px, ${-progress * 90}px)`;
      }
      if (heroSideB) {
        heroSideB.style.opacity = String(Math.max(0, 0.9 - progress / 0.45));
        heroSideB.style.transform = `translate(${progress * 60}px, ${progress * 90}px)`;
      }

      if (heroHint) heroHint.style.opacity = String(Math.max(0, 1 - progress / 0.25));

      if (heroContentReveal) {
        const contentOpacity = Math.max(0, (progress - 0.72) / 0.28);
        heroContentReveal.style.opacity = String(contentOpacity);
        heroContentReveal.style.transform = `translateY(${(1 - contentOpacity) * 20}px)`;
        heroContentReveal.style.pointerEvents = contentOpacity > 0.6 ? "auto" : "none";
      }
    }

    function onHeroScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHero);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onHeroScroll, { passive: true });
    window.addEventListener("resize", onHeroScroll);
    updateHero();
  }

  /* ---------------------------------------------------------
     Reveal-on-scroll
     --------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------
     Contact form (Formspree)
     --------------------------------------------------------- */
  const contactForm = document.getElementById("contact-form");
  const contactStatus = document.getElementById("contact-status");
  const contactSubmit = document.getElementById("contact-submit");

  function setFieldError(field, hasError) {
    if (!field) return;
    field.classList.toggle("has-error", hasError);
  }

  function validateContactForm() {
    let valid = true;
    contactForm.querySelectorAll("[required]").forEach((input) => {
      const field = input.closest(".field");
      const ok = input.checkValidity();
      setFieldError(field, !ok);
      if (!ok) valid = false;
    });
    return valid;
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!validateContactForm()) {
        contactStatus.textContent = "Merci de corriger les champs indiqués ci-dessus.";
        contactStatus.className = "form-status is-visible is-error";
        return;
      }

      contactSubmit.disabled = true;
      contactStatus.textContent = "Envoi en cours...";
      contactStatus.className = "form-status is-visible";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          contactStatus.textContent = "Message envoyé. Je reviens vers vous rapidement.";
          contactStatus.className = "form-status is-visible is-success";
          contactForm.reset();
        } else {
          throw new Error("Formspree request failed");
        }
      } catch (err) {
        contactStatus.textContent = "L'envoi a échoué. Écrivez-moi directement à l'adresse ci-contre.";
        contactStatus.className = "form-status is-visible is-error";
      } finally {
        contactSubmit.disabled = false;
      }
    });

    contactForm.querySelectorAll("[required]").forEach((input) => {
      input.addEventListener("input", () => {
        const field = input.closest(".field");
        if (field && field.classList.contains("has-error") && input.checkValidity()) {
          setFieldError(field, false);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     Client photo access (code -> download link lookup)
     --------------------------------------------------------- */
  const clientForm = document.getElementById("client-form");
  const clientInput = document.getElementById("client-code");
  const clientStatus = document.getElementById("client-status");

  const checkIcon =
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" /></svg>';
  const errorIcon =
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M10 10l4 4m0 -4l-4 4" /></svg>';

  let codesCache = null;

  async function loadCodes() {
    if (codesCache) return codesCache;
    const response = await fetch("data/codes.json");
    if (!response.ok) throw new Error("Impossible de charger les codes");
    const data = await response.json();
    codesCache = data.codes || {};
    return codesCache;
  }

  if (clientForm) {
    clientForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const raw = clientInput.value.trim().toUpperCase();

      if (!raw) return;

      clientStatus.className = "client-status is-visible";
      clientStatus.innerHTML = "Vérification du code...";

      try {
        const codes = await loadCodes();
        const entry = codes[raw];

        if (entry && entry.url) {
          clientStatus.className = "client-status is-visible is-success";
          clientStatus.innerHTML =
            checkIcon +
            `<span>Code valide (${entry.label || "vos photos"}). <a href="${entry.url}" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">Ouvrir le lien de téléchargement</a>.</span>`;
          window.open(entry.url, "_blank", "noopener");
        } else {
          clientStatus.className = "client-status is-visible is-error";
          clientStatus.innerHTML =
            errorIcon +
            "<span>Code invalide. Vérifiez le code reçu par email ou contactez-moi directement.</span>";
        }
      } catch (err) {
        clientStatus.className = "client-status is-visible is-error";
        clientStatus.innerHTML =
          errorIcon + "<span>Une erreur est survenue. Réessayez dans un instant.</span>";
      }
    });
  }
})();
