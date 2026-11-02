# Stellar Tattoos

**Name:** Hlumelo
**Surname:** Dwenga
**Student Number:** ST10531737
**Project Overview:** A multi-page website for Stellar Tattoos, built with HTML, CSS and JavaScript. Part 3 adds interactivity, search, dynamic content, working forms and SEO.

---

## Website Goals and Objectives

The website's main goal is to invite visitors, keeping them and resulting to booked consultations while demonstrating the studio's portfolio and building strong brand trust. Objectives include increasing enquiry submissions, improving portfolio visibility, and establishing a credible online presence. Success will be measured through KPIs such as monthly consultation bookings, portfolio page engagement, and homepage bounce rate.

---

## Pages

- Home (`index.html`)
- Services, About Us, Artists, Portfolio, FAQ, Gallery, Enquiry, Contact (all in `/pages`)

---

## Part 3

### 1. Changes Based on Part 2 Feedback

- **Feedback:** [paste your lecturer's first Part 2 comment here]
  - **Action taken:** [what you changed, and on which page or file]
- **Feedback:** [paste the second comment here]
  - **Action taken:** [what you changed, and on which page or file]
- **Feedback:** [add more entries as needed]
  - **Action taken:** [...]

### 2. Interactive Elements

- **Hamburger menu:** replaces the horizontal navigation below 1024px. It toggles with JavaScript (`nav.js`), animates into an X, updates `aria-expanded`, and closes when a link is tapped.
- **Image pop-up viewer with zoom (`lightbox.js`):** clicking any artist photo, gallery image or portfolio image opens it full screen.
  - Zoom by clicking or tapping the image, using the mouse wheel, using the + / − buttons, or pinching on a touch screen.
  - Drag to move around a zoomed image, and use the reset button to return to normal size.
  - Move between images with the arrow buttons, the left/right arrow keys, or by swiping.
  - Shows the artist name and specialty (or the image caption) plus an "n / total" counter.
  - Close with the × button, the Esc key, or by clicking the dark background. Focus returns to the image that was clicked.
  - Skips any images hidden by a page search, so the viewer only cycles through what is visible.
- **Multi-step enquiry form:** three steps (Your Details, Your Enquiry, Review) with a progress indicator. A step cannot be skipped until it passes validation.
- **FAQ accordion:** native `<details>` / `<summary>` elements with a custom + / − indicator. Matching answers open automatically while searching.
- **Hover effects:** grayscale-to-colour image transitions, a zoom on gallery images, a colour tint on piercing images, and animated social icons.
- **Open / closed badge:** shows whether the studio is open, based on its opening hours.
- **Spinning logo:** disabled automatically for visitors who have "reduce motion" switched on.

### 3. Dynamic Content and Search

**Dynamic content (`main.js`)**
- Time-based greeting on the home page (Good morning / afternoon / evening). It uses South African time (`Africa/Johannesburg`), so it is correct for every visitor.
- Live open / closed status on the Home and Contact pages (Mon–Fri, 9AM–6PM).
- The footer year updates itself.

**Site-wide search (`search-data.js` and `global-search.js`)**
- A search button in the header on every page opens a search window.
- It searches a built-in index covering artists, tattoo and piercing designs, services, prices, FAQ questions, contact details and pages.
- Every word typed must match. Matches in a title rank higher than matches in a description, and plurals are handled (for example, "prices" finds "price").
- Results show a thumbnail, a category tag and a short description, and link to the right page.
- Keyboard support: arrow keys to move through results, Enter to open one, Esc to close, and `/` or Ctrl+K to open search from anywhere.
- Suggestion chips (price, watercolor, Ashley, aftercare, piercing, hours) appear when the box is empty.

**Home page search bar (`home-search.js`)**
- A search box and suggestion chips on the home page that open the site-wide search with the query filled in.

**Page-level search (`search.js`)**
- A live filter box on the Artists, Portfolio, Gallery, FAQ and Services pages.
- It hides non-matching items as the user types, shows a result count, shows a "No results" message when nothing matches, and hides empty gallery headings.

### 4. SEO

- **Unique title tag on every page**, with the main keyword near the front:
  - Home: Stellar Tattoos | Custom Tattoo & Piercing Studio in Cape Town
  - Services: Tattoo & Piercing Services | Stellar Tattoos
  - About Us: About Us | Stellar Tattoos
  - Artists: Our Tattoo Artists | Stellar Tattoos
  - Portfolio: Tattoo & Piercing Portfolio | Stellar Tattoos
  - Gallery: Tattoo Gallery | Stellar Tattoos
  - FAQ: Tattoo FAQ | Stellar Tattoos
  - Enquiry: Make an Enquiry | Stellar Tattoos
  - Contact: Contact Us | Stellar Tattoos
- **Meta keywords on every page**, chosen per page (for example "tattoo studio Cape Town", "custom tattoo design", "tattoo aftercare"). Google no longer uses this tag for ranking, but it is included as required by the module.
- **Unique meta description on every page**, written as the snippet shown under the title in search results.
- Meta author and viewport tags on every page.
- One `<h1>` per page with `<h2>` / `<h3>` below it, descriptive `alt` text on images, and internal links through the navigation.
- `loading="lazy"` on images below the fold, to improve page speed.
- `lang="en"` on every page.

### 5. Form Functionality: Contact Controls

- Text, email and telephone inputs, a number input (budget), dropdowns (preferred artist, project type), a textarea, **radio buttons** (preferred contact method: Email, Phone call, WhatsApp) and a **checkbox** (consent to use details).
- Every control has a visible `<label>` linked with `for` / `id`.
- Helpful `autocomplete` attributes, placeholders and consistent styling, with visible focus states.
- The consent checkbox supports South Africa's POPIA requirements, because visitors agree to how their details are used.

### 6. Form Validation (`validation.js`)

Custom validation with clear, specific error messages shown under each field. It is shared by the Enquiry and Contact forms.

- **Name:** required, letters, spaces, hyphens and apostrophes only, at least 2 characters.
- **Email:** required and must be a valid format.
- **Phone:** required and must be a valid South African number (for example 082 123 4567 or +27 82 123 4567).
- **Budget:** required, numeric, and at least R200 (the studio's lowest starting price).
- **Idea / message:** required, at least 10 characters.
- **Project type and contact method:** must be chosen.
- **Contact method checks:**
  - Phone call: the phone number from step 1 must be valid.
  - WhatsApp: the number must be a mobile number (06, 07 or 08), because a landline cannot have WhatsApp.
  - Email: the email address from step 1 must be valid.
- **Consent:** the box must be ticked before submitting.
- Fields are checked when the user leaves them, and re-checked as they type to fix a mistake. Errors are announced to screen readers (`role="alert"`, `aria-invalid`, `aria-describedby`).
- Native browser pop-ups are switched off (`novalidate`) so the custom messages are used instead.

### 7. Form Response and Email Delivery

- Enquiry and contact details are emailed to the studio using **EmailJS**, with the visitor's email set as the reply-to address.
- The submit button is disabled and changes to "Sending..." while the email is on its way, which prevents duplicate submissions.
- A clear success message (using the visitor's name) or an error message appears on the page. `alert()` pop-ups were removed.
- The review step is built with `textContent`, so typed text can never be run as HTML.

### 8. Visual and Design Updates

- **Hero emblem:** the white square was removed by cropping the emblem into a circle. A bronze rim, soft glow, warm colour treatment, orbit ring and four small stars are drawn with CSS only, so the layout is unchanged. This replaced the earlier `mix-blend-mode: multiply` approach.
- **Artists page:** the polaroid frames were replaced with full-photo cards. The name and specialty sit over a fade at the bottom, with a terracotta accent line. Photos are black and white until hovered.
- **Click-to-enlarge hint:** a small magnifier icon appears on images on hover (always visible on touch devices).
- **Typography:** Google Fonts (Inter for body text, Playfair Display for headings) linked on all 9 pages.
- **Footer icons:** Font Awesome added to every page so the social icons display.
- **Stylesheet clean-up:** duplicate rules merged, and responsive rules kept at the bottom of the file.

### 9. Responsive Design

A mobile-first system with three tiers:
- **Desktop (1024px and up):** default styles. The original horizontal navigation is kept.
- **Tablet (up to 1024px):** `.hero` becomes one column; `.services-grid`, `.portfolio-grid` and `.artist-grid` drop from 3 to 2 columns; `.feature-grid` drops from 4 to 2 columns; the hamburger menu appears.
- **Mobile (up to 600px):** all grids become one column and `.service-row` stacks vertically.
- **Spacing and type (up to 768px):** side padding reduced from 40px to 20px, and headings scaled down (h1: 2.6rem to 1.9rem, section h2s about 2.2rem to 1.7rem). The step labels on the enquiry form's progress indicator are hidden, leaving the numbered circles.
- A sticky-header stacking fix (`z-index: 100`) so scrolled content never covers the navigation.

### 10. Accessibility

- Keyboard access for the menu, search, image viewer and forms, with visible focus outlines.
- Labels for all form fields, `aria-live` regions for search results and form messages, and screen-reader-only labels on search boxes.
- Focus is kept inside the search window and image viewer while they are open.
- `prefers-reduced-motion` respected.

---

## Changelog

### Part 3
- Added hamburger navigation, tablet and mobile breakpoints, and the header stacking fix.
- Added site-wide search, a home page search bar, and page-level search on five pages.
- Added the image pop-up viewer with zoom for artist, gallery and portfolio images.
- Added the time-based greeting, open / closed badge and automatic footer year.
- Added unique titles, meta descriptions and meta keywords to all 9 pages.
- Added radio buttons and a consent checkbox to the forms.
- Added custom validation with specific error messages, including contact-method checks.
- Connected both forms to EmailJS and replaced `alert()` with on-page messages.
- Replaced the white-square hero emblem with a circular bronze-coin treatment.
- Replaced the polaroid artist frames with photo cards.
- Added Google Fonts and Font Awesome to every page.
- Merged duplicate CSS rules into one clean stylesheet.

---

## How to Test the Part 3 Features

- **Search:** click the magnifier in the header and try `price`, `watercolor`, `ashley` and `aftercare`. Try a nonsense word to see the "No results" message.
- **Page search:** type `piercing` on the Portfolio page, or `heal` on the FAQ page.
- **Image viewer:** click any artist or gallery image, then click it again to zoom, drag to move, and use the arrow keys to move between images.
- **Validation:** on the Enquiry page, leave fields empty, enter a landline number and choose WhatsApp, or enter a budget below R200.
- **Email:** submit a valid enquiry and check the studio inbox for the message.
- **Responsive:** resize the browser through desktop, tablet and phone widths and open the hamburger menu.

---

## Files Touched

- `assets/css/styles.css`: responsive overhaul, search, image viewer, form and hero styles
- `assets/js/nav.js`: hamburger menu
- `assets/js/main.js`: greeting, open / closed badge, footer year, contact form
- `assets/js/enquiry.js`: multi-step enquiry form and email sending
- `assets/js/validation.js`: shared validation rules and messages
- `assets/js/search.js`: page-level search filter
- `assets/js/search-data.js`: site-wide search index
- `assets/js/global-search.js`: site-wide search window
- `assets/js/home-search.js`: home page search bar
- `assets/js/lightbox.js`: image pop-up viewer with zoom
- All 9 HTML pages: SEO tags, new header, Google Fonts, Font Awesome and script tags
- `artist.html`, `gallery.html`, `portfolio.html`, `services.html`, `faq.html`: search boxes
- `enquiry.html` and `contact.html`: new form controls and message areas

---

## References

### Design Inspiration
- Pinterest. *["Dark tattoo studio website design"]*.
- Pinterest. *["Polaroid photo hover effects"]*.
- toolsoftradestudios.com. (n.d.). Referenced for hero CTA layout, embedded map placement, and booking form structure.

### Technical Documentation
- MDN Web Docs. (n.d.). *CSS mix-blend-mode*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode
- MDN Web Docs. (n.d.). *CSS Grid Layout*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
- MDN Web Docs. (n.d.). *Using media queries*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
- MDN Web Docs. (n.d.). *position: sticky*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/CSS/position
- MDN Web Docs. (n.d.). *clip-path*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path
- MDN Web Docs. (n.d.). *Pointer events*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
- MDN Web Docs. (n.d.). *The details disclosure element*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
- MDN Web Docs. (n.d.). *Client-side form validation*. Retrieved from https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation
- MDN Web Docs. (n.d.). *Date.prototype.toLocaleString()*. Retrieved from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
- W3C. (n.d.). *Dialog (Modal) Pattern, WAI-ARIA Authoring Practices Guide*. Retrieved from https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- Google Search Central. (n.d.). *Meta tags that Google understands*. Retrieved from https://developers.google.com/search/docs/crawling-indexing/special-tags
- EmailJS. (n.d.). *EmailJS documentation*. Retrieved from https://www.emailjs.com/docs/
- Google Fonts. (n.d.). Retrieved from https://fonts.google.com
- Font Awesome. (n.d.). Retrieved from https://fontawesome.com
- Google Maps Embed API. (n.d.). Retrieved from https://developers.google.com/maps/documentation/embed/get-started
