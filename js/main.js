/* ================================================================
   main.js: builds the page from the info in content.js.

   You don't need to touch this file to update your portfolio:
     • words, links and projects  → js/content.js
     • colors, fonts, roundness   → css/theme.css  (or ?customize)
     • layout and spacing         → css/style.css

   If you're curious: it's plain JavaScript with no libraries. It
   reads SITE, turns it into HTML text, and drops that HTML into the
   empty spots (id="...") in index.html.
   ================================================================ */

(function () {
  "use strict";

  // If content.js has a typo, SITE never gets created. Say so
  // clearly instead of showing a blank page.
  if (typeof SITE === "undefined") {
    document.body.innerHTML =
      '<div class="oops"><strong>content.js has a typo.</strong><br>' +
      "It's usually a missing comma, quote or bracket near your last edit. " +
      "Open the browser console (Chrome: Cmd + Option + J) to see the line number.</div>";
    return;
  }

  // Give every project a URL-friendly id, e.g. "Gravity Well" → "gravity-well".
  const usedSlugs = new Set();
  const projects = (SITE.projects || []).map((p, i) => {
    let slug = slugify(p.title) || "project-" + (i + 1);
    if (usedSlugs.has(slug)) slug += "-" + (i + 1);
    usedSlugs.add(slug);
    return { ...p, title: p.title || "Untitled project", slug };
  });

  // ---------- small helpers ----------

  const byId = (id) => document.getElementById(id);

  // Makes text safe to place inside HTML (so "<" shows up as "<").
  function esc(value) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(value ?? "").replace(/[&<>"']/g, (c) => map[c]);
  }

  function slugify(text) {
    return String(text || "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  // Splits text on blank lines into <p> paragraphs.
  function paragraphs(text) {
    return String(text || "")
      .trim()
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((p) => `<p>${esc(p.replace(/\s+/g, " ").trim())}</p>`)
      .join("");
  }

  // Link attributes. Full web addresses (https://...) open in a new tab.
  function href(url, newTab = /^https?:\/\//.test(url)) {
    return ` href="${esc(url)}"` + (newTab ? ' target="_blank" rel="noopener"' : "");
  }

  function tagList(tags) {
    if (!tags || !tags.length) return "";
    return `<ul class="tags">${tags.map((t) => `<li class="tag">${esc(t)}</li>`).join("")}</ul>`;
  }

  // Cover image: your thumbnail if you set one, otherwise a generated
  // cover made from the project's color and initials.
  function cover(p, alt = "") {
    if (p.thumbnail) {
      return `<div class="art"><img src="${esc(p.thumbnail)}" alt="${esc(alt)}" loading="lazy"></div>`;
    }
    const letters = p.title.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    return `<div class="art art--generated" style="--art: ${esc(p.color || "var(--accent-2)")}">` +
      `<span class="art__glyph" aria-hidden="true">${esc(letters)}</span></div>`;
  }

  // Your links (+ résumé) as buttons. Used in the hero and contact sections.
  function linkButtons() {
    const links = [...(SITE.links || [])];
    if (SITE.resume) links.push({ label: "Résumé", url: SITE.resume, newTab: true });
    return links.map((l) => `<a class="btn"${href(l.url, l.newTab)}>${esc(l.label)}</a>`).join("");
  }

  // ---------- hero, about, contact, footer ----------

  function renderIntro() {
    document.title = `${SITE.name} | Game Portfolio`;
    byId("brand").textContent = SITE.name;
    byId("role").textContent = SITE.role;
    byId("name").textContent = SITE.name;
    byId("intro").textContent = SITE.intro;

    byId("hero-actions").innerHTML =
      '<a class="btn btn--primary" href="#projects">See my projects <span aria-hidden="true">↓</span></a>' +
      linkButtons();

    const playable = projects.filter((p) => p.play && p.embed).length;
    byId("stats").textContent =
      `${projects.length} project${projects.length === 1 ? "" : "s"}` +
      (playable ? ` · ${playable} playable right here in your browser` : "");
    byId("stats").hidden = projects.length < 3 && !playable; // a count of 1 or 2 isn't worth bragging about yet
  }

  function renderAbout() {
    byId("about-text").innerHTML = paragraphs(SITE.about);
    const skills = Object.entries(SITE.skills || {})
      .map(([group, items]) => `<div><h3 class="eyebrow">${esc(group)}</h3>${tagList(items)}</div>`)
      .join("");
    byId("skills").innerHTML = skills;
    byId("skills").hidden = !skills;

    // Nothing written yet? Hide the whole section and its link in the top bar.
    const empty = !String(SITE.about || "").trim() && !skills;
    byId("about").hidden = empty;
    document.querySelector('.nav__links a[href="#about"]').hidden = empty;
  }

  function renderContact() {
    byId("contact-note").textContent = SITE.contactNote || "";
    byId("contact-actions").innerHTML =
      (SITE.email ? `<a class="btn btn--primary" href="mailto:${esc(SITE.email)}">Email me</a>` : "") +
      linkButtons();
    byId("footer-text").textContent = `© ${new Date().getFullYear()} ${SITE.name}`;
  }

  // ---------- project cards ----------

  function renderProjects() {
    const featured = projects.find((p) => p.featured);
    const grid = byId("grid");
    grid.innerHTML = projects.map((p) => card(p, p === featured)).join("");
    grid.addEventListener("click", (e) => {
      const button = e.target.closest("[data-open]");
      if (button) openProject(projects.find((p) => p.slug === button.dataset.open));
    });
    renderFilters();
  }

  function card(p, featured) {
    const meta = [p.year, p.role].filter(Boolean).map(esc).join(" · ");
    const badges =
      (p.play && p.embed ? '<span class="badge badge--play">▶ Playable</span>' : "") +
      (p.sample ? '<span class="badge badge--sample">Sample</span>' : "");
    return `
      <article class="card${featured ? " card--featured" : ""}" data-tags="${esc((p.tags || []).join("|"))}">
        <div class="card__media">${cover(p)}<div class="badges">${badges}</div></div>
        <div class="card__body">
          ${featured ? '<p class="eyebrow">Featured</p>' : ""}
          ${meta ? `<p class="meta">${meta}</p>` : ""}
          <h3 class="card__title"><button class="card__open" data-open="${esc(p.slug)}">${esc(p.title)}</button></h3>
          ${p.tagline ? `<p class="card__tagline">${esc(p.tagline)}</p>` : ""}
          ${tagList(p.tags)}
        </div>
      </article>`;
  }

  // ---------- tag filter buttons ----------

  function renderFilters() {
    const counts = new Map();
    projects.forEach((p) => (p.tags || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    const tags = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a)); // most used first

    const bar = byId("filters");
    if (projects.length < 3 || tags.length < 2) { bar.hidden = true; return; }

    bar.innerHTML = ["All", ...tags]
      .map((t, i) => `<button class="chip" aria-pressed="${i === 0}" data-tag="${i === 0 ? "" : esc(t)}">${esc(t)}</button>`)
      .join("");

    bar.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      bar.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === chip));
      const tag = chip.dataset.tag;
      document.querySelectorAll("#grid .card").forEach((c) => {
        c.hidden = tag !== "" && !c.dataset.tags.split("|").includes(tag);
      });
    });
  }

  // ---------- project details popup ----------

  const modal = byId("modal");
  let current = null;

  function openProject(p) {
    if (!p) return;
    current = p;
    const meta = [p.year, p.role].filter(Boolean).map(esc).join(" · ");
    const playHere = p.play && p.embed;

    let media;
    if (playHere) {
      media = cover(p) +
        '<button class="play-btn" data-play><span class="play-btn__icon" aria-hidden="true">▶</span>Play in browser</button>';
    } else if (/\.(mp4|webm)$/i.test(p.video || "")) {
      // a video file in your repo, e.g. "videos/my-game.mp4"
      const poster = p.thumbnail ? ` poster="${esc(p.thumbnail)}"` : "";
      media = `<video src="${esc(p.video)}"${poster} controls playsinline preload="metadata"></video>`;
    } else if (p.video) {
      // a YouTube embed link
      media = `<iframe src="${esc(p.video)}" title="${esc(p.title)} video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    } else {
      media = cover(p, `Screenshot of ${p.title}`);
    }

    const buttons = [
      p.play ? `<a class="btn btn--primary"${href(p.play, true)}>${playHere ? "Open in new tab" : "Play"} ↗</a>` : "",
      ...(p.downloads || []).map((d, i) =>
        `<a class="btn${!p.play && i === 0 ? " btn--primary" : ""}"${href(d.url, false)}>↓ ${esc(d.label)}</a>`),
      p.code ? `<a class="btn"${href(p.code, true)}>Source code ↗</a>` : "",
      ...(p.links || []).map((l) => `<a class="btn"${href(l.url, true)}>${esc(l.label)} ↗</a>`),
    ].join("");

    const highlights = (p.highlights || []).length
      ? `<div><h3 class="eyebrow">Highlights</h3><ul class="highlights">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul></div>`
      : "";

    modal.innerHTML = `
      <div class="modal__bar"><button class="modal__close" data-close aria-label="Close">✕</button></div>
      <div class="modal__media">${media}</div>
      <div class="modal__toolbar" hidden>
        <span>Click the game if the keys don't respond.</span>
        ${document.fullscreenEnabled ? '<button class="btn btn--small" data-fullscreen>⛶ Fullscreen</button>' : ""}
      </div>
      <div class="modal__body">
        ${meta ? `<p class="meta">${meta}</p>` : ""}
        <h2 id="modal-title">${esc(p.title)}</h2>
        ${p.tagline ? `<p class="modal__tagline">${esc(p.tagline)}</p>` : ""}
        ${tagList(p.tags)}
        ${buttons ? `<div class="actions">${buttons}</div>` : ""}
        ${p.description ? `<div class="prose">${paragraphs(p.description)}</div>` : ""}
        ${highlights}
      </div>`;

    modal.showModal();
    modal.scrollTop = 0;
    history.replaceState(null, "", "#project-" + p.slug); // makes the popup shareable
  }

  // Swaps the cover for the real game. The game only loads when you
  // click Play, so the page stays fast and nothing makes noise.
  function startGame() {
    const media = modal.querySelector(".modal__media");
    media.innerHTML = `<iframe src="${esc(current.play)}" title="${esc(current.title)} (playable)" allow="fullscreen; autoplay; gamepad" allowfullscreen></iframe>`;
    const frame = media.querySelector("iframe");
    frame.addEventListener("load", () => frame.focus());
    modal.querySelector(".modal__toolbar").hidden = false;
  }

  modal.addEventListener("click", (e) => {
    const r = modal.getBoundingClientRect();
    const onBackdrop = e.target === modal &&
      (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom);
    if (onBackdrop || e.target.closest("[data-close]")) {
      modal.close();
      cleanUp();
      return;
    }
    if (e.target.closest("[data-play]")) startGame();
    if (e.target.closest("[data-fullscreen]")) modal.querySelector(".modal__media iframe")?.requestFullscreen();
  });

  // The Esc key closes the popup by itself, so tidy up on the close event too.
  modal.addEventListener("close", () => {
    if (!modal.open) cleanUp();
  });

  function cleanUp() {
    modal.innerHTML = ""; // stops any game or video that was playing
    current = null;
    if (location.hash.startsWith("#project-")) history.replaceState(null, "", location.pathname + location.search);
  }

  // A link like yoursite.com/#project-starfall opens that project directly.
  function openFromHash() {
    const match = location.hash.match(/^#project-(.+)$/);
    if (match) openProject(projects.find((p) => p.slug === decodeURIComponent(match[1])));
  }

  // ---------- go! ----------

  renderIntro();
  renderProjects();
  renderAbout();
  renderContact();
  openFromHash();
})();
