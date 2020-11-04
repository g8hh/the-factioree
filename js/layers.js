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
            return player.f.points.sub(30).max(0).pow(0.5).add(3)
        },
        exponent: 1.5,
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            if (hasUpgrade("f", 12)) mult = mult.div(upgradeEffect("f", 12))
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return Decimal.div(1, player.f.points.sub(4).max(1)).pow(0.1)
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        upgrades: {
            rows: 4,
            cols: 2,
            11: {
                title: "181",
                description: `Gain x% of extractor gain on prestige per second where x is based on your allocated furnaces.`,
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
                    return player.f.metals.add(1).pow(0.2)
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
                    var embergain = player.f.points.mul(100).mul(buyableEffect("f", 11)).mul(buyableEffect("f", 12))
                    if (hasUpgrade("f", 22)) embergain = embergain.mul(upgradeEffect("f", 22));
                    if (hasUpgrade("f", 32)) embergain = embergain.mul(100);
                    if (hasUpgrade("e", 33)) embergain = embergain.mul(upgradeEffect("e", 33));
                    embergain = embergain.mul(tmp.m.effect.sqrt());
                    return embergain
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
                    return getBuyableAmount("f", 11).gte(5)
                },
                effect() {
                    return player.e.points.log(6)
                }
            },
            31: {
                title: "Flamier Flames",
                description: "Flames effect is stronger.",
                cost: 3,
                unlocked() {
                    return player.f.flame.gt(1)||hasUpgrade("f", 31)
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
                    return player.f.flame.gt(1)||hasUpgrade("f", 31)
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
            cols: 3,
            11: {
                title: "Ember boost",
                display() {
                    return `<br><br><h3>Boost ember gain.</h3><br>
                    <h2>Currently:</h2><h3> ${`${format(getBuyableAmount("f", 11), 0)}${getBuyableAmount("f", 12).eq(0)?
                    "":
                    `+${format(getBuyableAmount("f", 12).mul(1.5).add(getBuyableAmount("f", 13).mul(2)))}`}`}</h3>
                    <h2>Cost:</h2><h3> ${format(this.cost())} fiery embers</h3>
                    <h2>Effect:</h2><h3> x${format(this.effect())}</h3>`
                },
                cost() {
                    return Decimal.pow(4, getBuyableAmount("f", 11).sub(50).max(0).pow(3).add(getBuyableAmount("f", 11).pow(2).div(4).add(getBuyableAmount("f", 11)).pow(layers.f.flameEffect()))).mul(100)
                },
                buy() {
                    if (this.canAfford()) {
                        player.f.embers = player.f.embers.sub(this.cost())
                        setBuyableAmount("f", 11, getBuyableAmount("f", 11).add(1))
                    }
                },
                effect() {
                    return Decimal.pow(Decimal.mul(1.5, hasUpgrade("f", 42)?1.1:1), getBuyableAmount("f", 11).add(getBuyableAmount("f", 12).mul(1.5).add(getBuyableAmount("f", 13).mul(2))))
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
                    `+${format(getBuyableAmount("f", 13).mul(0.25))}`}`}</h3>
                    <h2>Cost:</h2><h3> ${format(this.cost())} fiery embers</h3>
                    <h2>Effect:</h2><h3> x${format(this.effect())}</h3>`
                },
                cost() {
                    return Decimal.pow(11.5, getBuyableAmount("f", 12).pow(4).div(10).add(getBuyableAmount("f", 12)).pow(layers.f.flameEffect())).mul(10000)
                },
                buy() {
                    if (this.canAfford()) {
                        player.f.embers = player.f.embers.sub(this.cost())
                        setBuyableAmount("f", 12, getBuyableAmount("f", 12).add(1))
                    }
                },
                effect() {
                    return Decimal.pow(2, getBuyableAmount("f", 12).add(getBuyableAmount("f", 13).mul(0.25)))
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
                    <h2>Currently:</h2><h3> ${format(getBuyableAmount("f", 13), 0)}</h3>
                    <h2>Cost:</h2><h3> ${format(this.cost())} fiery embers</h3>
                    <h2>Effect:</h2><h3> ${format(this.effect())}</h3>`
                },
                cost() {
                    return Decimal.pow(10, getBuyableAmount("f", 13).sub(10).max(0).pow(4.5).add(getBuyableAmount("f", 13).pow(3).div(5).add(getBuyableAmount("f", 13)).pow(layers.f.flameEffect()))).mul(500000)
                },
                buy() {
                    if (this.canAfford()) {
                        player.f.embers = player.f.embers.sub(this.cost())
                        setBuyableAmount("f", 13, getBuyableAmount("f", 13).add(1))
                    }
                },
                effect() {
                    return Decimal.pow(1e25, getBuyableAmount("f", 13))
                },
                canAfford() {
                    return player.f.embers.gte(this.cost())
                },
                style() {
                    return {backgroundColor: this.canAfford()?"#ff4400":"bf8f8f"}
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
                    ${format(player.f.embers)}/${format(Decimal.pow(20, player.f.flame.pow(2).div(hasUpgrade("f", 41)?4:2)).mul(5e8))} fiery embers</span>`
                },
                canClick() {
                    return player.f.embers.gte(Decimal.pow(20, player.f.flame.pow(2).div(hasUpgrade("f", 41)?4:2)).mul(5e8))
                },
                onClick() {
                    if (player.f.embers.gte(Decimal.pow(20, player.f.flame.pow(2).div(hasUpgrade("f", 41)?4:2)).mul(5e8))) {
                        player.f.embers = player.f.embers.sub(Decimal.pow(20, player.f.flame.pow(2).div(hasUpgrade("f", 41)?4:2)).mul(5e8))
                        player.f.flame = player.f.flame.add(1)
                    }
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
                    return (player.f.embers.gt(500000000)||player.f.flame.gt(0))
                }
            }
        },
        hotkeys: [
            {key: "f", description: "Reset for furnaces", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.e.milestones.includes("0")||layers.m.layerShown()},
        tabFormat: {
            "Main": {
                content: ["main-display",
                "prestige-button", "milestones",
                ["raw-html", function () {
                return player.f.points.gte(1) ? `You have ${format(player.f.metals)} metals.
                <br><br>
                You have ${player.f.allocated} allocated furnaces.
                <br><br>
                Use the below slider to change allocated furnaces.
                <br><br>
                <input oninput="player.f.allocated = new Decimal(this.value)" type="range" min="0" max="${player.f.points}" step="1" style="width: 30em" value="${player.f.allocated}">
                <br>You lose a certain amount of ores per second, but your furnaces convert them into metals. 
                Your points are divided by ${format(Decimal.pow(1.1, player.f.allocated))} per second, but for every point you lose you gain ${format(Decimal.pow(2, player.f.allocated.min(16)).mul(Decimal.pow(1.2, player.f.allocated.sub(16).min(16).max(0))).mul(Decimal.pow(player.f.allocated.sub(32).max(1), 0.3)).mul(0.003))} metals.
                <br>` : ""
                }]]
            },
            "Upgrades": {
                content: ["main-display", "prestige-button", ["column", [["row", [["upgrade", 11], ["upgrade", 12]]]]], ["column", [["row", [["upgrade", 21], ["upgrade", 22]]]]]],
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
                <span>You have </span><h2 style="color: #ff6600; text-shadow: 0px 0px 10px #ff6600;">${format(player.f.flame, 0)}</h2><span> flame, making the cost exponent of all upgrades raised to ${format(layers.f.flameEffect())}.
                <br><br>`:""}],"clickables",
                ["column", [["row", [["upgrade", 31], ["upgrade", 32]]]]], ["column", [["row", [["upgrade", 41], ["upgrade", 42]]]]]],
                unlocked() {
                    return hasUpgrade("f", 21)
                }
            }
        },
        update(diff) {
            var pointdiff = new Decimal(player.points);
            player.points = player.points.div(Decimal.pow(Math.pow(1.1, diff), player.f.allocated))
            player.f.metals = player.f.metals.add(Decimal.pow(2, player.f.allocated.min(16)).mul(Decimal.pow(1.2, player.f.allocated.sub(16).min(16).max(0))).mul(Decimal.pow(player.f.allocated.sub(32).max(1), 0.3)).mul(0.003).mul(pointdiff.sub(player.points)))
            player.f.allocated = player.f.allocated.min(player.f.points)
            if (hasUpgrade("f", 11)) player.e.points = player.e.points.add(tmp.e.resetGain.mul(0.01).mul(diff).mul(upgradeEffect("f", 11)));
            if (hasUpgrade("f", 21)) player.f.embers = player.f.embers.add(upgradeEffect("f", 21).mul(diff))
        },
        flameEffect() {
            return Decimal.div(1, player.f.flame.div(hasUpgrade("f", 31)?6:10).add(1).pow(0.5))
        }
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
            rows: 3,
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
                    return hasUpgrade("e", 24) ? player.points.add(1).min("1e1000").pow(0.2).add(player.points.div("1e1000").max(0).add(1.5).log(1.5)) : player.points.add(2).log(2)
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
                    return player.f.metals.add(20).min(1e250).log(20).add(player.f.metals.div(1e250).max(0).add(1).log(2000))
                }
            },
            23: {
                title: "Scaling",
                description: "Scaled motor scaling starts later, and is weakened.",
                cost: 1e12,
                unlocked() {
                    return player.f.milestones.includes("0")
                }
            },
            24: {
                title: "Self improvement",
                description: "Self-generating's formula is better.",
                cost: 3e15,
                unlocked() {
                    return player.f.milestones.includes("0")
                }
            },
            31: {
                title: "Over-Engineering",
                description: "Add 2 to motor's effect base.",
                cost: 1e66,
                unlocked() {
                    return player.f.milestones.includes("1")
                }
            },
            32: {
                title: "Forged Extractor",
                description: "Ember boost boosts ore gain at an increased rate.",
                cost: 2e114,
                unlocked() {
                    return player.f.milestones.includes("1")
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
                    return player.f.milestones.includes("1")&&player.f.flame.gt(0)
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
                    return player.f.milestones.includes("1")&&player.f.flame.gt(0)
                }
            },
        },
        milestones: {
            0: {
                requirementDescription: "5e4 extractors",
                effectDescription: "Unlock furnaces.",
                done() {
                    return player.e.points.gte(5e4)||player.m.points.gt(0)
                },
                style: {
                    width: "300px"
                },
                unlocked() {
                    return hasUpgrade("e", 14)
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
                },
                unlocked() {
                    return hasUpgrade("e", 23)
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
                    <h2>Effect:</h2><h3> x${format(this.effect())}</h3>`
                },
                cost() {
                    return Decimal.pow(5, getBuyableAmount("e", 11).add(getBuyableAmount("e", 11).sub(20).max(0).pow(2).div(1.5))).mul(1e8)
                },
                buy() {
                    if (this.canAfford()) {
                        player.f.metals = player.f.metals.sub(this.cost())
                        setBuyableAmount("e", 11, getBuyableAmount("e", 11).add(1))
                    }
                },
                effect() {
                    return getBuyableAmount("e", 11).add(hasUpgrade("e", 34)?player.f.flame.mul(2).pow(2):0).add(1)
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
                    return Decimal.pow(10, getBuyableAmount("e", 12).add(getBuyableAmount("e", 12).sub(30).max(0).pow(2).div(1.4))).mul(1e7)
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
                    return Decimal.pow(20, getBuyableAmount("e", 13).add(getBuyableAmount("e", 13).sub(hasUpgrade("e", 23)?6:3).max(0).pow(hasUpgrade("e", 23)?2.4:3))).mul(1e7)
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
            autoFlame: false
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
        exponent: 1,
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            {key: "m", description: "Reset for manufacturers", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        effect() {
            return Decimal.pow(1e6, player.m.points)
        },
        effectDescription() {
            return `boosting ore gains by ${format(this.effect())} and ember gains by ${format(this.effect().sqrt())}`
        },
        layerShown(){return player.m.unlocked||player.points.gte("1e1000")},
        upgrades: {
            rows: 3,
            cols: 4,
            11: {
                title: "nothing",
                description: "does literally nothing.",
                cost: 10
            }
        },
        milestones: {
            0: {
                requirementDescription: "Manufacturer of furnaces (1 manufacturer)",
                effectDescription: "Automate furnaces and allocated furnaces respectively.",
                toggles: [["m", "autoFurnace"], ["m", "autoFAlloc"]],
                done() {
                    return player.m.points.gte(1)
                },
                style: {
                    width: "500px"
                }
            },
            1: {
                requirementDescription: "Manufacturer of parts (3 manufacturer)",
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
                requirementDescription: "Manufacturer of flames (5 manufacturer)",
                effectDescription: "Automate embers and flame respectively.",
                toggles: [["m", "autoEmber"], ["m", "autoFlame"]],
                done() {
                    return player.m.points.gte(5)
                },
                style: {
                    width: "500px"
                }
            }
        },
        branches: ["f"],
        tabFormat: {
            "Main": {
                content: ["main-display", "prestige-button", ["raw-html", "<br>"], "buyables", ["raw-html", "<br>"], "upgrades"]
            },
            "Milestones": {
                content: ["main-display", "prestige-button", ["raw-html", "<br>"], "milestones"]
            }
        },
        automate() {
            if (player.m.autoFurnace) doReset("f");
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
                for (var i = 11; i <= 13; i++) {
                    for (var j = 0; j < 40; j++) {
                        layers.f.buyables[i].buy()
                    }
                }
            }
        }
})
