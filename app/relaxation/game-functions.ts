// Game interaction helper functions

/**
 * Toggle fullscreen mode for the game container
 */
export function toggleFullscreen(
  gameContainerRef: React.RefObject<HTMLDivElement>,
  isFullscreen: boolean,
  setIsFullscreen: (value: boolean) => void,
  isTheaterMode: boolean,
  setIsTheaterMode: (value: boolean) => void,
  mainContainerRef: React.RefObject<HTMLDivElement>,
  adjustGameHeight: () => void
) {
  if (!gameContainerRef.current) return;
  
  try {
    if (!isFullscreen) {
      // Enter fullscreen
      if (gameContainerRef.current.requestFullscreen) {
        gameContainerRef.current.requestFullscreen();
      } else if ((gameContainerRef.current as any).webkitRequestFullscreen) {
        (gameContainerRef.current as any).webkitRequestFullscreen();
      } else if ((gameContainerRef.current as any).msRequestFullscreen) {
        (gameContainerRef.current as any).msRequestFullscreen();
      }
      
      // Add fullscreen class
      gameContainerRef.current.classList.add('fullscreen-mode');
      document.body.classList.add('fullscreen-active');
      document.documentElement.classList.add('fullscreen-active');
      
      // For mobile devices, add special handling
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        document.body.classList.add('mobile-fullscreen');
      }
      
      setIsFullscreen(true);
      
      // Exit theater mode if active
      if (isTheaterMode) {
        setIsTheaterMode(false);
        document.body.classList.remove('theater-active');
        if (mainContainerRef.current) {
          mainContainerRef.current.style.background = "";
        }
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      
      // Remove fullscreen class
      gameContainerRef.current.classList.remove('fullscreen-mode');
      document.body.classList.remove('fullscreen-active');
      document.documentElement.classList.remove('fullscreen-active');
      document.body.classList.remove('mobile-fullscreen');
      
      setIsFullscreen(false);
    }
    
    // Adjust height after mode change
    setTimeout(adjustGameHeight, 300);
  } catch (error) {
    console.error("Error toggling fullscreen:", error);
  }
}

/**
 * Adjust game height based on aspect ratio and current mode
 */
export function adjustGameHeight(
  gameContainerRef: React.RefObject<HTMLDivElement>,
  activeGame: string | null,
  isFullscreen: boolean,
  isTheaterMode: boolean,
  setGameHeight: (height: string) => void
) {
  if (!gameContainerRef.current || !activeGame) return;
  
  try {
    // If in fullscreen or theater mode, use special handling
    if (isFullscreen) {
      setGameHeight("100%");
      return;
    }
    
    if (isTheaterMode) {
      // Theater mode uses a 16:9 aspect ratio with max width
      const theaterHeight = window.innerWidth <= 768
        ? "56.25vw" // Mobile: 16:9 ratio of viewport width
        : "calc(90vh - 120px)"; // Desktop: 90% of viewport height minus margins
      
      setGameHeight(theaterHeight);
      return;
    }
    
    // Default mode: 16:9 aspect ratio
    setGameHeight("56.25%"); // 9/16 = 0.5625 or 56.25%
  } catch (error) {
    console.error("Error adjusting game height:", error);
    // Fallback to default aspect ratio
    setGameHeight("56.25%");
  }
}

/**
 * Fix iframe click issues by ensuring proper event handling
 */
export function fixIframeClickIssue(
  activeGame: string | null,
  gameContainerRef: React.RefObject<HTMLDivElement>
) {
  if (!activeGame) return;
  
  try {
    // Get the iframe element
    const iframe = document.querySelector('iframe');
    if (!iframe) return;
    
    // Make sure the iframe can receive clicks
    iframe.style.pointerEvents = 'auto';
    
    // Add a class to the game container to indicate interaction is possible
    const gameContainer = gameContainerRef.current;
    if (gameContainer) {
      gameContainer.classList.add('interacting');
      
      // Make sure any overlay elements don't block interaction
      const overlays = gameContainer.querySelectorAll('.youtube-controls-overlay');
      overlays.forEach(overlay => {
        (overlay as HTMLElement).style.pointerEvents = 'none';
      });
      
      // Ensure controls only appear on hover and don't block clicks
      const controlsElements = gameContainer.querySelectorAll('.youtube-controls-container, .youtube-top-controls');
      controlsElements.forEach(element => {
        (element as HTMLElement).style.pointerEvents = 'auto';
      });
    }
  } catch (error) {
    console.error("Error fixing iframe click issue:", error);
  }
}

/**
 * Get game URL with proper parameters
 */
export function getGameUrl(gameId: string | null, games: any[]) {
  if (!gameId) return "";
  
  const game = games.find(g => g.id === gameId);
  if (!game) return "";
  
  // Add parameters to help with iframe communication
  let url = game.url;
  
  // Add a parameter to indicate this is running in our app
  if (url.includes('?')) {
    url += '&mindwell=true';
  } else {
    url += '?mindwell=true';
  }
  
  return url;
} 