const mongoose = require('mongoose');
const { Schema } = mongoose;

const mahasiswaSchema = new Schema({
  nim: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tolong masukan nim!'],
    unique: true
  },
  nama: {
    type: String,
    required: [true, 'Tolong masukan nama mahasiswa!']
  },
  tempatLahir: String,
  tglLahir: String,
  noPonsel: String,
  email: String,
  kelamin: String,
  agama: String,
  fakultas: String,
  prodi: String,
  kelas: String,
  proposal: Boolean,
  skripsi: Boolean
}, { timestamps: true });

const Mahasiswa = mongoose.model('Mahasiswa', mahasiswaSchema);

module.exports = Mahasiswa;