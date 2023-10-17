gsap.registerPlugin(ScrollTrigger)
document.addEventListener('DOMContentLoaded', function () {
 heroAnimation()
 revealTextLineByLine()
})

function heroAnimation() {
 window.addEventListener('load', () => {
  const title = gsap.utils.toArray('.hero-text-wrapper')

  gsap.set([title], { opacity: 0, y: 50 })

  const heroTl = gsap.timeline({
   defaults: {
    duration: 1,
    ease: 'power2.out',
   },
  })

  heroTl.to(title, {
   opacity: 1,
   y: 0,
  })
 })

 const heroImage = document.querySelector('.hero-image')
 let heroImgTl = gsap.timeline({ paused: false })
 heroImgTl.to(heroImage, {
  opacity: 0,
  scale: 0.85,
  y: '-15vh',
  transformOrigin: 'center',
  ease: 'none',
 })

 ScrollTrigger.create({
  trigger: heroImage,
  start: 'top top',
  end: 'bottom top',
  animation: heroImgTl,
  scrub: 1,
  invalidateOnRefresh: true,
 })
}
function revealTextLineByLine() {
 const textWrapper = gsap.utils.toArray(['[text-reveal]'])

 new SplitType(textWrapper, {
  tagName: 'span',
  types: 'words, chars',
 })
 textWrapper.forEach((text) => {
  gsap.fromTo(
   text.querySelectorAll('.word'),
   {
    'will-change': 'opacity',
    opacity: 0.1,
   },
   {
    ease: 'none',
    opacity: 1,
    stagger: 0.05,
    scrollTrigger: {
     trigger: text,
     start: 'top bottom-=20%',
     end: 'center top+=40%',
     scrub: true,
    },
   }
  )
 })
}
