gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
document.addEventListener('DOMContentLoaded', function () {
 heroAnimation()
 revealTextLineByLine()
 stackingCardsSection()
 nonProfitSection()
 methodologySection()
 webPresenceSection()
 faqAnimation()
 brandSection()
 allProjectsSection()
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
  cardHoverIn(card)
  cardHoverOut(card)
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

 function cardHoverIn(card) {
  card.addEventListener('mouseenter', (e) => {
   e.preventDefault
   let tl = gsap.timeline()
   tl.to(card.querySelector('.stacking-card-overlay'), {
    autoAlpha: 0,
    ease: 'power1',
    duration: 0.7,
   })
  })
 }

 function cardHoverOut(card) {
  card.addEventListener('mouseleave', (e) => {
   e.preventDefault
   let tl = gsap.timeline()
   tl.to(card.querySelector('.stacking-card-overlay'), {
    autoAlpha: 1,
    ease: 'power1',
    duration: 0.7,
   })
  })
 }
}
function nonProfitSection() {
 const nonprofitWrapper = document.querySelector('.nonprofit-list-w')
 const nonprofitList = document.querySelector('.nonprofit-list')
 const eyeWrapper = document.querySelector('.eye-w')
 const eyeBall = document.querySelector('.eye-ball')
 const nonprofitItems = gsap.utils.toArray('.nonprofit-list .nonprofit-items-w')
 const hoverOverlay = gsap.utils.toArray('.nonprofit-items-w .nonprofit-hover')

 gsap.set(hoverOverlay, {
  autoAlpha: 0,
 })

 function handleResize() {
  if (window.matchMedia('(min-width: 768px)').matches) {
   setElments()
   nonprofitWrapper.addEventListener('pointermove', mouseMoveFunction)
  }
 }
 window.addEventListener('resize', handleResize)
 handleResize()
 nonprofitItems.forEach((item, index) => {
  itemHoverIn(item, index)
  itemHoverOut(item)
 })

 function mouseMoveFunction(event) {
  const maxX = gsap.getProperty(nonprofitList, 'width') * 0.75
  const eyeWrapperWidth = gsap.getProperty(eyeWrapper, 'width') * 0.85

  const percent = gsap.utils.normalize(0, innerWidth, event.pageX)

  const timeline = gsap.timeline()

  timeline
   .to(nonprofitList, {
    duration: 0.2,
    x: -(percent * maxX - maxX / 2),
    overwrite: true,
   })
   .to(
    eyeBall,
    {
     duration: 0.2,
     x: -(percent * eyeWrapperWidth - eyeWrapperWidth / 2),
     overwrite: true,
    },
    0
   )
 }

 function setElments() {
  nonprofitWrapper
  let nonprofitWrapperWidth = nonprofitItems.length * nonprofitItems[0].offsetWidth
  nonprofitWrapper.style.width = `${nonprofitWrapperWidth}px`
  nonprofitList.style.flexFlow = 'nowrap'
 }

 function itemHoverIn(item, index) {
  item.addEventListener('pointerenter', (e) => {
   e.preventDefault()
   let tl = gsap.timeline()
   tl
    .to(item.querySelector('.nonprofit-hover'), { autoAlpha: 1 })
    .to(item.querySelector('.nonprofit-img'), { scale: 1 }, '<')
  })
 }

 function itemHoverOut(item) {
  item.addEventListener('pointerleave', (e) => {
   e.preventDefault()
   let tl = gsap.timeline()
   tl
    .to(item.querySelector('.nonprofit-hover'), { autoAlpha: 0 })
    .to(item.querySelector('.nonprofit-img'), { scale: 1.2 }, '<')
  })
 }
}

function methodologySection() {
 let mm = gsap.matchMedia()
 const methodologyRightCards = gsap.utils.toArray('.methodology-right .methodology-card')

 mm.add(
  {
   isDesktop: '(min-width: 991px)',
  },
  (context) => {
   let { isDesktop } = context.conditions
   gsap.set(methodologyRightCards, { opacity: 0.4, scale: 0.95 })
   ScrollTrigger.create({
    trigger: '.methodology-section',
    pin: isDesktop ? '.methodology-sticky-w' : false,
    scrub: 1,
    start: 'top top',
    end: 'bottom 90%',
   })
  }
 )

 methodologyRightCards.forEach((card, index) => {
  const methodologyCardAnimation = gsap.to(card, {
   opacity: 1,
   scale: 1.05,
   ease: 'power1.inOut',
   duration: 0.5,
  })

  const triggerOptions = {
   trigger: card,
   start: 'top 60%',
   invalidateOnRefresh: true,
   toggleActions: 'play reverse play reverse',
   animation: methodologyCardAnimation,
  }

  if (index === methodologyRightCards.length - 1) {
   triggerOptions.end = 'bottom top'
  } else {
   triggerOptions.end = 'bottom 45%'
  }

  ScrollTrigger.create(triggerOptions)
 })
}
function webPresenceSection() {
 const brandSection = document.querySelector('.horizontal-brand-section')
 const projectsGrid = document.querySelector('.projects-grid')
 const projectsItemsTab = gsap.utils.toArray('.projects-items-tab')
 const projectsItems = gsap.utils.toArray('.project-item')
 const scrollNavigationsLinks = gsap.utils.toArray('.scrollnavigation-link')
 const progressBar = document.querySelector('.timeline-fill')
 const topTabLinksWrapper = document.querySelector('.project-tabs-w')
 const topTabLinks = gsap.utils.toArray('.project-tab-title')
 setElements()
 setProjectsItemPosition()

 function getScrollAmount() {
  let allProjectWidth = projectsGrid.scrollWidth
  return -allProjectWidth
 }

 setTopTab()

 ScrollTrigger.addEventListener('refreshInit', getScrollAmount)

 let horizontalScrollanimation = gsap.timeline()
 horizontalScrollanimation
  .set(progressBar, { scaleX: 0 })
  .to(topTabLinksWrapper, { autoAlpha: 1 }, '<')
  .fromTo(
   projectsGrid,
   { x: () => window.innerWidth - 100 },
   {
    x: getScrollAmount,
    duration: 3,
    ease: 'none',
   },
   '<'
  )

 ScrollTrigger.create({
  trigger: brandSection,
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

 projectsItems.forEach((item) => {
  item.setAttribute('data-mousePointer', 'Scroll')

  gsap.to(item, {
   x: -100,
   ease: 'none',
   scrollTrigger: {
    trigger: item,
    start: 'left center',
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

 let getPosition = getScrollLookup(projectsItemsTab, {
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

 topTabLinks.forEach((el, index) => {
  el.addEventListener('click', (e) => {
   e.preventDefault()
   gsap.timeline().to(window, {
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
  brandSection.style.overflowX = 'hidden'
  projectsGrid.style.flexDirection = 'row'
  projectsItemsTab.forEach((tab) => {
   tab.style.flexDirection = 'row'
  })
  topTabLinksWrapper.style.display = 'grid'
 }

 function setTopTab() {
  topTabLinksWrapper.style.gridTemplateColumns = 'repeat(3,45vw)'
  topTabLinksWrapper.style.position = 'absolute'
  topTabLinksWrapper.style.marginLeft = '35vw'
  topTabLinksWrapper.style.width = 'fit-content'
  topTabLinksWrapper.style.justifyItems = 'center'
  topTabLinksWrapper.style.opacity = '0'

  topTabLinks.forEach((item) => {
   item.style.justifySelf = 'center'
   item.style.textAlign = 'center'
  })
 }

 function setProjectsItemPosition() {
  projectsItems.forEach((item, index) => {
   const randomX = index % 2 === 1 ? -50 : 0
   gsap.set(item, { x: randomX })
  })
 }
}
function faqAnimation() {
 const faqCards = gsap.utils.toArray('.work-faq-card')
 const animations = []

 faqCards.forEach((card) => {
  createFaqAnimation(card)

  card.addEventListener('click', () => {
   const selectedReverseState = card.animation.reversed()
   card.animation.reversed(!selectedReverseState)
   //card.classList.toggle('active');
  })
 })

 function createFaqAnimation(card) {
  const answerWrapper = card.querySelector('.work-faq-answer-w')

  gsap.set(answerWrapper, { height: 0, display: 'block' })

  const tlFaq = gsap.timeline({
   defaults: { duration: 0.3, ease: 'power2.inOut' },
  })

  tlFaq
   .to(answerWrapper, {
    height: 'auto',
   })
   .to(card.querySelector('.work-faq-arrow-w'), { rotate: '90' }, '<')

   .reverse()

  card.animation = tlFaq
  animations.push(tlFaq)
 }
}

function brandSection() {
 const descriptionBox = document.querySelector('.brand-content')
 const descriptionBoxContent = document.querySelectorAll('[data-brand-hover')
 const brandItems = gsap.utils.toArray('.brands-list .brands-item-w')
 const popUp = document.querySelector('.item-pop-up')
 const body = document.body
 let textAnimation
 let lightBoxFields
 let mm = gsap.matchMedia()

 const hideDescriptionBox = () => gsap.set(descriptionBox, { autoAlpha: 0 })

 hideDescriptionBox()

 const brandItemsElements = brandItems.map(function (item) {
  const projectElements = Array.from(item.querySelectorAll('[data-project-text]'))
  const dataObject = {}

  projectElements.forEach(function (element) {
   const key = element.dataset.projectText
   let value

   if (key === 'image' || key === 'logo-image') {
    const imageElement = element.src
    value = imageElement
   } else if (key === 'projectLink') {
    const link = element.href
    value = link
   } else {
    gsap.set(element, { display: 'none' })
    value = element.textContent.trim()
   }

   dataObject[key] = value
  })
  return dataObject
 })

 const itemHoverInHandler = (e) => itemHoverIn(e.target, index)
 const itemHoverOutHandler = (e) => itemHoverOut(e.target)

 mm.add(
  {
   isDesktop: '(min-width: 991px)',
   isMobile: '(max-width: 990px)',
  },
  (context) => {
   let { isDesktop, isMobile } = context.conditions

   if (isDesktop) {
    addHover()
   }
   if (isMobile) {
    gsap.set(descriptionBox, { autoAlpha: 0 })
    addOpenLigBox()
   }

   return () => {
    brandItems.forEach((item) => {
     item.removeEventListener('click', openLightBox)
     item.removeEventListener('mouseenter', itemHoverInHandler)
     item.removeEventListener('mouseleave', itemHoverOutHandler)
    })
   }
  }
 )
 ScrollTrigger.create({
  trigger: '.brand-w',
  onLeave: hideDescriptionBox,
  onLeaveBack: hideDescriptionBox,
 })

 function addHover() {
  brandItems.forEach((item, index) => {
   item.setAttribute('data-mousePointer', 'Hover')
   let itemBrief = item.querySelector('.project-text-w')
   gsap.set(itemBrief, { display: 'none' })
   itemHoverIn(item, index)
   itemHoverOut(item)
  })
 }

 function openLightBox(index) {
  disableScroll()

  let tl = gsap.timeline()

  tl.fromTo(
   popUp,
   {
    autoAlpha: 0,
   },
   { autoAlpha: 1, display: 'flex', duration: 1 }
  )

  const closeBtn = popUp.querySelector('.item-close-btn')
  const nextBtn = popUp.querySelector('.brand-next-arrow-w')
  const previousBtn = popUp.querySelector('.brand-prev-arrow-w')
  lightBoxFields = gsap.utils.toArray(popUp.querySelectorAll('[data-brand-popup]'))

  nextBtn.addEventListener('click', (e) => {
   index++
   if (index >= brandItemsElements.length) {
    index = 0
   }

   updateLightBoxFields(index)
  })

  previousBtn.addEventListener('click', (e) => {
   index--
   if (index < 0) {
    index = brandItemsElements.length - 1
   }
   updateLightBoxFields(index)
  })

  closeBtn.addEventListener('click', (e) => {
   tl.to(popUp, {
    autoAlpha: 0,
    duration: 1,
    onComplete: enableScroll,
   })
  })

  updateLightBoxFields(index)
  currentIndex = index
 }

 function addOpenLigBox() {
  brandItems.forEach((item, index) => {
   item.addEventListener('click', () => {
    openLightBox(index)
   })
  })
 }

 function updateElementByKey(element, key, value) {
  const updateFunctions = {
   'case-studie-link': () => {
    element.href = ''
    element.setAttribute('href', value)
   },
   'logo-image': () => {
    element.removeAttribute('srcset')
    element.src = value
   },
   colors: () => {
    element.innerHTML = ''
    let colors = value.split(',')
    colors.forEach((color) => {
     let div = document.createElement('div')
     div.classList.add('brand-color-item')
     div.style.backgroundColor = color
     element.appendChild(div)
    })
   },
   illustrations: () => {
    element.innerHTML = ''
    let illustrations = value
     .split(',')
     .map((item) => item.trim())
     .filter((item) => item !== '' && item !== '\n')
    illustrations.forEach((illustration) => {
     let div = document.createElement('div')
     let img = document.createElement('img')
     div.classList.add('brand-illustration-item')
     img.classList.add('brand-ilustration-img')
     img.src = illustration
     div.appendChild(img)
     element.appendChild(div)
    })
   },
   default: () => {
    element.textContent = value
   },
  }

  const updateFunction = updateFunctions[key] || updateFunctions.default
  updateFunction()
 }

 function updateLightBoxFields(index) {
  lightBoxFields.forEach(function (element) {
   const key = element.dataset.brandPopup
   const value = brandItemsElements[index][key]
   updateElementByKey(element, key, value)
  })
 }

 function itemHoverIn(item, index) {
  item.addEventListener('mouseenter', (e) => {
   descriptionBoxContent.forEach(function (element) {
    const key = element.dataset.brandHover
    const value = brandItemsElements[index][key]
    updateElementByKey(element, key, value)
   })

   e.preventDefault()
   let tl = gsap.timeline()
   tl
    .to(item.querySelector('.item-overlay'), {
     backgroundColor: 'transparent',
    })
    .to(item.querySelector('img'), { scale: 1.05 }, '<')
    .to(descriptionBox, { autoAlpha: 1, duration: 0.8 }, '<25%')
   textAnimation = gsap.fromTo(
    descriptionBoxContent,
    { autoAlpha: 0 },
    { autoAlpha: 1, ease: 'power1', duration: 2 }
   )
  })
 }

 function itemHoverOut(item) {
  item.addEventListener('mouseleave', (e) => {
   e.preventDefault()
   let tl = gsap.timeline()
   tl
    .to(item.querySelector('.item-overlay'), {
     backgroundColor: 'hsla(0, 0.00%, 100.00%, 0.52)',
    })
    .to(item.querySelector('img'), { scale: 1 }, '<')
   if (textAnimation) {
    textAnimation.resume()
   }
  })
 }
 function disableScroll() {
  body.style.overflow = 'hidden'
 }
 function enableScroll() {
  body.style.overflow = 'auto'
 }
}
function allProjectsSection() {
 const allProjectsSection = document.querySelector('.all-projects-section')
 const allProjectsGrid = document.querySelector('.all-projects-grid')
 const allProjectsItems = gsap.utils.toArray('.project-item-card')
 const progressBar = allProjectsSection.querySelector('.timeline-fill')

 setElements()
 setProjectsItemPosition()

 function getScrollAmount() {
  let allProjectWidth = allProjectsGrid.scrollWidth
  return -allProjectWidth
 }

 let horizontalScrollanimation = gsap
  .timeline()
  .set(progressBar, { scaleX: 0 })
  .fromTo(
   allProjectsGrid,
   { x: () => window.innerWidth - 100 },
   {
    x: getScrollAmount,
    duration: 3,
    ease: 'none',
   }
  )

 ScrollTrigger.create({
  trigger: allProjectsSection,
  pin: true,
  scrub: 3,
  start: 'center center',
  end: () => `+=${getScrollAmount() * -1}`,
  animation: horizontalScrollanimation,
  invalidateOnRefresh: true,

  onUpdate: (self) => {
   updateProgressBar(self.progress)
  },
 })

 allProjectsItems.forEach((item) => {
  gsap.to(item, {
   x: -100,
   ease: 'none',
   scrollTrigger: {
    trigger: item,
    start: 'left center',
    end: 'center 20%',
    scrub: 1,
    containerAnimation: horizontalScrollanimation,
   },
  })
 })

 function setElements() {
  allProjectsSection.style.overflowX = 'hidden'
  allProjectsGrid.style.flexDirection = 'row'
 }

 function setProjectsItemPosition() {
  allProjectsItems.forEach((item, index) => {
   const randomX = index % 2 === 1 ? -50 : 0
   gsap.set(item, { x: randomX })
  })
 }

 function updateProgressBar(progress) {
  gsap.to(progressBar, { scaleX: progress, ease: 'none' })
 }
}
