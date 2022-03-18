import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import * as confetti from "canvas-confetti";

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.scss']
})
export class ConfettiComponent implements OnInit {

  myConfetti: any;

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,) {
  }

  ngOnInit(): void {
    const canvas = this.renderer2.createElement('canvas');

    this.renderer2.appendChild(this.elementRef.nativeElement, canvas);

    this.myConfetti = confetti.create(canvas, {
      resize: true
    });
  }

  winConfetti(x: any, y: any, minAngle: any, maxAngle: any) {
    this.fire(0.25, {
      spread: 10,
      startVelocity: 55,
      origin: {x, y},
      angle: {min: minAngle, max: maxAngle}
    });
    this.fire(0.2, {
      spread: 15,
      origin: {x, y},
      angle: {min: minAngle, max: maxAngle}
    });
    this.fire(0.35, {
      spread: 20,
      decay: 0.91,
      scalar: 0.8,
      origin: {x, y},
      angle: {min: minAngle, max: maxAngle}
    });
    this.fire(0.1, {
      spread: 25,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      origin: {x, y},
      angle: {min: minAngle, max: maxAngle}
    });
    this.fire(0.5, {
      spread: 30,
      startVelocity: 60,
      origin: {x, y},
      angle: {min: minAngle, max: maxAngle}
    });
  }

  fire(particleRatio: number, opts: { spread?: number; startVelocity?: number; decay?: number; scalar?: number; angle?: any; origin?: any }) {
    this.myConfetti({
      colors: [this.readProperty('primary-color'), this.readProperty('secondary-color')],
      angle: this.randomInRange(opts.angle ? opts.angle.min : 75, opts.angle ? opts.angle.max : 105),
      particleCount: (200 * particleRatio),
      origin: opts.origin,
      spread: opts.spread,
      startVelocity: opts.startVelocity,
      scalar: opts.scalar,
      decay: opts.decay
    });
  }

  randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  readProperty(name: string): string {
    return window.getComputedStyle(document.body).getPropertyValue('--' + name);
  }
}
