import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { trackLogin, trackSignup } from '../hooks/useGoogleAnalytics'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAdminStatus = async (supabaseUser) => {
    if (!supabaseUser) {
      setIsAdmin(false)
      return
    }

    try {
      // Check if user is in admin_users table
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', supabaseUser.email)
        .single()

      if (adminData && adminData.is_super_admin) {
        console.log('✅ User is super admin:', supabaseUser.email)
        setIsAdmin(true)
      } else if (adminData) {
        console.log('✅ User is admin:', supabaseUser.email)
        setIsAdmin(true)
      } else {
        // Check default admin emails
        const adminEmails = ['admin@dgt-sounds.com', 'jeterothako276@gmail.com']
        if (adminEmails.includes(supabaseUser.email)) {
          console.log('✅ Admin email detected:', supabaseUser.email)
          setIsAdmin(true)
        } else {
          console.log('⚠️ User is not admin:', supabaseUser.email)
          setIsAdmin(false)
        }
      }
    } catch (err) {
      console.error('Error checking admin status:', err)
      setIsAdmin(false)
    }
  }

  const createUserProfile = async (supabaseUser, displayName = null, provider = 'email') => {
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', supabaseUser.id)
      .single()

    if (!existingProfile) {
      await supabase.from('user_profiles').insert({
        user_id: supabaseUser.id,
        email: supabaseUser.email,
        username: displayName || supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
        avatar_url: supabaseUser.user_metadata?.avatar_url || null,
        is_creator: false,
        provider: provider,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const supabaseUser = session?.user
      setUser(supabaseUser)
      if (supabaseUser) {
        await checkAdminStatus(supabaseUser)
        await createUserProfile(supabaseUser)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const supabaseUser = session?.user
      setUser(supabaseUser)
      if (supabaseUser) {
        await checkAdminStatus(supabaseUser)
        await createUserProfile(supabaseUser)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      trackLogin('email')
      return data
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  const signUp = async (email, password, displayName = null) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName
          }
        }
      })
      if (error) throw error

      // Create user profile in Supabase
      if (data.user) {
        await createUserProfile(data.user, displayName, 'email')
      }

      trackSignup('email')
      return data
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  // Social Login - Google
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'email profile',
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
      trackSignup('google')
      return data
    } catch (error) {
      console.error('Google sign in error:', error)
      throw error
    }
  }

  // Social Login - Facebook (not supported by Supabase yet, using Google instead)
  const signInWithFacebook = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          scopes: 'email public_profile',
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
      trackSignup('facebook')
      return data
    } catch (error) {
      console.error('Facebook sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  const value = {
    user,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithFacebook
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
