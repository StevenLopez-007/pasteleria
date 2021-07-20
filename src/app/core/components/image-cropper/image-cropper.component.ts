import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';

import Cropper from 'cropperjs';
import { ModalService } from '../modal/modal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalService } from '../../../services/swal.service';
@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit, AfterViewInit {

  @ViewChild("image", { static: false }) imageElement: ElementRef;

  @Input("src") imageSource: string;

  @Output() imageDestination: EventEmitter<string> = new EventEmitter<string>();
  cropper: Cropper

  nameSpinner: string = 'cropperImgSpinner'

  constructor(private modalService: ModalService, private ngxSpinnerService: NgxSpinnerService, private swalService: SwalService) { }

  ngOnInit(): void {
    this.modalService.confirmButton$.subscribe(async (click: any) => {
      try {
        await this.ngxSpinnerService.show(this.nameSpinner);
        const imgBase64 = await this.cropImg();
        this.imageDestination.emit(imgBase64);
        await this.ngxSpinnerService.hide(this.nameSpinner);
        this.modalService.closeModal();
      } catch (error) {
        this.swalService.mixinSwal('error', error);
        await this.ngxSpinnerService.hide(this.nameSpinner);
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cropper = new Cropper(this.imageElement.nativeElement, {
        zoomable: false,
        scalable: false,
        aspectRatio: 1,
        dragMode: 'crop',

        viewMode: 2,
        autoCropArea: 1,
        center: true,
        restore: false,
        zoomOnWheel: false,
        cropBoxResizable: false
      });
    }, 1000);
  }

  async cropImg(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const canvas = this.cropper.getCroppedCanvas({
          imageSmoothingQuality:'medium',
          maxHeight:700,
          maxWidth:700,
          minHeight:300,
          minWidth:300,
        });
        resolve(canvas.toDataURL());
      } catch (error) {
        reject('No se pudo recortar la imagen.')
      }
    });
  }

}
