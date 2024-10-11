function toIndonesianWords(nilai) {
  // memastikan nilai adalah angka bulat
  nilai = Math.floor(Math.abs(nilai))

  // daftar nama angka dalam bahasa Indonesia
  const huruf = [
    '',
    'Satu ',
    'Dua ',
    'Tiga ',
    'Empat ',
    'Lima ',
    'Enam ',
    'Tujuh ',
    'Delapan ',
    'Sembilan ',
    'Sepuluh ',
    'Sebelas ',
  ]

  // variabel untuk menyimpan hasil
  let penyimpanan = ''

  // logika untuk mengonversi angka ke kata-kata
  if (nilai < 12) {
    penyimpanan = ' ' + huruf[nilai]
  } else if (nilai < 20) {
    penyimpanan = toIndonesianWords(Math.floor(nilai - 10)) + 'Belas '
  } else if (nilai < 100) {
    const bagi = Math.floor(nilai / 10)
    penyimpanan =
      toIndonesianWords(bagi) + 'Puluh ' + toIndonesianWords(nilai % 10)
  } else if (nilai < 200) {
    penyimpanan = 'Seratus ' + toIndonesianWords(nilai - 100)
  } else if (nilai < 1000) {
    const bagi = Math.floor(nilai / 100)
    penyimpanan =
      toIndonesianWords(bagi) + 'Ratus ' + toIndonesianWords(nilai % 100)
  } else if (nilai < 2000) {
    penyimpanan = 'Seribu ' + toIndonesianWords(nilai - 1000)
  } else if (nilai < 1000000) {
    const bagi = Math.floor(nilai / 1000)
    penyimpanan =
      toIndonesianWords(bagi) + 'Ribu ' + toIndonesianWords(nilai % 1000)
  } else if (nilai < 1000000000) {
    const bagi = Math.floor(nilai / 1000000)
    penyimpanan =
      toIndonesianWords(bagi) + 'Juta ' + toIndonesianWords(nilai % 1000000)
  } else if (nilai < 1000000000000) {
    const bagi = Math.floor(nilai / 1000000000)
    penyimpanan =
      toIndonesianWords(bagi) +
      'Miliar ' +
      toIndonesianWords(nilai % 1000000000)
  } else if (nilai < 1000000000000000) {
    const bagi = Math.floor(nilai / 1000000000000)
    penyimpanan =
      toIndonesianWords(bagi) +
      'Triliun ' +
      toIndonesianWords(nilai % 1000000000000)
  }

  // mengembalikan hasil
  return penyimpanan.trim() // menghapus spasi di awal dan akhir
}

module.exports = toIndonesianWords
