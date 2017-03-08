var creaturesData = {
	"Scorpion": {
		Name: {
			name: ["Raged", "Bloody", "Sand", "Some"], 
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
				HP:[10, 20], 
				STR:[1, 5], 
				AGI:[1, 5], 
				INT:[1, 5], 
				ASPD:[250,500],
				DDG:[0, 100],
				BLK:0,
				PDEF:[0, 100],
				MDEF:[0, 100]
			},
			lvlup: {
				HP:[4, 8], 
				STR:[1, 2], 
				AGI:[1, 2],  
				INT:[1, 2], 
				ASPD:[1, 2],
				DDG:[0, 1],
				BLK:0,
				PDEF:[0, 1],
				MDEF:[0, 1]
			} 
		},
		ExperienceStats: {
			lvl:1,
			exp:0,
			bounty:[2, 4] 
		} 
	}
}