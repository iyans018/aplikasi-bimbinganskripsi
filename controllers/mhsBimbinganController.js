const DaftarSkripsi = require('../models/daftarSkripsiModel');
const Skripsi = require('../models/skripsiModel');
const Mahasiswa = require('../models/mahasiswaModel');
const Proposal = require('../models/proposalModel');

const mhs_bimbingan_get = async (req, res) => {
  const { id } = req.user;

  try {
    const dafskrip = await DaftarSkripsi.findOne({ nimMhs: id, status: "Diterima" }).populate('pembimbing');
    const skripsi = await Skripsi.find({ nimMhs: id }).populate('nimMhs').populate('pembimbing');
    const mahasiswa = await Mahasiswa.findOne({ nim: id });
    const proposal = await Proposal.findOne({ nimMhs: id });
    res.render('pages/mahasiswa/bimbinganskripsi', { 
      title: "Bimbingan Skripsi",
      icon: "fas fa-fw fa-bacon",
      dafskrip,
      skripsi,
      mahasiswa,
      proposal
    });
  } catch (error) {
    console.log(error);
  }
}

const mhs_bimbingan_post = async (req, res) => {
  const { id } = req.user;

  try {
    const skripsi = await Skripsi.create({
      nimMhs: id,
      namaMhs: req.body.nama,
      judulSkripsi: req.body.judulSkripsi,
      subject: req.body.subject,
      pembimbing: req.body.pembimbingId,
      filePath: req.file.path,
      status: "Menunggu"
    });
    if (skripsi) {
      res.redirect('/mahasiswa/bimbinganskripsi');
    } else {
      res.status(201).json({ error: "terjadi kesalahan!" });
    }
  } catch (error) {
    console.log(error);
  }
}

const mhs_bimbingan_delete = async (req, res) => {
  const id = req.body.id;
  
  try {
    const skripsi = await Skripsi.findByIdAndDelete(id);
    if (skripsi) {
      res.status(200).json({ redirect: '/mahasiswa/bimbinganskripsi' });
    } else {
      res.status(201).json({ error: "terjadi kesalahan" });
    }
  } catch (error) {
    console.log(error);
  }
}

const mhs_bimbingan_download = async (req, res) => {
  const id = req.params.id;

  try {
    const skripsi = await Skripsi.findById(id);
    const file = skripsi.filePath;
    if(skripsi) {
      res.download(file);
    } else {
      res.json({ error: "Terjadi kesalahan!" })
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  mhs_bimbingan_get,
  mhs_bimbingan_post,
  mhs_bimbingan_delete,
  mhs_bimbingan_download
}