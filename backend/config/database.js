// SQL Server Veritabanı Bağlantı Yapılandırması
const sql = require('mssql');

const config = {
  user: process.env.DB_USER || 'DESKTOP-SF1VS04\HP',
  password: process.env.DB_PASSWORD || 'Mustafa834*',
  server: process.env.DB_SERVER || 'DESKTOP-SF1VS04\SQLEXPRESS',
  database: process.env.DB_DATABASE || 'FizyoterapiRandevuDB',
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // Azure için true
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' || true, // Local için true
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
  try {
    if (pool && pool.connected) {
      return pool;
    }
    
    // Önceki bağlantıyı kapat (varsa)
    if (pool) {
      try {
        await pool.close();
      } catch (e) {
        // Ignore close errors
      }
    }
    
    pool = await sql.connect(config);
    console.log('SQL Server bağlantısı başarılı!');
    console.log(`Veritabanı: ${config.database}, Server: ${config.server}`);
    return pool;
  } catch (error) {
    console.error('SQL Server bağlantı hatası:', error);
    console.error('Bağlantı bilgileri:', {
      server: config.server,
      database: config.database,
      user: config.user,
      port: config.port
    });
    throw error;
  }
}

async function closePool() {
  if (pool) {
    try {
      await pool.close();
      pool = null;
      console.log('SQL Server bağlantısı kapatıldı.');
    } catch (error) {
      console.error('Bağlantı kapatma hatası:', error);
    }
  }
}

// Sorgu çalıştırma helper fonksiyonu
async function executeQuery(query, parameters = {}) {
  const pool = await getPool();
  const request = pool.request();
  
  // Parametreleri ekle (@ ile başlayan isimler için)
  Object.keys(parameters).forEach(key => {
    const value = parameters[key];
    // SQL Server parametreleri @ ile başlar
    const paramName = key.startsWith('@') ? key : `@${key}`;
    
    if (value !== undefined && value !== null) {
      // Veri tipini otomatik belirle
      if (typeof value === 'number') {
        // Integer veya Decimal kontrolü
        if (Number.isInteger(value)) {
          request.input(paramName, sql.Int, value);
        } else {
          request.input(paramName, sql.Decimal(10, 2), value);
        }
      } else if (typeof value === 'boolean') {
        request.input(paramName, sql.Bit, value);
      } else if (value instanceof Date) {
        request.input(paramName, sql.DateTime, value);
      } else if (typeof value === 'string') {
        // String uzunluğuna göre tip seç
        if (value.length > 4000) {
          request.input(paramName, sql.NVarChar(sql.MAX), value);
        } else {
          request.input(paramName, sql.NVarChar(4000), value);
        }
      } else {
        request.input(paramName, sql.NVarChar(sql.MAX), String(value));
      }
    } else {
      request.input(paramName, sql.NVarChar(sql.MAX), null);
    }
  });
  
  const result = await request.query(query);
  return result.recordset;
}

// Stored procedure çalıştırma
async function executeProcedure(procedureName, parameters = {}) {
  const pool = await getPool();
  const request = pool.request();
  
  // Parametreleri ekle (@ ile başlayan isimler için)
  Object.keys(parameters).forEach(key => {
    const value = parameters[key];
    // SQL Server parametreleri @ ile başlar
    const paramName = key.startsWith('@') ? key : `@${key}`;
    
    if (value !== undefined && value !== null) {
      // Veri tipini otomatik belirle
      if (typeof value === 'number') {
        // Integer veya Decimal kontrolü
        if (Number.isInteger(value)) {
          request.input(paramName, sql.Int, value);
        } else {
          request.input(paramName, sql.Decimal(10, 2), value);
        }
      } else if (typeof value === 'boolean') {
        request.input(paramName, sql.Bit, value);
      } else if (value instanceof Date) {
        request.input(paramName, sql.DateTime, value);
      } else if (typeof value === 'string') {
        // String uzunluğuna göre tip seç
        if (value.length > 4000) {
          request.input(paramName, sql.NVarChar(sql.MAX), value);
        } else {
          request.input(paramName, sql.NVarChar(4000), value);
        }
      } else {
        request.input(paramName, sql.NVarChar(sql.MAX), String(value));
      }
    } else {
      request.input(paramName, sql.NVarChar(sql.MAX), null);
    }
  });
  
  const result = await request.execute(procedureName);
  return result.recordset;
}

// Transaction helper
async function executeTransaction(callback) {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);
    const result = await callback(request);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = {
  sql,
  config,
  getPool,
  closePool,
  executeQuery,
  executeProcedure,
  executeTransaction
};

