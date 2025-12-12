const sql = require("mssql/msnodesqlv8");

const sqlConfig = {
    database: "FizyoterapiRandevuDB",
    server: "DESKTOP-SF1VS04\\SQLEXPRESS",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

async function connectDb() {
    try {
        let pool = await sql.connect(sqlConfig);
        console.log("SQL Server bağlantısı başarılı!");
        return pool;
    } catch (err) {
        console.error("Bağlantı hatası:", err);
    }
}

module.exports = { sql, connectDb };
connectDb();
