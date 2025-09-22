-- =======================================
-- Create DB and select it
-- =======================================
CREATE DATABASE IF NOT EXISTS sarkar_sahyka;
USE sarkar_sahyka;

-- =======================================
-- Drop tables in dependency order
-- =======================================
DROP TABLE IF EXISTS applied_schemes;
DROP TABLE IF EXISTS scheme_questions;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS schemes;
DROP TABLE IF EXISTS users;

-- =======================================
-- Users table
-- =======================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uid VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================
-- Schemes table
-- =======================================
CREATE TABLE schemes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  basic_info LONGTEXT,
  objectives LONGTEXT,
  benefits LONGTEXT,
  eligibility LONGTEXT,
  documents TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================
-- User profiles table
-- =======================================
CREATE TABLE user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  profile_photo MEDIUMTEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_profiles_email (user_email),
  CONSTRAINT fk_user_profiles_user
    FOREIGN KEY (user_email) REFERENCES users(email)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================
-- Scheme Questions (dynamic eligibility)
-- =======================================
CREATE TABLE scheme_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  scheme_id INT NOT NULL,
  sort_order INT NOT NULL DEFAULT 1,
  question_text VARCHAR(500) NOT NULL,
  expected_answer ENUM('yes','no') NOT NULL DEFAULT 'yes',
  next_on_yes INT NULL,   -- next question id if yes
  next_on_no INT NULL,    -- next question id if no
  is_terminal_yes TINYINT(1) NOT NULL DEFAULT 0, -- if yes ends flow
  is_terminal_no TINYINT(1) NOT NULL DEFAULT 0,  -- if no ends flow
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_q_scheme FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================
-- Applied schemes table
-- =======================================
CREATE TABLE applied_schemes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  scheme_id INT NOT NULL,
  application_status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
  applied_documents TEXT,
  application_notes TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_applied_schemes_user
    FOREIGN KEY (user_email) REFERENCES users(email)
    ON DELETE CASCADE,
  CONSTRAINT fk_applied_schemes_scheme
    FOREIGN KEY (scheme_id) REFERENCES schemes(id)
    ON DELETE CASCADE,
  UNIQUE KEY unique_application (user_email, scheme_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
