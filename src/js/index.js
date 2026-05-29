gsap.registerPlugin(SplitText);

// const myText = new SplitType('#my-text');

// gsap.to('.char', {
//   y: 0,
//   stagger: 0.05,
//   delay: 0.2,
//   duration: 0.1,
// });

let split = SplitText.create(".split", { type: "words, chars" });

// const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5, yoyo: true });
// tl.from(".lineChild", { y: 50, stagger: 0.25 });
