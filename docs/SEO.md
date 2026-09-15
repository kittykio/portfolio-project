# Portfolio search metadata

`src/lib/seo.ts` is the shared source for page titles, descriptions, canonical URLs,
language alternates, social cards, and structured-data serialization. Set
`NEXT_PUBLIC_SITE_URL` to the public production origin (`https://kittykio.com`).
Do not set it to a Vercel preview domain. Preview deployments emit `noindex`.

## Adding or editing pages

- Edit English and Japanese copy together in `staticPages`. Public entries are
  included in the sitemap automatically; the corresponding routes must exist.
- Server pages export `staticMetadata`; client pages use a server route layout.
- Project and article detail pages use `pageMetadata` and their actual content.
- English and Japanese variants have self-canonicals and reciprocal `hreflang`
  links, including an English `x-default`.
- Japanese article URLs showing an English fallback canonicalize to the English
  article. They enter the sitemap/alternate links only when a matching Japanese
  MDX file exists.
- Blog tag/filter routes use `noindex, follow` with the main blog canonical.
  Saved items and the token-protected insights page use `noindex, nofollow` and
  are excluded from the sitemap. Noindex does not replace authorization.

## Structured data and dates

The application emits Person and WebSite entities, BlogPosting for articles,
CreativeWork for project case studies, and BreadcrumbList for detail pages.
Only describe information that is actually on the page; do not invent reviews,
ratings, employer information, or unsupported software claims.

Use `StructuredData` to escape embedded JSON safely. Article publication dates
come from frontmatter. Sitemap `lastmod` and article `dateModified` are omitted
until an explicit editorial update field is maintained: build times and copied
file modification times are not content update dates.

## Verification

Run the SEO, site helper, route composition, dynamic route, and layout tests.
Build with `NEXT_DIST_DIR=.next-seo-check npm run build` to keep the verification
cache separate from any running development server.

After deploying, submit `https://kittykio.com/sitemap.xml` in the site's verified
Google Search Console property. Inspect representative English/Japanese pages
and test article/breadcrumb data with Google's Rich Results Test. Search engines
decide whether to index pages or display rich results; metadata does not
guarantee either outcome.

References: [Next.js metadata](https://nextjs.org/docs/14/app/building-your-application/optimizing/metadata),
[Google language variants](https://developers.google.com/search/docs/specialty/international/localized-versions),
[Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
