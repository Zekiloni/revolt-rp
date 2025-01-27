import { animate, style, transition, trigger } from '@angular/animations';


export const fadeInOutTrigger = trigger('fadeInOut', [
  transition(':enter', [style({ opacity: 0 }), animate('250ms', style({ opacity: 1 }))]),
  transition(':leave', [animate('150ms', style({ opacity: 0 }))])
]);
