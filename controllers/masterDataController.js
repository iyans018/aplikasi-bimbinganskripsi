const User = require('../models/usersModel');
const Mahasiswa = require('../models/mahasiswaModel');
const Dosen = require('../models/dosenModel');
const Skripsi = require('../models/skripsiModel');

// Error handling
const errorHandler = (err) => {
    // console.log(err.message, err.code);
    let errors = { 
        username: "",
        password: "" 
    };

    if (err.code === 11000) {
        errors.username = "Username already registered!";

        return errors;
    }

    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const user_get = (req, res) => {
    const { role } = req.user

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    User.find()
        .then(result => {
            res.render('pages/admin/masterdata/user', {
                title: "Master Data", 
                subTitle: "User", 
                icon: "fas fa-fw fa-border-all" ,
                users: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(404).render('pages/404', { title : "Page not found" });
        });
};

const user_delete = async (req, res) => {
    const {id} = req.body;
    const roleUser = req.body.role;
    const { role } = req.user

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const user = await User.findByIdAndDelete(id);
        let others;
        if (roleUser === "Dosen") {
            others = await Dosen.findOneAndDelete({ "nip": id });
        } else if (roleUser === "Mahasiswa") {
            others = await Mahasiswa.findOneAndDelete({ "nim": id });
        }
        if (user && others) {
            res.status(201).json({ user: user._id });
        } else if (user) {
            res.status(201).json({ user: user._id });
        }
    } catch (err) {
        console.log(err)
        const error = errorHandler(err)
        res.status(200).json({ error });
    }
}

const user_tambah_get = (req, res) => {
    const { role } = req.user

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    res.render('pages/admin/masterdata/user-tambah', {
        title: "Master Data", 
        subTitle: "User", 
        icon: "fas fa-fw fa-border-all" ,
    });
}

const user_tambah_post = async (req, res) => {
    const { role } = req.user

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const user = await User.create(req.body);
        let others;
        if (user.role === "Mahasiswa") {
            others = await Mahasiswa.create({
                nim: user._id,
                nama: user.nama,
                proposal: false,
                skripsi: false
            });
        } else if (user.role === "Dosen") {
            others = await Dosen.create({
                nip: user._id,
                nama: user.nama
            });
        }
        if (user && others) {
            res.status(201).json({ user: user._id });
        }
    } catch (err) {
        console.log(err);
        res.status(404).render('pages/404', { title : "Page not found" });
    }
}

const user_update = async (req, res) => {
    const { id } = req.body;
    let others;

    try {
        const user = await User.findByIdAndUpdate(id, {
            $set: {
                username: req.body.username,
                nama: req.body.nama,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            }
        });
        if (user.role === "Mahasiswa") {
            others = await Mahasiswa.findOneAndUpdate({ "nim": id }, {
                $set: { nama: req.body.nama }
            });
        } else if (user.role === "Dosen") {
            others = await Dosen.findOneAndUpdate({ "nip": id }, {
                $set: { nama: req.body.nama }
            });
        }
        if (user && others) {
            res.status(201).json({ redirect: '/admin/masterdata/user' });
        } else if (user) {
            res.status(201).json({ redirect: '/admin/masterdata/user' });
        }
    } catch (error) {
        console.log(error);
    }
}

const dosen_get = async (req, res) => {
    const { role } = req.user

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const dosens = await Dosen.find().populate('nip');
        res.render('pages/admin/masterdata/dosen', {
            title: "Master Data", 
            subTitle: "Dosen", 
            icon: "fas fa-fw fa-border-all",
            dosens
        });
    } catch (error) {
        console.log(error);
    }
};

const dosen_tambah_get = async (req, res) => {
    const { role } = req.user

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const users = await User.find({ role: "Dosen" });
        res.render('pages/admin/masterdata/dosen-tambah', {
            title: "Master Data", 
            subTitle: "Dosen", 
            icon: "fas fa-fw fa-border-all",
            users
        });
    } catch (error) {
        console.log(error);
    }
}

const dosen_tambah_post = async (req, res) => {
    const { role } = req.user;
    const { nip, nama, noPhone, kelamin, email, prodi } = req.body;

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const dosen = await Dosen.create({ nip, nama, noPhone, kelamin, email, prodi });
        res.status(201).json({ dosen: dosen._id });
    } catch (err) {
        console.log(err);
        res.status(200).json({ error: "Nip sudah didaftarkan!" });
    }
}

const dosen_update_get = async (req, res) => {
    if (req.user.role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    const id = req.params.id;

    try {
        const dosen = await Dosen.findById(id).populate('nip');
        res.render('pages/admin/masterdata/dosen-update', {
            title: "Master Data", 
            subTitle: "Dosen", 
            icon: "fas fa-fw fa-border-all",
            dosen
        });
    } catch (error) {
        console.log(error);
    }
}

const dosen_update_put = async (req, res) => {
    const DosenId = req.params.id;
    const userId = req.body.userId;
    const { role } = req.user;

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const dosen = await Dosen.findByIdAndUpdate(DosenId, {
            $set: {
                nama: req.body.nama,
                noPhone: req.body.noPhone,
                kelamin: req.body.kelamin,
                email: req.body.email,
                prodi: req.body.prodi
            }
        });
        const user = await User.findByIdAndUpdate(userId, {
            $set: {
                nama: req.body.nama
            }
        })
        if (dosen && user) {
            res.status(201).json({ dosen: dosen._id });
        } else if (dosen) {
            res.status(201).json({ dosen: dosen._id });
        }
    } catch (error) {
        console.log(error);
    }
}

const dosen_delete = async (req, res) => {
    const id = req.body.id;
    const userId = req.body.userId;
    const { role } = req.user

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const dosen = await Dosen.findByIdAndDelete(id);
        const user = await User.findByIdAndDelete(userId);
        if (dosen && user) {
            res.status(201).json({ dosen: dosen.id });
        } else if (dosen) {
            res.status(201).json({ dosen: dosen.id });
        }
    } catch (error) {
        console.log(error);
    }
}

const mahasiswa_get = async (req, res) => {
    const { role } = req.user

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const mhs = await Mahasiswa.find().populate('nim');
        res.render('pages/admin/masterdata/mahasiswa', {
            title: "Master Data", 
            subTitle: "Mahasiswa", 
            icon: "fas fa-fw fa-border-all",
            mahasiswas: mhs
        });
    } catch (error) {
        console.log(error);
    }
};

const mahasiswa_tambah_get = async (req, res) => {
    const { role } = req.user

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const users = await User.find({ role: "Mahasiswa" }).sort({ username: -1 });
        res.render('pages/admin/masterdata/mahasiswa-tambah', {
            title: "Master Data", 
            subTitle: "Mahasiswa", 
            icon: "fas fa-fw fa-border-all",
            users
        });
    } catch (error) {
        console.log(error);
        res.status(404).render('pages/404', { title : "Page not found" });
    }
}

const mahasiswa_tambah_post = async (req, res) => {
    const { role } = req.user
    const proposal = false; 
    const skripsi = false;
    const { nim, nama, tempatLahir, tglLahir, 
        noPonsel, email, kelamin, agama, prodi } = req.body;

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const mhs = await Mahasiswa.create({
            nim, nama, tempatLahir, tglLahir, noPonsel,
            email, kelamin, agama, prodi, proposal, skripsi
        });
        res.status(201).json({ mhs: mhs._id });
    } catch (err) {
        console.log(err);
    }
}

const mahasiswa_update_get = async (req, res) => {
    const id = req.params.id;
    const { role } = req.user

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const mhs = await Mahasiswa.findById(id).populate('nim');
        res.render('pages/admin/masterdata/mahasiswa-update', {
            title: "Master Data", 
            subTitle: "Mahasiswa", 
            icon: "fas fa-fw fa-border-all",
            mhs
        });
    } catch (error) {
        console.log(error);
    }
}

const mahasiswa_update_put = async (req, res) => {
    const id = req.params.id;
    const userId = req.body.userId;
    const { role } = req.user

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const mhs = await Mahasiswa.findByIdAndUpdate(id, {
            $set: {
                nama: req.body.nama,
                tempatLahir: req.body.tempatLahir,
                tglLahir: req.body.tglLahir,
                noPonsel: req.body.noPonsel,
                email: req.body.email,
                kelamin: req.body.kelamin,
                agama: req.body.agama,
                fakultas: req.body.fakultas,
                prodi: req.body.prodi,
                kelas: req.body.kelas
            }
        });
        const user = await User.findByIdAndUpdate(userId, {
            $set: { nama: req.body.nama }
        });
        if (mhs && user) {
            res.status(201).json({ redirect: '/admin/masterdata/mahasiswa' });
        } else if (mhs) {
            res.status(201).json({ redirect: '/admin/masterdata/mahasiswa' });
        }
    } catch (error) {
        console.log(error);
    }
}

const mahasiswa_delete = async (req, res) => {
    const id = req.body.id;
    const userId = req.body.userId;
    const { role } = req.user

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const mhs = await Mahasiswa.findByIdAndDelete(id);
        const user = await User.findByIdAndDelete(userId);
        if (mhs && user) {
            res.status(201).json({ mhs: mhs.id, redirect: '/admin/masterdata/mahasiswa' });
        } else if (user) {
            res.status(201).json({ mhs: mhs.id, redirect: '/admin/masterdata/mahasiswa' });
        }
    } catch (error) {
        console.log(error);
    }
}

const mahasiswa_tambah_change = async (req, res) => {
    const id = req.body.id;

    try {
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
}

const bimbingan_get = async (req, res) => {
    const { role } = req.user
    let perPage = 10;
    let page = parseInt(req.params.page) || 1;

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const skripsiscount = await Skripsi.find({});
        const skripsis = await Skripsi.find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .populate("nimMhs");
        res.render('pages/admin/masterdata/bimbingan', {
            title: "Master Data", 
            subTitle: "Bimbingan", 
            icon: "fas fa-fw fa-copy",
            skripsis,
            current: page,
            pages: Math.ceil(skripsiscount.length / perPage)
        });
    } catch (error) {
        console.log(error);
        res.status(200).json({ error: "Terjadi kesalahan!" });
    }
}

const bimbingan_update_get = async (req, res) => {
    const { role } = req.user
    const id = req.params.id;

    if (role !== 'Admin') {
        res.status(404).render('pages/404', { title : "Page not found" });
    }

    try {
        const skripsi = await Skripsi.findById(id)
            .populate("nimMhs")
            .populate("pembimbing");
        if (skripsi) {
            res.render('pages/admin/masterdata/bimbingan-update', {
                title: "Master Data", 
                subTitle: "Update Bimbingan", 
                icon: "fas fa-fw fa-copy",
                skripsi
            });
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ error: "Terjadi kesalahan!" });
    }
}

const bimbingan_update_put = async (req, res) => {
    const id = req.params.id;

    try {
        const skripsi = await Skripsi.findByIdAndUpdate(id, {
        $set: {
            status: req.body.status,
            keterangan: req.body.keterangan
        }
        });
        if (skripsi) {
            res.status(200).json({ redirect: '/admin/masterdata/bimbingan/1' });
        } else {
            res.status(201).json({ error: "Terjadi kesalahan!" });
        }
    } catch (error) {
        console.log(error);
    }
}

const bimbingan_delete = async (req, res) => {
    const id = req.body.id;
    
    try {
        const skripsi = await Skripsi.findByIdAndDelete(id);
        if (skripsi) {
            res.status(200).json({ redirect: '/admin/masterdata/bimbingan/1' });
        } else {
            res.status(201).json({ error: "terjadi kesalahan" });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    user_get,
    user_delete,
    user_update,
    user_tambah_get,
    user_tambah_post,
    dosen_get,
    dosen_tambah_get,
    dosen_tambah_post,
    dosen_update_get,
    dosen_update_put,
    dosen_delete,
    mahasiswa_get,
    mahasiswa_tambah_get,
    mahasiswa_tambah_post,
    mahasiswa_update_get,
    mahasiswa_update_put,
    mahasiswa_delete,
    mahasiswa_tambah_change,
    bimbingan_get,
    bimbingan_update_get,
    bimbingan_update_put,
    bimbingan_delete
};