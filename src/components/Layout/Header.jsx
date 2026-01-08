import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import './Header.css'

export function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">Daily Tasks</h1>
        <nav className="header-nav">
          <button onClick={() => navigate('/')} className="nav-link">
            Home
          </button>
          <button onClick={() => navigate('/history')} className="nav-link">
            History
          </button>
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleSignOut} className="sign-out-button">
              Sign Out
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

