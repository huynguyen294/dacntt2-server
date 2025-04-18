-- create user_role enum if not exits;
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'user_role'
) THEN CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student', 'parents');
END IF;
END $$;
-- create table user if not exits;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role user_role DEFAULT 'student',
    date_of_birth DATE,
    phone_number VARCHAR(100),
    address TEXT,
    create_at TIMESTAMP DEFAULT NOW()
)