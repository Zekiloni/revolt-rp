import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableCopy]'
})
export class DisableCopyDirective {
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && ['c','v','x','a'].includes(event.key.toLowerCase())) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  @HostListener('copy', ['$event'])
  @HostListener('cut', ['$event'])
  onEvent(event: Event) {
    event.preventDefault();
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: Event) {
    event.preventDefault();
  }

  @HostListener("copy", ["$event"])
  blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener("paste", ["$event"])
  blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener("cut", ["$event"]) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }
}
