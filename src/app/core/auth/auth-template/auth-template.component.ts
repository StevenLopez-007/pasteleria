import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-template',
  templateUrl: './auth-template.component.html',
  styleUrls: ['./auth-template.component.css']
})
export class AuthTemplateComponent implements OnInit {
  @Input() linkSpan:string;
  @Input() nameSpan:string;
  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:onresize')
  breakpoint(){
    return window.innerWidth;
  }

}
