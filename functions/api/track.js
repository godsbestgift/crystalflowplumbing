function parseReferrer(referrer) {
  if (!referrer) return { domain: null, isOrganic: false, engine: null };
  try {
    const url = new URL(referrer);
    const domain = url.hostname.replace(/^www\./, '');
    const searchEngines = {
      'google.': 'google',
      'bing.': 'bing',
      'yahoo.': 'yahoo',
      'duckduckgo.': 'duckduckgo',
    };
    for (const [prefix, engine] of Object.entries(searchEngines)) {
      if (domain.includes(prefix)) {
        return { domain, isOrganic: true, engine };
      }
    }
    return { domain, isOrganic: false, engine: null };
  } catch (e) {
    return { domain: null, isOrganic: false, engine: null };
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.ANALYTICS_DB) {
    return new Response('DB not bound', { status: 500 });
  }
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response('bad request', { status: 400 });
  }

  const path = String(body.path || '').slice(0, 500);
  const referrer = body.referrer ? String(body.referrer).slice(0, 1000) : null;
  const utmSource = body.utm_source ? String(body.utm_source).slice(0, 200) : null;
  const utmMedium = body.utm_medium ? String(body.utm_medium).slice(0, 200) : null;
  const utmCampaign = body.utm_campaign ? String(body.utm_campaign).slice(0, 200) : null;
  const { domain, isOrganic, engine } = parseReferrer(referrer);
  const country = request.headers.get('cf-ipcountry') || null;
  const userAgent = (request.headers.get('user-agent') || '').slice(0, 300);

  const paidHints = ['cpc', 'ppc', 'paid', 'ads'];
  const looksPaid = utmMedium && paidHints.some((h) => utmMedium.toLowerCase().includes(h));
  const isOrganicSearch = isOrganic && !looksPaid ? 1 : 0;

  await env.ANALYTICS_DB.prepare(
    `INSERT INTO visits (path, referrer, ref_domain, utm_source, utm_medium, utm_campaign, is_organic_search, search_engine, country, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(path, referrer, domain, utmSource, utmMedium, utmCampaign, isOrganicSearch, engine, country, userAgent)
    .run();

  return new Response(null, { status: 204 });
}
