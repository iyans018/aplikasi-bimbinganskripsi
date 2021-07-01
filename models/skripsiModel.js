const mongoose = require('mongoose');
const { Schema } = mongoose;

const skripsiSchema = new Schema({
  nimMhs: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  namaMhs: String,
  judulSkripsi: String,
  subject: String,
  pembimbing: {
    type: Schema.Types.ObjectId,
    ref: 'Dosen'
  },
  filePath: String,
  status: String,
  keterangan: String
});

const Skripsi = mongoose.model('Skripsi', skripsiSchema);

module.exports = Skripsi;