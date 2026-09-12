# Cloudflare Tunnel plan

> Dokumentasi saja. Jangan jalankan sebelum domain dan akun Cloudflare milik portfolio sudah siap.

Target: `portfolio.example.com → cloudflared → http://127.0.0.1:3000`. Ganti domain contoh dengan domain portfolio yang benar; jangan memakai domain project lain.

## 1. Install dan autentikasi

Install `cloudflared` dari dokumentasi resmi Cloudflare atau Windows Package Manager, lalu verifikasi dengan `cloudflared --version`. Jalankan `cloudflared tunnel login`; browser akan meminta otorisasi zone yang benar.

## 2. Buat named tunnel

```powershell
cloudflared tunnel create portfolio
cloudflared tunnel list
```

Catat UUID tunnel. Credential JSON dibuat oleh Cloudflare; jangan commit file itu.

## 3. Konfigurasi

Buat `%USERPROFILE%\.cloudflared\config.yml` (bukan di repository):

```yaml
tunnel: YOUR_TUNNEL_UUID
credentials-file: C:\Users\YOUR_USER\.cloudflared\YOUR_TUNNEL_UUID.json
ingress:
  - hostname: portfolio.example.com
    service: http://127.0.0.1:3000
  - service: http_status:404
```

Validasi: `cloudflared tunnel ingress validate`. Tes foreground: `cloudflared tunnel run portfolio`. Pastikan app lokal sehat melalui `http://127.0.0.1:3000/api/health`.

## 4. Route DNS

```powershell
cloudflared tunnel route dns portfolio portfolio.example.com
```

Perintah ini mengubah DNS; jalankan hanya setelah mendapat izin eksplisit dan memastikan zone/domain benar.

## 5. Windows service

Jalankan PowerShell as Administrator hanya setelah mendapat izin, lalu ikuti perintah service terbaru dari dashboard/docs Cloudflare. Setelah instalasi: periksa Services, restart service, lalu cek log Windows Event Viewer atau output service. Jangan membuka port router/Firewall untuk port 3000.

## Verify, logs, restart, rollback

- Lokal: `Invoke-RestMethod http://127.0.0.1:3000/api/health`.
- Publik: buka hostname HTTPS dan `/api/health`; origin tetap hanya mendengar di loopback.
- Restart: restart app service/task dahulu, lalu service `cloudflared`.
- Diagnostik: `cloudflared tunnel info portfolio`, Event Viewer, dan log aplikasi di `logs/`.
- Rollback: hentikan/disable service cloudflared, hapus route DNS yang dibuat untuk hostname portfolio, lalu delete tunnel hanya bila tidak lagi diperlukan. Backup config dan credential sebelum troubleshooting; credential tetap rahasia.

Referensi: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/
