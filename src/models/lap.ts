import { Session } from './session'
import { Track } from './track'
import { Point } from './point'

export interface Lap {

    session : Session
    track : Track
    duration : number
    distance : number
    valid : boolean
    startTime : number
    lapNumber : number
    points : Point[]
    outLap : boolean
    splits : number[]
}

export class Lap {

    public static readonly GATE_RANGE = 100;
    
    constructor(session : Session, track : Track, startTime : number, lapNumber : number) {
        this.session = session
        this.track = track
        this.startTime = startTime
        this.lapNumber = lapNumber
        this.points = []
        this.duration = 0
        this.distance = 0
        this.valid = false
        this.outLap = lapNumber === 0
        this.splits = []
        var size = track.numSplits()
        while (size--) {
            this.splits.push(0)
        }
    }

    add(point : Point) {
        this.duration = point.lapTime
        this.distance = point.lapDistance
        this.points.push(point)
    }
}