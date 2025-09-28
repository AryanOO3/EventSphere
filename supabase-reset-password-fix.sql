-- Fix for Reset Password Functionality
-- Run this in Supabase SQL Editor to add missing columns

-- Check if columns exist and add them if missing
DO $$ 
BEGIN
    -- Add reset_token column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'reset_token'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN reset_token VARCHAR(255);
    END IF;
    
    -- Add reset_token_expires column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'reset_token_expires'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN reset_token_expires TIMESTAMP;
    END IF;
END $$;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
AND column_name IN ('reset_token', 'reset_token_expires')
ORDER BY column_name;