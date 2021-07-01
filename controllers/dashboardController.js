const User = require('../models/usersModel');
const Dosen = require('../models/dosenModel');
const Mahasiswa = require('../models/mahasiswaModel');
const Proposal = require('../models/proposalModel');
const Skripsi = require('../models/skripsiModel');

const dashboard_get = async (req, res) => {
  const { id } = req.user;
  try {
    const users = await User.find({ "role": "Admin" });
    const userData = await User.findById(id);
    const dosens = await Dosen.find();
    const mahasiswas = await Mahasiswa.find();
    const proposals = await Proposal.find({ status: "Menunggu" });
    const dosen = await Dosen.findOne({ "nip": id });
    if (dosen) {
      const skripsis = await Skripsi.find({ "pembimbing": dosen._id, "status": "Menunggu" });
      res.render('pages/dashboard', { 
        title: "Dashboard", 
        icon: "fas fa-fw fa-tachometer-alt",
        userData,
        users,
        dosens,
        mahasiswas,
        proposals,
        skripsis
      });
    } else {
      res.render('pages/dashboard', { 
        title: "Dashboard", 
        icon: "fas fa-fw fa-tachometer-alt",
        userData,
        users,
        dosens,
        mahasiswas,
        proposals
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Terjadi kesalahan" })
  }
}

module.exports = {
  dashboard_get
}