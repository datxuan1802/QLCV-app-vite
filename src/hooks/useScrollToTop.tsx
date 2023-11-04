import { useEffect, useRef } from "react";

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // You can change this to 'auto' for instant scrolling
  });
};

const useScroll = () => {
  useEffect(() => {
    scrollToTop();
    // Optionally, you can add event listeners for additional cases like route changes
    const handleRouteChange = () => {
      scrollToTop();
    };

    // Add event listeners if necessary
    // Example:
    // window.addEventListener('popstate', handleRouteChange);

    return () => {
      // Clean up event listeners if added
      // Example:
      // window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
};

export default useScroll;

export const useScrollToBottom = (dependency: any) => {
  const elementRef = useRef<any>(null);

  const scrollToBottom = () => {
    if (elementRef.current) {
      elementRef.current.scrollTo({
        top: elementRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [dependency]);

  return elementRef;
};
