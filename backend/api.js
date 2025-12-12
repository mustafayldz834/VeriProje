const express = require("express");
const sql = require("msnodesqlv8");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// --------------------------------------
// SQL CONFIG - SENİN SUNUCUNA GÖRE
// --------------------------------------
const connectionString =
    "server=DESKTOP-SF1VS04\\SQLEXPRESS;" +
    "Database=FizyoterapiRandevuDB;" +
    "Trusted_Connection=Yes;" +
    "Driver={SQL Server Native Client 11.0}";  // Alternatif sürücü de olabilir

// --------------------------------------
// ✔ API: SQL Bağlantı Testi
// --------------------------------------
app.get("/api/test-db", (req, res) => {
    const query = "SELECT GETDATE() AS Tarih";

    sql.query(connectionString, query, (err, rows) => {
        if (err) {
            console.error("❌ Veritabanı hatası:", err);
            return res.status(500).json({ ok: false, error: err });
        }
        res.json({ ok: true, result: rows });
    });
});

// --------------------------------------
// ✔ Örnek: Randevuları listeleme
// --------------------------------------
app.get("/api/randevular", (req, res) => {
    const query = "SELECT * FROM Randevular";

    sql.query(connectionString, query, (err, rows) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).json({ error: err });
        }
        res.json(rows);
    });
});

// --------------------------------------
// ✔ Örnek: Randevu ekleme
// --------------------------------------
app.post("/api/randevu-ekle", (req, res) => {
    const {
        HastaID,
        FizyoterapistID,
        SikayetID,
        TedaviID,
        SureID,
        Tarih,
        Saat,
        DurumID
    } = req.body;

    const query = `
        INSERT INTO Randevular 
        (HastaID, FizyoterapistID, SikayetID, TedaviID, SureID, Tarih, Saat, DurumID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        HastaID,
        FizyoterapistID,
        SikayetID,
        TedaviID,
        SureID,
        Tarih,
        Saat,
        DurumID
    ];

    sql.query(connectionString, query, params, (err, result) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).json({ error: err });
        }
        res.json({ ok: true, message: "Randevu başarıyla eklendi." });
    });
});

// -------------------------------------------------
// ✔ Sunucuyu dinlemeye başlat
// -------------------------------------------------
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 API çalışıyor: http://localhost:${PORT}`);
});
