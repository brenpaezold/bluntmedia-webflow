// gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

// --- Desktop (≥ 600px): horizontal scroll with elastic ease ---
mm.add("(min-width: 600px)", () => {
  const bubbles = gsap.utils.toArray(".speech-bubble");
  const timelines = bubbles.map((bubble) => {
    const heading = bubble.querySelector(".bubble-heading");
    const content = bubble.querySelector(".bubble-content");
    const botImg = bubble.querySelector(".bubble-image");

    gsap.set(content, { height: 0, opacity: 0, overflow: "hidden" });

    return gsap
      .timeline({ paused: true })
      .to(content, {
        autoAlpha: 1,
        height: "auto",
        opacity: 1,
        duration: 1.5,
        ease: "elastic.out(1,0.3)", // desktop expressive ease
      })
      .to(
        heading,
        {
          position: "absolute",
          x: 0,
          y: -80,
          transformOrigin: "0% 0%",
          scale: 0.5,
          duration: 0.2,
          ease: "power2.out",
        },
        0
      )
      .to(
        botImg,
        {
          opacity: 1,
          y: -30,
          duration: 0.2,
          ease: "power2.out",
        },
        0
      );
  });

  const sections = gsap.utils.toArray(".speech-bubble");
  const scrollTween = gsap.to(sections, {
    xPercent: -200 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: "#difference",
      start: "bottom bottom",
      end: "+=3000",
      pin: true,
      scrub: 1,
      // markers: true,
    },
  });

  bubbles.forEach((bubble, i) => {
    const tl = timelines[i];
    const isLast = i === bubbles.length - 1;

    ScrollTrigger.create({
      trigger: bubble,
      start: "left 50%",
      endTrigger: bubbles[i + 1] || bubble,
      end: bubbles[i + 1] ? "left 50%" : "right 50%",
      containerAnimation: scrollTween,
      onEnter: () => tl.play(),
      // onEnterBack: () => tl.play(),
      // onLeave: () => {
      //   if (!isLast) tl.reverse();
      // },
      // onLeaveBack: () => tl.reverse(),
    });
  });
});

// --- Mobile (< 600px): vertical scroll with smooth ease ---
mm.add("(max-width: 599px)", () => {
  const bubbles = gsap.utils.toArray(".speech-bubble");
  const timelines = bubbles.map((bubble) => {
    const heading = bubble.querySelector(".bubble-heading");
    const content = bubble.querySelector(".bubble-content");
    const botImg = bubble.querySelector(".bubble-image");

    gsap.set(content, {
      scaleY: 0,
      opacity: 0,
      transformOrigin: "bottom center",
    });

    return gsap
      .timeline({ paused: true })
      .to(content, {
        autoAlpha: 1,
        height: "auto",
        scaleY: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out", // smooth mobile ease
      })
      .to(
        heading,
        {
          position: "absolute",
          x: 0,
          y: -60,
          transformOrigin: "0% 0%",
          scale: 0.7,
          duration: 0.2,
          ease: "power2.out",
        },
        0
      )
      .to(
        botImg,
        {
          opacity: 1,
          y: -20,
          duration: 0.2,
          ease: "power2.out",
        },
        0
      );
  });

  // Vertical scroll triggers
  bubbles.forEach((bubble, i) => {
    const tl = timelines[i];
    const triggerEl = bubble.querySelector(".bubble-image");

    ScrollTrigger.create({
      trigger: triggerEl,
      start: "bottom bottom",
      onEnter: () => tl.play(),
      onLeaveBack: () => tl.reverse(),
      // markers: true,
    });
  });
});

// 4) OPTIONAL: If you still want hover to override while stationary scrolling,
// you can keep this, but it's not required. It won't fight ScrollTrigger
// because ST will just re-fire on the next position change.
/*
bubbles.forEach((bubble, i) => {
  const tl = timelines[i];
  bubble.addEventListener("mouseenter", () => tl.play());
  bubble.addEventListener("mouseleave", () => tl.reverse());
});
*/

// ARCHIVED
// With Autoplay

// const bubbles = gsap.utils.toArray(".speech-bubble");
// const timelines = [];
// let autoplayTimeout;
// let resumeTimeout;
// let currentIndex = 0;
// let isAutoplaying = true;

// // Create timelines for each bubble
// bubbles.forEach((bubble) => {
//   let heading = bubble.querySelector(".bubble-heading");
//   let content = bubble.querySelector(".bubble-content");
//   let botImg = bubble.querySelector(".bubble-image");

//   gsap.set(content, { height: 0, opacity: 0, overflow: "hidden" });

//   let tl = gsap
//     .timeline({ paused: true })
//     .to(content, {
//       autoAlpha: 1,
//       height: "auto",
//       opacity: 1,
//       duration: 1.5,
//       ease: "elastic.out(1,0.3)",
//     })
//     .to(
//       heading,
//       {
//         position: "absolute",
//         x: 0,
//         y: -80,
//         transformOrigin: "0% 0%",
//         scale: 0.5,
//         // color: "#FFF",
//         // opacity: 0.5,
//         duration: 0.2,
//         ease: "power2.out",
//       },
//       0
//     )
//     .to(
//       botImg,
//       {
//         opacity: 1,
//         y: -30,
//         duration: 0.2,
//         ease: "power2.out",
//       },
//       0
//     );

//   timelines.push(tl);

//   // Hover handling
//   bubble.addEventListener("mouseenter", () => {
//     stopAutoplay(); // stop autoplay loop immediately

//     // Close all other bubbles
//     timelines.forEach((otherTl) => {
//       if (otherTl !== tl) otherTl.reverse();
//     });

//     tl.play(); // open hovered bubble
//   });

//   bubble.addEventListener("mouseleave", () => {
//     tl.reverse(); // close hovered bubble

//     // Resume autoplay after 5s
//     clearTimeout(resumeTimeout);
//     resumeTimeout = setTimeout(() => {
//       isAutoplaying = true;
//       autoplayLoop();
//     }, 5000);
//   });
// });

// // Autoplay loop
// function autoplayLoop() {
//   if (!isAutoplaying) return;

//   let tl = timelines[currentIndex];

//   tl.play();

//   autoplayTimeout = setTimeout(() => {
//     tl.reverse(); // close after 4s

//     currentIndex = (currentIndex + 1) % timelines.length; // next bubble
//     autoplayTimeout = setTimeout(autoplayLoop, 1500); // small delay before next open
//   }, 4000); // keep open for 4s
// }

// // Stop autoplay
// function stopAutoplay() {
//   isAutoplaying = false;
//   clearTimeout(autoplayTimeout);
// }

// // Start autoplay
// autoplayLoop();

// // --- create horizontal scroll
// let sections = gsap.utils.toArray(".speech-bubble");

// gsap.to(sections, {
//   xPercent: -200 * (sections.length - 1), // shift horizontally
//   ease: "power2.out",
//   scrollTrigger: {
//     trigger: "#difference",
//     start: "bottom bottom",
//     end: "+=3000",
//     pin: true,
//     scrub: 1,
//     // snap: 1 / (sections.length - 1), // snapping between bubbles
//     // end: () => "+=" + document.querySelector(".bubble-wrapper").offsetWidth
//     markers: true,
//   },
// });

///

// gsap.registerPlugin(ScrollTrigger);

// // 1) Build timelines for each bubble (paused by default)
// const bubbles = gsap.utils.toArray(".speech-bubble");
// const timelines = bubbles.map((bubble) => {
//   const heading = bubble.querySelector(".bubble-heading");
//   const content = bubble.querySelector(".bubble-content");
//   const botImg = bubble.querySelector(".bubble-image");

//   gsap.set(content, { height: 0, opacity: 0, overflow: "hidden" });

//   return gsap
//     .timeline({ paused: true })
//     .to(content, {
//       autoAlpha: 1,
//       height: "auto",
//       opacity: 1,
//       duration: 1.5,
//       ease: "elastic.out(1,0.3)",
//     })
//     .to(
//       heading,
//       {
//         position: "absolute",
//         x: 0,
//         y: -80,
//         transformOrigin: "0% 0%",
//         scale: 0.5,
//         duration: 0.2,
//         ease: "power2.out",
//       },
//       0
//     )
//     .to(
//       botImg,
//       {
//         opacity: 1,
//         y: -30,
//         duration: 0.2,
//         ease: "power2.out",
//       },
//       0
//     );
// });

// // 2) Create the horizontal scroll tween (pin + scrub)
// const sections = gsap.utils.toArray(".speech-bubble");

// // IMPORTANT: keep a reference to this tween so we can use `containerAnimation`
// const scrollTween = gsap.to(sections, {
//   xPercent: -200 * (sections.length - 1), // your original distance
//   ease: "none",
//   scrollTrigger: {
//     trigger: "#difference",
//     start: "bottom bottom",
//     end: "+=3000",
//     pin: true,
//     scrub: 1,
//     // markers: true, // turn off when done debugging
//   },
// });

// // 3) Tie each bubble’s timeline to its horizontal position.
// // Open when the bubble’s LEFT edge hits 50% of the viewport.
// // Close when it leaves that band (both directions). Last bubble stays open.

// bubbles.forEach((bubble, i) => {
//   const tl = timelines[i];
//   const isLast = i === bubbles.length - 1;

//   ScrollTrigger.create({
//     trigger: bubble,
//     start: "left 50%",
//     endTrigger: bubbles[i + 1] || bubble,
//     end: bubbles[i + 1] ? "left 50%" : "right 50%",
//     containerAnimation: scrollTween,

//     // Entering this bubble (forward or backward): open it
//     onEnter: () => tl.play(),
//     onEnterBack: () => tl.play(),

//     // Leaving this bubble forward:
//     // - normal bubbles close
//     // - the LAST bubble stays open (do nothing)
//     onLeave: () => {
//       if (!isLast) tl.reverse();
//     },

//     // Leaving this bubble backward (scrolling up past its start): always close
//     onLeaveBack: () => tl.reverse(),
//     // markers: true,
//   });
// });
