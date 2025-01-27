import axios from 'axios';
import util from '../utils/util';
import CONSTANTS from '../constants/constants.js';
import SVGPathCommander from 'svg-path-commander';


class Part {
    constructor() {
        this.primaryTimeout = false
        this.handle = false
        this.lastContourId = false
        this.mode = 'resize'
        this.resizingHandle = null;
        this.initialRectTop = false
        this.initialRectBottom = false
        this.initialRectLeft = false
        this.initialRectRight = false
        this.initialHeight = false
        this.initialWidth = false
        this.contourIntends = false
        this.sgn = false
        this.copied = false
        this.piercingModes= {'normal':0, 'without_time':-1, 'pulse':1}
        this.operatingModes= ['cutting', 'pulse', 'engraving', 'macro3', 'macro4','cutless']
        this.ratio=1
        //this.figureId = Object.keys(VALUES.figures)[0]
        this.autoFigure=[]
    }

    static #params = {
        width: 189,
        height:200
    };

    static setSvgParams(newParams) {
        this.#params = { ...this.#params, ...newParams };
    }

    static getSvgParams(param=false) {
        if (!param) return this.#params
        return this.#params[param];
    }

    static updateRect() {
 
    }
      
    static normalizeIntends () {
    }

    static biggestCid() {
        const elements = document.querySelectorAll('[data-cid]');
        let maxDataCid = 0;

        for (let i = 0; i < elements.length; i++) {
            const dataCid = parseInt(elements[i].getAttribute('data-cid'));
            maxDataCid = Math.max(maxDataCid, dataCid);
        }
        return maxDataCid + 1
    }

	static async getPartCode(handle = 0, number = 6) {
        try {
            const response = await axios({
                method: "GET",
                url: `http://127.0.0.1/editor/getpart?handle=${handle}&program_no=${number}`,
            });
			return Part.ncpToSvg ( response.data , number)
        } catch (error) {
            console.error("Ошибка при получении данных: ", error);
            //return null;
            return Part.ncpToSvg ()
        }
    }

    static add(create=false) {
    }
    
    static ncpToSvg(ncpCode, number) {
        let svg = []
        //const ncpLines = ncpCode.code

        const ncpLines = CONSTANTS.code2
     
        let currentX, currentY
        let path = 'closed'
        let mode = ''
        let cid;
        let jointContainerOpen = false;
        for (const line of ncpLines) {
            if (line.includes('(<Part id="')) {
                Part.width = +util.getAttributeValue(line, 'originx')
                Part.height = +util.getAttributeValue(line, 'originy')
				Part.setSvgParams({width: Part.width, height: Part.height})                                
            } else if (line.includes('(<Inlet')) {
                let x = util.getValueFromString(line, 'x')
                let y = util.getValueFromString(line, 'y')
                cid = util.getAttributeValue(line, 'contour_id')
                let innerOuter = util.getAttributeValue(line, 'mode')
                let macroValue = +util.getAttributeValue(line, 'macro')
                let pulseValue = +util.getAttributeValue(line, 'pulse')
                
                /// !!!TODO при сохрание еслм два тов пирсинге -1 todo
                if (pulseValue === -1) pulseValue = 2

                let inlet=  
                    {
                        cid:+cid,
                        class:`inlet ${innerOuter} ${'macro' + macroValue} ${'pulse'+pulseValue}`,
                        path:'',
                        stroke:'red',
                        strokeWidth:0.2,
                       // piercingMode:piercingMode
                    }
                svg.push(inlet)                
                
                currentX = x
                currentY = y
                mode = 'inlet'
                path = 'open'

            } else if (line.includes('(<Outlet')) {
                //svg += `"></path></g>`;
                let x = +util.getValueFromString(line, 'x')
                let y = +util.getValueFromString(line, 'y')
                let innerOuter = util.getAttributeValue(line, 'mode')
                let macroValue = +util.getAttributeValue(line, 'macro')
                //svg += `<g data-cid="${this.lastContourId}" fill="none" class="outlet ${innerOuter} ${'macro' + macroValue}" stroke="lime" stroke-width="0.2">`

                let outlet=  
                {
                    cid: +this.lastContourId,
                    class:`outlet ${innerOuter} ${'macro' + macroValue}`,
                    path:'',
                    stroke:'lime',
                    strokeWidth:0.2,
                    //piercingMode: null
                }
                svg.push(outlet)                
               
                currentX = x
                currentY = y
                mode = 'outlet'
                path = 'open'
            } else if (line.includes('(<Contour')) {
                if (mode === 'inlet') {
                    //svg += `"></path></g>`;
                    mode = 'contour'
                }
                Part.joints=''
                let eng = line.includes('mode="engraving"')
                cid = util.getAttributeValue(line, 'contour_id')
                let macroValue = +util.getAttributeValue(line, 'macro')
                let innerOuter = util.getAttributeValue(line, 'mode')
                let openClosed = +util.getAttributeValue(line, 'closed')
                this.lastContourId = +cid
              
                let contour = 
                {
                    cid: +cid,
                    class:`contour ${innerOuter} ${'macro' + macroValue} ${'closed' + openClosed}`,
                    path:'',
                    stroke:'red',
                    strokeWidth:0.2,
                    //piercingMode: null,
                    selected:false
                }
                svg.push(contour)
                path = 'open'
            } else if (line.includes('(<laser_on>)')) {
                // Включите лазер, если необходимо
            } else if (line.includes('(<laser_off>)')) {
                // Выключите лазер, если необходимо
            } else if (line.includes('G0 ')) {
                // Обработайте команды G0 (быстрое перемещение)
                if (true) {
                    let x = util.getValueFromString(line, 'x')
                    let y = util.getValueFromString(line, 'y')
                    if (x == null) x = currentX;
                    if (y == null) y = currentY;
                    svg[svg.length-1]['path']+= `M${util.round(x)} ${util.round(Part.height - y)} `;
                    currentX = x
                    currentY = y
                    path = 'continued'
                }
            } else if (line.includes('G1 ')) {
                // Обработайте команды G1 (линейное перемещение)
                const xMatch = line.match(/x(\S+)/);
                const yMatch = line.match(/y(\S+)/);
                if (xMatch && yMatch) {
                    // If both x and y are matched, add an SVG 'L' command
                    let x = util.getValueFromString(line, 'x')
                    let y = util.getValueFromString(line, 'y')
                    if (x == null) x = currentX;
                    if (y == null) y = currentY;

                    if (path !== 'continued') {
                        svg[svg.length-1]['path']+= `M${util.round(x)} ${util.round(Part.height - y)} `;
                    } else {
                        svg[svg.length-1]['path']+= `L${util.round(x)} ${util.round(Part.height - y)} `;
                    }
                    currentX = x
                    currentY = y

                } else if (xMatch) {
                    // If only x is matched, add an SVG 'H' command
                    let x = util.getValueFromString(line, 'x');
                    svg[svg.length-1]['path']+= `H${util.round(x)} `;
                    currentX = x
                } else if (yMatch) {
                    // If only y is matched, add an SVG 'V' command
                    let y = util.getValueFromString(line, 'y');
                    svg[svg.length-1]['path'] += `V${util.round(Part.height - y)} `;
                    currentY = y
                }
                path = 'continued'

            } else if (line.includes('G2 ')) {
                // Process G2 commands
                if (true) {
                    let x = util.getValueFromString(line, 'x')
                    let y = util.getValueFromString(line, 'y')
                    let i = util.getValueFromString(line, 'i');
                    let j = util.getValueFromString(line, 'j');

                    if (i == null) i = 0;
                    if (j == null) j = 0;
                    if (x == null) x = currentX;
                    if (y == null) y = currentY;

                    let r = util.round(Math.sqrt(i ** 2 + j ** 2))
                    let largeArcFlag = util.getLargeArcFlag(currentX, currentY, x, y, i, j, false);

                    svg[svg.length-1]['path'] += `A${r} ${r} 0 ${largeArcFlag} 1 ${util.round(x)} ${util.round(Part.height - y)} `;
                    currentX = x;
                    currentY = y;
                }
            } else if (line.includes('G3 ')) {
                // Process G3 commands
                if (true) {
                    let x = util.getValueFromString(line, 'x')
                    let y = util.getValueFromString(line, 'y')
                    let i = util.getValueFromString(line, 'i');
                    let j = util.getValueFromString(line, 'j');
                    if (i == null) i = 0;
                    if (j == null) j = 0;
                    if (x == null) x = currentX;
                    if (y == null) y = currentY;

                    let r = util.round(Math.sqrt(i ** 2 + j ** 2))
                    let largeArcFlag = util.getLargeArcFlag(currentX, currentY, x, y, i, j, true);
                    svg[svg.length-1]['path']+= `A${r} ${r} 0 ${largeArcFlag} 0 ${util.round(x)} ${util.round(Part.height - y)} `;
                    currentX = x;
                    currentY = y;
                }
            } else if (line.includes('</Contour')) {
                path = 'closed'
                jointContainerOpen = false

            } else if (line.includes('(<Joint')){
                /*let x = +util.getAttributeValue(line, 'x')
                let y = +util.getAttributeValue(line, 'y')
                let dp = +util.getAttributeValue(line, 'dp');
                let length = +util.getAttributeValue(line, 'length');
                let path =  util.getJoint(x,y)
                let uuid = util.uuid()
                let jointClass = 'manual'
                if (!jointContainerOpen){
                    jointContainerOpen = true
                    document.querySelector('#jointSize').value = length
                    this.joints+=`<g data-cid="${cid}" fill="none" class="joint" stroke="white" stroke-width="0.5">`
                }
                this.joints=this.joints.replace(/<\/g>$/g,'')
                this.joints+=`<path d="${path}" fill="none" id="${uuid}" class="joint ${jointClass}" data-dist="${dp}" data-length='${length}'></path>`
                this.joints+=`</g>`;  */

            } 
        }
        let que = ['outer', 'contour','engraving', 'inlet', 'outlet', 'joint'].reverse()
        svg = svg.sort((a,b)=>{
             let  ac = a.class.split(' ').map(a => que.indexOf(a)).sort((a,b)=> b-a)[0]
             let  bc = b.class.split(' ').map(a => que.indexOf(a)).sort((a,b)=> b-a)[0]
             return bc-ac
        })

        let cids = [] 
        svg.map(a => cids.push(a.cid))
        cids = [ ...new Set (cids)]
        console.log (cids)
        cids.forEach((id, i, arr) =>{
            console.log ('cui')
            let contour = svg.filter(a=> a.cid === id && a.class.includes('contour'))
            let inlet = svg.filter(a=> a.cid === id && a.class.includes('inlet'))
            let outlet = svg.filter(a=> a.cid === id && a.class.includes('outlet'))
            
            if (!inlet.length && !contour[0].class.includes('engraving')) {
                let ad = {
                    cid: Number(id), 
                    class: contour[0].class.replace('contour', 'inlet'), 
                    path: '',
                    stroke: 'red', 
                    strokeWidth: 0.2
                }
                svg.push(ad)
            }

            if (!outlet.length && !contour[0].class.includes('engraving')) {
                let ad = {
                    cid: Number(id), 
                    class: contour[0].class.replace('contour', 'outlet'), 
                    path: '',
                    stroke: 'red', 
                    strokeWidth: 0.2
                }
                svg.push(ad)
            }
        })

        let pcode = util.getValueFromString(ncpLines[1], 'code', false).replaceAll('="', '').replaceAll('">)', '')
        let uuid = util.getValueFromString(ncpLines[2], 'uuid', false).replaceAll('="', '').replaceAll('">)', '')
		//console.log (svg)        
        return {width: Part.width, height: Part.height,code:svg, params:{ id: number, code: pcode, uuid: uuid}}        
    }

    static detectContourType (classes) {
        for (let t in CONSTANTS.contourTypes) {
            if (classes.includes(CONSTANTS.contourTypes[t])){
                return CONSTANTS.contourTypes[t]
            } 
        }
        return ''
    }
    
    static detectPiercingType (classes) {
        if (!classes) return -1
        if ( classes.includes('pulse0')) return 0
        if ( classes.includes('pulse1')) return 1
        if ( classes.includes('pulse2')) return 2
        return -1
    }   
    
    static detectContourModeType (classes) {
        //console.log ('detectContourModeType' + classes)
        for (let t in CONSTANTS.operatingModes) {
            if (classes.includes(CONSTANTS.operatingModes[t])){
                return t
            } 
        }
        return -1        
    }
    
    static partDetectCollision ( data ) {
        var start = performance.now()
        console.log ('partDetectCollision')
        let inners = data 
        console.log (data)

        let polygons = {}
        Part.collisionDetected = false
        let detected =[]
        
		for (let i = 0; i < inners.length; i++) {
            let id1= inners[i].cid
            let p1 =  inners[i].path
            let rect1 = SVGPathCommander.getPathBBox (p1)

   
            for (let j =i+1; j < inners.length; j++) {
                let id2= inners[j].cid
                if (id1 !== id2) {

                   let p2 =  inners[j].path 
                   let rect2 = SVGPathCommander.getPathBBox (p2)
                   let collisionAABB = Part.intersectsAABB(rect1, rect2)    
                    if (  collisionAABB  ) {   
                            
                        if (!polygons.hasOwnProperty(`${id1}`)) {
                            polygons[`${id1}`] = Part.stringToEdges(  util.pathToPolyline( p1, 1 ) )
                        }

                        if (!polygons.hasOwnProperty(`${id2}`)) {
                            polygons[`${id2}`] = Part.stringToEdges(  util.pathToPolyline( p2, 1 ) )
                        }

                        let collisionShape = Part.intersectsShape (  polygons[`${id1}`],  polygons[`${id2}`])
                        if ( collisionShape ) {
                            
                            detected.push( inners[i].cid )
                            detected.push( inners[j].cid )
                            Part.collisionDetected = true
                           
                        } else {
                            let insideShape = Part.insideShape(polygons[`${id1}`],  polygons[`${id2}`])
                            if (!insideShape) {
                                if ( inners[i].class.includes('outer')) {
                                   // inners[j].classList.add('collision')
                                   detected.push( inners[j].cid)

                                }
                                if ( inners[j].class.includes('outer')) {
                                    //inners[i].classList.add('collision')   
                                    detected.push( inners[i].cid)
                         
                                }
                            }
                        }
                    } else {
                        if ( inners[i].class.includes('outer')) {
                            //inners[j].classList.add('collision')
                            detected.push( inners[j].cid)

                        }

                        if ( inners[j].class.includes('outer')) {
                            //inners[i].classList.add('collision')    
                            detected.push( inners[i].cid)
                        
                        }
                    }
                }
            }
        }

        var end = performance.now()
        console.log("Обработка заняла времени " + (end - start) + " msec")
        return [...new Set(detected)]        
        
    }

    static intersectsAABB(a, b) {
        a.top = a.y
        b.top = b.y
        a.bottom = a.y+ a.height
        b.bottom = b.y+ b.height
        a.right = a.x+ a.width
        b.right = b.x+ b.width
        a.left = a.x
        b.left = b.x
        

		if ( a && typeof a.top === 'number' && b && typeof b.top === 'number' ) {
     		return !(
				a.right < b.left ||
				a.bottom < b.top ||
				a.left > b.right ||
				a.top > b.bottom
			);
		}
		return false
	}

    static stringToEdges(coordString) {
        const coordinates = coordString.split(';');
        const edges = [];
    
        for (let i = 0; i < coordinates.length-1 ; i++) {
            const start = coordinates[i].split(',');
          
            const end = coordinates[i + 1] ? coordinates[i + 1].split(',') : coordinates[0].split(',');
    
            edges.push([
                { x: parseFloat(start[0]), y: parseFloat(start[1]) },
                { x: parseFloat(end[0]), y: parseFloat(end[1]) }
            ]);
        }
    
        return edges;
    }

    static intersectsShape (edges1, edges2) {
        for (let i = 0; i < edges1.length; i++) {
			const edge1 = edges1[i];
			for (let j = 0; j < edges2.length; j++) {
				const edge2 = edges2[j];
				if (util.intersects(edge1, edge2, true)) {
					return true;
				}
			}
		}
    }

    static contains (point, vs) {
		// ray-casting algorithm based on
		// https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html		
		var x = point[0], y = point[1];
		var inside = false;
		for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
			var xi = vs[i]['x'], yi = vs[i]['y'];
			var xj = vs[j]['x'], yj = vs[j]['y'];
			
			var intersect = ((yi > y) != (yj > y))
				&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}		
		return inside;
	};


    static insideShape(a, b) {
        let aHitArea = a.map( aa => aa[0])
        let bHitArea = b.map( bb => bb[0])

		if (
			Part.contains([b[0][0].x, b[0][0].y], aHitArea ) ||
			Part.contains([a[0][0].x, a[0][0].y], bHitArea)
		) {
			return true
		} else {
			return false
		}
	}

} 
export default Part;