const CONSTANTS = {
	defaultInletIntend: 2,
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
				height: 600,
			}
		},
		partPopup: {
			mini: true,
			style: {
				top: 160,
				left: 12,
				width: 350,
				height: 300,
			}
		},
		outletPopup: {
			mini: true,
			style: {
				top: 200,
				left: 12,
				width: 350,
				height: 360,
			}
		},
		inletPopup: {
			mini: true,
			style: {
				top: 240,
				left: 12,
				width: 350,
				height: 400,
			}
		},
    },
	code1:[
	'(<Part id="8" offsetx="0.000" offsety="0.000" rotation="0.000" color="#51ff9f" part_id="8" originx="230.696000" originy="133.100000">)',
	'(<Part_attr code="007___10__2">)',
	'(<Part_attr uuid="n8-f9ac4cd3-05a0-4049-ad4d-9cd5271699b5">)',
	'(<slow>)',
	'(<Contour mode="engraving" contour_id="0" c_contour_id="0" pard_id="8" macro="2" closed="0" overcut="0.000,0.000" >)',
	'G0 x7.220855 y101.565167',
	'(<laser_on>)',
	'G1 y121.565167',
	'G1 x16.506569',
	'G2 y111.565167 i0 j-5',
	'G1 x7.220855',
	'(<laser_off>)',
	'(</Contour part_id="8" contour_id="0" c_contour_id="0" >)',
	'(<slow>)',
	'(<Contour mode="engraving" contour_id="1" c_contour_id="1" pard_id="8" macro="2" closed="0" overcut="0.000,0.000" >)',
	'G0 x24.363712 y107.279453',
	'(<laser_on>)',
	'G1 y115.850882',
	'G2 x37.220855 i6.428572 j-.254935',
	'G1 y107.279453',
	'G2 x31.506569 y101.565167 i-5.714286 j0',
	'G2 x24.363712 y107.279453 i-.714285 j6.428572',
	'(<laser_off>)',
	'(</Contour part_id="8" contour_id="1" c_contour_id="1" >)',
	'(<slow>)',
	'(<Contour mode="engraving" contour_id="2" c_contour_id="2" pard_id="8" macro="2" closed="0" overcut="0.000,0.000" >)',
	'G0 x40.077998 y107.279453',
	'(<laser_on>)',
	'G1 y115.850882',
	'G2 x52.935141 i6.428571 j-.255956',
	'G1 y107.279453',
	'G2 x47.220855 y101.565167 i-5.714286 j0',
	'G2 x40.077998 y107.279453 i-.714285 j6.428572',
	'(<laser_off>)',
	'(</Contour part_id="8" contour_id="2" c_contour_id="2" >)',
	'(<slow>)',
	'(<Contour mode="engraving" contour_id="3" c_contour_id="3" pard_id="8" macro="2" closed="0" overcut="0.000,0.000" >)',
	'G0 x67.792283 y120.136596',
	'(<laser_on>)',
	'G3 x55.792283 y115.850882 i-4.682113 j-5.832941',
	'G1 y107.279453',
	'G3 x68.649426 i6.428572 j.255004',
	'G1 y108.708025',
	'G3 x55.792283 i-6.428572 j-.255916',
	'(<laser_off>)',
	'(</Contour part_id="8" contour_id="3" c_contour_id="3" >)',
	'(<slow>)',
	'(<Inlet mode="engraving" contour_id="4" c_contour_id="4" pard_id="8" macro="2" pulse="0">)',
	'G0 x144.8035 y48.3505',
	'(<laser_on>)',
	'G1 x139.65',
	'(<Contour mode="inner" contour_id="4" c_contour_id="4" pard_id="8" macro="1" closed="1" overcut="140.050,53.504" >)',
	'G1 x139.65 y48.3505',
	'G1 y53.504',
	'G1 x150.15',
	'G1 y43.197',
	'G1 x139.65',
	'G1 y48.3505',
	'(<laser_off>)',
	'(</Contour part_id="8" contour_id="4" c_contour_id="4" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="5" c_contour_id="5" pard_id="8" macro="1" pulse="0">)',
	'G0 x58.519 y83.4515',
	'(<laser_on>)',
	'G1 x53.185667 y81.565882',
	'G2 x50.519 y83.4515 i-.666667 j1.885618',
	'(<Contour mode="inner" contour_id="5" c_contour_id="5" pard_id="8" macro="0" closed="1" overcut="50.521,90.300" >)',
	'G1 x50.519 y83.4515',
	'G1 y90.1',
	'G2 x60.519 y100.1 i9.999993 j.000007',
	'G1 x93.519',
	'G2 x103.519 y90.1 i.000007 j-9.999993',
	'G1 y76.803',
	'G2 x93.519 y66.803 i-9.999993 j-.000007',
	'G1 x60.519',
	'G2 x50.519 y76.803 i-.000007 j9.999993',
	'G1 y83.4515',
	'(<laser_off>)',
	'(</Contour part_id="8" contour_id="5" c_contour_id="5" >)',
	'(<slow>)',
	'(<Inlet mode="outer" contour_id="6" c_contour_id="6" pard_id="8" macro="0" pulse="0">)',
	'G0 x.407779 y54.278116',
	'(<laser_on>)',
	'G1 x4.676245 y57.990285',
	'G2 x7.849 y57.2155 i1.31245 j-1.509131',
	'(<Contour mode="outer" contour_id="6" c_contour_id="6" pard_id="8" macro="0" closed="1" overcut="15.400,39.100" >)',
	'G1 x7.849 y57.2155',
	'G1 x15 y39.1',
	'G1 x32.679',
	'G1 y29.1',
	'G1 x65.2',
	'G1 y39.1',
	'G1 x110.23',
	'G1 y29.1',
	'G1 x129.9 y0',
	'G1 y10',
	'G1 x177.9',
	'G1 y0',
	'G1 x210.654 y29.1',
	'G1 y39.1',
	'G1 x230.696',
	'G1 y42.109',
	'G3 x224.13 y51.501 i-10.000002 j.000106',
	'G1 x149.9 y78.641',
	'G1 y101.033',
	'G1 x139.9',
	'G1 y115.806',
	'G1 x149.9',
	'G1 y123.1',
	'G1 x128.264',
	'G1 y133.1',
	'G1 x105.2',
	'G1 y123.1',
	'G1 x41.325',
	'G1 y133.1',
	'G1 x18.83',
	'G1 y123.1',
	'G1 x0',
	'G1 y79.002',
	'G3 x.698 y75.331 i9.998027 j-.000844',
	'G1 x7.849 y57.2155',
	'(<laser_off>)',
	'(</Contour part_id="8" contour_id="6" c_contour_id="6" >)',
	'(</Part id="8" part_id="8">)'],
	code2:
	[
		`(<Part id="6" offsetx="0.000" offsety="0.000" rotation="0.000" color="#5ec641" part_id="6" originx="189.000000" originy="200.000000">)`
		,`(<Part_attr code="22___10__1">)`
		,`(<Part_attr uuid="n6-2490d6d3-c0ff-4508-948e-3cc3a822512c">)`
		,`(<slow>)`
		,`(<Contour mode="engraving" contour_id="0" c_contour_id="0" pard_id="6" macro="2" closed="0" overcut="0.000,0.000" >)`
		,"G0 x22.379605 y186.433064"
		,`(<laser_on>)`
		,"G2 x28.808176 y192.861635 i6.428571 j0"
		,"G1 x35.236748"
		,"G2 x41.665319 y186.433064 i0 j-6.428571"
		,"G1 y184.290207"
		,"G2 x39.434502 y179.422392 i-6.429153 j.00127"
		,"G1 x22.379605 y162.861635"
		,"G1 x41.665319"
		,`(<laser_off>)`
		,`(</Contour part_id="6" contour_id="0" c_contour_id="0" >)`
		,`(<slow>)`
		,`(<Contour mode="engraving" contour_id="1" c_contour_id="1" pard_id="6" macro="2" closed="0" overcut="0.000,0.000" >)`
		,"G0 x45.951033 y186.433064"
		,`(<laser_on>)`
		,"G2 x52.379605 y192.861635 i6.428571 j0"
		,"G1 x58.808176"
		,"G2 x65.236748 y186.433064 i.000001 j-6.428571"
		,"G1 y184.290207"
		,"G2 x63.005931 y179.422392 i-6.429154 j.00127"
		,"G1 x45.951033 y162.861635"
		,"G1 x65.236748"
		,`(<laser_off>)`
		,`(</Contour part_id="6" contour_id="1" c_contour_id="1" >)`
		,`(<slow>)`
		,`(<Inlet mode="inner" contour_id="2" c_contour_id="2" pard_id="6" macro="1" pulse="0">)`
		,"G0 x77 y62.714"
		,`(<laser_on>)`
		,"G1 x73.333333 y61.417638"
		,"G2 x71.5 y62.714 i-.458333 j1.296362"
		,`(<Contour mode="inner" contour_id="2" c_contour_id="2" pard_id="6" macro="0" closed="1" overcut="77.400,68.214" >)`
		,"G1 x71.5 y62.714"
		,"G2 x77 y68.214 i5.5 j0"
		,"G1 x81"
		,"G2 y57.214 i0 j-5.5"
		,"G1 x77"
		,"G2 x71.5 y62.714 i0 j5.5"
		,`(<laser_off>)`
		,`(</Contour part_id="6" contour_id="2" c_contour_id="2" >)`
		,`(<slow>)`
		,`(<Inlet mode="inner" contour_id="3" c_contour_id="3" pard_id="6" macro="1" pulse="0">)`
		,"G0 x77 y12.714"
		,`(<laser_on>)`
		,"G1 x73.333333 y14.010362"
		,"G3 x71.5 y12.714 i-.458333 j-1.296362"
		,`(<Contour mode="inner" contour_id="3" c_contour_id="3" pard_id="6" macro="0" closed="1" overcut="77.400,7.214" >)`
		,"G1 x71.5 y12.714"
		,"G3 x77 y7.214 i5.5 j0"
		,"G1 x81"
		,"G3 y18.214 i0 j5.5"
		,"G1 x77"
		,"G3 x71.5 y12.714 i0 j-5.5"
		,`(<laser_off>)`
		,`(</Contour part_id="6" contour_id="3" c_contour_id="3" >)`
		,`(<slow>)`
		,`(<Inlet mode="inner" contour_id="4" c_contour_id="4" pard_id="6" macro="1" pulse="0">)`
		,"G0 x27 y12.714"
		,`(<laser_on>)`
		,"G1 x23.333333 y11.417638"
		,"G2 x21.5 y12.714 i-.458333 j1.296362"
		,`(<Contour mode="inner" contour_id="4" c_contour_id="4" pard_id="6" macro="0" closed="1" overcut="27.400,18.214" >)`
		,"G1 x21.5 y12.714"
		,"G2 x27 y18.214 i5.5 j0"
		,"G1 x31"
		,"G2 y7.214 i0 j-5.5"
		,"G1 x27"
		,"G2 x21.5 y12.714 i0 j5.5"
		,`(<laser_off>)`
		,`(</Contour part_id="6" contour_id="4" c_contour_id="4" >)`
		,`(<slow>)`
		,`(<Inlet mode="inner" contour_id="5" c_contour_id="5" pard_id="6" macro="1" pulse="0">)`
		,"G0 x27 y62.714"
		,`(<laser_on>)`
		,"G1 x23.333333 y61.417638"
		,"G2 x21.5 y62.714 i-.458333 j1.296362"
		,`(<Contour mode="inner" contour_id="5" c_contour_id="5" pard_id="6" macro="0" closed="1" overcut="27.400,68.214" >)`
		,"G1 x21.5 y62.714"
		,"G2 x27 y68.214 i5.5 j0"
		,"G1 x31"
		,"G2 y57.214 i0 j-5.5"
		,"G1 x27"
		,"G2 x21.5 y62.714 i0 j5.5"
		,`(<laser_off>)`
		,`(</Contour part_id="6" contour_id="5" c_contour_id="5" >)`
		,`(<slow>)`
		,`(<Inlet mode="outer" contour_id="6" c_contour_id="6" pard_id="6" macro="1" pulse="0">)`
		,"G0 x6 y133.644"
		,`(<laser_on>)`
		,"G1 x7.885618 y128.310667"
		,"G2 x6 y125.644 i-1.885618 j-.666667"
		,`(<Contour mode="outer" contour_id="6" c_contour_id="6" pard_id="6" macro="0" closed="1" overcut="0.000,125.244" >)`
		,"G1 x6 y125.644"
		,"G1 x0"
		,"G1 y74.311"
		,"G1 x12"
		,"G1 y49.714"
		,"G1 x0"
		,"G1 y12.714"
		,"G1 x12"
		,"G1 y0"
		,"G1 x177"
		,"G1 y12.714"
		,"G1 x189"
		,"G1 y49.714"
		,"G1 x177"
		,"G1 y74.311"
		,"G1 x189"
		,"G1 y125.644"
		,"G1 x177"
		,"G1 y145.322"
		,"G1 x189"
		,"G1 y180.322"
		,"G1 x177"
		,"G1 y200"
		,"G1 x12"
		,"G1 y180.322"
		,"G1 x0"
		,"G1 y145.322"
		,"G1 x12"
		,"G1 y125.644"
		,"G1 x6"
		,`(<laser_off>)`
		,`(</Contour part_id="6" contour_id="6" c_contour_id="6" >)`
		,`(</Part id="6" part_id="6">)`],
	code3 : [ ' (<Part id="6" offsetx="0.000" offsety="0.000" rotation="0.000" color="#5ec641" part_id="6" originx="189.000000" originy="200.000000">)',
	' (<Part_attr code="22___10__1">)',
	' (<Part_attr uuid="n6-2490d6d3-c0ff-4508-948e-3cc3a822512c">)',
	' (<slow>)',
	' (<Contour mode="engraving" contour_id="0" c_contour_id="0" pard_id="6" macro="2" closed="0" overcut="0.000,0.000" >)',
	' G0 x22.379605 y186.433064',
	' (<laser_on>)',
	' G2 x28.808176 y192.861635 i6.428571 j0',
	' G1 x35.236748',
	' G2 x41.665319 y186.433064 i0 j-6.428571',
	' G1 y184.290207',
	' G2 x39.434502 y179.422392 i-6.429153 j.00127',
	' G1 x22.379605 y162.861635',
	' G1 x41.665319',
	' (<laser_off>)',
	' (</Contour part_id="6" contour_id="0" c_contour_id="0" >)',
	' (<slow>)',
	' (<Contour mode="engraving" contour_id="1" c_contour_id="1" pard_id="6" macro="2" closed="0" overcut="0.000,0.000" >)',
	' G0 x45.951033 y186.433064',
	' (<laser_on>)',
	' G2 x52.379605 y192.861635 i6.428571 j0',
	' G1 x58.808176',
	' G2 x65.236748 y186.433064 i.000001 j-6.428571',
	' G1 y184.290207',
	' G2 x63.005931 y179.422392 i-6.429154 j.00127',
	' G1 x45.951033 y162.861635',
	' G1 x65.236748',
	' (<laser_off>)',
	' (</Contour part_id="6" contour_id="1" c_contour_id="1" >)',
	' (<slow>)',
	' (<Inlet mode="inner" contour_id="2" c_contour_id="2" pard_id="6" macro="1" pulse="0">)',
	' G0 x149.388304 y64.502911',
	' (<laser_on>)',
	' G2 x143.888304 y64.502913 i-2.75 j.000001',
	' (<Contour mode="inner" contour_id="2" c_contour_id="2" pard_id="6" macro="0" closed="1" overcut="0.000,0.000" >)',
	' G1 x143.888304 y64.502913',
	' G2 x149.388303 y70.002875 i5.49998 j-.000019',
	' G1 x153.388303',
	' G2 y59.002951 i-.00469 j-5.499962',
	' G1 x149.388303',
	' G2 x143.888304 y64.502913 i-.000019 j5.49998',
	' (<Outlet mode="inner" macro="0" >)',
	' G1 x143.888304 y64.502913',
	' G2 x149.888304 y64.502911 i3 j-.000001',
	' (<laser_off>)',
	' (</Contour part_id="6" contour_id="2" c_contour_id="2" >)',
	' (<slow>)',
	' (<Contour mode="inner" contour_id="3" c_contour_id="3" pard_id="6" macro="0" closed="1" overcut="21.504,64.704" >)',
	' G0 x21.5 y64.504',
	' (<laser_on>)',
	' G2 x27 y70.004 i5.5 j0',
	' G1 x31',
	' G2 y59.004 i0 j-5.5',
	' G1 x27',
	' G2 x21.5 y64.504 i0 j5.5',
	' (<laser_off>)',
	' (</Contour part_id="6" contour_id="3" c_contour_id="3" >)',
	' (<slow>)',
	' (<Inlet mode="inner" contour_id="4" c_contour_id="4" pard_id="6" macro="1" pulse="0">)',
	' G0 x103.6604 y64.502216',
	' (<laser_on>)',
	' G1 x99.993735 y63.205851',
	' G2 x98.1604 y64.502212 i-.458335 j1.296362',
	' (<Contour mode="inner" contour_id="4" c_contour_id="4" pard_id="6" macro="0" closed="1" overcut="0.000,0.000" >)',
	' G1 x98.1604 y64.502212',
	' G2 x103.660438 y70.002257 i5.500042 j.000003',
	' G1 x107.660466',
	' G2 y59.002166 i0 j-5.500045',
	' G1 x103.660438',
	' G2 x98.1604 y64.502212 i.000004 j5.500042',
	' (<Outlet mode="inner" macro="0" >)',
	' G1 x98.1604 y64.502212',
	' G2 x100.160399 y65.916427 i1.5 j.000001',
	' G1 x104.1604 y64.502216',
	' (<laser_off>)',
	' (</Contour part_id="6" contour_id="4" c_contour_id="4" >)',
	' (<slow>)',
	' (<Inlet mode="inner" contour_id="5" c_contour_id="5" pard_id="6" macro="1" pulse="0">)',
	' G0 x66.241379 y64.496756',
	' (<laser_on>)',
	' G1 x60.741379',
	' (<Contour mode="inner" contour_id="5" c_contour_id="5" pard_id="6" macro="0" closed="1" overcut="66.641,69.997" >)',
	' G1 x60.741379 y64.496756',
	' G2 x66.241377 y69.996833 i5.500037 j.00004',
	' G1 x70.241376',
	' G2 y58.99668 i0 j-5.500076',
	' G1 x66.241377',
	' G2 x60.741379 y64.496756 i.000039 j5.500037',
	' G1 x66.741379',
	' G1 x60.741379',
	' (<laser_off>)',
	' (</Contour part_id="6" contour_id="5" c_contour_id="5" >)',
	' (<slow>)',
	' (<Inlet mode="outer" contour_id="6" c_contour_id="6" pard_id="6" macro="1" pulse="0">)',
	' G0 x6 y133.644',
	' (<laser_on>)',
	' G1 x7.885618 y128.310667',
	' G2 x6 y125.644 i-1.885618 j-.666667',
	' (<Contour mode="outer" contour_id="6" c_contour_id="6" pard_id="6" macro="0" closed="1" overcut="0.000,125.244" >)',
	' G1 x6 y125.644',
	' G1 x0',
	' G1 y74.311',
	' G1 x12',
	' G1 y49.714',
	' G1 x0',
	' G1 y12.714',
	' G1 x12',
	' G1 y0',
	' G1 x177',
	' G1 y12.714',
	' G1 x189',
	' G1 y49.714',
	' G1 x177',
	' G1 y74.311',
	' G1 x189',
	' G1 y125.644',
	' G1 x177',
	' G1 y145.322',
	' G1 x189',
	' G1 y180.322',
	' G1 x177',
	' G1 y200',
	' G1 x12',
	' G1 y180.322',
	' G1 x0',
	' G1 y145.322',
	' G1 x12',
	' G1 y125.644',
	' G1 x6',
	' (<laser_off>)',
	' (</Contour part_id="6" contour_id="6" c_contour_id="6" >)',
	' (</Part id="6" part_id="6">)'],
	code4:[
	`(<Part id="3" offsetx="0.000" offsety="0.000" rotation="0.000" color="#42f74b" part_id="3" originx="170.000000" originy="125.868362">) `,
	`(<Part_attr code="Kron datchika skorosti 2??">) `,
	`(<Part_attr uuid="n3-6b6e3ca8-5317-40e1-beb2-4b48fba0a3e5">) `,
	`(<slow>) `,
	`(<Contour mode="engraving" contour_id="0" c_contour_id="0" pard_id="3" macro="2" closed="0" overcut="0.000,0.000" >) `,
	`G0 x110.286041 y60.438362 `,
	`(<laser_on>) `,
	`G1 x59.713959 `,
	`(<laser_off>) `,
	`(</Contour part_id="3" contour_id="0" c_contour_id="0" >) `,
	`(<slow>) `,
	`(<Contour mode="engraving" contour_id="1" c_contour_id="1" pard_id="3" macro="2" closed="0" overcut="0.000,0.000" >) `,
	`G0 x54.847679 y62.468123 `,
	`(<laser_on>) `,
	`G1 y125.868362 `,
	`(<laser_off>) `,
	`(</Contour part_id="3" contour_id="1" c_contour_id="1" >) `,
	`(<slow>) `,
	`(<Inlet mode="inner" contour_id="2" c_contour_id="2" pard_id="3" macro="0" pulse="0">) `,
	`G0 x132 y17.158445 `,
	`(<laser_on>) `,
	`G1 x130.333333 y18.649157 `,
	`G3 x127 y17.158445 i-1.333333 j-1.490712 `,
	`(<Contour mode="inner" contour_id="2" c_contour_id="2" pard_id="3" macro="0" closed="1" overcut="134.400,10.158" >) `,
	`G1 x127 y17.158445 `,
	`G3 x134 y10.158445 i7 j0 `,
	`G1 x159 `,
	`G3 y24.158445 i0 j7 `,
	`G1 x134 `,
	`G3 x127 y17.158445 i0 j-7 `,
	`(<laser_off>) `,
	`(</Contour part_id="3" contour_id="2" c_contour_id="2" >) `,
	`(<slow>) `,
	`(<Inlet mode="inner" contour_id="3" c_contour_id="3" pard_id="3" macro="0" pulse="0">) `,
	`G0 x85 y84.768362 `,
	`(<laser_on>) `,
	`G1 x83.509288 y83.101696 `,
	`G3 x85 y79.768362 i1.490712 j-1.333334 `,
	`(<Contour mode="inner" contour_id="3" c_contour_id="3" pard_id="3" macro="0" closed="1" overcut="91.100,86.268" >) `,
	`G1 x85 y79.768362 `,
	`G3 x91.1 y85.868362 i0 j6.1 `,
	`G1 y105.868362 `,
	`G3 x78.9 i-6.1 j0 `,
	`G1 y85.868362 `,
	`G3 x85 y79.768362 i6.1 j0 `,
	`(<laser_off>) `,
	`(</Contour part_id="3" contour_id="3" c_contour_id="3" >) `,
	`(<slow>) `,
	`(<Inlet mode="inner" contour_id="4" c_contour_id="4" pard_id="3" macro="0" pulse="0">) `,
	`G0 x9 y17.158445 `,
	`(<laser_on>) `,
	`G1 x7.333333 y18.649157 `,
	`G3 x4 y17.158445 i-1.333333 j-1.490712 `,
	`(<Contour mode="inner" contour_id="4" c_contour_id="4" pard_id="3" macro="0" closed="1" overcut="11.400,10.158" >) `,
	`G1 x4 y17.158445 `,
	`G3 x11 y10.158445 i7 j0 `,
	`G1 x36 `,
	`G3 y24.158445 i0 j7 `,
	`G1 x11 `,
	`G3 x4 y17.158445 i0 j-7 `,
	`(<laser_off>) `,
	`(</Contour part_id="3" contour_id="4" c_contour_id="4" >) `,
	`(<slow>) `,
	`(<Inlet mode="outer" contour_id="5" c_contour_id="5" pard_id="3" macro="0" pulse="0">) `,
	`G0 x2.944311 y33.925668 `,
	`(<laser_on>) `,
	`G1 x5.171871 y34.120536 `,
	`G2 x6.947405 y30.929798 i.174296 j-1.99239 `,
	`(<Contour mode="outer" contour_id="5" c_contour_id="5" pard_id="3" macro="0" closed="1" overcut="2.971,25.130" >) `,
	`G1 x6.947405 y30.929798 `,
	`G3 x3.076923 y25.29979 i68.052596 j-50.929796 `,
	`G3 x0 y14.641016 i16.923077 j-10.658774 `,
	`G1 y14 `,
	`G3 x14 y0 i14 j0 `,
	`G1 x33.038476 `,
	`G3 x41.69873 y5 i0 j10 `,
	`G2 x128.30127 i43.30127 j-25 `,
	`G3 x136.961524 y0 i8.660254 j5 `,
	`G1 x156 `,
	`G3 x170 y14 i0 j14 `,
	`G1 y14.641016 `,
	`G3 x166.923077 y25.29979 i-20 j0 `,
	`G3 x158.742455 y36.230769 i-71.923076 j-45.299791 `,
	`G3 x143.74423 y43 i-14.998225 j-13.230769 `,
	`G1 x116.286041 `,
	`G2 x110.286041 y49 i0 j6 `,
	`G1 y105.868362 `,
	`G3 x90.286041 y125.868362 i-20 j0 `,
	`G1 x49.417679 `,
	`G3 x44.417679 y120.868362 i0 j-5 `,
	`G1 y63.468362 `,
	`G3 x45.417679 y62.468362 i1 j0 `,
	`G1 x59.713959 y62.468 `,
	`G1 y49 `,
	`G2 x53.713959 y43 i-6 j0 `,
	`G1 x26.25577 `,
	`G3 x11.257545 y36.230769 i0 j-20 `,
	`G3 x6.947405 y30.929798 i63.742452 j-56.230772 `,
	`(<laser_off>) `,
	`(</Contour part_id="3" contour_id="5" c_contour_id="5" >) `,
	`(</Part id="3" part_id="3">) `,
	],
	code5:['(<Part id="1" offsetx="0.000" offsety="0.000" rota…_id="1" originx="90.000000" originy="90.000000">)',
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
	code6:['(<Part id="1" offsetx="0.000" offsety="0.000" rota…_id="1" originx="90.000008" originy="90.000031">)',
	'(<Part_attr code="aa5-1111111111111111-21">)',
	'(<Part_attr uuid="n1-98d1943b-4157-4d74-a5f5-dcdaf55d0942">)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="0" c_contour_id="0" pard_id="1" macro="0" pulse="0">)',
	'G0 x46.253971 y12.969229',
	'(<laser_on>)',
	'G3 x41.818011 y13.182031 i-2.31464 j-1.90852',
	'(<Contour mode="inner" contour_id="0" c_contour_id…1" macro="0" closed="1" overcut="43.464,5.770" >)',
	'G1 x41.818011 y13.182031',
	'G3 x43.277916 y5.842592 i3.181982 j-3.181981',
	'G3 x49.499992 y10.00005 i1.722076 j4.157458',
	'G3 x41.818011 y13.182031 i-4.5 j.000001',
	'(<laser_off>)',
	'(</Contour part_id="1" contour_id="0" c_contour_id="0" >)',
	'(<slow>)',
	'(<Contour mode="inner" contour_id="1" c_contour_id…" macro="0" closed="1" overcut="46.693,75.831" >)',
	'G0 x46.50655 y75.759734',
	'(<laser_on>)',
	'G3 x47.595227 y83.676292 i-1.506558 j4.240316',
	'G3 x40.499992 y80.00005 i-2.595235 j-3.676242',
	'G3 x46.50655 y75.759734 i4.5 j0',
	'(<laser_off>)',
	'(</Contour part_id="1" contour_id="1" c_contour_id="1" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="2" c_contour_id="2" pard_id="1" macro="0" pulse="0">)',
	'G0 x57.499992 y45.00005',
	'(<laser_on>)',
	'G1 x61.249992 y44.031804',
	'G3 x62.499992 y45.00005 i.25 j.968246',
	'(<Contour mode="inner" contour_id="2" c_contour_id…"1" macro="0" closed="1" overcut="0.000,0.000" >)',
	'G1 x62.499992 y45.00005',
	'G3 x27.499992 i-17.5 j0',
	'G3 x62.499992 i17.5 j0',
	'(<Outlet mode="inner" macro="0" >)',
	'G1 x62.499992 y45.00005',
	'G1 x60.499992',
	'(<laser_off>)',
	'(</Contour part_id="1" contour_id="2" c_contour_id="2" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="3" c_contour_id="3" pard_id="1" macro="0" pulse="0">)',
	'G0 x80.332312 y43.795034',
	'(<laser_on>)',
	'G1 x81.196345 y40.661993',
	'(<Contour mode="inner" contour_id="3" c_contour_id…" macro="0" closed="1" overcut="82.565,48.698" >)',
	'G1 x81.196345 y40.661993',
	'G3 x82.726382 y48.580105 i-1.196354 j4.338057',
	'G3 x75.499992 y45.00005 i-2.72639 j-3.580056',
	'G3 x81.196345 y40.661993 i4.5 j0',
	'(<laser_off>)',
	'(</Contour part_id="1" contour_id="3" c_contour_id="3" >)',
	'(<slow>)',
	'(<Inlet mode="inner" contour_id="4" c_contour_id="4" pard_id="1" macro="0" pulse="0">)',
	'G0 x13.76336 y44.00004',
	'(<laser_on>)',
	'G1 x12.349146 y48.00004',
	'G2 x13.76336 y50.00004 i1.414214 j.5',
	'(<Contour mode="inner" contour_id="4" c_contour_id…" macro="0" closed="1" overcut="18.963,49.996" >)',
	'G1 x13.76336 y50.00004',
	'G1 x18.763369',
	'G2 y40.000036 i-.004472 j-5.000002',
	'G1 x8.763352',
	'G2 y50.00004 i.004472 j5.000002',
	'G1 x13.76336',
	'(<laser_off>)',
	'(</Contour part_id="1" contour_id="4" c_contour_id="4" >)',
	'(<slow>)',
	'(<Inlet mode="outer" contour_id="5" c_contour_id="5" pard_id="1" macro="0" pulse="0">)',
	'G0 x87.336202 y71.601654',
	'(<laser_on>)',
	'G1 x84.676124 y68.786696',
	'G2 x83.102581 y68.941493 i-.726819 j.686831',
	'(<Contour mode="outer" contour_id="5" c_contour_id…"1" macro="0" closed="1" overcut="0.000,0.000" >)',
	'G1 x83.102581 y68.941493',
	'G3 x1.758713 y32.542452 i-38.102588 j-23.941445',
	'G3 x89.999992 y45.00005 i43.241279 j12.4576',
	'G3 x83.102581 y68.941493 i-45 j0',
	'(<Outlet mode="outer" macro="0" >)',
	'G1 x83.102581 y68.941493',
	'G2 x84.357303 y71.956844 i1.693448 j1.064064',
	'G1 x89.876375 y73.19775',
	'(<laser_off>)',
	'(</Contour part_id="1" contour_id="5" c_contour_id="5" >)',
	'(</Part id="1" part_id="1">)']
}

export default CONSTANTS;