import { useQuote } from '../../hooks/useQuote'
import './Quote.css'

export function DailyQuote() {
  const { quote } = useQuote()

  return (
    <div className="quote-container">
      <div className="quote-icon">💭</div>
      <h3 className="quote-title">Today's Motivation</h3>
      <p className="quote-text">"{quote}"</p>
    </div>
  )
}

