import { Directive, ElementRef, HostListener, Inject, Input } from '@angular/core';
import { API_BASE_HREF } from '../variables';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'img[imgFallback]',
  standalone: true
})
export class ImgFallbackDirective {
  @Input() imgFallback?: string;

  DEFAULT =  'assets/images/no-icon.png';

  constructor(
    private el: ElementRef<HTMLImageElement>,
    @Inject(API_BASE_HREF) private baseHref: string
  ) {}

  @HostListener('error')
  onError() {
    const fallback = this.imgFallback || this.DEFAULT;
    this.el.nativeElement.src =
      `${this.baseHref.replace('/api', '')}/${fallback}`;
  }
}
