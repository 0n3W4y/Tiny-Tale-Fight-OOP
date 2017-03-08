var humanoidsData = {
	"Human":{
		Name: {
			name: "Ostin", 
			surname: "Powers"
		},
		Type: {
			sex: ["Man", "Woman"], 
			race: "Human",
			class: [ "Barbarian", "Paladin", "Archer", "Crossbowman", "Mage", "Cliric" ]
		},
		AgeStats: {
			age:[14, 100], 
			month:[1, 12] ,
			day: [1, 30]
		},
		FightingStats: { 
			stats: {
				HP:50, 
				STR:5, 
				AGI:5, 
				INT:5, 
				ASPD:500,
				DDG:0,
				BLK:0,
				PDEF:0,
				MDEF:0
			},
			lvlup: {
				HP:5, 
				STR:1, 
				AGI:1,  
				INT:1, 
				ASPD:1,
				DDG:0,
				BLK:0,
				PDEF:0,
				MDEF:0
			} 
		},
		ExperienceStats: {
			lvl:1,
			exp:0,			
			bounty:[4, 6]
		}
	}
}