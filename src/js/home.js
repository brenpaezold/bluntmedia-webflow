// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

gsap.set(".background-video", { autoAlpha: 1 });
let mm = gsap.matchMedia();

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

const cards = gsap.utils.toArray(".helping-cta-card");
const pinStartBase = 15;
const pinStartStep = 2.5;

gsap.set(cards, {
  position: "relative",
  transformOrigin: "top center",
});

// Only activate ScrollTriggers above 600px
function initCardScroll() {
  // Kill any existing ones first (safety)
  ScrollTrigger.getAll().forEach((t) => {
    if (cards.includes(t.trigger)) t.kill();
  });

  // Skip ScrollTriggers entirely on mobile
  if (window.innerWidth <= 600) return;

  // Otherwise, create them
  cards.forEach((card, index) => {
    const startOffset = `${pinStartBase + index * pinStartStep}%`;
    const targetScale = 0.9 + index * 0.05;

    gsap.set(card, { zIndex: index + 1, scale: 1 });

    ScrollTrigger.create({
      trigger: card,
      start: `top ${startOffset}`,
      endTrigger: "section:last-of-type",
      end: "top bottom",
      pin: true,
      pinSpacing: false,
      animation: gsap.to(card, { scale: targetScale, ease: "none" }),
      scrub: 1,
    });
  });
}

// Run on load
initCardScroll();

// Optional: re-init on resize (debounced)
// window.addEventListener("resize", gsap.utils.debounce(initCardScroll, 300));
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

window.addEventListener("resize", debounce(initCardScroll, 300));

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
