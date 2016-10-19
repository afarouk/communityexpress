'use strict';

module.exports = {
	options: {
		"animate":true,
		"captureRightClick":true,
		"grid":{  
			"drawGridLines": false, 
			"gridLineColor": 'transparent',
		    "background": 'transparent',     
		    "borderColor": 'transparent',     
		    "borderWidth": 0,          
			"shadow":false
		},
		"seriesColors":[],
		"axes":{  
			"xaxis":{  
			"showTicks":false,
			"drawMajorGridlines":false
			},
			"yaxis":{  
			"showTicks":true,
			"drawMajorGridlines":true,
			"rendererOptions":{  
				"tickOptions":{  
					 "mark":null,
					 "fontSize":12
				}
			},
			"ticks":[],
			}
		},
		"seriesDefaults":{
			"shadow":false,
			"rendererOptions":{  
				"varyBarColor":true,
				"barDirection":"horizontal",
				"barPadding":0,
				"barMargin":0,
				"barWidth":22,
				"highlightMouseDown":true
			},
			"pointLabels":{
				"show":true,
				"stacked":true,
				"formatString": "%d votes"
			}
		}
	}
};
