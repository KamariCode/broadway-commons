const mobileMenuButton = document.querySelector(".mobile-menu-button");
const navigation = document.querySelector(".main-navigation");

const dropdown = document.querySelector(".nav-dropdown");
const dropdownButton = document.querySelector(".dropdown-button");

mobileMenuButton.addEventListener("click", () => {
  const menuIsOpen =
    mobileMenuButton.getAttribute("aria-expanded") === "true";

  mobileMenuButton.setAttribute(
    "aria-expanded",
    String(!menuIsOpen)
  );

  navigation.classList.toggle("navigation-open", !menuIsOpen);
});

dropdownButton.addEventListener("click", () => {
  const dropdownIsOpen =
    dropdownButton.getAttribute("aria-expanded") === "true";

  dropdownButton.setAttribute(
    "aria-expanded",
    String(!dropdownIsOpen)
  );

  dropdown.classList.toggle("dropdown-open", !dropdownIsOpen);
});

document.addEventListener("click", (event) => {
  if (!dropdown.contains(event.target)) {
    dropdownButton.setAttribute("aria-expanded", "false");
    dropdown.classList.remove("dropdown-open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    dropdownButton.setAttribute("aria-expanded", "false");
    dropdown.classList.remove("dropdown-open");

    mobileMenuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("navigation-open");
  }
});
/* Photo gallery page */

(() => {
  const featuredStage = document.querySelector(".featured-stage");

  /*
    This code only runs on the photo gallery page.
    It will not interfere with the homepage.
  */
  if (!featuredStage) {
    return;
  }

  const featuredCarousel = document.querySelector(".featured-carousel");
  const featuredSlides = [
    ...document.querySelectorAll(".featured-slide")
  ];

  const previousFeaturedButton =
    document.querySelector(".featured-previous");

  const nextFeaturedButton =
    document.querySelector(".featured-next");

  const dotsContainer =
    document.querySelector(".featured-dots");

  let activeFeaturedSlide = 0;
  let automaticCarousel;

  function createFeaturedDots() {
    featuredSlides.forEach((slide, index) => {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "featured-dot";
      dot.setAttribute(
        "aria-label",
        `Show featured photo ${index + 1}`
      );

      dot.addEventListener("click", () => {
        activeFeaturedSlide = index;
        displayFeaturedSlides();
        restartAutomaticCarousel();
      });

      dotsContainer.appendChild(dot);
    });
  }

  function displayFeaturedSlides() {
    const stageWidth = featuredStage.clientWidth;
    const distance = Math.min(300, stageWidth * 0.29);
    const totalSlides = featuredSlides.length;

    featuredSlides.forEach((slide, index) => {
      let offset = index - activeFeaturedSlide;

      if (offset > totalSlides / 2) {
        offset -= totalSlides;
      }

      if (offset < -totalSlides / 2) {
        offset += totalSlides;
      }

      const absoluteOffset = Math.abs(offset);

      if (absoluteOffset > 2) {
        slide.style.opacity = "0";
        slide.style.pointerEvents = "none";
        slide.style.zIndex = "0";
        return;
      }

      const scale =
        absoluteOffset === 0
          ? 1
          : absoluteOffset === 1
            ? 0.73
            : 0.54;

      const opacity =
        absoluteOffset === 0
          ? 1
          : absoluteOffset === 1
            ? 0.72
            : 0.35;

      slide.style.opacity = String(opacity);
      slide.style.pointerEvents =
        absoluteOffset === 0 ? "auto" : "none";

      slide.style.zIndex = String(10 - absoluteOffset);

      slide.style.filter =
        absoluteOffset === 0
          ? "none"
          : "brightness(0.8)";

      slide.style.transform = `
        translate(
          calc(-50% + ${offset * distance}px),
          -50%
        )
        scale(${scale})
        rotateY(${offset * -8}deg)
      `;
    });

    const dots = document.querySelectorAll(".featured-dot");

    dots.forEach((dot, index) => {
      dot.classList.toggle(
        "active",
        index === activeFeaturedSlide
      );
    });
  }

  function showNextFeaturedSlide() {
    activeFeaturedSlide =
      (activeFeaturedSlide + 1) % featuredSlides.length;

    displayFeaturedSlides();
  }

  function showPreviousFeaturedSlide() {
    activeFeaturedSlide =
      (
        activeFeaturedSlide -
        1 +
        featuredSlides.length
      ) % featuredSlides.length;

    displayFeaturedSlides();
  }

  function startAutomaticCarousel() {
    automaticCarousel = window.setInterval(
      showNextFeaturedSlide,
      1800
    );
  }

  function stopAutomaticCarousel() {
    window.clearInterval(automaticCarousel);
  }

  function restartAutomaticCarousel() {
    stopAutomaticCarousel();
    startAutomaticCarousel();
  }

  previousFeaturedButton.addEventListener("click", () => {
    showPreviousFeaturedSlide();
    restartAutomaticCarousel();
  });

  nextFeaturedButton.addEventListener("click", () => {
    showNextFeaturedSlide();
    restartAutomaticCarousel();
  });

  featuredCarousel.addEventListener(
    "mouseenter",
    stopAutomaticCarousel
  );

  featuredCarousel.addEventListener(
    "mouseleave",
    startAutomaticCarousel
  );

  featuredCarousel.addEventListener(
    "focusin",
    stopAutomaticCarousel
  );

  featuredCarousel.addEventListener(
    "focusout",
    startAutomaticCarousel
  );

  window.addEventListener(
    "resize",
    displayFeaturedSlides
  );

  createFeaturedDots();
  displayFeaturedSlides();

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reducedMotion) {
    startAutomaticCarousel();
  }

  /* Create temporary photos for each event carousel. */

  const eventTracks = document.querySelectorAll(".event-track");

  eventTracks.forEach((track, galleryIndex) => {
    const placeholderCount =
      Number(track.dataset.placeholderCount) || 16;

    for (
      let photoIndex = 1;
      photoIndex <= placeholderCount;
      photoIndex += 1
    ) {
      const placeholder = document.createElement("div");

      placeholder.className = "event-photo";
      placeholder.textContent = `Photo ${photoIndex}`;

      track.appendChild(placeholder);
    }

    const carousel = track.closest(".event-carousel");
    const previousButton =
      carousel.querySelector(".event-previous");

    const nextButton =
      carousel.querySelector(".event-next");

    function updateEventButtons() {
      const maximumScroll =
        track.scrollWidth - track.clientWidth;

      previousButton.disabled = track.scrollLeft <= 2;

      nextButton.disabled =
        track.scrollLeft >= maximumScroll - 2;
    }

    previousButton.addEventListener("click", () => {
      track.scrollBy({
        left: -track.clientWidth * 0.8,
        behavior: "smooth"
      });
    });

    nextButton.addEventListener("click", () => {
      track.scrollBy({
        left: track.clientWidth * 0.8,
        behavior: "smooth"
      });
    });

    track.addEventListener("scroll", updateEventButtons);

    window.addEventListener("resize", updateEventButtons);

    updateEventButtons();
  });
})();