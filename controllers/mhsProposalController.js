const Proposal = require('../models/proposalModel');
const Mahasiswa = require('../models/mahasiswaModel');

const mhs_proposal_get = async (req, res) => {
  const { id } = req.user;

  try {
    const mahasiswa = await Mahasiswa.findOne({ "nim": id }).populate('nim');
    const proposal = await Proposal.find({ "nimMhs": id }).populate('nimMhs');
    res.render('pages/mahasiswa/proposalskripsi', { 
      title: "Proposal Skripsi",
      icon: "fas fa-fw fa-copy",
      mahasiswa,
      proposal
    });
  } catch (error) {
    console.log(error);
  }
}

const mhs_proposal_post = async (req, res) => {
  const { id } = req.user;

  try {
    const proposal = await Proposal.create({
      nimMhs: req.body.nimMhs,
      namaMhs: req.body.nama,
      judul: req.body.judul,
      status: 'Menunggu',
      filePath: req.file.path
    });
    if (proposal) {
      res.redirect('/mahasiswa/proposalskripsi');
    } else {
      res.status(201).json({ error: "file gagal dibuat!" });
    }
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "file gagal dibuat!" });
  }
}

const mhs_proposal_delete = async (req, res) => {
  const { id } = req.body;

  try {
    const proposal = await Proposal.findByIdAndDelete(id);
    res.status(201).json({ redirect: "/mahasiswa/proposalskripsi" });
  } catch (error) {
    console.log(error);
  }
}

const mhs_proposal_download = async (req, res) => {
  const id = req.params.id;
  
  try {
    const proposal = await Proposal.findById(id);
    const file = proposal.filePath;
    res.download(file);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  mhs_proposal_get,
  mhs_proposal_post,
  mhs_proposal_delete,
  mhs_proposal_download
}