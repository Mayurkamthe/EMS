require('dotenv').config();
const mysql = require('mysql2/promise');

const updateDatabase = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log('Connected to MySQL database.');

        // Check if 'attended' column exists
        const [columns] = await connection.query(`SHOW COLUMNS FROM registrations LIKE 'attended'`);
        if (columns.length === 0) {
            console.log('Adding "attended" column to "registrations" table...');
            await connection.query('ALTER TABLE registrations ADD COLUMN attended BOOLEAN DEFAULT FALSE');
            console.log('Column "attended" added successfully.');
        } else {
            console.log('Column "attended" already exists.');
        }

        // Check if 'is_paid' column exists
        const [isPaidCols] = await connection.query(`SHOW COLUMNS FROM events LIKE 'is_paid'`);
        if (isPaidCols.length === 0) {
            console.log('Adding "is_paid" and "fee" columns to "events" table...');
            await connection.query('ALTER TABLE events ADD COLUMN is_paid BOOLEAN DEFAULT FALSE, ADD COLUMN fee DECIMAL(10,2) DEFAULT 0.00');
            console.log('Columns "is_paid" and "fee" added successfully.');
        } else {
            console.log('Columns "is_paid" and "fee" already exist.');
        }

        await connection.end();
        console.log('Database connection closed.');
    } catch (err) {
        console.error('Error updating database:', err.message);
    }
};

updateDatabase();
