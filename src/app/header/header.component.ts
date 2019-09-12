import { Component } from '@angular/core';
import { CssSelector } from '@angular/compiler';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
 title: string = 'App Angular'
}
