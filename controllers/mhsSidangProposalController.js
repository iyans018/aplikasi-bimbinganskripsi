const Proposal = require('../models/proposalModel');

const mhs_sidangproposal_get = async (req, res) => {
  const { id } = req.user;

  try {
    const proposal = await Proposal.findOne({ "nimMhs": id }).populate('nimMhs')
      .populate('penguji1').populate('penguji2');
    res.render('pages/mahasiswa/sidangproposal', { 
      title: "Jadwal Sidang Proposal",
      icon: "fas fa-fw fa-calendar",
      proposal
    });
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan" });
  }
}

module.exports = {
  mhs_sidangproposal_get
}