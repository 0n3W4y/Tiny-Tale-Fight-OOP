var creaturesData = {
	"Scorpion": {
		Name: {
			name: ["Raged", "Bloody", "Sand", "Some"], 
			surname: "Scorpion"
		}, // surname be a key ( Scoprion );
		Type: {
			sex: ["Man", "Woman"], 
			race: "Scorpicores"
		},
		AgeStats: {
			age:[10, 100], 
			month:[1, 12] ,
			day:[1,30]
		}, // [ min, max ];
		FightingStats: {
			stats: {
				HP:[30, 60], 
				SP:[10, 40], 
				STR:[8, 10], 
				AGI:[4, 8], 
				END:[4, 6], 
				INT:[4, 5], 
				ASPD:[100, 115]
			}, // [ min, max ];
			lvlup: {
				HP:[5, 6], 
				SP:[1, 2], 
				STR:[1, 2], 
				AGI:[1, 2], 
				END:[1, 2], 
				INT:[1, 2], 
				ASPD:[1, 1]
			} 
		},
		ExperienceStats: { 
			bounty:[2, 4] 
		} // [ min, max ];
	}
}