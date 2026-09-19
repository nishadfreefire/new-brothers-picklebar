import { useState, useEffect } from 'react';

// Client-side lightweight routing helper

export type Route = 
  | { page: 'home' }
  | { page: 'product'; productId: string }
  | { page: 'about' }
  | { page: 'craft' }
  | { page: 'admin' };

export function parseRoute(): Route {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  // Admin route check
  if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || search.includes('page=admin')) {
    return { page: 'admin' };
  }

  // About Page
  if (path === '/about' || path === '/about-us' || hash === '#about' || search.includes('page=about')) {
    return { page: 'about' };
  }

  // Making Process / Craft Page
  if (path === '/craft' || path === '/making-process' || path === '/heritage' || hash === '#craft' || search.includes('page=craft')) {
    return { page: 'craft' };
  }

  // Product detail route check
  if (path.startsWith('/product/')) {
    const productId = path.replace('/product/', '').replace(/\/$/, '').trim();
    if (productId) {
      return { page: 'product', productId };
    }
  }

  if (hash.startsWith('#product-')) {
    const productId = hash.replace('#product-', '').trim();
    if (productId) {
      return { page: 'product', productId };
    }
  }

  return { page: 'home' };
}

export function navigateTo(path: string) {
  if (window.location.pathname + window.location.hash !== path) {
    window.history.pushState({}, '', path);
  }
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseRoute());

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRoute());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return route;
}

