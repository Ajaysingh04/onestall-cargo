import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/stylesphere');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@onestall.com' });
    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin@onestallcargo', salt);

    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@onestall.com',
      password: hashedPassword,
      isAdmin: true,
    });

    // bypass pre-save hook since we hashed manually
    // Actually our pre-save hook handles hashing if we don't pass hashed password, let's just pass plain text
    // Wait, the pre-save hook will hash it again if we manually hash it here. Let's just pass plain text.
    adminUser.password = 'admin@onestallcargo';
    
    await adminUser.save();

    console.log('Admin user successfully seeded!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedAdmin();
