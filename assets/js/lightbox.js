document.addEventListener("DOMContentLoaded", () => {

  // Every clickable picture: artist cards (Artists page) and grid items (Gallery + Portfolio)
  const triggers = Array.from(document.querySelectorAll(".artist-card, .hover-item"));
  if (triggers.length === 0) return;

  const MAX_SCALE = 4;    // furthest you can zoom in
  const CLICK_ZOOM = 2.5; // how far one click or tap zooms in

  // ===== Build the pop-up viewer =====
  const box = document.createElement("div");
  box.className = "lightbox";
  box.hidden = true;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Image viewer");
  box.innerHTML = `
    <div class="lightbox-toolbar">
      <span class="lightbox-count" aria-live="polite"></span>
      <div class="lightbox-tools">
        <button type="button" class="lb-btn" data-action="zoom-out" aria-label="Zoom out">&minus;</button>
        <button type="button" class="lb-btn" data-action="zoom-in" aria-label="Zoom in">+</button>
        <button type="button" class="lb-btn" data-action="reset" aria-label="Reset zoom"><i class="fa-solid fa-expand" aria-hidden="true"></i></button>
        <button type="button" class="lb-btn" data-action="close" aria-label="Close image viewer">&times;</button>
      </div>
    </div>
    <div class="lightbox-stage">
      <button type="button" class="lightbox-nav prev" data-action="prev" aria-label="Previous image">&#8249;</button>
      <img class="lightbox-img" alt="" draggable="false">
      <button type="button" class="lightbox-nav next" data-action="next" aria-label="Next image">&#8250;</button>
    </div>
    <div class="lightbox-caption"><strong></strong><span></span></div>
  `;
  document.body.appendChild(box);

  const stage = box.querySelector(".lightbox-stage");
  const img = box.querySelector(".lightbox-img");
  const count = box.querySelector(".lightbox-count");
  const titleEl = box.querySelector(".lightbox-caption strong");
  const subEl = box.querySelector(".lightbox-caption span");
  const prevBtn = box.querySelector('[data-action="prev"]');
  const nextBtn = box.querySelector('[data-action="next"]');
  const closeBtn = box.querySelector('[data-action="close"]');

  // ===== State =====
  let items = [];      // pictures that are visible while the viewer is open (search can hide some)
  let index = 0;       // which one is showing
  let scale = 1;       // current zoom
  let tx = 0;          // sideways shift when zoomed in
  let ty = 0;          // up/down shift when zoomed in
  let lastFocused = null;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  // Stops you dragging a zoomed picture completely out of view
  function limitPan() {
    const maxX = Math.max(0, (img.clientWidth * scale - stage.clientWidth) / 2);
    const maxY = Math.max(0, (img.clientHeight * scale - stage.clientHeight) / 2);
    tx = clamp(tx, -maxX, maxX);
    ty = clamp(ty, -maxY, maxY);
  }

  function render() {
    limitPan();
    img.style.transform = "translate(" + tx + "px, " + ty + "px) scale(" + scale + ")";
    img.classList.toggle("zoomed", scale > 1);
  }

  // Zooms in or out, keeping the point under the cursor (px, py from the stage centre) in place
  function zoomTo(newScale, px = 0, py = 0) {
    newScale = clamp(newScale, 1, MAX_SCALE);

    if (newScale === 1) {
      tx = 0;
      ty = 0;
    } else {
      const ratio = newScale / scale;
      tx = px - (px - tx) * ratio;
      ty = py - (py - ty) * ratio;
    }

    scale = newScale;
    render();
  }

  // Position of a pointer relative to the centre of the stage
  function relPoint(e) {
    const r = stage.getBoundingClientRect();
    return { x: e.clientX - (r.left + r.width / 2), y: e.clientY - (r.top + r.height / 2) };
  }

  // ===== Show a picture =====
  function show(i) {
    index = (i + items.length) % items.length;

    const figure = items[index];
    const source = figure.querySelector("img");
    const cap = figure.querySelector("figcaption");
    const strong = cap ? cap.querySelector("strong") : null;

    // Artist captions have a bold name plus a line underneath; gallery captions are plain text
    const title = strong ? strong.textContent.trim() : (cap ? cap.textContent.trim() : source.alt);
    const sub = strong ? cap.textContent.replace(strong.textContent, "").trim() : "";

    img.src = source.currentSrc || source.src;
    img.alt = source.alt;
    titleEl.textContent = title;
    subEl.textContent = sub;
    count.textContent = (index + 1) + " / " + items.length;

    prevBtn.hidden = items.length < 2;
    nextBtn.hidden = items.length < 2;

    scale = 1;
    tx = 0;
    ty = 0;
    render();
  }

  function open(figure) {
    // Skip anything hidden by the search box
    items = triggers.filter(t => !t.closest("[hidden]"));
    const start = items.indexOf(figure);

    lastFocused = document.activeElement;
    box.hidden = false;
    document.body.style.overflow = "hidden";
    show(start < 0 ? 0 : start);
    closeBtn.focus();
  }

  function close() {
    box.hidden = true;
    document.body.style.overflow = "";
    img.removeAttribute("src");
    if (lastFocused) lastFocused.focus();
  }

  // ===== Make every picture clickable (and usable from the keyboard) =====
  triggers.forEach(figure => {
    const pic = figure.querySelector("img");
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", "View larger image: " + (pic ? pic.alt : ""));

    figure.addEventListener("click", () => open(figure));
    figure.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(figure);
      }
    });
  });

  // ===== Buttons and clicking the dark background =====
  box.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");

    if (btn) {
      const action = btn.dataset.action;
      if (action === "close") close();
      else if (action === "prev") show(index - 1);
      else if (action === "next") show(index + 1);
      else if (action === "zoom-in") zoomTo(scale * 1.5);
      else if (action === "zoom-out") zoomTo(scale / 1.5);
      else if (action === "reset") zoomTo(1);
      return;
    }

    if (e.target === box || e.target === stage) close();
  });

  // ===== Mouse wheel zoom =====
  stage.addEventListener("wheel", (e) => {
    e.preventDefault();
    const p = relPoint(e);
    zoomTo(scale * (e.deltaY < 0 ? 1.2 : 1 / 1.2), p.x, p.y);
  }, { passive: false });

  // ===== Click/tap to zoom, drag to move around, pinch to zoom, swipe for next/previous =====
  const pointers = new Map();
  let dragStart = null;
  let moved = false;
  let pinched = false;
  let lastPinchDist = 0;

  function pinchInfo() {
    const [a, b] = Array.from(pointers.values());
    return {
      dist: Math.hypot(a.x - b.x, a.y - b.y),
      midX: (a.x + b.x) / 2,
      midY: (a.y + b.y) / 2
    };
  }

  img.addEventListener("pointerdown", (e) => {
    img.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 1) {
      dragStart = { x: e.clientX, y: e.clientY, tx: tx, ty: ty };
      moved = false;
      pinched = false;
    } else if (pointers.size === 2) {
      pinched = true;
      dragStart = null;
      lastPinchDist = pinchInfo().dist;
    }
  });

  img.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2) {
      const info = pinchInfo();
      const r = stage.getBoundingClientRect();
      zoomTo(
        scale * (info.dist / lastPinchDist),
        info.midX - (r.left + r.width / 2),
        info.midY - (r.top + r.height / 2)
      );
      lastPinchDist = info.dist;
      return;
    }

    if (pointers.size === 1 && dragStart) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;

      if (scale > 1 && moved) {
        img.classList.add("dragging");
        tx = dragStart.tx + dx;
        ty = dragStart.ty + dy;
        render();
      }
    }
  });

  function endPointer(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    img.classList.remove("dragging");

    if (pointers.size > 0) return; // one finger still down after a pinch

    const start = dragStart;
    dragStart = null;
    if (!start || pinched || e.type === "pointercancel") return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    if (!moved) {
      // A plain click or tap: zoom in where you clicked, or back out if already zoomed
      if (scale > 1) {
        zoomTo(1);
      } else {
        const p = relPoint(e);
        zoomTo(CLICK_ZOOM, p.x, p.y);
      }
    } else if (scale === 1 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      // Swipe left for next, right for previous
      show(index + (dx < 0 ? 1 : -1));
    }
  }

  img.addEventListener("pointerup", endPointer);
  img.addEventListener("pointercancel", endPointer);

  // ===== Keyboard =====
  // Capture phase, so the site-wide search shortcuts ("/" and Ctrl+K) don't fire behind the viewer
  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    e.stopPropagation();

    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowRight") {
      show(index + 1);
    } else if (e.key === "ArrowLeft") {
      show(index - 1);
    } else if (e.key === "+" || e.key === "=") {
      zoomTo(scale * 1.5);
    } else if (e.key === "-") {
      zoomTo(scale / 1.5);
    } else if (e.key === "0") {
      zoomTo(1);
    } else if (e.key === "Tab") {
      // Keep Tab inside the viewer
      const focusable = Array.from(box.querySelectorAll("button")).filter(b => !b.hidden);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, true);

  window.addEventListener("resize", () => {
    if (!box.hidden) render();
  });

});