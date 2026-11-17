import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { profileApi } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

function isMissingProfile(error) {
  return /not found|não encontrado/i.test(error.message);
}

export default function Profile() {
  const { token, user } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    profileApi
      .get(token)
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch((err) => {
        if (!active) return;
        if (isMissingProfile(err)) setProfile(null);
        else setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="container page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Perfil acadêmico</span>
          <h1>Meu perfil</h1>
          <p>Veja como os outros estudantes te conhecem.</p>
        </div>
        <Link className="button button-primary" to="/profile/edit">
          {profile ? 'Editar perfil' : 'Criar perfil'}
        </Link>
      </div>

      {location.state?.saved && (
        <div className="alert alert-success" role="status">Perfil salvo com sucesso!</div>
      )}
      {error && <div className="alert alert-error" role="alert">{error}</div>}

      {loading ? (
        <div className="state-card">
          <div className="spinner" aria-hidden="true" />
          <p>Carregando perfil...</p>
        </div>
      ) : !profile ? (
        <div className="state-card">
          <span className="state-icon" aria-hidden="true">🎓</span>
          <h2>Nenhum perfil encontrado</h2>
          <p>Preencha suas informações para criar seu perfil acadêmico.</p>
          <Link className="button button-primary" to="/profile/edit">Criar meu perfil</Link>
        </div>
      ) : (
        <div className="profile-layout">
          <section className="panel profile-card">
            <div className="profile-identity">
              <div className="profile-avatar" aria-hidden="true">
                {(profile.name || user?.email || 'SL').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2>{profile.name || 'Nome não informado'}</h2>
                <p>{profile.email}</p>
              </div>
            </div>

            {profile.academic_level && (
              <span className="level-badge">{profile.academic_level}</span>
            )}

            <div className="profile-section">
              <h3>Sobre</h3>
              <p className="panel-text">
                {profile.bio || 'Você ainda não escreveu uma bio sobre sua trajetória.'}
              </p>
            </div>

            <div className="profile-section">
              <h3>Matérias</h3>
              {profile.subjects?.length ? (
                <div className="tag-list">
                  {profile.subjects.map((subject) => (
                    <span className="tag" key={subject}>{subject}</span>
                  ))}
                </div>
              ) : (
                <p className="muted">Nenhuma matéria adicionada.</p>
              )}
            </div>

            <div className="profile-section">
              <h3>Interesses</h3>
              {profile.interests?.length ? (
                <div className="tag-list">
                  {profile.interests.map((interest) => (
                    <span className="tag tag-accent" key={interest}>{interest}</span>
                  ))}
                </div>
              ) : (
                <p className="muted">Nenhum interesse adicionado.</p>
              )}
            </div>
          </section>

          <aside className="panel profile-side">
            <h3>Status do perfil</h3>
            <p className="muted">Seu perfil está pronto para conexões.</p>
            <div className="side-stat">
              <span>Última atualização</span>
              <strong>
                {new Date(profile.updated_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </strong>
            </div>
            <Link className="button button-outline button-full" to="/profile/edit">
              Editar informações
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
