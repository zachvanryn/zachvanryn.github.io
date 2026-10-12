# Site guide

Notes for updating zachvanryn.github.io. Edit `js/content.js` for text and projects, preview by
double-clicking `index.html`, then **Commit to main** and **Push origin** in GitHub Desktop. The live
site updates in about a minute (hard-refresh with Cmd + Shift + R).

## What each file does

| File | What it's for |
|---|---|
| `js/content.js` | The words: name, intro, links, about, skills and every project |
| `css/theme.css` | The look: colors, fonts, corner roundness |
| `images/` | Project thumbnails (about 1600×900) |
| `videos/` | Short gameplay clips (under 25 MB each) |
| `index.html` | The page skeleton |
| `css/style.css` | Layout: spacing, grid, cards, popup |
| `js/main.js` | Builds the page from `content.js` |
| `js/customizer.js` | The theme editor (`?customize`) |

## Adding a new project

1. In `js/content.js`, copy the commented-out **TEMPLATE** at the bottom of the projects list,
   paste it above, and fill it in.
2. **Thumbnail:** save a screenshot to `images/` and set `thumbnail: "images/my-game.jpg"`.
3. **Video:** put a short clip (20–40 s, under 25 MB) in `videos/` and set `video: "videos/my-game.mp4"`.
   Longer videos go on YouTube as a button: `links: [{ label: "Full playthrough", url: "https://youtu.be/..." }]`.
4. Make `highlights` specific to what *you* built. Recruiters read them first.

With 3 or more projects, tags become filter buttons automatically.

## Playable or downloadable games

**In the browser:** put a web build (a folder with an `index.html`) in `games/my-game/`, then set
`play: "games/my-game/index.html"` and `embed: true`.

| Made with | Web build | Watch out for |
|---|---|---|
| Unity | File → Build Settings → WebGL | Publishing Settings: Compression Format *Disabled* (or Decompression Fallback) |
| Godot 4 | Project → Export → Web, named `index.html` | Leave Thread Support off |
| JavaScript | Copy the folder in | Nothing special |
| Pygame | `pygbag game_folder`, copy out `build/web` | Main loop needs an `asyncio` change |

**Downloads:** builds go in a **Release** on the game's own public repo. Releases → Draft a new
release → tag `v1.0` → drag zips into the **Attach binaries** box (not the description box, which
caps at 25 MB) → Publish. Then in `content.js`:

```js
downloads: [
  { label: "Download for Mac", url: "https://github.com/zachvanryn/GAME-REPO/releases/latest/download/FILE-NAME.zip" },
],
```

## Changing the look

Open `https://zachvanryn.github.io/?customize`, adjust colors, fonts and roundness, click
**Download theme.css**, replace `css/theme.css`, then commit and push. Only you see the panel.
From Figma, copy a shape's Fill hex code into the editor or `theme.css`.

## Size limits

| Where | Limit |
|---|---|
| Uploading on github.com | 25 MB per file |
| Pushing with GitHub Desktop | 100 MB per file |
| Release attachments | 2 GB per file |
| Whole site | about 1 GB |

## Troubleshooting

- **Blank page / "content.js has a typo":** a missing comma, quote or bracket. The browser console
  (Cmd + Option + J) shows the line.
- **Site didn't change after pushing:** wait a minute, hard-refresh; check the Actions tab for a red ✗.
- **Image works locally but not online:** file names are case-sensitive.
- **Download button says Not Found:** the link's file name must match the release file exactly, and
  the game repo must be public.
