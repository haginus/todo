import {trigger, animate, style, group, animateChild, query, stagger, transition, state, keyframes} from '@angular/animations';

export const RouterTransition =
trigger('RouterTransition', [
    transition('* <=> *', [
      query(':enter',
        style({
          position: 'absolute',
          width:'100%',
          transform: 'translateY(24px)',
          opacity: '0',
          overflow: 'hidden',
          'pointer-events': 'none'
        }),
        {optional:true}),
      query(':leave',
        animate('400ms ease',
          style({
            position: 'absolute',
            width:'100%',
            transform: 'translateY(24px)',
            opacity: '0',
            overflow: 'hidden',
            'pointer-events': 'none'
          })
        ),
      {optional:true}),
      query(':enter',
        animate('400ms ease',
          style({
            opacity: 1,
            transform: 'translateY(0px)'
          })
        ),
      {optional:true}),
    ])
  ])

  export const Am = 
  trigger('Am', [
    state('in', style({transform: 'translateX(0)', opacity: '0'})),
    transition('void => *', [
      animate('400ms ease-in-out', keyframes([
        style({opacity: 0, height: 0}),
        style({opacity: 0, height: '48px'}),
        style({opacity: 0, transform: 'translateY(25px)'}),
        style({opacity: 1, transform: 'translateX(0)'})
      ]))
    ]),
    transition('* => void', [
      animate('300ms 300ms ease-in-out', keyframes([
        style({opacity: 1, transform: 'translateX(0)'}),
        style({opacity: 0, transform: 'translateX(45px)'}),
        style({opacity: 0, height: 0}),
      ]))
    ])
  ])
