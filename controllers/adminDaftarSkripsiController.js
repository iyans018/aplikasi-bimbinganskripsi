const BimbinganSkripsi = require('../models/daftarSkripsiModel')
const Dosen = require('../models/dosenModel');

const admin_daftar_get = async (req, res) => {
  try {
    const bimbingan = await BimbinganSkripsi.find({ status: "Menunggu" }).populate('nimMhs').populate('pembimbing');
    const dosen = await Dosen.find();

    if (bimbingan) {
      res.render('pages/admin/daftarbimbingan', {
        title: "Pengajuan Proposal", 
        icon: "fas fa-fw fa-copy",
        bimbingan,
        dosen
      });
    } else {
      res.status(201).json({ error: "tidak dapat mengambil data!" });
    }
  } catch (error) {
    console.log(error);
  }
}

const admin_daftar_terima = async (req, res) => {

  const { id, pembimbing } = req.body;

  try {
    const bimbingan = await BimbinganSkripsi.findByIdAndUpdate(id, {
      $set: {
        pembimbing,
        status: "Diterima"
      }
    });
    if(bimbingan) {
      res.status(200).json({ redirect: "/admin/daftarskripsi" });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  admin_daftar_get,
  admin_daftar_terima
}