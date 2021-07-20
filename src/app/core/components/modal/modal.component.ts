import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit,AfterViewInit {

  @Input()title :string ='Modal title';
  @Input()cancelText :string ='Cancelar';
  @Input()okText :string = 'Aceptar';

  @Input()classes :string[]=[];

  @ViewChild('confirmButton',{read:ElementRef,static:true}) confirmButton:ElementRef;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
    this.modalService.ok(this.confirmButton);
  }

  ngAfterViewInit(){
    this.modalService.confirmButton = document.getElementById('openModal');
    this.modalService.cancelButton = document.getElementById('cancelButton');
  }



}
