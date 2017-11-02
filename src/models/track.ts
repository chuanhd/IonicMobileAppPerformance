import { Gate } from './gate'
import { Point } from './point'

export interface Track {
    gates : Gate[]
    id : number
    name : string
    start : Gate
}

export class Track {
    constructor(json) {
        this.start = null;
        this.gates = [];
        var jsonTrack = json.track;
        var jsonGates = jsonTrack.gates;
        var length = jsonGates.length;
        for (var i = 0; i < length; i++) {
            var jsonGate = jsonGates[i];
            var gate = new Gate(jsonGate.gate_type,
                parseInt(jsonGate.split_number),
                parseFloat(jsonGate.latitude),
                parseFloat(jsonGate.longitude),
                parseFloat(jsonGate.bearing));
            if (gate.type === 'START_FINISH' || gate.type === 'START') {
                this.start = gate;
            }
            this.gates.push(gate);
        }
        this.id = parseInt(jsonTrack.id);
        this.name = jsonTrack.name;
    }

    numSplits() : number {
        return this.gates.length
    }

    distanceToStart(latitude : number, longitude : number) : number {
        return this.start.mLocation.distanceTo(new Point(latitude, longitude, false))
    }
}