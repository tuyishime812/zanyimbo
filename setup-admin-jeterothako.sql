-- ============================================
-- DGT SOUNDS - Admin Setup for jeterothako276@gmail.com
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CREATE admin_roles TABLE (if it doesn't exist)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view admin_roles" ON admin_roles;
DROP POLICY IF EXISTS "Service role can manage admin_roles" ON admin_roles;

-- Allow authenticated users to view admin_roles (needed for admin check)
CREATE POLICY "Admins can view admin_roles"
  ON admin_roles FOR SELECT
  TO authenticated
  USING (true);

-- Allow service role to manage admin_roles
CREATE POLICY "Service role can manage admin_roles"
  ON admin_roles FOR ALL
  TO service_role
  USING (true);

-- Grant permissions
GRANT SELECT ON admin_roles TO authenticated;
GRANT ALL ON admin_roles TO service_role;

-- ============================================
-- 2. ADD jeterothako276@gmail.com AS ADMIN
-- ============================================
DO $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find user by email
  SELECT id, email INTO user_record
  FROM auth.users
  WHERE email = 'jeterothako276@gmail.com';

  IF user_record.id IS NOT NULL THEN
    -- Add to admin_roles table
    INSERT INTO admin_roles (user_id, email)
    VALUES (user_record.id, user_record.email)
    ON CONFLICT (user_id) DO UPDATE
    SET email = EXCLUDED.email;
    
    RAISE NOTICE '✅ Added jeterothako276@gmail.com as admin';
  ELSE
    RAISE WARNING '⚠️ User jeterothako276@gmail.com not found in auth.users';
    RAISE NOTICE '💡 Please create the user account first via signup or Supabase dashboard';
  END IF;
END $$;

-- ============================================
-- 3. VERIFY ADMIN SETUP
-- ============================================
SELECT 
  ar.id,
  ar.user_id,
  ar.email,
  ar.created_at,
  au.email as auth_email,
  au.created_at as user_created_at
FROM admin_roles ar
LEFT JOIN auth.users au ON ar.user_id = au.id
WHERE ar.email = 'jeterothako276@gmail.com';

-- ============================================
-- 4. SHOW ALL ADMINS
-- ============================================
SELECT 
  ar.id,
  ar.email,
  ar.created_at as admin_since
FROM admin_roles ar
ORDER BY ar.created_at DESC;

-- ============================================
-- NOTES:
-- ============================================
-- 1. Run this script in Supabase SQL Editor
-- 2. Make sure jeterothako276@gmail.com account exists
-- 3. If user doesn't exist, create it via:
--    - Supabase Dashboard > Authentication > Users > Add User
--    - Or sign up via the app at /signup
-- 4. After running, the user will have full admin access
-- ============================================
