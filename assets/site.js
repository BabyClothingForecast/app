(function () {
  const html = document.documentElement;
  const toggleButtons = document.querySelectorAll(".language-toggle button");
  const storageKey = "bcf-lang";

  function applyLanguage(lang, rememberChoice = false) {
    const normalized = lang === "en" ? "en" : "de";
    html.setAttribute("data-lang", normalized);
    html.setAttribute("lang", normalized);
    toggleButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.setLang === normalized);
      button.setAttribute("aria-pressed", String(button.dataset.setLang === normalized));
    });

    if (rememberChoice) {
      try {
        localStorage.setItem(storageKey, normalized);
      } catch (error) {
        // Language switching also works when browser storage is unavailable.
      }
    }
  }

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.setLang, true));
  });

  let initial = "de";
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === "de" || stored === "en") {
      initial = stored;
    }
  } catch (error) {
    initial = "de";
  }
  applyLanguage(initial);

  const header = document.querySelector("[data-site-header]");
  function syncHeader() {
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealElements = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.16 }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  const depthElements = document.querySelectorAll("[data-depth]");
  if (!prefersReducedMotion && depthElements.length) {
    let ticking = false;
    function syncDepth() {
      depthElements.forEach((element) => {
        const depth = Number(element.dataset.depth || 0);
        element.style.setProperty("--scroll-depth", `${window.scrollY * depth}px`);
        element.style.transform = `translateY(${window.scrollY * depth}px) rotate(4deg)`;
      });
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(syncDepth);
          ticking = true;
        }
      },
      { passive: true }
    );
  }
})();
