const CONSTANTS = {
	fontSize:11.88,
	kerning:1,
	defaultJointType:"micro",
	defaultJointSize: 0.2,
	defaultInletIntend: 1,
	defaultInletLength: 5,
	defaultStringInterval:18,
	defaultJointSize: 0.2,
    contourTypes:['engraving', 'inner', 'outer'],
    operatingModes:['macro0', 'macro1','macro2', 'macro3', 'macro4', 'macro5', ],
    piercingModes: {'normal':0, 'without_time':-1, 'pulse':1},
    panelPostions:	{
		logPopup: {
			mini: true,
			style: {
				top: 40,
				left: 12,
				width: 350,
				height: 300,
				zIndex:1
			}
		},
		toolsPopup: {
			mini: false,
			style: {
				top: 40,
				left: 300,
				width: 125,
				height: 380,
				zIndex: 2
			}
		},		
		contourPopup: {
			mini: true,
			style: {
				top: 120,
				left: 12,
				width: 350,
				height: 600,
				zIndex: 3
			}
		},
		contourModesPopup: {
			mini: true,
			style: {
				top: 80,
				left: 12,
				width: 350,
				height: 300,
				zIndex: 4
			}
		},
		partPopup: {
			mini: true,
			style: {
				top: 160,
				left: 12,
				width: 350,
				height: 300,
				zIndex: 5
			}
		},
		inletPopup: {
			mini: true,
			style: {
				top: 240,
				left: 12,
				width: 350,
				height: 400,
				zIndex:6
			}
		},
		outletPopup: {
			mini: true,
			style: {
				top: 200,
				left: 12,
				width: 350,
				height: 360,
				zIndex:7
			}
		},		
		textPopup: {
			mini: true,
			style: {
				top: 360,
				left: 12,
				width: 350,
				height: 400,
				zIndex: 8
			}
		},
		jointPopup: {
			mini: true,
			style: {
				top: 320,
				left: 12,
				width: 350,
				height: 360,
				zIndex: 9
			}
		},
		cutPopup: {
			mini: true,
			style: {
				top: 280,
				left: 12,
				width: 350,
				height: 360,
				zIndex: 10 
			}
		},
		pointPopup: {
			mini: true,
			style: {
				top: 200,
				left: 500,
				width: 400,
				height: 120,
				zIndex: 11
			}
		},
		edgePopup: {
			mini: true,
			style: {
				top: 100,
				left: 500,
				width: 350,
				height: 120,
				zIndex: 12
			}
		},
    },
	code1:[`(<Part id="4" offsetx="0.000" offsety="0.000" rotation="0.000" color="#d85b63" part_id="4" originx="112.000000" originy="200.000000">)`, 
	`(<Part_attr code="30___10__4">)`, 
	`(<Part_attr uuid="n4-170fb4da-adea-4bef-b486-01a8ad4a3ea5">)`, 
	`(<slow>)`, 
	`(<Inlet mode="outer" contour_id="0" c_contour_id="0" pard_id="4" macro="1" pulse="0">)`, 
	`G0 x2 y95.38`, 
	`(<laser_on>)`, 
	`G1 x7.333333 y97.265618`, 
	`G2 x10 y95.38 i.666667 j-1.885618`, 
	`(<Contour mode="outer" contour_id="0" c_contour_id="0" pard_id="4" macro="0" closed="1" overcut="9.600,42.040" >)`, 
	`G1 x10 y95.38`, 
	`G1 y42.04`, 
	`G1 x0`, 
	`G1 y13.168`, 
	`G1 x10`, 
	`G1 y0`, 
	`G1 x102`, 
	`G1 y13.168`, 
	`G1 x112`, 
	`G1 y42.04`, 
	`G1 x102`, 
	`G1 y103`, 
	`G1 x112`, 
	`G1 y148.731`, 
	`G1 x102`, 
	`G1 y200`, 
	`G1 x10`, 
	`G1 y148.731`, 
	`G1 x0`, 
	`G1 y103`, 
	`G1 x10`, 
	`G1 y95.38`, 
	`(<laser_off>)`, 
	`(</Contour part_id="4" contour_id="0" c_contour_id="0" >)`, 
	`(</Part id="4" part_id="4">)`],
	code2:
	[
 '(<Part id="14" offsetx="0.000" offsety="0.000" rotation="0.000" color="#99e057" part_id="14" originx=400.296000" originy="356.294000">)',
 '(<Part_attr code="107___10__1">)',
 '(<Part_attr uuid="n14-a39c5d5f-ed73-497e-954b-693e4a73df71">)',
 '(<slow>)',
 '(<Contour mode="engraving" contour_id="0" c_contour_id="14" macro="2" closed="0" overcut="0.000,0.000" >)',
 'G0 x292.551548 y287.005687',
 '(<laser_on>)',
 'G1 x282.551548',
 'G1 y291.648544',
 'G2 x287.551548 i2.5 j0',
 'G1 y287.005687',
 '(<laser_off>)',
 '(</Contour part_id="14" contour_id="0" c_contour_id="0" >)',
 '(<slow>)',
 '(<Contour mode="engraving" contour_id="1" c_contour_id="14" macro="2" closed="0" overcut="0.000,0.000" >)',
 'G0 x286.837262 y297.005687',
 '(<laser_on>)',
 'G1 x282.551548 y299.86283',
 'G1 x292.551548',
 '(<laser_off>)',
 '(</Contour part_id="14" contour_id="1" c_contour_id="1" >)',
 '(<slow>)',
 '(<Contour mode="engraving" contour_id="2" c_contour_id="14" macro="2" closed="0" overcut="0.000,0.000" >)',
 'G0 x289.694405 y303.434259',
 '(<laser_on>)',
 'G1 x285.40869',
 'G2 y309.86283 i.128876 j3.214286',
 'G1 x289.694405',
 'G2 x292.551548 y307.005687 i0 j-2.857143',
 'G2 x289.694405 y303.434259 i-3.214286 j-.357142',
 '(<laser_off>)',
 '(</Contour part_id="14" contour_id="2" c_contour_id="2" >)',
 '(<slow>)',
 '(<Contour mode="engraving" contour_id="3" c_contour_id="14" macro="2" closed="0" overcut="0.000,0.000" >)',
 'G0 x282.551548 y311.291402',
 '(<laser_on>)',
 'G1 y317.719973',
 'G1 x292.551548 y313.434259',
 '(<laser_off>)',
 '(</Contour part_id="14" contour_id="3" c_contour_id="3" >)',
 '(<slow>)',
 '(<Inlet mode="inner" contour_id="4" c_contour_id="4" pard_id="14" macro="1" pulse="0">)',
 'G0 x159.275539 y69.509392',
 '(<laser_on>)',
 'G1 x156.275789 y71.241876',
 'G2 x156.276288 y74.705977 i1.000249 j1.731906',
 '(<Contour mode="inner" contour_id="4" c_contour_id… macro="0" closed="1" overcut="197.226,98.338" >)',
 'G1 x156.276288 y74.705977',
 'G1 x197.052 y98.24',
 'G2 x207.089 y98.217 i4.998679 j-8.661233',
 'G1 x259.367 y67.727',
 'G2 x264.329 y59.089 i-5.037866 j-8.638126',
 'G2 x254.357 y49.833 i-9.972239 j.743951',
 'G1 x149.171',
 'G2 x139.171 y59.833 i-.000007 j9.999993',
 'G2 x144.141 y67.702 i9.969279 j-.792513',
 'G1 x156.276288 y74.705977',
 '(<laser_off>)',
 '(</Contour part_id="14" contour_id="4" c_contour_id="4" >)',
 '(<slow>)',
 '(<Inlet mode="inner" contour_id="5" c_contour_id="5" pard_id="14" macro="1" pulse="0">)',
 'G0 x159.275386 y286.784613',
 '(<laser_on>)',
 'G1 x159.275891 y283.320511',
 'G2 x156.276144 y281.588023 i-2 j-.000292',
 '(<Contour mode="inner" contour_id="5" c_contour_id…macro="0" closed="1" overcut="144.000,288.676" >)',
 'G1 x156.276144 y281.588023',
 'G1 x144.172 y288.574',
 'G2 x139.171 y297.235 i4.998892 j8.660769',
 'G2 x149.141 y306.461 i9.970239 j-.774257',
 'G1 x254.329',
 'G2 x264.329 y296.461 i.000007 j-9.999993',
 'G2 x259.396 y288.584 i-9.97099 j.761214',
 'G1 x207.089 y258.077',
 'G2 x197.052 y258.054 i-5.038321 j8.638233',
 'G1 x156.276144 y281.588023',
 '(<laser_off>)',
 '(</Contour part_id="14" contour_id="5" c_contour_id="5" >)',
 '(<slow>)',
 '(<Inlet mode="inner" contour_id="6" c_contour_id="6" pard_id="14" macro="1" pulse="0">)',
 'G0 x126.316433 y178.147',
 '(<laser_on>)',
 'G1 x123.316433 y176.414949',
 'G2 x120.316433 y178.147 i-1 j1.732051',
 '(<Contour mode="inner" contour_id="6" c_contour_id…macro="0" closed="1" overcut="114.843,187.073" >)',
 'G1 x120.316433 y178.147',
 'G3 x115.192 y186.878 i-10.000147 j0',
 'G1 x54.045 y221.025',
 'G3 x49.17 y222.294 i-4.875073 j-8.729699',
 'G1 x33.296',
 'G2 x23.296 y232.294 i-.000007 j9.999993',
 'G1 y336.294',
 'G2 x25.296 y342.294 i9.99998 j.000007',
 'G1 x95.296',
 'G2 x97.296 y336.294 i-7.99998 j-5.999993',
 'G1 y277.889',
 'G3 x102.42 y269.158 i9.999926 j-.000372',
 'G1 x195.42 y217.224',
 'G3 x205.172 i4.876 j8.731543',
 'G1 x298.172 y269.158',
 'G3 x303.296 y277.889 i-4.875926 j8.730628',
 'G1 y336.294',
 'G2 x305.296 y342.294 i9.99998 j.000007',
 'G1 x375.296',
 'G2 x377.296 y336.294 i-7.99998 j-5.999993',
 'G1 y232.294',
 'G2 x367.296 y222.294 i-9.999993 j-.000007',
 'G1 x351.422',
 'G3 x346.547 y221.025 i.000073 j-9.998699',
 'G1 x285.4 y186.878',
 'G3 y169.416 i4.875714 j-8.731',
 'G1 x346.547 y135.269',
 'G3 x351.422 y134 i4.875073 j8.729699',
 'G1 x367.296',
 'G2 x377.296 y124 i.000007 j-9.999993',
 'G1 y20',
 'G2 x375.296 y14 i-9.99998 j-.000007',
 'G1 x305.296',
 'G2 x303.296 y20 i7.99998 j5.999993',
 'G1 y78.405',
 'G3 x298.172 y87.136 i-9.999926 j.000372',
 'G1 x205.172 y139.07',
 'G3 x195.42 i-4.876 j-8.731543',
 'G1 x127.729 y101.269',
 'G2 x122.854 y100 i-4.875073 j8.729699',
 'G1 x97.296',
 'G1 y87.156',
 'G1 x107.296',
 'G1 y46.156',
 'G1 x97.296',
 'G1 y20',
 'G2 x95.296 y14 i-9.99998 j-.000007',
 'G1 x25.296',
 'G2 x23.296 y20 i7.99998 j5.999993',
 'G1 y124',
 'G2 x33.296 y134 i9.999993 j.000007',
 'G1 x49.17',
 'G3 x54.045 y135.269 i-.000073 j9.998699',
 'G1 x115.192 y169.416',
 'G3 x120.316433 y178.147 i-4.875714 j8.731',
 '(<laser_off>)',
 '(</Contour part_id="14" contour_id="6" c_contour_id="6" >)',
 '(<slow>)',
 '(<Inlet mode="outer" contour_id="7" c_contour_id="7" pard_id="14" macro="1" pulse="0">)',
 'G0 x7.296 y178.147',
 '(<laser_on>)',
 'G1 x10.296 y179.879051',
 'G2 x13.296 y178.147 i1 j-1.732051',
 '(<Contour mode="outer" contour_id="7" c_contour_id…4" macro="0" closed="1" overcut="13.696,0.000" >)',
 'G1 x13.296 y178.147',
 'G1 y0',
 'G1 x110.577',
 'G1 y10',
 'G1 x130.068',
 'G1 y0',
 'G1 x148.089',
 'G1 y10',
 'G1 x202.077',
 'G1 y0',
 'G1 x214.868',
 'G1 y10',
 'G1 x250.685',
 'G1 y0',
 'G1 x265.033',
 'G1 y10',
 'G1 x293.577',
 'G1 y0',
 'G1 x390.296',
 'G1 y25.668',
 'G1 x400.296',
 'G1 y71.668',
 'G1 x390.296',
 'G1 y152.284',
 'G1 x400.296',
 'G1 y204.284',
 'G1 x390.296',
 'G1 y266.713',
 'G1 x400.296',
 'G1 y326.713',
 'G1 x390.296',
 'G1 y346.294',
 'G1 x381.43',
 'G1 y356.294',
 'G1 x294.43',
 'G1 y346.294',
 'G1 x103.607',
 'G1 y356.294',
 'G1 x16.607',
 'G1 y346.294',
 'G1 x10.296',
 'G1 y326.413',
 'G1 x0',
 'G1 y265.413',
 'G1 x10.296',
 'G1 y204.08',
 'G1 x13.296',
 'G1 y178.147',
 '(<laser_off>)',
 '(</Contour part_id="14" contour_id="7" c_contour_id="7" >)',
 '(</Part id="14" part_id="14">)'],
	code3 : [ '(<Part id="6" offsetx="0.000" offsety="0.000" rotation="0.000" color="#5ec641" part_id="6" originx="189.000000" originy="200.000000">)',
	'(<Part_attr code="22___10__1">)',
	'(<Part_attr uuid="n6-2490d6d3-c0ff-4508-948e-3cc3a822512c">)',
	'(<slow>)',
	'(<Contour mode="engraving" contour_id="0" c_contour_id="0" pard_id="6" macro="2" closed="0" overcut="0.000,0.000" >)',
	'G0 x22.379605 y186.433064',
	'(<laser_on>)',
	'G2 x28.808176 y192.861635 i6.428571 j0',
	'G1 x35.236748',
	'G2 x41.665319 y186.433064 i0 j-6.428571',
	'G1 y184.290207',
	'G2 x39.434502 y179.422392 i-6.429153 j.00127',
	'G1 x22.379605 y162.861635',
	'G1 x41.665319',
	'(<laser_off>)',
	'(</Contour part_id="6" contour_id="0" c_contour_id="0" >)',
	'(<slow>)',
	'(<Contour mode="engraving" contour_id="1" c_contour_id="1" pard_id="6" macro="2" closed="0" overcut="0.000,0.000" >)',
	'G0 x45.951033 y186.433064',
	'(<laser_on>)',
	'G2 x52.379605 y192.861635 i6.428571 j0',
	'G1 x58.808176',
	'G2 x65.236748 y186.433064 i.000001 j-6.428571',
	'G1 y184.290207',
	'G2 x63.005931 y179.422392 i-6.429154 j.00127',
	'G1 x45.951033 y162.861635',
	'G1 x65.236748',
	'(<laser_off>)',
	'(</Contour part_id="6" contour_id="1" c_contour_id="1" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="2" c_contour_id="2" pard_id="6" macro="1" pulse="0">)',
	'G0 x149.388304 y64.502911',
	'(<laser_on>)',
	'G2 x143.888304 y64.502913 i-2.75 j.000001',
	'(<Contour mode="inner" contour_id="2" c_contour_id="2" pard_id="6" macro="0" closed="1" overcut="0.000,0.000" >)',
	'G1 x143.888304 y64.502913',
	'G2 x149.388303 y70.002875 i5.49998 j-.000019',
	'G1 x153.388303',
	'G2 y59.002951 i-.00469 j-5.499962',
	'G1 x149.388303',
	'G2 x143.888304 y64.502913 i-.000019 j5.49998',
	'(<Outlet mode="inner" macro="0" >)',
	'G1 x143.888304 y64.502913',
	'G2 x149.888304 y64.502911 i3 j-.000001',
	'(<laser_off>)',
	'(</Contour part_id="6" contour_id="2" c_contour_id="2" >)',
	'(<slow>)',
	'(<Contour mode="inner" contour_id="3" c_contour_id="3" pard_id="6" macro="0" closed="1" overcut="21.504,64.704" >)',
	'G0 x21.5 y64.504',
	'(<laser_on>)',
	'G2 x27 y70.004 i5.5 j0',
	'G1 x31',
	'G2 y59.004 i0 j-5.5',
	'G1 x27',
	'G2 x21.5 y64.504 i0 j5.5',
	'(<laser_off>)',
	'(</Contour part_id="6" contour_id="3" c_contour_id="3" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="4" c_contour_id="4" pard_id="6" macro="1" pulse="0">)',
	'G0 x103.6604 y64.502216',
	'(<laser_on>)',
	'G1 x99.993735 y63.205851',
	'G2 x98.1604 y64.502212 i-.458335 j1.296362',
	'(<Contour mode="inner" contour_id="4" c_contour_id="4" pard_id="6" macro="0" closed="1" overcut="0.000,0.000" >)',
	'G1 x98.1604 y64.502212',
	'G2 x103.660438 y70.002257 i5.500042 j.000003',
	'G1 x107.660466',
	'G2 y59.002166 i0 j-5.500045',
	'G1 x103.660438',
	'G2 x98.1604 y64.502212 i.000004 j5.500042',
	'(<Outlet mode="inner" macro="0" >)',
	'G1 x98.1604 y64.502212',
	'G2 x100.160399 y65.916427 i1.5 j.000001',
	'G1 x104.1604 y64.502216',
	'(<laser_off>)',
	'(</Contour part_id="6" contour_id="4" c_contour_id="4" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="5" c_contour_id="5" pard_id="6" macro="1" pulse="0">)',
	'G0 x66.241379 y64.496756',
	'(<laser_on>)',
	'G1 x60.741379',
	'(<Contour mode="inner" contour_id="5" c_contour_id="5" pard_id="6" macro="0" closed="1" overcut="66.641,69.997" >)',
	'G1 x60.741379 y64.496756',
	'G2 x66.241377 y69.996833 i5.500037 j.00004',
	'G1 x70.241376',
	'G2 y58.99668 i0 j-5.500076',
	'G1 x66.241377',
	'G2 x60.741379 y64.496756 i.000039 j5.500037',
	'G1 x66.741379',
	'G1 x60.741379',
	'(<laser_off>)',
	'(</Contour part_id="6" contour_id="5" c_contour_id="5" >)',
	'(<slow>)',
	'(<Inlet mode="outer" contour_id="6" c_contour_id="6" pard_id="6" macro="1" pulse="0">)',
	'G0 x6 y133.644',
	'(<laser_on>)',
	'G1 x7.885618 y128.310667',
	'G2 x6 y125.644 i-1.885618 j-.666667',
	'(<Contour mode="outer" contour_id="6" c_contour_id="6" pard_id="6" macro="0" closed="1" overcut="0.000,125.244" >)',
	'G1 x6 y125.644',
	'G1 x0',
	'G1 y74.311',
	'G1 x12',
	'G1 y49.714',
	'G1 x0',
	'G1 y12.714',
	'G1 x12',
	'G1 y0',
	'G1 x177',
	'G1 y12.714',
	'G1 x189',
	'G1 y49.714',
	'G1 x177',
	'G1 y74.311',
	'G1 x189',
	'G1 y125.644',
	'G1 x177',
	'G1 y145.322',
	'G1 x189',
	'G1 y180.322',
	'G1 x177',
	'G1 y200',
	'G1 x12',
	'G1 y180.322',
	'G1 x0',
	'G1 y145.322',
	'G1 x12',
	'G1 y125.644',
	'G1 x6',
	'(<laser_off>)',
	'(</Contour part_id="6" contour_id="6" c_contour_id="6" >)',
	'(</Part id="6" part_id="6">)'],
	code4:[
	`(<Part id="3" offsetx="0.000" offsety="0.000" rotation="0.000" color="#42f74b" part_id="3" originx="170.000000" originy="125.868362">)`,
	`(<Part_attr code="Kron datchika skorosti 2??">)`,
	`(<Part_attr uuid="n3-6b6e3ca8-5317-40e1-beb2-4b48fba0a3e5">)`,
	`(<slow>)`,
	`(<Contour mode="engraving" contour_id="0" c_contour_id="0" pard_id="3" macro="2" closed="0" overcut="0.000,0.000" >)`,
	`G0 x110.286041 y60.438362`,
	`(<laser_on>)`,
	`G1 x59.713959`,
	`(<laser_off>)`,
	`(</Contour part_id="3" contour_id="0" c_contour_id="0" >)`,
	`(<slow>)`,
	`(<Contour mode="engraving" contour_id="1" c_contour_id="1" pard_id="3" macro="2" closed="0" overcut="0.000,0.000" >)`,
	`G0 x54.847679 y62.468123`,
	`(<laser_on>)`,
	`G1 y125.868362`,
	`(<laser_off>)`,
	`(</Contour part_id="3" contour_id="1" c_contour_id="1" >)`,
	`(<slow>)`,
	`(<Inlet mode="inner" contour_id="2" c_contour_id="2" pard_id="3" macro="0" pulse="0">)`,
	`G0 x132 y17.158445`,
	`(<laser_on>)`,
	`G1 x130.333333 y18.649157`,
	`G3 x127 y17.158445 i-1.333333 j-1.490712`,
	`(<Contour mode="inner" contour_id="2" c_contour_id="2" pard_id="3" macro="0" closed="1" overcut="134.400,10.158" >)`,
	`G1 x127 y17.158445`,
	`G3 x134 y10.158445 i7 j0`,
	`G1 x159`,
	`G3 y24.158445 i0 j7`,
	`G1 x134`,
	`G3 x127 y17.158445 i0 j-7`,
	`(<laser_off>)`,
	`(</Contour part_id="3" contour_id="2" c_contour_id="2" >)`,
	`(<slow>)`,
	`(<Inlet mode="inner" contour_id="3" c_contour_id="3" pard_id="3" macro="0" pulse="0">)`,
	`G0 x85 y84.768362`,
	`(<laser_on>)`,
	`G1 x83.509288 y83.101696`,
	`G3 x85 y79.768362 i1.490712 j-1.333334`,
	`(<Contour mode="inner" contour_id="3" c_contour_id="3" pard_id="3" macro="0" closed="1" overcut="91.100,86.268" >)`,
	`G1 x85 y79.768362`,
	`G3 x91.1 y85.868362 i0 j6.1`,
	`G1 y105.868362`,
	`G3 x78.9 i-6.1 j0`,
	`G1 y85.868362`,
	`G3 x85 y79.768362 i6.1 j0`,
	`(<laser_off>)`,
	`(</Contour part_id="3" contour_id="3" c_contour_id="3" >)`,
	`(<slow>)`,
	`(<Inlet mode="inner" contour_id="4" c_contour_id="4" pard_id="3" macro="0" pulse="0">)`,
	`G0 x9 y17.158445`,
	`(<laser_on>)`,
	`G1 x7.333333 y18.649157`,
	`G3 x4 y17.158445 i-1.333333 j-1.490712`,
	`(<Contour mode="inner" contour_id="4" c_contour_id="4" pard_id="3" macro="0" closed="1" overcut="11.400,10.158" >)`,
	`G1 x4 y17.158445`,
	`G3 x11 y10.158445 i7 j0`,
	`G1 x36`,
	`G3 y24.158445 i0 j7`,
	`G1 x11`,
	`G3 x4 y17.158445 i0 j-7`,
	`(<laser_off>)`,
	`(</Contour part_id="3" contour_id="4" c_contour_id="4" >)`,
	`(<slow>)`,
	`(<Inlet mode="outer" contour_id="5" c_contour_id="5" pard_id="3" macro="0" pulse="0">)`,
	`G0 x2.944311 y33.925668`,
	`(<laser_on>)`,
	`G1 x5.171871 y34.120536`,
	`G2 x6.947405 y30.929798 i.174296 j-1.99239`,
	`(<Contour mode="outer" contour_id="5" c_contour_id="5" pard_id="3" macro="0" closed="1" overcut="2.971,25.130" >)`,
	`G1 x6.947405 y30.929798`,
	`G3 x3.076923 y25.29979 i68.052596 j-50.929796`,
	`G3 x0 y14.641016 i16.923077 j-10.658774`,
	`G1 y14`,
	`G3 x14 y0 i14 j0`,
	`G1 x33.038476`,
	`G3 x41.69873 y5 i0 j10`,
	`G2 x128.30127 i43.30127 j-25`,
	`G3 x136.961524 y0 i8.660254 j5`,
	`G1 x156`,
	`G3 x170 y14 i0 j14`,
	`G1 y14.641016`,
	`G3 x166.923077 y25.29979 i-20 j0`,
	`G3 x158.742455 y36.230769 i-71.923076 j-45.299791`,
	`G3 x143.74423 y43 i-14.998225 j-13.230769`,
	`G1 x116.286041`,
	`G2 x110.286041 y49 i0 j6`,
	`G1 y105.868362`,
	`G3 x90.286041 y125.868362 i-20 j0`,
	`G1 x49.417679`,
	`G3 x44.417679 y120.868362 i0 j-5`,
	`G1 y63.468362`,
	`G3 x45.417679 y62.468362 i1 j0`,
	`G1 x59.713959 y62.468`,
	`G1 y49`,
	`G2 x53.713959 y43 i-6 j0`,
	`G1 x26.25577`,
	`G3 x11.257545 y36.230769 i0 j-20`,
	`G3 x6.947405 y30.929798 i63.742452 j-56.230772`,
	`(<laser_off>)`,
	`(</Contour part_id="3" contour_id="5" c_contour_id="5" >)`,
	`(</Part id="3" part_id="3">)`,
	],
	code5:[
	'(<Part id="1" offsetx="0.000" offsety="0.000" rotation="0.00" contour_id="1" originx="90.000000" originy="90.000000">)',
	'(<Part_attr code="aa5-1111111111111111-21">)',
	'(<Part_attr uuid="n1-98d1943b-4157-4d74-a5f5-dcdaf55d0942">)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="0" c_contour_id="0" pard_id="1" macro="0" pulse="0">)',
	'G0 x46.253979 y12.969179',
	'(<laser_on>)',
	'G3 x41.818019 y13.181981 i-2.31464 j-1.908519',
	'(<Contour mode="inner" contour_id="0" c_contour_id…1" macro="0" closed="1" overcut="43.464,5.770" >)',
	'G1 x41.818019 y13.181981',
	'G3 x43.277924 y5.842542 i3.181981 j-3.181981',
	'G3 x49.5 y10 i1.722076 j4.157458',
	'G3 x41.818019 y13.181981 i-4.5 j0',
	'(<laser_off>)',
	'(</Contour part_id="1" contour_id="0" c_contour_id="0" >)',
	'(<slow>)',
	'(<Contour mode="inner" contour_id="1" c_contour_id…"1" macro="0" closed="0" overcut="0.000,0.000" >)',
	'G0 x13.181981 y41.818019',
	'(<laser_on>)',
	'G3 x11.722076 y49.157458 i-3.181981 j3.181981',
	'G3 x5.5 y45 i-1.722076 j-4.157458',
	'G3 x14.5 i4.5 j0',
	'G3 x13.181981 y48.181981 i-4.5 j.000001',
	'(<laser_off>)',
	'(</Contour part_id="1" contour_id="1" c_contour_id="1" >)',
	'(<slow>)',
	'(<Contour mode="inner" contour_id="2" c_contour_id…" macro="0" closed="1" overcut="46.693,75.831" >)',
	'G0 x46.506558 y75.759684',
	'(<laser_on>)',
	'G3 x47.595235 y83.676242 i-1.506558 j4.240316',
	'G3 x40.5 y80 i-2.595235 j-3.676242',
	'G3 x46.506558 y75.759684 i4.5 j0',
	'(<laser_off>)',
	'(</Contour part_id="1" contour_id="2" c_contour_id="2" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="3" c_contour_id="3" pard_id="1" macro="0" pulse="0">)',
	'G0 x57.5 y45',
	'(<laser_on>)',
	'G1 x61.25 y44.031754',
	'G3 x62.5 y45 i.25 j.968246',
	'(<Contour mode="inner" contour_id="3" c_contour_id…"1" macro="0" closed="1" overcut="0.000,0.000" >)',
	'G1 x62.5 y45',
	'G3 x27.5 i-17.5 j0',
	'G3 x62.5 i17.5 j0',
	'(<Outlet mode="inner" macro="0" >)',
	'G1 x62.5 y45',
	'G1 x60.5',
	'(<laser_off>)',
	'(</Contour part_id="1" contour_id="3" c_contour_id="3" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="4" c_contour_id="4" pard_id="1" macro="0" pulse="0">)',
	'G0 x80.33232 y43.794984',
	'(<laser_on>)',
	'G1 x81.196353 y40.661943',
	'(<Contour mode="inner" contour_id="4" c_contour_id…" macro="0" closed="1" overcut="82.565,48.698" >)',
	'G1 x81.196353 y40.661943',
	'G3 x82.72639 y48.580055 i-1.196353 j4.338057',
	'G3 x75.5 y45 i-2.72639 j-3.580055',
	'G3 x81.196353 y40.661943 i4.5 j0',
	'(<laser_off>)',
	'(</Contour part_id="1" contour_id="4" c_contour_id="4" >)',
	'(<slow>)',
	'(<Inlet mode="outer" contour_id="5" c_contour_id="5" pard_id="1" macro="0" pulse="0">)',
	'G0 x87.33621 y71.601604',
	'(<laser_on>)',
	'G1 x84.676132 y68.786646',
	'G2 x83.102589 y68.941443 i-.726819 j.68683',
	'(<Contour mode="outer" contour_id="5" c_contour_id…"1" macro="0" closed="1" overcut="0.000,0.000" >)',
	'G1 x83.102589 y68.941443',
	'G3 x1.758721 y32.542402 i-38.102589 j-23.941443',
	'G3 x90 y45 i43.241279 j12.457598',
	'G3 x83.102589 y68.941443 i-45 j0',
	'(<Outlet mode="outer" macro="0" >)',
	'G1 x83.102589 y68.941443',
	'G2 x84.357311 y71.956794 i1.693448 j1.064065',
	'G1 x89.876383 y73.1977',
	'(<laser_off>)',
	'(</Contour part_id="1" contour_id="5" c_contour_id="5" >)',
	'(</Part id="1" part_id="1">)'],
	code6:[
	'(<Part id="2" offsetx="0.000" offsety="0.000" rotation="0.000" color="#2f57b5" part_id="2" originx="255.000000" originy="399.000000">)',
	'(<Part_attr code="12___10__2">)',
	'(<Part_attr uuid="n2-d0170e56-3c47-411e-84de-813bb41a7245">)',
	'(<slow>)',
	'(<Contour mode="engraving" contour_id="0" c_contour_id="0" pard_id="2" macro="2" closed="0" overcut="0.000,0.000" >)',
	'G0 x37.719272 y221.387075',
	'(<laser_on>)',
	'G1 x46.2907 y234.244218',
	'G1 y204.244218',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="0" c_contour_id="0" >)',
	'(<slow>)',
	'(<Contour mode="engraving" contour_id="1" c_contour_id="1" pard_id="2" macro="2" closed="0" overcut="0.000,0.000" >)',
	'G0 x57.004986 y227.815647',
	'(<laser_on>)',
	'G2 x63.433557 y234.244218 i6.428571 j0',
	'G1 x69.862129',
	'G2 x76.2907 y227.815647 i0 j-6.428571',
	'G1 y225.672789',
	'G2 x74.059883 y220.804975 i-6.429153 j.001271',
	'G1 x57.004986 y204.244218',
	'G1 x76.2907',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="1" c_contour_id="1" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="2" c_contour_id="2" pard_id="2" macro="1" pulse="0">)',
	'G0 x22.5 y326.5',
	'(<laser_on>)',
	'G1 x17.166667 y324.614382',
	'G2 x14.5 y326.5 i-.666667 j1.885618',
	'(<Contour mode="inner" contour_id="2" c_contour_id="2" pard_id="2" macro="0" closed="1" overcut="14.503,346.700" >)',
	'G1 x14.5 y326.5',
	'G1 y346.5',
	'G2 x30.5 i8 j0',
	'G1 y306.5',
	'G2 x14.5 i-8 j0',
	'G1 y326.5',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="2" c_contour_id="2" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="3" c_contour_id="3" pard_id="2" macro="1" pulse="0">)',
	'G0 x75 y329',
	'(<laser_on>)',
	'G1 x73.821489 y332.333333',
	'G2 x75 y334 i1.178511 j.416667',
	'(<Contour mode="inner" contour_id="3" c_contour_id="3" pard_id="2" macro="0" closed="1" overcut="80.000,333.600" >)',
	'G1 x75 y334',
	'G1 x80',
	'G1 y304',
	'G1 x70',
	'G1 y334',
	'G1 x75',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="3" c_contour_id="3" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="4" c_contour_id="4" pard_id="2" macro="1" pulse="0">)',
	'G0 x65 y374',
	'(<laser_on>)',
	'G1 x61.666667 y372.821489',
	'G2 x60 y374 i-.416667 j1.178511',
	'(<Contour mode="inner" contour_id="4" c_contour_id="4" pard_id="2" macro="0" closed="1" overcut="60.400,379.000" >)',
	'G1 x60 y374',
	'G1 y379',
	'G1 x90',
	'G1 y369',
	'G1 x60',
	'G1 y374',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="4" c_contour_id="4" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="5" c_contour_id="5" pard_id="2" macro="1" pulse="0">)',
	'G0 x160 y374',
	'(<laser_on>)',
	'G1 x156.666667 y372.821489',
	'G2 x155 y374 i-.416667 j1.178511',
	'(<Contour mode="inner" contour_id="5" c_contour_id="5" pard_id="2" macro="0" closed="1" overcut="155.400,379.000" >)',
	'G1 x155 y374',
	'G1 y379',
	'G1 x195',
	'G1 y369',
	'G1 x155',
	'G1 y374',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="5" c_contour_id="5" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="6" c_contour_id="6" pard_id="2" macro="1" pulse="0">)',
	'G0 x232.5 y326.5',
	'(<laser_on>)',
	'G1 x227.166667 y324.614382',
	'G2 x224.5 y326.5 i-.666667 j1.885618',
	'(<Contour mode="inner" contour_id="6" c_contour_id="6" pard_id="2" macro="0" closed="1" overcut="224.503,346.700" >)',
	'G1 x224.5 y326.5',
	'G1 y346.5',
	'G2 x240.5 i8 j0',
	'G1 y306.5',
	'G2 x224.5 i-8 j0',
	'G1 y326.5',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="6" c_contour_id="6" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="7" c_contour_id="7" pard_id="2" macro="1" pulse="0">)',
	'G0 x200.5 y326.5',
	'(<laser_on>)',
	'G1 x195.166667 y324.614382',
	'G2 x192.5 y326.5 i-.666667 j1.885618',
	'(<Contour mode="inner" contour_id="7" c_contour_id="7" pard_id="2" macro="0" closed="1" overcut="192.503,346.700" >)',
	'G1 x192.5 y326.5',
	'G1 y346.5',
	'G2 x208.5 i8 j0',
	'G1 y306.5',
	'G2 x192.5 i-8 j0',
	'G1 y326.5',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="7" c_contour_id="7" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="8" c_contour_id="8" pard_id="2" macro="1" pulse="0">)',
	'G0 x180 y329',
	'(<laser_on>)',
	'G1 x178.821489 y332.333333',
	'G2 x180 y334 i1.178511 j.416667',
	'(<Contour mode="inner" contour_id="8" c_contour_id="8" pard_id="2" macro="0" closed="1" overcut="185.000,333.600" >)',
	'G1 x180 y334',
	'G1 x185',
	'G1 y304',
	'G1 x175',
	'G1 y334',
	'G1 x180',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="8" c_contour_id="8" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="9" c_contour_id="9" pard_id="2" macro="1" pulse="0">)',
	'G0 x108.025 y283.243',
	'(<laser_on>)',
	'G1 x102.691667 y281.357382',
	'G2 x100.025 y283.243 i-.666667 j1.885618',
	'(<Contour mode="inner" contour_id="9" c_contour_id="9" pard_id="2" macro="0" closed="1" overcut="100.027,325.443" >)',
	'(<Joint type="micro" dp="25.0" length="0.2" d="74.93869018554688" d1="75.13869018554688" x="127.25350189208984" y="63.75699996948242">)',
	'(<Joint type="micro" dp="50.0" length="0.2" d="149.87738037109375" d1="150.07738037109374" x="154.48199462890625" y="115.75700378417969">)',
	'(<Joint type="micro" dp="75.0" length="0.2" d="224.81607055664062" d1="225.0160705566406" x="127.2535171508789" y="167.7570037841797">)',
	'G1 x100.025 y283.243',
	'G1 y325.243',
	'G2 x110.025 y335.243 i9.999993 j.000007',
	'G1 x144.482',
	'G2 x154.482 y325.243 i.000007 j-9.999993',
	'G1 y241.243',
	'G2 x144.482 y231.243 i-9.999993 j-.000007',
	'G1 x110.025',
	'G2 x100.025 y241.243 i-.000007 j9.999993',
	'G1 y283.243',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="9" c_contour_id="9" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="10" c_contour_id="10" pard_id="2" macro="1" pulse="0">)',
	'G0 x122.5 y199.5',
	'(<laser_on>)',
	'G1 x119.166667 y198.321489',
	'G2 x117.5 y199.5 i-.416667 j1.178511',
	'(<Contour mode="inner" contour_id="10" c_contour_id="10" pard_id="2" macro="0" closed="1" overcut="117.900,204.500" >)',
	'G1 x117.5 y199.5',
	'G1 y204.5',
	'G1 x177.5',
	'G1 y194.5',
	'G1 x117.5',
	'G1 y199.5',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="10" c_contour_id="10" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="11" c_contour_id="11" pard_id="2" macro="1" pulse="0">)',
	'G0 x232.5 y72.5',
	'(<laser_on>)',
	'G1 x227.166667 y70.614382',
	'G2 x224.5 y72.5 i-.666667 j1.885618',
	'(<Contour mode="inner" contour_id="11" c_contour_id="11" pard_id="2" macro="0" closed="1" overcut="224.503,92.700" >)',
	'G1 x224.5 y72.5',
	'G1 y92.5',
	'G2 x240.5 i8 j0',
	'G1 y52.5',
	'G2 x224.5 i-8 j0',
	'G1 y72.5',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="11" c_contour_id="11" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="12" c_contour_id="12" pard_id="2" macro="1" pulse="0">)',
	'G0 x200.5 y72.5',
	'(<laser_on>)',
	'G1 x195.166667 y70.614382',
	'G2 x192.5 y72.5 i-.666667 j1.885618',
	'(<Contour mode="inner" contour_id="12" c_contour_id="12" pard_id="2" macro="0" closed="1" overcut="192.503,92.700" >)',
	'(<Joint type="micro" dp="38.38098042509091" length="0.2" d="50.0" d1="50.2" x="208.5" y="311.36358642578125">)',
	'(<Joint type="micro" dp="50.0" length="0.2" d="65.13642883300781" d1="65.33642883300782" x="208.5" y="326.5">)',
	'(<Joint type="micro" dp="76.76196085018182" length="0.2" d="100.0" d1="100.2" x="198.23573303222656" y="354.17498779296875">)',
	'(<Joint type="micro" dp="99.84647607829964" length="0.2" d="130.07285766601564" d1="130.27285766601562" x="192.5" y="326.70001220703125">)',
	'G1 x192.5 y72.5',
	'G1 y92.5',
	'G2 x208.5 i8 j0',
	'G1 y52.5',
	'G2 x192.5 i-8 j0',
	'G1 y72.5',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="12" c_contour_id="12" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="13" c_contour_id="13" pard_id="2" macro="1" pulse="0">)',
	'G0 x180 y70',
	'(<laser_on>)',
	'G1 x181.178511 y66.666667',
	'G2 x180 y65 i-1.178511 j-.416667',
	'(<Contour mode="inner" contour_id="13" c_contour_id="13" pard_id="2" macro="0" closed="1" overcut="175.000,65.400" >)',
	'G1 x180 y65',
	'G1 x175',
	'G1 y95',
	'G1 x185',
	'G1 y65',
	'G1 x180',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="13" c_contour_id="13" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="14" c_contour_id="14" pard_id="2" macro="1" pulse="0">)',
	'G0 x160 y25',
	'(<laser_on>)',
	'G1 x156.666667 y23.821489',
	'G2 x155 y25 i-.416667 j1.178511',
	'(<Contour mode="inner" contour_id="14" c_contour_id="14" pard_id="2" macro="0" closed="1" overcut="155.400,30.000" >)',
	'G1 x155 y25',
	'G1 y30',
	'G1 x195',
	'G1 y20',
	'G1 x155',
	'G1 y25',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="14" c_contour_id="14" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="15" c_contour_id="15" pard_id="2" macro="1" pulse="0">)',
	'G0 x65 y25',
	'(<laser_on>)',
	'G1 x61.666667 y23.821489',
	'G2 x60 y25 i-.416667 j1.178511',
	'(<Contour mode="inner" contour_id="15" c_contour_id="15" pard_id="2" macro="0" closed="1" overcut="60.400,30.000" >)',
	'G1 x60 y25',
	'G1 y30',
	'G1 x90',
	'G1 y20',
	'G1 x60',
	'G1 y25',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="15" c_contour_id="15" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="16" c_contour_id="16" pard_id="2" macro="1" pulse="0">)',
	'G0 x22.5 y72.5',
	'(<laser_on>)',
	'G1 x17.166667 y70.614382',
	'G2 x14.5 y72.5 i-.666667 j1.885618',
	'(<Contour mode="inner" contour_id="16" c_contour_id="16" pard_id="2" macro="0" closed="1" overcut="14.503,92.700" >)',
	'G1 x14.5 y72.5',
	'G1 y92.5',
	'G2 x30.5 i8 j0',
	'G1 y52.5',
	'G2 x14.5 i-8 j0',
	'G1 y72.5',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="16" c_contour_id="16" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="17" c_contour_id="17" pard_id="2" macro="1" pulse="0">)',
	'G0 x75 y70',
	'(<laser_on>)',
	'G1 x76.178511 y66.666667',
	'G2 x75 y65 i-1.178511 j-.416667',
	'(<Contour mode="inner" contour_id="17" c_contour_id="17" pard_id="2" macro="0" closed="1" overcut="70.000,65.400" >)',
	'(<Joint type="micro" dp="99.75" length="0.2" d="79.8" d1="80.0" x="75.19999694824219" y="334.0">)',
	'G1 x75 y65',
	'G1 x70',
	'G1 y95',
	'G1 x80',
	'G1 y65',
	'G1 x75',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="17" c_contour_id="17" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="18" c_contour_id="18" pard_id="2" macro="1" pulse="0">)',
	'G0 x108.025 y115.757',
	'(<laser_on>)',
	'G1 x102.691667 y113.871382',
	'G2 x100.025 y115.757 i-.666667 j1.885618',
	'(<Contour mode="inner" contour_id="18" c_contour_id="18" pard_id="2" macro="0" closed="1" overcut="100.027,157.957" >)',
	'(<Joint type="micro" dp="16.680293725474986" length="0.2" d="50.00000000000001" d1="50.20000000000001" x="103.05715942382812" y="234.07025146484375">)',
	'(<Joint type="micro" dp="33.36058745094997" length="0.2" d="100.00000000000001" d1="100.20000000000002" x="151.53726196289062" y="234.15621948242188">)',
	'(<Joint type="micro" dp="50.04088117642495" length="0.2" d="150.0" d1="150.2" x="154.48199462890625" y="283.3656005859375">)',
	'(<Joint type="micro" dp="66.72117490189994" length="0.2" d="200.00000000000003" d1="200.20000000000002" x="151.3613739013672" y="332.5005798339844">)',
	'(<Joint type="micro" dp="83.40146862737492" length="0.2" d="250.0" d1="250.2" x="102.88350677490234" y="332.2428283691406">)',
	'G1 x100.025 y115.757',
	'G1 y157.757',
	'G2 x110.025 y167.757 i9.999993 j.000007',
	'G1 x144.482',
	'G2 x154.482 y157.757 i.000007 j-9.999993',
	'G1 y73.757',
	'G2 x144.482 y63.757 i-9.999993 j-.000007',
	'G1 x110.025',
	'G2 x100.025 y73.757 i-.000007 j9.999993',
	'G1 y115.757',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="18" c_contour_id="18" >)',
	'(<slow>)',
	'(<Inlet mode="outer" contour_id="19" c_contour_id="19" pard_id="2" macro="1" pulse="0">)',
	'G0 x7 y199.5',
	'(<laser_on>)',
	'G1 x12.333333 y201.385618',
	'G2 x15 y199.5 i.666667 j-1.885618',
	'(<Contour mode="outer" contour_id="19" c_contour_id="19" pard_id="2" macro="0" closed="1" overcut="14.998,144.442" >)',
	'(<Joint type="micro" dp="3.748646309454963" length="0.2" d="50.0" d1="50.2" x="15.0" y="249.5">)',
	'(<Joint type="micro" dp="7.497292618909926" length="0.2" d="100.0" d1="100.2" x="4.146144874539459e-06" y="294.1473388671875">)',
	'(<Joint type="micro" dp="11.24593892836489" length="0.2" d="150.00000000000003" d1="150.20000000000002" x="1.9605752186180325e-06" y="344.1473388671875">)',
	'(<Joint type="micro" dp="14.994585237819852" length="0.2" d="200.0" d1="200.2" x="1.293910026550293" y="393.9229736328125">)',
	'(<Joint type="micro" dp="18.743231547274814" length="0.2" d="250.0" d1="250.2" x="49.437049865722656" y="399.0">)',
	'(<Joint type="micro" dp="22.49187785672978" length="0.2" d="300.00000000000006" d1="300.20000000000005" x="94.04627990722656" y="385.72900390625">)',
	'(<Joint type="micro" dp="26.240524166184738" length="0.2" d="350.0" d1="350.2" x="144.04627990722656" y="385.72900390625">)',
	'(<Joint type="micro" dp="29.989170475639703" length="0.2" d="400.0" d1="400.2" x="191.05926513671875" y="392.9000244140625">)',
	'(<Joint type="micro" dp="33.737816785094665" length="0.2" d="450.0" d1="450.2" x="238.655517578125" y="399.0">)',
	'(<Joint type="micro" dp="37.48646309454963" length="0.2" d="500.0" d1="500.2" x="255.0" y="361.0547790527344">)',
	'(<Joint type="micro" dp="41.23510940400459" length="0.2" d="550.0" d1="550.2" x="255.0" y="311.0547790527344">)',
	'(<Joint type="micro" dp="44.98375571345956" length="0.2" d="600.0000000000001" d1="600.2000000000002" x="245.8957061767578" y="264.39569091796875">)',
	'(<Joint type="micro" dp="48.73240202291452" length="0.2" d="650.0000000000001" d1="650.2000000000002" x="240.00001525878906" y="216.40750122070312">)',
	'(<Joint type="micro" dp="52.481048332369475" length="0.2" d="700.0" d1="700.2" x="240.0" y="166.40750122070312">)',
	'(<Joint type="micro" dp="56.229694641824445" length="0.2" d="750.0" d1="750.2" x="254.9918670654297" y="121.76001739501953">)',
	'(<Joint type="micro" dp="59.97834095127941" length="0.2" d="800.0" d1="800.2" x="255.0" y="71.7601318359375">)',
	'(<Joint type="micro" dp="63.72698726073437" length="0.2" d="850.0" d1="850.2" x="255.0" y="21.7601318359375">)',
	'(<Joint type="micro" dp="67.47563357018933" length="0.2" d="900.0" d1="900.2" x="222.4703369140625" y="1.9255276129115373e-06">)',
	'(<Joint type="micro" dp="71.22427987964429" length="0.2" d="949.9999999999999" d1="950.1999999999999" x="177.8610382080078" y="13.27100944519043">)',
	'(<Joint type="micro" dp="74.97292618909925" length="0.2" d="1000.0" d1="1000.2" x="127.86103820800781" y="13.271004676818848">)',
	'(<Joint type="micro" dp="78.72157249855421" length="0.2" d="1050.0" d1="1050.2" x="77.86103820800781" y="13.270999908447266">)',
	'(<Joint type="micro" dp="82.47021880800918" length="0.2" d="1100.0" d1="1100.2" x="33.2518310546875" y="2.032751581282355e-06">)',
	'(<Joint type="micro" dp="86.21886511746413" length="0.2" d="1149.9999999999998" d1="1150.1999999999998" x="4.385132342576981e-06" y="21.037933349609375">)',
	'(<Joint type="micro" dp="89.96751142691912" length="0.2" d="1200.0000000000002" d1="1200.2000000000003" x="2.1995624592818785e-06" y="71.03793334960938">)',
	'(<Joint type="micro" dp="93.71615773637407" length="0.2" d="1250.0" d1="1250.2" x="1.3993190606242933e-08" y="121.03793334960938">)',
	'(<Joint type="micro" dp="97.46480404582904" length="0.2" d="1300.0000000000002" d1="1300.2000000000003" x="15.000001907348633" y="165.6851806640625">)', 
	'G1 x15 y199.5',
	'G1 y144.642',
	'G2 x12.071 y137.571 i-9.999969 j.000123',
	'G1 x2.929 y128.429',
	'G3 x0 y121.358 i7.070969 j-7.071123',
	'G1 y10',
	'G3 x10 y0 i9.999993 j-.000007',
	'G1 x54.555',
	'G3 x62.955 y4.574 i-.000224 j10.000573',
	'G1 x65.619 y8.698',
	'G2 x74.019 y13.271 i8.399306 j-5.427073',
	'G1 x180.981',
	'G2 x189.381 y8.698 i.000694 j-10.000073',
	'G1 x192.045 y4.574',
	'G3 x200.445 y0 i8.400224 j5.426573',
	'G1 x245',
	'G3 x255 y10 i.000007 j9.999993',
	'G1 y121.358',
	'G3 x252.071 y128.429 i-9.999969 j-.000123',
	'G1 x242.929 y137.571',
	'G2 x240 y144.642 i7.070969 j7.071123',
	'G1 y254.358',
	'G2 x242.929 y261.429 i9.999969 j-.000123',
	'G1 x252.071 y270.571',
	'G3 x255 y277.642 i-7.070969 j7.071123',
	'G1 y389',
	'G3 x245 y399 i-9.999993 j.000007',
	'G1 x200.445',
	'G3 x192.045 y394.426 i.000224 j-10.000573',
	'G1 x189.381 y390.302',
	'G2 x180.981 y385.729 i-8.399306 j5.427073',
	'G1 x74.019',
	'G2 x65.619 y390.302 i-.000694 j10.000073',
	'G1 x62.955 y394.426',
	'G3 x54.555 y399 i-8.400224 j-5.426573',
	'G1 x10',
	'G3 x0 y389 i-.000007 j-9.999993',
	'G1 y277.642',
	'G3 x2.929 y270.571 i9.999969 j.000123',
	'G1 x12.071 y261.429',
	'G2 x15 y254.358 i-7.070969 j-7.071123',
	'G1 y199.5',
	'(<laser_off>)',
	'(</Contour part_id="2" contour_id="19" c_contour_id="19" >)',
	'(</Part id="2" part_id="2">)']
	
}

export default CONSTANTS;