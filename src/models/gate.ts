import { Point } from "./point"
import { Physics } from "./physics"

export class Gate {

    public static readonly LINE_WIDTH = 80.0;
    public static readonly BEARING_RANGE = 90.0;

    type : string
    splitNumber : number
    mLocation : Point
    leftPoint : Point
    rightPoint : Point

    constructor(type : string, splitNumber : number, latitude : number, longitude : number, bearing : number) {
        this.type = type
        this.splitNumber = splitNumber
        this.mLocation = new Point(latitude, longitude, false)
        let leftBearing = bearing - 90 < 0 ? bearing + 270 : bearing - 90
        let rightBearing = bearing + 90 > 360 ? bearing - 270 : bearing + 90
        this.leftPoint  = this.mLocation.destination(leftBearing, Gate.LINE_WIDTH / 2)
        this.rightPoint = this.mLocation.destination(rightBearing, Gate.LINE_WIDTH / 2)
        this.mLocation.bearing = bearing
    }

    crossed(start : Point, destination : Point) : Point {
        let pathBearing = start.bearingTo(destination)
        var cross = null;
        if (pathBearing > (this.mLocation.bearing - Gate.BEARING_RANGE) &&
            pathBearing < (this.mLocation.bearing + Gate.BEARING_RANGE)) {
                cross = Point.intersectSimple(this.leftPoint, this.rightPoint, start, destination);
                if (cross !== null) {
                    var distance = start.distanceTo(cross);
                    var timeSince = destination.timestamp - start.timestamp;
                    var acceleration = (destination.speed - start.speed) / timeSince;
                    var timeCross = Physics.time(distance, start.speed, acceleration);
                    cross.generated = true;
                    cross.speed = start.speed + acceleration * timeCross;
                    cross.bearing = start.bearingTo(destination);
                    cross.timestamp = start.timestamp + timeCross;
                    cross.lapDistance = start.lapDistance + distance;
                    cross.lapTime = start.lapTime + timeCross;
                    cross.splitTime = start.splitTime + timeCross;
                }
        }

        return cross
    }

}