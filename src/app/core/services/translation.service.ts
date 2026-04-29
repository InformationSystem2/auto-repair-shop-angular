import { inject, Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly http = inject(HttpClient);

  private readonly _lang = signal<string>(this.getInitialLang());
  private readonly _translations = signal<any>({});
  private readonly _cache = new Map<string, any>();

  readonly currentLang = this._lang.asReadonly();
  readonly translations = this._translations.asReadonly();

  constructor() {
    effect(() => {
      this.loadTranslations(this._lang());
    });
    // Pre-load English so exports always have English labels available
    this.ensureLangLoaded('en');
  }

  setLang(lang: string): void {
    localStorage.setItem('preferred_lang', lang);
    this._lang.set(lang);
  }

  translate(key: string, params: Record<string, string> = {}): string {
    return this._lookup(this._translations(), key, params);
  }

  translateInLang(key: string, lang: string, params: Record<string, string> = {}): string {
    return this._lookup(this._cache.get(lang) ?? {}, key, params);
  }

  private _lookup(translations: any, key: string, params: Record<string, string>): string {
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value !== 'string') return key;

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

  private async ensureLangLoaded(lang: string): Promise<void> {
    if (this._cache.has(lang)) return;
    try {
      const data = await firstValueFrom(this.http.get(`/assets/i18n/${lang}.json`));
      this._cache.set(lang, data);
    } catch (error) {
      console.error(`Could not load translations for ${lang}`, error);
    }
  }

  private async loadTranslations(lang: string): Promise<void> {
    await this.ensureLangLoaded(lang);
    const data = this._cache.get(lang);
    if (data) this._translations.set(data);
  }
}
