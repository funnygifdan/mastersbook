let currentIndex = 0;

const pages = [
  document.querySelector('.book-cover'),
  document.querySelector('. table-of-contents'),
  document.querySelector('.page-section1-1'),
  document.querySelector('.page-section1-2'),
  document.querySelector('.page-section1-3'),
  document.querySelector('.page-section1-4'),
  document.querySelector('.page-section1-5'),
];

// Hide all pages except the first
function initBook() {
  pages.forEach((page, i) => {
    page.style.display = i === 0 ? 'flex' : 'none';
  });
  currentIndex = 0;
}

function coverToContents() {
  if (currentIndex === 0) {
    pages[currentIndex].style.display = 'none';
    currentIndex++;
    pages[currentIndex].style.display = 'flex';
  }
}

function ContentsToFirstSection() {
  if (currentIndex === 1) {
    pages[currentIndex].style.display = 'none';
    currentIndex++;
    pages[currentIndex].style.display = 'flex';
  }
}

function nextSectionPage() {
  if (currentIndex >= 2 && currentIndex < pages.length - 1) {
    pages[currentIndex].style.display = 'none';
    currentIndex++;
    pages[currentIndex].style.display = 'flex';
  }
}

// Init book on load
window.addEventListener('DOMContentLoaded', initBook);

// Tap navigation
pages.forEach((page, index) => {
  page.addEventListener('click', () => {
    if (currentIndex === 0) {
      coverToContents();
    } else if (currentIndex === 1) {
      ContentsToFirstSection();
    } else {
      nextSectionPage();
    }
  });
});

// Swipe support
let startX = 0;

document.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
});

document.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  const swipeThreshold = 50;

  if (endX < startX - swipeThreshold) {
    if (currentIndex === 0) {
      coverToContents();
    } else if (currentIndex === 1) {
      ContentsToFirstSection();
    } else {
      nextSectionPage();
    }
  }
});