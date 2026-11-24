'use client';
import { useEffect, useState } from 'react';

// This template's installed framer-motion hook snapshots the initial preference.
// Subscribe directly so switching the OS preference also updates an open page.
export default function useMotionPreference() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}
