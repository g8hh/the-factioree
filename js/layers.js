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
		resetsNothing() {
			return player.mo.milestones.includes("1")
		},
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
			rows() {
				return hasUpgrade("p", 14)?2:1
			},
			cols() {
				return hasUpgrade("p", 14)?2:3
			},
			11: {
				title: "Ember boost",
				display() {
					return `<br><br><h3>Boost ember gain.</h3><br>
					<h2>Currently:</h2><h3> ${`${format(getBuyableAmount("f", 11), 0)}${getBuyableAmount("f", 12).eq(0)?
					"":
					`+${format(getBuyableAmount("f", 12).mul(1.5).add(getBuyableAmount("f", 13).mul(2)).add((hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor())))}`}`}</h3>
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
					return Decimal.pow(Decimal.mul(1.5, hasUpgrade("f", 42)?1.1:1), getBuyableAmount("f", 11).add(getBuyableAmount("f", 12).mul(1.5).add(getBuyableAmount("f", 13).mul(2).add(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor()))))
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
					`+${format(getBuyableAmount("f", 13).mul(0.25).add(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor()))}`}`}</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} fiery embers</h3>
					<h2>Effect:</h2><h3> x${format(this.effect())}</h3>`
				},
				cost() {
					return Decimal.pow(11.5, getBuyableAmount("f", 12).sub(inChallenge("mo", 42)?0:250).sub(inChallenge("mo", 42)?0:tmp.p.effect[3]).max(0).pow(6).add(getBuyableAmount("f", 12).pow(hasUpgrade("f", 34)?2.4:4).div(10)).add(getBuyableAmount("f", 12)).mul(layers.f.flameEffect())).mul(10000).mul(hasUpgrade("f", 34)?upgradeEffect("f", 34):1)
				},
				buy() {
					if (this.canAfford()) {
						player.f.embers = player.f.embers.sub(this.cost())
						setBuyableAmount("f", 12, getBuyableAmount("f", 12).add(1))
					}
				},
				effect() {
					return new Decimal(hasUpgrade("f", 61)?10:2).mul((hasChallenge("mo", 12)*4)+1).pow(getBuyableAmount("f", 12).add(getBuyableAmount("f", 13).mul(0.25).add(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor())))
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
					<h2>Currently:</h2><h3> ${format(getBuyableAmount("f", 13), 0)}${(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor()).gt(0)?`+${format(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor())}`:""}</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} fiery embers</h3>
					<h2>Effect:</h2><h3> ${format(this.effect())}</h3>`
				},
				cost() {
					return Decimal.pow(10, getBuyableAmount("f", 13).sub(inChallenge("mo", 42)?0:(hasUpgrade("f", 34)?15:10)).max(0).pow(hasUpgrade("f", 34)?2.6:4.5).add(getBuyableAmount("f", 13).pow(hasUpgrade("f", 34)?1.8:3).div(hasUpgrade("f", 34)?8:5).add(getBuyableAmount("f", 13)).mul(layers.f.flameEffect()))).mul(500000).mul(hasUpgrade("f", 34)?upgradeEffect("f", 34):1)
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
					return Decimal.pow(mult.mul(1e25), getBuyableAmount("f", 13).add(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor()))
				},
				canAfford() {
					return player.f.embers.gte(this.cost())
				},
				style() {
					return {backgroundColor: this.canAfford()?"#ff4400":"bf8f8f"}
				}
			},
			21: {
				title: "Point speed",
				display() {
					return `<br><br><h3>Boost point gain, and gives extra levels to the previous upgrades.</h3><br>
					<h2>Currently:</h2><h3> ${format(getBuyableAmount("f", 13), 0)}${(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor()).gt(0)?`+${format(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor())}`:""}</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} fiery embers</h3>
					<h2>Effect:</h2><h3> ${format(this.effect())}</h3>`
				},
				cost() {
					return Decimal.pow(10, getBuyableAmount("f", 13).sub(inChallenge("mo", 42)?0:(hasUpgrade("f", 34)?15:10)).max(0).pow(hasUpgrade("f", 34)?2.6:4.5).add(getBuyableAmount("f", 13).pow(hasUpgrade("f", 34)?1.8:3).div(hasUpgrade("f", 34)?8:5).add(getBuyableAmount("f", 13)).mul(layers.f.flameEffect()))).mul(500000).mul(hasUpgrade("f", 34)?upgradeEffect("f", 34):1)
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
					mult = mult.mul(tmp.ps.effect.pointSpeedBoost);
					return Decimal.pow(mult.mul(1e25), getBuyableAmount("f", 13).add(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor()))
				},
				canAfford() {
					return player.f.embers.gte(this.cost())
				},
				style() {
					return {backgroundColor: this.canAfford()?"#ff4400":"bf8f8f"}
				}
			},
			22: {
				title: "Ember Derivatives",
				display() {
					return `<br><br><h3>Raise Ember gain to an exponent.</h3><br>
					<h2>Currently:</h2><h3> ${format(getBuyableAmount("f", 22), 0)}</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} fiery embers</h3>
					<h2>Effect:</h2><h3> ^${format(this.effect())}</h3>`
				},
				cost() {
					return Decimal.pow(getBuyableAmount("f", 22).add(1).pow(0.5).add(19), getBuyableAmount("f", 22).pow(3).mul(layers.f.flameEffect())).mul("1e500").mul(hasUpgrade("f", 34)?upgradeEffect("f", 34):1)
				},
				buy() {
					if (this.canAfford()) {
						player.f.embers = player.f.embers.sub(this.cost())
						setBuyableAmount("f", 22, getBuyableAmount("f", 22).add(1))
					}
				},
				effect() {
					return getBuyableAmount("f", 22).mul(0.05).add(1)
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
					${format(player.f.embers)}/&ZeroWidthSpace;${format(this.cost())} fiery embers</span>`
				},
				canClick() {
					return player.f.embers.gte(this.cost())
				},
				onClick() {
					if (player.f.embers.gte(this.cost())) {
						player.f.embers = player.f.embers.sub(this.cost());
						player.f.flame = player.f.flame.add(1);
					}
				},
				cost() {
					return Decimal.pow(20, player.f.flame.pow(2).div(hasUpgrade("f", 41)?4:2)).mul(5e8).div(hasUpgrade("f", 33)?upgradeEffect("f", 33):1).pow(hasUpgrade("f", 62)?Decimal.div(1, upgradeEffect("f", 62)):1);
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
		upgrades: {
			rows: 6,
			cols: 4,
			11: {
				title: "181",
				description: `Gain x% of extractor gain on prestige per second where x is based on your active furnaces.`,
				cost() {
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:9;
				},
				unlocked() {
					return player.e.milestones.includes("1")
				},
				effect() {
					return Decimal.pow(1.3, player.f.allocated).mul(2).sub(2).min(inChallenge("mo", 42)?0.0001:100000)
				},
				effectDisplay() {
					return `${format(this.effect())}%`
				}
			},
			12: {
				title: "Bribed furnaces",
				description: `Furnaces are cheaper based on metals.`,
				cost() {
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:10;
				},
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
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:16
				},
				unlocked() {
					return player.e.milestones.includes("1")
				},
				effect() {
					if (inChallenge("mo", 11)) return new Decimal(0);
					var embergain = player.f.points.mul(100).mul(buyableEffect("f", 11)).mul(buyableEffect("f", 12)).mul(player.e.oil.add(2).log(2))
					if (hasUpgrade("f", 22)) embergain = embergain.mul(upgradeEffect("f", 22));
					if (hasUpgrade("f", 32)) embergain = embergain.mul(100);
					if (hasUpgrade("e", 33)) embergain = embergain.mul(upgradeEffect("e", 33));
					embergain = embergain.pow(buyableEffect("f", 22));
					embergain = embergain.mul(tmp.m.effect.sqrt());
					embergain = embergain.mul(tmp.ps.effect.emberBoost);
					if (hasUpgrade("mo", 13)) embergain = embergain.pow(upgradeEffect("mo", 13));
					return embergain;
				},
				effectDisplay() {
					return `${format(this.effect())} fiery embers/s`
				}
			},
			22: {
				title: "Lava",
				description: `Ember gain multiplied by extractors.`,
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:25
				},
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
				cost() {
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:90;
				},
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
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:101;
				},
				unlocked() {
					return player.m.milestones.includes("0")
				}
			},
			14: {
				title: "Laundered furnaces",
				description: `Bribed furnaces has a better effect formula.`,
				cost() {
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:109
				},
				unlocked() {
					return player.m.milestones.includes("3")
				}
			},
			24: {
				title: "Point Jerk",
				description: "Point Acceleration is stronger based on furnaces.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:121;
				},
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
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:124;
				},
				unlocked() {
					return player.m.milestones.includes("3")
				}
			},
			52: {
				title: "Furnace Fire Pure Teal",
				description: "Metal gain softcap starts 12 later, and multiply extractor gain by furnaces.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:157;
				},
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
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:170;
				},
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
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:200;
				},
				unlocked() {
					return player.m.milestones.includes("3")
				},
				effect() {
					if (inChallenge("mo", 42)) return new Decimal(1);
					return Decimal.pow(10, player.e.layerticks).min("1e2000")
				},
				effectDisplay() {
					return `/${format(this.effect())}`
				}
			},
			31: {
				title: "Flamier Flames",
				description: "Flames effect is stronger.",
				cost() {
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:3
				},
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
					return {backgroundColor: hasUpgrade("f", 31)?"#77bf5f":(player.f.flame.gte(this.cost())?"#ff6600":"bf8f8f")}
				}
			},
			32: {
				title: "Boost. Just Boost.",
				description: "Ember gain times 100.",
				cost() {
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:3;
				},
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
					return {backgroundColor: hasUpgrade("f", 32)?"#77bf5f":(player.f.flame.gte(this.cost())?"#ff6600":"bf8f8f")}
				}
			},
			41: {
				title: "Oxygenator",
				description: "Flames cost scaling is weaker.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:4;
				},
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
					return {backgroundColor: hasUpgrade("f", 41)?"#77bf5f":(player.f.flame.gte(this.cost())?"#ff6600":"bf8f8f")}
				}
			},
			42: {
				title: "Ember boost boost",
				description: "Multiply the base of ember boost by 1.1.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:7;
				},
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
				cost() {
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:9;
				},
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
					return {backgroundColor: hasUpgrade("f", 33)?"#77bf5f":(player.f.flame.gte(this.cost())?"#ff6600":"bf8f8f")}
				}
			},
			43: {
				title: "Extra Flame",
				description: "Gain 4 extra flame levels.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:10;
				},
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
					return {backgroundColor: hasUpgrade("f", 43)?"#77bf5f":(player.f.flame.gte(this.cost())?"#ff6600":"bf8f8f")}
				}
			},
			34: {
				title: "Even Flamier",
				description: "Flame also divide final buyable cost at an increased rate, and all cost scalings scale better.",
				cost() {
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:17;
				},
				unlocked() {
					return player.m.milestones.includes("3")
				},
				effect() {
					return Decimal.pow(2, layers.f.flameEffect().recip()).recip().pow(6)
				},
				effectDisplay() {
					return `/${format(this.effect().recip())}`
				},
				currencyDisplayName: "flame",
				currencyInternalName() {
					return "flame"
				},
				currencyLayer() {
					return "f"
				},
				style() {
					return {backgroundColor: hasUpgrade("f", 34)?"#77bf5f":(player.f.flame.gte(this.cost())?"#ff6600":"bf8f8f")}
				}
			},
			44: {
				title: "Extracting Flames",
				description: "Flame also make extractor levels cheaper.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:21;
				},
				unlocked() {
					return player.m.milestones.includes("3")
				},
				currencyDisplayName: "flame",
				currencyInternalName() {
					return "flame"
				},
				currencyLayer() {
					return "f"
				},
				style() {
					return {backgroundColor: hasUpgrade("f", 44)?"#77bf5f":(player.f.flame.gte(this.cost())?"#ff6600":"bf8f8f")}
				}
			},
			61: {
				title: "Ember Acceleration",
				description: "Multiply the base of Ember Speed by 5.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:30;
				},
				unlocked() {
					return player.m.milestones.includes("3")
				},
				currencyDisplayName: "flame",
				currencyInternalName() {
					return "flame"
				},
				currencyLayer() {
					return "f"
				},
				style() {
					return {backgroundColor: hasUpgrade("f", 61)?"#77bf5f":(player.f.flame.gte(this.cost())?"#ff6600":"bf8f8f")}
				}
			},
			62: {
				title: "Flame Decceleration",
				description: "Oil burning makes flames cheaper.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:36;
				},
				unlocked() {
					return player.m.milestones.includes("3")&&hasUpgrade("e", 44);
				},
				currencyDisplayName: "flame",
				currencyInternalName() {
					return "flame"
				},
				currencyLayer() {
					return "f"
				},
				style() {
					return {backgroundColor: hasUpgrade("f", 62)?"#77bf5f":(player.f.flame.gte(this.cost())?"#ff6600":"bf8f8f")}
				},
				effect() {
					return player.e.burnEffect.add(10).log(10).add(9).log(10).pow(0.3)
				},
				effectDisplay() {
					return `^1/${format(this.effect())}`
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
				You have ${format(player.f.allocated)} active furnaces.
				<br><br>
				Use the below slider to change active furnaces.
				<br><br>
				<input oninput="player.f.allocated = new Decimal(this.value)" type="range" min="0" max="${player.f.points}" step="1" style="width: 30em" value="${player.f.allocated}">
				<br>You lose a certain amount of ores per second, but your furnaces convert them into metals. 
				Your points are divided by ${format(Decimal.pow(hasUpgrade("e", 42)?1:1.1, player.f.allocated))} per second, but for every point you lose you gain ${format(getBuyableAmount("m", 11).gte(5)?Decimal.pow(1.4, player.f.allocated.min(inChallenge("mo", 42)?0:2000)).mul(player.f.allocated.sub(inChallenge("mo", 42)?0:1999).max(1).pow(2.5)).mul(0.003).mul(hasUpgrade("f", 13)?upgradeEffect("f", 13):1):Decimal.pow(2, player.f.allocated.min(hasUpgrade("f", 52)?28:16)).mul(Decimal.pow(1.2, player.f.allocated.sub(hasUpgrade("f", 52)?28:16).min(hasUpgrade("f", 52)?28:16).max(0))).mul(Decimal.pow(player.f.allocated.sub(hasUpgrade("f", 52)?56:32).max(1), 0.3)).mul(0.003).mul(hasUpgrade("f", 13)?upgradeEffect("f", 13):1))} metals.
				<br>` : ""
				}]]
			},
			"Upgrades": {
				content: ["main-display", "prestige-button", ["raw-html", "<br><h2>Furnace Upgrades</h2><br>"],
				["column", [["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14]]]]],
				["column", [["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24]]]]],
				["column", [["row", [["upgrade", 51], ["upgrade", 52], ["upgrade", 53], ["upgrade", 54]]]]],
				["raw-html", function () {return (player.f.embers.gt(500000000)||player.f.flame.gt(0)||player.f.upgrades.length>4)?"<br><h2>Flame Upgrades</h2><br>":""}],
				["column", [["row", [["upgrade", 31], ["upgrade", 32], ["upgrade", 33], ["upgrade", 34]]]]],
				["column", [["row", [["upgrade", 41], ["upgrade", 42], ["upgrade", 43], ["upgrade", 44]]]]],
				["column", [["row", [["upgrade", 61], ["upgrade", 62], ["upgrade", 63], ["upgrade", 64]]]]]
				],
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
				return (player.f.embers.gt(500000000)||player.f.flame.gt(0)||player.f.upgrades.length>4)?`<br>
				<span>You have </span><h2 style="color: #ff6600; text-shadow: 0px 0px 10px #ff6600;">${format(player.f.flame, 0)}</h2>${layers.f.extraFlame().gt(0)?`<h3> + </h3><h2 style="color: #ff6600; text-shadow: 0px 0px 7px #ff6600;">${layers.f.extraFlame()}</h2>`:""}<span> flame, making the cost exponent of all ember upgrades divided by ${format(Decimal.div(1, layers.f.flameEffect()))}.
				<br><br>`:""}],"clickables",
				["column", [["row", [["upgrade", 31], ["upgrade", 32], ["upgrade", 33], ["upgrade", 34]]]]], ["column", [["row", [["upgrade", 41], ["upgrade", 42], ["upgrade", 43], ["upgrade", 44]]]]], ["column", [["row", [["upgrade", 61], ["upgrade", 62], ["upgrade", 63], ["upgrade", 64]]]]]],
				unlocked() {
					return hasUpgrade("f", 21)
				}
			}
		},
		update(diff) {
			var pointdiff = new Decimal(player.points);
			player.points = player.points.div(Decimal.pow(Decimal.pow(1.1, diff), player.f.allocated))
			player.f.metals = player.f.metals.add((getBuyableAmount("m", 11).gte(5)?Decimal.pow(1.4, player.f.allocated.min(inChallenge("mo", 42)?0:2000)).mul(player.f.allocated.sub(inChallenge("mo", 42)?0:1999).max(1).pow(2.5)).mul(0.003).mul(hasUpgrade("f", 13)?upgradeEffect("f", 13):1):Decimal.pow(2, player.f.allocated.min(hasUpgrade("f", 52)?28:16)).mul(Decimal.pow(1.2, player.f.allocated.sub(hasUpgrade("f", 52)?28:16).min(hasUpgrade("f", 52)?28:16).max(0))).mul(Decimal.pow(player.f.allocated.sub(hasUpgrade("f", 52)?56:32).max(1), 0.3)).mul(0.003).mul(hasUpgrade("f", 13)?upgradeEffect("f", 13):1)).mul(pointdiff.sub(player.points)))
			player.f.allocated = player.f.allocated.min(player.f.points)
			if (hasUpgrade("e", 42)) player.points = pointdiff;
			if (hasUpgrade("f", 11)) player.e.points = player.e.points.add(tmp.e.resetGain.mul(0.01).mul(diff).mul(upgradeEffect("f", 11)));
			if (hasUpgrade("f", 21)) player.f.embers = player.f.embers.add(upgradeEffect("f", 21).mul(diff));
			if (layers.f.clickables[11].unlocked()) Vue.set(hotkeys, "F", {key: "F", desc: "shift+f: Buy flame", onPress() {layers.f.clickables[11].onClick()}, layer: "f"});
		},
		extraFlame() {
			if (inChallenge("mo", 11)) return new Decimal(0);
			return new Decimal(hasUpgrade("f", 43)?4:0).add(hasUpgrade("f", 53)?upgradeEffect("f", 53):0)
		},
		flameEffect() {
			return Decimal.div(1, player.f.flame.add(this.extraFlame()).div(hasUpgrade("f", 31)?2.5:5).add(1))
		},
		doReset(resettingLayer) {
			if (layers[resettingLayer].row > this.row) layerDataReset("f", ((hasUpgrade("m", 12)||player.mo.milestones.includes("2")) ? ["upgrades"] : []))
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
			mult = mult.mul(tmp.r.buyables[22].effect);
			return mult
		},
		gainExp() { // Calculate the exponent on main currency from bonuses
			return new Decimal(player.mo.pollution?0.5:1)
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
				cost() {
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:20;
				}
			},
			12: {
				title: "Optimization",
				description: "Double extractor gain.",
				cost() {
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:100;
				}
			},
			13: {
				title: "Self-generating",
				description: "Gain more ores based on ores.",
				cost() {
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:500;
				},
				effect() {
					return hasUpgrade("e", 24) ? player.points.add(1).min(inChallenge("mo", 42)?1:"1e1000").pow(0.2).mul(player.points.div(inChallenge("mo", 42)?1:"1e1000").max(0).add(1.5).log(1.5).pow(0.5)) : player.points.add(2).log(2)
				}
			},
			14: {
				title: "Meta upgrade",
				description: "Gain more ores based on upgrades.",
				cost() {
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:5e3;
				},
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
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:1e5;
				},
				unlocked() {
					return player.f.milestones.includes("0")||hasUpgrade("m", 11)
				}
			},
			22: {
				title: "Smelted Extractor",
				description: "Metal boost extractor gain.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:2e9;
				},
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
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:1e12;
				},
				unlocked() {
					return player.f.milestones.includes("0")||hasUpgrade("m", 11)
				}
			},
			24: {
				title: "Self improvement",
				description: "Self-generating's formula is better.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:3e15;
				},
				unlocked() {
					return player.f.milestones.includes("0")||hasUpgrade("m", 11)
				}
			},
			31: {
				title: "Over-Engineering",
				description: "Add 2 to motor's effect base.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:1e120;
				},
				unlocked() {
					return player.f.milestones.includes("1")||hasUpgrade("m", 11)
				}
			},
			32: {
				title: "Forged Extractor",
				description: "Ember boost boosts ore gain at an increased rate.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:2e290;
				},
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
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:"1e330"
				},
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
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:"1e436";
				},
				unlocked() {
					return (player.f.milestones.includes("1")&&player.f.flame.gt(0))||hasUpgrade("m", 11)
				}
			},
			41: {
				title: "More Optimization",
				description: "The exponent for extractor gain is better.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:"1e580";
				},
				unlocked() {
					return hasUpgrade("m", 11)
				}
			},
			42: {
				title: "Even More Optimization",
				description: "Active furnaces don't reduce ore amount but metal gain stays the same.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:"2e860";
				},
				unlocked() {
					return hasUpgrade("m", 11)
				}
			},
			43: {
				title: "Rich In Ores",
				description: "Improve Depth's effect formula.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:"1e875";
				},
				unlocked() {
					return hasUpgrade("m", 11)
				}
			},
			44: {
				title: "Oil Rigs Too",
				description: "Extractors start producing oil.",
				cost() {
					if (inChallenge("mo", 32)) return Infinity;
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:"1e1800"
				},
				unlocked() {
					return hasUpgrade("m", 11)
				},
				effect() {
					return player.e.points.pow(0.5).mul(buyableEffect("e", 11)).mul(buyableEffect("e", 12)).mul(buyableEffect("e", 12)).pow(0.7).mul(tmp.r.buyables[21].effect)
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
					return (getBuyableAmount("e", 11).add(hasUpgrade("e", 34)?player.f.flame.mul(2).pow(2):0).add(1)).sub((player.mo.pollution == 11)?500000000:0).max(1).pow(hasUpgrade("e", 43)?4:1)
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
					return `<br><br>You are losing ${format(hasUpgrade("m", 23)?upgradeEffect("e", 44).div(2):(player.e.burning?player.e.burnOilLoss:0))} oil per second, but you gain a x${format(player.e.burnEffect.add(1.2).log(1.2))} boost to ore gain and get ${format(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor())} extra ember buyable levels.`
				}]],
				unlocked() {
					return hasUpgrade("e", 44)
				}
			}
		},
		update(diff) {
			if (!player.e.burning||hasUpgrade("m", 23)) player.e.oil = player.e.oil.add(hasUpgrade("e", 44)?upgradeEffect("e", 44).mul(diff).mul(hasUpgrade("m", 23)?0.5:1):0);
			if (player.e.burning&&(!hasUpgrade("m", 23))) {
				player.e.oil = player.e.oil.sub(player.e.burnOilLoss.mul(diff)).max(0);
				player.e.burnEffect = player.e.oil.min(player.e.burnOilLoss.mul(hasUpgrade("p", 13)?upgradeEffect("p", 13):1));
			} else if (!hasUpgrade("m", 23)) {
				player.e.burnEffect = new Decimal(0);
			}
			if (hasUpgrade("m", 23)) player.e.burnEffect = upgradeEffect("e", 44).mul(2);
			player.e.layerticks += diff;
			if (hasUpgrade("e", 44)) Vue.set(hotkeys, "o", {key: "o", desc: "o: Toggle oil burning", onPress() {layers.e.clickables[11].onClick()}, layer: "e"}) 
		},
		doReset(resettingLayer) {
			if (layers[resettingLayer].row > this.row) layerDataReset("e", ((hasUpgrade("m", 11)||player.mo.milestones.includes("2")) ? ["upgrades"] : []))
		}
});
addLayer("p", {
	name: "plastic",
	symbol: "P",
	position: -1,
	row: 0,
	startData() { return {
		unlocked: false,
		points: new Decimal(0),
		structureData: {
			1: new Decimal(0),
			2: new Decimal(0),
			3: new Decimal(0)
		}
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
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:"1e550";
			}
		},
		12: {
			title: "Questionable Structural Integrity II",
			description: "Extractor gain is booster by plastic.",
			effect() {
				return player.p.points.add(1).pow(0.2)
			},
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:"1e600";
			}
		},
		13: {
			title: "Questionable Burning Practices",
			description: "Make oil burning more efficient based on plastic.",
			effect() {
				return player.p.points.add(1).pow(0.1)
			},
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:"1e700";
			}
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
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:"1e1500";
			}
		}
	},
	buyables: {
		rows: 1,
		cols: 1,
		11: {
			title: "Plastic structures",
			display() {
				return `<h3>Plastic Structures</h3><br>
				<h2>Amount:</h2><h3> ${format(getBuyableAmount("p", 11))}</h3>
				<h2>Cost:</h2><h3> ${format(this.cost())}</h3>`
			},
			buy() {
				if (this.canAfford()) {
					player.p.points = player.p.points.sub(this.cost());
					setBuyableAmount("p", 11, getBuyableAmount("p", 11).add(1));
				}
			},
			cost() {
				return Decimal.pow(1e100, getBuyableAmount("p", 11).pow(2)).mul("1e8888")
			},
			canAfford() {
				return player.p.points.gte(this.cost())&&(getBuyableAmount("p", 11).lte(20)||hasUpgrade("r", 12))
			},
			unlocked() {
				return hasUpgrade("mo", 21)
			}
		}
	},
	update(diff) {
		if (player.p.unlocked) {
			player.p.points = player.p.points.add(tmp.p.gain.mul(diff));
		} else {
			if (getBuyableAmount("m", 12).gt(0)) player.p.unlocked = true;
		}
		if (hasUpgrade("r", 12)) return;
		setBuyableAmount("p", 11, getBuyableAmount("p", 11).min(20))
	},
	tabFormat: {
		"Main": {
			content: [
			"main-display", ["raw-html", function() {return `(${format(tmp.p.gain)}/s)<br><br>`}], "upgrades", "buyables", ["raw-html", function () {
				return getBuyableAmount("p", 11).gt(0)?`Plastic structures are capped at 20 due to protection from the government!<br><br>You have ${format(getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]))} free structures.
				<br><br>
				<div style="display: flex; justify-content: center">
					<div style="display: flex; flex-direction: column; margin: 3px; justify-content: flex-start;">
					<span style="margin: 2px; text-align: left;">Structurally dangerous factories: </span>
					<span style="margin: 2px; text-align: left;">Furnace smugglers: </span>
					<span style="margin: 2px; text-align: left;">Uncontrolled burn: </span>
					</div>
					<div style="display: flex; flex-direction: column; margin: 3px;">
					<span><input type="range" style="width: 15em" step="1" min="0" max="${getBuyableAmount("p", 11)}" value="${player.p.structureData[1]}" oninput="
					if (Decimal.gt(this.value, getBuyableAmount('p', 11).sub(player.p.structureData[2]).sub(player.p.structureData[3]))) {this.value = getBuyableAmount('p', 11).sub(player.p.structureData[2]).sub(player.p.structureData[3]).toString()} player.p.structureData[1] = new Decimal(this.value)
					"/></span>
					<span><input type="range" style="width: 15em" step="1" min="0" max="${getBuyableAmount("p", 11)}" value="${player.p.structureData[2]}" oninput="
					if (Decimal.gt(this.value, getBuyableAmount('p', 11).sub(player.p.structureData[1]).sub(player.p.structureData[3]))) {this.value = getBuyableAmount('p', 11).sub(player.p.structureData[1]).sub(player.p.structureData[3]).toString()} player.p.structureData[2] = new Decimal(this.value)
					"/></span>
					<span><input type="range" style="width: 15em" step="1" min="0" max="${getBuyableAmount("p", 11)}" value="${player.p.structureData[3]}" oninput="
					if (Decimal.gt(this.value, getBuyableAmount('p', 11).sub(player.p.structureData[2]).sub(player.p.structureData[1]))) {this.value = getBuyableAmount('p', 11).sub(player.p.structureData[2]).sub(player.p.structureData[1]).toString()} player.p.structureData[3] = new Decimal(this.value)
					"/></span>
					</div>
				</div>
				<br><br>
				You have ${format(player.p.structureData[1].add(hasUpgrade("r", 12)?getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]):0))} structures to structurally dangerous factories, making post-1000 factory scaling start ${format(tmp.p.effect[1])} later.
				<br>
				You have ${format(player.p.structureData[2].add(hasUpgrade("r", 12)?getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]):0))} structures to furnace smuggling, making factory 1 softcap start ${format(tmp.p.effect[2])} later.
				<br>
				You have ${format(player.p.structureData[3].add(hasUpgrade("r", 12)?getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]):0))} structures dedicated to uncontrolled burning, making post-250 ember speed scaling start ${format(tmp.p.effect[3])} later.`:""
			}]]
		}
	},
	gain() {
		var gain = player.e.oil.pow(0.5).mul(buyableEffect("m", 12)).mul(tmp.mo.wasteEffect.plasticBoost);
		if (player.mo.pollution > 11) gain = gain.div(player.f.embers.add(1).pow(0.5));
		return gain;
	},
	doReset(resettingLayer) {
		if (layers[resettingLayer].row == 1) layerDataReset("p", ["upgrades", "challenges", "buyables", "structureData", "activeChallenge"]);
		else if (resettingLayer == "mo") layerDataReset("p", player.mo.milestones.includes("2")?["upgrades", "challenges", "buyables", "structureData", "activeChallenge"]:[]);
		else if (layers[resettingLayer].row > 1) layerDataReset("p")
	},
	effect() {
		return {
			1: player.p.structureData[1].add(hasUpgrade("r", 12)?getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]):0).mul(5).pow(1.5),
			2: player.p.structureData[2].add(hasUpgrade("r", 12)?getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]):0).pow(1.5).mul(2),
			3: player.p.structureData[3].add(hasUpgrade("r", 12)?getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]):0).pow(1.6).mul(5)
		}
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
			usedBricks: new Decimal(0),
			moChallLeft: new Decimal(0)
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
			return player.m.points.sub(inChallenge("mo", 42)?0:20).max(1).pow(0.01).mul(player.m.points.sub(inChallenge("mo", 42)?0:100).max(1).pow(hasUpgrade("mo", 15)?0.035:0.05))
		},
		gainMult() { // Calculate the multiplier for main currency from bonuses
			mult = new Decimal(1)
			mult = mult.div(tmp.mo.wasteEffect.manuCheap);
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
					return hasUpgrade("f", 13)
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
				description: "Factory 1's interval is reduced to one second.",
				cost() {
					return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:10000;
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
					return `<br><h3>Creates a furnace every ${hasUpgrade("m", 21)?"1 second":"5 seconds"}. (count toward scaling) Fifth level nerfs ore to metal softcap. Also increases furnaces cap.</h3><br>
					<h2>Currently:</h2><h3> ${format(this.effect().div((((!hasUpgrade("m", 21))*4)+1)), 2)}/s</h3>
					<h2>Cost:</h2><h3> ${format(this.cost())} bricks</h3>
					<h3>Furnaces capped at ${format(this.effect().min(inChallenge("mo", 42)?0:tmp.p.effect[2].add(50)).mul(hasUpgrade("m", 22)?100:50).add(this.effect().sub(inChallenge("mo", 42)?0:50).sub(inChallenge("mo", 42)?0:tmp.p.effect[2]).max(0).mul(2500).pow(0.5).floor()).add(1000))}</h3>`
				},
				cost() {
					let T = getBuyableAmount("m", 11).add(getBuyableAmount("m", 12)).add(getBuyableAmount("m", 13)).add(1);
					if (hasUpgrade("mo", 12) && !(inChallenge("mo", 21)||inChallenge("mo", 22))) T = getBuyableAmount("m", 11).add(1);
					let C = T.mul(T.add(1)).mul(T.mul(2).add(1)).mul(2).mul(T.add(2)).mul(Decimal.pow(1.5, T.sub(inChallenge("mo", 42)?0:1000).sub(tmp.p.effect[1]).max(0))).div(hasUpgrade("p", 11)?upgradeEffect("p", 11):1);
					if (inChallenge("mo", 22)) return C.mul(1e9);
					if (hasChallenge("mo", 21)) return C.div(challengeEffect("mo", 21));
					return C;
				},
				buy() {
					if (this.canAfford()) {
						player.m.bricks = player.m.bricks.sub(this.cost())
						player.m.usedBricks = player.m.usedBricks.add(this.cost())
						setBuyableAmount("m", 11, getBuyableAmount("m", 11).add(1))
						player.m.moChallLeft = player.m.moChallLeft.add(1)
					}
				},
				effect() {
					return getBuyableAmount("m", 11)
				},
				canAfford() {
					if (player.m.moChallLeft.gte(100) && inChallenge("mo", 21)) return false;
					if (player.m.moChallLeft.gte(20) && inChallenge("mo", 22)) return false;
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
					if (hasUpgrade("mo", 12) && !(inChallenge("mo", 21)||inChallenge("mo", 22))) T = getBuyableAmount("m", 12).add(5);
					let C = T.mul(T.add(1)).mul(T.mul(2).add(1)).mul(T.mul(3).add(2)).div(5).mul(Decimal.pow(1.5, T.sub(inChallenge("mo", 42)?0:1000).sub(tmp.p.effect[1]).max(0))).div(hasUpgrade("p", 11)?upgradeEffect("p", 11):1);
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
				effect() {
					return Decimal.pow(1e20, getBuyableAmount("m", 12).sub(1).max(0).min(inChallenge("mo", 42)?0:100)).mul(getBuyableAmount("m", 12).sub(inChallenge("mo", 42)?0:100).max(1).pow(10))
				},
				canAfford() {
					if (player.m.moChallLeft.gte(100) && inChallenge("mo", 21)) return false;
					if (player.m.moChallLeft.gte(20) && inChallenge("mo", 22)) return false;
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
					if (hasUpgrade("mo", 12) && !(inChallenge("mo", 21)||inChallenge("mo", 22))) T = getBuyableAmount("m", 13).add(3);
					let C = T.mul(T.add(1)).mul(T.mul(2).add(1)).mul(T.mul(3).add(2)).mul(T.mul(2)).div(20).mul(Decimal.pow(1.5, T.sub(inChallenge("mo", 42)?0:1000).sub(tmp.p.effect[1]).max(0))).div(hasUpgrade("p", 11)?upgradeEffect("p", 11):1);
					if (inChallenge("mo", 22)) return C.mul(1e9);
					if (hasChallenge("mo", 21)) return C.div(challengeEffect("mo", 21));
					return C;
				},
				buy() {
					if (this.canAfford()) {
						player.m.bricks = player.m.bricks.sub(this.cost())
						player.m.usedBricks = player.m.usedBricks.add(this.cost())
						setBuyableAmount("m", 13, getBuyableAmount("m", 13).add(1))
						player.m.moChallLeft = player.m.moChallLeft.add(1)
					}
				},
				effect() {
					return getBuyableAmount("m", 13).add(1).pow(2.5);
				},
				canAfford() {
					if (player.m.moChallLeft.gte(100) && inChallenge("mo", 21)) return false;
					if (player.m.moChallLeft.gte(20) && inChallenge("mo", 22)) return false;
					return player.m.bricks.gte(this.cost())
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
				return true;
			},
			respecText: "Respec factories"
		},
		branches: ["f"],
		tabFormat: {
			"Main": {
				content: ["main-display", "prestige-button", ["upgrade", 15], ["raw-html", "<br>Reach 80 manufacturers to unlock the next layer.<br>"], "milestones", ["raw-html", "<br>"], ["row", [["upgrade", 11], ["upgrade", 12], ["upgrade", 13], ["upgrade", 14]]]]
			},
			"Factories": {
				content: ["main-display", "prestige-button", ["upgrade", 15], ["raw-html", function () {
				return `Reach 80 manufacturers to unlock the next layer.<br><br>You have ${format(player.m.bricks)} bricks. (${format(player.m.active.mul(hasUpgrade("m", 14)?1:0.1).mul(buyableEffect("m", 13)).mul(tmp.mo.effect))}/s)
				<br><br>
				You have ${format(player.m.active)} active manufacturers.
				<br><br>
				Use the below slider to change active manufacturers.
				<br><br>
				<input oninput="player.m.active = new Decimal(this.value)" type="range" min="0" max="${player.m.points}" step="1" style="width: 30em" value="${player.m.active}">
				<br>
				Active manufacturers subtract from the manufacturer effect, but in turn you get bricks to buy factories.
				<br>${
					(inChallenge("mo", 21)||inChallenge("mo", 22))?`The Spacious Factory factory purchases left: ${inChallenge("mo", 21)?Decimal.sub(100, player.m.moChallLeft):Decimal.sub(20, player.m.moChallLeft)}`:""
				}`}
				], "buyables", ["raw-html", `<br>Buying a factory makes all others more expensive. Use the space you have wisely.`], ["row", [["upgrade", 21], ["upgrade", 22], ["upgrade", 23], ["upgrade", 24]]]],
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
					for (var j = 0; j < 40; j++) {
						layers.e.buyables[i].buy()
					}
				}
			}
			if (player.m.autoFlame&&player.m.milestones.includes("2")) layers.f.clickables[11].onClick();
			if (player.m.autoEmber&&player.m.milestones.includes("2")) {
				for (var i = 10; i <= (hasUpgrade("p", 14)?20:10); i += 10) {
					for (var j = 1; j <= (hasUpgrade("p", 14)?2:3); j++) {
						for (var k = 0; k < 40; k++) {
							layers.f.buyables[i+j].buy()
						}
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
			player.f.points = player.f.points.add(Decimal.floor(player.m.furnaceTick/(((!hasUpgrade("m", 21))*4)+1)).mul(buyableEffect("m", 11)));
			player.m.furnaceTick = player.m.furnaceTick%(((!hasUpgrade("m", 21))*4)+1);
			if (hasUpgrade("m", 23)) player.e.burning = true; 
			player.f.points = player.f.points.min(buyableEffect("m", 11).min(tmp.p.effect[2].add(50)).mul(hasUpgrade("m", 22)?100:50).add(buyableEffect("m", 11).sub(50).sub(tmp.p.effect[2]).max(0).mul(2500).pow(0.5).floor()).add(1000));
		},
		doReset(resettingLayer) {
			var keep = [];
			if (layers[resettingLayer].row > 1) {
				if (player.mo.milestones.includes("0")) keep.push("milestones", "autoFurnace", "autoFAlloc", "autoEBuyable", "autoFlame", "autoEmber", "autoManu");
				if (player.mo.milestones.includes("2")) keep.push("upgrades");
				layerDataReset("m", keep)
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
/*addLayer("p", {
	startData() { return {
		unlocked: true,
		points: new Decimal(0),
	}},
	color: "#4BDC13",
	resource: "prestige points",
	row: 0,
	position: 0,
	baseResource: "points",
	baseAmount() { return player.points },
	requires: new Decimal(10),
	type: "normal",
	exponent: 0.5,
	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},

	layerShown() { return true }
})*/
addLayer("r", {
	name: "research",
	startData() { return {
		unlocked: true,
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
	color: "#3366ff",
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
		return hasUpgrade("r", 12)?0.15:0.3
	},
	base: 100,
	canBuyMax: true,
	gainMult() {
		return new Decimal(hasChallenge("mo", 42)?"1e-100000":1)
	},
	gainExp() {
		return new Decimal(1)
	},
	layerShown() { return hasUpgrade("mo", 23) },
	doReset(resettingLayer) {
		if (layers[resettingLayer].row > 2) layerDataReset("r");
	},
	upgrades: {
		rows: 2,
		cols: 3,
		11: {
			title: "Singular Research 1",
			description: "Power stations reset nothing.",
			cost: 1e17,
			style: {
				height: "200px",
				width: "200px"
			}
		},
		12: {
			title: "Singular Research 2",
			description: "Free Plastic Strucutres add free levels to all structures, and autobuy plastic structures. Swindles the goverment into giving you infinity space for plastic structures instead of the 20 cap.",
			cost: 1e18,
			style: {
				height: "200px",
				width: "200px"
			}
		},
		13: {
			title: "Singular Research 3",
			description: "Automatically research, and researching resets nothing. Research point gain is much better, and halve all research times.",
			cost: 1e29,
			style: {
				height: "200px",
				width: "200px"
			}
		},
		21: {
			title: "Singular Research 4",
			description: "Unlock automatic research.",
			cost: 3e41,
			style: {
				height: "200px",
				width: "200px"
			}
		},
		22: {
			title: "Singular Research 5",
			description: "Autobuy electric buyables, and they don't subtract from the electricity amount. Electric buyables are also much cheaper.",
			cost: 1e44,
			style: {
				height: "200px",
				width: "200px"
			}
		},
		23: {
			title: "Singular Research 6",
			description: "Scientists are much cheaper.",
			cost: 3e44,
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
				return `<h3>Purchase a scientist.</h3><br>
				<h3>You have ${format(player.r.buyables[31])} scientists.</h3><br>
				<h3>Cost: ${format(tmp.r.buyables[31].cost)} research points</h3>`
			},
			cost() {
				return Decimal.pow(1000, player.r.buyables[31].pow(hasUpgrade("r", 23)?1.05:1.25)).mul(1e10);
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
				return `<h3>Boosts ore generation.</h3><br>
				${player.r.allocated.gte(1)?`<h3>Research time: ${format(player.r.researchTReq[11])}s</h3>`:""}
				<h3>Currently: ${format(player.r.buyables[11], 0)} researches</h3>
				<h3>Effect: ${format(tmp.r.buyables[11].effect)}</h3>
				${player.r.researchScientists[11].gt(0)?`<h3>Time left: ${format(Math.max(player.r.researchTReq[11]-player.r.researchTimes[11], 0))}s</h3>`:""}`
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
				return `<h3>Boosts electricity generation.</h3><br>
				${player.r.allocated.gte(1)?`<h3>Research time: ${format(player.r.researchTReq[12])}s</h3>`:""}
				<h3>Currently: ${format(player.r.buyables[12], 0)} researches</h3>
				<h3>Effect: ${format(tmp.r.buyables[12].effect)}</h3>
				${player.r.researchScientists[12].gt(0)?`<h3>Time left: ${format(Math.max(player.r.researchTReq[12]-player.r.researchTimes[12], 0))}s</h3>`:""}`
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
				return `<h3>Boosts heat generation.</h3><br>
				${player.r.allocated.gte(1)?`<h3>Research time: ${format(player.r.researchTReq[13])}s</h3>`:""}
				<h3>Currently: ${format(player.r.buyables[13], 0)} researches</h3>
				<h3>Effect: ${format(tmp.r.buyables[13].effect)}</h3>
				${player.r.researchScientists[13].gt(0)?`<h3>Time left: ${format(Math.max(player.r.researchTReq[13]-player.r.researchTimes[13], 0))}s</h3>`:""}`
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
				return `<h3>Boosts oil generation.</h3><br>
				${player.r.allocated.gte(1)?`<h3>Research time: ${format(player.r.researchTReq[21])}s</h3>`:""}
				<h3>Currently: ${format(player.r.buyables[21], 0)} researches</h3>
				<h3>Effect: ${format(tmp.r.buyables[21].effect)}</h3>
				${player.r.researchScientists[21].gt(0)?`<h3>Time left: ${format(Math.max(player.r.researchTReq[21]-player.r.researchTimes[21], 0))}s</h3>`:""}`
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
				return player.r.allocated.gte(1)&&player.r.researchScientists[21].eq(0)&&player.r.buyables[13].lt(50);
			},
			effect() {
				return Decimal.pow("1e2000", player.r.buyables[21].pow(0.5))
			}
		},
		22: {
			title: "Research 5",
			display() {
				return `<h3>Boosts extractor gain.</h3><br>
				${player.r.allocated.gte(1)?`<h3>Research time: ${format(player.r.researchTReq[22])}s</h3>`:""}
				<h3>Currently: ${format(player.r.buyables[22], 0)} researches</h3>
				<h3>Effect: ${format(tmp.r.buyables[22].effect)}</h3>
				${player.r.researchScientists[22].gt(0)?`<h3>Time left: ${format(Math.max(player.r.researchTReq[22]-player.r.researchTimes[22], 0))}s</h3>`:""}`
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
				return player.r.allocated.gte(1)&&player.r.researchScientists[22].eq(0);
			},
			effect() {
				return Decimal.pow("1e5000", player.r.buyables[22].pow(0.3))
			}
		},
		23: {
			title: "Research 6",
			display() {
				return `<h3>Boosts all waste generations.</h3><br>
				${player.r.allocated.gte(1)?`<h3>Research time: ${format(player.r.researchTReq[23])}s</h3>`:""}
				<h3>Currently: ${format(player.r.buyables[23], 0)} researches</h3>
				<h3>Effect: ${format(tmp.r.buyables[23].effect)}</h3>
				${player.r.researchScientists[23].gt(0)?`<h3>Time left: ${format(Math.max(player.r.researchTReq[23]-player.r.researchTimes[23], 0))}s</h3>`:""}`
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
				return player.r.buyables[23].add(1).pow(2)
			}
		}
	},
	tabFormat: {
		"Main researches": {
			content: ["main-display", "prestige-button", ["buyable", 31], ["raw-html", _=>{
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
				text: "Singular Research 4 automation",
				show: hasUpgrade("r", 21),
				options: ["disabled", "1", "2", "3", "4", "5", "6"],
				internalName: "autoResearch"
			}}], "buyables"]
		},
		"One-time researches": {
			content: ["main-display", "prestige-button", "upgrades", ["research-dropdown", _=>{ return {
				text: "Singular Research 4 automation",
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
						player.r.free = player.r.researchScientists[i+j];
						player.r.researchScientists[i+j] = new Decimal(0);
						player.r.researchTimes[i+j] = 0;
					}
				}
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
	resetsNothing() {
		return hasUpgrade("r", 13)
	},
	effect() {
		return player.r.points.add(100).log(100)
	},
	effectDescription() {
		return `boosting monopoly power gain by ${format(tmp.r.effect)}`
	}
})
function updateTimes() {
	if (!player.r.researchScientists[11].gte(1)) player.r.researchTReq[11] = Math.max(300/toNumber(player.r.allocated.pow(1.2))/(hasUpgrade("r", 13)?2:1), 0.5);
	if (!player.r.researchScientists[12].gte(1)) player.r.researchTReq[12] = Math.max(500/toNumber(player.r.allocated.pow(1.2))/(hasUpgrade("r", 13)?2:1), 0.5);
	if (!player.r.researchScientists[13].gte(1)) player.r.researchTReq[13] = Math.max(500/toNumber(player.r.allocated.pow(1.2))/(hasUpgrade("r", 13)?2:1), 0.5);
	if (!player.r.researchScientists[21].gte(1)) player.r.researchTReq[21] = Math.max(300/toNumber(player.r.allocated.pow(1.2))/(hasUpgrade("r", 13)?2:1), 0.5);
	if (!player.r.researchScientists[22].gte(1)) player.r.researchTReq[22] = Math.max(450/toNumber(player.r.allocated.pow(1.2))/(hasUpgrade("r", 13)?2:1), 0.5);
	if (!player.r.researchScientists[23].gte(1)) player.r.researchTReq[23] = Math.max(1000/toNumber(player.r.allocated.pow(1.2))/(hasUpgrade("r", 13)?2:1), 0.5);
}
addLayer("ps", {
	name: "power station",
	startData() { return {
		unlocked: true,
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
		return new Decimal(1)
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
			}
		},
		13: {
			title: "More Current, More Destruction",
			description: "Amps has a better effect.",
			cost: 1e10,
			currencyDisplayName: "heat",
			currencyLayer: "ps",
			currencyInternalName: "heat"
		}
	},
	buyables: {
		rows: 1,
		cols: 2,
		11: {
			title: "Current",
			display() {
				return `<h3>Increase the current coming from your power stations.</h3><br>
				<h3>Currently: ${format(tmp.ps.buyables[11].effect)} amps</h3>
				<h3>Cost: ${format(tmp.ps.buyables[11].cost)}</h3>
				<h3>Effect: x${format(tmp.ps.buyables[11].effect)} to electricity and heat</h3>`
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
				return Decimal.pow(hasUpgrade("r", 22)?3:5, player.ps.buyables[11].pow(hasUpgrade("r", 22)?1.01:1.1)).mul(10000)
			}
		},
		12: {
			title: "Resistance",
			display() {
				return `<h3>Increase the resistance to produce more heat.</h3><br>
				<h3>Currently: ${format(player.ps.buyables[12].add(1))} ohms</h3>
				<h3>Cost: ${format(tmp.ps.buyables[12].cost)}</h3>
				<h3>Effect: ${format(tmp.ps.buyables[12].effect)} to heat</h3>`
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
				return Decimal.pow(hasUpgrade("r", 22)?5:7, player.ps.buyables[12].pow(hasUpgrade("r", 22)?1.01:1.1)).mul(100000)
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
	layerShown() { return hasUpgrade("mo", 23) },
	tabFormat: {
		"Main": {
			content: ["main-display", "prestige-button", ["raw-html", _=>{
				return `You have ${format(player.ps.electric)} electricity, producing ${format(tmp.ps.heatProduction)} heat per second.<br>You are producing ${format(tmp.ps.electricProduction)} electricity per second. (boosted by oil burning)
				${player.mo.burningWaste.gt(0)?`<br>This is further boosted by your burning waste, providing a ${format(tmp.mo.wasteEffect.electricBoost)} multiplier to electricity gain.<br>
				You have ${format(player.ps.heat)} heat, boosting ember production by ${format(tmp.ps.effect.emberBoost)}, and multiplying point speed base by ${format(tmp.ps.effect.pointSpeedBoost)}`:""}`
			}], "milestones", "buyables", "upgrades"]
		}
	},
	branches: ["f", "mo"],
	effect() {
		return {
			emberBoost: player.ps.heat.pow(20).add(1),
			pointSpeedBoost: player.ps.heat.pow(10).add(1)
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
			layerDataReset("ps");
		}
	}
})
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
			greenhouse: new Decimal(0)
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
					return player.mo.total.min(inChallenge("mo", 42)?0:Decimal.pow(4, 4)).add(4).log(4).add(player.mo.total.add(40).log(40)).pow(0.2).pow(hasChallenge("mo", 41)?1.1:1).mul((player.mo.pollution&&hasUpgrade("mo", 25))?2:1)
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
				}
			},
			14: {
				title: "Perpetual Monopoly",
				description: "Improve the 5th milestone to gain 200%.",
				cost: 400
			},
			15: {
				title: "Monopoly Over Manufacturing",
				description: "Post-100 manufacturer exponent scaling is 30% weaker.",
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
				cost: 1000000,
				unlocked() {
					return hasChallenge("mo", 32)
				}
			},
			23: {
				title: "Layers of Not Horrendousness",
				description: "Unlock two new layers.",
				cost: 5000000,
				unlocked() {
					return hasChallenge("mo", 32)
				}
			},
			24: {
				title: "Ores are Trash",
				description: "Waste boosts ore gain.",
				cost: 2000,
				currencyDisplayName: "waste",
				currencyLayer: "mo",
				currencyInternalName: "waste",
				unlocked() {
					return player.mo.waste.gt(10)||hasUpgrade("mo", 24)
				},
				effect() {
					return player.mo.waste.add(1).pow(1000);
				}
			},
			25: {
				title: "Polluted Monopoly",
				description: "<b>Corruptions</b> is 2x stronger in pollutions (<b>Rioting</b> is quartered from phase Ⅱ onwards).",
				cost: 100,
				currencyDisplayName: "burning waste",
				currencyLayer: "mo",
				currencyInternalName: "burningWaste",
				unlocked() {
					return player.mo.burningWaste.gt(10)||hasUpgrade("mo", 25)
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
			}
		},
		buyables: {
			rows: 3,
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
					var eff = player.mo.buyables[11];
					eff = eff.div(100).pow(0.5);
					eff = eff.mul(tmp.mo.wasteEffect.wasteBoost).mul(tmp.r.buyables[23].effect);
					return eff;
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
					var eff = player.mo.buyables[12];
					eff = eff.div(1000).pow(0.4);
					eff = eff.mul(tmp.mo.wasteEffect.burningWasteBoost).mul(tmp.r.buyables[23].effect);
					return eff;
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
					var eff = player.mo.buyables[13];
					eff = eff.pow(0.3).div(100).mul(tmp.r.buyables[23].effect);
					if (hasUpgrade("ps", 11)) eff = eff.mul(10);
					return eff;
				},
				unlocked() {
					return player.ps.unlocked
				}
			}
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
					return player.mo.points.pow(0.3)
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
				challengeDescription: "You can buy a total of only 20 upgrades across the previous nodes.",
				goal: new Decimal("1e60000"),
				rewardDescription: "Multiply ore gain based on MP.",
				rewardEffect() {
					return player.mo.points.add(1).pow(10);
				},
				currencyDisplayName: "ores",
				currencyInternalName: "points"
			},
			32: {
				name: "The Upgrade Factory Ⅱ",
				challengeDescription: "Multiply ore gain by 1e400, but you cannot buy any upgrades past row 1 of any layer.",
				goal: new Decimal("1e2270"),
				rewardDescription: "Unlock more monopoly upgrades.",
				currencyDisplayName: "ores",
				currencyInternalName: "points"
			},
			41: {
				name: "Socialism Ⅰ",
				challengeDescription: "<b>Corruptions</b> exponent is always 0.2.",
				goal: new Decimal("1e22400"),
				rewardDescription: "Raise <b>Corruptions</b> to the 1.1th power.",
				currencyDisplayName: "ores",
				currencyInternalName: "points",
				unlocked() {
					return hasUpgrade("mo", 26)
				}
			},
			42: {
				name: "Socialism Ⅱ",
				challengeDescription: "Also all softcaps and scaling start at 0 now.",
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
				content: ["main-display", "prestige-button", ["raw-html", () => {return `You have ${format(player.mo.total)} total monopoly power.<br>`}], "milestones", ["raw-html", "<br>"], "upgrades"]
			},
			"Competitors": {
				content: ["main-display", "prestige-button", ["raw-html", "<br><br><h1>Competitors</h1><br>Wait, they still exist?"], "challenges"],
				unlocked() {
					return player.mo.total.gte(250)
				}
			},
			"Pollutions": {
				content: ["main-display", "prestige-button", ["raw-html", _=> {
					return `<br>You have ${format(player.mo.waste)} waste, boosting plastic gain by ${format(tmp.mo.wasteEffect.plasticBoost)} and making manufacturers cheaper by /${format(tmp.mo.wasteEffect.manuCheap)}.<br><br>
					You have ${format(player.mo.burningWaste)} burning waste, boosting waste gain by ${format(tmp.mo.wasteEffect.wasteBoost)}.<br>
					You have ${format(player.mo.greenhouse)} greenhouse gas, boosting burning waste gain by ${format(tmp.mo.wasteEffect.burningWasteBoost)},
					and raising all waste effects to ^${format(tmp.mo.wasteEffect.wasteExponent)}.<br><br><h2>Pollutions</h2>`
				}], "buyables"],
				unlocked() {
					return hasUpgrade("mo", 22)
				}
			}
		},
		automate() {
			if (player.mo.autoFac&&(!inChallenge("mo", 21))&&(!inChallenge("mo", 22))&&hasUpgrade("m", 13)) {
				for (var i = 11; i <= 13; i++) {
					layers.m.buyables[i].buy();
					layers.m.buyables[i].buy();
					layers.m.buyables[i].buy();
					layers.m.buyables[i].buy();
					layers.m.buyables[i].buy();
					layers.m.buyables[i].buy();
					layers.m.buyables[i].buy();
					layers.m.buyables[i].buy();
				}
			}
		},
		wasteEffect() {
			return {
				plasticBoost: player.mo.waste.pow(400).add(1).pow(tmp.mo.wasteEffect.wasteExponent),
				manuCheap: player.mo.waste.pow(500).add(1).pow(tmp.mo.wasteEffect.wasteExponent),
				wasteBoost: player.mo.burningWaste.add(1).pow(0.5),
				electricBoost: player.mo.burningWaste.add(1.2).log(1.2),
				burningWasteBoost: player.mo.greenhouse.pow(0.75),
				wasteExponent: player.mo.greenhouse.add(20).log(20)
			}
		},
		resetsNothing: false,
		update(diff) {
			if (player.mo.milestones.includes("4")&&!player.mo.activeChallenge) addPoints("mo", tmp.mo.resetGain.mul(hasUpgrade("mo", 14)?2:0.1).mul(diff));
			player.mo.waste = player.mo.waste.add(tmp.mo.buyables[11].effect.mul(diff));
			player.mo.burningWaste = player.mo.burningWaste.add(tmp.mo.buyables[12].effect.mul(diff));
			player.mo.greenhouse = player.mo.greenhouse.add(tmp.mo.buyables[13].effect.mul(diff));
			if (inChallenge("mo", 31)&&!player.mo.chall31TestValue) {
				doReset("mo", true);
				player.e.upgrades = [];
				player.f.upgrades = [];
				player.p.upgrades = [];
				player.m.upgrades = [];
				player.mo.chall31TestValue = true;
			} else if (!inChallenge("mo", 31)&&player.mo.chall31TestValue) {
				player.mo.chall31TestValue = false;
			}
			if (inChallenge("mo", 32)&&!player.mo.chall32TestValue) {
				doReset("mo", true);
				player.e.upgrades = [];
				player.f.upgrades = [];
				player.p.upgrades = [];
				player.m.upgrades = [];
				player.mo.chall32TestValue = true;
			} else if (!inChallenge("mo", 32)&&player.mo.chall32TestValue) {
				player.mo.chall32TestValue = false;
			}
			if (player.ps.pollution > 12) {
				player.e.points = player.e.points.div(Decimal.pow(100000, diff));
				player.p.points = player.p.points.div(Decimal.pow(100000, diff));
				player.m.bricks = player.m.bricks.div(Decimal.pow(100000, diff));
				player.points = player.points.div(Decimal.pow(100000, diff));
			}
		}
})