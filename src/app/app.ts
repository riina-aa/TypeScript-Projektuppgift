import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './partials/header/header';
import { Footer } from './partials/footer/footer';
import { Navigation } from './partials/navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Navigation],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Projektuppgift');
}
