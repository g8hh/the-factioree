let modInfo = {
	name: "The Factoree",
	id: "factoreemod",
	author: "Dystopia#4937",
	pointsName: "ores",
	discordName: "",
	discordLink: "",
	changelogLink: "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
    offlineLimit: 100000000,  // In hours
    initialStartPoints: new Decimal (10) // Used for hard resets and new players
}

// Set your version in num and name
let VERSION = {
	num: "0.4.2 balancing",
	name: "Actual factorees",
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["extraFlame", "flameEffect"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0);
	var extractorbuyables = buyableEffect("e", 11).mul(buyableEffect("e", 12).mul(buyableEffect("e", 13)));
	let gain = player.e.points.mul(extractorbuyables).max(player.e.upgrades.length);
	if (hasUpgrade("e", 11)) gain = gain.mul(2);
	if (hasUpgrade("e", 13)) gain = gain.mul(upgradeEffect("e", 13));
	if (hasUpgrade("e", 14)) gain = gain.mul(upgradeEffect("e", 14));
	gain = gain.mul(buyableEffect("f", 13));
	if (hasUpgrade("e", 32)) gain = gain.mul(upgradeEffect("e", 32));
	gain = gain.mul(tmp.m.effect).mul(hasUpgrade("m", 43)?player.e.burnEffect.pow(0.1):player.e.burnEffect.add(1.2).log(1.2));
	if (hasUpgrade("mo", 11)) gain = gain.pow(upgradeEffect("mo", 11));
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
"Current Endgame: all competitors completed"
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(60000) // Default is 1 hour which is just arbitrarily large
}