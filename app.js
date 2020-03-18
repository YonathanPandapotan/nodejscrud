// Install module / dependencies yang dibutuhkan
// Express (untuk framework)
// Mysql (untuk koneksi ke database)
// Body-parser (untuk mengurus form)
// Handlebars (view engine)
// npm install --save express mysql body-parser hbs

// Include segala dependecies yang telha di install
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

// Pertama buat konfigurasi koneksi ke database
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs'
});

// hubungkan ke database
conn.connect((err) => {
    // check jika error 
    if(err) throw err;
    console.log('Connected to database...');
});

// Pasang path untuk views
app.set('views', path.join(__dirname, 'views'));
// Pasang path untuk resources / public
app.use('/assets', express.static(__dirname+'/public'));

// Pasang view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Baru dibawah kita pasang route untuk halamannya
// Route untuk homepage
app.get('/', (req,res) => {
    let sql = "SELECT * FROM arsip";
    let querry = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.render('arsip_view', {
            results: results
        });
    });
});

app.post('/insert', (req,res) => {
    let data = {
        idArsip: req.body.idArsip,
        namaArsip: req.body.namaArsip,
        pengirim: req.body.pengirim,
        penerima: req.body.penerima,
        tanggal: req.body.tanggal
    };
    let sql = "Insert into arsip set ?";
    let query = conn.query(sql, data, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.post('/update', (req,res) => {
    let sql = "UPDATE arsip set namaArsip='" + req.body.namaArsip + "', pengirim= '" + req.body.pengirim + "', penerima= '" + req.body.penerima + "', tanggal = '" +req.body.tanggal+ "' where idArsip = " + req.body.idArsip;
    let query = conn.query(sql, (err, results)=>{
        if(err) throw err;
        res.redirect('/');
    })
})

app.post('/delete', (req,res) => {
    let sql = "DELETE from arsip where idArsip = " + req.body.idArsip2;
    let query = conn.query(sql, (err,results)=>{
        if(err) throw err;
        res.redirect('/');
    })
})

app.listen(8000, () => {
    console.log('app is running on port 8000');
});