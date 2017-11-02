import { Injectable } from '@angular/core';

import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';

@Injectable()
export class Multi {

    constructor(private platform : Platform, private file : File) {
        // platform.ready().then(()=>{
        //     console.log("Application directory: ", this.file.applicationDirectory)
        //     this.readFile()
        // })
    }

    readFile() : Promise<string> {
        // console.log("Multi readfile invoked: ", this.file.applicationDirectory);
        // this.file.checkDir(this.file.applicationDirectory, './www/assets').then(_ => 
        //     console.log("Asset directory exists")
        // ).catch(err => console.log("Asset directory not exist"))

        return new Promise((resolve, reject) => {
            this.file.readAsText(this.file.applicationDirectory, './www/assets/multi_lap_session.csv').then(_fileStr => {
                // this.contents = _fileStr
                resolve(_fileStr)
            })
        })

    }
}

