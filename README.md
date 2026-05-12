# Parkhurst NuVision — LASIK Pricing Guide Landing Page

A premium, conversion-focused static landing page for the **Parkhurst NuVision Free LASIK Pricing Guide** offer.

Built to feel like Apple meets premium healthcare — cinematic, trustworthy, and built for lead capture.

---

## Project Structure

```
parkhurst-pricing-guide-page/
├── index.html                   # Main landing page (all sections)
├── styles.css                   # Full CSS — tokens, layout, components, responsive
├── script.js                    # Vanilla JS — scroll reveal, FAQ, form, animations
├── netlify.toml                 # Netlify deployment config
├── README.md                    # This file
└── assets/
    ├── placeholder-guide-cover.svg   # Animated guide cover mockup (replace with real design)
    └── placeholder-logo.svg          # Parkhurst NuVision wordmark (replace with real logo)
```

---

## Getting Started

### Local Development

No build step required. Just open the file:

```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Serve locally with Python
python3 -m http.server 8080
# → Open http://localhost:8080

# Option 3: Use VS Code Live Server extension
# → Right-click index.html → "Open with Live Server"

# Option 4: Use npx serve
npx serve .
```

---

## Deploy to Netlify

### Option A: Netlify CLI (fastest)

```bash
npm install -g netlify-cli
netlify login
netlify deploy --dir=. --prod
```

### Option B: Netlify Dashboard (drag and drop)

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site → Deploy manually"**
3. Drag the entire `parkhurst-pricing-guide-page/` folder onto the drop zone
4. Done — you'll get a live URL in seconds

### Option C: Connect GitHub repo

1. Push this folder to a GitHub repo
2. In Netlify: **"Add new site → Import from Git"**
3. Select your repo
4. Build command: *(leave blank)*
5. Publish directory: `.`
6. Deploy

---

## Forms Setup

The form uses **Netlify Forms** by default. It's pre-configured in `index.html`:

```html
<form name="pricing-guide" data-netlify="true" ...>
```

**After deploying to Netlify:**
1. Go to your site dashboard → **Forms**
2. You should see `pricing-guide` appear after the first submission
3. Add email notifications: Forms → pricing-guide → **Form notifications**

### Connect to a CRM

See the comments in `script.js` under `/* ── FORM ENDPOINT ──`. Options include:

| CRM | Approach |
|-----|----------|
| **HubSpot** | Replace form with HubSpot embed script + form ID |
| **Salesforce** | POST to Salesforce Web-to-Lead endpoint |
| **ActiveCampaign** | Use AC's hosted form embed or API endpoint |
| **Zapier / Make** | POST form data to Zapier Webhook → connect to any CRM |
| **Mailchimp** | Replace with Mailchimp embed form |
| **Custom API** | Replace fetch URL in `script.js` with your endpoint |

---

## Analytics

Add your tracking scripts before `</head>` in `index.html`:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- Google Tag Manager (alternative) -->
<!-- Paste GTM head snippet here -->

<!-- Meta Pixel -->
<script>
  !function(f,b,e,v,n,t,s){...}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

**Conversion events** are already wired in `script.js` (`handleFormSuccess()`):

```javascript
// GA4 conversion
window.gtag('event', 'guide_download', { event_category: 'Lead' });

// Meta Pixel conversion
window.fbq('track', 'Lead', { content_name: 'Pricing Guide' });
```

---

## Customization Guide

### Brand Colors

All colors are CSS variables in `styles.css`:

```css
:root {
  --color-gold:        #c9a96e;   /* Primary brand accent */
  --color-gold-light:  #e0c48a;
  --color-bg:          #07091a;   /* Deep navy background */
  --color-text-primary: #f0ede8;  /* Warm off-white */
}
```

### Typography

Uses **Cormorant Garamond** (display/headlines) + **DM Sans** (body). To change:

```css
:root {
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'DM Sans', sans-serif;
}
```

Update the Google Fonts `<link>` in `index.html` to match.

### Phone Number

Search and replace `(210) 585-2020` and `+12105852020` with your actual number.

### Logos & Images

Replace placeholder SVGs with real assets:
- `assets/placeholder-logo.svg` → Your actual logo (SVG or PNG)
- `assets/placeholder-guide-cover.svg` → Real PDF cover mockup

For the Open Graph image, add a real image at the path in `index.html`:
```html
<meta property="og:image" content="https://yourdomain.com/assets/og-image.jpg" />
```
Recommended OG image size: **1200 × 630px**

### Sections (on/off)

Each section is labeled in `index.html` with HTML comments. To remove a section, delete from the opening comment to the closing `</section>` tag.

---

## SEO Checklist

Before going live:

- [ ] Update `<title>` and `<meta name="description">` with final copy
- [ ] Set correct `<link rel="canonical">` URL
- [ ] Update all Open Graph meta tags with real URL and image
- [ ] Replace phone number throughout
- [ ] Add real Google Analytics / GTM ID
- [ ] Verify form submits and CRM receives data
- [ ] Test on mobile (iOS + Android)
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) — target 90+ mobile
- [ ] Submit sitemap to Google Search Console (if applicable)

---

## Accessibility

- Semantic HTML5 landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`)
- All form inputs have associated `<label>` elements
- All images have `alt` attributes
- SVG icons have `aria-hidden="true"` or `aria-label`
- Focus styles visible for keyboard navigation
- Reduced motion preferences respected
- Color contrast tested for WCAG AA compliance

---

## Performance Notes

- No framework, no build step
- Fonts loaded via `preconnect` hints
- Images use `loading="eager"` (above fold) / `loading="lazy"` (below)
- CSS animations use `transform` and `opacity` (GPU-friendly)
- `prefers-reduced-motion` disables all animations
- Zero external paid dependencies

---

## Continuing in Claude Code

This project is ready to open directly in **Claude Code**:

```bash
cd parkhurst-pricing-guide-page
claude
```

Suggested next steps to refine with Claude Code:
- Swap placeholder SVGs for real assets
- Connect to HubSpot or your CRM
- Add a lightbox or PDF preview modal
- Add Google Reviews API integration
- Create a `/thank-you` page after form submit
- Add A/B test variants for the headline
- Integrate Netlify Identity if you want gated content

---

## License & Usage

Private project — Parkhurst NuVision. All rights reserved.
