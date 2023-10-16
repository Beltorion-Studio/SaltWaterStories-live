const pdfjsLib = window['pdfjs-dist/build/pdf']
pdfjsLib.GlobalWorkerOptions.workerSrc =
 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js'
gsap.registerPlugin(CSSRulePlugin)
gsap.registerPlugin(ScrollTrigger)

function heroanimation() {
 const heroImage = document.querySelector('.sm-hero-image')
 let heroTl = gsap.timeline({ paused: false })
 heroTl.to(heroImage, {
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
  animation: heroTl,
  scrub: 1,
  invalidateOnRefresh: true,
 })
}

function textReveal() {
 const container = gsap.utils.toArray('.cs-brief-w')

 mask = CSSRulePlugin.getRule('.cs-brief-w::before')
 gsap.to(mask, {
  backgroundImage: 'linear-gradient(178deg, transparent 100%, white 100%, white 100%)',
  scrollTrigger: {
   trigger: container,
   //pin: true,
   start: 'top center',
   end: 'bottom 50%',
   scrub: 1,
  },
 })
}

async function renderPDF(pdf) {
 try {
  const pdfDocument = await pdfjsLib.getDocument(pdf.url).promise
  const container = document.getElementById(pdf.containerId)
  const pagesToRender = 3

  let currentPage = 1

  const renderNextPage = async () => {
   for (let i = 0; i < pagesToRender; i++) {
    if (currentPage > pdfDocument.numPages) {
     return
    }

    const page = await pdfDocument.getPage(currentPage)
    const scale = container.clientWidth / page.getViewport({ scale: 1 }).width
    const viewport = page.getViewport({ scale })

    const canvas = document.createElement('canvas')
    canvas.className = 'pdf-canvas'
    canvas.height = viewport.height * window.devicePixelRatio
    canvas.width = viewport.width * window.devicePixelRatio
    canvas.style.width = `${viewport.width}px`
    canvas.style.height = `${viewport.height}px`

    container.appendChild(canvas)

    const context = canvas.getContext('2d', { alpha: false })
    context.scale(window.devicePixelRatio, window.devicePixelRatio)

    const renderContext = {
     canvasContext: context,
     viewport: viewport,
     textLayerMode: 0,
    }

    await page.render(renderContext).promise
    currentPage++
   }

   // Check if there are more pages to render and continue rendering
   if (currentPage <= pdfDocument.numPages) {
    await renderNextPage()
   }
  }

  // Start rendering the initial pages
  await renderNextPage()
 } catch (error) {
  console.error(error)
 }
}

function parallaxGridanimation() {
 const parallaxSection = document.querySelector('#parallax')
 const parallaxWrapper = document.querySelector('.parallax-w')
 const parallaxCollumns = gsap.utils.toArray('.parallax-column')
 const parallaxTl = gsap.timeline()
 gsap.set(parallaxWrapper, { height: '100vh', overflow: 'hidden' })

 const parallaxWrapperHeight = parallaxWrapper.offsetHeight
 const sideColumnOverflowAmount = parallaxCollumns[0].offsetHeight - parallaxWrapperHeight
 const middleColumnOverflowAmount = parallaxCollumns[1].offsetHeight - parallaxWrapperHeight

 parallaxTl
  .to(parallaxCollumns[0], { y: -sideColumnOverflowAmount })
  .to(parallaxCollumns[1], { y: -middleColumnOverflowAmount }, '<')
  .to(parallaxCollumns[2], { y: -sideColumnOverflowAmount }, '<')
  .set(parallaxWrapper, { height: 'auto' })

 ScrollTrigger.create({
  trigger: parallaxSection,
  pin: true,
  scrub: 1,
  start: 'top top',
  end: () => '5000px',
  animation: parallaxTl,
 })
}

function pdfSlider() {
 const sliderWrapper = document.querySelector('.pdf-scroll-w')
 const sliderItems = gsap.utils.toArray('.pdf-slide')
 const prevButton = document.querySelector('#left-arrow')
 const nextButton = document.querySelector('#right-arrow')
 const vw = window.innerWidth / 100
 const width = 33 * vw
 const gap = 2 * vw

 let currentIndex = 0
 gsap.set(sliderItems, {
  position: 'absolute',
  left: 0,
  top: 0,
  width: width,
 })

 gsap.set(sliderWrapper, {
  force3D: true,
  perspective: 1600,
 })

 function updateSlider() {
  gsap.to(sliderItems, {
   duration: 1,
   ease: 'power2.inOut',
   x: (index) => {
    const isNextCard = index === currentIndex + 1
    const offset = isNextCard ? width * 0.25 : 0
    const xValue = (index - currentIndex) * width - offset
    return xValue
   },

   y: (index) => (index === currentIndex + 1 ? -25 : 0),
   scale: (index) => (index === currentIndex + 1 ? 1.05 : 1),
   opacity: (index) => (index === currentIndex + 1 ? 1 : 1),
   width: (index) => (index === currentIndex + 1 ? width * 1.5 : width),
   rotationY: (index) => (index - currentIndex) * -50 + 50,
   zIndex: (index) => (index === currentIndex + 1 ? 3 : 2),

   onUpdate: () => {
    const middleCard = sliderItems[currentIndex + 1]
    if (middleCard) {
     const canvasElements = gsap.utils.toArray(middleCard.querySelectorAll('canvas'))
     canvasElements.forEach((canvas) => {
      const originalWidth = canvas.width
      const originalHeight = canvas.height
      const aspectRatio = originalWidth / originalHeight

      const newWidth = middleCard.offsetWidth // Or any desired value based on your design
      const newHeight = newWidth / aspectRatio

      gsap.set(canvas, {
       width: `${newWidth}px`,
       height: `${newHeight}px`,
      })
     })
    }
   },
  })
 }

 prevButton.addEventListener('click', () => {
  if (currentIndex > -1) {
   currentIndex = (currentIndex - 1) % sliderItems.length
   updateSlider()
   gsap.to(nextButton, { opacity: 1 })
   animateArrow(prevButton, -5)
  } else {
   gsap.to(prevButton, { opacity: 0.5 })
  }
 })

 nextButton.addEventListener('click', () => {
  if (currentIndex < sliderItems.length - 2) {
   currentIndex = (currentIndex + 1) % sliderItems.length
   updateSlider()
   gsap.to(prevButton, { opacity: 1 })
   animateArrow(nextButton, 5)
  } else {
   gsap.to(nextButton, { opacity: 0.5 })
  }
 })

 function animateArrow(arrow, offset) {
  gsap.to(arrow.children, {
   x: offset,
   duration: 0.2,
   ease: 'power1.inOut',
   onComplete: () => {
    gsap.to(arrow.children, {
     x: 0,
     duration: 0.2,
     ease: 'power1.inOut',
    })
   },
  })
 }
 function moveToIndex(index) {
  currentIndex = index
  updateSlider()
 }

 updateSlider()
}

function revealTextLineByLine() {
 const textWrapper = gsap.utils.toArray('.pdf-text-w')
 new SplitType('.pdf-text-w', { tagName: 'span', types: 'words, chars' })
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

document.addEventListener('DOMContentLoaded', function () {
 heroanimation()
 textReveal()
 pdfSlider()
 parallaxGridanimation()
 revealTextLineByLine()
 pdfList.forEach(renderPDF)
})
