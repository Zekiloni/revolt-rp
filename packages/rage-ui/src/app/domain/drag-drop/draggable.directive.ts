import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { DraggableService } from './draggable.service';

@Directive({
  selector: '[appDraggable]',
  standalone: true,
  providers: [DraggableService]
})
export class DraggableDirective {
  @Input() appDraggable !: string;

  @Output() dragStart = new EventEmitter();
  @Output() dragEnd = new EventEmitter();

  private offsetX = 0;
  private offsetY = 0;

  constructor(
    private el: ElementRef,
    private draggableService: DraggableService,
    private renderer: Renderer2,
  ) {}

  @HostListener('mousedown', ['$event'])
  onDragStart(event: any): void {
    if (event.button == 2) return;
    event.preventDefault();

    const clone = this.el.nativeElement.cloneNode(true) as HTMLElement;

    this.draggableService.setDraggingElement(clone);

    this.renderer.setStyle(clone, 'position', 'absolute');
    this.renderer.setStyle(clone, 'z-index', '1000');
    this.renderer.setStyle(clone, 'pointer-events', 'none');
    this.renderer.setStyle(clone, 'left', event.clientX - this.offsetX + 'px');
    this.renderer.setStyle(clone, 'top', event.clientY - this.offsetY - event.target?.clientHeight + 'px');

    document.body.appendChild(clone);

    const moveListener = this.renderer.listen('document', 'mousemove', (moveEvent: MouseEvent) => {
      this.renderer.setStyle(clone, 'left', moveEvent.clientX - this.offsetX + 'px');
      this.renderer.setStyle(clone, 'top', moveEvent.clientY - this.offsetY - event.target?.clientHeight + 'px');
    });

    const upListener = this.renderer.listen('document', 'mouseup', (upEvent: MouseEvent) => {
      moveListener();
      upListener();
      this.renderer.removeChild(document.body, clone);
      this.dragEnd.emit();
    });

    this.dragStart.emit();
  }
}
