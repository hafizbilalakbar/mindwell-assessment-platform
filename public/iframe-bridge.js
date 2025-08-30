/**
 * iframe-bridge.js
 * This script helps with cross-origin iframe communication
 * It should be added to the parent page (not the iframe)
 */

(function() {
  // Store reference to the active iframe
  let activeIframe = null;
  
  // Initialize the bridge when the page loads
  window.addEventListener('DOMContentLoaded', function() {
    // Listen for messages from iframes
    window.addEventListener('message', handleIframeMessage);
    
    // Set up a global function to register iframes
    window.registerGameIframe = function(iframe) {
      activeIframe = iframe;
      console.log('Game iframe registered');
    };
  });
  
  // Handle messages from iframes
  function handleIframeMessage(event) {
    // Check if the message is from our iframe
    if (activeIframe && event.source === activeIframe.contentWindow) {
      // Process messages from the iframe
      console.log('Received message from game iframe:', event.data);
      
      // You can add specific message handling here
      if (event.data.type === 'GAME_LOADED') {
        // Game has loaded successfully
        document.dispatchEvent(new CustomEvent('gameLoaded', { 
          detail: event.data 
        }));
      }
      
      if (event.data.type === 'GAME_INTERACTION') {
        // Game interaction event
        document.dispatchEvent(new CustomEvent('gameInteraction', { 
          detail: event.data 
        }));
      }
    }
  }
  
  // Expose a safe way to send messages to the iframe
  window.sendMessageToGame = function(message) {
    if (activeIframe && activeIframe.contentWindow) {
      try {
        // Try to send the message to the iframe
        activeIframe.contentWindow.postMessage(message, '*');
        return true;
      } catch (error) {
        console.error('Error sending message to game iframe:', error);
        return false;
      }
    }
    return false;
  };
})(); 