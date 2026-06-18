import jwt from 'jsonwebtoken';
import fs from 'node:fs';
import path from 'node:path';

const GHOST_URL = process.env.GHOST_URL;
const KEY = process.env.GHOST_ADMIN_API_KEY;
if (!GHOST_URL || !KEY) { console.error('Missing GHOST_URL / GHOST_ADMIN_API_KEY'); process.exit(1); }

const [id, secret] = KEY.split(':');
function token() {
  return jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id, algorithm: 'HS256', expiresIn: '5m', audience: '/admin/'
  });
}

const API = `${GHOST_URL.replace(/\/$/, '')}/ghost/api/admin`;

async function uploadImage(filePath) {
  const buf = fs.readFileSync(filePath);
  const blob = new Blob([buf], { type: 'image/jpeg' });
  const fd = new FormData();
  fd.append('file', blob, path.basename(filePath));
  fd.append('purpose', 'image');
  const res = await fetch(`${API}/images/upload/`, {
    method: 'POST',
    headers: { Authorization: `Ghost ${token()}` },
    body: fd,
  });
  if (!res.ok) throw new Error(`image upload ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.images[0].url;
}

async function createPost(post) {
  const res = await fetch(`${API}/posts/?source=html`, {
    method: 'POST',
    headers: { Authorization: `Ghost ${token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ posts: [post] }),
  });
  if (!res.ok) throw new Error(`post create ${res.status}: ${await res.text()}`);
  return (await res.json()).posts[0];
}

const html = fs.readFileSync(process.env.ARTICLE_HTML, 'utf8');

const main = async () => {
  console.log('Uploading hero image...');
  const featureUrl = await uploadImage(process.env.HERO_IMAGE);
  console.log('  ->', featureUrl);

  console.log('Creating draft post...');
  const post = await createPost({
    title: 'The 24-Month Padel Payback Is Real Only Where Courts Are Scarce',
    slug: 'padel-club-economics-24-month-payback',
    custom_excerpt: 'Every padel investment deck quotes a sub-24-month break-even. We built the model and found the number is real, just for a market that no longer exists.',
    feature_image: featureUrl,
    feature_image_caption: 'Illustration: the padel gold rush, rendered literally.',
    status: 'draft',
    tags: [{ name: 'Business' }],
    html,
  });
  console.log('\nDRAFT CREATED');
  console.log('  id:', post.id);
  console.log('  url:', post.url);
  console.log('  admin:', `${GHOST_URL}/ghost/#/editor/post/${post.id}`);
  console.log('  status:', post.status);
};

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
