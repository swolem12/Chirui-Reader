// Chirui Reader - Manga Data Service
// This provides sample data and will later be replaced with API calls

export class MangaService {
  constructor() {
    // Sample manga data with more details
    this.mangaData = [
      {
        id: '1',
        title: 'One Piece',
        author: 'Eiichiro Oda',
        status: 'Ongoing',
        description: 'Monkey D. Luffy sets off on an adventure with his pirate crew in hopes of finding the greatest treasure ever, known as the One Piece.',
        cover: 'https://via.placeholder.com/200x280/1976d2/ffffff?text=One+Piece',
        genres: ['Action', 'Adventure', 'Comedy', 'Fantasy'],
        rating: 4.8,
        chapters: 1095,
        lastUpdated: '2025-11-20'
      },
      {
        id: '2',
        title: 'Attack on Titan',
        author: 'Hajime Isayama',
        status: 'Completed',
        description: 'Humanity lives inside cities surrounded by enormous walls that protect them from gigantic man-eating humanoids referred to as Titans.',
        cover: 'https://via.placeholder.com/200x280/d32f2f/ffffff?text=Attack+on+Titan',
        genres: ['Action', 'Dark Fantasy', 'Post-apocalyptic'],
        rating: 4.9,
        chapters: 139,
        lastUpdated: '2021-04-09'
      },
      {
        id: '3',
        title: 'My Hero Academia',
        author: 'Kohei Horikoshi',
        status: 'Ongoing',
        description: 'A superhero-admiring boy without any powers enrolls in a prestigious hero academy and learns what it really means to be a hero.',
        cover: 'https://via.placeholder.com/200x280/26a69a/ffffff?text=My+Hero+Academia',
        genres: ['Action', 'Adventure', 'Superhero'],
        rating: 4.7,
        chapters: 405,
        lastUpdated: '2025-11-18'
      },
      {
        id: '4',
        title: 'Demon Slayer',
        author: 'Koyoharu Gotouge',
        status: 'Completed',
        description: 'A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly.',
        cover: 'https://via.placeholder.com/200x280/9c27b0/ffffff?text=Demon+Slayer',
        genres: ['Action', 'Adventure', 'Dark Fantasy'],
        rating: 4.8,
        chapters: 205,
        lastUpdated: '2020-05-18'
      },
      {
        id: '5',
        title: 'Naruto',
        author: 'Masashi Kishimoto',
        status: 'Completed',
        description: 'Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village.',
        cover: 'https://via.placeholder.com/200x280/ff9800/ffffff?text=Naruto',
        genres: ['Action', 'Adventure', 'Martial Arts'],
        rating: 4.6,
        chapters: 700,
        lastUpdated: '2014-11-10'
      },
      {
        id: '6',
        title: 'Solo Leveling',
        author: 'Chugong',
        status: 'Completed',
        description: 'In a world where hunters battle monsters, E-rank hunter Jinwoo Sung is the weakest of them all. After a near-death experience, he gains a unique power.',
        cover: 'https://via.placeholder.com/200x280/4caf50/ffffff?text=Solo+Leveling',
        genres: ['Action', 'Adventure', 'Fantasy'],
        rating: 4.9,
        chapters: 179,
        lastUpdated: '2021-12-29'
      },
      {
        id: '7',
        title: 'Jujutsu Kaisen',
        author: 'Gege Akutami',
        status: 'Ongoing',
        description: 'A boy swallows a cursed talisman and becomes possessed. He must learn to control this power to help save others from curses.',
        cover: 'https://via.placeholder.com/200x280/3f51b5/ffffff?text=Jujutsu+Kaisen',
        genres: ['Action', 'Dark Fantasy', 'Supernatural'],
        rating: 4.8,
        chapters: 245,
        lastUpdated: '2025-11-15'
      },
      {
        id: '8',
        title: 'Tokyo Ghoul',
        author: 'Sui Ishida',
        status: 'Completed',
        description: 'A college student is turned into a half-ghoul and must navigate the complex social dynamics between humans and ghouls.',
        cover: 'https://via.placeholder.com/200x280/607d8b/ffffff?text=Tokyo+Ghoul',
        genres: ['Action', 'Dark Fantasy', 'Horror'],
        rating: 4.5,
        chapters: 143,
        lastUpdated: '2014-09-18'
      }
    ];
  }

  /**
   * Get all manga
   * @returns {Array} All manga
   */
  getAllManga() {
    return [...this.mangaData];
  }

  /**
   * Get manga by ID
   * @param {string} id - Manga ID
   * @returns {Object|null} Manga object or null if not found
   */
  getMangaById(id) {
    return this.mangaData.find(manga => manga.id === id) || null;
  }

  /**
   * Search manga by title
   * @param {string} query - Search query
   * @returns {Array} Filtered manga array
   */
  searchManga(query) {
    if (!query || query.trim() === '') {
      return this.getAllManga();
    }
    
    const lowerQuery = query.toLowerCase();
    return this.mangaData.filter(manga =>
      manga.title.toLowerCase().includes(lowerQuery) ||
      manga.author.toLowerCase().includes(lowerQuery) ||
      manga.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter manga by criteria
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered manga array
   */
  filterManga(filters = {}) {
    // Use provided results or get all manga
    let results = filters.results || this.getAllManga();

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      results = results.filter(manga => manga.status === filters.status);
    }

    // Filter by genre
    if (filters.genre && filters.genre !== 'all') {
      results = results.filter(manga => manga.genres.includes(filters.genre));
    }

    // Filter by minimum rating
    if (filters.minRating) {
      results = results.filter(manga => manga.rating >= parseFloat(filters.minRating));
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'title':
          results.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'updated':
          results.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
          break;
        case 'chapters':
          results.sort((a, b) => b.chapters - a.chapters);
          break;
      }
    }

    return results;
  }

  /**
   * Get unique genres from all manga
   * @returns {Array} Array of unique genres
   */
  getAllGenres() {
    const genresSet = new Set();
    this.mangaData.forEach(manga => {
      manga.genres.forEach(genre => genresSet.add(genre));
    });
    return Array.from(genresSet).sort();
  }

  /**
   * Get manga chapters (stub for now)
   * @param {string} mangaId - Manga ID
   * @returns {Array} Array of chapters
   */
  getChapters(mangaId) {
    // This will be implemented when integrating with real APIs
    const manga = this.getMangaById(mangaId);
    if (!manga) return [];
    
    // Generate sample chapters
    const chapters = [];
    for (let i = 1; i <= Math.min(10, manga.chapters); i++) {
      chapters.push({
        id: `${mangaId}-${i}`,
        number: i,
        title: `Chapter ${i}`,
        releaseDate: '2025-11-01',
        pages: 20
      });
    }
    return chapters;
  }
}
