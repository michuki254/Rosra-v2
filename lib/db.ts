import sql from 'mssql'

const config = {
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  server: process.env.AZURE_SQL_SERVER?.split(',')[0] || '', // Remove the port from server name
  database: process.env.AZURE_SQL_DATABASE || 'unhab-rosra-db-prod',
  port: 1433, // Add port separately
  options: {
    encrypt: true, // Required for Azure
    trustServerCertificate: false, // Required for Azure
    enableArithAbort: true,
    authentication: {
      type: "azure-active-directory-msi-app-service"
    }
  },
}

export async function getConnection() {
  try {
    const pool = await sql.connect(config)
    return pool
  } catch (err) {
    console.error('Database connection failed:', err)
    throw err
  }
}

export async function closeConnection() {
  try {
    await sql.close()
  } catch (err) {
    console.error('Error closing database connection:', err)
    throw err
  }
}

export async function testConnection() {
  try {
    const pool = await getConnection()
    const result = await pool.request().query('SELECT GETDATE() as currentTime')
    console.log('Database connection successful:', result.recordset[0].currentTime)
    await closeConnection()
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

export async function testAzureConnection() {
  try {
    const pool = await getConnection()
    const result = await pool.request().query('SELECT GETDATE() as currentTime')
    console.log('Azure SQL connection successful:', result.recordset[0].currentTime)
    await pool.close()
    return {
      success: true,
      message: 'Successfully connected to Azure SQL Database'
    }
  } catch (error) {
    console.error('Azure SQL connection test failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Connection failed'
    }
  }
} 