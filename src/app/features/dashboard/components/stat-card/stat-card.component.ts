import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {
  label = input.required<string>();
  value = input.required<string | number>();
  colorClass = input<string>('bg-indigo-500/10');
  trend = input<{ text: string; positive: boolean } | null>(null);
}
