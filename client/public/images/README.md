# Portfolio photos

The original uploaded files are preserved in this folder. The portfolio uses:

- `headshot.JPEG`: Jackson's primary portrait in the white shirt.
- `GradPhoto.JPEG`: Jackson's NDSU graduation photo, shown with his education.
- `life_group_circle.JPEG`: the large Bible study group seated in a circle.

`life_group_APB.JPEG` is also retained as an optional additional group photo. The current layout features the circle photo to keep the About section focused.

For future uploads, use the real JPEG files, not a screenshot of them. If your source uses another
format, keep its actual extension and update the `src` in `content/portfolio.json`.
Do not just rename an HEIC file to `.jpg`; export it as a JPEG first.

The photos are configured in `profile.portrait`, `education.photo`, and
`aboutPhotos` in `content/portfolio.json`. Each includes descriptive `alt` text
and an optional CSS `position` value to choose the visible area of the photo.
The full original opens when a visitor clicks the photo; the CSS crop changes
only its display on the page. No photo generation or retouching is used.

The component omits an unavailable image instead of showing a broken-image icon.
Before deployment, confirm the actual files are committed and visible in the
browser. Text-only changes do not establish that photo uploads have succeeded.
The browser checks fail if a configured image is missing or does not load.
Filenames are case-sensitive: `headshot.JPEG` and `headshot.jpeg` are different
paths on the production host. When renaming a photo, update its `src` in
`content/portfolio.json` too.

Keep private originals outside this public folder if they are not intended for
the website. Everything in `client/public/` is publicly accessible after deployment.
