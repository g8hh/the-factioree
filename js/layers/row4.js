addLayer("i", {
	name: "info",
	color: "#ffffff",
	startData() {return {
		page: 0,
		points: new Decimal(0),
		unlocked: true
	}},
	pageData: [`
		Now that even the government's attempts to stop you have failed, you become the government itself.<br>
		You rule over the entire earth, and everyone works together for the common goal- ores.<br>
		Here you are presented with a difficult choice- to create a futuristic utopia everyone dreams of, for infinite happiness or productivity, as all our worries are behind us.<br>
		Or an oppressive rule, humans and the earth's wellbeing itself no more than a disposable item, a stepping stone to your next great goal?
	`,
	`
		They will both help you reach your ultimate goal of getting as many ores as you wish, both will yield a pleasant playing experience.<br><br><br><br><br><br>
	`,
	`
		However, choosing different paths will lead to much different gameplay options.<br><br><br><br><br><br><br>
	`,
	`
		There will be no spoilers as to what awaits, so make your choice wisely. You will not be able to revert your choice.<br><br><br><br><br><br>
	`],
	tooltip() {
		return "Info"
	},
	tabFormat: {
		"Lore": {
			content: [["raw-html", _=> {
				return layers.i.pageData[player.i.page]
			}], "clickables"]
		},
		"More Lore": {
			content: [["raw-html", _=> {
				return player.l.unlocked?`So you have chosen the path of light.<br><br>
				People will be happy under your new rule.<br>
				Of course, this is all an illusion. You are simply <i>manipulating</i> the people to believe that you are doing good.<br>
				But well, you do still have to do some stuff to make people happy.<br>
				Making people happier provides various buffs. Letting your happiness go below 0 is a VERY BAD idea.`:`
				So you have chosen the path of darkness.<br><br>
				There is nothing left of the world, for the only thing that exists is ores, and arrangements of atoms to produce more ores.<br>
				Why should you care about how you achieve your goal? There is no ethics to stop you.<br>
				People are panicking, but what they don't know is that you've figured out a way to use discontent and fear to fuel the production of ores. Once people are happy, this index goes negative. NEVER let it go negative.`
			}]],
			unlocked() {
				return player.l.unlocked || player.d.unlocked;
			}
		}
	},
	clickables: {
		rows: 2,
		cols: 2,
		11: {
			unlocked() {
				return player.i.page == 3 && !player.i.clickables[11];
			},
			display() {
				return "I understand the consequences that come with my actions.";
			},
			canClick() {
				return true;
			},
			onClick() {
				player.i.clickables[11] = true;
				layers.i.pageData[4] = `Very well. I shall guide you on your journey.`;
				player.i.page = 4;
				player.mo.points = player.mo.points.min(5e11);
			}
		},
		21: {
			display() {
				return "<h2><-</h2>";
			},
			canClick() {
				return player.i.page;
			},
			onClick() {
				player.i.page = Math.max(player.i.page-1, 0)
			},
			style() { return {
				width: "100px",
				height: "50px",
				backgroundColor: "#000000 !important",
				color: "#ffffff",
				border: "2px solid",
				borderRadius: "10px",
				opacity: 0.5*this.canClick()+0.5,
				filler: Math.random()
			}}
		},
		22: {
			display() {
				return "<h2>-></h2>";
			},
			canClick() {
				return 3+player.i.clickables[11]-player.i.page;
			},
			onClick() {
				player.i.page = Math.min(player.i.page+1, 3+player.i.clickables[11])
			},
			style() { return {
				width: "100px",
				height: "50px",
				backgroundColor: "#000000 !important",
				color: "#ffffff",
				border: "2px solid",
				borderRadius: "10px",
				opacity: 0.5*this.canClick()+0.5,
				filler: Math.random()
			}}
		}
	},
	row: 3,
	position: 0,
	branches: ["mo"],
	layerShown() {
		return false//(hasChallenge("mo", 41)&&hasChallenge("mo", 42))||player.d.unlocked||player.l.unlocked
	},
	update(diff) {
		if (player.i.clickables[11]) layers.i.pageData[4] = `Very well. I shall guide you on your journey.`;
	}
})
addLayer("l", {
	name: "light",
	resource: "lightness",
	color: "#cceeff",
	baseResource: "monopoly power",
	type: "normal",
	exponent: 0.1,
	requires() {
		return player.d.unlocked?Infinity:new Decimal(5e11);
	},
	row: 3,
	position: -1,
	baseAmount() {
		return player.mo.points
	},
	gainMult() {
		var mult = new Decimal(1);
		mult = mult.mul(tmp.l.buyables[11].effect);
		return mult;
	},
	gainExp() {
		var exp = new Decimal(1);
		return exp;
	},
	startData() { return {
		points: new Decimal(0),
		unlocked: false,
		happiness: new Decimal(0),
		total: new Decimal(0),
	}},
	layerShown() {
		return player.i.clickables[11]
	},
	componentStyles: {
		milestones() {
			return {
				width: "600px"
			}
		}
	},
	milestones: {
		0: {
			requirementDescription: "1 total lightness",
			effectDescription: "Keep all previous layer milestones, and researches.",
			done() {return player.l.total.gte(1)}
		},
		1: {
			requirementDescription: "2 total lightness",
			effectDescription: "Keep challenges and upgrades.",
			done() {return player.l.total.gte(2)}
		},
		2: {
			requirementDescription: "3 total lightness",
			effectDescription: "Unlock light upgrades.",
			done() {return player.l.total.gte(3)}
		},
		3: {
			requirementDescription: "4 total lightness",
			effectDescription: "Each milestone gives 1 happiness instead of 0.5.",
			done() {return player.l.total.gte(4)}
		},
		4: {
			requirementDescription: "200 total lightness",
			effectDescription: "Start each reset with 100,000 of each factory.",
			done() {return player.l.total.gte(200)}
		}
	},
	upgrades: {
		rows: 4,
		cols: 4,
		11: {
			title: "The Great Cleansing",
			description: "Removes pollutions, but replace them with better options.",
			cost: 2,
			unlocked() {
				return player.l.milestones.includes("2");
			},
			onPurchase() {
				player.subtabs.mo.mainTabs = "Anti-Pollutions";
			}
		},
		12: {
			title: "Sustainable Sustainability",
			description: "Trees and Ocean boost each other's generation.",
			cost: 10,
			unlocked() {
				return hasUpgrade("l", 11)
			},
			effect() {
				return {
					tree: player.mo.ocean.add(1).pow(0.1),
					ocean: player.mo.trees.add(1).pow(0.1),
				}
			},
			effectDisplay() {
				return `x${format(this.effect().ocean)} to ocean generation, x${format(this.effect().tree)} to tree generation`
			}
		},
		13: {
			title: "Cheap Sustainability",
			description: "All anti-pollutions scale 2x slower, and make restabilisation better.",
			cost: 5,
			unlocked() {
				return hasUpgrade("l", 12)
			}
		},
		14: {
			title: "Long-term policies",
			description: "Keep restabilisations between resets, and unlock a light buyable.",
			cost: 8,
			unlocked() {
				return hasUpgrade("l", 13)
			}
		},
		21: {
			title: "Crowdfunded Efforts",
			description: "Decrease <b>Plastic Collectors</b> and <b>Mechanic Tree Planters</b> cost scaling.",
			cost: 400,
			unlocked() {
				return hasUpgrade("l", 14)
			}
		}
	},
	buyables: {
		rows: 1,
		cols: 1,
		11: {
			title: "Light augmentor",
			display() {
				return `Amount: ${formatWhole(player.l.buyables[11])}<br>
				Cost: ${format(tmp.l.buyables[11].cost.lightness)} lightness
				${formatWhole(player.mo.buyables[33])}/${formatWhole(tmp.l.buyables[11].cost.re)} restabilisations<br>
				Effect: x${format(tmp.l.buyables[11].effect)} to lightness gain
				Unlocked: ${formatWhole(tmp.l.buyables[11].unlocks)} new anti-pollutions (${tmp.l.buyables[11].nextAt})
				Unlocked: ${formatWhole(tmp.l.buyables[11].unlocks2)} new anti-pollution effects (${tmp.l.buyables[11].nextAt2})`
			},
			buy() {
				player.l.points = player.l.points.sub(tmp.l.buyables[11].cost.lightness);
				player.mo.buyables[33] = player.mo.buyables[33].sub(tmp.l.buyables[11].cost.re);
				player.l.buyables[11] = player.l.buyables[11].add(1);
			},
			cost() {
				return {
					lightness: Decimal.pow(2.5, player.l.buyables[11].pow(1.1)).mul(5).floor(),
					re: player.l.buyables[11].mul(player.l.buyables[11].add(1)).div(4).round().add(6)
				}
			},
			canAfford() {
				return player.l.points.gte(tmp.l.buyables[11].cost.lightness) && player.mo.buyables[33].gte(tmp.l.buyables[11].cost.re);
			},
			effect() {
				return Decimal.pow(2.5, player.l.buyables[11].pow(0.8));
			},
			unlocked() {
				return hasUpgrade("l", 14)
			},
			unlocks() {
				if (player.l.buyables[11].gte(3)) return 1;
				return 0;
			},
			nextAt() {
				switch (tmp.l.buyables[11].unlocks) {
					case 0:
					return "Next At 3";
					case 1:
					return "MAXED";
				}
			},
			unlocks2() {
				if (player.l.buyables[11].gte(5)) return 1;
				return 0;
			},
			nextAt2() {
				switch (tmp.l.buyables[11].unlocks2) {
					case 0:
					return "Next At 5";
					case 1:
					return "MAXED";
				}
			}
		}
	},
	tabFormat: {
		"Main": {
			content: ["main-display", "prestige-button", "resource-display", ["raw-html", _=> {
				return player.l.unlocked?`You have ${format(player.l.total)} total lightness.<br><br>
				Your happiness index is ${format(player.l.happiness)}, boosting monopoly power gain by ${format(tmp.l.effect.mogain)} and ore gain by ${format(tmp.l.effect.oregain)}<br>Each milestone gives 0.5 happiness.`:""
			}], "milestones", "buyables", "upgrades"]
		}
	},
	update(diff) {
		player.l.happiness = new Decimal(player.l.milestones.length*0.5*(1+player.l.milestones.includes("3")));
		player.l.happiness = player.l.happiness.add(tmp.mo.buyables[33].effect2);
	},
	branches: ["mo"],
	effect() {
		return {
			mogain: Decimal.pow(3, player.l.happiness),
			oregain: Decimal.pow("1e1000", player.l.happiness.mul(5).pow(2))
		}
	},
	shouldNotify() {return tmp.l.buyables[11].canAfford},
	hotkeys: [{key: "l", description: "l: Reset for lightness", onPress(){if (canReset(this.layer)) doReset(this.layer)}}]
})
addLayer("d", {
	name: "dark",
	resource: "darkness",
	color: "#606060",
	baseResource: "monopoly power",
	type: "normal",
	exponent: 0.1,
	requires() {
		return player.l.unlocked?Infinity:new Decimal(5e11);
	},
	nodeStyle() { return player.mo.points.gte(this.requires())?{
		color: "rgba(255, 255, 255, 0.5)",
		backgroundColor: "#222222"
	}:{}},
	row: 3,
	position: 1,
	baseAmount() {
		return player.mo.points
	},
	gainMult() {
		var mult = new Decimal(1);
		return mult;
	},
	gainExp() {
		var exp = new Decimal(1);
		return exp;
	},
	startData() { return {
		points: new Decimal(0),
		unlocked: false,
		conspire: new Decimal(0),
		total: new Decimal(0)
	}},
	layerShown() {
		return player.i.clickables[11]
	},
	componentStyles: {
		milestones() {
			return {
				width: "600px"
			}
		}
	},
	milestones: {
		0: {
			requirementDescription: "1 total darkness",
			effectDescription: "Keep all previous layer milestones and researches.",
			done() {return player.d.total.gte(1)}
		},
		1: {
			requirementDescription: "2 total darkness",
			effectDescription: "Keep challenges and upgrades.",
			done() {return player.d.total.gte(2)}
		},
		2: {
			requirementDescription: "3 total darkness",
			effectDescription: "Unlock dark upgrades.",
			done() {return player.d.total.gte(3)}
		},
	},
	tabFormat: {
		"Main": {
			content: ["main-display", "prestige-button", "resource-display", ["raw-html", _=> {
				return player.l.unlocked?`You have ${format(player.d.total)} total darkness.<br><br>Your conspire is ${format(player.d.conspire)}.<br>Each milestone gives 0.5 conspire.`:""
			}], "milestones", "upgrades"]
		}
	},
	update(diff) {
		player.d.conspire = new Decimal(player.d.milestones.length*0.5);
	},
	branches: ["mo"]
})