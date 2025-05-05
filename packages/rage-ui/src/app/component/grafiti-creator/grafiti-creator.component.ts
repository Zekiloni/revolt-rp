import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { ColorPickerModule } from 'primeng/colorpicker';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-grafiti-creator',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderModule, ColorPickerModule, Button],
  templateUrl: './grafiti-creator.component.html',
  styleUrl: './grafiti-creator.component.css'
})
export class GrafitiCreatorComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private drawing = false;

  brushSize = 5;
  brushColor = '#000000';

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    if (canvas) {
      this.ctx = canvas.getContext('2d')!;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    }
  }

  startDrawing(event: MouseEvent) {
    this.drawing = true;
    this.draw(event);
  }

  stopDrawing() {
    this.drawing = false;
    this.ctx.beginPath();
  }

  clear() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  draw(event: MouseEvent) {
    if (!this.drawing) return;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.ctx.lineWidth = this.brushSize;
    this.ctx.strokeStyle = this.brushColor;

    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  save() {
    const dataUrl = this.canvasRef.nativeElement.toDataURL('image/png');
    console.log('Base64 PNG:', dataUrl); // You can emit or download this as needed
  }

}
