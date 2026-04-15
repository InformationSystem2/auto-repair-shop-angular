import { inject, Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly http = inject(HttpClient);

  private readonly _lang = signal<string>(this.getInitialLang());
  private readonly _translations = signal<any>({});

  readonly currentLang = this._lang.asReadonly();
  readonly translations = this._translations.asReadonly();

  constructor() {
    effect(() => {
      this.loadTranslations(this._lang());
    });
  }

  setLang(lang: string): void {
    localStorage.setItem('preferred_lang', lang);
    this._lang.set(lang);
  }

  translate(key: string, params: Record<string, string> = {}): string {
    const keys = key.split('.');
    let value = this._translations();

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Fallback to key if not found
      }
    }

    if (typeof value !== 'string') return key;

    // Replace params: {{param}}
    return Object.entries(params).reduce(
      (acc, [k, v]) => acc.replace(`{{${k}}}`, v),
      value
    );
  }

  private getInitialLang(): string {
    const saved = localStorage.getItem('preferred_lang');
    if (saved) return saved;

    const browserLang = navigator.language.split('-')[0];
    return ['en', 'es'].includes(browserLang) ? browserLang : 'es';
  }

  private async loadTranslations(lang: string): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get(`/assets/i18n/${lang}.json`)
      );
      this._translations.set(data);
    } catch (error) {
      console.error(`Could not load translations for ${lang}`, error);
    }
  }
}
