## Name: Hlumelo
## Surname: Dwenga
-------------------------------------------------------------------------------
## Student Number: ST10531737
## Project Overview: Creating the structure using HTML for Stellar Tattoos
--------------------------------------------------------------------------------
## Website goals and Objectives:
The website’s main goal is to invite visitors, keeping them and resulting to booked consultations while demonstrating the studio’s portfolio and building strong brand trust. Objectives include increasing enquiry submissions, improving portfolio visibility, and establishing a credible online presence. Success will be measured through KPIs such as monthly consultation bookings, portfolio page engagement, and homepage bounce rate.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------
## Responsive Design & Recent Updates
 Navigation
Added a hamburger menu (`.nav-toggle`) that replaces the horizontal nav below 1024px (tablet/mobile), toggled via `nav.js`. Nav auto-closes when a link is tapped.
 Desktop view (1024px+) keeps the original horizontal nav unchanged.
   Fixed a stacking issue where scrolled page content rendered on top of the sticky header by adding `z-index: 100` to `header`.
------------------------------------------------------------------------------------------------------------------------------------------------------------------
### Responsive Breakpoints
Implemented a mobile-first responsive system using three tiers:
 Desktop:default styles (1024px+)
 Tablet (≤1024px): `.hero` collapses to 1 column; `.services-grid`, `.portfolio-grid`, and `.artist-grid` drop from 3 to 2 columns; `.feature-grid` drops from 4 to 2 columns
 **Mobile (≤600px):** all grids above collapse to 1 column; `.service-row` stacks vertically
------------------------------------------------------------------------------------------------------------------------------------------------------------------
### Mobile Spacing & Typography (≤768px)
Reduced side padding across major sections (hero, services, portfolio, FAQ, etc.) from 40px to 20px
  Scaled down heading font sizes (h1: 2.6rem → 1.9rem, section h2s: ~2.2rem → 1.7rem) to prevent awkward wrapping on narrow screens
 Hid text labels in the enquiry form's step progress indicator on mobile, keeping just the numbered circles
------------------------------------------------------------------------------------------------------------------------------------------------------------------
### Visual Fixes
Removed the white background from the homepage hero emblem image using `mix-blend-mode: multiply` on `.hero-image img`, blending white pixels into the dark page background without needing a new transparent image file
-----------------------------------------------------------------------------------------------------------------------------------------------------------------
### Typography
 Integrated Google Fonts (linked in `<head>` on all 9 pages) for custom heading/body typefaces, replacing the default system font stack
-----------------------------------------------------------------------------------------------------------------------------------------------------------------
### Files touched
assets/css/styles.css` — full responsive overhaul + hero image fix
 `assets/js/nav.js` — new file, handles hamburger toggle logic
 All 9 HTML pages — added `.nav-toggle` button + `id="mainNav"`, added `<script src="/assets/js/nav.js">`, added Google Fonts `<link>` tags
-----------------------------------------------------------------------------------------------------------------------------------------------------------------
 ## References

### Design Inspiration
Pinterest. *[ "Dark tattoo studio website design"]*. 
  Pinterest. *[ "Polaroid photo hover effects"]*. 
 toolsoftradestudios.com. (n.d.). Referenced for hero CTA layout, embedded map placement, and booking form structure.
----------------------------------------------------------------------------------------------------------------------------------------------------------------
### Technical Documentation
 MDN Web Docs. (n.d.). *CSS mix-blend-mode*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode
 MDN Web Docs. (n.d.). *CSS Grid Layout*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
 MDN Web Docs. (n.d.). *Using media queries*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
 MDN Web Docs. (n.d.). *position: sticky*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/CSS/position
 Google Fonts. (n.d.). Retrieved from https://fonts.google.com
 Google Maps Embed API. (n.d.). Retrieved from https://developers.google.com/maps/documentation/embed/get-started
 ----------------------------------------------------------------------------------------------------------------------------------------------------------------



Feel free to trim sections that don't apply yet (e.g. if you haven't actually added the Google Fonts link to all 9 pages, adjust that line to match reality) — this is meant as a starting draft based on everything we've worked through in this conversation.
