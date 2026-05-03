/**
 * Initializes the scroll-reveal animation for card elements.
 * Uses Intersection Observer for high performance.
 */
function initCardScrollReveal() {
  const cardsToAnimate = document.querySelectorAll('.card');

  const revealOptions = {
    root: null, // use the viewport
    threshold: 0.2 // trigger when 20% of the element is visible
  };

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Stop observing once the animation has played
        observer.unobserve(entry.target);
      }
    });
  };

  const cardObserver = new IntersectionObserver(revealCallback, revealOptions);

  cardsToAnimate.forEach(card => {
    cardObserver.observe(card);
  });
}

// Run the function
initCardScrollReveal();