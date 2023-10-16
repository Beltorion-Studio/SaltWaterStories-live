document.addEventListener('DOMContentLoaded', function () {
 let mm = gsap.matchMedia()
 menuAnimation()
 mm.add(
  {
   isDesktop: '(min-width: 991px)',
  },
  (context) => {
   let { isDesktop } = context.conditions
   if (isDesktop) {
    createMouseFollower()
    moveFollower()
   }
  }
 )

 function moveFollower() {
  gsap.set('#mouseFollower', { xPercent: -50, yPercent: -50 })
  let followerAnimation = gsap.timeline({ paused: true, overwrite: 'auto' })

  const mousePointer = document.querySelector('#mouseFollower')
  const mouseHoverSections = gsap.utils.toArray('[data-mousePointer]')

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const mouse = { x: pos.x, y: pos.y }
  const speed = 0.2

  const xSet = gsap.quickSetter(mousePointer, 'x', 'px')
  const ySet = gsap.quickSetter(mousePointer, 'y', 'px')

  window.addEventListener('mousemove', (e) => {
   mouse.x = e.x
   mouse.y = e.y
  })

  gsap.ticker.add(() => {
   const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio())
   pos.x += (mouse.x - pos.x) * dt
   pos.y += (mouse.y - pos.y) * dt
   xSet(pos.x)
   ySet(pos.y)
  })

  followerAnimation.to(mousePointer, {
   scale: 3,
   backgroundColor: 'rgba(255, 255, 255, 0.44)',
   backdropFilter: 'blur(10px)',
   ease: 'power2.inOut',
   mixBlendMode: 'normal',
  })

  mouseHoverSections.forEach((section) => {
   let pointertext = section.dataset.mousepointer
   section.addEventListener('mouseenter', (e) => {
    animateFollower('in', pointertext)
    section.addEventListener('mouseleave', (e) => {
     animateFollower('out')
    })
   })
  })

  function animateFollower(direction, pointertext) {
   if (direction == 'in') {
    mousePointer.setAttribute('data-before', pointertext)
    followerAnimation.play().timeScale(1)
   }
   if (direction == 'out') {
    mousePointer.setAttribute('data-before', '')
    followerAnimation.timeScale(-2)
   }
  }
 }
})
function createMouseFollower() {
 const div = document.createElement('div')
 div.id = 'mouseFollower'
 document.body.appendChild(div)
}
function menuAnimation() {
 const mainNav = document.querySelector('.main-nav')
 const menuBtn = document.querySelector('.menu-btn-w')
 const menuWrapper = document.querySelector('.nav-menu-w')
 const wave = document.querySelector('.main-nav-wave-w')
 const menuCloseBtn = document.querySelector('.menu-close-btn')
 const menuText = document.querySelector('.menu-btn-text')

 const navbarTl = gsap.timeline({ paused: true })
 navbarTl
  .to(wave, {
   autoAlpha: 0,
  })
  .to(mainNav, { height: '6vh' })

 ScrollTrigger.create({
  trigger: mainNav,
  animation: navbarTl,
  start: () => 'top+=200',
  end: () => 'top+=500',
  scrub: true,
  invalidateOnRefresh: true,
 })

 gsap.set(menuBtn, { zIndex: 100 })
 const menuTl = gsap.timeline({ paused: true })
 const menuBtnTl = gsap.timeline({ paused: true })

 menuTl
  .to(menuWrapper, {
   display: 'flex',
   autoAlpha: 1,
   xPercent: 0,
   duration: 0.6,
   ease: Power1.easeOut,
  })
  .to(menuBtn, { color: 'black' }, '<')
  .to(menuText, { autoAlpha: 0, display: 'none' }, '<')
  .to(menuCloseBtn, { autoAlpha: 1, display: 'flex' }, '<')

 gsap.set(menuWrapper, { autoAlpha: 0, xPercent: 100 })

 menuBtn.addEventListener('pointerdown', () => {
  if (menuTl.reversed() || menuTl.paused()) {
   menuTl.play()
  } else {
   menuTl.reverse()
  }
 })
}
