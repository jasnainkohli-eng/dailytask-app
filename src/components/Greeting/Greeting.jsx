import { useAuth } from '../../hooks/useAuth'
import './Greeting.css'

export function Greeting() {
  const { user } = useAuth()
  
  // Get user's name from metadata or email
  const userName = user?.user_metadata?.full_name || 
                   user?.user_metadata?.name || 
                   user?.email?.split('@')[0] || 
                   'User'

  return (
    <div className="greeting-container">
      <h1 className="greeting-text">
        Have a Great Day, <span className="user-name">{userName}</span>!
      </h1>
    </div>
  )
}

