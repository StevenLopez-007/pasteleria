import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../auth/interfaces/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css', '../../auth/style.auth.css']
})
export class EditProfileComponent implements OnInit {

  formSubmit: boolean = false;
  editProfileForm: FormGroup;
  user: Observable<User>;

  imgTemp: any = '';
  imgSubir: File;


  downloadUrlImgSub: Subscription;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.createForm();
    this.user = this.authService.user$;
  }

  async updateProfile(uid: string) {
    await this.authService.uploadPhotoUser(this.imgSubir, uid);
    this.downloadUrlImgSub = this.authService.downloadURLimg$.subscribe(async(url: any) => {
      await this.authService.updateProfile(this.editProfileForm.value.username,url,uid);
      this.imgTemp=null;
    });
  }

  get editProfile() {
    return this.editProfileForm.controls;
  }

  createForm() {
    this.editProfileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.min(5), Validators.max(10)]],
      // email: ['', [Validators.required, Validators.email]]
    });
  }

  selectImg(file: File) {
    this.imgSubir = file;

    if (!file) return this.imgTemp = null;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };

  }

}
