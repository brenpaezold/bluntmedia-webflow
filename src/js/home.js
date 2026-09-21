// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

gsap.set(".background-video", { autoAlpha: 1 });
let mm = gsap.matchMedia();

// Re-measure every ScrollTrigger once the page stops moving. ScrollTrigger
// refreshes on `load` by default, but the webfont swap and the lazy images
// below the fold both land after that, and each one shifts the sections that
// the #offerings pins are measured against.
const refreshScrollTriggers = debounce(() => ScrollTrigger.refresh(), 150);

window.addEventListener("load", refreshScrollTriggers);

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(refreshScrollTriggers);
}

// The two things that actually move this page after the triggers are built.
// Both fire as ordinary events, independent of whether the tab is rendering.
//
// Lazy images are the big one: the card artwork and the logo strip above it
// carry no width/height attributes, so every image that decodes resizes its
// container and shifts everything below it.
document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
  if (img.complete) return;
  img.addEventListener("load", refreshScrollTriggers, { once: true });
  img.addEventListener("error", refreshScrollTriggers, { once: true });
});

// Catch-all for anything the two hooks above miss (Webflow interactions,
// content injected later). ResizeObserver only delivers while the page is
// rendering, so it supplements the explicit hooks rather than replacing them.
if (typeof ResizeObserver !== "undefined") {
  let lastHeight = document.documentElement.scrollHeight;

  new ResizeObserver(() => {
    const height = document.documentElement.scrollHeight;
    // Ignore no-op callbacks, including any caused by our own refresh; the
    // height settles after one cycle so this cannot loop.
    if (Math.abs(height - lastHeight) < 2) return;
    lastHeight = height;
    refreshScrollTriggers();
  }).observe(document.body);
}

// Home Header Animation

mm.add("(min-width: 800px)", () => {
  let heroVideo = gsap.timeline({
    defaults: { duration: 0.1, ease: "power4.InOut" },
    scrollTrigger: {
      trigger: ".media-container",
      start: "top 50%",
      end: "top 25%",
      scrub: 0.5,
      //   pin: true,
      //   markers: true,
    },
  });
  heroVideo.fromTo(".background-video", { scale: 0.8 }, { scale: 1 });
});

gsap.from(".background-video", { delay: 0.1, y: 100, opacity: 0 });

// Accordion animations

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#services");
  const accordions = document.querySelectorAll(".accordion-toggle");
  let activeAccordion = null; // Track the currently open accordion

  function closeAllAccordions(except = null) {
    document.querySelectorAll(".accordion-content").forEach((content) => {
      if (content !== except) {
        gsap.to(content, {
          opacity: 0,
          height: 0,
          duration: 0.2,
          onComplete: () => (content.style.display = "none"),
        });
        content.previousElementSibling.setAttribute("aria-expanded", "false");
      }
    });
  }

  function openAccordion(toggle, content) {
    if (activeAccordion === content) return; // Prevent unnecessary re-closing

    closeAllAccordions(content);
    content.style.display = "block";
    gsap.fromTo(
      content,
      { opacity: 0, height: 0 },
      { opacity: 1, height: "auto", duration: 0.2, ease: "power4.out" }
    );
    toggle.setAttribute("aria-expanded", "true");
    activeAccordion = content; // Set the currently open accordion

    // Opening/closing a panel changes the page height above #offerings, which
    // moves the pinned cards. Re-measure once the 0.2s height tween has run.
    gsap.delayedCall(0.25, refreshScrollTriggers);
  }

  // Automatically open the first accordion when #services is in view
  ScrollTrigger.create({
    trigger: section,
    start: "top 35%",
    // markers: true,
    onEnter: () => {
      if (!activeAccordion) {
        const firstToggle = document.querySelector("#toggle-1");
        const firstContent = document.querySelector("#drop-list-1");

        openAccordion(firstToggle, firstContent);

        // Add w--open class when it initially opens
        firstContent.classList.add("w--open");
      }
    },
  });

  // Add click event to toggle accordions
  accordions.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      const content = event.currentTarget.nextElementSibling;
      openAccordion(event.currentTarget, content);
    });
  });
});

// Vertical stacking scroll with scale-down effect
//
// Each card pins so it sticks just under the previous one. Two things used to
// break that, and both showed up as "the card sails past its stick point, then
// snaps into place once the next one arrives":
//
//   1. ScrollTrigger measures start/end ONCE, when the trigger is created. This
//      file runs at the end of <body>, before webfonts swap and before the lazy
//      images above #offerings decode, so on a cold load every measurement is
//      taken against a layout that is still moving. Nothing refreshed them
//      afterwards, so the pins stayed bound to positions that no longer existed
//      -- measured at ~1300px of drift on a 1680px viewport.
//
//      It hid on warm loads (everything cached, layout already final) and below
//      1140px, where a style embed gives the cards a fixed 780px height so the
//      page stops being content-sized. Hence "usually at wider breakpoints".
//
//   2. Toggling an accordion in #services changes the page height ABOVE the
//      cards, which moves them again at runtime. Same stale-measurement result.
//
// The cure for both is to re-measure after anything that moves the page, so
// refreshScrollTriggers() below is called from the accordion and from the
// load/font/lazy-image settle points.

const CARD_SELECTOR = ".helping-cta-card";
const pinStartBase = 15;
const pinStartStep = 2.5;

// The cards unpin against whatever section follows #offerings. The old code
// used "section:last-of-type", which is scoped per-parent rather than to the
// document -- it happened to resolve to the CTA section, but would silently
// pick a different element if the page structure ever changed.
function offeringsEndTrigger() {
  const offerings = document.querySelector("#offerings");
  return (
    (offerings && offerings.nextElementSibling &&
      offerings.nextElementSibling.closest("section")) ||
    document.querySelector("section.section_cta") ||
    "#offerings"
  );
}

// gsap.matchMedia() replaces the old resize listener + manual kill loop: it
// builds the triggers when the query matches, and on the way out reverts the
// pin markup and inline styles and refreshes, which the hand-rolled version
// did not do reliably.
mm.add("(min-width: 601px)", () => {
  const cards = gsap.utils.toArray(CARD_SELECTOR);
  if (!cards.length) return;

  gsap.set(cards, { position: "relative", transformOrigin: "top center" });

  const endTrigger = offeringsEndTrigger();

  cards.forEach((card, index) => {
    gsap.set(card, { zIndex: index + 1, scale: 1 });

    ScrollTrigger.create({
      trigger: card,
      start: `top ${pinStartBase + index * pinStartStep}%`,
      endTrigger,
      end: "top bottom",
      pin: true,
      pinSpacing: false,
      scrub: 1,
      // Recompute the start/end and the tween on every refresh rather than
      // reusing the values captured at creation time.
      invalidateOnRefresh: true,
      animation: gsap.to(card, { scale: 0.9 + index * 0.05, ease: "none" }),
    });
  });

  return () => gsap.set(cards, { clearProps: "zIndex,scale,position,transformOrigin" });
});

function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// (The old `resize` -> initCardScroll listener lived here. gsap.matchMedia()
// now owns building and tearing down the card triggers across breakpoints, and
// ScrollTrigger re-measures on resize by default, so it was both redundant and
// -- once initCardScroll was removed -- a ReferenceError on every resize.)

// // Horizontal scroll when in view

// let horizontalSections = gsap.utils.toArray(".service-cta-list");
// // let mm = gsap.matchMedia()

// horizontalSections.forEach((container) => {
//   let sections = container.querySelectorAll(".cta-card");

//   mm.add("(min-width: 768px)", () => {
//     gsap.to(sections, {
//       xPercent: -100 * (sections.length - 1),
//       ease: "power1.inOut",
//       scrollTrigger: {
//         trigger: "#offerings",
//         start: "50% 50%",
//         // base vertical scrolling on how wide the container is so it feels more natural.
//         // end: "+=3000",
//         // markers: true,
//         pin: true,
//         scrub: 1,
//         // 👇 Add snapping here
//         // snap: {
//         //   snapTo: 1 / (sections.length - 1), // snap to each section
//         //   duration: { min: 0.1, max: 0.2 }, // smooth snapping
//         //   ease: "power1.inOut",
//         // },
//       },
//     });
//   });
// });

// Horizontal scroll when in view

// horizontalSections.forEach((container) => {
//   let sections = container.querySelectorAll(".cta-card");

//   mm.add("(min-width: 768px)", () => {
//     gsap.to(sections, {
//       xPercent: -100 * (sections.length - 1),
//       ease: "power1.inOut",
//       scrollTrigger: {
//         trigger: ".service-cta-list",
//         start: "center 50%",
//         // base vertical scrolling on how wide the container is so it feels more natural.
//         end: "+=3000",
//         markers: true,
//         pin: true,
//         scrub: 1,
//         // 👇 Fixed snapping to center each card
//         snap: {
//           snapTo: (value) => {
//             // Create snap points for each card to be centered
//             let snapPoints = [];
//             for (let i = 0; i < sections.length; i++) {
//               snapPoints.push(i / (sections.length - 1));
//             }
//             return snapPoints;
//           },
//           duration: { min: 0.2, max: 0.6 }, // smooth snapping
//           ease: "power1.inOut",
//         },
//       },
//     });
//   });
// });

//FROM HOME SETTINGS

// ------ HEADER CHANGE
// ------ Dynamic on 100vh

// $(window).on('scroll', function () {
//   var $win = $(window);
//   var winH = $win.height();

//   if ($(window).scrollTop() > winH) {
//     $('.navbar').addClass('active');
//   } else {
//     //remove the background property so it comes transparent again (defined in your css)
//     $('.navbar').removeClass('active');
//   }
// });

//when page load function
// $(document).ready(function () {
//   //dropdown active state on page load
//   $("#toggle-1").addClass("w--open");
//   $("#drop-list-1").addClass("w--open");

//   //trigger first to remove open state classes
//   $(".accordion-dropdown").on("click", function () {
//     $("#toggle-1").removeClass("w--open");
//     $("#drop-list-1").removeClass("w--open");
//   });
//when page load function end
// });

/*------ HEADER CHANGE -----*/
// window.addEventListener('scroll', function () {
//   var winH = window.innerHeight;

//   if (window.scrollY > winH) {
//     document.querySelector('.navbar').classList.add('active');
//   } else {
//     document.querySelector('.navbar').classList.remove('active');
//   }
// });
