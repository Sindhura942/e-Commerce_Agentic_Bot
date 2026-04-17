export function renderHero() {
  return `
  <section class="hero animate-fade-up">
    <div class="container hero-grid">
      <div class="hero-content">
        <div class="hero-badge">
          <span>✦ The Edit 2026</span>
        </div>
        <h1 class="hero-title">Loom & Lumen:<br/>Woven with Light</h1>
        <p class="hero-desc">Experience the harmony of artisanal craftsmanship and modern illumination. Discover fashion that glows from within.</p>
        <div class="hero-actions">
          <button class="btn btn-primary" onclick="handleCatClick('')">
            <span>Explore Collection</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:8px"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button class="btn btn-outline" onclick="handleCatClick('women')">New Arrivals</button>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <p>12k+</p>
            <p>Signature Pieces</p>
          </div>
          <div class="hero-stat">
            <p>150K+</p>
            <p>Global Community</p>
          </div>
        </div>
      </div>
      <div class="hero-image-container animate-reveal">
        <div class="hero-image-bg"></div>
        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200" alt="Loom & Lumen Fashion" class="hero-image" />
        <div class="hero-image-badge glass">
          <span class="hero-image-badge-icon">✨</span>
          <div>
            <p class="hero-image-badge-label" style="color: white; font-weight: 700; margin: 0;">Signature Edit</p>
            <p class="hero-image-badge-sub" style="color: #94a3b8; font-size: 0.8rem; margin: 0;">Loom & Lumen</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="lookbook-section">
    <div class="container">
      <div class="hero-badge" style="margin-bottom: 1rem;">
        <span>Editorial Lookbook</span>
      </div>
      <h2 class="section-title" style="text-align: left; margin-bottom: 3rem;">The Aesthetic of<br/>Illumination.</h2>
      
      <div class="lookbook-grid">
        <div class="lookbook-item lookbook-item-1 animate-fade-up">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200" alt="Editorial One">
          <div class="lookbook-overlay">
            <h3>Desert Dusk</h3>
            <p>Lightweight linen and golden tones.</p>
          </div>
        </div>
        <div class="lookbook-item lookbook-item-2 animate-fade-up" style="animation-delay: 0.2s;">
          <img src="https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&q=80&w=800" alt="Editorial Two">
          <div class="lookbook-overlay">
            <h3>Crimson Studio</h3>
            <p>Sharp tailoring for the modern icon.</p>
          </div>
        </div>
        <div class="lookbook-item lookbook-item-3 animate-fade-up" style="animation-delay: 0.4s;">
          <img src="https://images.unsplash.com/photo-1539109132354-92900465b094?auto=format&fit=crop&q=80&w=800" alt="Editorial Three">
          <div class="lookbook-overlay">
            <h3>Woven Shadows</h3>
            <p>Intricate textures meeting darkness.</p>
          </div>
        </div>
        <div class="lookbook-item lookbook-item-4 animate-fade-up" style="animation-delay: 0.6s;">
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200" alt="Editorial Four">
          <div class="lookbook-overlay">
            <h3>Urban Horizon</h3>
            <p>Fashion that reflects the city light.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}
