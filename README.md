Berikut adalah contoh file **README** dalam bahasa Indonesia yang dapat kamu salin dan gunakan untuk proyek PDAM ini:

---

# Proyek PDAM Transaction - Full Stack Test

## Deskripsi Proyek

Proyek ini adalah aplikasi full-stack untuk mengelola transaksi pembayaran PDAM, termasuk PDAM Sidoarjo. Aplikasi ini memungkinkan pengguna melakukan **inquiry** (pemeriksaan tagihan), **payment** (pembayaran), serta melihat **history** (riwayat transaksi) menggunakan layanan API dari Rajabiller.

### Fitur Utama:

1. **Pemeriksaan Tagihan PDAM (Inquiry)**: Pengguna dapat memeriksa tagihan PDAM dengan memasukkan nomor pelanggan dan kode produk.
2. **Pembayaran Tagihan (Payment)**: Setelah melakukan inquiry, pengguna dapat melanjutkan ke pembayaran tagihan.
3. **Riwayat Transaksi (History)**: Pengguna dapat melihat riwayat transaksi berdasarkan nomor pelanggan dan kode produk.

## Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Frontend**: HTML, CSS, JavaScript, jQuery
- **Database**: MongoDB menggunakan Mongoose sebagai ODM
- **API Pihak Ketiga**: Rajabiller API untuk inquiry dan payment
- **Lainnya**: Axios untuk melakukan permintaan HTTP ke API pihak ketiga

## Instalasi

Ikuti langkah-langkah di bawah ini untuk mengatur proyek ini di lingkungan lokal Anda.

### Prasyarat

- Node.js (Versi 14 ke atas)
- MongoDB

### Langkah-langkah

1. **Extract zip** ke direktori lokal Anda

2. **Instal dependensi** dengan menggunakan npm:

   ```bash
   cd fastpay-beta
   npm install
   ```

3. **Siapkan environment file**:
   Buat file `.env` di root folder proyek dan tambahkan variabel berikut:

   ```env
   #DATABASE STRING
   URI=mongodb+srv://<username>:<password>@cluster0.rwyaxun.mongodb.net/<nama_collection>?retryWrites=true&w=majority&appName=Cluster0
   ```

4. **Jalankan MongoDB**:
   Pastikan MongoDB berjalan di mesin lokal Anda, atau Anda bisa menggunakan layanan MongoDB cloud seperti MongoDB Atlas.

5. **Jalankan Aplikasi**:
   Jalankan server dengan perintah berikut:
   ```bash
   npm run serve
   ```
   Server akan berjalan di `http://localhost:3000`.

## Cara Menggunakan Aplikasi

1. **Pemeriksaan Tagihan (Inquiry)**:

   - Masukkan nomor pelanggan (idpel) dan kode produk di form yang tersedia.
   - Klik tombol "Inquiry".
   - Sistem akan menampilkan detail tagihan.

2. **Pembayaran Tagihan (Payment)**:

   - Setelah melakukan inquiry, klik tombol "Payment" untuk melanjutkan pembayaran.
   - Sistem akan mengonfirmasi pembayaran dan menampilkan struk pembayaran.

3. **Melihat Riwayat Transaksi (History)**:
   - Masukkan nomor pelanggan (idpel) dan kode produk.
   - Klik tombol "History" untuk melihat riwayat transaksi berdasarkan data yang dimasukkan.

## API Routes

1. **Inquiry**:

   - **URL**: `/inquiry`
   - **Method**: `POST`
   - **Body**:
     ```json
     {
       "idpel": "01002676",
       "kode_produk": "WASDA"
     }
     ```
   - **Deskripsi**: Mengambil informasi tagihan PDAM berdasarkan nomor pelanggan dan kode produk.

2. **Payment**:

   - **URL**: `/payment`
   - **Method**: `POST`
   - **Body**:
     ```json
     {
       "idpel": "01002676",
       "kode_produk": "WASDA"
     }
     ```
   - **Deskripsi**: Melakukan pembayaran tagihan PDAM setelah melakukan inquiry.

3. **History**:
   - **URL**: `/history`
   - **Method**: `GET`
   - **Query Parameters**:
     - `idpel`: Nomor pelanggan
     - `kode_produk`: Kode produk
   - **Deskripsi**: Mengambil riwayat transaksi berdasarkan nomor pelanggan dan kode produk.
