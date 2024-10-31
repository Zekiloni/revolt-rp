import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { DraggableService } from './draggable.service';

@Directive({
  selector: '[appDroppable]',
  standalone: true,
  providers: [DraggableService]
})
export class DroppableDirective {
  @Input() appDroppable!: string;

  @Output() dragDrop = new EventEmitter();

  constructor(
    private draggableService: DraggableService,
  ) {
  }

  @HostListener('mouseup', ['$event'])
  onDragEnd(event: MouseEvent): void {
    event.preventDefault()

    if (event.button == 2) return;

    if (this.draggableService.draggingElement) {
      this.draggableService.clearDraggingElement();
      this.dragDrop.emit();
    }
  }
}
