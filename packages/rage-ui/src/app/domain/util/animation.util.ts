import { animate, style, transition, trigger } from '@angular/animations';


export const fadeInOutTrigger = trigger('fadeInOut', [
  transition(':enter', [style({ opacity: 0 }), animate('250ms', style({ opacity: 1 }))]),
  transition(':leave', [animate('150ms', style({ opacity: 0 }))])
]);

export const slideInOutTrigger = trigger('slideInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(75%)' }),
    animate('350ms ease-in', style({ opacity: 1, transform: 'translateY(0%)' }))
  ]),
  transition(':leave', [
    animate('250ms ease-in', style({ opacity: 0, transform: 'translateY(75%)' }))
  ])
]);

export const slideDownUpTrigger = trigger('slideDownUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-45%)' }),
    animate('350ms ease-in', style({ opacity: 1, transform: 'translateY(0%)' }))
  ]),
  transition(':leave', [
    animate('250ms ease-in', style({ opacity: 0, transform: 'translateY(-45%)' }))
  ])
]);

export const scaleInOutTrigger = trigger('scaleInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.5)' }),
    animate('150ms ease-in', style({ opacity: 1, transform: 'scale(1)' }))
  ]),
  transition(':leave', [
    animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.5)' }))
  ])
]);

export const resizeAnimationTrigger = trigger('resizeTransition', [
  transition(':enter', [
    style({ opacity: 0, height: '0px', }),
    animate('250ms ease-in-out', style({
      opacity: 1,
      height: '*',
    }))
  ]),
  transition(':leave', [
    animate('250ms ease-in-out', style({
      opacity: 0,
      height: '0px',
    }))
  ])
]);
