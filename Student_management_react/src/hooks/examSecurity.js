import { useEffect } from "react";

const useExamSecurity = () => {
  useEffect(() => {
    // 🚫 Disable right click
    const handleContextMenu = (e) => e.preventDefault();

    // 🚫 Disable copy shortcuts
    const handleKeyDown = (e) => {
      if (e.ctrlKey && ["c", "x", "v", "a"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    // 🚫 Disable drag (desktop + mobile)
    const handleDragStart = (e) => e.preventDefault();

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);
    
    useEffect(() => {
      // Blur on tab switch / screenshot attempt
      const handleVisibility = () => {
        if (document.hidden) {
          document.body.style.filter = "blur(20px)";
          // Optionally log to your server
        } else {
          document.body.style.filter = "none";
        }
      };

      document.addEventListener("visibilitychange", handleVisibility);
      return () =>
        document.removeEventListener("visibilitychange", handleVisibility);
    }, []);
};

export default useExamSecurity;
