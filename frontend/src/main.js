import { router } from './router.js';

// Global error reporter to help debug black screen issues
window.addEventListener('error', (event) => {
  const message = event.message || 'Unknown Error';
  const source = event.filename || 'Unknown Source';
  const lineno = event.lineno || 0;
  const colno = event.colno || 0;
  const error = event.error;

  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div style="background:#1a1a1a; color:#f87171; padding:2rem; margin:2rem; border:1px solid #ef4444; border-radius:1rem; font-family:monospace; z-index:9999; position:relative;">
        <h2 style="margin-top:0;">⚠️ JavaScript Error</h2>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Source:</strong> ${source.split('/').pop()}:${lineno}:${colno}</p>
        <pre style="background:rgba(0,0,0,0.3); padding:1rem; border-radius:0.5rem; overflow:auto; max-height:300px; font-size:0.85rem; margin-top:1rem;">${error?.stack || 'No stack trace available.'}</pre>
        <button onclick="location.reload()" style="background:#ef4444; color:white; border:none; padding:0.6rem 1.2rem; border-radius:0.5rem; cursor:pointer; margin-top:1.5rem; font-weight:bold;">Reload & Retry</button>
      </div>
    `;
  }
});

// Initialize application immediately
console.log('🚀 LOOM & LUMEN: Initializing...');
try {
  router();
  console.log('✅ LOOM & LUMEN: Application loaded.');
} catch (err) {
  console.error('❌ LOOM & LUMEN: Fatal Initialization Error:', err);
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div style="background:#1a1a1a; color:#f87171; padding:3rem; margin:2rem; border:1px solid #ef4444; border-radius:1rem; font-family:sans-serif; text-align:center;">
        <h1 style="font-size:3rem; margin-bottom:1rem;">⚠️</h1>
        <h2 style="margin-top:0; color:#fff;">Failed to Initialize App</h2>
        <p style="color:#94a3b8; font-size:1.1rem;">${err.message}</p>
        <pre style="background:rgba(0,0,0,0.3); padding:1.5rem; border-radius:1rem; text-align:left; overflow:auto; max-height:300px; font-size:0.85rem; margin-top:2rem; border:1px solid rgba(255,255,255,0.05);">${err.stack}</pre>
        <button onclick="location.reload()" style="background:#ef4444; color:white; border:none; padding:1rem 2rem; border-radius:0.5rem; cursor:pointer; margin-top:2rem; font-weight:bold; font-size:1rem;">Restart Application</button>
      </div>
    `;
  }
}

// Also listen for hash changes
window.addEventListener('hashchange', () => {
  console.log('🔄 Hash changed, routing...');
  try {
    router();
  } catch (err) {
    console.error('Routing Error:', err);
  }
});