/* ================================================================
   content.js: EVERYTHING YOU WRITE LIVES HERE.
   Change the text, save, and refresh the page in your browser.

   This is JavaScript, so it's a little picky:
   • Text goes inside "double quotes", or `backticks` for text that
     spans several lines (handy for descriptions).
   • Every item in a list ends with a comma.
   • Leave a field as "" (empty) and it simply won't show.
   If the page goes blank after an edit, you probably deleted a
   comma, quote or bracket. The page will tell you which.
   ================================================================ */

const SITE = {
  name: "Zach van Ryn",
  role: "Computer science student · game developer",
  intro: "I'm a computer science student who makes games. Here's what I've built so far.",

  email: "",   // e.g. "you@example.com" (adds an "Email me" button)
  resume: "",  // e.g. "resume.pdf" (put the PDF next to index.html)

  // Buttons in the top section and the contact section.
  // Add more like: { label: "itch.io", url: "https://zachvanryn.itch.io" },
  links: [
    { label: "GitHub", url: "https://github.com/zachvanryn" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/zachary-van-ryn-899846249/" },
  ],

  // The About section stays hidden until you write something here or
  // add skills below. Blank line = new paragraph.
  about: ``,

  // e.g. "Languages": ["C#", "Python"], "Engines & tools": ["Unity", "Git"],
  skills: {},

  contactNote: "Find me on GitHub or LinkedIn, or reach out about any of my projects.",

  /* ---------------------------- PROJECTS ----------------------------
     Each { ... } block is one project card; the order here is the order
     on the page. To add one, copy the template at the bottom.

     title        Name of the game (required)
     tagline      One-sentence pitch shown on the card
     year         "2026", "Spring 2026", ...
     role         "Solo project", "Team of 4 · gameplay programmer"
     tags         Short labels. With 3+ projects they become filter buttons.
     thumbnail    Image path, e.g. "images/my-game.jpg". Leave "" for a
                  generated cover using `color`.
     color        Cover color when there's no thumbnail
     play         Where to play it: "games/my-game/index.html" or an
                  itch.io link
     embed        true = playable inside the page (for builds in games/)
     video        A video file in your repo ("videos/my-game.mp4", keep it
                  under 25 MB) or a YouTube *embed* link
                  ("https://www.youtube.com/embed/ID")
     downloads    Download buttons for Mac/Windows builds:
                  [{ label: "Download for Mac", url: "https://..." }]
     code         Link to the source code
     links        Extra buttons: [{ label: "Devlog", url: "https://..." }]
     description  The longer write-up. Blank line = new paragraph.
     highlights   Bullet points about what YOU built or learned.
                  Recruiters skim these, so make them specific.
     featured     true = big card at the top (first one wins)
     ------------------------------------------------------------------ */
  projects: [
    {
      title: "Eagle's Nest",
      // Tagline and description were drafted from the gameplay footage.
      // Check they're accurate and put them in your own words.
      tagline: "Escape a keycard-locked research facility by sparing the scientists and steering them to open the doors for you.",
      year: "2026",
      role: "CTIN 489 class project · team of 2 with William Pile",
      tags: ["Unity", "C#", "2D", "Puzzle"],
      thumbnail: "images/eagles-nest.jpg",
      color: "#3b3f4a",
      play: "",
      embed: false,
      video: "videos/eagles-nest-clip.mp4",
      code: "",
      // Files attached to the latest release at github.com/zachvanryn/eagles-nest
      downloads: [
        { label: "Download for Mac", url: "https://github.com/zachvanryn/eagles-nest/releases/latest/download/EaglesNest-Mac.zip" },
        { label: "Download for Windows", url: "https://github.com/zachvanryn/eagles-nest/releases/latest/download/EaglesNest-Windows.zip" },
      ],
      links: [
        { label: "Install instructions", url: "https://github.com/zachvanryn/eagles-nest/releases/latest" },
        { label: "Full playthrough (6 min)", url: "https://youtu.be/RLEsmRcc8JQ" },
      ],
      description: `
        Eagle's Nest is a top-down 2D puzzle game about escaping a research
        facility that's locked down with keycards. You can't open the doors
        yourself, so you have to spare the scientists and put them to work:
        click a scientist in a colored coat, then click a tile, and they walk
        there for you.

        Along the way, Dr. Scout, Dr. Talon and Dr. Beak talk to you, and their
        conversations reveal what the facility is really for. Built in Unity
        with William Pile for CTIN 489: Intermediate Game Design and Production.
      `,
      // What did YOU build? List the parts that were yours, and be specific.
      // Systems visible in the footage: click-to-command scientists (select,
      // then click a reachable tile), keycard doors, picking up / putting down
      // items (E), dialogue boxes with character portraits, savepoint reset
      // button, and an instructions screen (I).
      highlights: [],
      featured: true,
    },

    /* TEMPLATE: copy everything between the slash-star lines, paste it
       above this comment, remove the slash-star lines, and fill it in.
    {
      title: "My Next Game",
      tagline: "",
      year: "",
      role: "Solo project",
      tags: [],
      thumbnail: "",
      color: "#1c7ed6",
      play: "",
      embed: false,
      video: "",
      downloads: [],
      code: "",
      links: [],
      description: ``,
      highlights: [],
    },
    */
  ],
};
