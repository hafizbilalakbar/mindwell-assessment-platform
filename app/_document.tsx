import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add error handling script that loads before anything else */}
        <script src="/chunk-retry-handler.js" />
        
        {/* Add cache cleaning keyboard shortcut (Ctrl+Alt+C) */}
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('keydown', function(e) {
              // Check for Ctrl+Alt+C keyboard combo
              if (e.ctrlKey && e.altKey && e.key === 'c') {
                console.log('Cache clearing shortcut detected');
                if (window.clearMindWellCache) {
                  window.clearMindWellCache();
                  alert('Cache cleared successfully! The page will reload.');
                  setTimeout(() => window.location.reload(), 500);
                } else {
                  alert('Cache clearing function not available');
                }
              }
            });
          `
        }} />
              <script src="/chunk-retry.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 