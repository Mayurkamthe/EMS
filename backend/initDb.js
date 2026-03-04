const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDb() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            // try without password first, or fallback to root
            password: process.env.DB_PASSWORD || '',
        });

        console.log('Connected to MySQL server.');

        const sqlScript = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf-8');
        const statements = sqlScript.split(';').filter(stmt => stmt.trim() !== '');

        for (let statement of statements) {
            if (statement.trim()) {
                await connection.query(statement + ';');
            }
        }

        console.log('Database and tables created successfully.');
        await connection.end();
    } catch (error) {
        console.error('Error initializing database:', error.message);

        // Retry with 'root' password if empty password fails
        if (error.message.includes('Access denied') && (process.env.DB_PASSWORD || '') === '') {
            console.log('Retrying with password "root"...');
            try {
                const connection2 = await mysql.createConnection({
                    host: process.env.DB_HOST || 'localhost',
                    user: process.env.DB_USER || 'root',
                    password: 'root'
                });

                const sqlScript = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf-8');
                const statements = sqlScript.split(';').filter(stmt => stmt.trim() !== '');

                for (let statement of statements) {
                    if (statement.trim()) {
                        await connection2.query(statement + ';');
                    }
                }

                console.log('Database and tables created successfully with password "root".');
                await connection2.end();
            } catch (err2) {
                console.error('Error with password "root":', err2.message);
            }
        }
    }
}

initDb();
