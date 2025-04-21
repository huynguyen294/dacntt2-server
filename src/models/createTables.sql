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
CREATE INDEX IF NOT EXISTS idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_email_trgm ON users USING GIN (email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_phone_number_trgm ON users USING GIN (phone_number gin_trgm_ops);