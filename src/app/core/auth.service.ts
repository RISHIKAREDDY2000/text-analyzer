import { Injectable } from '@angular/core';

type LoginResp = { token: string; role: 'editor' | 'reader'; username: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'ta_token';
  private roleKey = 'ta_role';
  private userKey = 'ta_user';

  isLoggedIn(): boolean { return !!localStorage.getItem(this.tokenKey); }
  get token(): string | null { return localStorage.getItem(this.tokenKey); }
  get role(): 'editor' | 'reader' | null { return localStorage.getItem(this.roleKey) as any; }
  get username(): string | null { return localStorage.getItem(this.userKey); }

  async login(username: string, password: string): Promise<void> {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Invalid credentials');
    const data: LoginResp = await res.json();
    localStorage.setItem(this.tokenKey, data.token);
    localStorage.setItem(this.roleKey, data.role);
    localStorage.setItem(this.userKey, data.username);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userKey);
  }
}
