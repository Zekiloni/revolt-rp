import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class DraggableService {
  public draggingElement = new BehaviorSubject<HTMLElement | null>(null);

  setDraggingElement(element: HTMLElement): void {
    this.draggingElement.next(element);
  }

  clearDraggingElement(): void {
    this.draggingElement.next(null);
  }

}
