import { Component, Input, OnChanges, SimpleChanges, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

interface Nota {
  nombre: string;
  frecuencia: number;
  tecla: string; // Tecla del teclado físico
}

@Component({
  selector: 'app-keyboard',
  standalone: true,
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
  imports: [CommonModule],
})
export class KeyboardComponent implements OnInit, OnDestroy, OnChanges {
  @Input() frecuenciaBase: number = 440;

  notasOctava: Nota[] = [];

  nombresNotas = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  teclas =        ['A', 'W',  'S', 'E',  'D', 'F', 'T',  'G', 'Y',  'H', 'U',  'J'];

  private audioContext: AudioContext | null = null;
  private osciladores: { [tecla: string]: OscillatorNode } = {};
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.audioContext = new AudioContext();
  }

  ngOnDestroy() {
    if (!this.isBrowser) return;

    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.audioContext?.close();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['frecuenciaBase']) {
      this.generarNotas();
    }
  }

  generarNotas() {
    const n = Math.round(12 * Math.log2(this.frecuenciaBase / 440));
    const freqBaseAproximada = 440 * Math.pow(2, n / 12);
    const notaIndex = (n + 9 + 12) % 12;

    this.notasOctava = [];

    for (let i = 0; i < 12; i++) {
      const semitonosDesdeBase = i - notaIndex;
      const frecuencia = freqBaseAproximada * Math.pow(2, semitonosDesdeBase / 12);

      this.notasOctava.push({
        nombre: this.nombresNotas[i],
        frecuencia: +frecuencia.toFixed(2),
        tecla: this.teclas[i],
      });
    }
  }

  onKeyDown = (event: KeyboardEvent) => {
    const tecla = event.key.toUpperCase();
    const nota = this.notasOctava.find(n => n.tecla === tecla);

    if (nota && !this.osciladores[tecla]) {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.frequency.value = nota.frecuencia;
      osc.type = 'sine'; // Puedes cambiar a 'square', 'triangle', etc.

      gain.gain.value = 0.2;

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);

      osc.start();

      this.osciladores[tecla] = osc;
    }
  };

  onKeyUp = (event: KeyboardEvent) => {
    const tecla = event.key.toUpperCase();
    const osc = this.osciladores[tecla];

    if (osc) {
      osc.stop();
      osc.disconnect();
      delete this.osciladores[tecla];
    }
  };
}