document.addEventListener('DOMContentLoaded', function() {
  const expandableCards = document.querySelectorAll('.card[data-project]');
  let currentExpandedCard = null;

  // Handle expandable card clicks
  expandableCards.forEach(card => {
    const projectContentWrapper = card.querySelector('.project-content-wrapper');
    const backButton = card.querySelector('.back-button');
    
    card.addEventListener('click', function(e) {
      e.preventDefault();

      if (currentExpandedCard === null) {
        // Store original position and size for animation
        const rect = this.getBoundingClientRect();
        this.style.position = 'fixed';
        this.style.top = rect.top + 'px';
        this.style.left = rect.left + 'px';
        this.style.width = rect.width + 'px';
        this.style.height = rect.height + 'px';
        this.style.zIndex = '1000';
        this.style.margin = '0';

        // Trigger expansion animation
        setTimeout(() => {
          this.classList.add('card-expanding', 'card-expanded');
          if (projectContentWrapper) {
            projectContentWrapper.classList.add('expanded');
          }
        }, 50);

        currentExpandedCard = this;
      }
    });

    // Handle back button click for this card
    if (backButton) {
      backButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (currentExpandedCard === card) {
          // Collapse the card
          card.classList.remove('card-expanding', 'card-expanded');
          if (projectContentWrapper) {
            projectContentWrapper.classList.remove('expanded');
          }

          // Reset styles after animation
          setTimeout(() => {
            card.style.position = '';
            card.style.top = '';
            card.style.left = '';
            card.style.width = '';
            card.style.height = '';
            card.style.zIndex = '';
            card.style.margin = '';
          }, 600);

          currentExpandedCard = null;

          // Reset to first section for this card
          const projectSections = card.querySelectorAll('.project-section');
          projectSections.forEach(section => {
            section.style.display = 'none';
          });
          const firstSection = card.querySelector('.project-section');
          if (firstSection) {
            firstSection.style.display = 'block';
          }
        }
      });
    }
  });

  // Handle timeline navigation using event delegation
  document.addEventListener('click', function(e) {
    const step = e.target.closest('.step');
    if (!step) return;

    e.preventDefault();
    e.stopPropagation();

    const targetSection = step.getAttribute('data-section');
    const card = step.closest('.card[data-project]');

    if (targetSection && card) {
      // If not expanded, expand the card first
      if (currentExpandedCard === null) {
        card.click();
        // Wait for expansion animation before navigating
        setTimeout(() => navigateToSection(targetSection, card), 100);
        return;
      }

      navigateToSection(targetSection, card);
    }
  });

  function navigateToSection(targetSection, card) {
    // Hide all sections in this card
    const projectSections = card.querySelectorAll('.project-section');
    projectSections.forEach(section => {
      section.style.display = 'none';
    });

    // Show target section in this card
    const targetElement = card.querySelector('#' + targetSection + '-section');
    if (targetElement) {
      targetElement.style.display = 'block';
    }
  }

  // Handle other card clicks (external links)
  const externalCards = document.querySelectorAll('a.card');
  externalCards.forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();

      const href = this.getAttribute('href');
      const rect = this.getBoundingClientRect();

      // Clone the card for animation
      const cardClone = this.cloneNode(true);
      cardClone.style.position = 'fixed';
      cardClone.style.top = rect.top + 'px';
      cardClone.style.left = rect.left + 'px';
      cardClone.style.width = rect.width + 'px';
      cardClone.style.height = rect.height + 'px';
      cardClone.style.zIndex = '1000';
      cardClone.style.margin = '0';
      cardClone.classList.add('card-expanding');

      // Hide original card
      this.style.opacity = '0';

      // Add clone to body
      document.body.appendChild(cardClone);

      // Trigger expansion animation
      setTimeout(() => {
        cardClone.classList.add('card-expanded');
        cardClone.style.top = '0px';
        cardClone.style.left = '0px';
        cardClone.style.width = '100vw';
        cardClone.style.height = '100vh';
      }, 50);

      // Navigate after animation
      setTimeout(() => {
        window.location.href = href;
      }, 650);
    });
  });
});