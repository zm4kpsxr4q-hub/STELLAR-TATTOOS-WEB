document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("siteSearch");
  if (!input) return;

  const itemSelector = input.dataset.searchItems;
  const status = document.getElementById("searchStatus");

  // Build the searchable text for each item once (text + image alt text)
  const searchable = Array.from(document.querySelectorAll(itemSelector)).map(item => {
    const img = item.querySelector("img");
    const text = item.textContent + " " + (img ? img.alt : "");
    return { item, text: text.toLowerCase() };
  });

  function runSearch() {
    const rawQuery = input.value.trim();
    const query = rawQuery.toLowerCase();
    let visible = 0;

    searchable.forEach(({ item, text }) => {
      const match = query === "" || text.includes(query);
      item.hidden = !match;
      if (match) visible++;

      // FAQ answers open automatically when they match
      if (item.tagName === "DETAILS") {
        item.open = query !== "" && match;
      }
    });

    // Gallery: hide a category heading when none of its items match
    document.querySelectorAll(".gallery-category").forEach(section => {
      section.hidden = section.querySelectorAll(itemSelector + ":not([hidden])").length === 0;
    });

    if (query === "") {
      status.textContent = "";
    } else if (visible === 0) {
      status.textContent = 'No results for "' + rawQuery + '". Try a different word.';
    } else {
      status.textContent = visible + (visible === 1 ? " result" : " results") + ' for "' + rawQuery + '"';
    }
  }

  input.addEventListener("input", runSearch);
});