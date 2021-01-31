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
	metal() {
		var notAsSoft = [Decimal.pow(2, player.f.allocated.min(hasUpgrade("f", 52)?28:16)),
		Decimal.pow(1.2, player.f.allocated.sub(hasUpgrade("f", 52)?28:16).min(hasUpgrade("f", 52)?28:16).max(0)),
		player.f.allocated.sub(hasUpgrade("f", 52)?56:32).max(1).pow(0.3)];

		var soft = Decimal.pow(1.4, player.f.allocated.min(inChallenge("mo", 42)?0:2000)).mul(player.f.allocated.sub(inChallenge("mo", 42)?0:1999).max(1).pow(2.5));

		var f13upg = hasUpgrade("f", 13)?upgradeEffect("f", 13):1;

		return (getBuyableAmount("m", 11).gte(5)?soft:notAsSoft[0].mul(notAsSoft[1]).mul(notAsSoft[2])).mul(0.003).mul(f13upg).pow(tmp.mo.wasteEffect.metalGain);
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
				<span style="font-size: 12px">Currently: ${`${format(getBuyableAmount("f", 11), 0)}${getBuyableAmount("f", 12).eq(0)?
				"":
				`+${format(getBuyableAmount("f", 12).mul(1.5).add(getBuyableAmount("f", 13).mul(2)).add((hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor())))}`}`}</h3>
				Cost: ${format(this.cost())} fiery embers
				Effect: x${format(this.effect())}</span>`
			},
			cost(val=player.f.buyables[11]) {
				return Decimal.pow(4, val.sub(50).max(0).pow(hasUpgrade("f", 34)?2:3).div(hasUpgrade("f", 34)?5:3).add(val.pow(hasUpgrade("f", 34)?1.5:2).div(hasUpgrade("f", 34)?6:4).add(val).mul(tmp.f.flameEffect))).mul(100).mul(hasUpgrade("f", 34)?upgradeEffect("f", 34):1)
			},
			buy() {
				if (this.canAfford()) {
					player.f.embers = player.f.embers.sub(this.cost())
					setBuyableAmount("f", 11, getBuyableAmount("f", 11).add(1))
				}
			},
			buyMax() {
				if (!this.canAfford()) return;
				var search = 1;
				var iter = 0;
				var old = player.f.buyables[this.id];
				while (this.canAfford()) {
					player.f.buyables[this.id] = player.f.buyables[this.id].add(search);
					search *= 2;
				}
				while (!(!this.canAfford()&&this.canAfford(player.f.buyables[this.id].sub(1))) && iter < 10000) {
					search /= 2;
					if (this.canAfford()) player.f.buyables[this.id] = player.f.buyables[this.id].add(Math.ceil(search));
					else player.f.buyables[this.id] = player.f.buyables[this.id].sub(Math.ceil(search));
					iter++;
				}
				if (iter >= 10000) player.f.buyables[this.id] = old;
			},
			effect() {
				return Decimal.pow(Decimal.mul(1.5, hasUpgrade("f", 42)?1.1:1), getBuyableAmount("f", 11).add(getBuyableAmount("f", 12).mul(1.5).add(getBuyableAmount("f", 13).mul(2).add(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor()))))
			},
			canAfford(val=player.f.buyables[11]) {
				return player.f.embers.gte(this.cost(val))
			},
			style() {
				return {backgroundColor: this.canAfford()?"#ff440077":"#ff000044"}
			}
		},
		12: {
			title: "Ember speed",
			display() {
				return `<br><br><h3>Boost ember gain, and gives extra levels to the previous upgrade.</h3><br>
				<span style="font-size: 12px">Currently: ${`${format(getBuyableAmount("f", 12), 0)}${getBuyableAmount("f", 13).eq(0)?
				"":
				`+${format(getBuyableAmount("f", 13).mul(0.25).add(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor()))}`}`}</h3>
				Cost: ${format(this.cost())} fiery embers
				Effect: x${format(this.effect())}</span>`
			},
			cost(val=player.f.buyables[12]) {
				return Decimal.pow(11.5, val.sub(inChallenge("mo", 42)?0:250).sub(inChallenge("mo", 42)?0:tmp.p.effect[3]).max(0).pow(6).add(val.pow(hasUpgrade("f", 34)?2.4:4).div(10)).add(val).mul(tmp.f.flameEffect)).mul(10000).mul(hasUpgrade("f", 34)?upgradeEffect("f", 34):1)
			},
			buy() {
				if (this.canAfford()) {
					player.f.embers = player.f.embers.sub(this.cost())
					setBuyableAmount("f", 12, getBuyableAmount("f", 12).add(1))
				}
			},
			buyMax() {
				if (!this.canAfford()) return;
				var search = 1;
				var iter = 0;
				var old = player.f.buyables[this.id];
				while (this.canAfford()) {
					player.f.buyables[this.id] = player.f.buyables[this.id].add(search);
					search *= 2;
				}
				while (!(!this.canAfford()&&this.canAfford(player.f.buyables[this.id].sub(1))) && iter < 10000) {
					search /= 2;
					if (this.canAfford()) player.f.buyables[this.id] = player.f.buyables[this.id].add(Math.ceil(search));
					else player.f.buyables[this.id] = player.f.buyables[this.id].sub(Math.ceil(search));
					iter++;
				}
				if (iter >= 10000) player.f.buyables[this.id] = old;
			},
			effect() {
				return new Decimal(hasUpgrade("f", 61)?10:2).mul((hasChallenge("mo", 12)*4)+1).pow(getBuyableAmount("f", 12).add(getBuyableAmount("f", 13).mul(0.25).add(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor())))
			},
			canAfford(val=player.f.buyables[12]) {
				return player.f.embers.gte(this.cost(val))
			},
			style() {
				return {backgroundColor: this.canAfford()?"#ff440077":"#ff000044"}
			}
		},
		13: {
			title: "Point speed",
			display() {
				return `<br><br><h3>Boost point gain, and gives extra levels to the previous upgrades.</h3><br>
				<span style="font-size: 12px">Currently: ${format(getBuyableAmount("f", 13), 0)}${(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor()).gt(0)?`+${format(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor())}`:""}</h3>
				Cost: ${format(this.cost())} fiery embers
				Effect: ${format(this.effect())}</span>`
			},
			cost(val=player.f.buyables[13]) {
				return Decimal.pow(10, val.sub(inChallenge("mo", 42)?0:(hasUpgrade("f", 34)?15:10)).max(0).pow(hasUpgrade("f", 34)?2.6:4.5).add(val.pow(hasUpgrade("f", 34)?1.8:3).div(hasUpgrade("f", 34)?8:5).add(val).mul(tmp.f.flameEffect))).mul(500000).mul(hasUpgrade("f", 34)?upgradeEffect("f", 34):1)
			},
			buy() {
				if (this.canAfford()) {
					player.f.embers = player.f.embers.sub(this.cost())
					setBuyableAmount("f", 13, getBuyableAmount("f", 13).add(1))
				}
			},
			buyMax() {
				if (!this.canAfford()) return;
				var search = 1;
				var iter = 0;
				var old = player.f.buyables[this.id];
				while (this.canAfford()) {
					player.f.buyables[this.id] = player.f.buyables[this.id].add(search);
					search *= 2;
				}
				while (!(!this.canAfford()&&this.canAfford(player.f.buyables[this.id].sub(1))) && iter < 10000) {
					search /= 2;
					if (this.canAfford()) player.f.buyables[this.id] = player.f.buyables[this.id].add(Math.ceil(search));
					else player.f.buyables[this.id] = player.f.buyables[this.id].sub(Math.ceil(search));
					iter++;
				}
				if (iter >= 10000) player.f.buyables[this.id] = old;
			},
			effect() {
				var mult = new Decimal(hasUpgrade("f", 23)?1e5:1);
				if (hasUpgrade("f", 23) && hasUpgrade("f", 24)) mult = mult.mul(upgradeEffect("f", 24));
				return Decimal.pow(mult.mul(1e25), getBuyableAmount("f", 13).add(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor()))
			},
			canAfford(val=player.f.buyables[13]) {
				return player.f.embers.gte(this.cost(val))
			},
			style() {
				return {backgroundColor: this.canAfford()?"#ff440077":"#ff000044"}
			}
		},
		21: {
			title: "Point speed",
			display() {
				return `<br><br><h3>Boost point gain, and gives extra levels to the previous upgrades.</h3><br>
				<span style="font-size: 12px">Currently: ${format(getBuyableAmount("f", 13), 0)}${(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor()).gt(0)?`+${format(hasUpgrade("m", 23)?player.e.burnEffect.add(2).log(2).log(2).floor():player.e.burnEffect.add(2).log(2).log(3).floor())}`:""}</h3>
				Cost: ${format(this.cost())} fiery embers
				Effect: ${format(this.effect())}</span>`
			},
			cost() {
				return Decimal.pow(10, getBuyableAmount("f", 13).sub(inChallenge("mo", 42)?0:(hasUpgrade("f", 34)?15:10)).max(0).pow(hasUpgrade("f", 34)?2.6:4.5).add(getBuyableAmount("f", 13).pow(hasUpgrade("f", 34)?1.8:3).div(hasUpgrade("f", 34)?8:5).add(getBuyableAmount("f", 13)).mul(tmp.f.flameEffect))).mul(500000).mul(hasUpgrade("f", 34)?upgradeEffect("f", 34):1)
			},
			buy() {
				if (this.canAfford()) {
					player.f.embers = player.f.embers.sub(this.cost())
					setBuyableAmount("f", 13, getBuyableAmount("f", 13).add(1))
				}
			},
			buyMax() {
				layers.f.buyables[13].buyMax();
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
				return {backgroundColor: this.canAfford()?"#ff440077":"#ff000044"}
			}
		},
		22: {
			title: "Ember Derivatives",
			display() {
				return `<br><br><h3>Raise Ember gain to an exponent.</h3><br>
				<span style="font-size: 12px">Currently: ${format(getBuyableAmount("f", 22), 0)}</h3>
				Cost: ${format(this.cost())} fiery embers
				Effect: ^${format(this.effect())}</span>`
			},
			cost(val=player.f.buyables[22]) {
				return Decimal.pow(val.add(1).pow(0.5).add(19), val.pow(3).mul(tmp.f.flameEffect)).mul("1e500").mul(hasUpgrade("f", 34)?upgradeEffect("f", 34):1)
			},
			buy() {
				if (this.canAfford()) {
					player.f.embers = player.f.embers.sub(this.cost())
					setBuyableAmount("f", 22, getBuyableAmount("f", 22).add(1))
				}
			},
			buyMax() {
				if (!this.canAfford()) return;
				var search = 1;
				var iter = 0;
				var old = player.f.buyables[this.id];
				while (this.canAfford()) {
					player.f.buyables[this.id] = player.f.buyables[this.id].add(search);
					search *= 2;
				}
				while (!(!this.canAfford()&&this.canAfford(player.f.buyables[this.id].sub(1))) && iter < 10000) {
					search /= 2;
					if (this.canAfford()) player.f.buyables[this.id] = player.f.buyables[this.id].add(Math.ceil(search));
					else player.f.buyables[this.id] = player.f.buyables[this.id].sub(Math.ceil(search));
					iter++;
				}
				if (iter >= 10000) player.f.buyables[this.id] = old;
			},
			effect() {
				return getBuyableAmount("f", 22).mul(0.05).add(1)
			},
			canAfford(val=player.f.buyables[22]) {
				return player.f.embers.gte(this.cost(val))
			},
			style() {
				return {backgroundColor: this.canAfford()?"#ff440077":"#ff000044"}
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
				${format(player.f.embers)} / ${format(this.cost())} fiery embers</span>`
			},
			canClick(val = player.f.flame) {
				return player.f.embers.gte(this.cost(val))
			},
			onClick(max = false) {
				if (player.f.embers.gte(this.cost())) {
					if (max) {
						var search = 1;
						while (this.canClick()) {
							player.f.flame = player.f.flame.add(search);
							search *= 2;
						}
						while (!(!this.canClick()&&this.canClick(player.f.flame.sub(1)))) {
							search /= 2;
							if (this.canClick()) player.f.flame = player.f.flame.add(Math.ceil(search));
							else player.f.flame = player.f.flame.sub(Math.ceil(search));
						}
						return;
					}
					player.f.embers = player.f.embers.sub(this.cost());
					player.f.flame = player.f.flame.add(1);
				}
			},
			cost(val=player.f.flame) {
				return Decimal.pow(20, val.pow(2).div(hasUpgrade("f", 41)?4:2)).mul(5e8).div(hasUpgrade("f", 33)?upgradeEffect("f", 33):1).pow(hasUpgrade("f", 62)?Decimal.div(1, upgradeEffect("f", 62)):1);
			},
			style(){
				return {
					height: "120px",
					width: "180px",
					borderRadius: "25%",
					border: "4px solid",
					borderColor: "rgba(0, 0, 0, 0.125)",
					backgroundColor: this.canClick()?"#ff660077":"#ff000044",
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
			description: `Gain x% of extractor gain per second based on your active furnaces.`,
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
				if (hasUpgrade("r", 14)) embergain = embergain.mul(upgradeEffect("r", 14));
				return embergain;
			},
			effectDisplay() {
				return `${format(this.effect())} fiery embers/s`
			}
		},
		22: {
			title: "Lava",
			description: `Multiply ember gain by extractors.`,
			cost() {
				if (inChallenge("mo", 32)) return Infinity;
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:25
			},
			unlocked() {
				return getBuyableAmount("f", 11).gte(5)||hasUpgrade("m", 11)||inChallenge("mo", 31)
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
			},
			effectDisplay() {
				return `x${format(this.effect())}`
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
			},
			effectDisplay() {
				return `x${format(this.effect())}`
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
			title: "Steel",
			description: "Make metal gain better, and boost extractor gain based on furnaces.",
			cost() {
				if (inChallenge("mo", 32)) return Infinity;
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:157;
			},
			unlocked() {
				return player.m.milestones.includes("3")
			},
			effect() {
				return Decimal.pow(2, player.f.points)
			},
			effectDisplay() {
				return `x${format(this.effect())}`
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
				return `+${format(this.effect())}`
			}
		},
		54: {
			title: "Timewall gaming",
			description: "Cheapen furnaces based on time spent in row 2 reset.",
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
				return player.f.flame.gt(1)||hasUpgrade("f", 31)||hasUpgrade("f",  32)||inChallenge("mo", 31)
			},
			currencyDisplayName: "flame",
			currencyInternalName() {
				return "flame"
			},
			currencyLayer() {
				return "f"
			},
			style() {
				return {backgroundColor: hasUpgrade("f", 31)?"#00ff0044":(player.f.flame.gte(this.cost())?"#ff660077":"#ff333366")}
			}
		},
		32: {
			title: "Static Boost",
			description: "Boost ember gain by x100.",
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:3;
			},
			unlocked() {
				return player.f.flame.gt(1)||hasUpgrade("f", 31)||hasUpgrade("f", 32)||inChallenge("mo", 31)
			},
			currencyDisplayName: "flame",
			currencyInternalName() {
				return "flame"
			},
			currencyLayer() {
				return "f"
			},
			style() {
				return {backgroundColor: hasUpgrade("f", 32)?"#00ff0044":(player.f.flame.gte(this.cost())?"#ff660077":"#ff333366")}
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
				return (hasUpgrade("f", 31)&&hasUpgrade("f", 32))||inChallenge("mo", 31)
			},
			currencyDisplayName: "flame",
			currencyInternalName() {
				return "flame"
			},
			currencyLayer() {
				return "f"
			},
			style() {
				return {backgroundColor: hasUpgrade("f", 41)?"#00ff0044":(player.f.flame.gte(this.cost())?"#ff660077":"#ff333366")}
			}
		},
		42: {
			title: "Ember boost boost",
			description: "Multiply the base of Ember Boost by 1.1.",
			cost() {
				if (inChallenge("mo", 32)) return Infinity;
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:7;
			},
			unlocked() {
				return (hasUpgrade("f", 31)&&hasUpgrade("f", 32))||inChallenge("mo", 31)
			},
			currencyDisplayName: "flame",
			currencyInternalName() {
				return "flame"
			},
			currencyLayer() {
				return "f"
			},
			style() {
				return {backgroundColor: hasUpgrade("f", 42)?"#00ff0044":(player.f.flame.gte(7)?"#ff660077":"#ff333366")}
			}
		},
		33: {
			title: "Bribed, uh, flames?",
			description: "Embers cheapen flames.",
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:9;
			},
			unlocked() {
				return (hasUpgrade("f", 41)&&hasUpgrade("f", 42))||inChallenge("mo", 31)
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
				return {backgroundColor: hasUpgrade("f", 33)?"#00ff0044":(player.f.flame.gte(this.cost())?"#ff660077":"#ff333366")}
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
				return {backgroundColor: hasUpgrade("f", 43)?"#00ff0044":(player.f.flame.gte(this.cost())?"#ff660077":"#ff333366")}
			}
		},
		34: {
			title: "Even Flamier",
			description: "Flame cheapen buyables, and all cost scalings scale better.",
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:17;
			},
			unlocked() {
				return player.m.milestones.includes("3")
			},
			effect() {
				return Decimal.pow(2, tmp.f.flameEffect.recip()).recip().pow(6)
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
				return {backgroundColor: hasUpgrade("f", 34)?"#00ff0044":(player.f.flame.gte(this.cost())?"#ff660077":"#ff333366")}
			}
		},
		44: {
			title: "Extracting Flames",
			description: "Flame also make cheapen extractor buyables.",
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
				return {backgroundColor: hasUpgrade("f", 44)?"#00ff0044":(player.f.flame.gte(this.cost())?"#ff660077":"#ff333366")}
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
				return {backgroundColor: hasUpgrade("f", 61)?"#00ff0044":(player.f.flame.gte(this.cost())?"#ff660077":"#ff333366")}
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
				return {backgroundColor: hasUpgrade("f", 62)?"#00ff0044":(player.f.flame.gte(this.cost())?"#ff660077":"#ff333366")}
			},
			effect() {
				return player.e.burnEffect.add(10).log(10).add(9).log(10).pow(0.3)
			},
			effectDisplay() {
				return `^1/${format(this.effect())}`
			}
		}
	},
	hotkeys: [{key: "f", description: "f: Reset for furnaces", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
	{key: "F", description: "shift+f: Buy flame", onPress() {layers.f.clickables[11].onClick()}, unlocked() {return tmp.f.clickables[11].unlocked}}],
	layerShown(){return player.e.milestones.includes("0")||layers.m.layerShown()},
	tabFormat: {
		"Main": {
			content: ["main-display",
			"prestige-button", "resource-display", "milestones",
			["raw-html", function () {
			return player.f.points.gte(1) ? `You have ${format(player.f.metals)} metals.
			<br><br>
			You have ${format(player.f.allocated)} active furnaces.
			<br><br>
			Use the below slider to change active furnaces.
			<br><br>` : ""}],
			"furnace-slider", ["raw-html", _=> {return player.f.points.gte(1) ? `<br>You lose a certain amount of ores per second, but your furnaces convert them into metals. 
			Your points are divided by ${format(Decimal.pow(hasUpgrade("e", 42)?1:1.1, player.f.allocated))} per second, but for every point you lose you gain ${format(tmp.f.metal, 3)} metals.
			<br>` : ""}]
			]
		},
		"Upgrades": {
			content: ["main-display", "prestige-button", "resource-display", "upgrade-factory", ["raw-html", "<br><h2>Furnace Upgrades</h2><br>"],
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
			<span>You have </span><h2 style="color: #ff6600; text-shadow: 0px 0px 10px #ff6600;">${format(player.f.flame, 0)}</h2>${tmp.f.extraFlame.gt(0)?`<h3> + </h3><h2 style="color: #ff6600; text-shadow: 0px 0px 7px #ff6600;">${tmp.f.extraFlame}</h2>`:""}<span> flame, making the cost exponent of all ember upgrades divided by ${format(Decimal.div(1, tmp.f.flameEffect))}.
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
		player.f.metals = player.f.metals.add(tmp.f.metal.mul(pointdiff.sub(player.points)))
		player.f.allocated = player.f.allocated.min(player.f.points)
		if (hasUpgrade("e", 42)) player.points = pointdiff;
		if (hasUpgrade("f", 11)) player.e.points = player.e.points.add(tmp.e.resetGain.mul(0.01).mul(diff).mul(upgradeEffect("f", 11)));
		if (hasUpgrade("f", 21)) player.f.embers = player.f.embers.add(upgradeEffect("f", 21).mul(diff));
	},
	extraFlame() {
		if (inChallenge("mo", 11)) return new Decimal(0);
		return new Decimal(hasUpgrade("f", 43)?4:0).add(hasUpgrade("f", 53)?upgradeEffect("f", 53):0)
	},
	flameEffect() {
		return Decimal.div(1, player.f.flame.add(this.extraFlame()).div(hasUpgrade("f", 31)?2.5:5).add(1))
	},
	doReset(resettingLayer) {
		var keep = [];
		if (player.l.milestones.includes("0")||player.d.milestones.includes("0")) keep.push("milestones");
		if (player.l.milestones.includes("1")||player.d.milestones.includes("1")) keep.push("upgrades", "challenges");
		if (hasUpgrade("m", 12)||player.mo.milestones.includes("2")) keep.push("upgrades");
		if (layers[resettingLayer].row > this.row) layerDataReset("f", keep)
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
		{key: "o", description: "o: Toggle oil burning", onPress() {layers.e.clickables[11].onClick()}, unlocked() {return hasUpgrade("e", 44)}}
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
			},
			effectDisplay() {
				return `x${format(this.effect())}`
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
			effectDisplay() {
				return `x${format(this.effect())}`
			},
			unlocked() {
				return hasUpgrade("e", 13)||hasUpgrade("m", 11)
			}
		},
		21: {
			title: "Engineering",
			description: "Unlock the ability to upgrade extractors.",
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
			description: "Metal boosts extractor gain.",
			cost() {
				if (inChallenge("mo", 32)) return Infinity;
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:2e9;
			},
			unlocked() {
				return player.f.milestones.includes("0")||hasUpgrade("m", 11)
			},
			effect() {
				return player.f.metals.add(20).min(1e250).log(20).add(player.f.metals.div(1e250).max(0).add(1).log(2000))
			},
			effectDisplay() {
				return `x${format(this.effect())}`
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
			description: "Add 2 to the motor effect base.",
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
			},
			effectDisplay() {
				return `x${format(this.effect())}`
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
				<span style="font-size: 12px">Currently: ${format(getBuyableAmount("e", 11).add(hasUpgrade("e", 34)?player.f.flame.mul(2).pow(2):0).add(1).mul(10), 0)}m deep</h3>
				Cost: ${format(this.cost())} metals
				Effect: x${format(this.effect())}</span>`
			},
			cost(val=player.e.buyables[11]) {
				return Decimal.pow(5, val.add(val.sub(20).max(0).pow(2).div(1.5)).mul(hasUpgrade("f", 44)?tmp.f.flameEffect:1)).mul(1e8)
			},
			buy() {
				if (this.canAfford()) {
					player.f.metals = player.f.metals.sub(this.cost())
					setBuyableAmount("e", 11, getBuyableAmount("e", 11).add(1))
				}
			},
			buyMax() {
				if (!this.canAfford()) return;
				var search = 1;
				while (this.canAfford()) {
					player.e.buyables[this.id] = player.e.buyables[this.id].add(search);
					search *= 2;
				}
				while (!(!this.canAfford()&&this.canAfford(player.e.buyables[this.id].sub(1)))) {
					search /= 2;
					if (this.canAfford()) player.e.buyables[this.id] = player.e.buyables[this.id].add(Math.ceil(search));
					else player.e.buyables[this.id] = player.e.buyables[this.id].sub(Math.ceil(search));
				}
			},
			effect() {
				return (getBuyableAmount("e", 11).add(hasUpgrade("e", 34)?player.f.flame.mul(2).pow(2):0).add(1)).sub((player.mo.pollution == 11)?500000000:0).max(1).pow(hasUpgrade("e", 43)?4:1)
			},
			unlocked() {
				return hasUpgrade("e", 21)
			},
			canAfford(val=player.e.buyables[11]) {
				return player.f.metals.gte(this.cost(val))
			}
		},
		12: {
			title: "Amount",
			display() {
				return `<br><br><h3>Increase the amount of modules per depth.</h3><br>
				<span style="font-size: 12px">Currently: ${format(this.effect(), 0)} modules</h3>
				Cost: ${format(this.cost())} metals
				Effect: x${format(this.effect())}</span>`
			},
			cost(val=player.e.buyables[12]) {
				return Decimal.pow(10, val.add(val.sub(30).max(0).pow(2).div(1.4)).mul(hasUpgrade("f", 44)?tmp.f.flameEffect:1)).mul(1e7)
			},
			buy() {
				if (this.canAfford()) {
					player.f.metals = player.f.metals.sub(this.cost())
					setBuyableAmount("e", 12, getBuyableAmount("e", 12).add(1))
				}
			},
			buyMax() {
				if (!this.canAfford()) return;
				var search = 1;
				while (this.canAfford()) {
					player.e.buyables[this.id] = player.e.buyables[this.id].add(search);
					search *= 2;
				}
				while (!(!this.canAfford()&&this.canAfford(player.e.buyables[this.id].sub(1)))) {
					search /= 2;
					if (this.canAfford()) player.e.buyables[this.id] = player.e.buyables[this.id].add(Math.ceil(search));
					else player.e.buyables[this.id] = player.e.buyables[this.id].sub(Math.ceil(search));
				}
			},
			effect() {
				return getBuyableAmount("e", 12).add(hasUpgrade("e", 34)?player.f.flame.mul(2).pow(2):0).add(1)
			},
			unlocked() {
				return hasUpgrade("e", 21)
			},
			canAfford(val=player.e.buyables[12]) {
				return player.f.metals.gte(this.cost(val))
			}
		},
		13: {
			title: "Motor",
			display() {
				return `<br><br><h3>Increase the speed of all carts and motors in the extractor.</h3><br>
				<span style="font-size: 12px">Currently: ${format(buyableEffect("e", 13).mul(60))}rpm</h3>
				Cost: ${format(getBuyableCost("e", 13))} metals
				Effect: x${format(buyableEffect("e", 13))}</span>`
			},
			cost(val=player.e.buyables[13]) {
				return Decimal.pow(20, val.add(val.sub(hasUpgrade("e", 23)?6:3).max(0).pow(hasUpgrade("e", 23)?2.4:3)).mul(hasUpgrade("f", 44)?tmp.f.flameEffect:1)).mul(1e7)
			},
			buy() {
				if (this.canAfford()) {
					player.f.metals = player.f.metals.sub(this.cost())
					setBuyableAmount("e", 13, getBuyableAmount("e", 13).add(1))
				}
			},
			buyMax() {
				if (!this.canAfford()) return;
				var search = 1;
				while (this.canAfford()) {
					player.e.buyables[this.id] = player.e.buyables[this.id].add(search);
					search *= 2;
				}
				while (!(!this.canAfford()&&this.canAfford(player.e.buyables[this.id].sub(1)))) {
					search /= 2;
					if (this.canAfford()) player.e.buyables[this.id] = player.e.buyables[this.id].add(Math.ceil(search));
					else player.e.buyables[this.id] = player.e.buyables[this.id].sub(Math.ceil(search));
				}
			},
			effect() {
				return Decimal.pow(Decimal.add(1.5, hasUpgrade("f", 22)?2:0), getBuyableAmount("e", 13).add(hasUpgrade("e", 34)?player.f.flame.mul(2):0))
			},
			unlocked() {
				return hasUpgrade("e", 21)
			},
			canAfford(val=player.e.buyables[13]) {
				return player.f.metals.gte(this.cost(val))
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
					backgroundColor: this.canClick()?"#88440077":"#00ff0044",
					font: "400 13.3333px Arial"
				}
			}
		}
	},
	branches: ["f"],
	tabFormat: {
		"Main": {
			content: ["main-display", "prestige-button", "resource-display", ["raw-html", "<br>"], "milestones", ["raw-html", "<br>"], "buyables", ["raw-html", "<br>"], "upgrade-factory", "upgrades"]
		},
		"Oil": {
			content: ["main-display", "prestige-button", "resource-display", ["raw-html", function () {
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
	},
	doReset(resettingLayer) {
		var keep = [];
		if (player.l.milestones.includes("0")||player.d.milestones.includes("0")) keep.push("milestones");
		if (player.l.milestones.includes("1")||player.d.milestones.includes("1")) keep.push("upgrades", "challenges");
		if (hasUpgrade("m", 11)||player.mo.milestones.includes("2")) keep.push("upgrades");
		if (layers[resettingLayer].row > this.row) layerDataReset("e", keep)
	},
	prestigeNotify(testValue = tmp.e.resetGain) {
		if (!testValue.m) testValue = new Decimal(0);
		if (tmp.f.upgrades[11].effect.gte(50)) return false;
		else return testValue.mul(5).gte(player.e.points); 
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
			effectDisplay() {
				return `/${format(this.effect())}`
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
			effectDisplay() {
				return `x${format(this.effect())}`
			},
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:"1e600";
			}
		},
		13: {
			title: "Questionable Burning Practices",
			description: "Make oil burning better based on plastic.",
			effect() {
				return player.p.points.add(1).pow(0.1)
			},
			effectDisplay() {
				return `x${format(this.effect())}`
			},
			cost() {
				return (inChallenge("mo", 31)&&((player.e.upgrades.length+player.f.upgrades.length+player.p.upgrades.length+player.m.upgrades.length)>=20))?Infinity:"1e700";
			}
		},
		14: {
			title: "Excessive Burning Practices",
			description: "Unlock the fourth ember buyable, unaffected by extra levels.",
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
				return `<span style="font-size: 12px">Amount: ${format(getBuyableAmount("p", 11))}
				Cost: ${format(this.cost())}</span>`
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
				return player.p.points.gte(this.cost())&&(player.p.buyables[11].lt(20)||hasUpgrade("r", 12))
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
			"main-display", ["raw-html", function() {return `(${format(tmp.p.gain)}/s)<br><br>`}], ,"upgrade-factory", "upgrades", "buyables", ["raw-html", function () {
				return getBuyableAmount("p", 11).gt(0)?`${hasUpgrade("r", 12)?"":`Plastic structures are capped at 20 due to protection from the government!<br><br>`}You have ${format(getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]))} free structures.
				<br><br>
				` : ""}],
				"plastic-slider", ["raw-html", _=> {return getBuyableAmount("p", 11).gt(0)?`<br><br>
				You have ${format(player.p.structureData[1].add(hasUpgrade("r", 12)?getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]):0))} structures to structurally dangerous factories, making post-1000 factory scaling start ${format(tmp.p.effect[1])} later.
				<br>
				You have ${format(player.p.structureData[2].add(hasUpgrade("r", 12)?getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]):0))} structures to furnace smuggling, making factory 1 softcap start ${format(tmp.p.effect[2])} later.
				<br>
				You have ${format(player.p.structureData[3].add(hasUpgrade("r", 12)?getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]):0))} structures to uncontrolled burning, making post-250 ember speed scaling start ${format(tmp.p.effect[3])} later.`:""
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
		else if (layers[resettingLayer].row > 1) {
			var keep = [];
			if (player.l.milestones.includes("0")||player.d.milestones.includes("0")) keep.push("milestones");
			if (player.l.milestones.includes("1")||player.d.milestones.includes("1")) keep.push("upgrades", "challenges");
			layerDataReset("p", keep);
		}
	},
	effect() {
		return {
			1: player.p.structureData[1].add(hasUpgrade("r", 12)?getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]):0).mul(5).pow(1.7),
			2: player.p.structureData[2].add(hasUpgrade("r", 12)?getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]):0).pow(1.5).mul(2),
			3: player.p.structureData[3].add(hasUpgrade("r", 12)?getBuyableAmount("p", 11).sub(player.p.structureData[1]).sub(player.p.structureData[2]).sub(player.p.structureData[3]):0).pow(1.6).mul(5)
		}
	}
})