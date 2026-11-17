import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container state-container">
      <span className="state-icon" aria-hidden="true">🔍</span>
      <h1>Página não encontrada</h1>
      <p>O endereço que você tentou acessar não existe.</p>
      <Link className="button button-primary" to="/">Voltar para o início</Link>
    </div>
  );
}
