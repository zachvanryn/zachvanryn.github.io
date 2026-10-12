/* ================================================================
   customizer.js: a small visual theme editor for this site.
   It only appears when the address ends in ?customize, so visitors
   never see it.

     On your computer:  .../index.html?customize
     On the live site:  https://zachvanryn.github.io/?customize

   Changes preview instantly but only in YOUR browser. To make them
   permanent, click "Download theme.css" and replace css/theme.css.
   ================================================================ */

(function () {
  "use strict";
  if (!new URLSearchParams(location.search).has("customize")) return;

  // Google Fonts you can pick from. To add one, copy its name from
  // fonts.google.com and add a line: "Name": { url: "Name:wght@400;700", fallback: "sans-serif" }
  const FONTS = {
    "Space Grotesk": { url: "Space+Grotesk:wght@400;500;700", fallback: "sans-serif" },
    "Inter": { url: "Inter:wght@400;500;600;700", fallback: "sans-serif" },
    "DM Sans": { url: "DM+Sans:wght@400;500;700", fallback: "sans-serif" },
    "Sora": { url: "Sora:wght@400;600;700", fallback: "sans-serif" },
    "Outfit": { url: "Outfit:wght@400;500;700", fallback: "sans-serif" },
    "Fraunces": { url: "Fraunces:wght@400;600;700", fallback: "serif" },
    "JetBrains Mono": { url: "JetBrains+Mono:wght@400;600", fallback: "monospace" },
    "Silkscreen": { url: "Silkscreen:wght@400;700", fallback: "monospace" },
    "Press Start 2P": { url: "Press+Start+2P", fallback: "monospace" },
    "system-ui": { url: "", fallback: "sans-serif" },
  };

  // [CSS variable, label in the panel, comment in theme.css]
  const COLORS = [
    ["--bg", "Background", "page background"],
    ["--surface", "Surface", "cards, panels"],
    ["--border", "Border", "outlines"],
    ["--text", "Text", "main text"],
    ["--muted", "Muted text", "secondary text"],
    ["--accent", "Accent", "buttons, highlights"],
    ["--on-accent", "On accent", "text on top of the accent color"],
    ["--accent-2", "Accent 2", "glows, default cover art"],
  ];

  // Colors are in the same order as COLORS above.
  const PRESETS = {
    Midnight: { colors: ["#0b0d12", "#131722", "#242a3a", "#e9ecf3", "#8a93a8", "#8bf5a8", "#0b0d12", "#8b7bff"], heading: "Space Grotesk", body: "Inter", radius: 14 },
    Paper: { colors: ["#f5f2ea", "#ffffff", "#e2ddd0", "#1d1b16", "#6f6a5f", "#d9480f", "#ffffff", "#4263eb"], heading: "Fraunces", body: "DM Sans", radius: 10 },
    Arcade: { colors: ["#130b22", "#1d1233", "#3a2463", "#f6edff", "#ab95cf", "#ff4fd8", "#130b22", "#3df5ff"], heading: "Silkscreen", body: "Space Grotesk", radius: 4 },
    Terminal: { colors: ["#070b07", "#0d150d", "#1e321f", "#d4f7d4", "#7ea67e", "#39ff88", "#070b07", "#ffb000"], heading: "JetBrains Mono", body: "JetBrains Mono", radius: 2 },
  };

  const root = document.documentElement;
  const DRAFT_KEY = "portfolio-theme-draft";

  // ---------- reading + writing theme values ----------

  // Turns any CSS color ("rgb(...)", "teal", "#ABC") into "#aabbcc".
  const probe = document.createElement("canvas").getContext("2d");
  function toHex(color) {
    probe.fillStyle = "#000000";
    probe.fillStyle = color || "#000000";
    return /^#[0-9a-f]{6}$/i.test(probe.fillStyle) ? probe.fillStyle : "#000000";
  }

  function firstFamily(stack) {
    const name = (stack.match(/^\s*["']?([^"',]+)/) || [, "system-ui"])[1].trim();
    if (!FONTS[name]) FONTS[name] = { url: name.replace(/ /g, "+"), fallback: "sans-serif" };
    return name;
  }

  function fontValue(name) {
    return name === "system-ui" ? "system-ui, sans-serif" : `"${name}", ${FONTS[name].fallback}`;
  }

  function readTheme() {
    const css = getComputedStyle(root);
    const get = (name) => css.getPropertyValue(name).trim();
    return {
      colors: COLORS.map(([name]) => toHex(get(name))),
      heading: firstFamily(get("--font-heading")),
      body: firstFamily(get("--font-body")),
      radius: parseInt(get("--radius"), 10) || 0,
    };
  }

  function loadDraft() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY)); } catch { return null; }
  }
  function saveDraft(s) {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(s)); } catch { /* private mode: fine */ }
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* fine */ }
  }

  function loadFont(name) {
    const font = FONTS[name];
    if (!font || !font.url || document.querySelector(`link[data-font="${name}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.url}&display=swap`;
    link.dataset.font = name;
    document.head.appendChild(link);
  }

  // Writes the theme onto the page (as inline CSS variables) so you see it live.
  function apply() {
    COLORS.forEach(([name], i) => root.style.setProperty(name, state.colors[i]));
    root.style.setProperty("--font-heading", fontValue(state.heading));
    root.style.setProperty("--font-body", fontValue(state.body));
    root.style.setProperty("--radius", state.radius + "px");
    loadFont(state.heading);
    loadFont(state.body);
    saveDraft(state);
    panel.querySelector("textarea").value = buildCss();
  }

  // The text of a new theme.css, in the same layout as the original file.
  function buildCss() {
    const families = [...new Set([state.heading, state.body, "JetBrains Mono"])]
      .map((f) => FONTS[f] && FONTS[f].url)
      .filter(Boolean)
      .map((u) => "family=" + u)
      .join("&");
    const line = (decl, note) => `  ${decl.padEnd(24)}/* ${note} */`;
    return `/* ================================================================
   theme.css: your design tokens (colors, fonts, roundness).
   Every color and font on the site comes from these variables,
   so changing one value here restyles the whole page.

   Easiest way to change it:
     1. Open the site with ?customize on the end of the address
        (e.g. index.html?customize) and play with the panel.
     2. Click "Download theme.css" and replace this file with it.

   Coming from Figma? Select a layer, copy the hex code from its
   Fill (e.g. #7C5CFF) and paste it as a value below.
   ================================================================ */

${families ? `@import url("https://fonts.googleapis.com/css2?${families}&display=swap");\n\n` : ""}:root {
${COLORS.map(([name, , note], i) => line(`${name}: ${state.colors[i]};`, note)).join("\n")}

  --font-heading: ${fontValue(state.heading)};
  --font-body: ${fontValue(state.body)};
  --font-mono: "JetBrains Mono", monospace;

${line(`--radius: ${state.radius}px;`, "corner roundness: 0 = sharp, 24px = very round")}
}
`;
  }

  // ---------- the panel ----------

  const style = document.createElement("style");
  style.textContent = `
    .tz { position: fixed; z-index: 1000; right: 16px; bottom: 16px; width: 310px; max-height: calc(100vh - 32px);
      display: flex; flex-direction: column; background: #16181d; color: #e8e8ea; border: 1px solid #2c2f37;
      border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,.5); font: 13px/1.4 system-ui, -apple-system, sans-serif; }
    .tz * { box-sizing: border-box; }
    .tz__head { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px 10px 14px; border-bottom: 1px solid #2c2f37; }
    .tz.is-collapsed .tz__head { border-bottom: 0; }
    .tz.is-collapsed .tz__body { display: none; }
    .tz__body { display: grid; gap: 8px; padding: 12px 14px 14px; overflow: auto; }
    .tz__hint { margin: 0; color: #9aa0ab; font-size: 12px; }
    .tz__label { margin-top: 6px; color: #9aa0ab; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; }
    .tz__label span { letter-spacing: 0; text-transform: none; }
    .tz__row { display: grid; grid-template-columns: 1fr 84px 32px; align-items: center; gap: 8px; }
    .tz__row--font { grid-template-columns: 1fr 170px; }
    .tz__row--range { grid-template-columns: 1fr 44px; }
    .tz input[type=text], .tz select { width: 100%; height: 28px; padding: 0 8px; border: 1px solid #343843; border-radius: 6px;
      background: #0f1115; color: inherit; font: 12px ui-monospace, Menlo, monospace; }
    .tz input[type=color] { width: 32px; height: 28px; padding: 0; border: 1px solid #343843; border-radius: 6px; background: none; cursor: pointer; }
    .tz input[type=range] { width: 100%; accent-color: #e8e8ea; }
    .tz output { font: 12px ui-monospace, Menlo, monospace; text-align: right; }
    .tz button { height: 30px; padding: 0 10px; border: 1px solid #343843; border-radius: 6px; background: #22252c; color: inherit; font: inherit; cursor: pointer; }
    .tz button:hover { background: #2c3039; }
    .tz .tz__primary { flex: 1; background: #e8e8ea; border-color: #e8e8ea; color: #16181d; font-weight: 600; }
    .tz .tz__primary:hover { background: #fff; }
    .tz__presets { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
    .tz__presets button { padding: 0 4px; font-size: 12px; }
    .tz__buttons { display: flex; gap: 6px; margin-top: 8px; }
    .tz details summary { cursor: pointer; color: #9aa0ab; font-size: 12px; }
    .tz textarea { width: 100%; margin-top: 8px; padding: 8px; resize: vertical; border: 1px solid #343843; border-radius: 6px;
      background: #0f1115; color: #c9ccd3; font: 11px/1.5 ui-monospace, Menlo, monospace; }
    .tz__toggle { width: 28px; padding: 0 !important; }
    @media (max-width: 600px) { .tz { left: 8px; right: 8px; bottom: 8px; width: auto; max-height: 55vh; } }
  `;
  document.head.appendChild(style);

  let state = loadDraft() || readTheme();
  [state.heading, state.body].forEach(firstFamily); // make sure both fonts are in the dropdown

  const fontOptions = () => Object.keys(FONTS).map((f) => `<option>${f}</option>`).join("");

  const panel = document.createElement("aside");
  panel.className = "tz";
  panel.setAttribute("aria-label", "Theme customizer");
  panel.innerHTML = `
    <div class="tz__head">
      <strong>Theme customizer</strong>
      <button class="tz__toggle" type="button" aria-expanded="true" title="Collapse">–</button>
    </div>
    <div class="tz__body">
      <p class="tz__hint">Only you can see this panel and these changes. Download the file when you're happy.</p>

      <div class="tz__label">Start from a preset</div>
      <div class="tz__presets">
        ${Object.keys(PRESETS).map((n) => `<button type="button" data-preset="${n}">${n}</button>`).join("")}
      </div>

      <div class="tz__label">Colors <span>(paste hex codes from Figma)</span></div>
      ${COLORS.map(([, label], i) => `
        <div class="tz__row">
          <span>${label}</span>
          <input type="text" data-hex="${i}" spellcheck="false" maxlength="7" aria-label="${label} hex code">
          <input type="color" data-color="${i}" aria-label="${label} color picker">
        </div>`).join("")}

      <div class="tz__label">Fonts</div>
      <label class="tz__row tz__row--font"><span>Headings</span><select data-font="heading">${fontOptions()}</select></label>
      <label class="tz__row tz__row--font"><span>Body text</span><select data-font="body">${fontOptions()}</select></label>

      <div class="tz__label">Corner roundness</div>
      <label class="tz__row tz__row--range"><input type="range" min="0" max="28" data-radius aria-label="Corner roundness"><output></output></label>

      <div class="tz__buttons">
        <button type="button" class="tz__primary" data-download>Download theme.css</button>
        <button type="button" data-copy>Copy</button>
        <button type="button" data-reset title="Go back to what's in theme.css">Reset</button>
      </div>
      <details><summary>Show the code</summary><textarea readonly rows="14" aria-label="Generated theme.css"></textarea></details>
    </div>`;
  document.body.appendChild(panel);

  const q = (sel) => panel.querySelector(sel);

  // Puts the current state into every input.
  function syncInputs() {
    state.colors.forEach((c, i) => {
      q(`[data-hex="${i}"]`).value = c;
      q(`[data-color="${i}"]`).value = c;
    });
    q('[data-font="heading"]').value = state.heading;
    q('[data-font="body"]').value = state.body;
    q("[data-radius]").value = state.radius;
    q("output").textContent = state.radius + "px";
  }

  panel.addEventListener("input", (e) => {
    const t = e.target;
    if (t.dataset.color !== undefined) {
      state.colors[t.dataset.color] = t.value;
      q(`[data-hex="${t.dataset.color}"]`).value = t.value;
    } else if (t.dataset.hex !== undefined) {
      const hex = t.value.trim().replace(/^#?/, "#").toLowerCase();
      if (!/^#[0-9a-f]{6}$/.test(hex)) return; // wait until it's a full code
      state.colors[t.dataset.hex] = hex;
      q(`[data-color="${t.dataset.hex}"]`).value = hex;
    } else if (t.dataset.font !== undefined) {
      state[t.dataset.font] = t.value;
    } else if (t.dataset.radius !== undefined) {
      state.radius = Number(t.value);
      q("output").textContent = t.value + "px";
    } else {
      return;
    }
    apply();
  });

  panel.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;

    if (t.classList.contains("tz__toggle")) {
      const collapsed = panel.classList.toggle("is-collapsed");
      t.textContent = collapsed ? "+" : "–";
      t.setAttribute("aria-expanded", String(!collapsed));
    } else if (t.dataset.preset) {
      const p = PRESETS[t.dataset.preset];
      state = { colors: [...p.colors], heading: p.heading, body: p.body, radius: p.radius };
      syncInputs();
      apply();
    } else if (t.hasAttribute("data-download")) {
      const url = URL.createObjectURL(new Blob([buildCss()], { type: "text/css" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: "theme.css" });
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else if (t.hasAttribute("data-copy")) {
      const done = () => { t.textContent = "Copied!"; setTimeout(() => (t.textContent = "Copy"), 1500); };
      const fallback = () => { // clipboard blocked: select the code so Cmd+C works
        q("details").open = true;
        q("textarea").select();
        t.textContent = "Press ⌘C";
      };
      if (navigator.clipboard) navigator.clipboard.writeText(buildCss()).then(done, fallback);
      else fallback();
    } else if (t.hasAttribute("data-reset")) {
      clearDraft();
      COLORS.forEach(([name]) => root.style.removeProperty(name));
      ["--font-heading", "--font-body", "--radius"].forEach((n) => root.style.removeProperty(n));
      state = readTheme();
      syncInputs();
      q("textarea").value = buildCss();
    }
  });

  syncInputs();
  apply();
})();
