import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AvatarModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App {
  protected readonly title = signal('portfolio-dev-francys');
}
