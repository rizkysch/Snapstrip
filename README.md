```markdown
# 📸 SnapStrip - Premium Digital Photo Booth

SnapStrip adalah aplikasi *web-based photobooth* premium yang dirancang untuk mereplikasi pengalaman bilik foto fisik secara instan di dalam peramban. Proyek ini dikembangkan untuk memenuhi tugas **Daily Project 7** pada mata kuliah **Rekayasa Kebutuhan D**.

Aplikasi ini berfokus pada estetika minimalis, kustomisasi kreatif, dan kemudahan berbagi hasil foto yang telah dioptimasi untuk media sosial.

---

## 🚀 Informasi Proyek
* **Nama Pengembang**: Rizky Maulana Virdaus
* **NIM**: 202310370311244
* **Kelas**: Rekayasa Kebutuhan D
* **Link Publish**: [https://snapstrip-vert.vercel.app](https://snapstrip-vert.vercel.app)
* **Repository GitHub**: [https://github.com/rizkysch/Snapstrip](https://github.com/rizkysch/Snapstrip)

---

## ✨ Fitur Utama
* **Custom Frame Count**: Pengguna dapat memilih jumlah *take* foto (1 hingga 4 bingkai) sebelum memulai sesi.
* **Live Camera Booth**: Pengambilan foto langsung menggunakan webcam dengan sistem *timer* elegan dan efek *flash*.
* **Advanced Editing Studio**:
    * **Layout Dinamis**: Pilihan tata letak *Classic Vertical*, *Korean 2x2*, dan *Luxury Frame*.
    * **Kustomisasi Teks**: Mengatur jenis huruf (font), ukuran *watermark*, dan warna teks secara bebas.
    * **Sticker System**: Mendukung penambahan emoji dan unggah stiker PNG transparan yang dapat diatur ukurannya.
    * **Filter Estetik**: Pilihan filter *Vintage*, *Cinematic*, dan *Noir B&W*.
* **Instant HD Export**: Penggabungan seluruh editan menggunakan HTML5 Canvas menjadi satu gambar HD yang akurat.
* **Smart Print System**: Logika cetak yang otomatis menduplikasi hasil foto 2x6 secara berdampingan dalam satu kertas untuk efisiensi.

---

## 🧪 Pengujian Aspek Kualitas (Quality Testing)

Pengujian dilakukan berdasarkan skenario desain yang telah ditentukan pada Daily Project 6:

| No | Aspek Kualitas | Skenario Pengujian | Hasil yang Diharapkan | Status |
|:---|:---|:---|:---|:---:|
| 1 | **Fungsionalitas** | Memilih jumlah frame foto (1-4). | Kamera mengambil gambar sesuai jumlah pilihan pengguna. | ✅ Berhasil |
| 2 | **Efisiensi** | Memproses hasil editan di Editing Studio. | Gambar HD ter-generate secara lokal dalam waktu < 3 detik. | ✅ Berhasil |
| 3 | **Usabilitas** | Menjalankan aplikasi di Mobile & Desktop. | Layout responsif 100% tanpa scroll vertikal di satu layar. | ✅ Berhasil |
| 4 | **Interaktivitas** | Menambahkan dan mengubah ukuran stiker. | Stiker dapat digeser (*drag*) dan diperbesar/perkecil. | ✅ Berhasil |
| 5 | **Reliabilitas** | Penanganan izin akses kamera[cite: 2]. | Sistem memberikan pesan error yang jelas jika kamera ditolak. | ✅ Berhasil |
| 6 | **Portabilitas** | Mengunduh hasil foto ke penyimpanan lokal[cite: 4]. | File tersimpan dalam format PNG dengan kualitas HD. | ✅ Berhasil |

---

## 🛠️ Cara Menjalankan Secara Lokal

1. **Clone Repositori**:
   ```bash
   git clone [https://github.com/rizkysch/Snapstrip.git](https://github.com/rizkysch/Snapstrip.git)
   ```
2. **Install Dependensi**:
   Gunakan flag legacy untuk menghindari konflik versi React 19:
   ```bash
   npm install --legacy-peer-deps
   ```
3. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
4. **Buka di Browser**:
   Akses `http://localhost:3000` untuk melihat hasilnya.

---

## 🏗️ Tech Stack
* **Framework**: Next.js (React 19)
* **Animations**: Motion (Framer Motion)
* **Styling**: Tailwind CSS
* **Icons**: Lucide React & FontAwesome
* **Deployment**: Vercel

---
© 2026 SnapStrip — Premium Digital Photo Booth
```