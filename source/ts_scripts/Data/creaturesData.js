var creaturesData = {
	"Scorpion": {
		Name: {
			surname: "Scorpion"
		},

		Type: {
			sex: ["Male", "Female"], 
			race: "Scorpicores",
			class: "NoClass"
		},

		AgeStats: {
			age:[10, 100],
			month:[1, 12],
			day:[1,30]
		},
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
	}
}