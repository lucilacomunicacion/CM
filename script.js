const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  const syncNavButton = () => {
    const isOpen = siteNav.classList.contains("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  };

  navToggle.addEventListener("click", () => {
    siteNav.classList.toggle("is-open");
    syncNavButton();
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      syncNavButton();
    });
  });
}

const projectCards = document.querySelectorAll(".project-card");
projectCards.forEach((card) => {
  const btn = card.querySelector(".expand-btn");
  btn?.addEventListener("click", () => {
    const isOpen = card.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(isOpen));
    btn.textContent = isOpen ? "Ocultar detalles" : "Ver detalles";
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxArt = document.querySelector(".lightbox-art");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxPlaceholder = document.getElementById("lightbox-placeholder");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxMetricList = document.getElementById("lightbox-metric-list");
const projectImages = document.querySelectorAll(".project-image");
const resourceButtons = document.querySelectorAll(".resource-link");

let lastFocusedElement = null;

const parseMetrics = (button) => {
  const rawMetrics = button.dataset.metrics || "[]";

  try {
    const parsed = JSON.parse(rawMetrics);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const renderMetrics = (metrics) => {
  if (!lightboxMetricList) {
    return;
  }

  lightboxMetricList.innerHTML = "";

  if (!metrics.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "lightbox-empty";
    emptyState.textContent = "No hay métricas cargadas para este proyecto.";
    lightboxMetricList.appendChild(emptyState);
    return;
  }

  metrics.forEach((metric) => {
    const { label, url } = metric;
    const item = document.createElement("div");
    item.className = "lightbox-metric-item";

    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = label;
      link.className = "lightbox-metric-link";
      item.appendChild(link);
    } else {
      const fallback = document.createElement("button");
      fallback.type = "button";
      fallback.className = "lightbox-metric-link lightbox-metric-button";
      fallback.textContent = label;
      fallback.setAttribute("aria-label", label);
      item.appendChild(fallback);
    }

    lightboxMetricList.appendChild(item);
  });
};

const openLightbox = (projectName, imageSource = "", metrics = []) => {
  if (!lightbox || !lightboxArt || !lightboxImage || !lightboxTitle) {
    return;
  }

  lightboxTitle.textContent = projectName;
  renderMetrics(metrics);

  if (imageSource) {
    lightboxImage.src = imageSource;
    lightboxImage.alt = projectName;
    lightboxArt.classList.add("has-image");
    lightboxArt.classList.remove("no-image");
    if (lightboxPlaceholder) {
      lightboxPlaceholder.style.display = "none";
    }
  } else {
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
    lightboxArt.classList.remove("has-image");
    lightboxArt.classList.add("no-image");
    if (lightboxPlaceholder) {
      lightboxPlaceholder.style.display = "block";
    }
  }

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");

  if (lightboxClose) {
    lightboxClose.focus();
  }
};

projectImages.forEach((button) => {
  button.addEventListener("click", () => {
    lastFocusedElement = button;
    const projectName = button.dataset.project || "Proyecto";
    const imageSource = button.dataset.image || "";

    openLightbox(projectName, imageSource);
  });
});

resourceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    lastFocusedElement = button;
    const projectName = button.dataset.project || "Proyecto";
    const imageSource = button.dataset.image || "";
    const metrics = parseMetrics(button);

    openLightbox(projectName, imageSource, metrics);
  });
});

const closeLightbox = () => {
  if (!lightbox) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
};

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox || !lightbox.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    closeLightbox();
    return;
  }

  if (event.key === "Tab" && lightboxClose) {
    const focusable = [lightboxClose];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
