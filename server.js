const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const bodyParser = require("body-parser");

// Middleware untuk parsing data form
// konfigurasi database atau data yang dikirim dari form.
// Jika middleware ini tidak ada, server tidak akan bisa membaca data dari req.body.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sajikan file statis dari direktori saat ini
app.use(express.static(__dirname));

// Buat / buka database SQLite
const db = new sqlite3.Database("invitation.db");

// Buat tabel jika belum ada di SQLite
db.run(`CREATE TABLE IF NOT EXISTS kehadiran (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT,
  email TEXT,
  kehadiran TEXT,
  media TEXT,
  komentar TEXT
)`);

// Endpoint untuk menerima data form
// Pastikan server memiliki endpoint /submit yang menerima data dari form.
app.post("/submit", (req, res) => {
  const { nama, email, kehadiran, media, komentar } = req.body;

  db.run(
    // Handle error pada database, menggunakan query SQL untuk menyimpan data ke database.
    `INSERT INTO kehadiran (nama, email, kehadiran, media, komentar) VALUES (?, ?, ?, ?, ?)`,
    [nama, email, kehadiran, media, komentar],
    function (err) {
      // Jika terjadi error saat menyimpan data, kirimkan response dengan status error.
      if (err) {
        return res.json(
          { 
            success: false, 
              message: "❌ Error to Save Data! Please re-submit your form." 
          }
        );
      }
      // Jika berhasil, akan dikirimkan response sukses.
      console.log(`Data saved: ${this.lastID}`);
      // Pesan ini akan ditampilkan kepada pengguna setelah form berhasil disubmit.
      return res.json(
        { 
          success: true, 
            message: "✅ Data saved successfully! Thank you for your response."
          <br>  "We will send you a confirmation email soon." 
        }
      );
    }
  );
});

// Jalankan server
// masukkan di terminal npm start
app.listen(3000, () => {
  console.log(`Server berjalan di http://localhost:3000`);
  console.log("Buka http://localhost:3000/index.html untuk mengakses aplikasi.");
  console.log("Buka http://localhost:3000/form.html untuk mengakses form RSVP.");
  console.log("Buka http://localhost:3000/invitation.db untuk mengakses database.");
});


