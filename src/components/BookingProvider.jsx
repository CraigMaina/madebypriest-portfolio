import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { GoX } from 'react-icons/go';
import { lockScroll, unlockScroll } from '../motion';

const BOOKING_URL = import.meta.env.VITE_BOOKING_URL;

const BookingContext = createContext({
  hasBooking: false,
  openBooking: () => {},
  closeBooking: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ children }) {
  const [open, setOpen] = useState(false);
  const hasBooking = Boolean(BOOKING_URL);

  const openBooking = useCallback(() => {
    if (hasBooking) setOpen(true);
  }, [hasBooking]);
  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ hasBooking, openBooking, closeBooking }),
    [hasBooking, openBooking, closeBooking]
  );

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lockScroll(); // pause Lenis so the modal iframe scrolls, not the page
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      unlockScroll();
    };
  }, [open]);

  return (
    <BookingContext.Provider value={value}>
      {children}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Book a call"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink-900/90 p-4"
        >
          <button
            onClick={closeBooking}
            aria-label="Close booking"
            className="absolute top-4 right-4 z-[1001] text-fog-100 hover:text-accent text-3xl"
          >
            <GoX />
          </button>
          <div className="relative w-full max-w-3xl h-[80vh] overflow-hidden rounded-card border border-ink-700 bg-ink-800">
            <iframe
              src={BOOKING_URL}
              title="Book a call"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </BookingContext.Provider>
  );
}
