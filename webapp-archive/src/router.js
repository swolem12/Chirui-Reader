// Chirui Reader - Simple SPA Router
export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  /**
   * Register a route
   * @param {string} path - Route path (e.g., 'home', 'catalog', 'reader/:id')
   * @param {Function} handler - Function to call when route is accessed
   */
  register(path, handler) {
    this.routes[path] = handler;
  }

  /**
   * Navigate to a route
   * @param {string} path - Route path
   * @param {Object} params - Optional parameters
   */
  navigate(path, params = {}) {
    const hash = params ? `#${path}?${new URLSearchParams(params).toString()}` : `#${path}`;
    window.location.hash = hash;
  }

  /**
   * Handle current route
   */
  handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const [path, queryString] = hash.split('?');
    
    // Parse query parameters
    const params = {};
    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      for (const [key, value] of searchParams) {
        params[key] = value;
      }
    }

    // Find matching route
    let handler = this.routes[path];
    
    // Check for dynamic routes (e.g., reader/:id)
    if (!handler) {
      for (const route in this.routes) {
        const routeParts = route.split('/');
        const pathParts = path.split('/');
        
        if (routeParts.length === pathParts.length) {
          let match = true;
          const routeParams = {};
          
          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
              // Dynamic segment
              const paramName = routeParts[i].slice(1);
              routeParams[paramName] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
              match = false;
              break;
            }
          }
          
          if (match) {
            handler = this.routes[route];
            Object.assign(params, routeParams);
            break;
          }
        }
      }
    }

    // Call handler or default
    if (handler) {
      this.currentRoute = path;
      handler(params);
    } else {
      console.warn(`No handler for route: ${path}`);
      this.navigate('home');
    }
  }

  /**
   * Get current route
   */
  getCurrentRoute() {
    return this.currentRoute;
  }
}
