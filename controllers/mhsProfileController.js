const User = require('../models/usersModel');
const Mahasiswa = require('../models/mahasiswaModel');

const mhs_profile_get = async (req, res) => {
  const { id } = req.user;

  try {
    const users = await User.findById(id);
    const mhs = await Mahasiswa.findOne({ nim: id }).populate('nim');
    res.render('pages/mahasiswa/profile', { 
      title: "Profile", 
      icon: "fas fa-fw fa-id-card",
      users,
      mahasiswa: mhs
    });
  } catch (error) {
    console.log(error);
  }
}

const mhs_profile_post = async (req, res) => {
  const { role } = req.user
  const proposal = false; 
  const skripsi = false;
  const { nim, nama, tempatLahir, tglLahir, 
    noPonsel, email, kelamin, agama, fakultas, prodi, kelas } = req.body;

  if (role !== 'Mahasiswa') {
    res.status(404).render('pages/404', { title : "Page not found" });
  }

  try {
    const mhs = await Mahasiswa.create({
      nim, nama, tempatLahir, tglLahir, noPonsel, email, kelamin, 
      agama, fakultas, prodi, kelas, proposal, skripsi
    });
    if (mhs) {
      res.status(200).json({ mhs: mhs._id });
    } else {
      res.status(201).json({ error: "Gagal memperbaharui data." });
    }
  } catch (err) {
    console.log(err);
    res.status(201).json({ error: "Gagal memperbaharui data." });
  }
}

const mhs_profile_put = async (req, res) => {
  const { role } = req.user
  const { id, nim, nama, tempatLahir, tglLahir, 
    noPonsel, email, kelamin, agama, fakultas, prodi, kelas } = req.body;

  if (role !== 'Mahasiswa') {
    res.status(404).render('pages/404', { title : "Page not found" });
  }

  try {
    const mhs = await Mahasiswa.findByIdAndUpdate(id, {
      $set: {
        nim, nama, tempatLahir, tglLahir, noPonsel, email, kelamin,
        agama, fakultas, prodi, kelas
      }
    });
    if (mhs) {
      res.status(200).json({ mhs: mhs._id });
    } else {
      res.status(201).json({ error: "Gagal memperbaharui data." });
    }
  } catch (err) {
    console.log(err);
    res.status(201).json({ error: "Gagal memperbaharui data." });
  }
}

module.exports = {
  mhs_profile_get,
  mhs_profile_post,
  mhs_profile_put
}