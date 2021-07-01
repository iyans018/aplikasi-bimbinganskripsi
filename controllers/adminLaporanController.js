const csv = require('csv-express');
const excel = require('exceljs');
const Proposal = require('../models/proposalModel');
const PengujianSkripsi = require('../models/daftarPengujianModel');
const Dosen = require('../models/dosenModel');

const admin_laporanproposal_get = async (req, res) => {
  try {
    const proposals = await Proposal.find({ "status": "Diterima" }).populate('nimMhs');
    res.render('pages/admin/laporanproposal', {
      title: "Laporan Jadwal Sidang Proposal", 
      icon: "fas fa-fw fa-calendar",
      proposals
    });
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan" });
  }
}

const admin_laporanproposal_download = async (req, res) => {
  let filename = 'laporanproposal.csv';
  try {
    let proposals = await Proposal.aggregate([
      { $match: { status: "Diterima" } },
      { $lookup: {
        "from": "users",
        "localField": "nimMhs",
        "foreignField": "_id",
        "as": "nim"
      }},
      { $unwind: "$nim" },
      { $lookup: {
        "from": "dosens",
        "localField": "penguji1",
        "foreignField": "_id",
        "as": "penguji_1"
      }},
      { $unwind: "$penguji_1" },
      { $lookup: {
        "from": "dosens",
        "localField": "penguji2",
        "foreignField": "_id",
        "as": "penguji_2"
      }},
      { $unwind: "$penguji_2" },
      { $project: {
        "Nim Mahasiswa": "$nim.username",
        "Nama Mahasiswa": "$namaMhs",
        "Judul Proposal": "$judul",
        "Penguji 1": "$penguji_1.nama",
        "Penguji 2": "$penguji_2.nama",
        "Tempat Pengujian": "$tempatPengujian",
        "Tgl Pelaksanaan": "$tglPelaksanaan",
        "Waktu Pengujian": "$waktuPengujian",
      }}
    ]);
    if (proposals) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader("Content-Disposition", 'attachment;filename='+filename);
      res.csv(proposals, true);
    }
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan" });
  }
}

const admin_laporanproposal_exceldownload = async (req, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Proposal Data");

  try {
    let proposals = await Proposal.aggregate([
      { $match: { status: "Diterima" } },
      { $lookup: {
        "from": "users",
        "localField": "nimMhs",
        "foreignField": "_id",
        "as": "nim"
      }},
      { $unwind: "$nim" },
      { $lookup: {
        "from": "dosens",
        "localField": "penguji1",
        "foreignField": "_id",
        "as": "penguji_1"
      }},
      { $unwind: "$penguji_1" },
      { $lookup: {
        "from": "dosens",
        "localField": "penguji2",
        "foreignField": "_id",
        "as": "penguji_2"
      }},
      { $unwind: "$penguji_2" },
      { $project: {
        "Nim Mahasiswa": "$nim.username",
        "Nama Mahasiswa": "$namaMhs",
        "Judul Proposal": "$judul",
        "Penguji 1": "$penguji_1.nama",
        "Penguji 2": "$penguji_2.nama",
        "Tempat Pengujian": "$tempatPengujian",
        "Tgl Pelaksanaan": "$tglPelaksanaan",
        "Waktu Pengujian": "$waktuPengujian",
      }}
    ]);

    worksheet.columns = [
      { header: "NIM MAHASISWA", key: "Nim Mahasiswa", width: 18 },
      { header: "NAMA MAHASISWA", key: "Nama Mahasiswa", width: 25 },
      { header: "JUDUL PROPOSAL", key: "Judul Proposal", width: 30 },
      { header: "PENGUJI 1", key: "Penguji 1", width: 30 },
      { header: "PENGUJI 2", key: "Penguji 2", width: 30 },
      { header: "TEMPAT SIDANG", key: "Tempat Pengujian", width: 30 },
      { header: "TGL PELAKSANAAN", key: "Tgl Pelaksanaan", width: 18 },
      { header: "WAKTU PELAKSANAAN", key: "Waktu Pengujian", width: 18 }
    ];

    worksheet.addRows(proposals);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=" + "jadwalsidangproposal.xlsx");
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    })
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan" });
  }
}

const admin_laporanproposal_update_get = async (req, res) => {
  const id = req.params.id;

  try {
    const proposal = await Proposal.findById(id)
      .populate('nimMhs')
      .populate('penguji1')
      .populate('penguji2');
    const dosens = await Dosen.find();
    res.render('pages/admin/laporanproposal-update', {
      title: "Update Jadwal Sidang Proposal", 
      icon: "fas fa-fw fa-calendar",
      proposal,
      dosens
    });
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan!" });
  }
}

const admin_laporanproposal_update_put = async (req, res) => {
  const id = req.body.id;

  try {
    const proposal = await Proposal.findByIdAndUpdate(id, {
      $set: {
        penguji1: req.body.penguji1,
        penguji2: req.body.penguji2,
        tempatPengujian: req.body.tempatPengujian,
        tglPelaksanaan: req.body.tglPelaksanaan,
        waktuPengujian: req.body.waktuPengujian,
        status: req.body.status,
        keterangan: req.body.keterangan
      }
    });
    if (proposal) {
      res.status(200).json({ redirect: '/admin/laporan/proposal' });
    } else {
      res.status(201).json({ error: "Data gagal diupdate!" })
    }
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan!" });
  }
}

const admin_laporanskripsi_get = async (req, res) => {
  try {
    const pengujians = await PengujianSkripsi.find({ "status": "Diterima" }).populate('nimMhs');
    res.render('pages/admin/laporanskripsi', {
      title: "Laporan Jadwal Sidang Skripsi", 
      icon: "fas fa-fw fa-calendar",
      pengujians
    });
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan" });
  }
}

const admin_laporanskripsi_download = async(req, res) => {
  let filename = 'laporanskripsi.csv';
  try {
    let pengujians = await PengujianSkripsi.aggregate([
      { $match: { status: "Diterima" } },
      { $lookup: {
        "from": "users",
        "localField": "nimMhs",
        "foreignField": "_id",
        "as": "nim"
      }},
      { $unwind: "$nim" },
      { $lookup: {
        "from": "dosens",
        "localField": "penguji1",
        "foreignField": "_id",
        "as": "penguji_1"
      }},
      { $unwind: "$penguji_1" },
      { $lookup: {
        "from": "dosens",
        "localField": "penguji2",
        "foreignField": "_id",
        "as": "penguji_2"
      }},
      { $unwind: "$penguji_2" },
      { $project: {
        "Nim Mahasiswa": "$nim.username",
        "Nama Mahasiswa": "$namaMhs",
        "Judul Skripsi": "$judulSkripsi",
        "Penguji 1": "$penguji_1.nama",
        "Penguji 2": "$penguji_2.nama",
        "Tempat Pengujian": "$tempatPengujian",
        "Waktu Pengujian": "$waktuPengujian",
      }}
    ]);
    if (pengujians) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader("Content-Disposition", 'attachment;filename='+filename);
      res.csv(pengujians, true);
    }
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan" });
  }
}

const admin_laporanskripsi_exceldownload = async (req, res) => {
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Skripsi Data");

  try {
    let pengujians = await PengujianSkripsi.aggregate([
      { $match: { status: "Diterima" } },
      { $lookup: {
        "from": "users",
        "localField": "nimMhs",
        "foreignField": "_id",
        "as": "nim"
      }},
      { $unwind: "$nim" },
      { $lookup: {
        "from": "dosens",
        "localField": "penguji1",
        "foreignField": "_id",
        "as": "penguji_1"
      }},
      { $unwind: "$penguji_1" },
      { $lookup: {
        "from": "dosens",
        "localField": "penguji2",
        "foreignField": "_id",
        "as": "penguji_2"
      }},
      { $unwind: "$penguji_2" },
      { $project: {
        "Nim Mahasiswa": "$nim.username",
        "Nama Mahasiswa": "$namaMhs",
        "Judul Skripsi": "$judulSkripsi",
        "Penguji 1": "$penguji_1.nama",
        "Penguji 2": "$penguji_2.nama",
        "Tempat Pengujian": "$tempatPengujian",
        "Waktu Pengujian": "$waktuPengujian",
        "Tgl Pelaksanaan": "$tglPelaksanaan",
      }}
    ]);

    worksheet.columns = [
      { header: "NIM MAHASISWA", key: "Nim Mahasiswa", width: 18 },
      { header: "NAMA MAHASISWA", key: "Nama Mahasiswa", width: 25 },
      { header: "JUDUL SKRIPSI", key: "Judul Skripsi", width: 30 },
      { header: "PENGUJI 1", key: "Penguji 1", width: 30 },
      { header: "PENGUJI 2", key: "Penguji 2", width: 30 },
      { header: "TEMPAT SIDANG", key: "Tempat Pengujian", width: 30 },
      { header: "TANGGAL", key: "Tgl Pelaksanaan", width: 10 },
      { header: "WAKTU", key: "Waktu Pengujian", width: 15 },
    ];

    worksheet.addRows(pengujians);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=" + "jadwalsidangskripsi.xlsx");
    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    })
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan" });
  }
}

const admin_laporanskripsi_update_get = async (req, res) => {
  const id = req.params.id;
  try {
    const pengujian = await PengujianSkripsi.findById(id)
      .populate("nimMhs")
      .populate("penguji1")
      .populate("penguji2");
    const dosen = await Dosen.find();
    if (pengujian) {
      res.render('pages/admin/laporanskripsi-update', {
        title: "Update Jadwal Sidang Skripsi", 
        icon: "fas fa-fw fa-calendar",
        pengujian,
        dosen
      });
    } else {
      res.status(201).json({ error: "Terjadi kesalahan!" })
    }
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan!" });
  }
}

const admin_laporanskripsi_update_put = async (req, res) => {
  const id = req.body.id;

  try {
    const pengujian = await PengujianSkripsi.findByIdAndUpdate(id, {
      $set: {
        penguji1: req.body.penguji1,
        penguji2: req.body.penguji2,
        tempatPengujian: req.body.tempatPengujian,
        tglPelaksanaan: req.body.tglPelaksanaan,
        waktuPengujian: req.body.waktuPengujian,
        status: req.body.status,
        keterangan: req.body.keterangan
      }
    });
    if (pengujian) {
      res.status(200).json({ redirect: '/admin/laporan/skripsi' });
    } else {
      res.status(201).json({ error: "Terjadi kesalahan!" });
    }
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: "Terjadi kesalahan!" });
  }
}

module.exports = {
  admin_laporanproposal_get,
  admin_laporanproposal_download,
  admin_laporanproposal_exceldownload,
  admin_laporanproposal_update_get,
  admin_laporanproposal_update_put,
  admin_laporanskripsi_get,
  admin_laporanskripsi_download,
  admin_laporanskripsi_exceldownload,
  admin_laporanskripsi_update_get,
  admin_laporanskripsi_update_put
}