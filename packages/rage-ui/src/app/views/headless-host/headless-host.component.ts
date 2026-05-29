import { Component, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameUiKey } from '@revolt-rp/common';

const HEADLESS_COMPONENT_LOADERS: Partial<Record<GameUiKey, () => Promise<Type<any>>>> = {

  [GameUiKey.Speaker]: async () => (await import('../../component/item/speaker/speaker.component')).SpeakerComponent,
};

@Component({
  selector: 'app-headless-host',
  standalone: true,
  imports: [],
  template: `<ng-container #host />`,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `
})
export class HeadlessHostComponent implements OnInit {
  @ViewChild('host', { read: ViewContainerRef, static: true })
  host!: ViewContainerRef;

  constructor(private route: ActivatedRoute) {
    console.log('HeadlessHostComponent initialized');
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

    const component: Type<any> = await loader();

    this.host.clear();
    this.host.createComponent(component);
  }
}
