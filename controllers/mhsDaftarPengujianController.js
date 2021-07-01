const Skripsi = require('../models/skripsiModel');
const Mahasiswa = require('../models/mahasiswaModel');
const DaftarPengujian = require('../models/daftarPengujianModel');
const Proposal = require('../models/proposalModel');

const mhs_pengujian_get = async (req, res) => {
  const { id } = req.user;
  
  try {
    const skripsi = await Skripsi.find({ "nimMhs" : id, "status" : "Diterima" });
    const mhs = await Mahasiswa.findOne({ "nim": id }).populate('nim');
    const pengujian = await DaftarPengujian.findOne({ "nimMhs": id })
    .populate('nimMhs').populate("penguji1").populate("penguji2");
    const proposal = await Proposal.findOne({ "nimMhs": id });
    if (skripsi) {
      res.render('pages/mahasiswa/daftarpengujian', { 
        title: "Daftar Pengujian Skripsi", 
        icon: "fas fa-fw fa-hamburger",
        skripsis: skripsi,
        mahasiswa: mhs,
        pengujian,
        proposal
      });
    } else {
      res.status(201).json({ error: "Terjadi kesalahan!" });
    }
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan!" });
  }
}

const mhs_pengujian_post = async (req, res) => {
  const { id } = req.user;

  try {
    const pengujian = await DaftarPengujian.create({
      nimMhs: id,
      namaMhs: req.body.nama,
      judulSkripsi: req.body.judulSkripsi,
      filePath: req.file.path,
      status: "Menunggu"
    });
    if (pengujian) {
      res.status(200).redirect('/mahasiswa/daftarpengujian');
    } else {
      res.status(201).json({ error: "Terjadi kesalahan!" });
    }
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan!" });
  }
}

const mhs_download_get = async (req, res) => {
  const id = req.params.id;
  try {
    const pengujian = await DaftarPengujian.findById(id);
    const file = pengujian.filePath;
    res.download(file);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  mhs_pengujian_get,
  mhs_pengujian_post,
  mhs_download_get
}