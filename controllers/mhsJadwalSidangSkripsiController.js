const DaftarPengujian = require('../models/daftarPengujianModel');

const mhs_sidang_get = async (req, res) => {
  const { id } = req.user;

  try {
    const pengujian = await DaftarPengujian.findOne({ "nimMhs": id })
    .populate('nimMhs').populate("penguji1").populate("penguji2");
    res.render('pages/mahasiswa/jadwalsidangskripsi', { 
      title: "Jadwal Sidang Skripsi", 
      icon: "fas fa-fw fa-id-card",
      pengujian
    });
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan!" });
  }
}

module.exports = {
  mhs_sidang_get
}