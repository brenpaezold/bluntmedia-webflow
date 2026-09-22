// gsap.registerPlugin(SplitText);
// gsap.registerPlugin(ScrollTrigger);

//HEADER NAVIGATION
// Hide the header on scroll down, show it on scroll up.
//
// The previous version fired a fresh gsap.to() on EVERY scroll update, with no
// record of which state the header was already in. Ten scroll steps produced
// nine overlapping 0.4s tweens fighting over the same property, which is what
// made the header stutter; scrolling up could even leave it stuck half-hidden.
// It also started lastScroll at 0 rather than the real scroll position, so
// landing on a page the browser had restored mid-scroll counted as "scrolling
// down" and whipped the header away the instant you touched the wheel.
const navHeader = document.querySelector(".navbar");

if (navHeader) {
  // Seed from the actual position: a restored scroll must not read as movement.
  let lastScroll = window.scrollY;
  let hidden = false;

  // Ignore sub-pixel drift and trackpad inertia, which would otherwise flip
  // direction repeatedly and restart the tween each time.
  const THRESHOLD = 8;
  // Near the top the header is always shown, so it can never be stranded
  // off-screen at the point where there is nothing to scroll back up to.
  const ALWAYS_SHOW_ABOVE = 120;

  // Toggling a class, not tweening transform: IX2 owns the element's inline
  // transform on every page and re-applies it, so a GSAP tween on `y` never
  // took effect. The .nav-hidden rule in global.css is !important, which
  // outranks the inline style.
  const setHidden = (next) => {
    if (next === hidden) return; // only act on an actual state change
    hidden = next;
    navHeader.classList.toggle("nav-hidden", next);
  };

  ScrollTrigger.create({
    start: 0,
    onUpdate: (self) => {
      const current = self.scroll();
      const delta = current - lastScroll;
      if (Math.abs(delta) < THRESHOLD) return; // below the noise floor
      lastScroll = current;
      setHidden(current > ALWAYS_SHOW_ABOVE && delta > 0);
    },
  });
}

//SPLIT TEXT BANNER HEADERS

// Get header elements
const headerTitle = document.querySelector("#page-title");
const headerContent = document.querySelector(".header-content");
const headerImage = document.querySelector(".banner-img-container");
const diffTitle = document.querySelector(".difference-title");
const projectContent = document.querySelector("#project-content");

// Get CTA elements
const ctaTitle = document.querySelector("#cta-title");
const ctaPara = document.querySelector("#cta-para");
const ctaButton = document.querySelector("#form_button");

// Not every page has a banner: terms, privacy, thanks and 404 have none of these
// elements. gsap.from(null) throws "Cannot read properties of null (reading
// '_gsap')", which aborted the rest of the header animation and logged 3-4
// errors per page load, so each step is now added only when its target exists.
window.addEventListener("load", () => {
  const targets = [
    headerTitle,
    headerContent,
    diffTitle,
    headerImage,
    projectContent,
  ].filter(Boolean);
  if (!targets.length) return;

  gsap.set(targets, { autoAlpha: 1 });

  // SplitText is initialized *after* everything is loaded, so line breaks are final
  const split = headerTitle ? new SplitText(headerTitle, { type: "lines" }) : null;

  const tl = gsap.timeline({
    defaults: { opacity: 0, duration: 0.3, ease: "power4.out" },
    onComplete: () => split && split.revert(),
  });

  if (split) {
    tl.from(split.lines, {
      skewX: 10,
      skewY: -2,
      y: 40,
      opacity: 0,
      stagger: 0.1,
    });
  }
  if (headerContent) tl.from(headerContent, { y: 20, opacity: 0 }, ">");
  if (headerImage) tl.from(headerImage, { y: 30, duration: 0.2 });
  if (diffTitle) tl.from(diffTitle, { y: 30, duration: 0.2 });
  if (projectContent) tl.from(projectContent, { y: 30, duration: 0.2 }, "-=0.8");
});

// Same guard for the CTA block, which is absent on the utility pages.
if (document.querySelector(".section_cta") && (ctaTitle || ctaButton)) {
  const tl2 = gsap.timeline({
    defaults: { duration: 0.3, ease: "power4.out", opacity: 0 },
    scrollTrigger: {
      trigger: ".section_cta",
      start: "bottom bottom",
      // markers: true,
      toggleActions: "play none none reverse",
    },
  });

  if (ctaTitle) tl2.from(ctaTitle, { y: 100 });
  // if (ctaPara) tl2.from(ctaPara, { y: 100 }, "-=0.2");
  if (ctaButton) tl2.from(ctaButton, { y: 100 }, "-=0.2");
}

// Footer Animation
(function () {
  const MORPH_DURATION = 0.5;
  const MORPH_EASE_IN = "power4.out";
  const MORPH_EASE_OUT = "power3.inOut";

  document
    .querySelectorAll("#bluntmedia-footer .letter-group")
    .forEach((group) => {
      const hitArea = group.querySelector(".letter-hit-area");
      const activePaths = Array.from(group.querySelectorAll(".active-path"));

      const variantPaths = [0, 1, 2, 3].map((i) =>
        Array.from(group.querySelectorAll(`[data-variant="${i}"]`))
      );

      let cycleIndex = 0; // tracks which variant to show next (1, 2, 3, 1, 2, 3...)

      function morphTo(targetIndex, ease) {
        const targets = variantPaths[targetIndex];
        activePaths.forEach((activePath, i) => {
          const target = targets[i];
          if (!target) return;
          gsap.killTweensOf(activePath);
          gsap.to(activePath, {
            duration: MORPH_DURATION,
            ease: ease,
            morphSVG: target,
            fill:
              target.getAttribute("fill") || activePath.getAttribute("fill"),
          });
        });
      }

      hitArea.addEventListener("mouseenter", () => {
        cycleIndex = (cycleIndex % 3) + 1; // cycles 1→2→3→1→2→3...
        morphTo(cycleIndex, MORPH_EASE_IN);
      });

      hitArea.addEventListener("mouseleave", () => {
        const activeTweens = activePaths.map((p) => gsap.getTweensOf(p)).flat();
        const isAnimating = activeTweens.some((t) => t.isActive());

        if (isAnimating) {
          // Wait for the longest active tween to finish, then revert
          const maxDuration = Math.max(
            ...activeTweens.map((t) => t.duration() - t.time())
          );
          gsap.delayedCall(maxDuration, () => morphTo(0, MORPH_EASE_OUT));
        } else {
          morphTo(0, MORPH_EASE_OUT);
        }
      });
    });
})();

//End GSAP

// Function to pluralize the time past (eg. minute or minutes / day or days)
const pluralize = (count, noun, suffix = "s") =>
  `${count} ${noun}${count !== 1 ? suffix : ""}`;

const timePast = (curr, prev) => {
  const msMin = 60 * 1000,
    msHr = msMin * 60,
    msDay = msHr * 24,
    msMonth = msDay * 30,
    msYr = msDay * 365;
  let elapsed = curr - prev;

  if (elapsed < msMin) return pluralize(Math.round(elapsed / 1000), "second");
  else if (elapsed < msHr) {
    elapsed = Math.round(elapsed / msMin);
    return pluralize(elapsed, "minute");
  } else if (elapsed < msDay) {
    elapsed = Math.round(elapsed / msHr);
    return pluralize(elapsed, "hour");
  } else if (elapsed < msMonth) {
    elapsed = Math.round(elapsed / msDay);
    return pluralize(elapsed, "day");
  } else if (elapsed < msYr) {
    elapsed = Math.round(elapsed / msMonth);
    return pluralize(elapsed, "month");
  } else {
    elapsed = Math.round(elapsed / msYr);
    return pluralize(elapsed, "year");
  }
};

let now = new Date();

document.querySelectorAll(".post-date").forEach((box) => {
  let parsedTime = Date.parse(box.innerText);
  box.innerText = timePast(now, new Date(parsedTime)) + " ago";
});

// Footer Code
// After Page Load  -->

$(document).ready(function () {
  //Current Jobs
  const jobCounter = $(".job-list").length;
  $(".job-count").text(jobCounter);

  //Load First Accordion
  //  $(".accordion-toggle.open").mouseup();

  // Current Year in Footer
  let currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let currentYearElement = document.getElementById("currentYear");
  currentYearElement.textContent = currentYear;
});
