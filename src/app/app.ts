import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Navbar } from './navbar/navbar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})

export class App implements OnInit {

  title = 'web-app';

  ngOnInit(): void {
    initFlowbite();
  }

}