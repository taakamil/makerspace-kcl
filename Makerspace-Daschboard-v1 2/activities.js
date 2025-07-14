
document.addEventListener('DOMContentLoaded', function () {
  const events = document.querySelectorAll('.event:not(.event-closed)');
  const prevWeekBtn = document.getElementById('prev-week');
  const nextWeekBtn = document.getElementById('next-week');
  const currentWeekEl = document.getElementById('current-week');
  let currentWeekOffset = 0;

  function getWeekRange(offset = 0) {
    const now = new Date();
    const currentDay = now.getDay(); // 0 (Sun) to 6 (Sat)
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((currentDay + 6) % 7) + offset * 7);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const options = { month: 'long', day: 'numeric' };
    const mondayStr = monday.toLocaleDateString('en-US', options);
    const sundayStr = sunday.toLocaleDateString('en-US', options);
    return `Week of ${mondayStr} - ${sundayStr}, ${monday.getFullYear()}`;
  }

  function updateWeekLabel() {
    currentWeekEl.textContent = getWeekRange(currentWeekOffset);
  }

  updateWeekLabel();

  prevWeekBtn.addEventListener('click', () => {
    currentWeekOffset--;
    updateWeekLabel();
  });

  nextWeekBtn.addEventListener('click', () => {
    currentWeekOffset++;
    updateWeekLabel();
  });

  // Style and align events
  const slotHeight = 58; // adjust to match CSS height per hour slot
  events.forEach(event => {
    const start = parseInt(event.getAttribute('data-start'));
    const duration = parseInt(event.getAttribute('data-duration'));
    event.style.top = `${slotHeight * start}px`;
    event.style.height = `${slotHeight * duration}px`;

    // Hover and click
    event.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-2px) scale(1.02)';
      this.style.boxShadow = '0 8px 25px rgba(227, 27, 35, 0.3)';
    });
    event.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '';
    });
    event.addEventListener('click', function (e) {
      e.preventDefault();
      const targetPage = this.getAttribute('data-page');
      if (targetPage) {
        this.style.transform = 'scale(0.95)';
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        document.body.appendChild(overlay);
        setTimeout(() => {
          window.location.href = targetPage;
        }, 300);
      }
    });
  });
});
