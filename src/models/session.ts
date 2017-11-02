import { Lap } from './lap'
import { Track } from './track'

export class Session {
    track : Track
    startTime : number
    duration : number = 0
    laps : Lap[] = []
    bestLap : Lap

    constructor(track : Track, startTime : number = Math.floor(Date.now()/1000)) {
        this.track = track
        this.startTime = startTime
    }

    tick(currentTime : number) {
        this.duration = currentTime - this.startTime
    }

}
