import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../auth/interfaces/user';
import { SwalService } from '../../../services/swal.service';
import { ModalService } from '../../components/modal/modal.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css', '../../auth/style.auth.css']
})
export class EditProfileComponent implements OnInit,AfterViewInit {

  formSubmit: boolean = false;
  editProfileForm: FormGroup;
  user: Observable<User>;

  imgTemp: any = '';
  imgCropped:any='';
  imgSubir: File;

  imgCropper:any;

  downloadUrlImgSub: Subscription;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private swalService: SwalService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.user = this.authService.user$;
    this.createForm();
  }

  ngAfterViewInit(){

  }

  async updateProfile(uid: string,defaultPhoto:string) {
    if (this.editProfileForm.valid) {
      if (this.imgSubir) {
        await this.authService.uploadPhotoUser(this.imgSubir, uid);
        this.downloadUrlImgSub = this.authService.downloadURLimg$.subscribe(async (url: any) => {
          await this.authService.updateProfile(this.editProfileForm.value.username, url, uid);
          this.imgTemp = null;
          this.imgCropped =null;
        });
      }else{
        this.authService.updateProfile(this.editProfileForm.value.username,defaultPhoto,uid);
      }
    }
  }

  get editProfileControls() {
    return this.editProfileForm.controls;
  }

  createForm() {
    this.editProfileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.min(5), Validators.max(10)]],
      // email: ['', [Validators.required, Validators.email]]
    });

    const sub = this.user.subscribe((user: User) => {
      this.editProfileForm.get('username').setValue(user.userName);
    });
    sub.unsubscribe();

  }

  selectImg(file: File) {

    // this.imgSubir = file;

    if (!file || !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      this.swalService.mixinSwal('error', 'Tipo de archivo no permitido.')
      return this.imgTemp = null;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      setTimeout(()=>{this.openModal()},150)
    };

  }

  async cropImg(croppedImg:string){
    this.imgCropped = croppedImg;
    const res:Response= await fetch(croppedImg);
    const blob:Blob= await res.blob();
    this.imgSubir = new File([blob],'photoUser',{type:'image/png'});
  }

  openModal(){
    this.modalService.openModal();
  }
}
