const mongoose = require('mongoose');
const { Schema } = mongoose;

const daftarSkripsiSchema = new Schema({
  nimMhs: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  namaMhs: String,
  judulSkripsi: String,
  pembimbing: {
    type: Schema.Types.ObjectId,
    ref: 'Dosen'
  },
  status: String,
  selesai: Boolean
}, { timestamps: true });

const DaftarSkripsi = mongoose.model('DaftarSkripsi', daftarSkripsiSchema);

module.exports = DaftarSkripsi;