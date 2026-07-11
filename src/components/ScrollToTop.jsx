import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../motion';

// Resets scroll to the top on every route change (react-router doesn't do this
// on its own), keeping Lenis' position in sync.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    scrollToTop();
  }, [pathname]);
  return null;
}
