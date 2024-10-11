const mongoose = require('mongoose');

const billDetailSchema = new mongoose.Schema({
  bulan: { type: String, required: true }, // Bulan pembayaran
  tahun: { type: String, required: true }, // Tahun pembayaran
  nominal: { type: Number, required: true }, // Jumlah tagihan
  penalty: { type: Number, required: true }, // Denda
});

const paymentSchema = new mongoose.Schema({
  tanggal: { type: Date, required: true }, // Tanggal pembayaran
  noResi: { type: String, required: true }, // Nomor resi
  namaPAM: { type: String, required: true }, // Nama PAM
  noPelanggan: { type: String, required: true }, // No. Pelanggan
  customerName: { type: String, required: true }, // Nama Pelanggan
  customerAddress: { type: String, required: true }, // Alamat Pelanggan
  rincianTagihan: { type: [billDetailSchema], required: true }, // Rincian tagihan
  totalTagihan: { type: Number, required: true }, // Total tagihan
  adminCharge: { type: Number, required: true }, // Biaya admin
  denda: { type: Number, required: true }, // Denda
  idpel: { type: String, required: true }, // ID Pelanggan
  terbilang: { type: String, required: true }, // Terbilang
  kode_produk: { type: String, required: true }, // Kode produk
  ket: { type: String, default: 'pending' }, // Keterangan
  createdAt: { type: Date, default: Date.now }, // Waktu pencatatan
});

module.exports = mongoose.model('Payment', paymentSchema);
