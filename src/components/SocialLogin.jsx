import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Chrome, Facebook } from 'lucide-react'
import './SocialLogin.css'

export default function SocialLogin({ onLoginSuccess, redirect = '/admin' }) {
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle, signInWithFacebook } = useAuth()
  const { showToast } = useToast()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      showToast('Successfully signed in with Google', 'success')
      if (onLoginSuccess) onLoginSuccess()
      window.location.href = redirect
    } catch (error) {
      console.error('Google sign in error:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        showToast('Sign-in popup was closed', 'info')
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        showToast('An account already exists with this email. Please use email/password.', 'warning')
      } else {
        showToast('Failed to sign in with Google', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookSignIn = async () => {
    setLoading(true)
    try {
      await signInWithFacebook()
      showToast('Successfully signed in with Facebook', 'success')
      if (onLoginSuccess) onLoginSuccess()
      window.location.href = redirect
    } catch (error) {
      console.error('Facebook sign in error:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        showToast('Sign-in popup was closed', 'info')
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        showToast('An account already exists with this email. Please use email/password.', 'warning')
      } else {
        showToast('Failed to sign in with Facebook', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="social-login">
      <div className="social-login-divider">
        <span>or continue with</span>
      </div>

      <div className="social-login-buttons">
        <button
          type="button"
          className="social-btn google"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <Chrome size={20} />
          <span>{loading ? 'Signing in...' : 'Google'}</span>
        </button>

        <button
          type="button"
          className="social-btn facebook"
          onClick={handleFacebookSignIn}
          disabled={loading}
        >
          <Facebook size={20} />
          <span>{loading ? 'Signing in...' : 'Facebook'}</span>
        </button>
      </div>
    </div>
  )
}
