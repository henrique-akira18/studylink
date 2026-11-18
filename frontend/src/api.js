// Dados simulados apenas em memória. Ao recarregar a página, tudo é resetado.
const DEMO_EMAIL = 'demo@studylink.com';

const state = {
  users: new Map([
    [
      DEMO_EMAIL,
      {
        email: DEMO_EMAIL,
        password: '123456',
        createdAt: new Date().toISOString(),
      },
    ],
  ]),
  profiles: new Map([
    [
      DEMO_EMAIL,
      {
        name: 'Ana Oliveira',
        bio: 'Estudante de Ciência da Computação. Gosto de estudar em grupo e projetos de programação.',
        academic_level: 'Graduação',
        subjects: ['Programação', 'Matemática', 'Banco de Dados'],
        interests: ['Estudos em grupo', 'Pesquisa', 'Projetos'],
        updated_at: new Date().toISOString(),
      },
    ],
  ]),
  tokens: new Map(),
};

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

function createToken() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `token-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getUserFromToken(token) {
  const email = state.tokens.get(token);
  if (!email) throw new Error('Sessão inválida. Entre novamente.');

  const user = state.users.get(email);
  if (!user) throw new Error('Sessão inválida. Entre novamente.');

  return user;
}

function publicUser(user) {
  return { email: user.email, created_at: user.createdAt };
}

export const authApi = {
  async register(email, password) {
    const key = normalizeEmail(email);

    if (state.users.has(key)) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const user = {
      email: key,
      password,
      createdAt: new Date().toISOString(),
    };

    state.users.set(key, user);
    return publicUser(user);
  },

  async login(email, password) {
    const key = normalizeEmail(email);
    const user = state.users.get(key);

    if (!user || user.password !== password) {
      throw new Error('E-mail ou senha incorretos.');
    }

    const access_token = createToken();
    state.tokens.set(access_token, key);

    return { access_token, token_type: 'bearer' };
  },

  async logout(token) {
    state.tokens.delete(token);
    return { detail: 'Sessão encerrada.' };
  },

  async me(token) {
    return publicUser(getUserFromToken(token));
  },
};

export const profileApi = {
  async get(token) {
    const user = getUserFromToken(token);
    const profile = state.profiles.get(user.email);

    if (!profile) throw new Error('Academic profile not found');

    return { email: user.email, ...profile };
  },

  async save(profile, token) {
    const user = getUserFromToken(token);

    const saved = {
      name: profile.name || null,
      bio: profile.bio || null,
      academic_level: profile.academic_level || null,
      subjects: profile.subjects || [],
      interests: profile.interests || [],
      updated_at: new Date().toISOString(),
    };

    state.profiles.set(user.email, saved);
    return { email: user.email, ...saved };
  },
};
