const Dosen = require('../models/dosenModel');
const User = require('../models/usersModel');

const dosen_profile_get = async (req, res) => {
  const { id } = req.user;

  try {
    const dosen = await Dosen.findOne({ nip: id }).populate('nip');
    res.render('pages/dosen/profile', { 
      title: "Profile", 
      icon: "fas fa-fw fa-id-card",
      dosen
    });
  } catch (error) {
    console.log(error);
  }
}

const dosen_profile_put = async (req, res) => {
  const { role } = req.user
  const roleId = req.user.id;
  const { id, nip, nama, noPhone, kelamin, email, prodi } = req.body;

  if (role !== 'Dosen') {
    res.status(404).render('pages/404', { title : "Page not found" });
  }

  try {
    const dosen = await Dosen.findByIdAndUpdate(id, {
      $set: {
        nip, nama, noPhone, email, kelamin, prodi
      }
    });
    const user = await User.findByIdAndUpdate(roleId, {
      $set: { nama }
    });
    if (dosen && user) {
      res.status(200).json({ dosen: dosen._id });
    } else {
      res.status(201).json({ error: "Gagal memperbaharui data." });
    }
  } catch (err) {
    console.log(err);
    res.status(201).json({ error: "Gagal memperbaharui data." });
  }
}

module.exports = {
  dosen_profile_get,
  dosen_profile_put
}