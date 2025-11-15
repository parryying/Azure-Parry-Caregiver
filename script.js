// Counter functionality
let count = 0;

const countElement = document.getElementById('count');
const incrementBtn = document.getElementById('increment-btn');
const resetBtn = document.getElementById('reset-btn');

incrementBtn.addEventListener('click', () => {
    count++;
    countElement.textContent = count;
    animateCount();
});

resetBtn.addEventListener('click', () => {
    count = 0;
    countElement.textContent = count;
    animateCount();
});

function animateCount() {
    countElement.style.transform = 'scale(1.3)';
    countElement.style.color = '#764ba2';
    
    setTimeout(() => {
        countElement.style.transform = 'scale(1)';
        countElement.style.color = '#0078d4';
    }, 200);
}

// Display last updated time
const lastUpdatedElement = document.getElementById('last-updated');
const now = new Date();
lastUpdatedElement.textContent = now.toLocaleString();

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
