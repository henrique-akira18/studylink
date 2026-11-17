import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const features = [
  {
    title: 'Perfil acadêmico',
    description:
      'Registre sua área, seu nível de estudo e um breve resumo sobre sua trajetória.',
    icon: '🎓',
  },
  {
    title: 'Matérias em foco',
    description:
      'Liste as disciplinas que você estuda e encontre colegas com o mesmo conteúdo.',
    icon: '📚',
  },
  {
    title: 'Interesses em comum',
    description:
      'Mostre seus interesses e descubra pessoas com quem colaborar nos estudos.',
    icon: '✨',
  },
];

export default function Home() {
  const { token } = useAuth();

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Conecte-se para aprender</span>
            <h1>
              Estude junto. <span className="text-accent">Evolua mais rápido.</span>
            </h1>
            <p className="hero-description">
              O StudyLink reúne seu perfil acadêmico, disciplinas e interesses em um
              só lugar para você encontrar pessoas com quem estudar.
            </p>
            <div className="hero-actions">
              <Link
                className="button button-primary button-lg"
                to={token ? '/dashboard' : '/register'}
              >
                {token ? 'Ir para o painel' : 'Começar agora'}
              </Link>
              <Link
                className="button button-outline button-lg"
                to={token ? '/profile' : '/login'}
              >
                {token ? 'Ver meu perfil' : 'Já tenho conta'}
              </Link>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="visual-card visual-card-main">
              <div className="visual-avatar">SL</div>
              <div>
                <span className="visual-role">Perfil acadêmico</span>
                <strong>Seu espaço de estudos</strong>
              </div>
              <div className="visual-tags">
                <span>Matemática</span>
                <span>Programação</span>
                <span>Física</span>
              </div>
              <div className="visual-progress">
                <span />
              </div>
            </div>
            <div className="visual-card visual-card-float">
              <span className="float-icon">✓</span>
              <div>
                <strong>Perfil organizado</strong>
                <small>Pronto para novas conexões</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Tudo começa com um bom perfil</h2>
            <p>Organize o que você estuda e mostre o que te move.</p>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <span className="feature-icon" aria-hidden="true">
                  {feature.icon}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-cta">
        <div className="container cta-panel">
          <div>
            <h2>Pronto para dar o próximo passo?</h2>
            <p>Crie sua conta e comece a construir seu perfil acadêmico hoje.</p>
          </div>
          <Link className="button button-light button-lg" to={token ? '/profile/edit' : '/register'}>
            {token ? 'Completar meu perfil' : 'Criar minha conta'}
          </Link>
        </div>
      </section>
    </>
  );
}
