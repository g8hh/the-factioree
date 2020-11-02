var testNumber = 0;
addLayer("f", {
        name: "furnace", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: false,
            points: new Decimal(0),
            allocated: new Decimal(0),
            metals: new Decimal(0)
        }},
        color: "#666666",
        requires: new Decimal(3e9), // Can be a function that takes requirement increases into account
        resource: "furnaces", // Name of prestige currency
        baseResource: "ores", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        base: 3,
        exponent: 1.5,
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            mult = mult.div(player.f.points.sub(5).max(1).sqrt())
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        milestones: {
            0: {
                requirementDescription: "1 furnace",
                effectDescription: "Unlock more extractor upgrades.",
                done() {
                    return player.f.points.gte(1)
                },
                style: {
                    width: "300px"
                }
            }
        },
        hotkeys: [
            {key: "f", description: "Reset for furnaces", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.e.milestones.includes("0")},
        tabFormat: ["main-display",
            "prestige-button", "milestones", ["raw-html", function () {
                return player.f.points.gte(1) ? `You have ${format(player.f.metals)} metals.
                <br><br>
                You have ${player.f.allocated} allocated furnaces.
                <br><br>
                Use the below slider to change allocated furnaces.
                <br><br>
                <input oninput="player.f.allocated = new Decimal(this.value)" type="range" min="0" max="${player.f.points}" step="0" value= "${player.f.allocated}">
                <br>You lose a certain amount of ores per second, but your furnaces convert them into metals. 
                Your points are divided by ${format(Decimal.pow(1.1, player.f.allocated))} per second, but for every point you lose you gain ${format(Decimal.pow(2, player.f.allocated).mul(0.003))} metals.` : ""
            }]
        ]
})
addLayer("e", {
        name: "extractor", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: true,
			points: new Decimal(0),
        }},
        color: "#887799",
        requires: new Decimal(10), // Can be a function that takes requirement increases into account
        resource: "extractors", // Name of prestige currency
        baseResource: "ores", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: 0.5, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            if (hasUpgrade("e", 12)) mult = mult.mul(2)
            if (hasUpgrade("e", 22)) mult = mult.mul(upgradeEffect("e", 22))
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "e", description: "Reset for extractors", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return true},
        upgrades: {
            rows: 2,
            cols: 4,
            11: {
                title: "Efficiency",
                description: "Extractors produce ores x2 faster.",
                cost: 10,
                unlocked() {
                    return player.e.points.gte(5) || hasUpgrade("e", 11)
                }
            },
            12: {
                title: "Optimization",
                description: "Double extractor gain.",
                cost: 50,
                unlocked() {
                    return player.e.points.gte(15) || hasUpgrade("e", 12)
                }
            },
            13: {
                title: "Self-generating",
                description: "Gain more ores based on ores.",
                cost: 300,
                effect() {
                    return player.points.add(2).log(2)
                },
                unlocked() {
                    return hasUpgrade("e", 12)
                }
            },
            14: {
                title: "Meta upgrade",
                description: "Gain more ores based on upgrades.",
                cost: 3e3,
                effect() {
                    return Decimal.pow(3, player.e.upgrades.length)
                },
                unlocked() {
                    return hasUpgrade("e", 13)
                }
            },
            21: {
                title: "Engineering",
                description: "Interact with the core properties of extractors.",
                cost: 1e5,
                unlocked() {
                    return player.f.milestones.includes("0")
                }
            },
            22: {
                title: "Smelted Extractor",
                description: "Metal boost extractor gain.",
                cost: 2e9,
                unlocked() {
                    return player.f.milestones.includes("0")
                },
                effect() {
                    return player.f.metals.log(20)
                }
            },
        },
        milestones: {
            0: {
                requirementDescription: "5e4 extractors",
                effectDescription: "Unlock furnaces.",
                done() {
                    return player.e.points.gte(5e4)
                },
                style: {
                    width: "300px"
                },
                unlocked() {
                    return hasUpgrade("e", 14)
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
                    <h2>Currently:</h2><h3> ${format(this.effect().mul(10), 0)}m deep</h3>
                    <h2>Cost:</h2><h3> ${format(this.cost())} metals</h3>
                    <h2>Effect:</h2><h3> ${format(this.effect())}</h3>`
                },
                cost() {
                    return Decimal.pow(5, getBuyableAmount("e", 11).add(getBuyableAmount("e", 11).sub(20).max(0).pow(2))).mul(1e8)
                },
                buy() {
                    if (this.canAfford()) {
                        player.f.metals = player.f.metals.sub(this.cost())
                        setBuyableAmount("e", 11, getBuyableAmount("e", 11).add(1))
                    }
                },
                effect() {
                    return getBuyableAmount("e", 11).add(1)
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
                    <h2>Effect:</h2><h3> ${format(this.effect())}</h3>`
                },
                cost() {
                    return Decimal.pow(10, getBuyableAmount("e", 12).add(getBuyableAmount("e", 12).sub(30).max(0).pow(2))).mul(1e7)
                },
                buy() {
                    if (this.canAfford()) {
                        player.f.metals = player.f.metals.sub(this.cost())
                        setBuyableAmount("e", 12, getBuyableAmount("e", 12).add(1))
                    }
                },
                effect() {
                    return getBuyableAmount("e", 12).add(1)
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
                    <h2>Effect:</h2><h3> ${format(buyableEffect("e", 13))}</h3>`
                },
                cost() {
                    return Decimal.pow(20, getBuyableAmount("e", 13).add(getBuyableAmount("e", 13).sub(3).pow(3))).mul(1e7)
                },
                buy() {
                    if (this.canAfford()) {
                        player.f.metals = player.f.metals.sub(this.cost())
                        setBuyableAmount("e", 13, getBuyableAmount("e", 13).add(1))
                    }
                },
                effect() {
                    return Decimal.pow(1.2, getBuyableAmount("e", 13))
                },
                unlocked() {
                    return hasUpgrade("e", 21)
                },
                canAfford() {
                    return player.f.metals.gte(this.cost())
                }
            }
        },
        branches: ["f"],
        tabFormat: {
            "Main": {
                content: ["main-display", "prestige-button", ["raw-html", "<br>"], "buyables", ["raw-html", "<br>"], "upgrades"]
            },
            "Milestones": {
                content: ["main-display", "prestige-button", ["raw-html", "<br>"], "milestones"],
                unlocked() {
                    return hasUpgrade("e", 14)
                }
            }
        }
})