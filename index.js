var T = require('turf')
var tilebelt = require('tilebelt')
var fs = require('fs')

var docs = JSON.parse(fs.readFileSync('./docs-in.json'));

docs.forEach(function(doc) {
	// get tilebelt style tiles
	doc._zxy = doc._zxy.map(function(zxy) {
		var zxyArr = zxy.split('/');
		var xyz = [zxyArr[1], zxyArr[2], zxyArr[0]];
		return xyz;
	});

	// generate geometries for each of the tiles
	var geom = {
		type: 'MultiPolygon',
		coordinates: [[]]
	}

	doc._zxy.forEach(function(tile){
		var poly = tilebelt.tileToGeoJSON(tile)
		geom.coordinates[0].push(poly.geometry.coordinates[0])
	})
	doc._geometry = geom;
	delete doc._zxy
});

fs.writeFileSync('./docs-out.json', JSON.stringify(docs, null, 2));