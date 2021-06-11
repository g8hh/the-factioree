addLayer("m", {
	name: "manufacturers", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		autoFurnace: false,
		autoFAlloc: false,
		autoEBuyable: false,
		autoEmber: false,
		autoFlame: false,
		autoManu: false,
		bricks: new Decimal(0),
		active: new Decimal(0),
		furnaceTick: 0,
		usedBricks: new Decimal(0),
		moChallLeft: new Decimal(0)
	}},
	color: "#9f2a1a",
	requires: new Decimal("1e1080"), // Can be a function that takes requirement increases into account
	resource: "manufacturers", // Name of prestige currency
	baseResource: "metals", // Name of resource prestige is based on
	baseAmount() {return player.f.metals}, // Get the current amount of baseResource
	type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base() {
		return player.m.points.add(1).mul(1e85)
	},
	exponent() {
		return player.m.points.sub(inChallenge("mo", 42)?0:20).max(1).pow(0.01).mul(player.m.points.sub(inChallenge("mo", 42)?0:100).max(1).pow(hasUpgrade("mo", 15)?0.035:0.05))
	},
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1)
		mult = mult.div(tmp.mo.wasteEffect.manuCheap);
		mult = mult.div(tmp.mo.wasteEffect.manuCheap2);
		return mult
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
	},
	row: 1, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{key: "m", description: "m: Reset for manufacturers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	effect() {
		return Decimal.pow(1e6, player.m.points.max(player.m.upgrades.length).sub(player.m.active))
	},
	effectDescription() {
		return `boosting ore gains by ${format(this.effect())} and ember gains by ${format(this.effect().sqrt())}`
	},
	layerShown(){return player.m.unlocked||player.points.gte("1e1000")},
	upgrades: {
		rows: 3,
		cols: 5,
		11: {
			title: "Extractor Manufacturer",
			description: "Unlock more extractor upgrades, and keep them on reset.",
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:2;
			},
			onPurchase() {
				player.m.active = player.m.active.min(player.m.points).max(0);
			}
		},
		12: {
			title: "Furnace Quality Control",
			description: "Keep furnace upgrades on reset.",
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:7;
			},
			onPurchase() {
				player.m.active = player.m.active.min(player.m.points).max(0);
			}
		},
		13: {
			title: "Actual Manufacturing",
			description: "Unlock factories.",
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:30;
			},
			onPurchase() {
				player.m.active = player.m.active.min(player.m.points).max(0);
			}
		},
		14: {
			title: "Brick Manufacturing",
			description: "Produce bricks 10x faster.",
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:40;
			},
			unlocked() {
				return hasUpgrade("m", 13)
			},
			onPurchase() {
				player.m.active = player.m.active.min(player.m.points).max(0);
			}
		},
		15: {
			title: "Sacrifice",
			description: "Remove all of your manufacturers past 80 to unlock the next layer.",
			cost() {
				return player.m.points.sub(80)
			},
			unlocked() {
				return player.m.points.gte(80)&&!player.mo.unlocked
			},
			onPurchase() {
				player.m.points = new Decimal(80)
				player.m.active = player.m.active.min(player.m.points).max(0)
			}
		},
		21: {
			title: "Untimewall Gaming",
			description: "Factory 1's interval is reduced to 0.5 seconds.",
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:10000;
			},
			unlocked() {
				return hasUpgrade("m", 13)
			},
			currencyDisplayName: "bricks",
			currencyInternalName() {
				return "bricks"
			},
			currencyLayer() {
				return "m"
			}
		},
		22: {
			title: "Timewalled Gaming again",
			description: "Factory one raises furnace hardcap to 100 instead of 50 per level.",
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:50000;
			},
			unlocked() {
				return hasUpgrade("m", 13)
			},
			currencyDisplayName: "bricks",
			currencyInternalName() {
				return "bricks"
			},
			currencyLayer() {
				return "m"
			}
		},
		23: {
			title: "The Burning Tree",
			description: "Oil burning halves oil production instead, is always activated, and the effects are much more powerful.",
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:2000000
			},
			unlocked() {
				return hasUpgrade("m", 13)
			},
			currencyDisplayName: "bricks",
			currencyInternalName() {
				return "bricks"
			},
			currencyLayer() {
				return "m"
			}
		},
	},
	milestones: {
		0: {
			requirementDescription: "Manufacturer of furnaces (1 manufacturer)",
			effectDescription: "Unlock a new column of furnace upgrades.<br>Automate furnaces and active furnaces respectively.",
			toggles: [["m", "autoFurnace"], ["m", "autoFAlloc"]],
			done() {
				return player.m.points.gte(1)
			},
			style: {
				width: "500px"
			}
		},
		1: {
			requirementDescription: "Manufacturer of parts (3 m.)",
			effectDescription: "Automate extractor buyables and they don't reduce metal amount if bought automatically.",
			toggles: [["m", "autoEBuyable"]],
			done() {
				return player.m.points.gte(3)
			},
			style: {
				width: "500px"
			}
		},
		2: {
			requirementDescription: "Manufacturer of flames (5 m.)",
			effectDescription: "Automate embers and flame respectively and they don't reduce ember amount if bought automatically.",
			toggles: [["m", "autoEmber"], ["m", "autoFlame"]],
			done() {
				return player.m.points.gte(5)
			},
			style: {
				width: "500px"
			}
		},
		3: {
			requirementDescription: "Manufacturer of furnace upgrades (7 m.)",
			effectDescription: "Unlock a lot of furnace and flame upgrades.",
			done() {
				return player.m.points.gte(7)
			},
			style: {
				width: "500px"
			}
		},
		4: {
			requirementDescription: "Mass production of furnaces (10 m.)",
			effectDescription: "Auto-Furnace buys max furnaces.",
			done() {
				return player.m.points.gte(10)
			},
			style: {
				width: "500px"
			}
		},
		5: {
			requirementDescription: "Meta Manufacturer (30 m.)",
			effectDescription: "Automate Manufacturers, and auto manufacturers buys max.",
			toggles: [["m", "autoManu"]],
			done() {
				return player.m.points.gte(30)
			},
			style: {
				width: "500px"
			}
		}
	},
	buyables: {
		rows: 1,
		cols: 3,
		11: {
			title: "Factory 1",
			display() {
				return `<br><span style="font-size: 12px">Creates a furnace every ${hasUpgrade("m", 21)?"1 second":"5 seconds"}. (count toward scaling) Fifth level nerfs ore to metal softcap. Also increases furnaces cap.<br>
				Amount: ${format(player.m.buyables[11])}
				Currently: ${format(this.effect().div((((!hasUpgrade("m", 21))*4)+1)))}/s
				Cost: ${format(this.cost())} bricks
				Furnaces capped at ${format(this.effect().min(inChallenge("mo", 42)?0:tmp.p.effect[2].add(50)).mul(hasUpgrade("m", 22)?100:50).add(this.effect().sub(inChallenge("mo", 42)?0:50).sub(inChallenge("mo", 42)?0:tmp.p.effect[2]).max(0).mul(2500).pow(0.5).floor()).add(1000))}</span>`
			},
			cost(val=player.m.buyables[11]) {
				let T = val.add(getBuyableAmount("m", 12)).add(getBuyableAmount("m", 13)).add(1);
				if (hasUpgrade("mo", 12) && !(inChallenge("mo", 21)||inChallenge("mo", 22))) T = val.add(1);
				let C = T.mul(T.add(1)).mul(T.mul(2).add(1)).mul(2).mul(T.add(2)).mul(Decimal.pow(1.5, T.sub(inChallenge("mo", 42)?0:1000).sub(tmp.p.effect[1]).max(0))).div(hasUpgrade("p", 11)?upgradeEffect("p", 11):1);
				if (inChallenge("mo", 22)) return C.mul(1e9);
				if (hasChallenge("mo", 21)) return C.div(challengeEffect("mo", 21));
				return C.div(tmp.mo.wasteEffect.facCheap);
			},
			buy() {
				if (this.canAfford()) {
					player.m.bricks = player.m.bricks.sub(this.cost())
					player.m.usedBricks = player.m.usedBricks.add(this.cost())
					setBuyableAmount("m", 11, getBuyableAmount("m", 11).add(1))
					player.m.moChallLeft = player.m.moChallLeft.add(1)
				}
			},
			buyMax() {
				if (!this.canAfford()) return;
				var search = 1;
				var iter = 0;
				while (this.canAfford() && iter < 10000) {
					player.m.buyables[this.id] = player.m.buyables[this.id].add(search);
					search *= 2;
					iter++;
				}
				while (!(!this.canAfford()&&this.canAfford(player.m.buyables[this.id].sub(1))) && iter < 10000) {
					search /= 2;
					if (this.canAfford()) player.m.buyables[this.id] = player.m.buyables[this.id].add(Math.ceil(search));
					else player.m.buyables[this.id] = player.m.buyables[this.id].sub(Math.ceil(search));
					iter++;
				}
			},
			effect() {
				return getBuyableAmount("m", 11).mul(tmp.mo.wasteEffect.facMul)
			},
			canAfford(val=player.m.buyables[11]) {
				if (player.m.moChallLeft.gte(100) && inChallenge("mo", 21)) return false;
				if (player.m.moChallLeft.gte(20) && inChallenge("mo", 22)) return false;
				if (isNaN(this.cost(val).sign)||isNaN(this.cost(val).layer)||isNaN(this.cost(val).mag)) return false;
				return player.m.bricks.gte(this.cost(val))
			}
		},
		12: {
			title: "Factory 2",
			display() {
				return `<br><span style="font-size: 12px">First level unlocks plastic, other levels boost plastic gain.<br>
				Amount: ${format(player.m.buyables[12])}
				Currently: x${format(this.effect())} to plastic
				Cost: ${format(this.cost())} bricks</span>`
			},
			cost(val=player.m.buyables[12]) {
				let T = getBuyableAmount("m", 11).add(val).add(getBuyableAmount("m", 13)).add(5);
				if (hasUpgrade("mo", 12) && !(inChallenge("mo", 21)||inChallenge("mo", 22))) T = val.add(5);
				let C = T.mul(T.add(1)).mul(T.mul(2).add(1)).mul(T.mul(3).add(2)).div(5).mul(Decimal.pow(1.5, T.sub(inChallenge("mo", 42)?0:1000).sub(tmp.p.effect[1]).max(0))).div(hasUpgrade("p", 11)?upgradeEffect("p", 11):1).div(tmp.mo.wasteEffect.facCheap);
				if ((isNaN(C.sign)||isNaN(C.layer)||isNaN(C.mag))) C = new Decimal(0.5);
				if (inChallenge("mo", 22)) return C.mul(1e9);
				if (hasChallenge("mo", 21)) return C.div(challengeEffect("mo", 21));
				return C;
			},
			buy() {
				if (this.canAfford()) {
					player.m.bricks = player.m.bricks.sub(this.cost())
					player.m.usedBricks = player.m.usedBricks.add(this.cost())
					setBuyableAmount("m", 12, getBuyableAmount("m", 12).add(1))
					player.m.moChallLeft = player.m.moChallLeft.add(1)
				}
			},
			buyMax() {
				if (!this.canAfford()) return;
				var search = 1;
				var iter = 0;
				while (this.canAfford() && iter < 10000) {
					player.m.buyables[this.id] = player.m.buyables[this.id].add(search);
					search *= 2;
					iter++;
				}
				while (!(!this.canAfford()&&this.canAfford(player.m.buyables[this.id].sub(1))) && iter < 10000) {
					search /= 2;
					if (this.canAfford()) player.m.buyables[this.id] = player.m.buyables[this.id].add(Math.ceil(search));
					else player.m.buyables[this.id] = player.m.buyables[this.id].sub(Math.ceil(search));
					iter++;
				}
			},
			effect() {
				return Decimal.pow(1e20, getBuyableAmount("m", 12).sub(1).max(0).min(inChallenge("mo", 42)?0:100)).mul(Decimal.pow(3, getBuyableAmount("m", 12).sub(inChallenge("mo", 42)?0:100).max(0).pow(0.5))).pow(tmp.mo.wasteEffect.facMul)
			},
			canAfford(val=player.m.buyables[12]) {
				if (player.m.moChallLeft.gte(100) && inChallenge("mo", 21)) return false;
				if (player.m.moChallLeft.gte(20) && inChallenge("mo", 22)) return false;
				if (isNaN(this.cost(val).sign)||isNaN(this.cost(val).layer)||isNaN(this.cost(val).mag)) return false;
				return player.m.bricks.gte(this.cost(val))
			}
		},
		13: {
			title: "Factory 3",
			display() {
				return `<br><span style="font-size: 12px">Each level increases brick gain.<br>
				Amount: ${format(player.m.buyables[13])}
				Currently: x${format(this.effect(), 2)} to bricks
				Cost: ${format(this.cost())} bricks</span>`
			},
			cost(val=player.m.buyables[13]) {
				let T = getBuyableAmount("m", 11).add(getBuyableAmount("m", 12)).add(val).add(3);
				if (hasUpgrade("mo", 12) && !(inChallenge("mo", 21)||inChallenge("mo", 22))) T = val.add(3);
				let C = T.mul(T.add(1)).mul(T.mul(2).add(1)).mul(T.mul(3).add(2)).mul(T.mul(2)).div(20).mul(Decimal.pow(1.5, T.sub(inChallenge("mo", 42)?0:1000).sub(tmp.p.effect[1]).max(0))).div(hasUpgrade("p", 11)?upgradeEffect("p", 11):1);
				if (inChallenge("mo", 22)) return C.mul(1e9);
				if (hasChallenge("mo", 21)) return C.div(challengeEffect("mo", 21));
				return C.div(tmp.mo.wasteEffect.facCheap);
			},
			buy() {
				if (this.canAfford()) {
					player.m.bricks = player.m.bricks.sub(this.cost())
					player.m.usedBricks = player.m.usedBricks.add(this.cost())
					setBuyableAmount("m", 13, getBuyableAmount("m", 13).add(1))
					player.m.moChallLeft = player.m.moChallLeft.add(1)
				}
			},
			buyMax() {
				if (!this.canAfford()) return;
				var search = 1;
				var iter = 0;
				while (this.canAfford() && iter < 10000) {
					player.m.buyables[this.id] = player.m.buyables[this.id].add(search);
					search *= 2;
					iter++;
				}
				while (!(!this.canAfford()&&this.canAfford(player.m.buyables[this.id].sub(1))) && iter < 10000) {
					search /= 2;
					if (this.canAfford()) player.m.buyables[this.id] = player.m.buyables[this.id].add(Math.ceil(search));
					else player.m.buyables[this.id] = player.m.buyables[this.id].sub(Math.ceil(search));
					iter++;
				}
			},
			effect() {
				return getBuyableAmount("m", 13).mul(tmp.mo.wasteEffect.facMul).add(1).pow(2.5);
			},
			canAfford(val=player.m.buyables[13]) {
				if (player.m.moChallLeft.gte(100) && inChallenge("mo", 21)) return false;
				if (player.m.moChallLeft.gte(20) && inChallenge("mo", 22)) return false;
				if (isNaN(this.cost(val).sign)||isNaN(this.cost(val).layer)||isNaN(this.cost(val).mag)) return false;
				return player.m.bricks.gte(this.cost(val));
			}
		},
		respec() {
			resetBuyables("m");
			player.m.bricks = player.m.bricks.add(player.m.usedBricks);
			player.m.usedBricks = new Decimal(0);
			doReset("m", true);
			if (inChallenge("mo", 21)) player.m.moChallLeft = new Decimal(0);
		},
		showRespec() {
			return !hasUpgrade("mo", 12) || inChallenge("mo", 21) || inChallenge("mo", 22);
		},
		respecText: "Respec factories"
	},
	branches: ["f"],
	tabFormat: {
		"Main": {
			content: ["main-display", "prestige-button", "resource-display", ["upgrade", 15], ["raw-html", "<br>Reach 80 manufacturers to unlock the next layer.<br>"], "milestones", ["raw-html", "<br>"], "upgrade-factory", ["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14]]]]
		},
		"Factories": {
			content: ["main-display", "prestige-button", "resource-display", ["upgrade", 15], ["raw-html", function () {
			return `Reach 80 manufacturers to unlock the next layer.<br><br>You have ${format(player.m.bricks)} bricks. (${format(player.m.active.add(player.mo.milestones.includes("3")?player.m.points.sub(player.m.active).mul(0.5):0).mul(hasUpgrade("m", 14)?1:0.1).mul(buyableEffect("m", 13)).mul(tmp.mo.effect))}/s)
			<br><br>
			You have ${format(player.m.active)} active manufacturers.
			<br><br>
			Use the below slider to change active manufacturers.
			<br><br>`}],
			"manu-slider",
			["raw-html", _=> {return `<br>
			Active manufacturers subtract from the manufacturer effect, but in turn you get bricks to buy factories.
			<br>${
				(inChallenge("mo", 21)||inChallenge("mo", 22))?`"The Spacious Factory" factory purchases left: ${inChallenge("mo", 21)?Decimal.sub(100, player.m.moChallLeft):Decimal.sub(20, player.m.moChallLeft)}`:""
			}`}
			], "buyables", ["raw-html", `<br>Buying a factory makes all others more expensive. Use the space you have wisely.`], "upgrade-factory", ["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24]]]],
			unlocked() {
				return hasUpgrade("m", 13)
			},
		}
	},
	automate() {
		if (player.m.autoFurnace&&canReset("f")&&player.m.milestones.includes("0")) player.m.milestones.includes("4")?buyMaxFurnaces():doReset("f");
		if (player.m.autoFAlloc&&player.m.milestones.includes("0")) player.f.allocated = player.f.points;
		if (((player.m.autoEBuyable&&player.m.milestones.includes("1"))||player.mo.pollution>11)&&hasUpgrade("e", 21)) {
			for (var i = 11; i <= 13; i++) {
				layers.e.buyables[i].buyMax();
			}
		}
		if (player.m.autoFlame&&player.m.milestones.includes("2")) layers.f.clickables[11].onClick(true);
		if (player.m.autoEmber&&player.m.milestones.includes("2")) {
			for (var i = 10; i <= (hasUpgrade("p", 14)?20:10); i += 10) {
				for (var j = 1; j <= (hasUpgrade("p", 14)?2:3); j++) {
					layers.f.buyables[i+j].buyMax();
				}
			}
		}
		if (player.m.autoManu&&player.m.milestones.includes("4")) buyMaxManufacturers();
	},
	resetsNothing() {
		return player.mo.milestones.includes("1")
	},
	update(diff) {
		if (hasUpgrade("m", 13)) player.m.bricks = player.m.bricks.add(player.m.active.mul(hasUpgrade("m", 14)?1:0.1).mul(buyableEffect("m", 13)).mul(tmp.mo.effect).mul(diff));
		if (player.mo.milestones.includes("3")) player.m.bricks = player.m.bricks.add(player.m.points.sub(player.m.active).mul(hasUpgrade("m", 14)?0.5:0.05).mul(buyableEffect("m", 13)).mul(tmp.mo.effect).mul(diff));
		player.m.active = player.m.active.min(player.m.points).max(0);
		player.m.furnaceTick += diff;
		player.f.points = player.f.points.add(Decimal.floor(player.m.furnaceTick/(((!hasUpgrade("m", 21))*4.5)+0.5)).mul(buyableEffect("m", 11)));
		player.m.furnaceTick = player.m.furnaceTick%(((!hasUpgrade("m", 21))*4.5)+0.5);
		if (hasUpgrade("m", 23)) player.e.burning = true; 
		player.f.points = player.f.points.min(buyableEffect("m", 11).min(tmp.p.effect[2].add(50)).mul(hasUpgrade("m", 22)?100:50).add(buyableEffect("m", 11).sub(50).sub(tmp.p.effect[2]).max(0).mul(2500).pow(0.5).floor()).add(1000));
	},
	doReset(resettingLayer) {
		var keep = [];
		if (layers[resettingLayer].row > 1) {
			if (player.mo.milestones.includes("0")) keep.push("milestones", "autoFurnace", "autoFAlloc", "autoEBuyable", "autoFlame", "autoEmber", "autoManu");
			if (player.mo.milestones.includes("2")) keep.push("upgrades");
			layerDataReset("m", keep);
			if (player.l.milestones.includes("4")) for (var i = 11; i <= 13; i++) {player.m.buyables[i] = new Decimal(100000)}
		}
	}
})
function buyMaxManufacturers() {
	var iterations = 0;
	while (player.f.metals.gte(getNextAt("m"))&&iterations<100000&&canReset("m")) {
		player.m.points = player.m.points.add(1);
		iterations++;
		Vue.set(tmp.m, "exponent", layers.m.exponent());
		Vue.set(tmp.m, "base", layers.m.base());
	}
	if (iterations>0) doReset("m", true);
}
addLayer("r", {
	name: "research",
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		free: new Decimal(0),
		autoResearch: "disabled",
		researchScientists: {
			11: new Decimal(0),
			12: new Decimal(0),
			13: new Decimal(0),
			21: new Decimal(0),
			22: new Decimal(0),
			23: new Decimal(0)
		},
		researchTimes: {
			11: 0,
			12: 0,
			13: 0,
			21: 0,
			22: 0,
			23: 0
		},
		researchTReq: {
			11: Infinity,
			12: Infinity,
			13: Infinity,
			21: Infinity,
			22: Infinity,
			23: Infinity
		},
		allocated: new Decimal(0)
	}},
	color: "#3399ff",
	resource: "research points",
	row: 1,
	symbol: "R",
	position: -1,
	branches: ["p", "mo"],
	baseResource: "ores",
	baseAmount() { return player.points },
	requires: new Decimal("1e250000"),
	type: "static",
	exponent() {
		return hasUpgrade("r", 13)?0.15:0.3
	},
	base: 100,
	canBuyMax: true,
	gainMult() {
		return new Decimal(hasChallenge("mo", 42)?"1e-100000":1)
	},
	gainExp() {
		var exp = new Decimal(1);
		exp = exp.mul(tmp.mo.wasteEffect.research);
		return exp;
	},
	layerShown() { return hasUpgrade("mo", 23)||player.d.unlocked||player.l.unlocked },
	doReset(resettingLayer) {
		var keep = [];
		if (player.l.milestones.includes("0")||player.d.milestones.includes("0")) keep.push("milestones", "upgrades", "buyables");
		if (layers[resettingLayer].row > 2) {
			layerDataReset("r", keep);
			player.r.buyables[31] = new Decimal(0)
		}
	},
	upgrades: {
		rows: 2,
		cols: 3,
		11: {
			title: "One-time Research 1",
			description: "Power stations reset nothing.",
			cost: 5e17,
			style: {
				height: "200px",
				width: "200px"
			}
		},
		12: {
			title: "One-time Research 2",
			description: "Free Plastic Strucutres add free levels to all structures, and autobuy plastic structures. Swindles the goverment into giving you infinity space for plastic structures instead of the 20 cap.",
			cost: 3e18,
			style: {
				height: "200px",
				width: "200px"
			}
		},
		13: {
			title: "One-time Research 3",
			description: "Automatically research, and researching resets nothing. Research point gain is much better, and halve all research times.",
			cost: 3e19,
			style: {
				height: "200px",
				width: "200px"
			}
		},
		21: {
			title: "One-time Research 4",
			description: "Unlock automatic research.",
			cost: 3e41,
			style: {
				height: "200px",
				width: "200px"
			}
		},
		22: {
			title: "One-time Research 5",
			description: "Autobuy electric buyables, and they don't reduce electricity. Electric buyables are also much cheaper.",
			cost: 1e43,
			style: {
				height: "200px",
				width: "200px"
			}
		},
		23: {
			title: "One-time Research 6",
			description: "Scientists are much cheaper, and halve all research times again.",
			cost: 1e44,
			style: {
				height: "200px",
				width: "200px"
			}
		}
	},
	buyables: {
		rows: 2,
		cols: 3,
		31: {
			title: "Scientists",
			display() {
				return `<span style="font-size: 12px">Purchase a scientist.<br>
				You have ${format(player.r.buyables[31])} scientists.<br>
				Cost: ${format(tmp.r.buyables[31].cost)} research points</span>`
			},
			cost() {
				return Decimal.pow(hasUpgrade("r", 23)?100:1000, player.r.buyables[31].pow(hasUpgrade("r", 23)?1.05:1.25)).mul(1e10);
			},
			buy() {
				if (this.canAfford()) {
					player.r.points = player.r.points.sub(this.cost());
					player.r.buyables[31] = player.r.buyables[31].add(1);
					player.r.free = player.r.free.add(1);
				}
			},
			canAfford() {
				return player.r.points.gte(this.cost());
			}
		},
		11: {
			title: "Research 1",
			display() {
				return `<span style="font-size: 12px">Boosts ore generation.<br>
				${player.r.allocated.gte(1)?`Research time: ${format(player.r.researchTReq[11])}s<br>`:""}Currently: ${format(player.r.buyables[11], 0)} researches
				Effect: ${format(tmp.r.buyables[11].effect)}
				${player.r.researchScientists[11].gt(0)?`Time left: ${format(Math.max(player.r.researchTReq[11]-player.r.researchTimes[11], 0))}s`:""}</span>`
			},
			cost() {
				return new Decimal(0);
			},
			buy() {
				if (this.canAfford()) {
					player.r.free = player.r.free.sub(player.r.allocated);
					player.r.researchScientists[11] = player.r.allocated;
					player.r.allocated = player.r.allocated.min(player.r.free);
				}
			},
			canAfford() {
				return player.r.allocated.gte(1)&&player.r.researchScientists[11].eq(0)&&player.r.buyables[11].lt(50);
			},
			effect() {
				return Decimal.pow("1e10000", player.r.buyables[11].pow(0.5))
			}
		},
		12: {
			title: "Research 2",
			display() {
				return `<span style="font-size: 12px">Boosts electricity generation.<br>
				${player.r.allocated.gte(1)?`Research time: ${format(player.r.researchTReq[12])}s<br>`:""}Currently: ${format(player.r.buyables[12], 0)} researches
				Effect: ${format(tmp.r.buyables[12].effect)}
				${player.r.researchScientists[12].gt(0)?`Time left: ${format(player.r.researchTReq[12]-player.r.researchTimes[12])}s`:""}</span>`
			},
			cost() {
				return new Decimal(0);
			},
			buy() {
				if (this.canAfford()) {
					player.r.free = player.r.free.sub(player.r.allocated);
					player.r.researchScientists[12] = player.r.allocated;
					player.r.allocated = player.r.allocated.min(player.r.free);
				}
			},
			canAfford() {
				return player.r.allocated.gte(1)&&player.r.researchScientists[12].eq(0)&&player.r.buyables[12].lt(50);
			},
			effect() {
				return player.r.buyables[12].add(2).pow(3).sub(7)
			}
		},
		13: {
			title: "Research 3",
			display() {
				return `<span style="font-size: 12px">Boosts heat generation.<br>
				${player.r.allocated.gte(1)?`Research time: ${format(player.r.researchTReq[13])}s<br>`:""}Currently: ${format(player.r.buyables[13], 0)} researches
				Effect: ${format(tmp.r.buyables[13].effect)}
				${player.r.researchScientists[13].gt(0)?`Time left: ${format(Math.max(player.r.researchTReq[13]-player.r.researchTimes[13], 0))}s`:""}</span>`
			},
			cost() {
				return new Decimal(0);
			},
			buy() {
				if (this.canAfford()) {
					player.r.free = player.r.free.sub(player.r.allocated);
					player.r.researchScientists[13] = player.r.allocated;
					player.r.allocated = player.r.allocated.min(player.r.free);
				}
			},
			canAfford() {
				return player.r.allocated.gte(1)&&player.r.researchScientists[13].eq(0)&&player.r.buyables[13].lt(50);
			},
			effect() {
				return player.r.buyables[13].add(1).pow(2.5)
			}
		},
		21: {
			title: "Research 4",
			display() {
				return `<span style="font-size: 12px">Boosts oil generation.<br>
				${player.r.allocated.gte(1)?`Research time: ${format(player.r.researchTReq[21])}s<br>`:""}Currently: ${format(player.r.buyables[21], 0)} researches
				Effect: ${format(tmp.r.buyables[21].effect)}
				${player.r.researchScientists[21].gt(0)?`Time left: ${format(Math.max(player.r.researchTReq[21]-player.r.researchTimes[21], 0))}s`:""}</span>`
			},
			cost() {
				return new Decimal(0);
			},
			buy() {
				if (this.canAfford()) {
					player.r.free = player.r.free.sub(player.r.allocated);
					player.r.researchScientists[21] = player.r.allocated;
					player.r.allocated = player.r.allocated.min(player.r.free);
				}
			},
			canAfford() {
				return player.r.allocated.gte(1)&&player.r.researchScientists[21].eq(0)&&player.r.buyables[21].lt(50);
			},
			effect() {
				return Decimal.pow("1e2000", player.r.buyables[21].pow(0.5))
			}
		},
		22: {
			title: "Research 5",
			display() {
				return `<span style="font-size: 12px">Boosts extractor gain.<br>
				${player.r.allocated.gte(1)?`Research time: ${format(player.r.researchTReq[22])}s<br>`:""}Currently: ${format(player.r.buyables[22], 0)} researches
				Effect: ${format(tmp.r.buyables[22].effect)}
				${player.r.researchScientists[22].gt(0)?`Time left: ${format(Math.max(player.r.researchTReq[22]-player.r.researchTimes[22], 0))}s`:""}</span>`
			},
			cost() {
				return new Decimal(0);
			},
			buy() {
				if (this.canAfford()) {
					player.r.free = player.r.free.sub(player.r.allocated);
					player.r.researchScientists[22] = player.r.allocated;
					player.r.allocated = player.r.allocated.min(player.r.free);
				}
			},
			canAfford() {
				return player.r.allocated.gte(1)&&player.r.researchScientists[22].eq(0)&&player.r.buyables[22].lt(50);
			},
			effect() {
				return Decimal.pow("1e5000", player.r.buyables[22].pow(0.3));
			}
		},
		23: {
			title: "Research 6",
			display() {
				return `<span style="font-size: 12px">Boosts all waste generations.<br>
				${player.r.allocated.gte(1)?`Research time: ${format(player.r.researchTReq[23])}s<br>`:""}Currently: ${format(player.r.buyables[23], 0)} researches
				Effect: ${format(tmp.r.buyables[23].effect)}
				${player.r.researchScientists[23].gt(0)?`Time left: ${format(Math.max(player.r.researchTReq[23]-player.r.researchTimes[23], 0))}s`:""}</span>`
			},
			cost() {
				return new Decimal(0);
			},
			buy() {
				if (this.canAfford()) {
					player.r.free = player.r.free.sub(player.r.allocated);
					player.r.researchScientists[23] = player.r.allocated;
					player.r.allocated = player.r.allocated.min(player.r.free);
				}
			},
			canAfford() {
				return player.r.allocated.gte(1)&&player.r.researchScientists[23].eq(0)&&player.r.buyables[23].lt(50);
			},
			effect() {
				return player.r.buyables[23].add(1).pow(2);
			}
		}
	},
	tabFormat: {
		"Main researches": {
			content: ["main-display", "prestige-button", "resource-display", ["buyable", 31], ["raw-html", _=>{
				return `You have ${format(player.r.free)} free scientists.<br>
				Allocate scientists to researches using the following slider.<br>
				<input oninput="player.r.allocated = new Decimal(this.value);updateTimes();" type="range" min="0" max="${player.r.free}" step="1" style="width: 30em" value="${player.r.allocated}"><br>
				Next research will allocate ${format(player.r.allocated)} scientists.
				<br><br>
				<h2>Researches</h2><br>
				Researches boost the gain of various resources, but take a certain amount of time to complete. This time is better the more scientists you have allocated in the research.<br>
				You cannot disable a research after activating it!<br>
				All researches have been capped at 50 for balancing purposes.<br><br>`
			}], ["research-dropdown", _=>{ return {
				text: "Research automation",
				show: hasUpgrade("r", 21),
				options: ["disabled", "1", "2", "3", "4", "5", "6"],
				internalName: "autoResearch"
			}}], "buyables"]
		},
		"One-time researches": {
			content: ["main-display", "prestige-button", "resource-display", "upgrades", ["research-dropdown", _=>{ return {
				text: "Research automation",
				show: hasUpgrade("r", 21),
				options: ["disabled", "1", "2", "3", "4", "5", "6"],
				internalName: "autoResearch"
			}}]]
		}
	},
	hotkeys: [{key: "r", description: "r: reset for research points", onPress() {if (canReset(this.layer)) doReset(this.layer)}}],
	update(diff) {
		player.r.allocated = player.r.allocated.min(player.r.free);
		for (var i = 10; i <= 20; i += 10) {
			for (var j = 1; j <= 3; j++) {
				if (player.r.researchScientists[i+j].gte(1)) {
					player.r.researchTimes[i+j] += diff;
					if (player.r.researchTimes[i+j] >= player.r.researchTReq[i+j]) {
						player.r.buyables[i+j] = player.r.buyables[i+j].add(1);
						player.r.free = player.r.free.add(player.r.researchScientists[i+j]);
						player.r.researchScientists[i+j] = new Decimal(0);
						player.r.researchTimes[i+j] = 0;
					}
				}
				player.r.buyables[i+j] = player.r.buyables[i+j].min(50)
			}
		}
		updateTimes();
		if (player.r.autoResearch != "disabled") {
			player.r.allocated = player.r.free;
			switch (player.r.autoResearch) {
				case "1":
				layers.r.buyables[11].buy();
				break;
				case "2":
				layers.r.buyables[12].buy();
				break;
				case "3":
				layers.r.buyables[13].buy();
				break;
				case "4":
				layers.r.buyables[21].buy();
				break;
				case "5":
				layers.r.buyables[22].buy();
				break;
				case "6":
				layers.r.buyables[23].buy();
				break;
			}
		}
	},
	automate() {
		if (hasUpgrade("r", 13)) doReset("r");
		if (hasUpgrade("r", 12)) layers.p.buyables[11].buy();
		if (hasUpgrade("r", 22)) {
			layers.ps.buyables[11].buy();
			layers.ps.buyables[12].buy();
		}
	},
	resetsNothing() {
		return hasUpgrade("r", 13)
	},
	effect() {
		return player.r.points.add(100).log(100)
	},
	effectDescription() {
		return `boosting monopoly power gain by ${format(tmp.r.effect)}`
	},
	prestigeNotify(testValue=tmp.r.resetGain) {
		if (!(testValue instanceof Decimal)) testValue = new Decimal(0);
		return testValue.gt(player.r.points.div(20))&&player.r.unlocked&&!hasUpgrade("r", 13)
	}
})
function updateTimes() {
	let reqs = {11:300,12:500,13:500,21:300,22:450,23:1000};
	for (var i = 10; i <= 20; i += 10) {
		for (var j = 1; j <= 3; j++) {
			let req = reqs[i+j];
			let divReq = (hasUpgrade("r", 13)?2:1)*(hasUpgrade("r", 23)?2:1);
			if (!player.r.researchScientists[i+j].gte(1)) player.r.researchTReq[i+j] = Math.max(req/toNumber(player.r.allocated.pow(1.2))/divReq, 1);
			else player.r.researchTReq[i+j] = Math.max(req/toNumber(player.r.researchScientists[i+j].pow(1.2))/divReq, 1);
		}
	}
}
addLayer("ps", {
	name: "power station",
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		electric: new Decimal(0),
		heat: new Decimal(0),
		autoPS: false
	}},
	color: "#ffff00",
	resource: "power stations",
	row: 1,
	position: 1,
	baseResource: "ores",
	baseAmount() { return player.points },
	requires: new Decimal("1e10000"),
	type: "static",
	symbol: "PS",
	exponent: 2,
	hotkeys: [{key: "p", description: "p: reset for power stations", onPress() {if (canReset(this.layer)) doReset(this.layer)}}],
	base() {
		return player.ps.points.pow(2).add(1).mul("1e5000")
	},
	gainMult() {
		var mult = new Decimal(1);
		mult = mult.div(tmp.mo.wasteEffect.powerCheap);
		return mult;
	},
	gainExp() {
		return new Decimal(1)
	},
	electricProduction() {
		return player.ps.points.mul(player.e.burnEffect.pow(0.001).add(10).log(10)).mul(tmp.mo.wasteEffect.electricBoost).mul(tmp.ps.buyables[11].effect).mul(tmp.r.buyables[12].effect).mul(10);
	},
	heatProduction() {
		return player.ps.electric.pow(0.7).mul(tmp.ps.buyables[11].effect).mul(tmp.ps.buyables[12].effect).mul(tmp.r.buyables[13].effect)
	},
	upgrades: {
		rows: 3,
		cols: 5,
		11: {
			title: "The Unsustainable Factoree",
			description: "Produce 10x more greenhouse gas.",
			cost: 1e7,
			currencyDisplayName: "electricity",
			currencyLayer: "ps",
			currencyInternalName: "electric"
		},
		12: {
			title: "Spark<s>l</s>ing gold",
			description: "Produce more ores based on electricity.",
			cost: 1e8,
			currencyDisplayName: "electricity",
			currencyLayer: "ps",
			currencyInternalName: "electric",
			effect() {
				return player.ps.electric.add(1).pow(200);
			},
			effectDisplay() {
				return `x${format(this.effect())}`
			}
		},
		13: {
			title: "More Voltage, More Destruction",
			description: "Voltage has a better effect.",
			cost: 1e10,
			currencyDisplayName: "heat",
			currencyLayer: "ps",
			currencyInternalName: "heat"
		},
		14: {
			title: "Synergism",
			description: "Heat boosts burning waste generation, and burning waste boosts embers.",
			cost: 2e13,
			currencyDisplayName: "heat",
			currencyLayer: "ps",
			currencyInternalName: "heat",
			effect() {
				return {
					bWaste: player.ps.heat.add(100).log(100),
					eBoost: player.mo.burningWaste.add(1).pow(4000)
				}
			},
			effectDisplay() {
				return `${format(this.effect().bWaste)} to burning waste, ${format(this.effect().eBoost)} to embers`
			}
		}
	},
	buyables: {
		rows: 1,
		cols: 2,
		11: {
			title: "Voltage",
			display() {
				return `<span style="font-size: 12px">Increase the voltage.<br>
				Currently: ${format(tmp.ps.buyables[11].effect)} volts
				Cost: ${format(tmp.ps.buyables[11].cost)}
				Effect: x${format(tmp.ps.buyables[11].effect)} to electricity and heat</span>`
			},
			effect() {
				return player.ps.buyables[11].add(1).pow(hasUpgrade("ps", 13)?1.5:1)
			},
			buy() {
				if (this.canAfford()) {
					if (!hasUpgrade("r", 22)) player.ps.electric = player.ps.electric.sub(this.cost());
					player.ps.buyables[11] = player.ps.buyables[11].add(1);
				}
			},
			canAfford() {
				return player.ps.electric.gte(this.cost())
			},
			cost() {
				var base = Decimal.pow(hasUpgrade("r", 22)?3:5, player.ps.buyables[11].pow(hasUpgrade("r", 22)?1.01:1.1)).mul(10000);
				base = base.div(tmp.mo.wasteEffect.voltCheap);
				return base;
			}
		},
		12: {
			title: "Resistance",
			display() {
				return `<span style="font-size: 12px">Increase the resistance to produce more heat.<br>
				Currently: ${format(player.ps.buyables[12].add(1))} ohms
				Cost: ${format(tmp.ps.buyables[12].cost)}
				Effect: ${format(tmp.ps.buyables[12].effect)} to heat</span>`
			},
			effect() {
				return player.ps.buyables[12].add(1).pow(2)
			},
			buy() {
				if (this.canAfford()) {
					if (!hasUpgrade("r", 22)) player.ps.electric = player.ps.electric.sub(this.cost());
					player.ps.buyables[12] = player.ps.buyables[12].add(1);
				}
			},
			canAfford() {
				return player.ps.electric.gte(this.cost())
			},
			cost() {
				var base = Decimal.pow(hasUpgrade("r", 22)?5:7, player.ps.buyables[12].pow(hasUpgrade("r", 22)?1.01:1.1)).mul(100000);
				base = base.div(tmp.mo.wasteEffect.voltCheap);
				return base;
			}
		}
	},
	milestones: {
		0: {
			requirementDescription: "8 power stations",
			effectDescription: "Automate power stations.",
			toggles: [["ps", "autoPS"]],
			done() {
				return player.ps.points.gte(8);
			},
			style: {width: "500px"}
		}
	},
	layerShown() { return hasUpgrade("mo", 23)||player.d.unlocked||player.l.unlocked },
	tabFormat: {
		"Main": {
			content: ["main-display", "prestige-button", "resource-display", ["raw-html", _=>{
				return `You have ${format(player.ps.electric)} electricity, producing ${format(tmp.ps.heatProduction)} heat per second.<br>You are producing ${format(tmp.ps.electricProduction)} electricity per second. (boosted by oil burning)
				${player.mo.burningWaste.gt(0)?`<br>This is further boosted by your burning waste, providing a ${format(tmp.mo.wasteEffect.electricBoost)} multiplier to electricity gain.`:""}
				<br>You have ${format(player.ps.heat)} heat, boosting ember production by ${format(tmp.ps.effect.emberBoost)}, and multiplying point speed base by ${format(tmp.ps.effect.pointSpeedBoost)}`
			}], "milestones", "buyables", "upgrades"]
		}
	},
	branches: ["f", "mo"],
	effect() {
		return {
			emberBoost: player.ps.heat.pow(60).add(1),
			pointSpeedBoost: player.ps.heat.pow(40).add(1)
		}
	},
	update(diff) {
		player.ps.electric = player.ps.electric.add(tmp.ps.electricProduction.mul(diff));
		player.ps.heat = player.ps.heat.add(tmp.ps.heatProduction.mul(diff));
	},
	automate() {
		if (player.ps.milestones.includes("0") && player.ps.autoPS) doReset("ps");
	},
	resetsNothing() {
		return hasUpgrade("r", 11)
	},
	doReset(resettingLayer) {
		if (layers[resettingLayer].row == 2) {
			var keep = [];
			if (player.mo.milestones.includes("0")) keep.push("milestones", "autoPS");
			if (player.mo.milestones.includes("2")) keep.push("upgrades");
			layerDataReset("ps", keep);
		} else if (layers[resettingLayer].row > 2) {
			var keep = [];
			if (player.l.milestones.includes("0")||player.d.milestones.includes("0")) keep.push("milestones", "autoPS");
			if (player.l.milestones.includes("1")||player.d.milestones.includes("1")) keep.push("upgrades", "challenges");
			layerDataReset("ps", keep);
		}
	}
})
