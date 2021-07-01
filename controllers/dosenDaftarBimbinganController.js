const Dosen = require('../models/dosenModel');
const DaftarSkripsi = require('../models/daftarSkripsiModel');

const dosen_dafbim_get = async (req, res) => {
  const { id } = req.user;

  try {
    const dosen = await Dosen.findOne({ nip: id });
    const dafskrips = await DaftarSkripsi.find({ pembimbing: dosen._id, status: "Diterima", selesai: false })
      .populate('nimMhs').populate('pembimbing');
    res.render('pages/dosen/daftarbimbingan', { 
      title: "Daftar Mahasiswa Bimbingan", 
      icon: "fas fa-fw fa-id-card",
      dafskrips
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  dosen_dafbim_get
}