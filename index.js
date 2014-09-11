var turf = require('turf')
var tilebelt = require('tilebelt')
var fs = require('fs')

var docs = JSON.parse(fs.readFileSync('./docs-in.json'));

docs.forEach(function(doc) {
	/*// get the geometry from _bbox and delete the tile indexes
	var geom = turf.bboxPolygon(doc._bbox).geometry
	doc._geometry = geom;
	delete doc._zxy*/

	// get tilebelt style tiles
	doc._zxy = doc._zxy.map(function(zxy) {
		var zxyArr = zxy.split('/');
		var xyz = [parseInt(zxyArr[1]), parseInt(zxyArr[2]), parseInt(zxyArr[0])];
		return xyz;
	});

	// generate geometries for each of the tiles
	var polygons = turf.featurecollection([]);
	doc._zxy.forEach(function(tile){
		polygons.features.push(tilebelt.tileToGeoJSON(tile))
	})
	var geom = turf.merge(polygons)
	geom = turf.buffer(geom, -5, 'miles');
	doc._geometry = geom.features[0].geometry;
	delete doc._zxy
});

fs.writeFileSync('./docs-out.json', JSON.stringify(docs, null, 2));