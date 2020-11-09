var testNumber = 0;
addLayer("f", {
		name: "furnace", // This is optional, only used in a few places, If absent it just uses the layer id.
		symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
		position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
		startData() { return {
			unlocked: false,
			points: new Decimal(0),
			allocated: new Decimal(0),
			metals: new Decimal(0),
			embers: new Decimal(0),
			flame: new Decimal(0)
		}},
		color: "#666666",
		requires: new Decimal(3e9), // Can be a function that takes requirement increases into account
		resource: "furnaces", // Name of prestige currency
		baseResource: "ores", // Name of resource prestige is based on
		baseAmount() {return player.points}, // Get the current amount of baseResource
		type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
		base() {
			return player.f.points.sub(30).max(0).pow(hasUpgrade("f", 51)?0.2:0.5).add(3)
		},
		exponent: 1.5,
		gainMult() { // Calculate the multiplier for main currency from bonuses
			mult = new Decimal(1)
			if (hasUpgrade("f", 12)) mult = mult.div(upgradeEffect("f", 12));
			if (hasUpgrade("f", 54)) mult = mult.div(upgradeEffect("f", 54));
			return mult
		},
		gainExp() { // Calculate the exponent on main currency from bonuses
			return Decimal.div(1, player.f.points.sub(4).max(1)).pow(0.1)
		},
		row: 0, // Row the layer is in on the tree (0 is the first row)
		upgrades: {
			rows: 6,
			cols: 4,
			11: {
				title: "181",
				description: `Gain x% of extractor gain on prestige per second where x is based on your active furnaces.`,
				cost: 9,
				unlocked() {
					return player.e.milestones.includes("1")
				},
				effect() {
					return Decimal.pow(1.3, player.f.allocated).mul(2).sub(2).min(100000)
				},
				effectDisplay() {
					return `${format(this.effect())}%`
				}
			},
			12: {
				title: "Bribed furnaces",
				description: `Furnaces are cheaper based on metals.`,
				cost: 10,
				unlocked() {
					return player.e.milestones.includes("1")
				},
				effect() {
					return player.f.metals.add(1).pow(hasUpgrade("f", 14)?0.45:0.2)
				},
				effectDisplay() {
					return `/${format(this.effect())}`
				}
			},
			21: {
				title: "Hot",
				description: `Capture embers produced by furnaces.`,
				cost: 15,
				unlocked() {
					return player.e.milestones.includes("1")
				},
				effect() {
					var embergain = player.f.points.mul(100).mul(buyableEffect("f", 11)).mul(buyableEffect("f", 12)).mul(player.e.oil.add(2).log(2))
					if (hasUpgrade("f", 22)) embergain = embergain.mul(upgradeEffect("f", 22));
					if (hasUpgrade("f", 32)) embergain = embergain.mul(100);
					if (hasUpgrade("e", 33)) embergain = embergain.mul(upgradeEffect("e", 33));
					embergain = embergain.pow(buyableEffect("f", 14))
					embergain = embergain.mul(tmp.m.effect.sqrt());
					return embergain;
				},
				effectDisplay() {
					return `${format(this.effect())} fiery embers/s`
				}
			},
			22: {
				title: "Lava",
				description: `Ember gain multiplied by extractors.`,
				cost: 25,
				unlocked() {
					return getBuyableAmount("f", 11).gte(5)||hasUpgrade("m", 11)
				},
				effect() {
					return player.e.points.add(6).log(6)
				}
			},
			13: {
				title: "Forgery",
				description: `Multiply metal gain by embers.`,
				cost: 90,
				unlocked() {
					return player.m.milestones.includes("0")
				},
				effect() {
					return player.f.embers.add(1).pow(0.3)
				}
			},
			23: {
				title: "Point Acceleration",
				description: "Multiply Point Speed base by 1e5.",
				cost: 101,
				unlocked() {
					return player.m.milestones.includes("0")
				}
			},
			14: {
				title: "Laundered furnaces",
				description: `Bribed furnaces has a better effect formula.`,
				cost: 109,
				unlocked() {
					return player.m.milestones.includes("3")
				}
			},
			24: {
				title: "Point Jerk",
				description: "Point Acceleration is stronger based on furnaces.",
				cost: 121,
				unlocked() {
					return player.m.milestones.includes("3")
				},
				effect() {
					return player.f.points.add(1)
				}
			},
			51: {
				title: "Evaded furnaces",
				description: "Furnace cost scaling base scales better.",
				cost: 124,
				unlocked() {
					return player.m.milestones.includes("3")
				}
			},
			52: {
				title: "Furnace Fire Pure Teal",
				description: "Metal gain softcap starts 12 later, and multiply extractor gain by furnaces.",
				cost: 157,
				unlocked() {
					return player.m.milestones.includes("3")
				},
				effect() {
					return Decimal.pow(2, player.f.points)
				}
			},
			53: {
				title: "Powerful furnaces",
				description: "Gain free flame levels from furnaces.",
				cost: 170,
				unlocked() {
					return player.m.milestones.includes("3")
				},
				effect() {
					return player.f.points.pow(0.25).floor()
				},
				effectDisplay() {
					return `+${this.effect()}`
				}
			},
			54: {
				title: "Timewall gaming",
				description: "Divide furnace cost based on time spent in manufacturer reset.",
				cost: 200,
				unlocked() {
					return player.m.milestones.includes("3")
				},
				effect() {
					return Decimal.pow(10, player.e.layerticks).min("1e2000")
				},
				effectDisplay() {
					return `/${format(this.effect())}`
				}
			},
			31: {
				title: "Flamier Flames",
				description: "Flames effect is stronger.",
				cost: 3,
				unlocked() {
					return player.f.flame.gt(1)||hasUpgrade("f", 31)||hasUpgrade("f",  32)
				},
				currencyDisplayName: "flame",
				currencyInternalName() {
					return "flame"
				},
				currencyLayer() {
					return "f"
				},
				style() {
					return {backgroundColor: hasUpgrade("f", 31)?"#77bf5f":(player.f.flame.gte(3)?"#ff6600":"bf8f8f")}
				}
			},
			32: {
				title: "Boost. Just Boost.",
				description: "Ember gain times 100.",
				cost: 3,
				unlocked() {
					return player.f.flame.gt(1)||hasUpgrade("f", 31)||hasUpgrade("f",  32)
				},
				currencyDisplayName: "flame",
				currencyInternalName() {
					return "flame"
				},
				currencyLayer() {
					return "f"
				},
				style() {
					return {backgroundColor: hasUpgrade("f", 32)?"#77bf5f":(player.f.flame.gte(3)?"#ff6600":"bf8f8f")}
				}
			},
			41: {
				title: "Oxygenator",
				description: "Flames cost scaling is weaker.",
				cost: 4,
				unlocked() {
					return hasUpgrade("f", 31)&&hasUpgrade("f", 32)
				},
				currencyDisplayName: "flame",
				currencyInternalName() {
					return "flame"
				},
				currencyLayer() {
					return "f"
				},
				style() {
					return {backgroundColor: hasUpgrade("f", 41)?"#77bf5f":(player.f.flame.gte(4)?"#ff6600":"bf8f8f")}
				}
			},
			42: {
				title: "Ember boost boost",
				description: "Multiply the base of ember boost by 1.1.",
				cost: 7,
				unlocked() {
					return hasUpgrade("f", 31)&&hasUpgrade("f", 32)
				},
				currencyDisplayName: "flame",
				currencyInternalName() {
					return "flame"
				},
				currencyLayer() {
					return "f"
				},
				style() {
					return {backgroundColor: hasUpgrade("f", 42)?"#77bf5f":(player.f.flame.gte(7)?"#ff6600":"bf8f8f")}
				}
			},
			33: {
				title: "Bribed, uh, flames?",
				description: "Embers divide flame cost.",
				cost: 9,
				unlocked() {
					return hasUpgrade("f", 41)&&hasUpgrade("f", 42)
				},
				effect() {
					return player.f.embers.add(1).pow(0.25)
				},
				effectDisplay() {
					return `/${format(this.effect())}`
				},
				currencyDisplayName: "flame",
				currencyInternalName() {
					return "flame"
				},
				currencyLayer() {
					return "f"
				},
				style() {
					return {backgroundColor: hasUpgrade("f", 33)?"#77bf5f":(player.f.flame.gte(9)?"#ff6600":"bf8f8f")}
				}
			},
			43: {
				title: "Extra Flame",
				description: "Gain 4 extra flame levels.",
				cost: 10,
				unlocked() {
					return hasUpgrade("f", 41)&&hasUpgrade("f", 42)
				},
				currencyDisplayName: "flame",
				currencyInternalName() {
					return "flame"
				},
				currencyLayer() {
					return "f"
				},
				style() {
					return {backgroundColor: hasUpgrade("f", 43)?"#77bf5f":(player.f.flame.gte(10)?"#ff6600":"bf8f8f")}
				}
			},
			34: {
				title: "Even Flamier",
				description: "Flame also divide final buyable cost at an increased rate, and all cost scalings scale better.",
				cost: 17,
				unlocked() {
					return player.m.milestones.includes("3")
				},
				effect() {
					return Decimal.pow(2, layers.f.flameEffect().recip()).recip().pow(6)
				},
				effectDisplay() {
					return `/${format(this.effect().recip())}`
				},
				style() {
					return {backgroundColor: hasUpgrade("f", 34)?"#77bf5f":(player.f.flame.gte(17)?"#ff6600":"bf8f8f")}
				}
			},
			44: {
				title: "Extracting Flames",
				description: "Flame also make extractor levels cheaper.",
				cost: 21,
				unlocked() {
					return player.m.milestones.includes("3")
				},
				style() {
					return {backgroundColor: hasUpgrade("f", 44)?"#77bf5f":(player.f.flame.gte(17)?"#ff6600":"bf8f8f")}
				}
			}
		},
		milestones: {
			0: {
				requirementDescription: "1 furnace",
				effectDescription: "Unlock second row of extractor upgrades.",
				done() {
					return player.f.points.gte(1)
				},
				style: {
					width: "300px"
				}
			},
			1: {
				requirementDescription: "20 furnaces",
				effectDescription: "Unlock third row of extractor upgrades.",
				done() {
					return player.f.points.gte(20)
				},
				unlocked() {
					return hasUpgrade("f", 21)
				},
				style: {
					width: "300px"
				}
			}
		},
		buyables: {
			rows: 1,
			cols: 4,
			11: {
				title: "Ember boost",
				display() {
					return `<br><br><h3>Boost ember gain.</h3><br>
					<h2>Currently:</h2><h3> ${`${format(getBuyableAmount("f", 11), 0)}${getBuyableAmount("f", 12).eq(0)?
					"":
					`+${format(getBuyableAmount("f", 12).mul(1.5).add(getBuyableAmount("f", 13).mul(2)).add(player.e.burnEffect.add(2).log(2).log(3).floor()))}`}`}</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} fiery embers</h3>
					<h2>Effect:</h2><h3> x${format(this.effect())}</h3>`
				},
				cost() {
					return Decimal.pow(4, getBuyableAmount("f", 11).sub(50).max(0).pow(hasUpgrade("f", 34)?2:3).div(hasUpgrade("f", 34)?5:3).add(getBuyableAmount("f", 11).pow(hasUpgrade("f", 34)?1.5:2).div(hasUpgrade("f", 34)?6:4).add(getBuyableAmount("f", 11)).mul(layers.f.flameEffect()))).mul(100).mul(hasUpgrade("f", 34)?upgradeEffect("f", 34):1)
				},
				buy() {
					if (this.canAfford()) {
						player.f.embers = player.f.embers.sub(this.cost())
						setBuyableAmount("f", 11, getBuyableAmount("f", 11).add(1))
					}
				},
				effect() {
					return Decimal.pow(Decimal.mul(1.5, hasUpgrade("f", 42)?1.1:1), getBuyableAmount("f", 11).add(getBuyableAmount("f", 12).mul(1.5).add(getBuyableAmount("f", 13).mul(2).add(player.e.burnEffect.add(2).log(2).log(3).floor()))))
				},
				canAfford() {
					return player.f.embers.gte(this.cost())
				},
				style() {
					return {backgroundColor: this.canAfford()?"#ff4400":"bf8f8f"}
				}
			},
			12: {
				title: "Ember speed",
				display() {
					return `<br><br><h3>Boost ember gain, and gives extra levels to the previous upgrade.</h3><br>
					<h2>Currently:</h2><h3> ${`${format(getBuyableAmount("f", 12), 0)}${getBuyableAmount("f", 13).eq(0)?
					"":
					`+${format(getBuyableAmount("f", 13).mul(0.25).add(player.e.burnEffect.add(2).log(2).log(3).floor()))}`}`}</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} fiery embers</h3>
					<h2>Effect:</h2><h3> x${format(this.effect())}</h3>`
				},
				cost() {
					return Decimal.pow(11.5, getBuyableAmount("f", 12).pow(hasUpgrade("f", 34)?2.4:4).div(10).add(getBuyableAmount("f", 12)).mul(layers.f.flameEffect())).mul(10000).mul(hasUpgrade("f", 34)?upgradeEffect("f", 34):1)
				},
				buy() {
					if (this.canAfford()) {
						player.f.embers = player.f.embers.sub(this.cost())
						setBuyableAmount("f", 12, getBuyableAmount("f", 12).add(1))
					}
				},
				effect() {
					return Decimal.pow(2, getBuyableAmount("f", 12).add(getBuyableAmount("f", 13).mul(0.25).add(player.e.burnEffect.add(2).log(2).log(3).floor())))
				},
				canAfford() {
					return player.f.embers.gte(this.cost())
				},
				style() {
					return {backgroundColor: this.canAfford()?"#ff4400":"bf8f8f"}
				}
			},
			13: {
				title: "Point speed",
				display() {
					return `<br><br><h3>Boost point gain, and gives extra levels to the previous upgrades.</h3><br>
					<h2>Currently:</h2><h3> ${format(getBuyableAmount("f", 13), 0)}${player.e.burnEffect.add(2).log(2).log(3).floor().gt(0)?`+${format(player.e.burnEffect.add(2).log(2).log(3).floor())}`:""}</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} fiery embers</h3>
					<h2>Effect:</h2><h3> ${format(this.effect())}</h3>`
				},
				cost() {
					return Decimal.pow(10, getBuyableAmount("f", 13).sub(hasUpgrade("f", 34)?15:10).max(0).pow(hasUpgrade("f", 34)?2.6:4.5).add(getBuyableAmount("f", 13).pow(hasUpgrade("f", 34)?1.8:3).div(hasUpgrade("f", 34)?8:5).add(getBuyableAmount("f", 13)).mul(layers.f.flameEffect()))).mul(500000).mul(hasUpgrade("f", 34)?upgradeEffect("f", 34):1)
				},
				buy() {
					if (this.canAfford()) {
						player.f.embers = player.f.embers.sub(this.cost())
						setBuyableAmount("f", 13, getBuyableAmount("f", 13).add(1))
					}
				},
				effect() {
					var mult = new Decimal(hasUpgrade("f", 23)?1e5:1);
					if (hasUpgrade("f", 23) && hasUpgrade("f", 24)) mult = mult.mul(upgradeEffect("f", 24));
					return Decimal.pow(mult.mul(1e25), getBuyableAmount("f", 13).add(player.e.burnEffect.add(2).log(2).log(3).floor()))
				},
				canAfford() {
					return player.f.embers.gte(this.cost())
				},
				style() {
					return {backgroundColor: this.canAfford()?"#ff4400":"bf8f8f"}
				}
			},
			14: {
				title: "Ember Derivatives",
				display() {
					return `<br><br><h3>Raise Ember gain to an exponent.</h3><br>
					<h2>Currently:</h2><h3> ${format(getBuyableAmount("f", 14), 0)}</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} fiery embers</h3>
					<h2>Effect:</h2><h3> ^${format(this.effect())}</h3>`
				},
				cost() {
					return Decimal.pow(getBuyableAmount("f", 14).add(1).pow(0.5).add(19), getBuyableAmount("f", 14).pow(3).mul(layers.f.flameEffect())).mul(1e250).mul(hasUpgrade("f", 34)?upgradeEffect("f", 34):1)
				},
				buy() {
					if (this.canAfford()) {
						player.f.embers = player.f.embers.sub(this.cost())
						setBuyableAmount("f", 14, getBuyableAmount("f", 14).add(1))
					}
				},
				effect() {
					return getBuyableAmount("f", 14).mul(0.05).add(1)
				},
				canAfford() {
					return player.f.embers.gte(this.cost())
				},
				style() {
					return {backgroundColor: this.canAfford()?"#ff4400":"bf8f8f"}
				},
				unlocked() {
					return hasUpgrade("p", 14)
				}
			},
		},
		clickables: {
			rows: 1,
			cols: 1,
			showMasterButton() {
				return false
			},
			11: {
				display() {
					return `<span>Gain <b>1</b> flame.<br>
					${format(player.f.embers)}/${format(this.cost())} fiery embers</span>`
				},
				canClick() {
					return player.f.embers.gte(this.cost())
				},
				onClick() {
					if (player.f.embers.gte(this.cost())) {
						player.f.embers = player.f.embers.sub(this.cost());
						player.f.flame = player.f.flame.add(1);
						//if (layers.f.hotkeys.)
					}
				},
				cost() {
					return Decimal.pow(20, player.f.flame.pow(2).div(hasUpgrade("f", 41)?4:2)).mul(5e8).div(hasUpgrade("f", 33)?upgradeEffect("f", 33):1)
				},
				style(){
					return {
						height: "120px",
						width: "180px",
						borderRadius: "25%",
						border: "4px solid",
						borderColor: "rgba(0, 0, 0, 0.125)",
						backgroundColor: this.canClick()?"#ff6600":"#bf8f8f",
						font: "400 13.3333px Arial"
					}
				},
				unlocked() {
					return (player.f.embers.gt(500000000)||player.f.flame.gt(0)||(player.f.upgrades.length > 4))
				}
			}
		},
		hotkeys: [{key: "f", description: "f: Reset for furnaces", onPress(){if (canReset(this.layer)) doReset(this.layer)}}],
		layerShown(){return player.e.milestones.includes("0")||layers.m.layerShown()},
		tabFormat: {
			"Main": {
				content: ["main-display",
				"prestige-button", "milestones",
				["raw-html", function () {
				return player.f.points.gte(1) ? `You have ${format(player.f.metals)} metals.
				<br><br>
				You have ${player.f.allocated} active furnaces.
				<br><br>
				Use the below slider to change active furnaces.
				<br><br>
				<input oninput="player.f.allocated = new Decimal(this.value)" type="range" min="0" max="${player.f.points}" step="1" style="width: 30em" value="${player.f.allocated}">
				<br>You lose a certain amount of ores per second, but your furnaces convert them into metals. 
				Your points are divided by ${format(Decimal.pow(hasUpgrade("e", 42)?1.001:1.1, player.f.allocated))} per second, but for every point you lose you gain ${format(getBuyableAmount("m", 11).gte(5)?Decimal.pow(1.4, player.f.allocated.min(2000)).mul(player.f.allocated.sub(1999).max(1).pow(2.5)).mul(0.003).mul(hasUpgrade("f", 13)?upgradeEffect("f", 13):1):Decimal.pow(2, player.f.allocated.min(hasUpgrade("f", 52)?28:16)).mul(Decimal.pow(1.2, player.f.allocated.sub(hasUpgrade("f", 52)?28:16).min(hasUpgrade("f", 52)?28:16).max(0))).mul(Decimal.pow(player.f.allocated.sub(hasUpgrade("f", 52)?56:32).max(1), 0.3)).mul(0.003).mul(hasUpgrade("f", 13)?upgradeEffect("f", 13):1))} metals.
				<br>` : ""
				}]]
			},
			"Upgrades": {
				content: ["main-display", "prestige-button", ["column", [["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14]]]]], ["column", [["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24]]]]], ["column", [["row", [["upgrade", 51], ["upgrade", 52], ["upgrade", 53], ["upgrade", 54]]]]]],
				unlocked() {
					return player.e.milestones.includes("1")
				}
			},
			"Embers": {
				content: ["main-display", "prestige-button",
				["raw-html", function () {
				return `<br>
				<span>You have </span><h2 style="color: #ff4400; text-shadow: 0px 0px 10px #ff4400;">${format(player.f.embers)}</h2><span> fiery embers.</span>
				<br>
				<span>(${format(upgradeEffect("f", 21))}/s)</span>`
				}],
				"buyables", ["raw-html", function () {
				return (player.f.embers.gt(500000000)||player.f.flame.gt(0))?`<br>
				<span>You have </span><h2 style="color: #ff6600; text-shadow: 0px 0px 10px #ff6600;">${format(player.f.flame, 0)}</h2>${layers.f.extraFlame().gt(0)?`<h3> + </h3><h2 style="color: #ff6600; text-shadow: 0px 0px 7px #ff6600;">${layers.f.extraFlame()}</h2>`:""}<span> flame, making the cost exponent of all ember upgrades divided by ${format(Decimal.div(1, layers.f.flameEffect()))}.
				<br><br>`:""}],"clickables",
				["column", [["row", [["upgrade", 31], ["upgrade", 32], ["upgrade", 33], ["upgrade", 34]]]]], ["column", [["row", [["upgrade", 41], ["upgrade", 42], ["upgrade", 43], ["upgrade", 44]]]]]],
				unlocked() {
					return hasUpgrade("f", 21)
				}
			}
		},
		update(diff) {
			player.f.points = player.f.points.min(buyableEffect("m", 11).mul(hasUpgrade("m", 22)?100:50).add(1000));
			var pointdiff = new Decimal(player.points);
			player.points = player.points.div(Decimal.pow(Decimal.pow(1.1, diff), player.f.allocated))
			player.f.metals = player.f.metals.add((getBuyableAmount("m", 11).gte(5)?Decimal.pow(1.4, player.f.allocated.min(2000)).mul(player.f.allocated.sub(1999).max(1).pow(2.5)).mul(0.003).mul(hasUpgrade("f", 13)?upgradeEffect("f", 13):1):Decimal.pow(2, player.f.allocated.min(hasUpgrade("f", 52)?28:16)).mul(Decimal.pow(1.2, player.f.allocated.sub(hasUpgrade("f", 52)?28:16).min(hasUpgrade("f", 52)?28:16).max(0))).mul(Decimal.pow(player.f.allocated.sub(hasUpgrade("f", 52)?56:32).max(1), 0.3)).mul(0.003).mul(hasUpgrade("f", 13)?upgradeEffect("f", 13):1)).mul(pointdiff.sub(player.points)))
			player.f.allocated = player.f.allocated.min(player.f.points)
			if (hasUpgrade("e", 42)) player.point = pointdiff.div(Decimal.pow(Decimal.pow(1.001, diff), player.f.allocated))
			if (hasUpgrade("f", 11)) player.e.points = player.e.points.add(tmp.e.resetGain.mul(0.01).mul(diff).mul(upgradeEffect("f", 11)));
			if (hasUpgrade("f", 21)) player.f.embers = player.f.embers.add(upgradeEffect("f", 21).mul(diff));
			if (layers.f.clickables[11].unlocked()) Vue.set(hotkeys, "F", {key: "F", desc: "shift+f: Buy flame", onPress() {layers.f.clickables[11].onClick()}, layer: "f"});
		},
		extraFlame() {
			return new Decimal(hasUpgrade("f", 43)?4:0).add(hasUpgrade("f", 53)?upgradeEffect("f", 53):0)
		},
		flameEffect() {
			return Decimal.div(1, player.f.flame.add(this.extraFlame()).div(hasUpgrade("f", 31)?2.5:5).add(1))
		},
		doReset(resettingLayer) {
			if (layers[resettingLayer].row > this.row) layerDataReset("f", (hasUpgrade("m", 12)? ["upgrades"] : []))
		}
});
function buyMaxFurnaces() {
	var iterations = 0;
	while (player.points.gte(getNextAt("f"))&&iterations<100000&&canReset("f")) {
		player.f.points = player.f.points.add(1);
		iterations++;
		Vue.set(tmp.f, "gainExp", layers.f.gainExp());
		Vue.set(tmp.f, "base", layers.f.base());
	}
	if (iterations>0) doReset("f", true);
}
addLayer("e", {
		name: "extractor", // This is optional, only used in a few places, If absent it just uses the layer id.
		symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
		position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
		startData() { return {
			unlocked: true,
			points: new Decimal(0),
			oil: new Decimal(0),
			burning: false,
			burnEffect: new Decimal(0),
			burnOilLoss: new Decimal(0),
			layerticks: 0
		}},
		color: "#887799",
		requires: new Decimal(10), // Can be a function that takes requirement increases into account
		resource: "extractors", // Name of prestige currency
		baseResource: "ores", // Name of resource prestige is based on
		baseAmount() {return player.points}, // Get the current amount of baseResource
		type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
		exponent() {
			return hasUpgrade("e", 41)?0.55:0.5
		}, // Prestige currency exponent
		gainMult() { // Calculate the multiplier for main currency from bonuses
			mult = new Decimal(1)
			if (hasUpgrade("e", 12)) mult = mult.mul(2);
			if (hasUpgrade("e", 22)) mult = mult.mul(upgradeEffect("e", 22));
			if (hasUpgrade("f", 52)) mult = mult.mul(upgradeEffect("f", 52));
			if (hasUpgrade("p", 12)) mult = mult.mul(upgradeEffect("p", 12));
			return mult
		},
		gainExp() { // Calculate the exponent on main currency from bonuses
			return new Decimal(1)
		},
		row: 0, // Row the layer is in on the tree (0 is the first row)
		hotkeys: [
			{key: "e", description: "e: Reset for extractors", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
		],
		layerShown(){return true},
		upgrades: {
			rows: 4,
			cols: 4,
			11: {
				title: "Efficiency",
				description: "Extractors produce ores x2 faster.",
				cost: 20
			},
			12: {
				title: "Optimization",
				description: "Double extractor gain.",
				cost: 100
			},
			13: {
				title: "Self-generating",
				description: "Gain more ores based on ores.",
				cost: 500,
				effect() {
					return hasUpgrade("e", 24) ? player.points.add(1).min("1e1000").pow(0.2).mul(player.points.div("1e1000").max(0).add(1.5).log(1.5).pow(0.5)) : player.points.add(2).log(2)
				},
			},
			14: {
				title: "Meta upgrade",
				description: "Gain more ores based on upgrades.",
				cost: 5e3,
				effect() {
					return Decimal.pow(3, player.e.upgrades.length)
				},
				unlocked() {
					return hasUpgrade("e", 13)||hasUpgrade("m", 11)
				}
			},
			21: {
				title: "Engineering",
				description: "Interact with the core properties of extractors.",
				cost: 1e5,
				unlocked() {
					return player.f.milestones.includes("0")||hasUpgrade("m", 11)
				}
			},
			22: {
				title: "Smelted Extractor",
				description: "Metal boost extractor gain.",
				cost: 2e9,
				unlocked() {
					return player.f.milestones.includes("0")||hasUpgrade("m", 11)
				},
				effect() {
					return player.f.metals.add(20).min(1e250).log(20).add(player.f.metals.div(1e250).max(0).add(1).log(2000))
				}
			},
			23: {
				title: "Scaling",
				description: "Scaled motor scaling starts later, and is weakened.",
				cost: 1e12,
				unlocked() {
					return player.f.milestones.includes("0")||hasUpgrade("m", 11)
				}
			},
			24: {
				title: "Self improvement",
				description: "Self-generating's formula is better.",
				cost: 3e15,
				unlocked() {
					return player.f.milestones.includes("0")||hasUpgrade("m", 11)
				}
			},
			31: {
				title: "Over-Engineering",
				description: "Add 2 to motor's effect base.",
				cost: 1e66,
				unlocked() {
					return player.f.milestones.includes("1")||hasUpgrade("m", 11)
				}
			},
			32: {
				title: "Forged Extractor",
				description: "Ember boost boosts ore gain at an increased rate.",
				cost: 2e114,
				unlocked() {
					return player.f.milestones.includes("1")||hasUpgrade("m", 11)
				},
				effect() {
					return buyableEffect("f", 11).pow(3)
				}
			},
			33: {
				title: "Friction",
				description: "Motor boosts ember gain at a reduced rate.",
				cost: 1e225,
				unlocked() {
					return (player.f.milestones.includes("1")&&player.f.flame.gt(0))||hasUpgrade("m", 11)
				},
				effect() {
					return buyableEffect("e", 13).pow(0.25)
				}
			},
			34: {
				title: "Forged Components",
				description: "All components gain free levels from flame.",
				cost: 1e275,
				unlocked() {
					return (player.f.milestones.includes("1")&&player.f.flame.gt(0))||hasUpgrade("m", 11)
				}
			},
			41: {
				title: "More Optimization",
				description: "The exponent for extractor gain is better.",
				cost: "1e580",
				unlocked() {
					return hasUpgrade("m", 11)
				}
			},
			42: {
				title: "Even More Optimization",
				description: "Active furnaces only divide ore gain by 1.001 but metal gain stays the same as if it was 1.1.",
				cost: "2e860",
				unlocked() {
					return hasUpgrade("m", 11)
				}
			},
			43: {
				title: "Rich In Ores",
				description: "Improve Depth's effect formula.",
				cost: "1e875",
				unlocked() {
					return hasUpgrade("m", 11)
				}
			},
			44: {
				title: "Oil Rigs Too",
				description: "Extractors start producing oil.",
				cost: "1e1800",
				unlocked() {
					return hasUpgrade("m", 11)
				},
				effect() {
					return player.e.points.pow(0.5).mul(buyableEffect("e", 11)).mul(buyableEffect("e", 12)).mul(buyableEffect("e", 12)).pow(player.e.canBurn?1:0.7)
				},
				effectDisplay() {
					return `${format(this.effect())} oil/s`
				}
			},
		},
		milestones: {
			0: {
				requirementDescription: "1e5 extractors",
				effectDescription: "Unlock furnaces.",
				done() {
					return player.e.points.gte(1e5)||player.m.points.gt(0)
				},
				style: {
					width: "300px"
				}
			},
			1: {
				requirementDescription: "1e14 extractors",
				effectDescription: "Unlock furnace upgrades.",
				done() {
					return player.e.points.gte(1e14)||player.m.points.gt(0)
				},
				style: {
					width: "300px"
				}
			}
		},
		buyables: {
			rows: 1,
			cols: 3,
			11: {
				title: "Depth",
				display() {
					return `<br><br><h3>Increase the depth of extractors.</h3><br>
					<h2>Currently:</h2><h3> ${format(getBuyableAmount("e", 11).add(hasUpgrade("e", 34)?player.f.flame.mul(2).pow(2):0).add(1).mul(10), 0)}m deep</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} metals</h3>
					<h2>Effect:</h2><h3> x${format(this.effect())}</h3>`
				},
				cost() {
					return Decimal.pow(5, getBuyableAmount("e", 11).add(getBuyableAmount("e", 11).sub(20).max(0).pow(2).div(1.5)).mul(hasUpgrade("f", 44)?layers.f.flameEffect():1)).mul(1e8)
				},
				buy() {
					if (this.canAfford()) {
						player.f.metals = player.f.metals.sub(this.cost())
						setBuyableAmount("e", 11, getBuyableAmount("e", 11).add(1))
					}
				},
				effect() {
					return (getBuyableAmount("e", 11).add(hasUpgrade("e", 34)?player.f.flame.mul(2).pow(2):0).add(1)).pow(hasUpgrade("e", 43)?4:1)
				},
				unlocked() {
					return hasUpgrade("e", 21)
				},
				canAfford() {
					return player.f.metals.gte(this.cost())
				}
			},
			12: {
				title: "Amount",
				display() {
					return `<br><br><h3>Increase the amount of modules per depth.</h3><br>
					<h2>Currently:</h2><h3> ${format(this.effect(), 0)} modules</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} metals</h3>
					<h2>Effect:</h2><h3> x${format(this.effect())}</h3>`
				},
				cost() {
					return Decimal.pow(10, getBuyableAmount("e", 12).add(getBuyableAmount("e", 12).sub(30).max(0).pow(2).div(1.4)).mul(hasUpgrade("f", 44)?layers.f.flameEffect():1)).mul(1e7)
				},
				buy() {
					if (this.canAfford()) {
						player.f.metals = player.f.metals.sub(this.cost())
						setBuyableAmount("e", 12, getBuyableAmount("e", 12).add(1))
					}
				},
				effect() {
					return getBuyableAmount("e", 12).add(hasUpgrade("e", 34)?player.f.flame.mul(2).pow(2):0).add(1)
				},
				unlocked() {
					return hasUpgrade("e", 21)
				},
				canAfford() {
					return player.f.metals.gte(this.cost())
				}
			},
			13: {
				title: "Motor",
				display() {
					return `<br><br><h3>Increase the speed of all carts and motors in the extractor.</h3><br>
					<h2>Currently:</h2><h3> ${format(buyableEffect("e", 13).mul(60))}rpm</h3>
					<h2>Cost:</h2><h3> ${format(getBuyableCost("e", 13))} metals</h3>
					<h2>Effect:</h2><h3> x${format(buyableEffect("e", 13))}</h3>`
				},
				cost() {
					return Decimal.pow(20, getBuyableAmount("e", 13).add(getBuyableAmount("e", 13).sub(hasUpgrade("e", 23)?6:3).max(0).pow(hasUpgrade("e", 23)?2.4:3)).mul(hasUpgrade("f", 44)?layers.f.flameEffect():1)).mul(1e7)
				},
				buy() {
					if (this.canAfford()) {
						player.f.metals = player.f.metals.sub(this.cost())
						setBuyableAmount("e", 13, getBuyableAmount("e", 13).add(1))
					}
				},
				effect() {
					return Decimal.pow(Decimal.add(1.5, hasUpgrade("f", 22)?2:0), getBuyableAmount("e", 13).add(hasUpgrade("e", 34)?player.f.flame.mul(2):0))
				},
				unlocked() {
					return hasUpgrade("e", 21)
				},
				canAfford() {
					return player.f.metals.gte(this.cost())
				}
			}
		},
		clickables: {
			rows: 1,
			cols: 1,
			11: {
				display() {
					return `${(player.e.burning?"Deactivate Oil Burning.":"Activate Oil Burning.")}`
				},
				canClick() {
					return true
				},
				onClick() {
					if (this.canClick()) player.e.burning = !player.e.burning;
					if (player.e.burning) player.e.burnOilLoss = upgradeEffect("e", 44).mul(2);
				},
				cost() {
					return Decimal.pow(20, player.f.flame.pow(2).div(hasUpgrade("f", 41)?4:2)).mul(5e8).div(hasUpgrade("f", 33)?upgradeEffect("f", 33):1)
				},
				style() {
					return {
						height: "120px",
						width: "180px",
						borderRadius: "25%",
						border: "4px solid",
						borderColor: "rgba(0, 0, 0, 0.125)",
						backgroundColor: this.canClick()?"#884400":"#bf8f8f",
						font: "400 13.3333px Arial"
					}
				}
			}
		},
		branches: ["f"],
		tabFormat: {
			"Main": {
				content: ["main-display", "prestige-button", ["raw-html", "<br>"], "milestones", ["raw-html", "<br>"], "buyables", ["raw-html", "<br>"], "upgrades"]
			},
			"Oil": {
				content: ["main-display", "prestige-button", ["raw-html", function () {
					return `<br>
					<h3>You have ${format(player.e.oil)} oil, boosting ember gains by x${format(player.e.oil.add(2).log(2))}</h3><br>
					(${format(upgradeEffect("e", 44))}/s)
					<br><br>Activate Oil Burning, which depletes your oil at twice the rate it is produced, but you gain boosts to ore gain and extra ember levels.<br><br>`
				}], "clickables", ["raw-html", function () {
					return `<br><br>You are losing ${format(player.e.burning?player.e.burnOilLoss:0)} oil per second, but you gain a x${format(player.e.burnEffect.add(1.2).log(1.2))} boost to ore gain and get ${format(player.e.burnEffect.add(2).log(2).log(3).floor())} extra ember buyable levels.`
				}]],
				unlocked() {
					return hasUpgrade("e", 44)
				}
			}
		},
		update(diff) {
			if (!player.e.burning) player.e.oil = player.e.oil.add(hasUpgrade("e", 44)?upgradeEffect("e", 44).mul(diff):0);
			if (player.e.burning) {
				player.e.oil = player.e.oil.sub(player.e.burnOilLoss.mul(diff)).max(0);
				player.e.burnEffect = player.e.oil.min(player.e.burnOilLoss.mul(hasUpgrade("p", 13)?upgradeEffect("p", 13):1));
			} else {
				player.e.burnEffect = new Decimal(0);
			}
			player.e.layerticks += diff;
			if (hasUpgrade("e", 44)) Vue.set(hotkeys, "o", {key: "o", desc: "o: Toggle oil burning", onPress() {layers.e.clickables[11].onClick()}, layer: "e"}) 
		},
		doReset(resettingLayer) {
			if (layers[resettingLayer].row > this.row) layerDataReset("e", (hasUpgrade("m", 11)? ["upgrades"] : []))
		}
});
addLayer("p", {
	name: "plastic",
	symbol: "P",
	position: -1,
	row: 0,
	startData() { return {
		unlocked: false,
		points: new Decimal(0)
	}},
	color: "#888a8f",
	requires: new Decimal(1),
	resource: "plastic",
	baseResource: "oil",
	type: "none",
	baseAmount() {return player.e.oil},
	branches: ["e", "m"],
	layerShown() {
		return getBuyableAmount("m", 12).gt(0)||player.p.unlocked
	},
	upgrades: {
		rows: 1,
		cols: 4,
		11: {
			title: "Questionable Structural Integrity",
			description: "Makes factories cheaper based on plastic.",
			effect() {
				return player.p.points.add(10).log(10).pow(0.1)
			},
			effectDescription() {
				return `/${this.effect()}`
			},
			cost: "1e550"
		},
		12: {
			title: "Questionable Structural Integrity II",
			description: "Extractor gain is booster by plastic.",
			effect() {
				return player.p.points.add(1).pow(0.2)
			},
			cost: "1e600"
		},
		13: {
			title: "Questionable Burning Practices",
			description: "Make oil burning more efficient based on plastic.",
			effect() {
				return player.p.points.add(1).pow(0.1)
			},
			cost: "1e700"
		},
		14: {
			title: "Excessive Burning Practices",
			description: "Unlock the fourth ember buyable. (The buyable is unaffected by extra levels)",
			currencyDisplayName: "oil",
			currencyInternalName() {
				return "oil"
			},
			currencyLayer() {
				return "e"
			},
			cost: "1e1500"
		}
	},
	update(diff) {
		if (player.p.unlocked) {
			player.p.points = player.p.points.add(player.e.oil.pow(0.5).mul(buyableEffect("m", 12)).mul(diff));
		} else {
			if (getBuyableAmount("m", 12).gt(0)) player.p.unlocked = true;
		}
	},
	tabFormat: [
	"main-display", ["raw-html", function() {return `(${format(player.e.oil.pow(0.5).mul(buyableEffect("m", 12)))}/s)<br><br>`}], "upgrades"
	],
	doReset(resettingLayer) {
		if (resettingLayer == "m") layerDataReset("p", ["upgrades", "challenges"])
	}
})
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
			usedBricks: new Decimal(0)
		}},
		color: "#8f1402",
		requires: new Decimal("1e1080"), // Can be a function that takes requirement increases into account
		resource: "manufacturers", // Name of prestige currency
		baseResource: "metals", // Name of resource prestige is based on
		baseAmount() {return player.f.metals}, // Get the current amount of baseResource
		type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
		base() {
			return player.m.points.add(1).mul(1e85)
		},
		exponent() {
			return player.m.points.sub(20).max(1).pow(0.01)
		},
		gainMult() { // Calculate the multiplier for main currency from bonuses
			mult = new Decimal(1)
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
			cols: 4,
			11: {
				title: "Extractor Manufacturer",
				description: "Unlock more extractor upgrades, and keep them on reset.",
				cost: 2
			},
			12: {
				title: "Furnace Quality Control",
				description: "Keep furnace upgrades on reset.",
				cost: 7
			},
			13: {
				title: "Actual Manufacturing",
				description: "Unlock factories.",
				cost: 30
			},
			21: {
				title: "Untimewall Gaming",
				description: "Factory 1's interval is reduced to one second.",
				cost: 10000,
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
				cost: 50000,
				currencyDisplayName: "bricks",
				currencyInternalName() {
					return "bricks"
				},
				currencyLayer() {
					return "m"
				}
			},
			23: {
				title: "The Controlled Brick Burner",
				description: "Oil burning halves oil production instead, and the effects are much more powerful. (Does not do anything)",
				cost: 2000000,
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
				effectDescription: "Automate extractor buyables.",
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
				effectDescription: "Automate embers and flame respectively.",
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
					return `<br><h3>Creates a furnace every ${hasUpgrade("m", 21)?"1 second":"5 seconds"}. (count towards furnace scaling.) Fifth level uncaps ore to metal efficiency. Also increases cap to furnace amount.</h3><br>
					<h2>Currently:</h2><h3> ${format(this.effect().div((((!hasUpgrade("m", 21))*4)+1)), 2)}/s</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} bricks</h3>
					<h3>Furnaces harcapped at ${format(this.effect().mul(hasUpgrade("m", 22)?100:50).add(1000))}</h3>`
				},
				cost() {
					let T = getBuyableAmount("m", 11).add(getBuyableAmount("m", 12)).add(getBuyableAmount("m", 13)).add(1);
					return T.mul(T.add(1)).mul(T.mul(2).add(1)).mul(2).mul(T.mul(3).add(2)).div(hasUpgrade("p", 11)?upgradeEffect("p", 11):1);
				},
				buy() {
					if (this.canAfford()) {
						player.m.bricks = player.m.bricks.sub(this.cost())
						player.m.usedBricks = player.m.usedBricks.add(this.cost())
						setBuyableAmount("m", 11, getBuyableAmount("m", 11).add(1))
					}
				},
				effect() {
					return getBuyableAmount("m", 11)
				},
				canAfford() {
					return player.m.bricks.gte(this.cost())
				}
			},
			12: {
				title: "Factory 2",
				display() {
					return `<br><h3>First level unlocks plastic, other levels boost plastic gain.</h3><br>
					<h2>Currently:</h2><h3> x${format(this.effect(), 2)} to plastic</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} bricks</h3>`
				},
				cost() {
					let T = getBuyableAmount("m", 11).add(getBuyableAmount("m", 12)).add(getBuyableAmount("m", 13)).add(5);
					return T.mul(T.add(1)).mul(T.mul(2).add(1)).mul(T.mul(3).add(2)).mul(2).div(hasUpgrade("p", 11)?upgradeEffect("p", 11):1);
				},
				buy() {
					if (this.canAfford()) {
						player.m.bricks = player.m.bricks.sub(this.cost())
						player.m.usedBricks = player.m.usedBricks.add(this.cost())
						setBuyableAmount("m", 12, getBuyableAmount("m", 12).add(1))
					}
				},
				effect() {
					return Decimal.pow(10000, getBuyableAmount("m", 12).sub(1).max(0))
				},
				canAfford() {
					return player.m.bricks.gte(this.cost())
				}
			},
			13: {
				title: "Factory 3",
				display() {
					return `<br><h3>Each level increases brick gain.</h3><br>
					<h2>Currently:</h2><h3> x${format(this.effect(), 2)} to bricks</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} bricks</h3>`
				},
				cost() {
					let T = getBuyableAmount("m", 11).add(getBuyableAmount("m", 12)).add(getBuyableAmount("m", 13)).add(3);
					return T.mul(T.add(1)).mul(T.mul(2).add(1)).mul(T.mul(3).add(2)).mul(T.mul(4).add(3)).div(4).div(hasUpgrade("p", 11)?upgradeEffect("p", 11):1);
				},
				buy() {
					if (this.canAfford()) {
						player.m.bricks = player.m.bricks.sub(this.cost())
						player.m.usedBricks = player.m.usedBricks.add(this.cost())
						setBuyableAmount("m", 13, getBuyableAmount("m", 13).add(1))
					}
				},
				effect() {
					return getBuyableAmount("m", 13).add(1).pow(2.5);
				},
				canAfford() {
					return player.m.bricks.gte(this.cost())
				}
			},
			respec() {
				resetBuyables("m");
				player.m.bricks = player.m.bricks.add(player.m.usedBricks);
				player.m.usedBricks = new Decimal(0);
				doReset("m", true);
			},
			showRespec() {
				return true;
			},
			respecText: "Demolish all factories"
		},
		branches: ["f"],
		tabFormat: {
			"Main": {
				content: ["main-display", "prestige-button", ["raw-html", "<br>"], "milestones", ["raw-html", "<br>"], ["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14]]]]
			},
			"Factories": {
				content: ["main-display", "prestige-button", ["raw-html", function () {
				return `You have ${format(player.m.bricks)} bricks. (${format(player.m.active.mul(0.1).mul(buyableEffect("m", 13)))}/s)
				<br><br>
				You have ${format(player.m.active)} active manufacturers.
				<br><br>
				Use the below slider to change active manufacturers.
				<br><br>
				<input oninput="player.m.active = new Decimal(this.value)" type="range" min="0" max="${player.m.points}" step="1" style="width: 30em" value="${player.m.active}">
				<br>
				Active manufacturers subtract from the manufacturer effect, but in turn you get bricks to buy factories.
				<br>`}
				], "buyables", ["raw-html", `<br>Buying a factory makes all others more expensive. Use the space you have wisely.`], ["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24]]]],
				unlocked() {
					return hasUpgrade("m", 13)
				},
			}
		},
		automate() {
			if (player.m.autoFurnace&&canReset("f")) player.m.milestones.includes("4")?buyMaxFurnaces():doReset("f");
			if (player.m.autoFAlloc) player.f.allocated = player.f.points;
			if (player.m.autoEBuyable) {
				for (var i = 11; i <= 13; i++) {
					for (var j = 0; j < 40; j++) {
						layers.e.buyables[i].buy()
					}
				}
			}
			if (player.m.autoFlame) layers.f.clickables[11].onClick();
			if (player.m.autoEmber) {
				for (var i = 11; i <= (hasUpgrade("p", 14)+13); i++) {
					for (var j = 0; j < 40; j++) {
						layers.f.buyables[i].buy()
					}
				}
			}
			if (player.m.autoManu) buyMaxManufacturers();
		},
		resetsNothing: false,
		update(diff) {
			player.m.bricks = player.m.bricks.add(player.m.active.mul(0.1).mul(buyableEffect("m", 13)).mul(diff));
			player.m.active = player.m.active.min(player.m.points).max(0);
			player.m.furnaceTick += diff;
			player.f.points = player.f.points.add(Decimal.floor(player.m.furnaceTick/(((!hasUpgrade("m", 21))*4)+1)).mul(buyableEffect("m", 11)));
			player.m.furnaceTick = player.m.furnaceTick%(((!hasUpgrade("m", 21))*4)+1);
		}
})
function buyMaxManufacturers() {
	var iterations = 0;
	while (player.points.gte(getNextAt("m"))&&iterations<100000&&canReset("m")) {
		player.m.points = player.m.points.add(1);
		iterations++;
		Vue.set(tmp.m, "exponent", layers.m.exponent());
		Vue.set(tmp.m, "base", layers.m.base());
	}
	if (iterations>0) doReset("m", true);
}