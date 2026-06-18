import jwt from 'jsonwebtoken';
import fs from 'node:fs';
import path from 'node:path';

const GHOST_URL = process.env.GHOST_URL;
const KEY = process.env.GHOST_ADMIN_API_KEY;
const POST_ID = process.env.POST_ID;
const [id, secret] = KEY.split(':');
const API = `${GHOST_URL.replace(/\/$/, '')}/ghost/api/admin`;
const token = () => jwt.sign({}, Buffer.from(secret, 'hex'), { keyid: id, algorithm: 'HS256', expiresIn: '5m', audience: '/admin/' });

async function uploadImage(filePath) {
  const buf = fs.readFileSync(filePath);
  const fd = new FormData();
  fd.append('file', new Blob([buf], { type: 'image/png' }), path.basename(filePath));
  fd.append('purpose', 'image');
  const res = await fetch(`${API}/images/upload/`, { method: 'POST', headers: { Authorization: `Ghost ${token()}` }, body: fd });
  if (!res.ok) throw new Error(`image upload ${res.status}: ${await res.text()}`);
  return (await res.json()).images[0].url;
}

const figures = {
  sweden:  { file: process.env.IMG_SWEDEN,  caption: "Sweden's court count, 2019 to 2024. Estimates compiled from Bloomberg/Creditsafe, the Swedish Padel Federation and press reports." },
  payback: { file: process.env.IMG_PAYBACK, caption: "Payback on a EUR600k six-court retrofit. Model: 6 courts, 14 bookable hours/day, EUR400k fixed annual opex." },
  supply:  { file: process.env.IMG_SUPPLY,  caption: "Global court count vs the 2028 projection. Source: 2026 Playtomic Global Padel Report (with PwC Strategy&)." },
};

const main = async () => {
  const urls = {};
  for (const [k, v] of Object.entries(figures)) {
    console.log(`Uploading ${k}...`);
    urls[k] = await uploadImage(v.file);
    console.log('  ->', urls[k]);
  }

  const fig = (k) => `<figure class="kg-card kg-image-card kg-card-hascaption"><img src="${urls[k]}" class="kg-image" alt="" loading="lazy"><figcaption>${figures[k].caption}</figcaption></figure>`;

  // Read current draft HTML, then inject figures after their anchor paragraphs.
  let html = fs.readFileSync('/tmp/payback-article.html', 'utf8');

  // payback chart: after the paragraph ending "...comfortably north of EUR400,000 a year." -> actually anchor on "blended EUR38" sentence
  html = html.replace(/(<p>Six courts open fourteen bookable[^<]*€520,000\.<\/p>)/, `$1\n${fig('payback')}`);
  // sweden chart: after first Sweden paragraph (ends "...demand that looked structural.")
  html = html.replace(/(<p>Between 2019 and 2022[^<]*looked structural\.<\/p>)/, `$1\n${fig('sweden')}`);
  // supply chart: after the 91,000-court arithmetic paragraph (ends "...over-builds the thing it can count.")
  html = html.replace(/(<p><strong>The 91,000-court arithmetic\.<\/strong>[^<]*over-builds the thing it can count\.<\/p>)/, `$1\n${fig('supply')}`);

  // verify all three inserted
  const inserted = (html.match(/kg-image-card/g) || []).length;
  fs.writeFileSync('/tmp/payback-article-charts.html', html);
  console.log('Figures inserted:', inserted, '/ 3');
  if (inserted !== 3) { console.error('WARNING: not all anchors matched. Aborting update.'); process.exit(2); }

  // Need current updated_at for Ghost collision check
  const getRes = await fetch(`${API}/posts/${POST_ID}/?fields=id,updated_at`, { headers: { Authorization: `Ghost ${token()}` } });
  const cur = (await getRes.json()).posts[0];

  const putRes = await fetch(`${API}/posts/${POST_ID}/?source=html`, {
    method: 'PUT',
    headers: { Authorization: `Ghost ${token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ posts: [{ html, updated_at: cur.updated_at }] }),
  });
  if (!putRes.ok) throw new Error(`post update ${putRes.status}: ${await putRes.text()}`);
  const post = (await putRes.json()).posts[0];
  console.log('\nUPDATED');
  console.log('  admin:', `${GHOST_URL}/ghost/#/editor/post/${post.id}`);
  console.log('  status:', post.status);
};

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
