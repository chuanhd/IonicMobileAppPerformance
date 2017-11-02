// interface Number {
//     toRadians() : number;
//     toDegrees() : number;
// }

// if (typeof (Number.prototype.toRadians) === 'undefined') {
// 	Number.prototype.toRadians = function () {
// 		return this * Math.PI / 180.0;
// 	};
// }

// if (typeof (Number.prototype.toDegrees) === 'undefined') {
// 	Number.prototype.toDegrees = function () {
// 		return this * 180.0 / Math.PI;
// 	};
// }

// var RADIUS = 6371000.0;

// function Point(latitude : number, longitude : number, inRadians : boolean,
// 	speed : number = 0.0, bearing : number = 0.0, horizontalAccuracy : number = 0.0, verticalAccuracy : number = 0.0, timestamp : number = 0.0) {

// 	inRadians = typeof inRadians !== 'undefined' ? inRadians : false;
// 	if (inRadians) {
// 		this.latitude = latitude;
// 		this.longitude = longitude;
// 	} else {
// 		this.latitude = latitude.toRadians();
// 		this.longitude = longitude.toRadians();
// 	}

// 	this.speed = typeof speed !== 'undefined' ? speed : 0.0;
// 	this.bearing = typeof bearing !== 'undefined' ? bearing : 0.0;
// 	this.hAccuracy = typeof horizontalAccuracy !== 'undefined' ? horizontalAccuracy : 0.0;
// 	this.vAccuracy = typeof verticalAccuracy !== 'undefined' ? verticalAccuracy : 0.0;
// 	this.timestamp = typeof timestamp !== 'undefined' ? timestamp : 0.0;
// 	this.lapDistance = 0.0;
// 	this.lapTime = 0.0;
// 	this.splitTime = 0.0;
// 	this.generated = false;
// }

// Point.prototype.setLapTime = function (startTime, splitStartTime) {
// 	this.lapTime = this.timestamp - startTime;
// 	this.splitTime = this.timestamp - splitStartTime;
// };

// Point.prototype.roundValue = function (value) {
// 	return Math.round(value * 1000000.0) / 1000000.0;
// };

// Point.prototype.latitudeDegrees = function () {
// 	return this.roundValue(this.latitude.toDegrees());
// };

// Point.prototype.longitudeDegrees = function () {
// 	return this.roundValue(this.longitude.toDegrees());
// };

// Point.prototype.subtract = function (point) {
// 	return new Point(this.latitude - point.latitude, this.longitude - point.longitude, true);
// };

// Point.prototype.bearingTo = function (point, inRadians) {
// 	inRadians = typeof inRadians !== 'undefined' ? inRadians : false;
// 	var lat1 = this.latitude;
// 	var lat2 = point.latitude;
// 	var dlon = point.longitude - this.longitude;

// 	var y = Math.sin(dlon) * Math.cos(lat2);
// 	var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlon);
// 	var tan = Math.atan2(y, x);

// 	if (inRadians) {
// 		return this.roundValue((tan + 2 * Math.PI) % Math.PI);
// 	} else {
// 		return this.roundValue((tan.toDegrees() + 2 * 360) % 360);
// 	}
// };

// Point.prototype.destination = function (bearing, distance) {
// 	var tan = bearing.toRadians();
// 	var cir = distance / RADIUS;
// 	var lat1 = this.latitude;
// 	var lon1 = this.longitude;
// 	var lat2 = Math.asin(Math.sin(lat1) * Math.cos(cir) + Math.cos(lat1) * Math.sin(cir) * Math.cos(tan));
// 	var lon2 = lon1 + Math.atan2(Math.sin(tan) * Math.sin(cir) * Math.cos(lat1), Math.cos(cir) - Math.sin(lat1) * Math.sin(lat2));
// 	lon2 = (lon2 + 3.0 * Math.PI) % (2.0 * Math.PI) - Math.PI; // normalise to -180..+180

// 	return new Point(lat2, lon2, true);
// };

// Point.prototype.distanceTo = function (point) {
// 	var lat1 = this.latitude;
// 	var lon1 = this.longitude;
// 	var lat2 = point.latitude;
// 	var lon2 = point.longitude;
// 	var dlat = lat2 - lat1;
// 	var dlon = lon2 - lon1;

// 	var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);

// 	return RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// };

// Point.prototype.intersectSimple = function (p, p2, q, q2) {
// 	var s1_x = p2.longitude - p.longitude;
// 	var s1_y = p2.latitude - p.latitude;
// 	var s2_x = q2.longitude - q.longitude;
// 	var s2_y = q2.latitude - q.latitude;

// 	var den = (-s2_x * s1_y + s1_x * s2_y);
// 	if (den === 0) {
// 		return null;
// 	}

// 	var s = (-s1_y * (p.longitude - q.longitude) + s1_x * (p.latitude - q.latitude)) / den;
// 	var t = (s2_x * (p.latitude - q.latitude) - s2_y * (p.longitude - q.longitude)) / den;

// 	if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
// 		return new Point(p.latitude + (t * s1_y), p.longitude + (t * s1_x), true);
// 	}

// 	return null;
// };

export class Utils {
	static toDegrees(radian : number) : number {
		return radian * 180.0 / Math.PI
	}

	static toRadians(degrees : number) : number {
		return degrees * Math.PI / 180.0;
	}
}

export interface Point {
	latitude : number
    longitude : number
    inRadians : boolean
    speed : number
    bearing : number
    hAccuracy : number
    vAccuracy : number
    timestamp : number
    lapDistance : number
    lapTime : number
    splitTime : number
    generated : boolean
}

export class Point {

	public static readonly RADIUS = 6371000.0;

    constructor(latitude : number, longitude : number, inRadians : boolean,
        speed : number = 0.0, bearing : number = 0.0, horizontalAccuracy : number = 0.0, verticalAccuracy : number = 0.0, timestamp : number = 0.0) {
            inRadians = typeof inRadians !== 'undefined' ? inRadians : false;
            if (inRadians) {
                this.latitude = latitude;
                this.longitude = longitude;
            } else {
                this.latitude = latitude * Math.PI / 180.0;
                this.longitude = longitude * Math.PI / 180.0;
            }
        
            this.speed = typeof speed !== 'undefined' ? speed : 0.0;
            this.bearing = typeof bearing !== 'undefined' ? bearing : 0.0;
            this.hAccuracy = typeof horizontalAccuracy !== 'undefined' ? horizontalAccuracy : 0.0;
            this.vAccuracy = typeof verticalAccuracy !== 'undefined' ? verticalAccuracy : 0.0;
            this.timestamp = typeof timestamp !== 'undefined' ? timestamp : 0.0;
            this.lapDistance = 0.0;
            this.lapTime = 0.0;
            this.splitTime = 0.0;
            this.generated = false;
	}
	
	setLapTime(startTime : number, splitStartTime : number) {
		this.lapTime = this.timestamp - startTime;
		this.splitTime = this.timestamp - splitStartTime;
	}

	roundValue(value : number) {
		return Math.round(value * 1000000.0) / 1000000.0;
	}

	latitudeDegrees() {
		return this.roundValue(Utils.toDegrees(this.latitude));
	}

	longitudeDegrees() {
		return this.roundValue(Utils.toDegrees(this.longitude));
	}

	subtract(point : Point) {
		return new Point(this.latitude - point.latitude, this.longitude - point.longitude, true);
	}

	bearingTo(point : Point, inRadians : boolean = false) : number {
		inRadians = typeof inRadians !== 'undefined' ? inRadians : false;
		var lat1 = this.latitude;
		var lat2 = point.latitude;
		var dlon = point.longitude - this.longitude;
	
		var y = Math.sin(dlon) * Math.cos(lat2);
		var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlon);
		var tan = Math.atan2(y, x);
	
		if (inRadians) {
			return this.roundValue((tan + 2 * Math.PI) % Math.PI);
		} else {
			return this.roundValue((Utils.toDegrees(tan) + 2 * 360) % 360);
		}
	}

	destination(bearing : number, distance : number) {
		var tan = bearing * Math.PI / 180.0;
		var cir = distance / Point.RADIUS;
		var lat1 = this.latitude;
		var lon1 = this.longitude;
		var lat2 = Math.asin(Math.sin(lat1) * Math.cos(cir) + Math.cos(lat1) * Math.sin(cir) * Math.cos(tan));
		var lon2 = lon1 + Math.atan2(Math.sin(tan) * Math.sin(cir) * Math.cos(lat1), Math.cos(cir) - Math.sin(lat1) * Math.sin(lat2));
		lon2 = (lon2 + 3.0 * Math.PI) % (2.0 * Math.PI) - Math.PI; // normalise to -180..+180
	
		return new Point(lat2, lon2, true);
	}

	distanceTo(point : Point) {

		var lat1 = this.latitude;
		var lon1 = this.longitude;
		var lat2 = point.latitude;
		var lon2 = point.longitude;
		var dlat = lat2 - lat1;
		var dlon = lon2 - lon1;
	
		var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
	
		return Point.RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	}

	static intersectSimple(p : Point, p2 : Point, q : Point, q2 : Point) {
		var s1_x = p2.longitude - p.longitude;
		var s1_y = p2.latitude - p.latitude;
		var s2_x = q2.longitude - q.longitude;
		var s2_y = q2.latitude - q.latitude;
	
		var den = (-s2_x * s1_y + s1_x * s2_y);
		if (den === 0) {
			return null;
		}
	
		var s = (-s1_y * (p.longitude - q.longitude) + s1_x * (p.latitude - q.latitude)) / den;
		var t = (s2_x * (p.latitude - q.latitude) - s2_y * (p.longitude - q.longitude)) / den;
	
		if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
			return new Point(p.latitude + (t * s1_y), p.longitude + (t * s1_x), true);
		}
	
		return null;
	}
}

// export interface Point {
// 	setLapTime(startTime : number, splitStartTime : number)
// 	roundValue(value : number)
// 	latitudeDegrees()
// 	longitudeDegrees()
// 	subtract(point : Point)
// 	bearingTo(point : Point, inRadians : boolean)
// 	destination(bearing : number, distance : number)
// 	distanceTo(point : Point)
// 	intersectSimple(p : Point, p2 : Point, q : Point, q2 : Point)
// }

// Point.prototype.setLapTime = function(this : Point, startTime : number, splitStartTime : number) {
// 	this.lapTime = this.timestamp - startTime;
// 	this.splitTime = this.timestamp - splitStartTime;
// }

// Point.prototype.roundValue = function (value) {
// 	return Math.round(value * 1000000.0) / 1000000.0;
// };

// Point.prototype.latitudeDegrees = function (this : Point) {
// 	return this.roundValue(Utils.toDegrees(this.latitude));
// };

// Point.prototype.longitudeDegrees = function (this : Point) {
// 	return this.roundValue(Utils.toDegrees(this.longitude));
// };

// Point.prototype.subtract = function (this : Point, point : Point) {
// 	return new Point(this.latitude - point.latitude, this.longitude - point.longitude, true);
// };

// Point.prototype.bearingTo = function (this : Point, point : Point, inRadians : boolean) {
// 	inRadians = typeof inRadians !== 'undefined' ? inRadians : false;
// 	var lat1 = this.latitude;
// 	var lat2 = point.latitude;
// 	var dlon = point.longitude - this.longitude;

// 	var y = Math.sin(dlon) * Math.cos(lat2);
// 	var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlon);
// 	var tan = Math.atan2(y, x);

// 	if (inRadians) {
// 		return this.roundValue((tan + 2 * Math.PI) % Math.PI);
// 	} else {
// 		return this.roundValue((Utils.toDegrees(tan) + 2 * 360) % 360);
// 	}
// };

// Point.prototype.destination = function (this : Point, bearing : number, distance : number) {
// 	var tan = Utils.toRadians(bearing);
// 	var cir = distance / Point.RADIUS;
// 	var lat1 = this.latitude;
// 	var lon1 = this.longitude;
// 	var lat2 = Math.asin(Math.sin(lat1) * Math.cos(cir) + Math.cos(lat1) * Math.sin(cir) * Math.cos(tan));
// 	var lon2 = lon1 + Math.atan2(Math.sin(tan) * Math.sin(cir) * Math.cos(lat1), Math.cos(cir) - Math.sin(lat1) * Math.sin(lat2));
// 	lon2 = (lon2 + 3.0 * Math.PI) % (2.0 * Math.PI) - Math.PI; // normalise to -180..+180

// 	return new Point(lat2, lon2, true);
// };

// Point.prototype.distanceTo = function (this : Point, point : Point) {
// 	var lat1 = this.latitude;
// 	var lon1 = this.longitude;
// 	var lat2 = point.latitude;
// 	var lon2 = point.longitude;
// 	var dlat = lat2 - lat1;
// 	var dlon = lon2 - lon1;

// 	var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);

// 	return Point.RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// };

// Point.prototype.intersectSimple = function (this : Point, p : Point, p2 : Point, q : Point, q2 : Point) {
// 	var s1_x = p2.longitude - p.longitude;
// 	var s1_y = p2.latitude - p.latitude;
// 	var s2_x = q2.longitude - q.longitude;
// 	var s2_y = q2.latitude - q.latitude;

// 	var den = (-s2_x * s1_y + s1_x * s2_y);
// 	if (den === 0) {
// 		return null;
// 	}

// 	var s = (-s1_y * (p.longitude - q.longitude) + s1_x * (p.latitude - q.latitude)) / den;
// 	var t = (s2_x * (p.latitude - q.latitude) - s2_y * (p.longitude - q.longitude)) / den;

// 	if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
// 		return new Point(p.latitude + (t * s1_y), p.longitude + (t * s1_x), true);
// 	}

// 	return null;
// };