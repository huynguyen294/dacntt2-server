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
--;
-- create table student_exam if not exits;
CREATE TABLE IF NOT EXISTS info_sheet (
    id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
    content TEXT NOT NULL,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
-- ;
-- create table user if not exits;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255),
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
    skill VARCHAR(255),
    level VARCHAR(255),
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
    name VARCHAR(255) NOT NULL,
    description TEXT,
    level INT,
    number_of_lessons INT NOT NULL,
    number_of_students INT NOT NULL,
    tuition_fee INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    --    certificate_id INT REFERENCES certificates(id) ON DELETE
    --    SET NULL,
    last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
-- CREATE INDEX IF NOT EXISTS idx_courses_certificate_id ON courses (certificate_id);
CREATE INDEX IF NOT EXISTS idx_courses_name_trgm ON courses USING GIN (name gin_trgm_ops);
-- ;
-- create table student_consultation if not exits;
CREATE TABLE IF NOT EXISTS student_consultation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(50),
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(100),
    date_of_birth DATE,
    address VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    source VARCHAR(255),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    student_id INT REFERENCES users(id) ON DELETE
    SET NULL,
        consultant_id INT REFERENCES users(id) ON DELETE
    SET NULL,
        expected_course_id INT REFERENCES courses(id) ON DELETE
    SET NULL,
        expected_class_id INT REFERENCES classes(id) ON DELETE
    SET NULL,
        last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
-- ;
-- student_consultation indexes;
CREATE INDEX IF NOT EXISTS idx_student_consultation_student_id ON student_consultation (student_id);
CREATE INDEX IF NOT EXISTS idx_student_consultation_status ON student_consultation (status);
CREATE INDEX IF NOT EXISTS idx_student_consultation_expected_course_id ON student_consultation (expected_course_id);
CREATE INDEX IF NOT EXISTS idx_student_consultation_expected_class_id ON student_consultation (expected_class_id);
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
--;
-- create table classes if not exits;
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tuition_fee INT NOT NULL,
    week_days VARCHAR(100) NOT NULL,
    opening_day DATE DEFAULT NOW(),
    closing_day DATE NOT NULL,
    number_of_lessons INT NOT NULL,
    number_of_students INT NOT NULL,
    level INT,
    description TEXT,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    shift_id INT REFERENCES shifts(id) ON DELETE
    SET NULL,
        course_id INT REFERENCES courses(id) ON DELETE
    SET NULL,
        teacher_id INT REFERENCES users(id) ON DELETE
    SET NULL,
        last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_classes_shift_id ON classes (shift_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes (teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_course_id ON classes (course_id);
CREATE INDEX IF NOT EXISTS idx_classes_name_trgm ON classes USING GIN (name gin_trgm_ops);
--;
-- create table class_schedules if not exits;
CREATE TABLE IF NOT EXISTS class_schedules (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    is_absented BOOLEAN,
    note TEXT,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    shift_id INT REFERENCES shifts(id) ON DELETE
    SET NULL,
        teacher_id INT REFERENCES users(id) ON DELETE
    SET NULL,
        last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        UNIQUE ("date", "class_id", "shift_id")
);
CREATE INDEX IF NOT EXISTS idx_class_schedules_class_id ON class_schedules (class_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_date ON class_schedules (date);
-- create table class_topics if not exits;
CREATE TABLE IF NOT EXISTS class_topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(610) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_class_topics_class_id ON class_topics (class_id);
-- create table class_exercises if not exits;
CREATE TABLE IF NOT EXISTS class_exercises (
    id SERIAL PRIMARY KEY,
    title VARCHAR(610) NOT NULL,
    description TEXT,
    due_day DATE,
    release_day DATE,
    is_draft BOOLEAN,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    topic_id INT REFERENCES class_topics(id) ON DELETE
    SET NULL,
        last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_class_exercises_class_id ON class_exercises (class_id);
CREATE TABLE IF NOT EXISTS class_exercise_scores (
    id SERIAL PRIMARY KEY,
    score INT,
    status VARCHAR(255),
    exercise_id INT REFERENCES class_exercises(id) ON DELETE CASCADE,
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    student_id INT REFERENCES users(id) ON DELETE CASCADE,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_class_exercise_scores_class_id ON class_exercise_scores (class_id);
CREATE INDEX IF NOT EXISTS idx_class_exercise_scores_exercise_id ON class_exercise_scores (exercise_id);
CREATE INDEX IF NOT EXISTS idx_class_exercise_scores_student_id ON class_exercise_scores (student_id);
-- create table class_attendances if not exits;
CREATE TABLE IF NOT EXISTS class_attendances (
    id SERIAL PRIMARY KEY,
    attend VARCHAR(255) NOT NULL,
    note TEXT,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    student_id INT REFERENCES users(id) ON DELETE
    SET NULL,
        last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        lesson_id INT REFERENCES class_schedules(id) ON DELETE CASCADE,
        UNIQUE ("student_id", "lesson_id", "class_id")
);
CREATE INDEX IF NOT EXISTS idx_class_attendances_attend ON class_attendances (attend);
CREATE INDEX IF NOT EXISTS idx_class_attendances_class_id ON class_attendances (class_id);
CREATE INDEX IF NOT EXISTS idx_class_attendances_lesson_id ON class_attendances (lesson_id);
--;
-- create table enrollments if not exits;
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    class_id INT REFERENCES classes(id) ON DELETE CASCADE,
    student_id INT REFERENCES users(id) ON DELETE CASCADE,
    last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        UNIQUE ("student_id", "class_id")
);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON enrollments (class_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments (student_id);
--;
-- create table exams if not exits;
CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_exams_name_trgm ON exams USING GIN (name gin_trgm_ops);
--;
-- create table student_exam if not exits;
CREATE TABLE IF NOT EXISTS student_exam (
    id SERIAL PRIMARY KEY,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    exam_id INT REFERENCES exams(id) ON DELETE
    SET NULL,
        student_id INT REFERENCES users(id) ON DELETE
    SET NULL,
        last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_student_exam_exam_id ON student_exam (exam_id);
CREATE INDEX IF NOT EXISTS idx_student_exam_student_id ON student_exam (student_id);
--;
-- create table tuition if not exits;
CREATE TABLE IF NOT EXISTS tuition (
    id SERIAL PRIMARY KEY,
    amount INT NOT NULL,
    date DATE,
    content TEXT,
    note TEXT,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    student_id INT REFERENCES users(id) ON DELETE
    SET NULL,
        class_id INT REFERENCES classes(id) ON DELETE
    SET NULL,
        last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_tuition_student_id ON tuition (student_id);
CREATE INDEX IF NOT EXISTS idx_tuition_class_id ON tuition (class_id);
--;
-- create table tuition if not exits;
CREATE TABLE IF NOT EXISTS tuition_discount (
    id SERIAL PRIMARY KEY,
    amount INT NOT NULL,
    reason TEXT,
    last_updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    class_id INT REFERENCES classes(id) ON DELETE
    SET NULL,
        student_id INT REFERENCES users(id) ON DELETE
    SET NULL,
        last_updated_by INT REFERENCES users(id) ON DELETE
    SET NULL,
        created_by INT REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE INDEX IF NOT EXISTS idx_tuition_discount_student_id ON tuition_discount (student_id);
CREATE INDEX IF NOT EXISTS idx_tuition_discount_class_id ON tuition_discount (class_id);