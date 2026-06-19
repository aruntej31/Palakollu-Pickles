# Palakollu Pickles Website

Static one-page site, ready for GitHub Pages.

## Structure
```
palakollu-pickles/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── images/
│   ├── photo-1.png
│   ├── photo-2.jpg
│   ├── photo-3.jpg
│   ├── photo-4.jpg
│   ├── photo-5.jpg
│   ├── photo-6.jpg
│   ├── photo-7.jpg
│   ├── photo-8.jpg
│   └── photo-9.jpg
│
├── favicon.ico   (small brand seal icon)
└── CNAME         (only if using a custom domain — not included by default)
```

## Deploy to GitHub Pages
1. Create a new GitHub repo (e.g. `palakollu-pickles`).
2. Upload all files/folders above exactly as structured, including `css/`, `js/`, and `images/`.
3. Go to repo **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
5. Save. Your site will be live at `https://<your-username>.github.io/palakollu-pickles/` within a minute or two.

### Using a custom domain (optional)
If you own a domain and want it pointed at this site:
1. Add a `CNAME` file at the repo root containing just your domain, e.g. `www.palakollupickles.com`
2. Point your domain's DNS to GitHub Pages (A records or a CNAME record per GitHub's docs).
3. Enable "Enforce HTTPS" in repo Settings → Pages once DNS propagates.

## Notes
- All images were previously embedded as base64 inside the HTML/CSS; they've been extracted into `images/` and linked with relative paths to keep the repo lightweight and cacheable.
- No build step needed — it's plain HTML/CSS/JS.
- `favicon.ico` is a simple placeholder matching the brand's maroon/gold seal — swap it out anytime with your own.
