const Mahasiswa = require('../models/mahasiswaModel');
const Dosen = require('../models/dosenModel');
const Proposal = require('../models/proposalModel');
const DaftarSkripsi = require('../models/daftarSkripsiModel');

const mhs_daftar_get = async (req, res) => {
  const { id } = req.user;

  try {
    const mhs = await Mahasiswa.findOne({ nim: id });
    const dosen = await Dosen.find();
    const proposal = await Proposal.findOne({ "nimMhs": id });
    const daftarSkripsi = await DaftarSkripsi.findOne({ nimMhs: id }).populate('nimMhs').populate('pembimbing');
    if (mhs) {
      res.render('pages/mahasiswa/daftarbimbingan', { 
        title: "Daftar Bimbingan Skripsi", 
        icon: "fas fa-fw fa-book",
        mhs,
        dosen,
        proposal,
        daftarSkripsi
      });
    } else {
      res.render('pages/mahasiswa/daftarbimbingan2', { 
        title: "Daftar Bimbingan Skripsi", 
        icon: "fas fa-fw fa-book",
      });
    }
  } catch (error) {
    console.log(error);
  }
}

const mhs_daftar_post = async (req, res) => {
  const { id } = req.user;

  try {
    const daftarSkripsi = await DaftarSkripsi.create({
      nimMhs: id,
      namaMhs: req.body.namaMhs,
      judulSkripsi: req.body.judulSkripsi,
      pembimbing: req.body.pembimbing,
      status: 'Menunggu',
      selesai: false
    });
    if (daftarSkripsi) {
      res.status(200).json({ redirect: "/mahasiswa/daftarskripsi" });
    }
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan!" });
  }
}

module.exports = {
  mhs_daftar_get,
  mhs_daftar_post
}