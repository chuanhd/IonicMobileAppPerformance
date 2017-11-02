import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ElementRef, ViewChild } from '@angular/core'

import { Platform } from 'ionic-angular';
import { Run } from '../../models/run'
import { Multi } from '../../models/multi';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  runningAThoudsandTimeValue : string = "Result: 0"
  runningTenThoudsandsTimeValue : string = "Result: 0"

  @ViewChild('lblAThoudsandTimesResult') lblAThoudsandTimesResultElement : ElementRef;
  // lblAThoudsandTimesResult

  constructor(public navCtrl: NavController, private multi : Multi, private platform : Platform) {
    console.log("Homepage constructor invoked");
    // multi.readFile()
    platform.ready().then(()=>{
      
    })
  }

  ngAfterViewInit() {

  }

  runAThoudsandTimes(event) {
    this.platform.ready().then(() => {
      this.multi.readFile().then(_fileContent => {
        console.log('File str content promise on Homepage: ', _fileContent)
        var run = new Run(_fileContent)
        let timeStr = run.run(1000).toString()
        console.log('Run 1000 times: ', timeStr)
      })
    })
  }

  runTenThoudsandsTimes(event) {
    this.platform.ready().then(() => {
      this.multi.readFile().then(_fileContent => {
        console.log('File str content promise on Homepage: ', _fileContent)
        var run = new Run(_fileContent)
        let timeStr = run.run(10000).toString()
        console.log('Run 10000 times: ', timeStr)
      })
    })
  }

}
