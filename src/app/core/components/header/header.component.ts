import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit,OnDestroy {
  name:string = environment.name;

  @Input()bgColor :string = "#FEECEC";
  @Input()menuIconAndNameColor :string="#DC8AA0"

  showSideBar:boolean=false;
  @ViewChild('sideBar',{read:ElementRef}) sideBar:ElementRef;
  @ViewChild('menuSideBar',{read:ElementRef}) menuSideBar:ElementRef;

  clickOutSideSub:Subscription;

  constructor(private renderer2: Renderer2) { }

  ngAfterViewInit(){
    this.clickOutSide();
  }

  ngOnDestroy(){
    this.clickOutSideSub.unsubscribe();
  }

  openSideBar(){
    this.showSideBar = true;

    document.body.style.overflow = 'hidden';
    setTimeout(()=>{
      this.renderer2.addClass(this.sideBar.nativeElement,'sideBarAnimation');
      this.renderer2.addClass(this.menuSideBar.nativeElement,'menuSideBarAnimation');
    },50)
  }

  closeSideBar(){
    this.renderer2.removeClass(this.sideBar.nativeElement,'sideBarAnimation');
    this.renderer2.removeClass(this.menuSideBar.nativeElement,'menuSideBarAnimation');

    setTimeout(()=>{
      this.showSideBar = false;
      document.body.style.overflow = 'auto';
    },260)
  }

  clickOutSide(){
    this.clickOutSideSub = fromEvent(this.sideBar.nativeElement,'click').subscribe((resp:any)=>{
      if(resp.target.className ==='row'){
        this.closeSideBar();
      }
    });
  }
}
