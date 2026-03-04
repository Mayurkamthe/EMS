-- Smart College Event Management System Database Schema
-- Run this in MySQL to set up the database

CREATE DATABASE IF NOT EXISTS college_ems;
USE college_ems;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'faculty', 'student') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('hall', 'projector', 'sound_system', 'other') NOT NULL,
  total_quantity INT DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  end_time TIME NOT NULL,
  venue VARCHAR(200),
  total_seats INT NOT NULL DEFAULT 50,
  registered_seats INT DEFAULT 0,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_by INT NOT NULL,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Event resource bookings
CREATE TABLE IF NOT EXISTS event_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  resource_id INT NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

-- Student event registrations
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  student_id INT NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_registration (event_id, student_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@college.edu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- Default password: 'password'

-- Insert sample resources
INSERT INTO resources (name, type, total_quantity, description) VALUES
('Seminar Hall A', 'hall', 1, 'Main seminar hall with 200 seats'),
('Seminar Hall B', 'hall', 1, 'Secondary seminar hall with 100 seats'),
('Projector', 'projector', 5, 'HD projectors'),
('Sound System', 'sound_system', 3, 'Professional sound systems');
