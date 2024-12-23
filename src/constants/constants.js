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


}

export default CONSTANTS;