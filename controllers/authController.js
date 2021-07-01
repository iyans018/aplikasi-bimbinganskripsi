const User = require('../models/usersModel');
const Mahasiswa = require('../models/mahasiswaModel');
const jwt = require('jsonwebtoken');
const { json } = require('express');
const TOKEN_SECRET = 'sakjgkd47hdks4362n2974ndsjkdAh437djhd4';

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

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, role) => {
    return jwt.sign({ id, role }, TOKEN_SECRET, {
        expiresIn: maxAge
    });
}

const register_get = (req, res) => {
    const token = req.cookies.jwt;

    if (token) {
        res.redirect('/dashboard');
    } else {
        res.render('pages/auth/register', { title: "Register" });
    }
};

const login_get = (req, res) => {
    const token = req.cookies.jwt;

    if(token) {
        res.redirect('/dashboard');
    } else {
        res.render('pages/auth/login', { title: "User Login" });
    }
};

const register_post = async (req, res) => {
    try{
        const user = await User.create(req.body);
        const mahasiswa = await Mahasiswa.create({
            nim: user._id,
            nama: user.nama,
            proposal: false,
            skripsi: false
        });
        if (user && mahasiswa) {
            res.status(201).json({ user: user._id });
        } else {
            res.status(400).json({ error });
        }
    }
    catch(err) {
        const error = errorHandler(err);
        res.status(400).json({ error })
    }
};

const login_post = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user._id, user.role);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        let errorMessage = err.message;
        res.status(400).json({ error: { message: errorMessage} });
    }
};

const logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

module.exports = {
    register_get,
    login_get,
    register_post,
    login_post,
    logout_get
};