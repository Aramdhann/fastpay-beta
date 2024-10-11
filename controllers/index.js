// controllers/inquiry.js
const axios = require('axios')
const Payment = require('../models/payment.js')
const Transaction = require('../models/transaction.js')
const toIndonesianWords = require('../utils/terbilang.js')

const inquiry = async (req, res) => {
  const { idpel, kode_produk } = req.body
  try {
    console.log('Searching for inquiry data with:', { idpel, kode_produk })
    const response = await axios.post(
      'https://c-dev-partnerlink.rajabiller.com/json/index.php',
      {
        method: 'fastpay.inq',
        uid: 'SP300203',
        pin: '893456',
        idpel1: idpel,
        idpel2: '',
        idpel3: '',
        kode_produk: kode_produk,
        ref1: 'testingfullstackdev',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )

    const result = response.data
    console.log(result)

    // Ambil informasi untuk disimpan
    const billCount = parseInt(result.billquantity) // Mengambil jumlah tagihan
    const rincianTagihan = []
    let totalPenalty = 0
    // Mapping bulan ke nama bulan
    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ]

    for (let i = 1; i <= billCount; i++) {
      const penaltyAmount = parseInt(result[`penalty${i}`]) // Extract penalty for each bill
      totalPenalty += penaltyAmount // Accumulate total penalty
      const monthIndex = parseInt(result[`monthperiod${i}`]) - 1

      rincianTagihan.push({
        bulan: monthNames[monthIndex],
        tahun: result[`yearperiod${i}`],
        nominal: parseInt(result[`billamount${i}`]),
        penalty: penaltyAmount,
      })
    }

    const totalTagihanValue = rincianTagihan.reduce(
      (sum, bill) => sum + bill.nominal + bill.penalty,
      0
    )

    // Simpan inquiry result ke DB
    const newTransaction = new Transaction({
      tanggal: new Date(), // Tanggal saat inquiry
      noResi: result.ref2 || 'N/A', // Menggunakan ref2 sebagai no. resi (atau nilai lain yang sesuai)
      namaPAM: result.pdamname, // Nama PAM
      noPelanggan: idpel, // No. Pelanggan
      customerName: result.customername, // Nama Pelanggan
      customerAddress: result.customeraddress, // Alamat Pelanggan
      rincianTagihan, // Rincian tagihan
      totalTagihan: totalTagihanValue, // Total tagihan
      adminCharge: parseInt(result.biayaadmin), // Biaya admin
      denda: totalPenalty, // Denda
      terbilang: `${toIndonesianWords(totalTagihanValue)}`, // Terbilang
      kode_produk, // Menyimpan kode produk
      idpel, // Menyimpan idpel
      ket: 'pending', // Menyimpan keterangan
    })

    // Optionally, save inquiry result to DB
    console.log(newTransaction)
    await newTransaction.save()

    res.status(200).json({
      status: 'success',
      msg: 'Inquiry successful',
      data: newTransaction,
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      msg: 'Inquiry failed',
      error: error.message,
    })
  }
}

// controllers/payment.js
const payment = async (req, res) => {
  const { idpel, kode_produk } = req.body

  console.log('Searching for inquiry data with:', { idpel, kode_produk })
  const inquiryData = await Transaction.findOne({
    idpel,
    kode_produk,
    ket: 'pending',
  })

  if (!inquiryData) {
    console.log('Inquiry data not found for:', { idpel, kode_produk })
    return res.status(404).send('Inquiry data not found')
  }

  try {
    const response = await axios.post(
      'https://c-dev-partnerlink.rajabiller.com/json/index.php',
      {
        method: 'fastpay.pay',
        uid: 'SP300203',
        pin: '893456',
        idpel1: idpel,
        idpel2: '',
        idpel3: '',
        kode_produk: kode_produk,
        nominal: inquiryData.totalTagihan, // Menggunakan totalTagihan dari data inquiry
        ref2: inquiryData.noResi, // Menggunakan noResi untuk referensi pembayaran
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )

    const paymentResult = response.data

    const date = new Date()
    // Menambah 7 jam dari UTC ke GMT+7
    const gmt7Date = new Date(date.setHours(date.getHours() + 7))

    if (paymentResult) {
      // Buat transaksi baru untuk pembayaran
      const newPayment = new Payment({
        tanggal: gmt7Date, // Tanggal saat pembayaran
        noResi: inquiryData.noResi, // Nomor resi
        namaPAM: inquiryData.namaPAM, // Nama PAM
        noPelanggan: inquiryData.noPelanggan, // No. Pelanggan
        customerName: inquiryData.customerName, // Nama Pelanggan
        customerAddress: inquiryData.customerAddress, // Alamat Pelanggan
        rincianTagihan: inquiryData.rincianTagihan, // Rincian tagihan dari inquiry
        totalTagihan: inquiryData.totalTagihan, // Total tagihan dari inquiry
        adminCharge: inquiryData.adminCharge, // Biaya admin dari inquiry
        terbilang: inquiryData.terbilang, // Terbilang dari inquiry
        denda: inquiryData.denda, // Denda dari inquiry
        idpel: inquiryData.idpel, // ID Pelanggan dari inquiry
        kode_produk: inquiryData.kode_produk, // Kode produk dari inquiry
        ket: 'paid', // Menyimpan keterangan
      })

      // Simpan transaksi pembayaran ke DB
      await newPayment.save()

      // Kirim respon
      res.json({
        status: 'success',
        msg: 'Payment successful',
        receipt: newPayment,
      })
    } else {
      res.status(500).json({
        status: 'error',
        msg: 'Payment failed',
        error: error.message,
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      msg: 'Payment failed',
      error: error.message,
    })
  }
}

// controllers/history.js
const history = async (req, res) => {
  const { idpel, kode_produk, ket } = req.body

  try {
    const filter = {}

    if (idpel) {
      filter.idpel = idpel
    }

    if (kode_produk) {
      filter.kode_produk = kode_produk
    }

    if (ket) {
      filter.ket = ket
    }

    const inquiries = await Transaction.find(filter).sort({ tanggal: -1 })
    const payment = await Payment.find(filter).sort({ tanggal: -1 })

    const history = [...inquiries, ...payment]

    if (history.length === 0) {
      return res.status(404).json({
        status: 'error',
        msg: 'No transactions found for the provided idpel and kode_produk',
      })
    }

    res.status(200).json({
      status: 'success',
      msg: 'History successful',
      data: history,
    })
  } catch {
    res.status(500).json({
      status: 'error',
      msg: 'History failed',
      error: error.message,
    })
  }
}

module.exports = {
  inquiry,
  payment,
  history,
}
