export class Physics {
    constructor() {

    }

    static distance(velocity : number, acceleration : number, time : number) {
        return velocity * time + (acceleration * time * time) / 2.0;
    }

    static time(distance : number, velocity : number, acceleration : number) {
        if (acceleration === 0) {
            return distance / velocity;
        } else {
            return (-velocity + Math.sqrt(velocity * velocity + 2.0 * acceleration * distance)) / acceleration;
        }
    }
}