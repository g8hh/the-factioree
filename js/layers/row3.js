addLayer("mo", {
	name: "monopoly", // This is optional, only used in a few places, If absent it just uses the layer id.
	symbol: "MO", // This appears on the layer's node. Default is the id with the first letter capitalized
	position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		total: new Decimal(0),
		autoFac: false,
		chall31TestValue: false,
		chall32TestValue: false,
		pollution: 0,
		waste: new Decimal(0),
		burningWaste: new Decimal(0),
		greenhouse: new Decimal(0),
		ocean: new Decimal(0),
		trees: new Decimal(0),
		air: new Decimal(0),
		ltime: 0
	}},
	color: "#88ffaa",
	requires: new Decimal(80), // Can be a function that takes requirement increases into account
	resource: "monopoly power", // Name of prestige currency
	baseResource: "manufacturers", // Name of resource prestige is based on
	baseAmount() {return player.m.points}, // Get the current amount of baseResource
	type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	exponent: 3,
	roundUpCost: true,
	gainMult() { // Calculate the multiplier for main currency from bonuses
		mult = new Decimal(1)
		if (hasUpgrade("mo", 16)) mult = mult.mul(3);
		if (hasChallenge("mo", 22)) mult = mult.mul(challengeEffect("mo", 22));
		mult = mult.mul(tmp.r.effect);
		mult = mult.mul(tmp.l.effect.mogain);
		return mult;
	},
	gainExp() { // Calculate the exponent on main currency from bonuses
		return new Decimal(1)
	},
	effect() {
		return player.mo.total.add(1).pow(2)
	},
	effectDescription() {
		return `boosting brick gain by ${format(this.effect())} (based on total mp)`
	},
	row: 2, // Row the layer is in on the tree (0 is the first row)
	hotkeys: [
		{key: "M", description: "shift+m: Reset for monopoly power", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	],
	layerShown(){return player.mo.unlocked||hasUpgrade("m", 15)},
	upgrades: {
		rows: 3,
		cols: 6,
		11: {
			title: "Corruptions",
			description: "Exponentiate ore gain (after the previous layers' boosts) based on total mp.",
			cost: 1,
			effect() {
				if (inChallenge("mo", 41)||inChallenge("mo", 42)) return new Decimal(0.2);
				return player.mo.total.min(inChallenge("mo", 42)?0:Decimal.pow(4, 4)).add(4).log(4).add(player.mo.total.add(40).log(40)).pow(0.2).pow(hasChallenge("mo", 41)?1.1:1).min(1.75).mul((player.mo.pollution&&hasUpgrade("mo", 25))?2:1)
			},
			effectDisplay() {
				return `^${format(this.effect(), 3)}`
			}
		},
		12: {
			title: "Monopoly Over Land",
			description: "Factories no longer make each other more expensive.",
			cost: 2
		},
		13: {
			title: "Rioting",
			description: "Corruptions boosts embers at a reduced rate.",
			cost: 20,
			effect() {
				return upgradeEffect("mo", 11).pow(hasChallenge("mo", 11)?0.15:0.1).div((player.mo.pollution&&hasUpgrade("mo", 25))?4:1);
			},
			effectDisplay() {
				return `x${format(this.effect())}`
			}
		},
		14: {
			title: "Perpetual Monopoly",
			description: "Improve the 5th milestone to gain 200%.",
			cost: 400
		},
		15: {
			title: "Monopoly Over Manufacturing",
			description: "Post-100 manufacturer scaling is 30% weaker.",
			cost: 10000
		},
		16: {
			title: "Eww Static Boosts",
			description: "Triple MP gain.",
			cost: 22222
		},
		21: {
			title: "Buildings of Horrendousness",
			description: "Unlock plastic structures.",
			cost: 50000,
			unlocked() {
				return hasChallenge("mo", 22)
			}
		},
		22: {
			title: "Landscape of Horrendousness",
			description: "Unlock pollutions.",
			cost: 500000,
			unlocked() {
				return hasChallenge("mo", 32)
			}
		},
		23: {
			title: "Monopoly Over Layers",
			description: "Unlock two new layers.",
			cost: 5000000,
			unlocked() {
				return hasChallenge("mo", 32)
			}
		},
		24: {
			title() {return hasUpgrade("l", 11)?"Ores <i>were</i> Trash":"Ores are Trash"},
			description() {return `${hasUpgrade("l", 11)?"Trees":"Waste"} boosts ore gain.`},
			cost: 2000,
			currencyDisplayName() {return hasUpgrade("l", 11)?"trees":"waste"},
			currencyLayer: "mo",
			currencyInternalName() {return hasUpgrade("l", 11)?"trees":"waste"},
			unlocked() {
				return player.mo.waste.gt(10)||hasUpgrade("mo", 24)||hasUpgrade("l", 11)
			},
			effect() {
				return player.mo[hasUpgrade("l", 11)?"trees":"waste"].add(1).pow(hasUpgrade("l", 11)?2000:1000);
			},
			effectDisplay() {
				return `x${format(this.effect())}`
			}
		},
		25: {
			title() {return hasUpgrade("l", 11)?"Clean Monopoly":"Polluted Monopoly"},
			description() {
				return hasUpgrade("l", 11)?"Clean Ocean boosts ore gain.":"<b>Corruptions</b> is 2x stronger in pollutions (but <b>Rioting</b> is quartered from phase Ⅱ onwards)."
			},
			cost() {return hasUpgrade("l", 11)?2000:100},
			currencyDisplayName() {return hasUpgrade("l", 11)?"clean ocean":"burning waste"},
			currencyLayer: "mo",
			currencyDisplayName() {return hasUpgrade("l", 11)?"ocean":"burningWaste"},
			unlocked() {
				return player.mo.burningWaste.gt(10)||hasUpgrade("mo", 25)||hasUpgrade("l", 11)
			},
			effect() {
				return hasUpgrade("l", 11)?player.mo.ocean.add(1).pow(2000):new Decimal(1)
			},
			effectDisplay() {
				return hasUpgrade("l", 11)?`x${format(this.effect())}`:undefined
			}
		},
		26: {
			title: "The Government is your competitor",
			description: "Unlock the final two competitor challenges.",
			cost: 100000000,
			unlocked() {
				return hasChallenge("mo", 32)
			}
		},
	},
	milestones: {
		0: {
			requirementDescription: "1 monopoly power",
			effectDescription: "Retain milestones on row 2 nodes.",
			done() {
				return player.mo.points.gte(1)
			},
			style: {
				width: "500px"
			}
		},
		1: {
			requirementDescription: "2 monopoly power",
			effectDescription: "Furnaces and Manufacturers reset nothing.",
			done() {
				return player.mo.points.gte(2)
			},
			style: {
				width: "500px"
			}
		},
		2: {
			requirementDescription: "3 monopoly power",
			effectDescription: "Retain upgrades from the previous layers.",
			done() {
				return player.mo.points.gte(3)
			},
			style: {
				width: "500px"
			}
		},
		3: {
			requirementDescription: "10 monopoly power",
			effectDescription: "Automate Factories, and non active manufacturers produce bricks at half the rate.",
			toggles: [["mo", "autoFac"]],
			done() {
				return player.mo.points.gte(10)
			},
			style: {
				width: "500px"
			}
		},
		4: {
			requirementDescription: "50 monopoly power",
			effectDescription: "Gain 10% of monopoly power gain per second.",
			done() {
				return player.mo.points.gte(50)
			},
			style: {
				width: "500px"
			}
		},
		5: {
			requirementDescription: "5e8 monopoly power",
			effectDescription: "The automator buys max factories.",
			done() {
				return player.mo.points.gte(5e8)
			},
			style: {
				width: "500px"
			}
		}
	},
	buyables: {
		rows: 4,
		cols: 3,
		11: {
			title: "Pollution: Phase Ⅰ",
			display() {
				if (player.mo.pollution == 11) return `The plastic has piled itself up into mountains, and hindering your extractor's progress. Square root extractor and ore gain, and <b>Depth</b> does nothing.<br>You have ${format(player.mo.buyables[11])} plastic pollutants, producing ${format(tmp.mo.buyables[11].effect)} waste per second.<br><br>Pollution: Phase Ⅰ is currently active. Click here to deactive this pollution and gain ${format(player.p.points.add(1).log(10).floor().max(player.mo.buyables[11]).sub(player.mo.buyables[11]))} plastic pollutants (log10(plastic)).`
				return this.canAfford()?`The plastic has piled itself up into mountains, and hindering your extractor's progress. Square root extractor and ore gain, and <b>Depth</b> does nothing.<br>You have ${format(player.mo.buyables[11])} plastic pollutants, producing ${format(tmp.mo.buyables[11].effect)} waste per second.`:"Please deactivate pollution in another phase before activating this pollution."
			},
			buy() {
				if (!player.mo.pollution) {
					player.mo.pollution = 11;
					doReset("mo", true);
				} else {
					player.mo.buyables[11] = player.p.points.add(1).log(10).floor().max(player.mo.buyables[11]);
					player.mo.pollution = 0;
				}
			},
			canAfford() {
				return (!player.mo.pollution)||player.mo.pollution == 11;
			},
			cost() {
				return new Decimal(0);
			},
			effect() {
				if (hasUpgrade("l", 11)) return new Decimal(0);
				var eff = player.mo.buyables[11];
				eff = eff.div(100).pow(0.5);
				eff = eff.mul(tmp.mo.wasteEffect.wasteBoost).mul(tmp.r.buyables[23].effect);
				return eff;
			},
			unlocked() {
				return !hasUpgrade("l", 11)
			}
		},
		12: {
			title: "Pollution: Phase Ⅱ",
			display() {
				if (player.mo.pollution == 12) return `To add to the previous pollution, the embers have burned through the plastic, and you they're autobuying their buyables without your command. Embers^0.5 divide plastic and ore gain.<br>You have ${format(player.mo.buyables[12])} incinerators, producing ${format(tmp.mo.buyables[12].effect)} burning waste per second.<br><br>Pollution: Phase Ⅱ is currently active. Click here to deactive this pollution and gain ${format(player.m.points.pow(0.5).floor().max(player.mo.buyables[12]).sub(player.mo.buyables[12]))} incinerators (√manufacturers).`
				return this.canAfford()?`To add to the previous pollution, the embers have burned through the plastic, and you they're autobuying their buyables without your command. Embers^0.5 divide plastic and ore gain.<br>You have ${format(player.mo.buyables[12])} incinerators, producing ${format(tmp.mo.buyables[12].effect)} burning waste per second.`:"Please deactivate pollution in another phase before activating this pollution."
			},
			buy() {
				if (!player.mo.pollution) {
					player.mo.pollution = 12;
					doReset("mo", true);
				} else {
					player.mo.buyables[12] = player.m.points.pow(0.5).floor().max(player.mo.buyables[12]);
					player.mo.pollution = 0;
				}
			},
			canAfford() {
				return (!player.mo.pollution)||player.mo.pollution == 12;
			},
			cost() {
				return new Decimal(0);
			},
			effect() {
				if (hasUpgrade("l", 11)) return new Decimal(0);
				var eff = player.mo.buyables[12];
				eff = eff.div(1000).pow(0.4);
				eff = eff.mul(tmp.mo.wasteEffect.burningWasteBoost).mul(tmp.r.buyables[23].effect).mul(hasUpgrade("ps", 14)?upgradeEffect("ps", 14).bWaste:1);
				return eff;
			},
			unlocked() {
				return !hasUpgrade("l", 11)
			}
		},
		13: {
			title: "Pollution: Phase Ⅲ",
			display() {
				if (player.mo.pollution == 13) return `To add to the previous pollution, global warming has gotten so bad that 99.999% of your extractors, plastic, bricks, and ores are melting every second.<br>You have ${format(player.mo.buyables[13])} chimneys, producing ${format(tmp.mo.buyables[13].effect)} greenhouse gases per second.<br><br>Pollution: Phase Ⅲ is currently active. Click here to deactive this pollution and gain ${format(player.ps.points.floor().max(player.mo.buyables[13]).sub(player.mo.buyables[13]))} chimneys (power stations).`
				return this.canAfford()?`To add to the previous pollution, global warming has gotten so bad that 99.999% of your extractors, plastic, bricks, and ores are melting every second.<br>You have ${format(player.mo.buyables[13])} chimneys, producing ${format(tmp.mo.buyables[13].effect)} greenhouse gases per second.`:"Please deactivate pollution in another phase before activating this pollution."
			},
			buy() {
				if (!player.mo.pollution) {
					player.mo.pollution = 13;
					doReset("mo", true);
				} else {
					player.mo.buyables[13] = player.ps.points.floor().max(player.mo.buyables[13]);
					player.mo.pollution = 0;
				}
			},
			canAfford() {
				return (!player.mo.pollution)||player.mo.pollution == 13;
			},
			cost() {
				return new Decimal(0);
			},
			effect() {
				if (hasUpgrade("l", 11)) return new Decimal(0);
				var eff = player.mo.buyables[13];
				eff = eff.pow(0.3).div(100).mul(tmp.r.buyables[23].effect);
				if (hasUpgrade("ps", 11)) eff = eff.mul(10);
				return eff;
			},
			unlocked() {
				return player.ps.unlocked&&!hasUpgrade("l", 11)
			}
		},
		31: {
			title: "Plastic Collectors",
			display() {
				return `Amount: ${format(player.mo.buyables[31])}<br>
				Clean ocean/s: ${format(tmp.mo.buyables[31].effect)}<br>
				Cost: ${format(tmp.mo.buyables[31].cost)} ores`
			},
			buy() {
				if (this.canAfford()) {
					player.points = player.points.sub(this.cost());
					player.mo.buyables[31] = player.mo.buyables[31].add(1);
				}
			},
			canAfford() {
				return player.points.gte(this.cost());
			},
			cost() {
				return Decimal.pow("1e1000", player.mo.buyables[31].add(player.mo.buyables[32]).div(1+hasUpgrade("l", 13)).pow(4-(hasUpgrade("l", 21)*0.5))).mul("1e10000000");
			},
			unlocked() {
				return hasUpgrade("l", 11)
			},
			effect() {
				if (!hasUpgrade("l", 11)) return new Decimal(0);
				return player.mo.buyables[31].pow(1.2).mul(tmp.mo.buyables[33].effect).mul(hasUpgrade("l", 12)?tmp.l.upgrades[12].effect.ocean:1)
			}
		},
		32: {
			title: "Mechanic Tree Planters",
			display() {
				return `Amount: ${format(player.mo.buyables[32])}<br>
				Trees/s: ${format(tmp.mo.buyables[32].effect)}<br>
				Cost: ${format(tmp.mo.buyables[32].cost)} ores`
			},
			buy() {
				if (this.canAfford()) {
					player.points = player.points.sub(this.cost());
					player.mo.buyables[32] = player.mo.buyables[32].add(1);
				}
			},
			canAfford() {
				return player.points.gte(this.cost());
			},
			cost() {
				return Decimal.pow("1e1000", player.mo.buyables[31].add(player.mo.buyables[32]).div(1+hasUpgrade("l", 13)).pow(4-(hasUpgrade("l", 21)*0.5))).mul("1e10000000");
			},
			unlocked() {
				return hasUpgrade("l", 11)
			},
			effect() {
				if (!hasUpgrade("l", 11)) return new Decimal(0);
				return player.mo.buyables[32].pow(1.2).mul(tmp.mo.buyables[33].effect).mul(hasUpgrade("l", 12)?tmp.l.upgrades[12].effect.tree:1)
			}
		},
		33: {
			title: "Restablisation",
			display() {
				return `Amount: ${format(player.mo.buyables[33])}<br>
				Effect: x${format(tmp.mo.buyables[33].effect)} boost to previous resources and +${format(tmp.mo.buyables[33].effect2)} happiness<br>
				Cost: ${format(tmp.mo.buyables[33].cost)} clean ocean<br>
				${format(tmp.mo.buyables[33].cost)} trees`
			},
			buy() {
				if (this.canAfford()) {
					player.mo.trees = player.mo.trees.sub(this.cost());
					player.mo.ocean = player.mo.ocean.sub(this.cost());
					player.mo.buyables[33] = player.mo.buyables[33].add(1);
				}
			},
			canAfford() {
				return player.mo.trees.gte(this.cost())&&player.mo.ocean.gte(this.cost());
			},
			cost() {
				return Decimal.pow(10, player.mo.buyables[33].div(1+hasUpgrade("l", 13)).pow(1.3)).mul(100);
			},
			unlocked() {
				return hasUpgrade("l", 11)
			},
			effect() {
				if (!hasUpgrade("l", 11)) return new Decimal(0);
				return Decimal.pow(2+hasUpgrade("l", 13), player.mo.buyables[33]);
			},
			effect2() {
				if (!hasUpgrade("l", 11)) return new Decimal(0);
				var base = new Decimal(0.2);
				base = base.add(tmp.mo.wasteEffect.rest);
				return player.mo.buyables[33].mul(base)
			}
		},
		41: {
			title: "Air Filter",
			display() {
				return `Amount: ${format(player.mo.buyables[41])}<br>
				Clean air/s: ${format(tmp.mo.buyables[41].effect)}<br>
				Cost: ${format(tmp.mo.buyables[41].cost.furnace)} furnaces
				${format(tmp.mo.buyables[41].cost.trees)} trees`
			},
			buy() {
				if (this.canAfford()) {
					player.f.points = player.f.points.sub(this.cost().furnace);
					player.mo.trees = player.mo.trees.sub(this.cost().trees);
					player.mo.buyables[41] = player.mo.buyables[41].add(1);
				}
			},
			canAfford() {
				return player.f.points.gte(this.cost().furnace)&&player.mo.trees.gte(this.cost().trees);
			},
			cost() {
				return {
					furnace: Decimal.pow(2.5, player.mo.buyables[41].div(1+hasUpgrade("l", 13)).mul(2).pow(0.7)).mul(1000),
					trees: Decimal.pow(3, player.mo.buyables[41].div(1+hasUpgrade("l", 13)).mul(2).pow(0.8)).mul(10000)
				}
			},
			unlocked() {
				return tmp.l.buyables[11].unlocks >= 1;
			},
			effect() {
				if (!hasUpgrade("l", 11)) return new Decimal(0);
				return player.mo.buyables[41].pow(1.2)
			}
		},
		respec() {
			player.mo.buyables[31] = new Decimal(0);
			player.mo.buyables[32] = new Decimal(0);
			player.mo.ocean = player.mo.ocean.div(4);
			player.mo.trees = player.mo.trees.div(4);
			doReset("mo", true);
		},
		showRespec() {
			return hasUpgrade("l", 11)
		},
		respecConfirm: "Are you sure you want to respec? This will force a monopoly reset and quarter the amount of clean ocean and trees!"
	},
	challenges: {
		rows: 4,
		cols: 2,
		11: {
			name: "The Ice Factory Ⅰ",
			challengeDescription: "The Ice Factory has just won a lawsuit against your factory. No more embers!",
			goal: new Decimal("1e32500"),
			rewardDescription: "<b>Rioting</b> is more effective.",
			currencyDisplayName: "ores",
			currencyInternalName: "points"
		},
		12: {
			name: "The Ice Factory Ⅱ",
			challengeDescription: "More lawsuits: No more furnaces!",
			goal: new Decimal("1e5000"),
			rewardDescription: "Ember Speed's base is 10 times larger.",
			currencyDisplayName: "ores",
			currencyInternalName: "points"
		},
		21: {
			name: "The Spacious Factory Ⅰ",
			challengeDescription: "You come to find your space for factories taken by a competitor. <b>Monopoly Over Land</b> is disabled, and you can buy a maximum of 100 factories.",
			goal: new Decimal("1e55555"),
			rewardDescription() {
				return `Factories are cheaper based on your mp.`;
			},
			rewardEffect() {
				return player.mo.points.add(1).pow(0.3)
			},
			currencyDisplayName: "ores",
			currencyInternalName: "points"
		},
		22: {
			name: "The Spacious Factory Ⅱ",
			challengeDescription: "They've gotten even stronger, and you can only build a total of 20 factories, and this does not reset on respec. Nullify the previous challenge's effect, and multiplies factory costs by 1e9.",
			goal: new Decimal("1e41750"),
			rewardDescription() {
				return `Unlock more upgrades, and gain more MP based on total competitor challenge completions.`;
			},
			rewardEffect() {
				let t = 0;
				for (var e in player.mo.challenges) {
					t += Number(player.mo.challenges[e]);
				}
				return Decimal.pow(1.5, t);
			},
			currencyDisplayName: "ores",
			currencyInternalName: "points"
		},
		31: {
			name: "The Upgrade Factory Ⅰ",
			challengeDescription: "You can buy a total of only 20 upgrades across the previous nodes. Make sure your upgrades provide huge boosts!",
			goal: new Decimal("1e45000"),
			rewardDescription: "Multiply ore gain based on MP.",
			rewardEffect() {
				return player.mo.points.add(1).pow(50);
			},
			currencyDisplayName: "ores",
			currencyInternalName: "points"
		},
		32: {
			name: "The Upgrade Factory Ⅱ",
			challengeDescription: "Multiply ore gain by 1e400, but you cannot buy any upgrades past row 1 of any layer.",
			goal: new Decimal("1e6000"),
			rewardDescription: "Unlock more monopoly upgrades.",
			currencyDisplayName: "ores",
			currencyInternalName: "points"
		},
		41: {
			name: "Anti-factoree Ⅰ",
			challengeDescription: "The government has stepped in. <b>Corruptions</b> exponent is always 0.2.",
			goal: new Decimal("1e22400"),
			rewardDescription: "Raise <b>Corruptions</b> to the 1.1th power.",
			currencyDisplayName: "ores",
			currencyInternalName: "points",
			unlocked() {
				return hasUpgrade("mo", 26)
			}
		},
		42: {
			name: "Anti-factoree Ⅱ",
			challengeDescription: "In a last bid to stop you, all softcaps and scaling are set to start at 0.",
			goal: new Decimal("1e21000"),
			rewardDescription: "Make research point gain significantly better.",
			currencyDisplayName: "ores",
			currencyInternalName: "points",
			unlocked() {
				return hasUpgrade("mo", 26)
			}
		},
	},
	branches: ["m"],
	tabFormat: {
		"Main": {
			content: ["main-display", "prestige-button", "resource-display", "milestones", ["raw-html", "<br>"],
			["column", [["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13]]],
			["row", [["upgrade", 14], ["upgrade", 15], ["upgrade", 16]]],
			["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23]]],
			["row", [["upgrade", 24], ["upgrade", 25], ["upgrade", 26]]]]]],
			shouldNotify() {return tmp.mo.shouldNotify}
		},
		"Competitors": {
			content: ["main-display", "prestige-button", "resource-display", ["raw-html", "<br><br><h1>Competitors</h1><br>Wait, they still exist?"], "challenges"],
			unlocked() {return player.mo.total.gte(250)}
		},
		"Pollutions": {
			content: ["main-display", "prestige-button", "resource-display", ["raw-html", _=> {
				return `<h2>Pollutions</h2><br>You have ${format(player.mo.waste)} waste, boosting plastic gain by ${format(tmp.mo.wasteEffect.plasticBoost)} and making manufacturers cheaper by /${format(tmp.mo.wasteEffect.manuCheap)}.<br><br>
				You have ${format(player.mo.burningWaste)} burning waste, boosting waste gain by ${format(tmp.mo.wasteEffect.wasteBoost)}.<br>
				${player.ps.unlocked?`You have ${format(player.mo.greenhouse)} greenhouse gas, boosting burning waste gain by ${format(tmp.mo.wasteEffect.burningWasteBoost)}, and raising all waste effects to ^${format(tmp.mo.wasteEffect.wasteExponent)}.`:""}<br><br><h2>Pollutions</h2>`
			}], "buyables"],
			unlocked() {return hasUpgrade("mo", 22)&&!hasUpgrade("l", 11)}
		},
		"Anti-Pollutions": {
			content: ["main-display", "prestige-button", "resource-display", ["raw-html", _=> {
				return `<br><h2><s>Pollutions</s> &nbsp; Anti-Pollutions</h2><br><br>
				You have ${format(player.mo.ocean)} clean ocean, making manufacturers cheaper by /${format(tmp.mo.wasteEffect.manuCheap2)}, making factories cheaper by /${format(tmp.mo.wasteEffect.facCheap)}, and making factories act as if there were x${format(tmp.mo.wasteEffect.facMul)} of them (unaffected by softcap)<br><br>
				You have ${format(player.mo.trees)} trees, making power stations cheaper by /${format(tmp.mo.wasteEffect.powerCheap)}, making their buyables cheaper by /${format(tmp.mo.wasteEffect.voltCheap)}, and boosting research point gain by x${format(tmp.mo.wasteEffect.research)}.<br><br>
				${player.ps.unlocked?`You have ${format(player.mo.air)} clean air, boosting burning ore to metal conversion by ^${format(tmp.mo.wasteEffect.metalGain)}, ${tmp.l.buyables[11].unlocks2 >= 1?`and `:""}boosting the first 2 boosts that previous resources give by ^${format(tmp.mo.wasteEffect.antiExponent)}${tmp.l.buyables[11].unlocks2 >= 1?`, and making each restablisation give +${format(tmp.mo.wasteEffect.rest)} happiness`:""}.`:""}`
			}], "buyables"],
			unlocked() {return hasUpgrade("mo", 22)&&hasUpgrade("l", 11)}
		}
	},
	automate() {
		if (player.mo.autoFac&&(!inChallenge("mo", 21))&&(!inChallenge("mo", 22))&&hasUpgrade("m", 13)&&(player.mo.ltime>4)) {
			if (player.mo.milestones.includes("5")) {
				for (var i = 11; i <= 13; i++) {
					layers.m.buyables[i].buyMax();
				}
			} else {
				for (var i = 11; i <= 13; i++) {
					for (var j = 0; j < 100; j++) {layers.m.buyables[i].buy();}
				}
			}
		}
		player.mo.ltime++;
	},
	wasteEffect() {
		return {
			plasticBoost: hasUpgrade("l", 11)?new Decimal(1):player.mo.waste.pow(500).add(1).pow(tmp.mo.wasteEffect.wasteExponent),
			manuCheap: hasUpgrade("l", 11)?new Decimal(1):player.mo.waste.pow(2000).add(1).pow(tmp.mo.wasteEffect.wasteExponent),
			wasteBoost: hasUpgrade("l", 11)?new Decimal(1):player.mo.burningWaste.add(1).pow(0.5),
			electricBoost: hasUpgrade("l", 11)?new Decimal(1):player.mo.burningWaste.add(1.2).log(1.2),
			burningWasteBoost: hasUpgrade("l", 11)?new Decimal(1):player.mo.greenhouse.add(1).pow(0.75),
			wasteExponent: hasUpgrade("l", 11)?new Decimal(1):player.mo.greenhouse.add(20).log(20),
			manuCheap2: player.mo.ocean.pow(40000).add(1).pow(tmp.mo.wasteEffect.antiExponent),
			facCheap: player.mo.ocean.add(1).pow(40).pow(tmp.mo.wasteEffect.antiExponent),
			facMul: player.mo.ocean.add(1).pow(0.1),
			powerCheap: player.mo.trees.pow(40000).add(1).pow(tmp.mo.wasteEffect.antiExponent),
			voltCheap: player.mo.trees.add(1).pow(5).pow(tmp.mo.wasteEffect.antiExponent),
			research: player.mo.trees.pow(0.5).add(1),
			metalGain: player.mo.air.add(1).pow(0.3),
			antiExponent: player.mo.air.add(1).pow(0.10314159265358979),
			rest: tmp.l.buyables[11].unlocks2 >= 1?player.mo.air.add(1).log(1000).pow(0.3).div(10):new Decimal(0)
		}
	},
	doReset(resettingLayer) {
		var resta = player.mo.buyables[33];
		var keep = [];
		if (player.l.milestones.includes("0")||player.d.milestones.includes("0")) keep.push("milestones", "autoFac");
		if (player.l.milestones.includes("1")||player.d.milestones.includes("1")) keep.push("upgrades", "challenges");
		if (layers[resettingLayer].row > this.row) {
			layerDataReset("mo", keep);
			console.log(layers[resettingLayer].row);
		}
		if (hasUpgrade("l", 14)) player.mo.buyables[33] = resta;
		if (!player.l.milestones.includes("1")) player.subtabs.mo.mainTabs = "Main";
	},
	resetsNothing: false,
	update(diff) {
		if (player.mo.milestones.includes("4")&&!player.mo.activeChallenge) addPoints("mo", tmp.mo.resetGain.mul(hasUpgrade("mo", 14)?2:0.1).mul(diff));
		player.mo.waste = player.mo.waste.add(tmp.mo.buyables[11].effect.mul(diff));
		player.mo.burningWaste = player.mo.burningWaste.add(tmp.mo.buyables[12].effect.mul(diff));
		player.mo.greenhouse = player.mo.greenhouse.add(tmp.mo.buyables[13].effect.mul(diff));
		player.mo.ocean = player.mo.ocean.add(tmp.mo.buyables[31].effect.mul(diff));
		player.mo.trees = player.mo.trees.add(tmp.mo.buyables[32].effect.mul(diff));
		player.mo.air = player.mo.air.add(tmp.mo.buyables[41].effect.mul(diff));
		if (inChallenge("mo", 31)&&!player.mo.chall31TestValue) {
			doReset("mo", true);
			player.e.upgrades = [];
			player.f.upgrades = [];
			player.p.upgrades = [];
			player.m.upgrades = [];
			player.subtabs.m.mainTabs = "Main";
			player.subtabs.e.mainTabs = "Main";
			player.subtabs.f.mainTabs = "Main";
			player.mo.chall31TestValue = true;
			player.mo.activeChallenge = 31;
		} else if (!inChallenge("mo", 31)&&player.mo.chall31TestValue) {
			player.mo.chall31TestValue = false;
		}
		if (inChallenge("mo", 32)&&!player.mo.chall32TestValue) {
			doReset("mo", true);
			player.e.upgrades = [];
			player.f.upgrades = [];
			player.p.upgrades = [];
			player.m.upgrades = [];
			player.subtabs.m.mainTabs = "Main";
			player.subtabs.e.mainTabs = "Main";
			player.subtabs.f.mainTabs = "Main";
			player.mo.chall32TestValue = true;
			player.mo.activeChallenge = 32;
		} else if (!inChallenge("mo", 32)&&player.mo.chall32TestValue) {
			player.mo.chall32TestValue = false;
		}
		if (player.mo.pollution > 12) {
			player.e.points = player.e.points.div(Decimal.pow(100000, diff));
			player.p.points = player.p.points.div(Decimal.pow(100000, diff));
			player.m.bricks = player.m.bricks.div(Decimal.pow(100000, diff));
			player.points = player.points.div(Decimal.pow(100000, diff));
		}
	}
})