--set schema
SET search_path TO public;
-- extension define;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- ;
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
-- ;
-- create table user if not exits;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role user_role DEFAULT 'student' NOT NULL,
    date_of_birth DATE,
    phone_number VARCHAR(100),
    gender VARCHAR(100),
    address TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
-- ;
-- user indexes;
CREATE INDEX IF NOT EXISTS idx_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_email_trgm ON users USING GIN (email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_phone_number_trgm ON users USING GIN (phone_number gin_trgm_ops);
-- ;
-- create table employee if not exits;
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    salary INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    employment_type VARCHAR(100) NOT NULL,
    major VARCHAR(255) NOT NULL,
    certificates VARCHAR(255),
    start_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    note TEXT
);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees (user_id);
-- ;
-- create table certificates if not exits;
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    status VARCHAR(255),
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_certificates_name_trgm ON certificates USING GIN (name gin_trgm_ops);
-- ;
-- create table courses if not exits;
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(255),
    number_of_lessons INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    certificate_id INT REFERENCES certificates(id) ON DELETE
    SET NULL,
        last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses (certificate_id);
CREATE INDEX IF NOT EXISTS idx_courses_name_trgm ON courses USING GIN (name gin_trgm_ops);
-- ;
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    expected_course_id INT REFERENCES courses(id) ON DELETE
    SET NULL,
        consultant_id INT REFERENCES users(id) ON DELETE
    SET NULL,
        last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
-- ;
-- student_consultation indexes;
CREATE INDEX IF NOT EXISTS idx_student_consultation_expected_course_id ON student_consultation (expected_course_id);
CREATE INDEX IF NOT EXISTS idx_student_consultation_consultant_id ON student_consultation (consultant_id);
CREATE INDEX IF NOT EXISTS idx_student_consultation_name_trgm ON student_consultation USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_student_consultation_email_trgm ON student_consultation USING GIN (email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_student_consultation_phone_number_trgm ON student_consultation USING GIN (phone_number gin_trgm_ops);
-- ;
-- create table rooms if not exits;
-- CREATE TABLE IF NOT EXISTS rooms (
--    id SERIAL PRIMARY KEY,
--    name VARCHAR(100) NOT NULL,
--    max_students INT NOT NULL,
--    status VARCHAR(255) NOT NULL,
--    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
--    created_at TIMESTAMPTZ DEFAULT NOW(),
--    last_updated_by INT REFERENCES users(id) ON DELETE
--    SET NULL,
--      created_by INT REFERENCES users(id) ON DELETE
--    SET NULL);
-- CREATE INDEX IF NOT EXISTS idx_rooms_name_trgm ON rooms USING GIN (name gin_trgm_ops);
-- ;
-- create table shifts if not exits;
CREATE TABLE IF NOT EXISTS shifts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_shifts_user_id ON shifts (certificate_id);
CREATE INDEX IF NOT EXISTS idx_shifts_name_trgm ON shifts USING GIN (name gin_trgm_ops);
--;
-- create table classes if not exits;
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cost INT NOT NULL,
    week_days VARCHAR(100) NOT NULL,
    opening_day DATE DEFAULT NOW(),
    closing_day DATE NOT NULL,
    number_of_lessons INT NOT NULL,
    number_of_students INT NOT NULL,
    status VARCHAR(255),
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    course_id INT REFERENCES courses(id) ON DELETE
    SET NULL,
        last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_classes_course_id ON classes (course_id);
--;
-- create table enrollments if not exits;
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    status VARCHAR(255) NOT NULL,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id INT REFERENCES users(id) ON DELETE
    SET NULL,
        shifts_id INT REFERENCES shifts(id) ON DELETE
    SET NULL,
        class_id INT REFERENCES classes(id) ON DELETE
    SET NULL,
        last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS status ON enrollments (status);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON enrollments (class_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_shifts_id ON enrollments (shifts_id);
--;
-- init data enrollments if not exits;