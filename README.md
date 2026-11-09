# FOR SANTRI Dashboard

Dashboard lokal untuk melihat jumlah santri berdasarkan provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan.

## Membuka dashboard

1. Ekstrak folder `santripedia-dashboard` dari arsip ZIP.
2. Buka `index.html` di Safari atau browser modern.
3. Pilih provinsi, lalu pilih kabupaten/kota, kecamatan, dan desa/kelurahan untuk mempersempit filter.
4. Buka menu **Data santri** untuk menambahkan, mencari, atau menghapus santri. Di sana, pilih **Unduh Excel** untuk mendapatkan template santri, lalu **Unggah Excel** untuk menambahkan banyak santri sekaligus.

Template Data Santri memiliki kolom ID Santri, Nama Lengkap, Jenis Kelamin, Tanggal Daftar, Provinsi, Kabupaten/Kota, Kecamatan, dan Desa/Kelurahan. Isi satu santri per baris. ID, nama, tanggal daftar, dan semua kolom wilayah wajib diisi; jenis kelamin opsional. Impor menambahkan baris valid, melewati ID ganda atau wilayah yang tidak cocok, lalu menampilkan baris yang perlu diperbaiki.

Grafik perbandingan pendaftaran membandingkan hari terpilih dengan hari sebelumnya, bulan terpilih dengan bulan sebelumnya, atau tahun terpilih dengan tahun sebelumnya. Data lama tanpa tanggal daftar tidak dimasukkan; tanggalnya bisa dilengkapi dari menu Data santri.

Master wilayah disertakan di dalam folder, sehingga filter dan chart tetap bisa dipakai tanpa koneksi API. Data manual dan file santri yang diimpor disimpan di browser pada perangkat ini dan tidak diunggah ke server.

## Master wilayah

Data mengikuti dataset turunan dari data wilayah Kemendagri 2025 yang merujuk Kepmendagri No. 300.2.2-2138 Tahun 2025. Jumlah baris yang disertakan:

- 38 provinsi
- 514 kabupaten/kota
- 7.285 kecamatan
- 83.762 desa/kelurahan

Data mentah CSV berada di folder `data/`, sedangkan `data/wilayah-data.js` adalah versi yang dimuat dashboard. Kode wilayah digunakan sebagai ID internal dan juga disertakan saat mengekspor ringkasan.

Sumber data dan ketentuan lisensi ada di [dataset-wilayah-indonesia](https://github.com/prodhokter/dataset-wilayah-indonesia) dan `data/LICENSE-WILAYAH-UPSTREAM.txt`. Situs rujukan awal yang diberikan: [kodewilayah.web.id](https://kodewilayah.web.id/). Kedua sumber memakai cakupan/pembaruan yang berbeda; dashboard ini memakai dataset Kepmendagri 2025 agar daftar kode dan nama dapat disertakan secara lokal.

## Jumlah santri

Dashboard dimulai dengan 0 santri; tidak ada angka simulasi. Pie chart menampilkan rincian wilayah sesuai filter dan menunjukkan keadaan kosong sampai data jumlah santri diimpor. Persentase akan dihitung setelah data tersedia.

Jika kolom **Jumlah Santri** dikosongkan pada baris yang memiliki ID santri, baris tersebut dihitung sebagai satu santri. Nilai `0` tetap dihitung sebagai nol. Nilai jumlah seperti `-`, teks `error`, nilai negatif, dan teks nonangka dibersihkan menjadi `0` serta dicatat setelah impor. Nama wilayah dicocokkan dengan master data; baris yang tidak cocok diberi catatan setelah impor.

Template Excel tersedia sebagai `Template_Impor_Data_Awal_SANTRIPEDIA.xlsx`.

## Batasan prototipe

Data manual dan hasil impor disimpan di penyimpanan lokal browser pada perangkat ini, sehingga tetap tersedia setelah halaman ditutup di browser dan folder yang sama. Data tidak tersinkron ke laptop atau browser lain. Dashboard ini belum memiliki login, basis data bersama, sinkronisasi aplikasi collector, maupun layanan server.

