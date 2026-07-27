import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { loadEnvConfig } = require('@next/env');

import { hashPassword } from './auth';
import { getDB } from './db';

loadEnvConfig(process.cwd());

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    const db = await getDB();

    // Remove existing tables
    console.log('🗑️  Removing existing tables...');
    await db.query(`
      REMOVE TABLE IF EXISTS test_answers;
      REMOVE TABLE IF EXISTS test_sessions;
      REMOVE TABLE IF EXISTS patients;
      REMOVE TABLE IF EXISTS sessions;
      REMOVE TABLE IF EXISTS registration_codes;
      REMOVE TABLE IF EXISTS doctors;
    `);

    // Create tables with schema
    console.log('📋 Creating tables...');

    // Doctors table
    await db.query(`
      DEFINE TABLE doctors SCHEMAFULL
        PERMISSIONS FULL;
      DEFINE FIELD name ON doctors TYPE string;
      DEFINE FIELD email ON doctors TYPE string;
      DEFINE FIELD password_hash ON doctors TYPE string;
      DEFINE FIELD created_at ON doctors TYPE datetime DEFAULT time::now();
      DEFINE INDEX email_idx ON doctors COLUMNS email UNIQUE;
    `);

    // Patients table
    await db.query(`
      DEFINE TABLE patients SCHEMAFULL
        PERMISSIONS FULL;
      DEFINE FIELD doctor_id ON patients TYPE record<doctors>;
      DEFINE FIELD name ON patients TYPE string;
      DEFINE FIELD age ON patients TYPE number;
      DEFINE FIELD gender ON patients TYPE string;
      DEFINE FIELD notes ON patients TYPE string;
      DEFINE FIELD medical_conditions ON patients TYPE string;
      DEFINE FIELD created_at ON patients TYPE datetime DEFAULT time::now();
    `);

    // Test sessions table
    await db.query(`
      DEFINE TABLE test_sessions SCHEMAFULL
        PERMISSIONS FULL;
      DEFINE FIELD patient_id ON test_sessions TYPE record<patients>;
      DEFINE FIELD doctor_id ON test_sessions TYPE record<doctors>;
      DEFINE FIELD status ON test_sessions TYPE string;
      DEFINE FIELD total_score ON test_sessions TYPE number DEFAULT 0;
      DEFINE FIELD duration ON test_sessions TYPE number DEFAULT 0;
      DEFINE FIELD started_at ON test_sessions TYPE datetime DEFAULT time::now();
      DEFINE FIELD completed_at ON test_sessions TYPE option<datetime>;
    `);

    // Test answers table
    await db.query(`
      DEFINE TABLE test_answers SCHEMAFULL
        PERMISSIONS FULL;
      DEFINE FIELD session_id ON test_answers TYPE record<test_sessions>;
      DEFINE FIELD question_index ON test_answers TYPE number;
      DEFINE FIELD question_text ON test_answers TYPE string;
      DEFINE FIELD answer ON test_answers TYPE string;
      DEFINE FIELD score ON test_answers TYPE number;
      DEFINE FIELD response_time ON test_answers TYPE number;
      DEFINE FIELD answered_at ON test_answers TYPE datetime DEFAULT time::now();
    `);

    // Sessions table for authentication
    await db.query(`
      DEFINE TABLE sessions SCHEMAFULL
        PERMISSIONS FULL;
      DEFINE FIELD doctor_id ON sessions TYPE record<doctors>;
      DEFINE FIELD session_token ON sessions TYPE string;
      DEFINE FIELD created_at ON sessions TYPE datetime DEFAULT time::now();
      DEFINE INDEX session_token_idx ON sessions COLUMNS session_token UNIQUE;
    `);

    // Registration codes table
    await db.query(`
      DEFINE TABLE registration_codes SCHEMAFULL
        PERMISSIONS FULL;
      DEFINE FIELD code ON registration_codes TYPE string;
      DEFINE FIELD max_uses ON registration_codes TYPE number DEFAULT 10;
      DEFINE FIELD current_uses ON registration_codes TYPE number DEFAULT 0;
      DEFINE FIELD is_used ON registration_codes TYPE bool DEFAULT false;
      DEFINE FIELD used_by ON registration_codes TYPE option<record<doctors>>;
      DEFINE FIELD used_at ON registration_codes TYPE option<datetime>;
      DEFINE FIELD created_at ON registration_codes TYPE datetime DEFAULT time::now();
      DEFINE INDEX code_idx ON registration_codes COLUMNS code UNIQUE;
    `);

    console.log('✅ Tables created successfully');

    // Create default doctor account
    console.log('👨‍⚕️ Creating default doctor account...');

    const defaultPassword = 'admin123';
    const passwordHash = await hashPassword(defaultPassword);

    await db.create('doctors', {
      name: 'Dr. Admin',
      email: 'doctor@vcat.local',
      password_hash: passwordHash,
    });

    console.log('✅ Default doctor created:');
    console.log('   Email: doctor@vcat.local');
    console.log('   Password: admin123');
    console.log('');

    // Create registration codes
    console.log('🔑 Creating registration codes...');

    // Read codes from environment variable, fallback to default codes
    const defaultCodes = ['DFVCAT'];

    const regCodes = process.env.REGISTRATION_CODES
      ? process.env.REGISTRATION_CODES.split(',').map(code => code.trim())
      : defaultCodes;

    for (const code of regCodes) {
      await db.create('registration_codes', {
        code: code,
        max_uses: 10,
        current_uses: 0,
        is_used: false,
      });
    }

    console.log('✅ Registration codes created:');
    regCodes.forEach(code => console.log(`   - ${code}`));
    console.log('');
    console.log('🎉 Database seeding completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
