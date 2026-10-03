import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Formularios } from './formularios/formularios';

@Component({
  selector: 'app-root',
  imports: [Formularios],
  templateUrl: './app.html'
})
export class App implements OnInit {
  title = 'web-app';

  ngOnInit(): void {
    initFlowbite();
  }
}
