const Proposal = require('../models/proposalModel');
const Mahasiswa = require('../models/mahasiswaModel');
const Dosen = require('../models/dosenModel');

const admin_pengajuan_get = async (req, res) => {
  try {
    const proposal = await Proposal.find({ status: "Menunggu" }).populate('nimMhs');
    res.render('pages/admin/pengajuan-skripsi', {
      title: "Pengajuan Proposal", 
      icon: "fas fa-fw fa-copy",
      proposal
    });
  } catch (error) {
    console.log(error);
  }
}

const admin_pengajuan_download = async (req, res) => {
  const id = req.params.id;
  try {
    const proposal = await Proposal.findById(id);
    const file = proposal.filePath;
    res.download(file);
  } catch (error) {
    console.log(error);
  }
}

const admin_pengajuanproses_get = async (req, res) => {
  const id = req.params.id;

  try {
    const proposal = await Proposal.findById(id).populate('nimMhs');
    const dosens = await Dosen.find();
    res.render('pages/admin/prosesproposal', {
      title: "Pengajuan Proposal", 
      icon: "fas fa-fw fa-copy",
      proposal,
      dosens
    });
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan!" });
  }
}

const admin_pengajuanproses_put = async (req, res) => {
  const id = req.body.id;
  const nim = req.body.nimMhs;

  try {
    const proposal = await Proposal.findByIdAndUpdate(id, {
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
        proposal: true
      }
    });
    if (proposal && mhs) {
      res.status(200).json({ redirect: '/admin/pengajuanskripsi' });
    } else {
      res.status(201).json({ error: "Data gagal diupdate!" })
    }
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan!" });
  }
}

module.exports = {
  admin_pengajuan_get,
  admin_pengajuan_download,
  admin_pengajuanproses_get,
  admin_pengajuanproses_put
}