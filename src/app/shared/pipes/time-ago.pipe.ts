import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '@core/services/translation.service';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: false // Not pure because time flows
})
export class TimeAgoPipe implements PipeTransform {
  private i18n = inject(TranslationService);

  transform(value: string | number | Date | undefined | null): string {
    if (!value) return '';
    
    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return this.i18n.translate('time_ago.now');
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      const unit = minutes === 1 ? this.i18n.translate('time_ago.minute') : this.i18n.translate('time_ago.minutes');
      return `${this.i18n.translate('time_ago.ago')} ${minutes} ${unit}`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      const unit = hours === 1 ? this.i18n.translate('time_ago.hour') : this.i18n.translate('time_ago.hours');
      return `${this.i18n.translate('time_ago.ago')} ${hours} ${unit}`;
    }
    
    const days = Math.floor(hours / 24);
    if (days < 30) {
      const unit = days === 1 ? this.i18n.translate('time_ago.day') : this.i18n.translate('time_ago.days');
      return `${this.i18n.translate('time_ago.ago')} ${days} ${unit}`;
    }
    
    const months = Math.floor(days / 30);
    if (months < 12) {
      const unit = months === 1 ? this.i18n.translate('time_ago.month') : this.i18n.translate('time_ago.months');
      return `${this.i18n.translate('time_ago.ago')} ${months} ${unit}`;
    }
    
    const years = Math.floor(months / 12);
    const unit = years === 1 ? this.i18n.translate('time_ago.year') : this.i18n.translate('time_ago.years');
    return `${this.i18n.translate('time_ago.ago')} ${years} ${unit}`;
  }
}
