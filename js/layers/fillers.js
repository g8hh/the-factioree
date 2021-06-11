var testNumber = 0;
addLayer("filler1", {
	startData() { return {points: new Decimal(0), unlocked: true}},
	row: 0,
	position: -2,
	layerShown: "ghost"
});
addLayer("filler2", {
	startData() { return {points: new Decimal(0), unlocked: true}},
	row: 0,
	position: 2,
	layerShown: "ghost"
});
addLayer("filler3", {
	startData() { return {points: new Decimal(0), unlocked: true}},
	row: 1,
	position: -2,
	layerShown: "ghost"
});
addLayer("filler4", {
	startData() { return {points: new Decimal(0), unlocked: true}},
	row: 1,
	position: 2,
	layerShown: "ghost"
});
addLayer("filler5", {
	startData() { return {points: new Decimal(0), unlocked: true}},
	row: 3,
	position: -2,
	layerShown: "ghost"
});
addLayer("filler6", {
	startData() { return {points: new Decimal(0), unlocked: true}},
	row: 3,
	position: 2,
	layerShown: "ghost"
});