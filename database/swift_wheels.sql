CREATE DATABASE IF NOT EXISTS swift_wheels;
USE swift_wheels;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reservation_rental;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS vehicle;
DROP TABLE IF EXISTS user;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE vehicle (
  vehicleId INT AUTO_INCREMENT PRIMARY KEY,
  plate_number VARCHAR(30) NOT NULL UNIQUE,
  brand VARCHAR(80) NOT NULL,
  model VARCHAR(80) NOT NULL,
  year INT NOT NULL,
  vehicle_type VARCHAR(60) NOT NULL,
  purchase_price DECIMAL(12, 2) NOT NULL,
  status ENUM('available', 'reserved', 'rented', 'maintenance') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user (
  userId INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  gender ENUM('male', 'female') NOT NULL,
  role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer (
  customerId INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  national_ID VARCHAR(60) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  address VARCHAR(255) NOT NULL,
  vehicleId INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_customer_user FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE CASCADE,
  CONSTRAINT fk_customer_vehicle FOREIGN KEY (vehicleId) REFERENCES vehicle(vehicleId) ON DELETE SET NULL
);

CREATE TABLE reservation_rental (
  reserveId INT AUTO_INCREMENT PRIMARY KEY,
  customerId INT NOT NULL,
  vehicleId INT NOT NULL,
  reservation_Date DATE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reservation_status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  rental_date DATE NULL,
  rental_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  rental_status ENUM('not_started', 'active', 'returned', 'cancelled') NOT NULL DEFAULT 'not_started',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservation_customer FOREIGN KEY (customerId) REFERENCES customer(customerId) ON DELETE CASCADE,
  CONSTRAINT fk_reservation_vehicle FOREIGN KEY (vehicleId) REFERENCES vehicle(vehicleId) ON DELETE CASCADE
);

INSERT INTO user (username, password, gender, role)
VALUES
('admin', 'admin123', 'male', 'admin');

INSERT INTO vehicle (plate_number, brand, model, year, vehicle_type, purchase_price, status)
VALUES
('RAB 123A', 'Toyota', 'Corolla', 2020, 'Sedan', 14500.00, 'available'),
('RAC 456B', 'Hyundai', 'Tucson', 2021, 'SUV', 25000.00, 'available'),
('RAD 789C', 'Nissan', 'Navara', 2019, 'Pickup', 22000.00, 'maintenance'),
('RAE 321D', 'Honda', 'Fit', 2018, 'Hatchback', 9800.00, 'available');
