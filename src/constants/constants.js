const CONSTANTS = {
    contourTypes:['engraving', 'inner', 'outer'],
    operatingModes:['macro0', 'macro1','macro2', 'macro3', 'macro4', 'macro5', ],
    piercingModes: {'normal':0, 'without_time':-1, 'pulse':1},
    panelPostions:	{
		logPopup: {
			mini: true,
			style: {
				top: 40,
				left: 15,
				width: 350,
				height: 300,
			}
		},
		toolsPopup: {
			mini: false,
			style: {
				top: 40,
				left: 300,
				width: 125,
				height: 380,
			}
		},
		contourModesPopup: {
			mini: true,
			style: {
				top: 80,
				left: 12,
				width: 350,
				height: 300,
			}
		},
		contourPopup: {
			mini: true,
			style: {
				top: 120,
				left: 12,
				width: 350,
				height: 300,
			}
		}
    }

}

export default CONSTANTS;