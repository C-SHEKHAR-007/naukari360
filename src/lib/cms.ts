// Admin-authored page HTML is rendered under the page's own <h1> title, so it must
// not add another <h1>: that shows the title twice and gives the page two h1s (bad SEO).

function stripTags(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .trim()
    .toLowerCase();
}

export function prepareCmsHtml(html: string, pageTitle?: string): string {
  let out = html.trim();

  // Drop a leading heading that just repeats the page title
  const leading = out.match(/^<h[12][^>]*>([\s\S]*?)<\/h[12]>/i);
  if (leading && pageTitle && stripTags(leading[1]) === pageTitle.trim().toLowerCase()) {
    out = out.slice(leading[0].length).trim();
  }

  // Any remaining h1 becomes a section heading
  return out.replace(/<(\/?)h1(\s|>)/gi, "<$1h2$2");
}
