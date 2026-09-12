# Windows production operation

## Build and smoke test

```powershell
Set-Location D:\Portfolio
npm ci
Copy-Item .env.example .env
npm run build
npm run start
```

Edit `.env` untuk production (`NODE_ENV=production`, `PORT=3000`, `SITE_URL` dan `DATABASE_PATH`). Server sengaja bind ke `127.0.0.1`; jangan mengubahnya ke `0.0.0.0` dan jangan membuat port forwarding.

## Auto-start recommendation: NSSM

Untuk laptop Windows, NSSM adalah opsi pragmatis: proses Node dapat dijalankan sebagai Windows Service, otomatis start saat boot, restart setelah crash, mengarahkan stdout/stderr, dan mengirim stop signal. Task Scheduler lebih mudah tetapi observability/restart-nya lebih lemah; PM2 di Windows menambah lapisan dan startup adapter; service kustom terlalu berat.

Jangan install service tanpa izin. Saat disetujui, gunakan NSSM dari sumber resminya dan buat service bernama khusus, misalnya `PortfolioApp`, dengan:

- Application: path absolut `node.exe`
- Startup directory: `D:\Portfolio`
- Arguments: `server-dist\index.js`
- Environment: `NODE_ENV=production`, `PORT=3000`, `DATABASE_PATH=D:\Portfolio\data\portfolio.db`
- Startup: Automatic (Delayed Start)
- Restart delay: 5–10 seconds
- stdout/stderr: file terpisah di `D:\Portfolio\logs`

Set recovery policy Windows Service untuk restart pada kegagalan pertama/kedua. Build bukan bagian dari startup; deploy versi baru dengan `npm ci`, quality gates, `npm run build`, lalu restart service. Untuk graceful shutdown, service harus mengirim termination signal; server menangani `SIGINT`/`SIGTERM`.

## Boot order

1. `PortfolioApp` starts dan health endpoint menjadi OK.
2. `cloudflared` service starts/reconnects.
3. Cloudflare merutekan hostname ke `http://127.0.0.1:3000`.

## Logs and rotation

App menulis log produksi ke `logs/app.log` tanpa body contact, cookie, atau authorization header. Konfigurasikan NSSM output rotation atau jadwalkan rotasi berbasis ukuran (misalnya arsip saat 10 MB, simpan 7–14 file). Batasi ACL folder log ke akun service/admin. Uji restore/restart dan pantau ruang disk.
