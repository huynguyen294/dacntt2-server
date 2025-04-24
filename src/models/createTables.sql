-- extension define;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- create user_role enum if not exits;
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'user_role'
) THEN CREATE TYPE user_role AS ENUM (
    'admin',
    'teacher',
    'student',
    'consultant',
    'finance-officer'
);
END IF;
END $$;
-- create table user if not exits;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role user_role DEFAULT 'student' NOT NULL,
    date_of_birth DATE,
    phone_number VARCHAR(100),
    gender VARCHAR(50),
    address TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- user indexes;
CREATE INDEX IF NOT EXISTS index_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_email_trgm ON users USING GIN (email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_phone_number_trgm ON users USING GIN (phone_number gin_trgm_ops);
-- create table certificates if not exits;
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    issuing_agency VARCHAR(255) NOT NULL,
    image_url TEXT,
    status VARCHAR(255),
    last_updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_certificates_name_trgm ON certificates USING GIN (name gin_trgm_ops);
-- create table courses if not exits;
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(255) NOT NULL,
    number_of_lessons INT,
    status VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_courses_name_trgm ON courses USING GIN (name gin_trgm_ops);
-- create table student_consultation if not exits;
CREATE TABLE IF NOT EXISTS student_consultation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(100),
    status VARCHAR(255),
    priority VARCHAR(255),
    source VARCHAR(255),
    note TEXT,
    expected_course_id INT REFERENCES courses(id) ON DELETE
    SET NULL,
        consultant_id INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
);
-- student_consultation indexes;
CREATE INDEX IF NOT EXISTS idx_student_consultation_name_trgm ON student_consultation USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_student_consultation_email_trgm ON student_consultation USING GIN (email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_student_consultation_phone_number_trgm ON student_consultation USING GIN (phone_number gin_trgm_ops);
-- create table rooms if not exits;
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    max_students INT,
    status VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rooms_name_trgm ON rooms USING GIN (name gin_trgm_ops);
-- create table classes if not exits;
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    week_days VARCHAR(100) NOT NULL,
    shifts VARCHAR(100) NOT NULL,
    opening_day VARCHAR(100) NOT NULL,
    closing_day VARCHAR(100) NOT NULL,
    number_of_lessons INT NOT NULL,
    number_of_students INT NOT NULL,
    status VARCHAR(255),
    room INT REFERENCES rooms(id) ON DELETE
    SET NULL,
        teacher_id INT REFERENCES users(id) ON DELETE
    SET NULL,
        course_id INT REFERENCES courses(id) ON DELETE
    SET NULL,
        created_at TIMESTAMP DEFAULT NOW()
);