import {
  Component,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-draggable',
  templateUrl: './draggable.component.html',
  styleUrls: ['./draggable.component.css'],
})
export class DraggableComponent {
  private isDragging = false;
  private offsetX = 0;
  private offsetY = 0;

  @Input() minimizable = false;
  @ViewChild('container') container: ElementRef<HTMLElement>;
  minimized = false;

  constructor(private renderer: Renderer2) {}

  // Cuando se hace clic en el botón, comienza el arrastre
  startDrag(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    const rect = this.container.nativeElement.getBoundingClientRect();

    if (event instanceof MouseEvent) {
      this.offsetX = event.clientX - rect.left;
      this.offsetY = event.clientY - rect.top;
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      this.offsetX = event.touches[0].clientX - rect.left;
      this.offsetY = event.touches[0].clientY - rect.top;
    }
  }

  minimize(event: MouseEvent): void {
    this.minimized = !this.minimized;
  }

  // Mover el elemento (mouse o touch)
  move(event: MouseEvent | TouchEvent): void {
    if (this.isDragging) {
      let clientX = 0;
      let clientY = 0;

      if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
      } else if (event instanceof TouchEvent && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      }

      this.renderer.setStyle(
        this.container.nativeElement,
        'transform',
        `translate(${clientX - this.offsetX}px, ${clientY - this.offsetY}px)`
      );
    }
  }

  // Fin del arrastre
  endDrag(): void {
    this.isDragging = false;
  }

  // Listeners de eventos globales
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.move(event);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    this.move(event);
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onEnd(event: MouseEvent | TouchEvent): void {
    this.endDrag();
  }
}
