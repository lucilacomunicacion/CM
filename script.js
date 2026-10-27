
document.addEventListener("DOMContentLoaded", () => {
  // Menú para celulares
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";

      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Abrir menú" : "Cerrar menú"
      );
      siteNav.classList.toggle("is-open", !isOpen);
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menú");
        siteNav.classList.remove("is-open");
      });
    });
  }

 
  // Mostrar y ocultar detalles de cada proyecto
  document.querySelectorAll(".expand-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".project-card");
      const details = button.nextElementSibling;

      if (
        !card ||
        !details ||
        !details.classList.contains("project-details")
      ) {
        return;
      }

      const isOpen = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isOpen));
      button.textContent = isOpen ? "Ver detalles" : "Ocultar detalles";
      card.classList.toggle("is-open", !isOpen);
    });
  });


  // Ventana ampliada para imágenes y videos
  const lightbox = document.querySelector("#lightbox");
  const lightboxPanel = document.querySelector(".lightbox-panel");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxTitle = document.querySelector("#lightbox-title");
  const gallery = document.querySelector("#lightbox-gallery");
  const lightboxArt = document.querySelector("#lightbox-art");
  const lightboxImage = document.querySelector("#lightbox-image");
  const lightboxVideo = document.querySelector("#lightbox-video");
  const placeholder = document.querySelector("#lightbox-placeholder");

  if (
    !lightbox ||
    !lightboxPanel ||
    !lightboxClose ||
    !lightboxTitle ||
    !gallery ||
    !lightboxArt ||
    !lightboxImage ||
    !lightboxVideo ||
    !placeholder
  ) {
    return;
  }

  let previousFocus = null;

  function clearViewer() {
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
    lightboxImage.hidden = true;

    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.querySelectorAll("source").forEach((source) => {
      source.remove();
    });
    lightboxVideo.load();
    lightboxVideo.hidden = true;

    placeholder.hidden = false;
    lightboxArt.classList.add("no-image");
    lightboxArt.classList.remove("has-image");
  }

  function showResource(resource, projectName) {
    clearViewer();

    lightboxTitle.textContent = resource.label || projectName;
    lightboxArt.setAttribute("aria-label", resource.label || projectName);

    if (!resource.url) {
      placeholder.textContent = "Este recurso todavía no tiene un archivo asociado.";
      return;
    }

    placeholder.hidden = true;
    lightboxArt.classList.remove("no-image");
    lightboxArt.classList.add("has-image");

    const isVideo =
      resource.type === "video" ||
      /\.(mp4|webm|ogg)(\?.*)?$/i.test(resource.url);

    if (isVideo) {
      lightboxVideo.src = resource.url;
      lightboxVideo.hidden = false;
      lightboxVideo.load();
    } else {
      lightboxImage.src = resource.url;
      lightboxImage.alt = resource.label || projectName;
      lightboxImage.hidden = false;
    }

    gallery.querySelectorAll(".gallery-item").forEach((item) => {
      item.classList.toggle(
        "is-selected",
        item.dataset.url === resource.url &&
          item.dataset.label === resource.label
      );
    });
  }

  function openLightbox(projectName, resources) {
    previousFocus = document.activeElement;
    gallery.replaceChildren();
    clearViewer();

    lightboxTitle.textContent = projectName;

    const validResources = resources.filter(
      (resource) => resource && resource.label
    );

    validResources.forEach((resource) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "gallery-item";
      item.textContent = resource.label;
      item.dataset.url = resource.url || "";
      item.dataset.label = resource.label;

      item.addEventListener("click", () => {
        showResource(resource, projectName);
      });

      gallery.appendChild(item);
    });

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    if (validResources.length > 0) {
      showResource(validResources[0], projectName);
    } else {
      placeholder.textContent = "Todavía no hay recursos cargados para este proyecto.";
    }

    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains("is-open")) return;

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    clearViewer();
    gallery.replaceChildren();

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  function parseResources(button) {
    try {
      const data = JSON.parse(button.dataset.metrics || "[]");

      if (!Array.isArray(data)) return [];

      return data.map((item) => ({
        label: item.label || "Ver recurso",
        url: item.url || "",
        type: item.type || ""
      }));
    } catch (error) {
      console.error("No se pudieron leer los recursos del proyecto.", error);
      return [];
    }
  }

  // Recursos que se muestran en "Ver trabajos"
  const projectGalleries = {
    "casa-del-plotter": [
      {
        label: "Antes del proyecto",
        url: "assets/proyectos/casa-del-plotter/La%20casa%20del%20plotter%20antes.png"
      },
      {
        label: "Después del proyecto",
        url: "assets/proyectos/casa-del-plotter/La%20casa%20del%20plotter%20despues.png"
      },
      {
        label: "Historia diseñada",
        url: "assets/proyectos/casa-del-plotter/la%20casa%20del%20plotter%20historia.png"
      },
      {
        label: "Publicación diseñada",
        url: "assets/proyectos/casa-del-plotter/la%20casa%20del%20plotter%20post.png"
      },
      {
        label: "Reel realizado",
        url: "assets/proyectos/casa-del-plotter/videos%20(3).mp4",
        type: "video"
      }
    ],

    "iconic-teen": [
      {
        label: "Perfil antes",
        url: "assets/proyectos/iconic-teen/Iconic%20teen%20antes.png"
      },
      {
        label: "Perfil después",
        url: "assets/proyectos/iconic-teen/Iconic%20teen%20despues.png"
      },
      {
        label: "Feed antes",
        url: "assets/proyectos/iconic-teen/iconic%20teen%20antes%20(2).png"
      },
      {
        label: "Feed después",
        url: "assets/proyectos/iconic-teen/iconic%20teen%20despues%20(2).png"
      },
      {
        label: "Publicación diseñada",
        url: "assets/proyectos/iconic-teen/iconic%20teen%20post.png"
      },
      {
        label: "Reel realizado 1",
        url: "assets/proyectos/iconic-teen/videos.mp4",
        type: "video"
      },
      {
        label: "Reel realizado 2",
        url: "assets/proyectos/iconic-teen/videos%20(1).mp4",
        type: "video"
      }
    ],

    "marca-personal": [
      {
        label: "Diseño del feed",
        url: "assets/proyectos/marca-personal/marca%20personal%20feed.png"
      },
      {
        label: "Publicación diseñada",
        url: "assets/proyectos/marca-personal/marca%20personal%20post.png"
      },
      {
        label: "TikTok realizado 1",
        url: "assets/proyectos/marca-personal/videos%20(2).mp4",
        type: "video"
      },
      {
        label: "TikTok realizado 2",
        url: "assets/proyectos/marca-personal/videos%20(4).mp4",
        type: "video"
      }
    ]
  };

  function openProjectGallery(projectName, galleryName) {
    const resources = projectGalleries[galleryName] || [];
    openLightbox(projectName, resources);
  }

  // Al hacer clic en la imagen principal del proyecto
  document.querySelectorAll(".project-image").forEach((button) => {
    button.addEventListener("click", () => {
      const projectName = button.dataset.project || "Proyecto";
      const imageUrl = button.dataset.image || "";

      openLightbox(projectName, [
        {
          label: "Imagen principal",
          url: imageUrl,
          type: "image"
        }
      ]);
    });
  });

 
  // Abrir trabajos o métricas de cada proyecto
  document.querySelectorAll(".resource-link").forEach((button) => {
    button.addEventListener("click", () => {
      const projectName = button.dataset.project || "Proyecto";

      // Si tiene data-gallery, abrirá la galería de trabajos
      if (button.dataset.gallery) {
        const galleryName = button.dataset.gallery;

        openProjectGallery(projectName, galleryName);
        return;
      }

      // Si no, abrirá las métricas
      const resources = parseResources(button);
      openLightbox(projectName, resources);
    });
  });


  // Cerrar con el botón o al hacer clic fuera del panel
  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Cerrar con Escape y mantener el foco dentro de la ventana
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = lightboxPanel.querySelectorAll(
      'button:not(:disabled), a[href], video[controls]'
    );

    if (!focusable.length) {
      event.preventDefault();
      lightboxClose.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
});
