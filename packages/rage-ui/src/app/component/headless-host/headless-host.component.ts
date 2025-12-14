import { Component, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameUiKey } from '@revolt-rp/common';

const HEADLESS_COMPONENT_LOADERS: Partial<Record<GameUiKey, () => Promise<Type<never>>>> = {};

@Component({
  selector: 'app-headless-host',
  standalone: true,
  imports: [],
  template: `
    <ng-container #host />`,
  styleUrl: './headless-host.component.css'
})
export class HeadlessHostComponent implements OnInit {
  @ViewChild('host', { read: ViewContainerRef, static: true })
  host!: ViewContainerRef;

  constructor(private route: ActivatedRoute) {
  }

  async ngOnInit() {
    const keyParam = this.route.snapshot.paramMap.get('interfaceKey');

    if (!keyParam) return;

    const uiKey = keyParam as GameUiKey;
    const loader = HEADLESS_COMPONENT_LOADERS[uiKey];

    if (!loader) {
      console.error(`No headless loader for ${uiKey}`);
      return;
    }

    const component: Type<never> = await loader();

    this.host.clear();
    this.host.createComponent(component);
  }
}
