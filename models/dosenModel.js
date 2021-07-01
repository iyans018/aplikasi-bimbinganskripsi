const mongoose = require('mongoose');
const { Schema } = mongoose;

const dosenSchema = new Schema({
  nip: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tolong masukan nip!'],
    unique: true
  },
  nama: {
    type: String,
    required: [true, 'Tolong masukan nama dosen!']
  },
  noPhone: {
    type: Number
  },
  kelamin: {
    type: String,
  },
  email: String,
  prodi: String
}, { timestamps: true });

const Dosen = mongoose.model('Dosen', dosenSchema);

module.exports = Dosen;