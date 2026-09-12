# Premium Personal Portfolio

Standalone portfolio untuk mahasiswa Teknik Informatika. Frontend React/Vite dan API Express berjalan dari satu production origin yang hanya bind ke `127.0.0.1`.

## Quick start

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Development UI: `http://127.0.0.1:5173` (API diproxy ke port 3000).

```powershell
npm run build
npm run start
```

Production: `http://127.0.0.1:3000`.

## Personalize

Cari `TODO: USER_DATA_REQUIRED`. Data utama berada di `src/data/portfolio.ts`, proyek di `src/data/projects.ts`, dan screenshot di `public/projects/`. Jangan hapus label demo sampai konten benar-benar diganti dengan bukti proyek nyata.

## Quality checks

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm audit
```

Lihat `docs/` untuk keamanan, deployment Windows, dan Cloudflare Tunnel. Tidak ada remote atau deployment yang dikonfigurasi.
