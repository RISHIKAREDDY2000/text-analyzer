import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private auth: AuthService) {}

  private headers() {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    const t = this.auth.token;
    if (t) h['Authorization'] = `Bearer ${t}`;
    return h;
  }

  async listRecords() {
    const res = await fetch('/api/records', { headers: this.headers() });
    if (!res.ok) throw new Error('Load failed');
    return res.json();
  }

  async analyze(text: string) {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Analyze failed');
    return res.json();
  }

  async updateRecord(id: string, text: string) {
    const res = await fetch(`/api/records/${id}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Update failed');
    return res.json();
  }

  async deleteRecord(id: string) {
    const res = await fetch(`/api/records/${id}`, {
      method: 'DELETE',
      headers: this.headers()
    });
    if (!res.ok) throw new Error('Delete failed');
    return res.json();
  }
}
