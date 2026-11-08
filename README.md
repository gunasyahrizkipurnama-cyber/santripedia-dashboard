# SANTRIPEDIA Dashboard

Prototipe dashboard web untuk meninjau jumlah santri menurut provinsi, kabupaten/kota, kecamatan, dan desa/kelurahan.

## Membuka dashboard

1. Ekstrak folder `santripedia-dashboard` bila dikirim sebagai arsip.
2. Buka `index.html` di browser modern.
3. Pilih wilayah pada filter atau gunakan tombol **Impor data** untuk membuka file `.xlsx` yang disertakan atau file `.csv` dengan header yang sama.

Dashboard menghitung dan menampilkan data di browser. File impor tidak dikirim ke server. Data yang diimpor hanya tersedia selama halaman masih terbuka.

## Isi pratinjau

- Filter wilayah bertingkat dengan pilihan yang saling mengikuti.
- Ringkasan jumlah santri dan jumlah wilayah di data terpilih.
- Grafik dan tabel wilayah yang bisa dipakai untuk menelusuri tingkat berikutnya.
- Ekspor ringkasan wilayah sebagai CSV.
- Data contoh yang menunjukkan Jawa Barat 40.000 santri, Kota Bandung 17.000, Kecamatan Cicendo 5.000, dan Kelurahan Sukaraja 1.000.

Template Excel tersedia sebagai `Template_Impor_Data_Awal_SANTRIPEDIA.xlsx` di folder ini.

Angka bawaan hanya simulasi untuk memperlihatkan cara kerja. Dashboard ini belum memiliki login, basis data, sinkronisasi collector, ataupun layanan server.
