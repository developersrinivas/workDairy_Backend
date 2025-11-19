require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Labour = require('../models/Labour');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();
    
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Labour.deleteMany({});

    console.log('Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: 'Admin@123',
      role: 'admin',
    });

    console.log('Creating sample vehicles...');
    const vehicles = await Vehicle.create([
      {
        name: 'Tractor 1',
        type: 'tractor',
        capacity: 1000,
        notes: 'Main tractor for heavy loads',
      },
      {
        name: 'Tractor 2',
        type: 'tractor',
        capacity: 800,
        notes: 'Backup tractor',
      },
      {
        name: 'Cart A',
        type: 'cart',
        capacity: 500,
        notes: 'Small cart for light loads',
      },
    ]);

    console.log('Creating sample labours...');
    const labours = await Labour.create([
      {
        name: 'John Doe',
        phone: '+1234567890',
        rateType: 'per_day',
        defaultRate: 200,
      },
      {
        name: 'Jane Smith',
        phone: '+1234567891',
        rateType: 'per_load',
        defaultRate: 50,
      },
      {
        name: 'Mike Johnson',
        phone: '+1234567892',
        rateType: 'per_unit',
        defaultRate: 10,
      },
      {
        name: 'Sarah Williams',
        phone: '+1234567893',
        rateType: 'per_day',
        defaultRate: 180,
      },
      {
        name: 'Tom Brown',
        phone: '+1234567894',
        rateType: 'per_load',
        defaultRate: 45,
      },
    ]);

    console.log('Seed data created successfully!');
    console.log('\n=== Login Credentials ===');
    console.log('Email: admin@example.com');
    console.log('Password: Admin@123');
    console.log('\n=== Created Resources ===');
    console.log(`Users: 1`);
    console.log(`Vehicles: ${vehicles.length}`);
    console.log(`Labours: ${labours.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
