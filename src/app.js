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

// Handle logo error
const appLogo = document.getElementById('app-logo');
if (appLogo) {
  appLogo.addEventListener('error', () => {
    appLogo.style.display = 'none';
  });
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

  // Clear reader content
  readerEl.innerHTML = '';
  
  // Create elements safely using textContent (XSS-safe)
  const container = document.createElement('div');
  container.className = 'text-center';
  
  const title = document.createElement('h2');
  title.textContent = manga.title;
  
  const status = document.createElement('p');
  status.textContent = `Status: ${manga.status}`;
  
  const placeholder1 = document.createElement('p');
  placeholder1.className = 'mt-lg';
  placeholder1.textContent = 'This is a placeholder for the manga reader. The full reader will be implemented in Milestone 1.3.';
  
  const placeholder2 = document.createElement('p');
  placeholder2.textContent = 'For now, this demonstrates the basic UI and navigation structure.';
  
  container.appendChild(title);
  container.appendChild(status);
  container.appendChild(placeholder1);
  container.appendChild(placeholder2);
  readerEl.appendChild(container);
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Chirui Reader...');
  populateMangaList();
});

console.log('Chirui Reader loaded successfully!');
