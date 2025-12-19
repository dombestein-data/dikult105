window.projects = {
  focaline: {
    title: "Focaline (In Development)",
    description:
      "Focaline is a cross-platform productivity app that brings together calendars, notes, emails and real-time collaboration into one workspace. Designed to reduce context-switching and improve focus, Focaline offers a clean interface, fast syncing and AI-assisted organization for busy individuals and teams.",
      tech: ["Built with Astro", "React components", "TailwindCSS Styling", "UI elements from shadcn/ui", "Supabase Auth and PostgreSQL database", "fullcalendar integration", "AI-powered search and suggestions using miniLM", "Hosted on Cloudflare Pages"],
  },
  learn: {
    title: "Dombestein Data Learning Resources",
    description:
      "Dombestein Data Learning Resources is a lightweight educational platform for teaching web development. Originally built to support a introductory crash course in Web Development as part of the University of Bergen's DIKULT105 course, it focuses on hands-on, framework-free learning - perfect for students exploring code and interactivity for the first time.",
    tech: ["Astro Static Rendering", "React Components", "TailwindCSS Styling", "Hosted on Cloudflare Workers"],
    live: "https://learn.dombesteindata.net",
    github: "https://github.com/isak-dombestein/learn.dombesteindata.net",
  },
  adfontes: {
    title: 'Ad Fontes Website',
    description: 'Modern website for Ad Fontes, the student bar at the Faculty of Humanities (HF) at UiB. The website is made to provide information from the bar to the public, including what it means to be a volunteer at the bar, who they are partnered with. The page also includes a live updated booking calendar connected to a backend supabase database, with a admin dashboard to manage, edit and add/remove bookings and page content.',
    tech: ["Built with Astro", "React Components", "TailwindCSS Styling", "Supabase Auth and PostgreSQL database", "Hosted on Cloudflare Pages"],
    live: 'https://adf-demo.dombesteindata.net',
  },
  velox: {
    title: "Velox",
    description: 
      "Velox is a modern, high-performance ERP system designed to replace legacy tools like Microsoft Dynamics AX. Built with a focus on speed, simplicity and seamless workflow, Velox helps retail and logistics companies manage inventory, orders and vendor relationships efficiently. The system will support gradual data migration and continuous sync from older platforms to ease transitions.",
    tech: ["Built with Astro", "React Components", "TailwindCSS Styling", "UI elements from shadcn/ui", "Hono API for backend calls", "PostgreSQL database hosted on Neon", "Uses Drizzle ORM for database calls", "File Uploads via UploadThing", "Internal logging using Axiom", "Manual migration and data sync workflows", "Alpha test version hosted on Cloudflare Pages"],
  },
  markwright: {
    title: "Markwright (CLI Tool)",
    description:
      "A Node.js CLI tool for converting Markdown files into styled A4 PDFs with syntax highlighting and GitHub Dark theme support. Uses puppeteer for headless rendering.",
    tech: ["Runs on Node.js", "CLI-based with input and output file handling", "Parsing and highlighting using marked and marked-highlight w/highlight.js", "Parses input into HTML and prints it as PDF using Puppeteer"],
    github: "https://github.com/isak-dombestein/markwright",
  },
  jcompressor: {
    title: "JCompressor (CLI Tool)",
    description:
      "A Node.js CLI tool for compressing files, folders and images into zip archives with customizable strength and a focus on simplicity. Still in Alpha, but fully working and published on GitHub.",
    tech: ["Runs on Node.js", "CLI-based with input and output file handling", "Uses yazl for ZIP compression", "Uses Node.js' fs module to process input files w/async recursion"],
    github: "https://github.com/isak-dombestein/jcompressor",
  },
  agsmacos: {
    title: "AGS-macOS (Install Script)",
    description:
      "A install script made to specifically download, build and install the Adventure Game Studios game engine and editor on macOS. Uses WINE (Wine Is Not an Emulator) to run the main executables",
    tech: ["Uses WINE to run EXE files", "Engine built using cmake", "Generates custom .app and .plist files"],
    github: "https://github.com/isak-dombestein/ags_macos"
  }
};