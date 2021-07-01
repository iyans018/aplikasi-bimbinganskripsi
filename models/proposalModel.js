const mongoose = require('mongoose');
const { Schema } = mongoose;

const proposalSchema = new Schema({
  nimMhs: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  namaMhs: String,
  judul: String,
  status: String,
  filePath: String,
  penguji1: {
    type: Schema.Types.ObjectId,
    ref: 'Dosen'
  },
  penguji2: {
    type: Schema.Types.ObjectId,
    ref: 'Dosen'
  },
  tempatPengujian: String,
  tglPelaksanaan: Date,
  waktuPengujian: String, 
  keterangan: String
}, { timestamps: true });

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;