import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController } from '@ionic/angular';
import { AuthService} from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  registerFrom: FormGroup;
  errorMessage: any;
  formErrors = {
    email: [
      { type: 'required', message: 'Email es requerido' },
      { type: 'email', message: 'Introduce un email válido' }
    ],
    name: [
      { type: 'required', message: 'Nombre es requerido' }
    ],
    lastname: [
      { type: 'required', message: 'Apellido es requerido' }
    ],
    username: [
      { type: 'required', message: 'Nombre de usuario es requerido' }
    ],
    password: [
      { type: 'required', message: 'Contraseña es requerida' },
      { type: 'minlength', message: 'La contraseña debe tener al menos 6 caracteres' }
    ],
    passwordConfirmation: [
      { type: 'required', message: 'Verificación es requerida' },
      { type: 'mustMatch', message: 'Las contraseñas deben coincidir' }
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
    private autenticationService: AuthService
  ) {
    this.registerFrom = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      passwordConfirmation: new FormControl('', Validators.required)
    }, {
      validator: this.mustMatch('password', 'passwordConfirmation')
    });
  }

  ngOnInit() {
  }

  mustMatch(password: string, passwordConfirmation: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[password];
      const matchingControl = formGroup.controls[passwordConfirmation];

      if (matchingControl.errors && !matchingControl.errors["mustMatch"]) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  registerUser(registerData: any) {
    this.autenticationService.register(registerData).then(res => {
      console.log(res);
      this.errorMessage = '';
      this.navCtrl.navigateForward('/login');
    }).catch(err => {
      console.log(err);
      this.errorMessage = err;
    });
  }

  finish() {
    console.log("finish");
    this.navCtrl.navigateForward('/login');
  }
}