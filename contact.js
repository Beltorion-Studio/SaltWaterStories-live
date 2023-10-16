const faqCards = gsap.utils.toArray('.faq-card')
const animations = []

faqCards.forEach((card) => {
 createAnimation(card)

 card.addEventListener('click', () => {
  const selectedReverseState = card.animation.reversed()
  card.animation.reversed(!selectedReverseState)
 })
})

function createAnimation(card) {
 const answerWrapper = card.querySelector('.faq-answer-w')

 gsap.set(answerWrapper, { height: 0 })

 const tlFaq = gsap.timeline({
  defaults: { duration: 0.3, ease: 'power2.inOut' },
 })

 tlFaq
  .to(answerWrapper, {
   height: 'auto',
  })
  .to(
   card,
   {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    duration: 0.3,
    ease: 'power2.inOut',
   },
   '<'
  )
  .reverse()

 card.animation = tlFaq
 animations.push(tlFaq)
}
