require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function reset() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const dbName = mongoose.connection.db.databaseName;
    console.log('✅ Connected to database:', dbName);

    await mongoose.connection.db.collection('admins').deleteMany({});
    console.log('🗑️ Deleted old admins');

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash('Admin@123', salt);

    await mongoose.connection.db.collection('admins').insertOne({
      username: 'admin',
      password: hash,
      name: 'Shree Balaji Admin',
      createdAt: new Date()
    });

    console.log('✅ Admin created successfully!');
    console.log('👤 Username: admin');
    console.log('🔑 Password: Admin@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

reset();