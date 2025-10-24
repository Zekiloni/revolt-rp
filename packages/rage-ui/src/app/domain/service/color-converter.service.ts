// color-converter.service.ts
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ColorConverterService {
  private observer?: MutationObserver;
  private interval?: ReturnType<typeof setInterval>;

  private readonly surfaceLevels = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  constructor(@Inject(DOCUMENT) private document: Document) {}

  initialize() {
    // Convert immediately and periodically to catch PrimeNG setting variables
    this.convert();
    this.interval = setInterval(() => this.convert(), 100);

    // Watch for theme changes
    this.observer = new MutationObserver(() => this.convert());
    this.observer.observe(this.document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  private convert() {
    const style = getComputedStyle(this.document.documentElement);

    this.surfaceLevels.forEach(level => {
      const varName = `--p-surface-${level}`;
      const value = style.getPropertyValue(varName);

      if (value) {
        const rgb = this.toRgb(value.trim());
        if (rgb) {
          this.document.documentElement.style.setProperty(`${varName}-rgb`, rgb);
        }
      }
    });
  }

  private toRgb(val: string): string | null {
    // Handle hex colors
    if (val.startsWith('#')) {
      const r = parseInt(val.slice(1, 3), 16);
      const g = parseInt(val.slice(3, 5), 16);
      const b = parseInt(val.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    }

    // Handle rgb/rgba colors
    const match = val.match(/\d+/g);
    return match ? `${match[0]}, ${match[1]}, ${match[2]}` : null;
  }

  destroy() {
    this.observer?.disconnect();
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
