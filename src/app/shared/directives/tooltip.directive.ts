import { Directive, ElementRef, HostListener, Input, Renderer2, inject, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipText = '';
  
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private tooltipEl: HTMLDivElement | null = null;

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.tooltipText) return;
    this.createTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.removeTooltip();
  }

  ngOnDestroy() {
    this.removeTooltip();
  }

  private createTooltip() {
    this.tooltipEl = this.renderer.createElement('div');
    this.renderer.appendChild(this.tooltipEl, this.renderer.createText(this.tooltipText));
    this.renderer.appendChild(document.body, this.tooltipEl);

    // Styling
    this.tooltipEl!.className = 'fixed z-[100] px-2 py-1 text-xs font-medium text-white bg-slate-900 dark:bg-slate-50 dark:text-slate-900 rounded shadow-md pointer-events-none animate-in fade-in duration-200';
    
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipEl!.getBoundingClientRect();

    const top = hostPos.top - tooltipPos.height - 8;
    const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

    this.renderer.setStyle(this.tooltipEl, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipEl, 'left', `${left}px`);
  }

  private removeTooltip() {
    if (this.tooltipEl) {
      this.renderer.removeChild(document.body, this.tooltipEl);
      this.tooltipEl = null;
    }
  }
}
