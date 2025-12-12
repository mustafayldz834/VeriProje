// SQL Server Veritabanı Bağlantı Yapılandırması
// Bu dosya backend projesinde kullanılacak

const sql = require('mssql');

const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourPassword123',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'VeriProjeDB',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // Azure için true
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true' || true, // Local için true
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Bağlantı havuzu
let pool = null;

async function getPool() {
  if (pool) {
    return pool;
  }
  
  try {
    pool = await sql.connect(config);
    console.log('SQL Server bağlantısı başarılı!');
    return pool;
  } catch (error) {
    console.error('SQL Server bağlantı hatası:', error);
    throw error;
  }
}

async function closePool() {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('SQL Server bağlantısı kapatıldı.');
  }
}

// Sorgu çalıştırma helper fonksiyonu
async function executeQuery(query, parameters = {}) {
  const pool = await getPool();
  const request = pool.request();
  
  // Parametreleri ekle
  Object.keys(parameters).forEach(key => {
    request.input(key, parameters[key]);
  });
  
  const result = await request.query(query);
  return result.recordset;
}

// Stored procedure çalıştırma
async function executeProcedure(procedureName, parameters = {}) {
  const pool = await getPool();
  const request = pool.request();
  
  // Parametreleri ekle
  Object.keys(parameters).forEach(key => {
    request.input(key, parameters[key]);
  });
  
  const result = await request.execute(procedureName);
  return result.recordset;
}

module.exports = {
  sql,
  config,
  getPool,
  closePool,
  executeQuery,
  executeProcedure
};

