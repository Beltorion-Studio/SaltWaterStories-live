gsap.registerPlugin(ScrollTrigger)
document.addEventListener('DOMContentLoaded', function () {
 heroAnimation()
 revealTextLineByLine()
 sliderAnimation()
 cardHover()
 shopSection()
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

function sliderAnimation() {
 const sliderSections = gsap.utils.toArray('.about-us-slider-w')

 sliderSections.forEach((sliderSection) => {
  const arrows = gsap.utils.toArray(sliderSection.querySelectorAll('.about-nav-arrow-w'))
  const prevButton = arrows[0]
  const nextButton = arrows[1]
  const slider = sliderSection.querySelector('.about-slider')
  const gap = 60
  const cards = gsap.utils.toArray(sliderSection.querySelectorAll('.about-card-item'))
  const duration = 1
  const cardWidth = cards[0].offsetWidth + gap
  const sliderWidth = cardWidth * cards.length + gap * (cards.length - 1)
  let currentIndex = 0

  gsap.set(slider, { width: () => `${sliderWidth}px` })
  gsap.set(cards, { alignSelf: 'flex-start' })

  gsap.set(slider, {
   display: 'flex',
   flexDirection: 'row',
   gap: gap + 'px',
  })

  const loop = horizontalLoop(cards, {
   paused: true,
   speed: 0.5,
   paddingRight: gap,
  })

  function setCardAspectRatio(index, aspectRatio) {
   gsap.to(cards[index], { aspectRatio: aspectRatio })
  }
  function setCardText(index, autoAlpha) {
   gsap.to(cards[index].querySelector('.about-card-description'), {
    autoAlpha: autoAlpha,
   })
  }

  nextButton.addEventListener('click', () => {
   loop.next({
    duration: duration,
    ease: 'power2.inOut',
    onStart: () => {
     setCardAspectRatio(currentIndex, '4 / 3')
     setCardText(currentIndex, 1)
    },
    onComplete: () => {
     cards.forEach((card, index) => {
      if (index !== currentIndex) {
       setCardAspectRatio(index, '16 / 9')
       setCardText(index, 0)
      }
     })
    },
   })
   currentIndex = loop.current()
   animateArrow(nextButton, 5)
  })

  prevButton.addEventListener('click', () => {
   loop.previous({
    duration: duration,
    ease: 'power2.inOut',

    onStart: () => {
     setCardAspectRatio(currentIndex, '4 / 3')
     setCardText(currentIndex, 1)
     cards.forEach((card, index) => {
      if (index !== currentIndex) {
       setCardAspectRatio(index, '16 / 9')
       setCardText(index, 0)
      }
     })
    },
   })
   currentIndex = loop.current()
   animateArrow(prevButton, -5)
  })

  function animateArrow(arrow, offset) {
   gsap.to(arrow.children, {
    x: offset,
    duration: duration / 2,
    ease: 'power2.inOut',
    onComplete: () => {
     gsap.to(arrow.children, {
      x: 0,
      duration: duration / 2,
      ease: 'power2.inOut',
     })
    },
   })
  }
 })
}

function cardHover() {
 const cards = gsap.utils.toArray('.stacking-card-overlay')
 cardHoverIn()
 cardHoverOut()

 function cardHoverIn() {
  cards.forEach((card) => {
   card.addEventListener('mouseenter', (e) => {
    e.preventDefault
    let tl = gsap.timeline()
    tl.to(card, {
     autoAlpha: 0,
     ease: 'power1',
     duration: 0.7,
    })
   })
  })
 }

 function cardHoverOut() {
  cards.forEach((card) => {
   card.addEventListener('mouseleave', (e) => {
    e.preventDefault
    let tl = gsap.timeline()
    tl.to(card, {
     autoAlpha: 1,
     ease: 'power1',
     duration: 0.7,
    })
   })
  })
 }
}

function horizontalLoop(items, config) {
 items = gsap.utils.toArray(items)
 config = config || {}
 let tl = gsap.timeline({
   repeat: config.repeat,
   paused: config.paused,
   defaults: { ease: 'none' },
   onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
  }),
  length = items.length,
  startX = items[0].offsetLeft,
  times = [],
  widths = [],
  xPercents = [],
  curIndex = 0,
  pixelsPerSecond = (config.speed || 1) * 100,
  snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1),
  totalWidth,
  curX,
  distanceToStart,
  distanceToLoop,
  item,
  i
 gsap.set(items, {
  xPercent: (i, el) => {
   let w = (widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px')))
   xPercents[i] = snap(
    (parseFloat(gsap.getProperty(el, 'x', 'px')) / w) * 100 + gsap.getProperty(el, 'xPercent')
   )
   return xPercents[i]
  },
 })
 gsap.set(items, { x: 0 })
 totalWidth =
  items[length - 1].offsetLeft +
  (xPercents[length - 1] / 100) * widths[length - 1] -
  startX +
  items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], 'scaleX') +
  (parseFloat(config.paddingRight) || 0)
 for (i = 0; i < length; i++) {
  item = items[i]
  curX = (xPercents[i] / 100) * widths[i]
  distanceToStart = item.offsetLeft + curX - startX
  distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX')
  tl
   .to(
    item,
    {
     xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
     duration: distanceToLoop / pixelsPerSecond,
    },
    0
   )
   .fromTo(
    item,
    {
     xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100),
    },
    {
     xPercent: xPercents[i],
     duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
     immediateRender: false,
    },
    distanceToLoop / pixelsPerSecond
   )
   .add('label' + i, distanceToStart / pixelsPerSecond)
  times[i] = distanceToStart / pixelsPerSecond
 }
 function toIndex(index, vars) {
  vars = vars || {}
  Math.abs(index - curIndex) > length / 2 && (index += index > curIndex ? -length : length) // always go in the shortest direction
  let newIndex = gsap.utils.wrap(0, length, index),
   time = times[newIndex]
  if (time > tl.time() !== index > curIndex) {
   vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) }
   time += tl.duration() * (index > curIndex ? 1 : -1)
  }
  curIndex = newIndex
  vars.overwrite = true
  return tl.tweenTo(time, vars)
 }
 tl.next = (vars) => toIndex(curIndex + 1, vars)
 tl.previous = (vars) => toIndex(curIndex - 1, vars)
 tl.current = () => curIndex
 tl.toIndex = (index, vars) => toIndex(index, vars)
 tl.times = times
 tl.progress(1, true).progress(0, true)
 if (config.reversed) {
  tl.vars.onReverseComplete()
  tl.reverse()
 }
 return tl
}
function stackingCardsSection() {
 const cards = gsap.utils.toArray('.stacking-card-item')
 const cardHeight = cards[0].offsetHeight + 40
 const stackingCardsAnimation = gsap.timeline()
 const minScale = 0.98
 const spacer = 70
 const distributor = gsap.utils.distribute({ base: minScale, amount: 0.1 })
 initCards()

 gsap.set('.stacking-cards-container', {
  height: () => cardHeight + spacer * (cards.length - 1),
 })

 cards.forEach((card) => {
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
  cards.forEach((card, index) => {
   if (index > 0) {
    gsap.set(card, { y: index * cardHeight })
   }
  })
 }

 cards.forEach((card, index) => {
  const scaleVal = distributor(index, cards[index], cards)
  stackingCardsAnimation.to(card, {
   y: index * spacer,
   scale: scaleVal,
   scrollTrigger: {
    trigger: card,
    start: 'top top',
    end: () => `+=${cardHeight}`,
    scrub: 1,
   },
  })
 })

 ScrollTrigger.create({
  trigger: '.stacking-card-section-w',
  start: 'top -10 top',
  pin: true,
  end: () => `+=${cards.length * cardHeight * 1.4}`,
  scrub: 1,
  animation: stackingCardsAnimation,
  invalidateOnRefresh: true,
 })
}
function shopSection() {
 const shopSection = document.querySelector('.horizontal-shop-section')
 const shopGrid = document.querySelector('.shop-grid')
 const shopItemsTab = gsap.utils.toArray('.shop-item-tab')
 const shopCollections = gsap.utils.toArray('.shop-colection-list')
 const shopItems = gsap.utils.toArray('.shop-collection-item')
 const scrollNavigationsLinks = gsap.utils.toArray('.scrollnavigation-link')
 const progressBar = document.querySelector('.timeline-fill')
 const topTabLinksWrapper = document.querySelector('.shop-tabs-w')
 const topTabLinks = gsap.utils.toArray('.shop-tab-title')

 setElements()
 setProjectsItemPosition()

 function getScrollAmount() {
  let allProjectWidth = shopGrid.scrollWidth
  return -allProjectWidth
 }

 setTopTab()

 ScrollTrigger.addEventListener('refreshInit', getScrollAmount)

 let horizontalScrollanimation = gsap.timeline()
 horizontalScrollanimation
  .set(progressBar, { scaleX: 0 })
  .to(topTabLinksWrapper, { autoAlpha: 1 }, '<')
  .fromTo(
   shopGrid,
   { x: () => window.innerWidth - 100 },
   {
    x: getScrollAmount,
    duration: 3,
    ease: 'none',
   },
   '<'
  )

 ScrollTrigger.create({
  trigger: shopSection,
  pin: true,
  scrub: 3,
  start: 'center center',
  end: () => `+=${(getScrollAmount() * -1) / 2}`,
  animation: horizontalScrollanimation,
  onUpdate: (self) => {
   updateProgressBar(self.progress)
   updateActiveLink(self.progress)
   updateActiveTopTabLink(self.progress)
  },
 })

 shopItems.forEach((item) => {
  item.setAttribute('data-mousePointer', 'Scroll')
  gsap.to(item, {
   x: -50,
   ease: 'none',
   scrollTrigger: {
    trigger: item,
    start: 'left 70%',
    end: 'center 20%',
    scrub: 1,
    containerAnimation: horizontalScrollanimation,
   },
  })
 })

 function updateProgressBar(progress) {
  gsap.to(progressBar, { scaleX: progress, ease: 'none' })
 }

 function updateActiveLink(progress) {
  const activeIndex = Math.round(progress * (scrollNavigationsLinks.length - 1))

  scrollNavigationsLinks.forEach((link, index) => {
   if (index === activeIndex) {
    link.classList.add('active')
   } else {
    link.classList.remove('active')
   }
  })
 }

 function updateActiveTopTabLink(progress) {
  const activeIndex = Math.round(progress * (topTabLinks.length - 1))

  console.log(activeIndex)
  gsap.to(topTabLinksWrapper, {
   x: `${activeIndex * -50}vw`,
   ease: 'power2.out',
   duration: 0.4,
  })
  topTabLinks.forEach((link, index) => {
   if (index === activeIndex) {
    gsap.timeline().to(link, { color: 'black', duration: 0.4, ease: 'power2.out' })
   } else {
    gsap.timeline().to(link, {
     color: 'rgba(0, 0, 0, 0.4)',
     duration: 0.4,
     ease: 'power2.out',
    })
   }
  })
 }

 let getPosition = getScrollLookup(shopItemsTab, {
  start: 'left left',
  containerAnimation: horizontalScrollanimation,
 })

 scrollNavigationsLinks.forEach((el) => {
  el.addEventListener('click', (e) => {
   e.preventDefault()
   gsap.to(window, {
    scrollTo: getPosition(el.getAttribute('href')),
    overwrite: 'auto',
    duration: 1,
   })
  })
 })

 topTabLinks.forEach((el) => {
  el.addEventListener('click', (e) => {
   e.preventDefault()
   gsap.to(window, {
    scrollTo: getPosition(el.getAttribute('href')),
    overwrite: 'auto',
    duration: 1,
   })
  })
 })

 function getScrollLookup(targets, { start, pinnedContainer, containerAnimation }) {
  let triggers = gsap.utils.toArray(targets).map((el) =>
    ScrollTrigger.create({
     trigger: el,
     start: start || 'top top',
     pinnedContainer: pinnedContainer,
     refreshPriority: -10,
     containerAnimation: containerAnimation,
    })
   ),
   st = containerAnimation && containerAnimation.scrollTrigger
  return (target) => {
   let t = gsap.utils.toArray(target)[0],
    i = triggers.length
   while (i-- && triggers[i].trigger !== t) {}
   if (i < 0) {
    return console.warn('target not found', target)
   }
   return containerAnimation
    ? st.start + (triggers[i].start / containerAnimation.duration()) * (st.end - st.start)
    : triggers[i].start
  }
 }

 function setElements() {
  shopSection.style.overflowX = 'hidden'
  shopGrid.style.flexDirection = 'row'
  shopCollections.forEach((col) => {
   col.style.flexDirection = 'row'
  })
  topTabLinksWrapper.style.display = 'grid'
 }

 function setTopTab() {
  topTabLinksWrapper.style.gridTemplateColumns = 'repeat(3,45vw)'
  topTabLinksWrapper.style.position = 'absolute'
  topTabLinksWrapper.style.marginLeft = '34vw'
  topTabLinksWrapper.style.width = 'fit-content'
  topTabLinksWrapper.style.justifyItems = 'center'
  topTabLinksWrapper.style.opacity = '0'

  topTabLinks.forEach((item) => {
   item.style.justifySelf = 'center'
   item.style.textAlign = 'center'
  })
 }

 function setProjectsItemPosition() {
  shopItems.forEach((item, index) => {
   const randomX = index % 2 === 0 ? -50 : 0
   gsap.set(item, { x: randomX })
  })
 }
}
