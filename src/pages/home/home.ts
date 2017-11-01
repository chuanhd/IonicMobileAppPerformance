import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Multi } from '../../models/multi'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private multi : Multi) {
    console.log("Homepage constructor invoked");
    // multi.readFile()
  }

}
