var orbsData = {
	"AttackingOrbST":{
		"ItemType": {
			type: "orb",
			subtype: "attacking",
			equipSlot: "belt"
		},

		"ItemName": {
			name: "Attacking Orb"
		},

		"ItemFightingStats": {
			damageType: "flat",
			damageTarget: "single",
			durability: 0,
			selfStats: {
				PDMG: 30,
				MDMG: 30
			}

		}
	},

	"AttackingOrbAOE": {
		"ItemType": {
			type: "orb",
			subtype: "attacking",
			equipSlot: "belt"
		},

		"ItemName": {
			name: "Attacking Orb AOE"
		},

		"ItemFightingStats": {
			damageType: "flat",
			damageTarget: "AOE",
			durability: 0,
			selfStats: {
				PDMG: 10,
				MDMG: 10
			}

		}
	}
}