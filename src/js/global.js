// gsap.registerPlugin(SplitText);
// gsap.registerPlugin(ScrollTrigger);

//HEADER NAVIGATION
const navHeader = document.querySelector(".navbar");

let lastScrollY = 0;

ScrollTrigger.create({
  start: 0, // start tracking from top
  onUpdate: (self) => {
    let currentScroll = self.scroll();
    if (currentScroll > lastScrollY) {
      // scrolling down -> hide header
      gsap.to(navHeader, { y: "-100%", duration: 0.4, ease: "power2.out" });
    } else {
      // scrolling up -> show header
      gsap.to(navHeader, {
        y: "0%",
        duration: 0.4,
        ease: "power2.out",
      });
    }
    lastScrollY = currentScroll;
  },
});

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

window.addEventListener("load", () => {
  // Make sure SplitText is initialized *after* everything is loaded
  const split = new SplitText(headerTitle, { type: "lines" });

  // Set initial visibility
  gsap.set(
    [headerTitle, headerContent, diffTitle, headerImage, projectContent],
    {
      autoAlpha: 1,
    }
  );

  // Create timeline
  const tl = gsap.timeline({
    defaults: { opacity: 0, duration: 0.3, ease: "power4.out" },
    onComplete: () => split.revert(),
  });

  tl.from(split.lines, {
    skewX: 10,
    skewY: -2,
    y: 40,
    opacity: 0,
    stagger: 0.1,
  })
    .from(headerContent, { y: 20, opacity: 0 }, ">")
    .from(headerImage, { y: 30, duration: 0.2 })
    .from(diffTitle, { y: 30, duration: 0.2 })
    .from(projectContent, { y: 30, duration: 0.2 }, "-=0.8");
});

const tl2 = gsap.timeline({
  defaults: { duration: 0.3, ease: "power4.out", opacity: 0 },
  scrollTrigger: {
    trigger: ".section_cta",
    start: "bottom bottom",
    // markers: true,
    toggleActions: "play none none reverse",
  },
});

tl2
  .from(ctaTitle, { y: 100 })
  // .from(ctaPara, { y: 100 }, "-=0.2")
  .from(ctaButton, { y: 100 }, "-=0.2");

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
