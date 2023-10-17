;(function () {
 const projectDetailsWrapper = document.querySelector('.glass-effect')
 gsap.set(projectDetailsWrapper, { opacity: 0, xPercent: 100 })
 const heroImg = document.querySelector('.study-hero-img-w')
 const stackingCards = gsap.utils.toArray(['.stacking-card'])
 const stackingCardsAnimation = gsap.timeline()

 function loadingAnimation() {
  gsap.timeline().to(heroImg, { scale: 1.15, duration: 5, ease: 'back' }).to(
   projectDetailsWrapper,
   {
    opacity: 1,
    xPercent: 0,
    ease: 'none',
    duration: 1.7,
    ease: 'Power2.easeOut',
   },
   '<30%'
  )
 }

 function cardAnimation() {
  let cardHeight
  gsap.set('.cs-stacking-cards-w', { position: 'relative' })
  stackingCards.forEach((card) => {
   gsap.set(card, {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
   })
  })

  function initCards() {
   stackingCardsAnimation.clear()
   cardHeight = stackingCards[0].offsetHeight + 40

   stackingCards.forEach((card, index) => {
    if (index > 0) {
     //increment y value of each card by cardHeight
     gsap.set(card, { y: index * cardHeight })
     //animate each card back to 0 (for stacking)
     stackingCardsAnimation.to(card, { y: 0 + index, duration: index, ease: 'none' }, 0)
    }
   })
  }
  initCards()

  ScrollTrigger.create({
   trigger: '#card-trigger',
   start: 'top top',
   pin: true,
   end: () => `+=${stackingCards.length * cardHeight + 2000}`,

   scrub: 1,
   animation: stackingCardsAnimation,
   //markers: true,
   invalidateOnRefresh: true,
  })
 }

 function devicesAnimation() {
  const devicesTl = gsap.timeline()
  const container = document.querySelector('.mobile-w')

  const iphoneHorizontal = document.querySelector('.ipone-horizontal')
  const iphoneVertical = document.querySelector('.iphone-vertical')
  const ipadHorizontal = document.querySelector('.ipad-horizontal')
  const iphoneHorizontalTwo = document.querySelector('.iphone-vertical-2')

  const containerRect = container.getBoundingClientRect()
  const iphoneHorizontalRect = iphoneHorizontal.getBoundingClientRect()
  const iphoneVerticalRect = iphoneVertical.getBoundingClientRect()
  const ipadHorizontalRect = ipadHorizontal.getBoundingClientRect()
  const iphoneHorizontalTwoRect = iphoneHorizontalTwo.getBoundingClientRect()

  devicesTl
   .to(iphoneHorizontal, {
    x: () => (iphoneHorizontalRect.width - containerRect.width) * -1,
   })
   .to(iphoneVertical, { y: () => containerRect.bottom - iphoneVerticalRect.bottom }, '<')
   .to(ipadHorizontal, { x: () => ipadHorizontalRect.width - containerRect.width }, '<')
   .to(iphoneHorizontalTwo, { y: () => iphoneHorizontalTwoRect.height - containerRect.height }, '<')

  ScrollTrigger.create({
   trigger: '#webdesign',
   start: 'top top',
   end: () => `2000px`,
   pin: true,
   scrub: 1,
   animation: devicesTl,
   markers: true,
   invalidateOnRefresh: true,
  })
 }

 function debounce(func, wait) {
  let timeout
  return function () {
   const context = this
   const args = arguments
   clearTimeout(timeout)
   timeout = setTimeout(() => {
    func.apply(context, args)
   }, wait)
  }
 }

 document.addEventListener('DOMContentLoaded', function () {
  loadingAnimation()
  startAnimation()
  devicesAnimation()
 })

 function startAnimation() {
  if (window.innerWidth > 768) {
   cardAnimation()
  }
 }
})()
