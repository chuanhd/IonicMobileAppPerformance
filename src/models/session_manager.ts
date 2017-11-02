import { Session } from './session'
import { Lap } from './lap'
import { Point } from './point'
import { Track } from './track'
import { Gate } from './gate'

export class SessionManager {

    session : Session = null
    currentLap : Lap
    bestLap : Lap
    lastPoint : Point
    bestIndex : number = 0
    nextGate : Gate
    gateIter : number = 0
    splits : number[] = []
    splitGaps : number[] = []
    splitStartTime : number = 0
    splitNumber : number = 0
    track : Track
    currentSplit : number = 0
    lapNumber : number = 0
    gap : number = 0
 
    private static instance : SessionManager

    private constructor() {

    }

    static getInstance() {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager()
        }
        return SessionManager.instance
    }

    startSession(track : Track) {
        if (this.session === null) {
            this.track = track
            this.session = new Session(track)
            this.currentLap = new Lap(this.session, this.track, this.session.startTime, 0)
            this.session.laps.push(this.currentLap)
            var size = track.numSplits();
            this.splits = [];
            while (size--) {
                this.splits.push(0);
            }
            size = track.numSplits();
            this.splitGaps = [];
            while (size--) {
                this.splitGaps.push(-1);
            }
            this.splitStartTime = this.session.startTime;
            this.splitNumber = 0;
            this.currentSplit = 0;
            this.lapNumber = 0;
            this.gap = 0;
            this.bestIndex = 0;
            this.nextGate = track.start;
        }
    }

    endSession() {
        this.session = null
        this.currentLap = null
        this.bestLap = null
    }

    gps(latitude : number, longitude : number, speed : number, bearing : number, horizontalAccuracy : number, verticalAccuracy : number, timestamp : number) {
        var point = new Point(latitude, longitude, false, speed, bearing, horizontalAccuracy,
            verticalAccuracy, timestamp);
        if (this.lastPoint != null) {
            var cross = this.nextGate.crossed(this.lastPoint, point);
            if (cross != null) {
                this.currentLap.add(cross);
                this.currentLap.splits[this.currentSplit] = cross.splitTime;
                switch (this.nextGate.type) {
                    case 'START_FINISH':
                    case 'FINISH':
                        if (this.currentLap.points[0].generated) {
                            this.currentLap.valid = true;
                            if (this.bestLap == null || this.currentLap.duration < this.bestLap.duration) {
                                this.bestLap = this.currentLap;
                            }
                        }
                        break;
                    case 'START':
                        this.lapNumber++;
                        this.currentLap = new Lap(this.session, this.track, cross.timestamp, this.lapNumber);
                        this.lastPoint = new Point(
                            cross.latitudeDegrees(),
                            cross.longitudeDegrees(),
                            false,
                            cross.speed,
                            cross.bearing,
                            cross.hAccuracy,
                            cross.vAccuracy,
                            cross.timestamp);
                        this.lastPoint.lapDistance = 0;
                        this.lastPoint.lapTime = 0;
                        this.lastPoint.generated = true;
                        this.currentLap.add(this.lastPoint);
                        this.session.laps.push(this.currentLap);
                        this.gap = 0;
                        var size = this.splitGaps.length;
                        while (size--) {
                            this.splitGaps[size - 1] = 0;
                        }
                        this.bestIndex = 0;
                        this.currentSplit = 0;
                        break;
                    case 'SPLIT':
                        if (this.bestLap != null) {
                            this.splitGaps[this.currentSplit] = this.currentLap.splits[this.currentSplit] - this.bestLap.splits[this.currentSplit];
                        }
                        this.currentSplit++;
                }
                this.splitStartTime = cross.timestamp;
                this.nextGate = this.track.gates[this.currentSplit];
            }
            if (this.bestLap != null && this.bestIndex < this.bestLap.points.length) {
                while (this.bestIndex < this.bestLap.points.length) {
                    var refPoint = this.bestLap.points[this.bestIndex];
                    if (refPoint.lapDistance > this.currentLap.distance) {
                        var lastRefPoint = this.bestLap.points[this.bestIndex - 1];
                        var distanceToLastRefPoint = this.currentLap.distance - lastRefPoint.lapDistance;
                        if (distanceToLastRefPoint > 0) {
                            var sinceLastRefPoint = distanceToLastRefPoint / point.speed;
                            this.gap = point.lapTime - sinceLastRefPoint - lastRefPoint.lapTime;
                            this.splitGaps[this.splitNumber] = point.splitTime - sinceLastRefPoint - lastRefPoint.splitTime;
                        }
                        break;
                    }
                    this.bestIndex++;
                }
            }
            point.lapDistance = this.lastPoint.lapDistance + this.lastPoint.distanceTo(point);
            point.setLapTime(this.currentLap.startTime, this.splitStartTime);
        }
        this.currentLap.add(point);
        this.lastPoint = point;
    }
}