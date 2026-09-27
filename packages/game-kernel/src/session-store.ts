export interface GameSession {
  src: number;
  account: unknown | null;
  character: unknown | null;
  createdAt: Date;
}

export interface SessionInstallData {
  account?: unknown | null;
  character?: unknown | null;
}

export class SessionStore {
  private readonly sessions = new Map<number, GameSession>();

  install(src: number, data: SessionInstallData = {}): GameSession {
    const existing = this.sessions.get(src);

    if (existing) {
      existing.account = data.account ?? existing.account;
      existing.character = data.character ?? existing.character;
      return existing;
    }

    const session: GameSession = {
      src,
      account: data.account ?? null,
      character: data.character ?? null,
      createdAt: new Date()
    };

    this.sessions.set(src, session);
    return session;
  }

  get(src: number): GameSession | undefined {
    return this.sessions.get(src);
  }

  remove(src: number): void {
    this.sessions.delete(src);
  }

  has(src: number): boolean {
    return this.sessions.has(src);
  }

  all(): GameSession[] {
    return Array.from(this.sessions.values());
  }
}

export const createSessionStore = (): SessionStore => new SessionStore();
