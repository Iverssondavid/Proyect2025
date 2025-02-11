import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController } from '@ionic/angular';
import { AuthService } from "../services/auth.service";
import { Storage } from "@ionic/storage-angular";


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage: any;
  formErrors = {
    email: [
      { type: 'required', message: 'Email es requerido' },
      { type: 'email', message: 'Introduce un email válido' }
    ],
    password: [
      { type: 'required', message: 'Contraseña es requerida' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 6 caracteres' }
    ]
  };


  constructor(
    private formBuilder: FormBuilder,
    private autenticationService: AuthService,
    private navCtrl: NavController,
    private storage: Storage
  ) {
   
   
    this.loginForm = this.formBuilder.group({

      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),

      
      password: new FormControl('', Validators.compose([

        Validators.required,
        Validators.minLength(6)
      ]))
    });
  }

  ngOnInit() {

  }

  
  loginUser(credentials: any) {
    this.autenticationService.login(credentials).then((res: any) => {
      console.log(res);
      this.errorMessage = '';
      this.storage.set('user', res.user)
      this.storage.set('isUserLoggedIn', true);
      this.navCtrl.navigateForward("/menu/home");
    }).catch(err => {
      console.log(err);
      this.errorMessage = err;
    });
  }

  goToIntro() {
    this.navCtrl.navigateForward('/intro');
  }

  goToHome() {
    this.navCtrl.navigateForward('/menu/home');
  }
}