# Portfolio photos

Place the original photo files in this folder. The portfolio is set up for:

- `jackson-satermo.jpg`: Jackson's primary portrait in the white shirt.
- `bible-study-circle.jpg`: the large Bible study group seated in a circle.

Use the real JPEG files, not a screenshot of them. If your source uses another
format, keep its actual extension and update the `src` in `content/portfolio.json`.
Do not just rename an HEIC file to `.jpg`; export it as a JPEG first.

The portrait and group photo are configured in `profile.portrait` and
`aboutPhotos` in `content/portfolio.json`. Each includes descriptive `alt` text
and an optional CSS `position` value to choose the visible area of the photo.
The full original opens when a visitor clicks the photo; the CSS crop changes
only its display on the page. No photo generation or retouching is used.

The component omits an unavailable image instead of showing a broken-image icon.
Before deployment, confirm the actual files are committed and visible in the
browser. Text-only changes do not establish that photo uploads have succeeded.

Keep private originals outside this public folder if they are not intended for
the website. Everything in `client/public/` is publicly accessible after deployment.
