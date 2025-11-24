// scripts/checkPersistence.js
import sequelize from '../db/connection.js';
import Album from '../models/Album.js';
import Producto from '../models/Producto.js';

async function verificarPersistencia() {
  try {
    console.log('🔍 Verificando persistencia de datos...');
    
    // Verificar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a DB establecida');
    
    // Contar registros
    const countAlbumes = await Album.count();
    const countProductos = await Producto.count();
    
    console.log(`📊 Registros en DB:`);
    console.log(`   - Álbumes: ${countAlbumes}`);
    console.log(`   - Productos: ${countProductos}`);
    
    // Verificar archivo de base de datos
    const fs = await import('fs');
    const path = await import('path');
    
    const dbPath = path.resolve('./polisong');
    const exists = fs.existsSync(dbPath);
    
    console.log(`📁 Archivo de DB: ${dbPath}`);
    console.log(`   - Existe: ${exists}`);
    
    if (exists) {
      const stats = fs.statSync(dbPath);
      console.log(`   - Tamaño: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   - Modificado: ${stats.mtime}`);
    }
    
  } catch (error) {
    console.error('❌ Error en verificación:', error);
  }
}

verificarPersistencia();