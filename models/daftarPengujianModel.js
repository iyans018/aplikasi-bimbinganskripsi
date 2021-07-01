const mongoose = require('mongoose');
const { Schema } = mongoose;

const daftarPengujianSchema = new Schema({
  nimMhs: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  namaMhs: String,
  judulSkripsi: String,
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
  status: String,
  keterangan: String
}, { timestamps: true });

const DaftarPengujian = mongoose.model('DaftarPengujian', daftarPengujianSchema);

module.exports = DaftarPengujian;