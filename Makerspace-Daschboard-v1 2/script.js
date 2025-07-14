document.addEventListener('DOMContentLoaded', function() {
  const roboticArmCard = document.getElementById('robotic-arm-card');
  const projectContentWrapper = document.getElementById('project-content-wrapper');
  const backButton = document.getElementById('back-button');
  const timelineSteps = document.querySelectorAll('.step');
  const projectSections = document.querySelectorAll('.project-section');

  let isExpanded = false;

  // Handle robotic arm card click
  if (roboticArmCard) {
    roboticArmCard.addEventListener('click', function(e) {
      e.preventDefault();

      if (!isExpanded) {
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
          projectContentWrapper.classList.add('expanded');
        }, 50);

        isExpanded = true;
      }
    });
  }

  // Handle back button click
  if (backButton) {
    backButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      if (isExpanded) {
        // Collapse the card
        roboticArmCard.classList.remove('card-expanding', 'card-expanded');
        projectContentWrapper.classList.remove('expanded');

        // Reset styles after animation
        setTimeout(() => {
          roboticArmCard.style.position = '';
          roboticArmCard.style.top = '';
          roboticArmCard.style.left = '';
          roboticArmCard.style.width = '';
          roboticArmCard.style.height = '';
          roboticArmCard.style.zIndex = '';
          roboticArmCard.style.margin = '';
        }, 600);

        isExpanded = false;

        // Reset to CAD section
        projectSections.forEach(section => {
          section.style.display = 'none';
        });
        document.getElementById('cad-section').style.display = 'block';
      }
    });
  }

  // Handle timeline navigation using event delegation
  document.addEventListener('click', function(e) {
    const step = e.target.closest('.step');
    if (!step) return;

    e.preventDefault();
    e.stopPropagation();

    const targetSection = step.getAttribute('data-section');

    if (targetSection) {
      // If not expanded, expand the card first
      if (!isExpanded && roboticArmCard) {
        roboticArmCard.click();
        // Wait for expansion animation before navigating
        setTimeout(() => navigateToSection(targetSection), 100);
        return;
      }

      navigateToSection(targetSection);
    }
  });

  function navigateToSection(targetSection) {
    // Hide all sections
    projectSections.forEach(section => {
      section.style.display = 'none';
    });

    // Show target section
    const targetElement = document.getElementById(targetSection + '-section');
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