// Chirui Reader - Main Application
console.log('Chirui Reader initializing...');

// Theme Management
class ThemeManager {
  constructor() {
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    this.applyTheme();
  }

  applyTheme() {
    if (this.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  toggle() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode);
    this.applyTheme();
  }
}

// Initialize theme
const themeManager = new ThemeManager();
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => themeManager.toggle());
}

// Sample manga data (stub for development)
const sampleMangaList = [
  { id: 1, title: 'Sample Manga 1', status: 'Ongoing' },
  { id: 2, title: 'Sample Manga 2', status: 'Completed' },
  { id: 3, title: 'Sample Manga 3', status: 'Ongoing' },
];

// Populate manga list
function populateMangaList() {
  const mangaListEl = document.getElementById('manga-list');
  if (!mangaListEl) return;

  mangaListEl.innerHTML = '';
  sampleMangaList.forEach(manga => {
    const li = document.createElement('li');
    li.textContent = `${manga.title} (${manga.status})`;
    li.dataset.mangaId = manga.id;
    li.addEventListener('click', () => openManga(manga));
    mangaListEl.appendChild(li);
  });
}

// Open manga in reader
function openManga(manga) {
  const readerEl = document.getElementById('reader');
  if (!readerEl) return;

  // Remove active class from all items
  document.querySelectorAll('#manga-list li').forEach(li => {
    li.classList.remove('active');
  });

  // Add active class to clicked item
  const clickedItem = document.querySelector(`#manga-list li[data-manga-id="${manga.id}"]`);
  if (clickedItem) {
    clickedItem.classList.add('active');
  }

  // Display manga info (stub)
  readerEl.innerHTML = `
    <div class="text-center">
      <h2>${manga.title}</h2>
      <p>Status: ${manga.status}</p>
      <p class="mt-lg">This is a placeholder for the manga reader. The full reader will be implemented in Milestone 1.3.</p>
      <p>For now, this demonstrates the basic UI and navigation structure.</p>
    </div>
  `;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Chirui Reader...');
  populateMangaList();
});

console.log('Chirui Reader loaded successfully!');
