import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      checkAdminStatus(session?.user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        await checkAdminStatus(session?.user)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (user) => {
    if (!user) {
      setIsAdmin(false)
      return
    }

    // Check if user has admin role in metadata
    // Supabase stores custom claims in app_metadata (from JWT token)
    const appMetadataRole = user.app_metadata?.role
    const userMetadataRole = user.user_metadata?.role
    
    let isAdmin = appMetadataRole === 'admin' || userMetadataRole === 'admin'

    // If not in metadata, query the database directly
    if (!isAdmin) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('is_super_admin')
          .eq('email', user.email)
          .single()
        
        if (!error && data) {
          isAdmin = data.is_super_admin === true
        }
      } catch (e) {
        // admin_users table might not have the user yet
        console.log('Admin check fallback:', e.message)
      }
    }

    console.log('🔐 Admin Status Check:', { 
      email: user.email,
      isAdmin,
      appMetadataRole,
      userMetadataRole
    })

    setIsAdmin(isAdmin)
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
