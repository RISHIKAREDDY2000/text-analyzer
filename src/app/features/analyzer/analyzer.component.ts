import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

type RecordItem = { id: string; text: string; summary: string; updatedAt: string; createdBy: string };

@Component({
  selector: 'app-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analyzer.component.html',
  styleUrls: ['./analyzer.component.scss']
})
export class AnalyzerComponent {
  text = signal('');
  role = signal<'editor' | 'reader' | null>(null);
  loading = signal(false);
  records = signal<RecordItem[]>([]);
  preview = signal<{ text: string; summary: string } | null>(null);
  error = signal<string | null>(null);

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {
    this.role.set(auth.role);
    effect(() => { if (!auth.isLoggedIn()) this.router.navigateByUrl('/login'); });
    this.load();
  }

  async load() {
    try { this.records.set(await this.api.listRecords()); }
    catch (e: any) { this.error.set(e.message || 'Load failed'); }
  }

  async summarize() {
    this.error.set(null);
    this.preview.set(null);
    this.loading.set(true);
    try {
      const res = await this.api.analyze(this.text());
      if (res.saved) {
        await this.load();
        this.text.set('');
      } else {
        this.preview.set(res.preview);
      }
    } catch (e: any) {
      this.error.set(e.message || 'Analyze failed');
    } finally {
      this.loading.set(false);
    }
  }

  canEdit() { return this.role() === 'editor'; }

  async update(item: RecordItem) {
    const newText = prompt('Edit text:', item.text);
    if (newText == null) return;
    await this.api.updateRecord(item.id, newText);
    await this.load();
  }

  async remove(item: RecordItem) {
    if (!confirm('Delete this record?')) return;
    await this.api.deleteRecord(item.id);
    await this.load();
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
