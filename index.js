var turf = require('turf')
var tilebelt = require('tilebelt')
var fs = require('fs')

var docs = JSON.parse(fs.readFileSync('./docs-in.json'));

docs.forEach(function(doc) {
	// get the geometry from _bbox and delete the tile indexes
	var geom = turf.bboxPolygon(doc._bbox).geometry
	doc._geometry = geom;
	delete doc._zxy
});

fs.writeFileSync('./docs-out.json', JSON.stringify(docs, null, 2));