// gsap.registerPlugin(ScrollTrigger);

gsap.set(".project-card", { autoAlpha: 1 });

let projectCards = gsap.utils.toArray(".project-card");

// 1) Intro animation for first two cards on load
projectCards.slice(0, 2).forEach((card) => {
  gsap.from(card, {
    y: 20,
    backgroundPosition: "50% 0%",
    opacity: 0,
    scale: 0.9,
    duration: 0.3,
    delay: 1,
  });
});

// 2) Scroll animations for the rest (from index 2 onwards)
projectCards.slice(2).forEach((card) => {
  gsap.from(card, {
    y: 20,
    backgroundPosition: "50% 0%",
    opacity: 0,
    scale: 0.9,
    duration: 0.3,
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
    },
  });
});

//Goals

gsap.set(".goal-item", { autoAlpha: 1 });

let goalItems = gsap.utils.toArray(".goal-item");
gsap.from(goalItems, {
  y: 50,
  backgroundPosition: "50% 0%",
  opacity: 0,
  duration: 0.3,
  stagger: 0.1,
  scrollTrigger: {
    trigger: ".section_goals",
    start: "top 50%",
    toggleActions: "play none none reverse",
  },
});

// gsap.to(".blob", {
//   opacity: 0,
//   ease: "power2.out",
//   scrollTrigger: {
//     trigger: "main", // or your main content container
//     start: "bottom bottom", // when bottom of main hits bottom of viewport
//     toggleActions: "play none none reverse", // fade back in on scroll up
//   },
// });

var Webflow = Webflow || [];
Webflow.push(function () {
  const $current = $("#post_list .w--current").parent();
  const $next = $current.next();
  const $prev = $current.prev();

  // Get hrefs and titles
  const next_href = $next.find("a").attr("href");
  const prev_href = $prev.find("a").attr("href");
  const next_title = $next.find("a").text();
  const prev_title = $prev.find("a").text();

  // Handle NEXT
  if (next_href) {
    $("#next_button").attr("href", next_href);
    $("#next_title").text(next_title);
  } else {
    $(".project-link.next").hide();
  }

  // Handle PREVIOUS
  if (prev_href) {
    $("#previous_button").attr("href", prev_href);
    $("#previous_title").text(prev_title);
  } else {
    $(".project-link.previous").hide();
  }
});
