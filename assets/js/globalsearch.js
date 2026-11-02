document.addEventListener("DOMContentLoaded", () => {
  if (typeof SEARCH_DATA === "undefined") return;

  const header = document.querySelector("header");
  if (!header) return;

  // ===== 1. Add the search button to the header =====
  const actions = document.createElement("div");
  actions.className = "header-actions";

  const searchBtn = document.createElement("button");
  searchBtn.type = "button";
  searchBtn.className = "search-btn";
  searchBtn.setAttribute("aria-label", "Open search");
  searchBtn.setAttribute("aria-haspopup", "dialog");
  searchBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>';

  // Sit next to the hamburger button, which keeps working as before
  const navToggle = document.getElementById("navToggle");
  if (navToggle) {
    navToggle.parentNode.insertBefore(actions, navToggle);
    actions.appendChild(searchBtn);
    actions.appendChild(navToggle);
  } else {
    actions.appendChild(searchBtn);
    header.appendChild(actions);
  }

  // ===== 2. Build the search overlay =====
  const overlay = document.createElement("div");
  overlay.className = "search-overlay";
  overlay.hidden = true;
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Search the website");
  overlay.innerHTML = `
    <div class="search-panel">
      <div class="search-panel-head">
        <input type="search" id="globalSearchInput" placeholder="Search designs, prices, artists..." autocomplete="off" aria-label="Search the website">
        <button type="button" class="search-close" aria-label="Close search">&times;</button>
      </div>
      <p class="global-search-status" aria-live="polite"></p>
      <ul class="search-results"></ul>
      <div class="search-suggestions"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector("#globalSearchInput");
  const closeBtn = overlay.querySelector(".search-close");
  const statusEl = overlay.querySelector(".global-search-status");
  const resultsEl = overlay.querySelector(".search-results");
  const suggestionsEl = overlay.querySelector(".search-suggestions");

  // Clickable ideas shown when the box is empty
  ["watercolor", "price", "Ashley", "aftercare", "piercing", "hours"].forEach(word => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "search-chip";
    chip.textContent = word;
    chip.addEventListener("click", () => {
      input.value = word;
      runSearch();
      input.focus();
    });
    suggestionsEl.appendChild(chip);
  });

  let lastFocused = null;
  let activeIndex = -1;

  // ===== 3. Open / close =====
  function openSearch() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    searchBtn.setAttribute("aria-expanded", "true");
    input.focus();
    runSearch();
  }

  function closeSearch() {
    overlay.hidden = true;
    document.body.style.overflow = "";
    searchBtn.setAttribute("aria-expanded", "false");
    if (lastFocused) lastFocused.focus();
  }

  searchBtn.addEventListener("click", openSearch);
  closeBtn.addEventListener("click", closeSearch);

  // Clicking the dark area outside the panel closes it
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSearch();
  });

  // ===== 4. The search itself =====
  // Strips a trailing "s" so "tattoos" finds "tattoo" and "prices" finds "price"
  function normalise(word) {
    return word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word;
  }

  function search(query) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean).map(normalise);
    if (words.length === 0) return [];

    const scored = [];

    SEARCH_DATA.forEach(entry => {
      const title = entry.title.toLowerCase();
      const body = (entry.category + " " + entry.text).toLowerCase();
      let score = 0;

      // Every word the user typed has to match somewhere
      for (const w of words) {
        const inTitle = title.includes(w);
        const inBody = body.includes(w);
        if (!inTitle && !inBody) return;

        if (inTitle) score += 3;
        if (inBody) score += 1;
        if (title.startsWith(w)) score += 2;
      }

      scored.push({ entry, score });
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8).map(item => item.entry);
  }

  function renderResults(results, rawQuery) {
    resultsEl.innerHTML = "";
    activeIndex = -1;

    results.forEach(entry => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = entry.url;
      link.className = "search-result";

      if (entry.image) {
        const img = document.createElement("img");
        img.src = entry.image;
        img.alt = "";
        img.loading = "lazy";
        link.appendChild(img);
      }

      const textBox = document.createElement("span");
      textBox.className = "search-result-text";

      const title = document.createElement("strong");
      title.textContent = entry.title;

      const tag = document.createElement("span");
      tag.className = "search-tag";
      tag.textContent = entry.category;

      const desc = document.createElement("span");
      desc.className = "search-desc";
      desc.textContent = entry.text;

      title.appendChild(tag);
      textBox.appendChild(title);
      textBox.appendChild(desc);
      link.appendChild(textBox);

      // If the result is on the page you're already on, just close the overlay
      link.addEventListener("click", closeSearch);

      li.appendChild(link);
      resultsEl.appendChild(li);
    });

    if (rawQuery === "") {
      statusEl.textContent = "Search tattoo designs, prices, artists, FAQs and contact info.";
    } else if (results.length === 0) {
      statusEl.textContent = 'No results for "' + rawQuery + '". Try another word, like "price" or "watercolor".';
    } else {
      statusEl.textContent = results.length + (results.length === 1 ? " result" : " results") + ' for "' + rawQuery + '"';
    }

    suggestionsEl.hidden = rawQuery !== "";
  }

  function runSearch() {
    const rawQuery = input.value.trim();
    renderResults(search(rawQuery), rawQuery);
  }

  input.addEventListener("input", runSearch);

  // ===== 5. Keyboard support =====
  function setActive(index) {
    const links = resultsEl.querySelectorAll(".search-result");
    if (links.length === 0) return;

    activeIndex = (index + links.length) % links.length;
    links.forEach((link, i) => link.classList.toggle("active", i === activeIndex));
    links[activeIndex].scrollIntoView({ block: "nearest" });
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(activeIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(activeIndex - 1);
    } else if (e.key === "Enter") {
      const links = resultsEl.querySelectorAll(".search-result");
      const target = links[activeIndex >= 0 ? activeIndex : 0];
      if (target) target.click();
    }
  });

  document.addEventListener("keydown", (e) => {
    // Esc closes the overlay
    if (e.key === "Escape" && !overlay.hidden) {
      closeSearch();
      return;
    }

    // Keep Tab inside the overlay while it's open
    if (e.key === "Tab" && !overlay.hidden) {
      const focusable = overlay.querySelectorAll("input, button, a[href]");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }

    // "/" or Ctrl+K opens search (unless the user is typing in a field)
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    const wantsOpen = (e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k");

    if (wantsOpen && overlay.hidden) {
      e.preventDefault();
      openSearch();
    }
  });

});