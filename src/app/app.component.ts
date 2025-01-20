import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle'; //IMPORTAMOS EL REGISTER DE SWIPER

import { Storage } from '@ionic/storage-angular'; //IMPORTAMOS EL STORAGE

register(); //REGISTRAMOS EL SWIPER


@Component({
  selector: 'app-root',
  

  standalone: false,
})
export class AppComponent {
  
  constructor(
    private storage: Storage //INICIALIZAMOS EL STORAGE
  ) {}
  async ngOnInit() { //AÑADIMOS EL MÉTODO ngOnInit
    await this.storage.create(); //CREAMOS EL STORAGE
  }
}