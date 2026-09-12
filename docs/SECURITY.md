# Security notes

## Implemented

- Production bind hanya `127.0.0.1`.
- Helmet: CSP, frame protection, MIME sniff prevention, referrer policy, dan header keamanan lain.
- `X-Powered-By` disabled; JSON body dibatasi 16 KB.
- Contact divalidasi/trim/normalisasi dengan Zod, dibatasi panjang, dilindungi honeypot + challenge, dan rate limit 5 request/15 menit.
- SQLite prepared statement, WAL, UUID, timestamp, dan tidak ada endpoint membaca pesan.
- Production errors tidak mengirim stack trace; log meredaksi body/contact dan header sensitif.
- Static output tanpa production source map; external links memakai `noopener noreferrer`.

## Operational checklist

- Jangan commit `.env`, database, credential tunnel, atau CV berisi data yang tidak ingin dipublikasi.
- Batasi permission `data/`, `logs/`, dan config cloudflared ke akun service.
- Update dependency secara terjadwal dan jalankan quality gates serta `npm audit` sebelum release.
- Backup database secara terenkripsi saat app berhenti/consistent snapshot; uji restore.
- Cloudflare Tunnel menjadi satu-satunya jalur publik. Jangan membuka port 3000 di firewall/router.
- Pertimbangkan Cloudflare Turnstile hanya bila spam nyata muncul; saat itu token harus diverifikasi server-side.
