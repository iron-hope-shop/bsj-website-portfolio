import { useState, useEffect } from 'react';

export function useIsMobileDevice() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const mobileRegex = /Mobi|Android|iPhone|iPad/i;
    setIsMobile(mobileRegex.test(ua));
  }, []);

  return isMobile;
}
