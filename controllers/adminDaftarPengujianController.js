const DaftarPengujian = require('../models/daftarPengujianModel');
const Dosen = require('../models/dosenModel');
const Mahasiswa = require('../models/mahasiswaModel');
const DaftarSkripsi = require('../models/daftarSkripsiModel');

const admin_pengujian_get = async (req, res) => {
  
  try {
    const pengujian = await DaftarPengujian.find({ "status": "Menunggu" }).populate("nimMhs");
    
    res.render('pages/admin/daftarpengujian', {
      title: "Daftar Pengujian Skripsi", 
      icon: "fas fa-fw fa-hamburger",
      pengujian
    });
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan!" });
  }
}

const admin_proses_get = async (req, res) => {
  const id = req.params.id;
  try {
    const pengujian = await DaftarPengujian.findById(id).populate("nimMhs");
    const dosen = await Dosen.find();
    if (pengujian) {
      res.render('pages/admin/pengujian-proses', {
        title: "Daftar Pengujian Skripsi", 
        icon: "fas fa-fw fa-hamburger",
        pengujian,
        dosen
      });
    } else {
      res.status(201).json({ error: "Terjadi kesalahan!" })
    }
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan!" });
  }
}

const admin_proses_put = async (req, res) => {
  const id = req.body.id;
  const nim = req.body.idMhs;

  try {
    const pengujian = await DaftarPengujian.findByIdAndUpdate(id, {
      $set: {
        penguji1: req.body.penguji1,
        penguji2: req.body.penguji2,
        tempatPengujian: req.body.tempatPengujian,
        tglPelaksanaan: req.body.tglPelaksanaan,
        waktuPengujian: req.body.waktuPengujian,
        status: req.body.status,
        keterangan: req.body.keterangan
      }
    });
    const mhs = await Mahasiswa.findOneAndUpdate({ nim }, {
      $set: {
        skripsi: true
      }
    });
    const daftarskripsi = await DaftarSkripsi.findOneAndUpdate({ "nimMhs": nim }, {
      $set: {
        selesai: true
      }
    });
    if (pengujian && mhs && daftarskripsi) {
      res.status(200).json({ redirect: '/admin/daftarpengujian' });
    } else {
      res.status(201).json({ error: "Terjadi kesalahan!" });
    }
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan!" });
  }
}

const admin_download_get = async (req, res) => {
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
  admin_pengujian_get,
  admin_download_get,
  admin_proses_get,
  admin_proses_put
}