// Dependency
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// Import Routes
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const masterDataRoutes = require('./routes/masterDataRoutes');
const adminPengSkripsiRoutes = require('./routes/adminPengSkripsiRoutes');
const adminDaftarSkripsiRoutes = require('./routes/adminDaftarSkripsiRoutes');
const adminDaftarPengujianRoutes = require('./routes/adminDaftarPengujianRoutes');
const adminLaporanRoutes = require('./routes/adminLaporanRouter');
const dosenProfileRoutes = require('./routes/dosenProfileRoutes');
const dosenDaftarBimbinganRoutes = require('./routes/dosenDaftarBimbinganRoutes');
const dosenBimbinganController = require('./routes/dosenBimbinganRouter');
const mhsProfileRoutes = require('./routes/mhsProfileRoutes');
const mhsProposalRoutes = require('./routes/mhsProposalRoutes');
const mhsSidangProposalRoutes = require('./routes/mhsSidangProposalRoutes');
const mhsDaftarRoutes = require('./routes/mhsDaftarRoutes');
const mhsBimbinganRoutes = require('./routes/mhsBimbinganRoutes');
const mhsDaftarPengujianRoutes = require('./routes/mhsDaftarPengujianRoutes');
const mhsJadwalSidangSkripsiRoutes = require('./routes/mhsJadwalSidangSkripsiRoutes');

const app = express();
// const URI = 'mongodb://localhost/bimbol';
const URI = 'mongodb+srv://iyans018:iyans018@cluster0.9dasq.mongodb.net/bimbol?retryWrites=true&w=majority';
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// View Engine
app.set('view engine', 'ejs');

// Database connection
mongoose.connect(URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
});
mongoose.set('useFindAndModify', false);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected to database...');
});

// Routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('pages/home'));
app.use(authRoutes);
app.use('/dashboard', requireAuth, dashboardRoutes);
app.use('/admin/masterdata', requireAuth, masterDataRoutes);
app.use('/admin', requireAuth, adminPengSkripsiRoutes);
app.use('/admin', requireAuth, adminDaftarSkripsiRoutes);
app.use('/admin', requireAuth, adminDaftarPengujianRoutes);
app.use('/admin/laporan', requireAuth, adminLaporanRoutes);
app.use('/dosen', requireAuth, dosenProfileRoutes);
app.use('/dosen', requireAuth, dosenDaftarBimbinganRoutes);
app.use('/dosen', requireAuth, dosenBimbinganController);
app.use('/mahasiswa', requireAuth, mhsProfileRoutes);
app.use('/mahasiswa', requireAuth, mhsProposalRoutes);
app.use('/mahasiswa', requireAuth, mhsSidangProposalRoutes);
app.use('/mahasiswa', requireAuth, mhsDaftarRoutes);
app.use('/mahasiswa', requireAuth, mhsBimbinganRoutes);
app.use('/mahasiswa', requireAuth, mhsDaftarPengujianRoutes);
app.use('/mahasiswa', requireAuth, mhsJadwalSidangSkripsiRoutes);
app.use(requireAuth, (req, res) => res.status(404).render('pages/404', { title: "Page not found" }));

// Listening to server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));