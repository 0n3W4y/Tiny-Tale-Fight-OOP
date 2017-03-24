var creaturesData = {
	"Scorpion": {
		"Weak": {
			Name: {
				name: "Weak", 
				surname: "Scorpion"
			},
			Type: {
				sex: ["Man", "Woman"], 
				race: "Scorpicores",
				class: "NoClass"
			},
			AgeStats: {
				age:[10, 100], 
				month:[1, 12] ,
				day:[1,30]
			}, // [ min, max ];
			FightingStats: {
				stats: {
					HP:30, 
					STR:1, 
					AGI:1, 
					INT:1, 
					ASPD:250,
					DDG:0,
					BLK:0,
					PDEF:0,
					MDEF:0
				},
				lvlup: {
					HP:4, 
					STR:1, 
					AGI:1,  
					INT:1, 
					ASPD:1,
					DDG:1,
					BLK:0,
					PDEF:0,
					MDEF:0
				} 
			},
			ExperienceStats: {
				lvl:1,
				exp:0,
				bounty:1 
			} 
		},

		"Noraml": {
			Name: {
				name: "Normal", 
				surname: "Scorpion"
			},
			Type: {
				sex: ["Man", "Woman"], 
				race: "Scorpicores",
				class: "NoClass"
			},
			AgeStats: {
				age:[10, 100], 
				month:[1, 12] ,
				day:[1,30]
			}, // [ min, max ];
			FightingStats: {
				stats: {
					HP:35, 
					STR:2, 
					AGI:2, 
					INT:2, 
					ASPD:350,
					DDG:10,
					BLK:0,
					PDEF:25,
					MDEF:25
				},
				lvlup: {
					HP:5, 
					STR:1.5, 
					AGI:1.5,  
					INT:1.5, 
					ASPD:1.5,
					DDG:1.5,
					BLK:0,
					PDEF:5,
					MDEF:5
				} 
			},
			ExperienceStats: {
				lvl:1,
				exp:0,
				bounty:2 
			}
		},

		"Strong": {
			Name: {
				name: "Strong", 
				surname: "Scorpion"
			},
			Type: {
				sex: ["Man", "Woman"], 
				race: "Scorpicores",
				class: "NoClass"
			},
			AgeStats: {
				age:[10, 100], 
				month:[1, 12] ,
				day:[1,30]
			}, // [ min, max ];
			FightingStats: {
				stats: {
					HP:40, 
					STR:3, 
					AGI:3, 
					INT:3, 
					ASPD:400,
					DDG:10,
					BLK:0,
					PDEF:50,
					MDEF:50
				},
				lvlup: {
					HP:6, 
					STR:2, 
					AGI:2,  
					INT:2, 
					ASPD:2,
					DDG:2,
					BLK:0,
					PDEF:10,
					MDEF:10
				} 
			},
			ExperienceStats: {
				lvl:1,
				exp:0,
				bounty:3 
			}
		},

		"Boss": {
			Name: {
				name: "Weak", 
				surname: "Scorpion"
			},
			Type: {
				sex: ["Man", "Woman"], 
				race: "Scorpicores",
				class: "NoClass"
			},
			AgeStats: {
				age:[10, 100], 
				month:[1, 12] ,
				day:[1,30]
			}, // [ min, max ];
			FightingStats: {
				stats: {
					HP:50, 
					STR:5, 
					AGI:5, 
					INT:5, 
					ASPD:500,
					DDG:5,
					BLK:0,
					PDEF:100,
					MDEF:100
				},
				lvlup: {
					HP:10, 
					STR:8, 
					AGI:8,  
					INT:8, 
					ASPD:8,
					DDG:8,
					BLK:0,
					PDEF:25,
					MDEF:25
				} 
			},
			ExperienceStats: {
				lvl:1,
				exp:0,
				bounty:10 
			}
		}
	}
}