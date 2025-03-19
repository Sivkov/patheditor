import axios from 'axios';
import util from '../utils/util';
import CONSTANTS from '../constants/constants.js';
import svgStore from '../components/stores/svgStore.js';
import SVGPathCommander from 'svg-path-commander';
import arc from './arc.js';
import svgPath from 'svgpath';
import jointStore from '../components/stores/jointStore.js';
import inlet from './inlet.js';
import log from './log.js'


class Part {
    constructor() {
        this.ncpLines = false
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
      
    static normalizeIntends () {
            let int = {x:Infinity,y:Infinity}
            let outer = svgStore.getFiltered(['contour', 'outer'],)
            let contours = svgStore.getFiltered(['contour'])
            let eBox = util.fakeBox( outer[0].path );
            int.x = eBox.x
            int.y = eBox.y          
    
            if (int.x !== 0 || int.y!== 0) {
                contours.forEach((element)=>{
                    var newPath = util.applyTransform( element.path, 1, 1, -int.x, -int.y, {angle: 0, x:0, y:0})
                    let resp = inlet.getNewInletOutlet( element.cid, 'contour', 'path', newPath )
		            let res = inlet.applyNewPaths ( resp )
                })  
            }
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
        let joints = []
        console.log ('ncp to svg') 
        if ( window.location.href.includes('parteditor')) {   
            this.ncpLines = ncpCode.code
        } else {
            /////
            this.ncpLines = CONSTANTS.code1
        }
     
        let currentX, currentY
        let path = 'closed'
        let mode = ''
        let cid;
        //let jointContainerOpen = false;
        for (const line of this.ncpLines) {
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
                //let eng = line.includes('mode="engraving"')
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
                //jointContainerOpen = false

            } else if (line.includes('(<Joint')){
                let x = +util.getAttributeValue(line, 'x')
                let y = +util.getAttributeValue(line, 'y')
                let dp = +util.getAttributeValue(line, 'dp');
                let d = +util.getAttributeValue(line, 'd');
                let d1 = +util.getAttributeValue(line, 'd1');

                let length = +util.getAttributeValue(line, 'length');
                //let path =  util.getJoint(x,y)
                //let uuid = util.uuid()
                let jj = { [`${cid}`] :{dp,length,x,y,d,d1}}
                joints.push(jj)         
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
        //console.log (cids)
        cids.forEach((id, i, arr) =>{
            //console.log ('cui')
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

        let pcode = util.getValueFromString(this.ncpLines[1], 'code', false).replaceAll('="', '').replaceAll('">)', '')
        let uuid = util.getValueFromString(this.ncpLines[2], 'uuid', false).replaceAll('="', '').replaceAll('">)', '')
		//console.log (svg)        
        return {
            width: Part.width, 
            height: Part.height,
            code:svg, 
            params:{ id: number, code: pcode, uuid: uuid},
            joints:joints,
        }        
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
            //let rect1 = SVGPathCommander.getPathBBox (p1)
            let rect1 = util.fakeBox (p1)

   
            for (let j =i+1; j < inners.length; j++) {
                let id2= inners[j].cid
                if (id1 !== id2) {

                   let p2 =  inners[j].path 
                   //let rect2 = SVGPathCommander.getPathBBox (p2)
                   let rect2 = util.fakeBox (p2)
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
			
			var intersect = ((yi > y) !== (yj > y))
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

    static async savePart(action = false) {
        let contours = svgStore.getFiltered(['contour'],['engraving'])
        this.partDetectCollision( contours )
        this.normalizeIntends()
        if (this.collisionDetected) {
            const ignoreColissions = document.getElementById('ignoreColissions').checked;
            if (!ignoreColissions) {
                console.log ("Столкновения не дают сохраниться")
                return
            }
        } 

        var url = new URL(window.location.href);
        var searchParams = new URLSearchParams(url.search);
        var handle = searchParams.get('handle') || 0;
        var partNumber = searchParams.get('part') || 0;
        let code = JSON.stringify({ "code": this.createSgn() })
    
        //console.log(code)
        
        try {
            const response = await axios.post(
              `/editor/setpart?handle=${handle}&program_no=${partNumber}`,
              code,
              {
                headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                },
              }
            );
        
            const data = response.data;
        
            if (data?.status === 'exception') {
              console.log('Saving was failed by remote server!');
            }
        
            if (data?.status === 'success') {
              console.log('Part successfully saved!');
            }
        
            if (action) {
              setTimeout(() => {
                   Part.cleanHandle(action); 
               }, 1500);
            } 
          } catch (error) {
            console.log('Error:', error);
          }
    }

    static async cleanHandle(action=false) {
        await log.clearBase();	
        switch (action) {
            case 'reload':
              window.location.reload(); 
              break;
            case 'exit':
              window.location.href = "/main.html";
              break;
            case 'tasks':
              window.location.href = "/tasks.html?hide_close=0";
              break;
            case 'plan editor':
              const url = new URL(window.location.href);
              const searchParams = url.searchParams;
              let filename = searchParams.get('filename');
              if (filename) {
                window.location.href = '/editor.html?filename=' + encodeURIComponent(filename);
              } else if (sessionStorage.getItem('file')) {
                window.location.href = '/editor.html?filename=' + encodeURIComponent(sessionStorage.getItem('file'));
              } else {
                window.location.href = '/editor.html';
              }
              break;
            default:
              console.warn('Unknown action:', action);
        }
        /*
		console.log("CLEANING HANDLE!!!")
	    $.ajax({
            url: '/editor/close?handle=' + part.handle,
            method: 'GET',				 
		}).done(() => {
			console.log("All requests completed successfully");
 			part.handle=''
			if (action==='reload') {
				location.reload()			
			}else if (action==='exit') {
				window.location.href = "./main.html";
			} else if (action==='tasks') {
				window.location.href = "./tasks.html?hide_close=0";
			} else if (action==='plan editor') {       

                const url = new URL(location.href);
                const searchParams = url.searchParams;
                let filename = searchParams.get('filename')
                if (filename){
                    window.location.href='./editor.html?filename='+encodeURI(filename);
                } else if ( sessionStorage.getItem('file') && sessionStorage.getItem('file') !== null ) {
                    window.location.href='./editor.html?filename='+encodeURI(sessionStorage.getItem('file'));
                }else{
                    window.location.href='./editor.html';
                }
			}
		});	*/ 
	}
  
    static detectMacroValue (classes) {
        if ( classes.includes("macro0")){
            return 0
        }  else if ( classes.includes("macro1")){
            return 1
        } else if ( classes.includes("macro2")) {
            return 2
        }  else if ( classes.includes("macro3")) {
            return 3
        } else if ( classes.includes("macro4")) {
            return 4
        } else if ( classes.includes("macro5")) {
            return 5
        } else if ( classes.includes("macro6")) {
            return 6
        } else if ( classes.includes("macro-1")) {
            return -1
        }
    }

    static detectPiercingMode(classes) {       
        if ( classes.includes('pulse0')) {
            return 0
        } else if (classes.includes('pulse1')) {
            return 1
        } else if (classes.includes('pulse2')) {
            return 2
        }
        return 0
    }

    static parsePath(path) {
        path = new svgPath(path).round(6).toString()
        let matches = SVGPathCommander.normalizePath(path)
        let arr = []
        // fix implicit commands
        Part.prevX=false;
        Part.prevY=false;
    
        if (matches) {
            matches.forEach(str => {
                let type = str[0];
                // Get the first character to determine the type of segment
              
                var x, y;
    
                switch (type) {
                    case 'M':
                        x = str[1]
                        y = str[2]
    
                        if (this.pathType === 'engraving' || this.pathType === 'inlet') {
                            this.nStr = `G0`
                        } else {
                            this.nStr = `G1`
                        }
                        if (!isNaN(x)) {
                            this.nStr += ' x' + x
                            Part.prevX = x
                        }
                        if (!isNaN(y)) {
                            Part.prevY = y
                            y = util.round(this.height - y, 6)
                            this.nStr += ' y' + y;
                            arr.push(this.nStr)
                            if (/* this.pathType == 'engraving' || */ this.pathType === 'inlet') {
                                arr.push("(<laser_on>)")
                            }
                        }
                        break;
                    case 'L':
                        x = str[1]
                        y = str[2]
                        this.nStr = `G1`
                        if (!isNaN(x) && x !== Part.prevX ) {
                            this.nStr += ' x' + x
                            Part.prevX = x
                        }
                        if (!isNaN(y) && y !== Part.prevY ) {
                            Part.prevY = y
                            y = util.round(this.height - y, 6)
                            this.nStr += ' y' + y;                            
                        }
                        arr.push(this.nStr)
                        break;
                    case 'A':
                        // Handle "A" segment
                        let r1 = str[1]
                        let r2 = str[2]
                        let degree = str[3]
                        let fA = str[4]
                        let fS = str[5]
                        x = str[6]
                        y = str[7]
                        if (Math.abs(r1 - r2) < 0.001) {
                            let direction = (fS === 1 ? "G2" : "G3")
                            let arcC = util.svgArcToCenterParam(Part.prevX, Part.prevY, r1, r2, degree, fA, fS, x, y)
                            if (arcC && fA === 1) {
                                // если арка большая дробим на 2!
                                //console.log ( "арка большая дробим на 2!")
                                const midAngle = arcC.startAngle + arcC.deltaAngle * 0.5;
                                let midX = arcC.cx + r1 * Math.cos(midAngle);
                                let midY = arcC.cy + r2 * Math.sin(midAngle);
                                let OY = Part.prevY   
                                Part.prevY = midY
                                midY = util.round(this.height - midY, 6)
                                this.nStr = direction + 
                                    (midX !== Part.prevX ? ' x' + midX : '') + 
                                    (midY !== OY ? ' y' + midY : '') + ' i' + util.round(arcC.cx - Part.prevX, 6) + ' j' + util.round(OY-arcC.cy, 6)
                                arr.push(this.nStr)
                                Part.prevX = midX 
                            } 
    
                            if (arcC) {
                                let OY = Part.prevY   
                                let OOY =util.round(this.height - OY, 6)  
                                Part.prevY = y
                                y = util.round(this.height - y, 6)
                                 this.nStr = direction +
                                 (x !== Part.prevX ? ' x' + x : '') + 
                                 (y !== OOY ? ' y' + y : '')  + ' i' + util.round(arcC.cx - Part.prevX, 6) + ' j' + util.round(OY-arcC.cy, 6)
                                arr.push(this.nStr)
                                Part.prevX = x
                            } 
                            if (!arcC) console.log ("NOOOO ARC!!!!");
                        } else {
                            //console.log("radiuses is not equal" + str)
                            let degree = str[3]
                            let cArc = 'M'+ Part.prevX +' '+ Part.prevY +' '+ str.join(' ')
                            let newArcs;
                            if (degree === 0 ) {
                                newArcs = arc.converting ( cArc )
                            } else {
                                //console.log ("ROTATION SHIT IS HERE")
                                let arcC = util.svgArcToCenterParam(Part.prevX, Part.prevY, r1, r2, degree, fA, fS, x, y)                                
                                let cArc1 = util.applyTransform( cArc, 1, 1, 0, 0,{angle: -degree, x: arcC.cx, y:arcC.cy})
                                newArcs = arc.converting ( cArc1 )
                                newArcs = util.applyTransform( newArcs, 1, 1, 0, 0,{angle: degree, x: arcC.cx, y:arcC.cy})
                            }
                            
                            newArcs = SVGPathCommander.normalizePath(newArcs)
                            //console.log ( newArcs.map(a => a.join(' ')).join(' ') )
                            newArcs.forEach((seg)=>{               
                                let rx, ry,/* x1, y1,*/ x2, y2, flag1, flag2, flag3;                               
                                if (seg.includes('A')) {
                                    flag1 = seg[3]
                                    flag2 = seg[4]
                                    flag3 = seg[5]
                                    rx = seg[1]
                                    ry = seg[2]
                                    x2 = seg[6]
                                    y2 = seg[7]
                                    let arcC = util.svgArcToCenterParam(Part.prevX, Part.prevY, rx, ry, flag1, flag2, flag3, x2, y2)
                                    if (arcC) {
                                        let direction = flag3 === 1 ? "G2" : "G3"
                                        Part.prevY = y2
                                        y2 = util.round(this.height - y2, 6)
                                        this.nStr = direction + ' x' + x2 + ' y' + y2 + ' i' + util.round(arcC.i, 6) + ' j' + util.round(arcC.j, 6)
                                        arr.push(this.nStr)
                                    }
                                    Part.prevX = x2
                                }
                                if (seg.includes('M')) {
                                    Part.prevX = seg[1]
                                    Part.prevY = seg[2]
                                }
                            })
                        }
                        break;
                    case 'Z':
                        // Handle "Z" segment
                        break;
                    default:
                        console.log("NOOOO such type " + type)
                        break;
                }
            });
        }
        return arr
    }

    static formatNumbers(arr) {
        return arr.map(line => line.replace(/([ij])(-?)0\./g, "$1$2."));
    }
    
    static createSgn() {
        this.pNumber = svgStore.partNumber?.partNumber||0
        let width = svgStore.svgData.width
        let height = svgStore.svgData.height
        this.sgn = []
        let replacer = 'originx="' + width
        let str = this.ncpLines[0].replace(/originx\=\"[\d.]{1,}/, replacer)
        replacer = 'originy="' + height
        str = str.replace(/originy\=\"[\d.]{1,}/, replacer)
        //let detectedCollision = this.partDetectCollision(true)

        this.sgn.push(str)
        this.sgn.push(this.ncpLines[1])
        this.sgn.push(this.ncpLines[2])

        let cutQue=[]

        const inner = svgStore.getFiltered(["inner",    "contour"])
        const engs  = svgStore.getFiltered(["engraving","contour"])
        const outer = svgStore.getFiltered(["outer",    "contour"])

        engs.map(a => cutQue.push(a.cid))
        inner.map(a=> cutQue.push(a.cid))
        outer.map(a=> cutQue.push(a.cid))
        let indexCid = 0

        cutQue.forEach((cid, index) => {
            let inlet = svgStore.getElementByCidAndClass (cid, 'inlet')||''
            let contour = svgStore.getElementByCidAndClass (cid, 'contour')||''
            let outlet = svgStore.getElementByCidAndClass(cid, 'outlet')
            let path
            if (inlet  && inlet.hasOwnProperty('path') && inlet.path.length ) {
                path = inlet.path
                this.pathType = "inlet"
                path = this.parsePath(path)
                this.sgn.push('(<slow>)')
                
                this.inletOuterInner=false;
                if ( contour['class'].includes('outer') ) {
                    this.inletOuterInner = "outer"
                } else {
                    this.inletOuterInner = "inner"
                }
                this.macro = this.detectMacroValue(inlet.class)

                /* if (detectedCollision.indexOf(cid) > -1) {
                    this.macro = '5'//cutless
                } */

                this.piercingMode = this.detectPiercingMode(inlet.class)

                this.sgn.push(`(<Inlet mode="${this.inletOuterInner}" contour_id="${indexCid}" c_contour_id="${indexCid}" pard_id="${this.pNumber}" macro="${this.macro}" pulse="${this.piercingMode}">)`)
                this.sgn = [...this.sgn, ...path]
            }

            if (contour) {
                path = contour.path
                if (contour.class.includes('engraving')) {
                    this.pathType = "engraving"
                } else if (contour.class.includes('outer')) {
                    this.pathType = "outer"
                } else if (contour.class.includes('inner')) {
                    this.pathType = "inner"
                }

                let openClosed = false
                if (contour.class.includes('closed0')) {
                    openClosed = 0
                } else if (contour.class.includes('closed1')) {
                    openClosed = 1
                }

                this.macro = this.detectMacroValue(contour.class)
               /*  if (detectedCollision.indexOf(cid) > -1) {
                    this.macro = '5'//cutless
                } */
                
                let pathSegments = path.split("M");
                pathSegments = pathSegments.filter(segment => segment.trim() !== "");
                const pathsArray = pathSegments.map(segment => "M" + segment);

                //путь только 1. Таков путь. 
                if (pathsArray.length === 1) {

                    if (this.pathType === "engraving" || (!inlet || !inlet?.path || !inlet.path.length)) {
                        this.sgn.push('(<slow>)');
                    }
                    this.sgn.push(`(<Contour mode="${this.pathType}" contour_id="${indexCid}" c_contour_id="${indexCid}" pard_id="${this.pNumber}" macro="${this.macro}" closed="${openClosed}" overcut="0.000,0.000">)`)
                    let joints = jointStore.getJointsPositionsForCId(cid)
                    if (joints.length){
    
                    /*const svgNS = "http://www.w3.org/2000/svg";
                    const ppath = document.createElementNS(svgNS, "path");
                    ppath.setAttribute("d", path);
                    const contourLength = Math.ceil(ppath.getTotalLength());*/
                    let contourLength = SVGPathCommander.getTotalLength(path);
                    joints.forEach((joint)=>{
                        
                        let type = CONSTANTS.defaultJointType
                        let dist= joint.percent
                        let path = contour.path
                        let d = contourLength /100 * dist
                        let val = jointStore.jointSize ? jointStore.jointSize : CONSTANTS.defaultJointSize
                        let d1 = d+val
                        let x = joint.x
                        let y = joint.y
    
                        if (joint.origin === 'atEnd') {
                            d = contourLength-val
                            d1 = contourLength
                            let point = SVGPathCommander.getPointAtLength(path, contourLength-val)
                            x = point.x
                            y = point.y
                            dist = d/contourLength*100
                        }

                        //type микро или нано , text
                        //dp относительная длина от начала пути для парсинга в svg, %
                        //length длина джойнта, мм
                        //d абс значение от начала пути контура начало джойнта, мм
                        //d1 абс значение от начала пути контура конец джойнта, мм
                        //x y - положение маркера джойнта что не пересчитывать значение при парсинге, мм/
                        if (d1 <= contourLength && d1 > 0) {
                            this.sgn.push(`(<Joint type="${type}" dp="${ util.round(joint.percent,6) }" length="${val}" d="${util.round(d,6)}" d1="${util.round(d1,6)}" x="${x}" y="${y}">)`)
                        }
                    })               
                    } 
                    path = SVGPathCommander.normalizePath(path).toString().replaceAll(',', ' ')
                    path = this.parsePath(path)                
                    if ((!inlet || !inlet?.path || !inlet.path.length)) {
                        // если нет инлета то так;
                        let startWithoutInlet=path[0].replace('G1','G0')
                        path[0] = ('(<laser_on>)');
                        path.unshift(startWithoutInlet)
                    }                   
                    this.sgn = [...this.sgn, ...path]
                    this.sgn.push("(<laser_off>)")  
                    this.sgn.push(`(</Contour part_id="${this.pNumber}" contour_id="${indexCid}" c_contour_id="${indexCid}" >)`)
                    indexCid++      
                } else {
                // путей несколько
                // pathsArray.splice(0,1)
                    if (this.pathType === "engraving" || (!inlet || !inlet?.path || !inlet.path.length)) {
                        this.sgn.push('(<slow>)');
                    }
                    //let joints = jointStore.getJointsPositionsForCId(cid)
                    pathsArray.forEach((subpath, ind) =>{
                        this.sgn.push(`(<Contour mode="${this.pathType}" contour_id="${indexCid}" c_contour_id="${indexCid}" pard_id="${this.pNumber}" macro="${this.macro}" closed="${openClosed}" overcut="0.000,0.000">)`)
                        subpath = SVGPathCommander.normalizePath(subpath).toString().replaceAll(',', ' ')
                        subpath = this.parsePath(subpath)   
                        if ( contour.class.includes('skeletonText')) {
                            let startWithoutInlet=subpath[0].replace('G1','G0')
                            subpath[0]=('(<laser_on>)')   
                            subpath.unshift(startWithoutInlet)
                        }
                        this.sgn = [...this.sgn, ...subpath]
                        this.sgn.push(`(<laser_off>)`)   
                        this.sgn.push(`(</Contour part_id="${this.pNumber}" contour_id="${indexCid}" c_contour_id="${indexCid}" >)`)
                        indexCid++
                    })
                }

            }

            if (outlet && outlet.hasOwnProperty('path') && outlet.path.length ) {
                this.pathType = "outlet"
                // удаляем закрытие контура 2 строки у нас же Outlet!
                this.sgn.splice(this.sgn.length - 2, 2);
                if ( outlet.class.includes("outer")) {
                    this.outletOuterInner = "outer"
                } else {
                    this.outletOuterInner = "inner"
                }
                this.macro = this.detectMacroValue(outlet.class)
               /*  if (detectedCollision.indexOf(cid) > -1) {
                    this.macro = '5'//cutless
                } */
                path = outlet.path
                path = this.parsePath(path)
                this.sgn.push(`(<Outlet mode="${this.outletOuterInner}" macro="${this.macro}" >)`)
                this.sgn = [...this.sgn, ...path]
                this.sgn.push("(<laser_off>)")
                this.sgn.push(`(</Contour part_id="${this.pNumber}" contour_id="${indexCid}" c_contour_id="${indexCid}" >)`)
            }
        })
        this.sgn.push(this.ncpLines[this.ncpLines.length - 1])

        //TODO remove this if necessary
        this.sgn = this.formatNumbers ( this.sgn )        
        this.sgn.forEach((a,i) => {
            /*  if ( a ===  this.ncpLines[i] ) {
                console.log (i + ' ' + true)     
            } else {
              //  console.log (a)
                console.log (i+':  '+ a )
                console.log (" ".repeat( String(i).length)+':  '+ this.ncpLines[i] )
            }  */
            console.log (a)
        })
        
        return this.sgn
    } 
} 
export default Part;