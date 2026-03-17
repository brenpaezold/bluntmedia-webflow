// gsap.registerPlugin(ScrollTrigger);

let banners = document.querySelectorAll(".service-section");

addEventListener("DOMContentLoaded", (event) => {
  gsap.set(".service-section", { autoAlpha: 1 });
});

banners.forEach((element) => {
  let background = element.querySelector(".service-image");
  let headings = element.querySelectorAll(".main-content");

  let servicetl = gsap
    .timeline()
    .from(background, {
      y: 20,
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      ease: "power2.out",
    })
    .from(
      headings,
      {
        y: 20,
        opacity: 0,
        stagger: 0.15,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.3"
    ); // overlaps with image animation by 0.3s

  ScrollTrigger.create({
    trigger: element,
    start: "top 50%", // triggers when top of element hits 50% of viewport
    toggleActions: "play none none none",
    animation: servicetl,
  });
});
