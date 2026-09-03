// Encrypts a PDF for client-side decryption in the browser.
//   node scripts/encrypt-cv.mjs <input.pdf> <password>
// Output: public/cv/resume.enc  (salt[16] || iv[12] || ciphertext+tag)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';

const [input, password] = process.argv.slice(2);
if (!input || !password) {
  console.error('usage: node scripts/encrypt-cv.mjs <input.pdf> <password>');
  process.exit(1);
}

const ITERATIONS = 250000;
const pdf = readFileSync(input);
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));

const baseKey = await crypto.subtle.importKey(
  'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']
);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  baseKey,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt']
);
const ciphertext = new Uint8Array(
  await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, pdf)
);

const out = new Uint8Array(salt.length + iv.length + ciphertext.length);
out.set(salt, 0);
out.set(iv, salt.length);
out.set(ciphertext, salt.length + iv.length);

mkdirSync('public/cv', { recursive: true });
writeFileSync('public/cv/resume.enc', out);
console.log(`encrypted ${pdf.length} bytes -> public/cv/resume.enc (${out.length} bytes)`);
