import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  imports: [AvatarModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export class App {
  // Use the appName from environment as the displayed title
  protected readonly title = signal(environment.appName );
}
