import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div>
      <h1>404 - Strona nie znaleziona</h1>
      <p>Przepraszamy, strona której szukasz nie istnieje.</p>
      <Link to="/">Powrót do strony głównej</Link>
    </div>
  )
}

export default NotFound
