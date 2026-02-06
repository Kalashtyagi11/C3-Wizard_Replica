-- Add username and security questions to c3_profiles for registration
ALTER TABLE c3_profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS security_question_1 TEXT,
ADD COLUMN IF NOT EXISTS security_answer_1 TEXT,
ADD COLUMN IF NOT EXISTS security_question_2 TEXT,
ADD COLUMN IF NOT EXISTS security_answer_2 TEXT;

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_c3_profiles_username ON c3_profiles(username);

-- Add status column to c3_self_employed_profiles if it doesn't exist
ALTER TABLE c3_self_employed_profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';