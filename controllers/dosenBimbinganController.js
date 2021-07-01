const Dosen = require('../models/dosenModel');
const Skripsi = require('../models/skripsiModel');

const dosen_bimbingan_get = async (req, res) => {
  const { id } = req.user;

  try {
    const dosen = await Dosen.findOne({ nip: id });
    const skripsi = await Skripsi.find({ pembimbing: dosen._id, status: "Menunggu" })
      .populate('nimMhs').populate('pembimbing');
    console.log(skripsi);
    res.render('pages/dosen/bimbinganskripsi', { 
      title: "Bimbingan Skripsi", 
      icon: "fas fa-fw fa-bacon",
      skripsi
    });
  } catch (error) {
    console.log(error);
  }
}

const dosen_bimbingan_download = async (req, res) => {
  const id = req.params.id;

  try {
    const skripsi = await Skripsi.findById(id);
    const file = skripsi.filePath;
    if (skripsi) {
      res.download(file);
    } else {
      res.status(201).json({ error: "terjadi kesalahan!" });
    }
  } catch (error) {
    console.log(error);
  }
}

const dosen_bimbingan_proses_get = async (req, res) => {
  const id = req.params.id;

  try {
    const skripsi = await Skripsi.findById(id).populate('nimMhs');
    console.log(skripsi);
    if (skripsi) {
      res.render('pages/dosen/bimbingan-proses', { 
        title: "Bimbingan Skripsi", 
        icon: "fas fa-fw fa-bacon",
        skripsi
      });
    } else {
      res.status(201).json({ error: "Terjadi kesalahan!" });
    }
  } catch (error) {
    console.log(error);
  }
}

const dosen_bimbingan_proses_put = async (req, res) => {
  const id = req.params.id;

  try {
    const skripsi = await Skripsi.findByIdAndUpdate(id, {
      $set: {
        status: req.body.status,
        keterangan: req.body.keterangan
      }
    });
    if (skripsi) {
      res.status(200).json({ redirect: '/dosen/bimbinganskripsi' });
    } else {
      res.status(201).json({ error: "Terjadi kesalahan!" });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  dosen_bimbingan_get,
  dosen_bimbingan_download,
  dosen_bimbingan_proses_get,
  dosen_bimbingan_proses_put
}