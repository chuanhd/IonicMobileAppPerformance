import { Track } from './track'
import { Point } from './point'
import { SessionManager } from './session_manager'
import { Multi } from './multi'

import { Platform } from 'ionic-angular';

export class Run {
    track = new Track({
        'track': {
            'id': '1000',
            'name': 'Test Raceway',
            'gates': [{
                'gate_type': 'SPLIT',
                'split_number': '1',
                'latitude': '37.451775',
                'longitude': '-122.203657',
                'bearing': '136'
            }, {
                'gate_type': 'SPLIT',
                'split_number': '2',
                'latitude': '37.450127',
                'longitude': '-122.205499',
                'bearing': '326'
            }, {
                'gate_type': 'START_FINISH',
                'split_number': '3',
                'latitude': '37.452602',
                'longitude': '-122.207069',
                'bearing': '32'
            }]
        }
    });

    points : Point[] = []
    

    constructor(public content : string) {
        var lines = content.split('\n')
        var length = lines.length
        for (var i = 0; i < length; i++) {
            var line = lines[i];
            var parts = line.split(',');
            this.points.push(new Point(
                parseFloat(parts[0]),
                parseFloat(parts[1]),
                false,
                parseFloat(parts[2]),
                parseFloat(parts[3]),
                5.0,
                15.0,
                0));
        }

    }

    run(count : number) {
        var start = (new Date()).getTime() / 1000.0;
        var timestamp = start;
        while (count--) {
            SessionManager.getInstance().startSession(this.track);
            var pointsLength = this.points.length;
            for (var i = 0; i < pointsLength; i++) {
                var point = this.points[i];
                SessionManager.getInstance().gps(point.latitudeDegrees(), point.longitudeDegrees(),
                    point.speed, point.bearing, point.hAccuracy, point.vAccuracy, timestamp++);
            }
            SessionManager.getInstance().endSession();
        }
        return (new Date()).getTime() / 1000.0 - start;
    }

}