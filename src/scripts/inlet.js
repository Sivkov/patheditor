import util from '../utils/util';
import SVGPathCommander from 'svg-path-commander';
import part from "./part";
import arc from './arc';

class Inlet {
    constructor () {
        this.inletInMove = false
        this.inletType = false
        this.inletAngle = false
    }

    pointIndex (x, y, x1, y1, fx, fy) {
        let pointIndex
        let d1 = util.distance( {x:x, y: y}, {x:fx, y:fy})
        let d2 = util.distance( {x:x1, y:y1}, {x:fx, y:fy})     
        if (d1 < d2)  {
            pointIndex=0
        } else {
            pointIndex=1   
        }
        return pointIndex               
    }

    detectInletType (selectedInletPath) {
        let inletMode = 'Straight'
		if (selectedInletPath) {
			let path = SVGPathCommander.normalizePath(selectedInletPath).map(a => a.join(' ')).join(' ')
			if (path && path.length) {
				if (path.includes('L') || path.includes('H') || path.includes('V')) {
					inletMode = 'Direct'
					if (path.includes('A')) {
						inletMode = 'Hook'
					}
					/*                     
					// пока рисуем треугольник определяем так
					if (path.match(/L/g) && path.match(/L/gm).length && path.match(/L/gm).length === 3) {
					inletMode= Straight      
					} */
				} else if (path.includes('A')) {
					inletMode = 'Tangent'
				}
			}
		}
        return inletMode
    }

    inletTangentR (radius, arcLength, inletPath) {
        console.log ("inletTangentR")
        let x1, y1, x2, y2 ,flag1, flag2, flag3, rO;
 
        if (radius <= 0 || arcLength <= 0 || 2*Math.PI*radius < arcLength ) {
            //throw Error ("radius it too small")
            return false
        }

        let pathArc  = SVGPathCommander.normalizePath (inletPath)
        if (pathArc.length) {
			pathArc.forEach( seg=>{
				if ( seg.includes('A')) {
                    flag1=seg[3]
                    flag2=seg[4]
                    flag3=seg[5]
				 	x2=seg[6]
					y2=seg[7]
                    rO=seg[1]

				}
				if ( seg.includes('M')) {
					x1=seg[1]
					y1=seg[2]
				}
			}) 
		}

        if ( x1 === x2 && y1===y2 ) return false;
        var centers = util.svgArcToCenterParam (x1, y1, rO, rO, flag1, flag2, flag3, x2, y2, true) 
        if (!centers) return false
        var newCenters =  util.getNewEndPoint(centers.x, centers.y, x2, y2, radius)
        let endPoint = util.calculateEndPoint( newCenters.x, newCenters.y, radius, x2, y2, arcLength, flag3);

        if ( pathArc.length && pathArc[1].includes("A") ) {
            pathArc[1][1]=radius
            pathArc[1][2]=radius
        }

        if ( pathArc.length && pathArc[0].includes("M") ) {
            pathArc[0][1]=endPoint.x
            pathArc[0][2]=endPoint.y   
        }

       if ( Math.abs(arcLength) > Math.PI*radius) {
            pathArc[1][4]=1
        } else {
            pathArc[1][4]=0 
        }

        inletPath = pathArc.toString().replaceAll(',', ' ')
        let maxArcLength =Math.PI*radius*2

        if ( arcLength > maxArcLength ) {
             return false
        }

        let resp ={}
        resp.newInleType = "Tangent"
		resp.oldInletType = "Tangent"
		resp.newInletPath = pathArc.toString().replaceAll(',', ' ')
		resp.action = 'change'
        return resp
    }

    inletTangentL (arcLength, inletPath) {
        console.log ("inletTangentL"+ arcLength)
        let radius, x1, y1, x2, y2 ,flag1, flag2, flag3;
		let pathArc  = SVGPathCommander.normalizePath (inletPath)
		if (pathArc.length) {
			pathArc.forEach( seg=>{
				if ( seg.includes('A')) {
                    flag1=seg[3]
                    flag2=seg[4]
                    flag3=seg[5]
					radius=seg[1]
					x2=seg[6]
					y2=seg[7]
				}
				if ( seg.includes('M')) {
					x1=seg[1]
					y1=seg[2]
				}
			}) 
		}

        if (radius <= 0 || arcLength <= 0  || arcLength > 2*Math.PI*radius ) {
            return false
        } 

        if (x1 === x2 && y1===y2) return false;
        var centers = util.svgArcToCenterParam(x1, y1, radius, radius, flag1, flag2, flag3, x2, y2, true) 
        if (!centers) return false;
        let endPoint = util.calculateEndPoint(centers.x, centers.y, radius, x2, y2, arcLength, flag3);

        if ( pathArc.length && pathArc[0].includes("M") ) {
            pathArc[0][1]=endPoint.x
            pathArc[0][2]=endPoint.y   
        }
        if ( Math.abs(arcLength) > Math.PI*radius) {
            pathArc[1][4]=1
        } else {
            pathArc[1][4]=0 
        }
        let resp ={}
        resp.newInleType = "Tangent"
		resp.oldInletType = "Tangent"
        resp.action = 'change'
		resp.newInletPath = pathArc.toString().replaceAll(',', ' ')
		return resp
    }

    inletDirectA(newAxis, inletPath, contourPath, outerInner='inner') {

        if (newAxis < 0 || newAxis > 180 ) return false;
        let MX, MY, LX, LY, PX, PY;
        let path =  SVGPathCommander.normalizePath(inletPath)
        if (path.length) {
            path.forEach( seg=>{
                if ( seg.includes('M')) {
                    MX=seg[1]
                    MY=seg[2]
                }
                if ( seg.includes('L')) {
                    LX=seg[1]
                    LY=seg[2]    
                } 
            }) 
        }

        let contour =  SVGPathCommander.normalizePath(contourPath)
        contour.forEach((seg, i)=>{
            if (i<2){
                if (seg.includes('M')) {
                    PX=seg[1]
                    PY=seg[2]
                } else if ( seg.includes('L')) {
                    PX=seg[1]
                    PY=seg[2]    
                } else if (seg.includes('A')) {
                    PX=seg[6]
                    PY=seg[7]
                }
            }
        })

        let oldAxis = util.calculateAngleVector( LX, LY, MX, MY, PX, PY )

        if (contour[1][0] === 'A') {
            console.log('Arc position detected')
            let nearestSegment = contour[1]
            const rx = parseFloat(nearestSegment[1]);
            const ry = parseFloat(nearestSegment[2]);
            const flag1 = parseFloat(nearestSegment[3]);
            const flag2 = parseFloat(nearestSegment[4]);
            const flag3 = parseFloat(nearestSegment[5]);
            const EX = parseFloat(nearestSegment[6]);
            const EY = parseFloat(nearestSegment[7]);
            let C = util.svgArcToCenterParam (LX, LY, rx, ry, flag1, flag2, flag3, EX, EY, true)   
            let OP = util.rotatePoint(  C.x, C.y,  LX, LY,0, 270)
            oldAxis = Math.round(util.calculateAngleVector ( LX, LY, MX, MY, OP.x, OP.y)*100)/100
            console.log('Arc position detected in degree '+ oldAxis)
        }
        let pathDirection = Number(SVGPathCommander.getDrawDirection(contour))
        console.log (newAxis,oldAxis)
        if (pathDirection === 1 && outerInner === 'outer'){
             newAxis=180-newAxis
             oldAxis=180-oldAxis
        }
        
        let newEndPoint= util.rotatePoint(MX, MY, LX, LY, oldAxis, newAxis)
        if (inletPath.includes("NaN")) {
            return false
        }

        let resp ={}
        resp.newInleType = "Direct"
		resp.oldInletType = "Direct"
 		resp.newInletPath = `M${newEndPoint.x} ${newEndPoint.y} L${LX} ${LY}`
 		return resp
    }

    inletDirectL(D, inletPath) {
        console.log (D)
        let MX, MY, LX, LY;
        let path =  SVGPathCommander.normalizePath(inletPath)
        if (path.length) {
            path.forEach( seg=>{
                if ( seg.includes('M')) {
                    MX=seg[1]
                    MY=seg[2]
                }
                if ( seg.includes('L')) {
                    LX=seg[1]
                    LY=seg[2]    
                } else if (seg.includes('V')) {
                    LY=seg[1]
                    LX=MX 
                } else if (seg.includes('H')) {
                    LY=MY
                    LX=seg[1]
                }
            }) 
        }

        let newEndPoint = util.getNewEndPoint(MX, MY, LX, LY, D);
        path.forEach( seg=>{
            if ( seg.includes('M')) {
                seg[1]=newEndPoint.x
                seg[2]=newEndPoint.y    
            } 
        }) 
        let resp ={}
        resp.newInleType = "Direct"
		resp.oldInletType = "Direct"
 		resp.newInletPath = path.toString().replaceAll(',', ' ')
 		resp.action = 'change'
        return resp
 
    }

    inletHookL (D, radius, inletPath) {
        if (D <= 0  || D * 0.5 <= radius ) {
            return false
        }
        let MX, MY, LX, LY, EX, EY, r;
        let path =  SVGPathCommander.normalizePath(inletPath)
        if (path.length) {
            path.forEach( seg=>{
                if ( seg.includes('M')) {
                    MX=seg[1]
                    MY=seg[2]
                }
                if ( seg.includes('L')) {
                    LX=seg[1]
                    LY=seg[2]    
                } else if (seg.includes('A')){
                    EX=seg[6]
                    EY=seg[7]
                    r=seg[2]
                }
            }) 
        }

        let newEndPoint = util.getNewEndPoint(MX, MY, EX, EY, D);
        let centers = util.findPointWithSameDirection (EX, EY, MX, MY, r)
        let tangent = util.findTangentPoints(centers.x, centers.y, radius, newEndPoint.x, newEndPoint.y) 
        if (!tangent)return false;
        let d1 = util.distance(LX, LY, tangent[0].x, tangent[0].y)
        let d2 = util.distance(LX, LY, tangent[1].x, tangent[1].y)
        let pointIndex = d1 > d2 ? 1 : 0

        path.forEach( seg=>{
            if ( seg.includes('M')) {
                seg[1]=newEndPoint.x
                seg[2]=newEndPoint.y    
            } 

            if ( seg.includes('L')) {
                seg[1]=tangent[pointIndex].x
                seg[2]=tangent[pointIndex].y
            } 
        }) 

        let resp ={}
        resp.newInleType = "Hook"
		resp.oldInletType = "Hook"
 		resp.newInletPath = path.toString().replaceAll(',', ' ')
 		resp.action = 'change'
        return resp
    }

    inletHookR (radius, inletLength, inletPath) {
        let MX, MY, LX, LY, R, EX, EY, flag1, flag2, flag3;
        let path =  SVGPathCommander.normalizePath(inletPath)
        if (path.length) {
            path.forEach( seg=>{
                if ( seg.includes('M')) {
                    MX=seg[1]
                    MY=seg[2]
                }
                if ( seg.includes('L')) {
                    LX=seg[1]
                    LY=seg[2]    
                } 
                if (seg.includes('A')){
                    R=seg[1]
                    EX=seg[6]
                    EY=seg[7]
                    flag1=seg[3]
                    flag2=seg[4]
                    flag3=seg[5]
                }
            }) 
        }

        if (radius <= 0 ) {
            return false
        }

        if ( radius > inletLength*0.5 ) {
            return false
        }
             
        let centers = util.svgArcToCenterParam (LX, LY, R, R, flag1, flag2, flag3, EX, EY, true) 
        if (!centers) return false;
        let newCenters =  util.getNewEndPoint(centers.x, centers.y, EX, EY, radius)
        let c = util.distance (newCenters.x,newCenters.y, MX, MY)
		let b = radius
		let a = Math.sqrt((c**2) - (b**2) )
		let theta = Math.PI - Math.atan(a/b)
		let arcLength = radius * theta;
        let endPoint = util.calculateEndPoint( newCenters.x, newCenters.y, radius, EX, EY, arcLength, flag3);

        if ( path.length && path[1].includes("L") ) {
            path[1][1]=endPoint.x
            path[1][2]=endPoint.y
        }

        if ( path.length && path[2].includes("A") ) {
            path[2][1]=radius
            path[2][2]=radius
        }
        let resp ={}
        resp.newInleType = "Hook"
		resp.oldInletType = "Hook"
 		resp.newInletPath = path.toString().replaceAll(',', ' ')
 		resp.action = 'change'
       
        return resp
    }

    detectCommandContainingPoint(pathString, point, threshold) {
        const pathCommands = SVGPathCommander.normalizePath (pathString)
        
        let currentX = 0;
        let currentY = 0;
        let index = 0
        
        for (const command of pathCommands) {
            const commandType = command[0]
            //console.log (commandType)
            
            switch (commandType) {
                case 'M':
                    const mx = parseFloat(command[1]);
                    const my = parseFloat(command[2]);
                    if ( util.distance (point.x, point.y, mx, my) <= threshold ) {
                        return {command, index, pathCommands};
                    }
                    currentX = mx;
                    currentY = my;
                    break;
                case 'L':
                    const x = parseFloat(command[1]);
                    const y = parseFloat(command[2]);
                    if (  util.distancePointToSection(point.x, point.y, x, y, currentX, currentY) <= threshold ) {
                        return {command, index, pathCommands};
                    }
                    currentX = x;
                    currentY = y;
                    break;
                case 'H':
                    const hx = parseFloat(command[1]);
                    if ( util.distancePointToSection(point.x, point.y, hx, currentY, currentX, currentY) <= threshold) {
                        return {command, index, pathCommands};
                    }
                     currentX = hx;
                    break;
                case 'V':
                    const vy = parseFloat(command[1]);
                    if ( util.distancePointToSection(point.x, point.y, currentX, vy, currentX, currentY) <= threshold) {
                        return {command, index, pathCommands};
                    }
                     currentY = vy;
                    break;
                case 'A':
                    // Extract command for arc command
                    let rx = parseFloat(command[1]);
                    let ry = parseFloat(command[2]);
                    let flag1 = parseFloat(command[3]);
                    const flag2 = parseFloat(command[4]);
                    const flag3 = parseFloat(command[5]);
                    const sweepFlag = parseFloat(command[5]);
                    const EX = parseFloat(command[6]);
                    const EY = parseFloat(command[7]);
                    // Calculate the center of the arc
                    if (flag1 === 90 && rx !== ry)  {
						flag1 = 0
 						rx = parseFloat(command[2]);
						ry = parseFloat(command[1]);
					}
                    const x1 = currentX;
                    const y1 = currentY;
                    const x2 = EX;
                    const y2 = EY;
                    let centers = util.svgArcToCenterParam (x1, y1, rx, ry, flag1, flag2, flag3, EX, EY, true) 
                    let startAngleRad =  Math.atan2(y1 - centers.y, x1 - centers.x);
                    let endAngleRad = Math.atan2(y2 - centers.y, x2 - centers.x);
                    let angleRad = Math.atan2(point.y - centers.y, point.x - centers.x);

                    let startAngleDeg = (util.radianToDegree( startAngleRad ) +360 ) % 360
                    let endAngleDeg = (util.radianToDegree( endAngleRad ) +360 ) % 360
                    let angleDeg = (util.radianToDegree( angleRad ) +360) % 360
               
                    let between=false;
                    // стрелки
                    if (sweepFlag === 0 ) {
                        if ( startAngleDeg > endAngleDeg) {
                            if (startAngleDeg > angleDeg && angleDeg > endAngleDeg) {
                                between=true;
                            }
                        } else {
                            if (startAngleDeg > angleDeg || angleDeg > endAngleDeg){
                                between=true;
                            }
                        }
                    } else {
                        if ( endAngleDeg > startAngleDeg) {
                            if (endAngleDeg> angleDeg && angleDeg > startAngleDeg) {
                                between=true;
                            }
                        } else {
                            if (endAngleDeg> angleDeg || angleDeg > startAngleDeg){
                                between=true;
                            }
                        }
                    }
                   // const distance = Math.sqrt((centers.x - point.x) ** 2 + (centers.y - point.y) ** 2);
                    /*if (Math.abs(distance - rx) <= threshold  && between) {
                        return {command, index, pathCommands};
                    }*/
                    const distance = Math.sqrt(((centers.x - point.x) / rx) ** 2 + ((centers.y - point.y) / ry) ** 2);
                    // Проверяем, находится ли точка на расстоянии, равном радиусу дуги, с допустимой погрешностью и лежит ли она между углами
                    if (Math.abs(distance - 1) <= threshold / rx && between) {
                        return { command, index, pathCommands }; // Возвращаем команду дуги, если точка удовлетворяет условиям
                    }
                    
                    currentX = EX;
                    currentY = EY;
                    break;
                // Handle other command types (e.g., 'C', 'Q', etc.) similarly
                // Add cases as needed based on the SVG path commands you're using
            }
            index+=1
        }
        return null; 
    }

    detectPreviousPoint(segments, currentIndex) {
		let currentX = 0;
		let currentY = 0;
		let index = 0
		for (const command of segments) {
			const commandType = command[0]
			if (commandType === 'M') {
				const mx = parseFloat(command[1]);
				const my = parseFloat(command[2]);
				currentX = mx;
				currentY = my;
			} else if (commandType === 'L') {
				const x = parseFloat(command[1]);
				const y = parseFloat(command[2]);
				currentX = x;
				currentY = y;
			} else if (commandType === 'H') {
				const hx = parseFloat(command[1]);
				currentX = hx;
			} else if (commandType === 'V') {
				const vy = parseFloat(command[1]);
				currentY = vy;
			} else if (commandType === 'A') {
				const EX = parseFloat(command[6]);
				const EY = parseFloat(command[7]);
				currentX = EX;
				currentY = EY;
			}

			if (index === currentIndex) {
				return { currentX, currentY }
			}
			index += 1
		}
	}

    updateInletPath () {
        if (!Number.isInteger(inlet.dataCid)) return;
        let p = document.querySelector(`.contour[data-cid="${inlet.dataCid}"] path`)
        let inletElement= document.querySelector(`.inlet[data-cid="${inlet.dataCid}"] path`)
        if (!inletElement || !p) return;
        this.inletPath = inletElement.getAttribute('d')
        let pp= p.getAttribute('d')
        let point = util.getLastPointOfPath( this.inletPath)
        let threshold =0.05
        let lastString;
        let res = inlet.detectCommandContainingPoint(pp, point, threshold);
        let segments= []
		if (!res) return;
        let till = res.pathCommands.length-1;
        let start = res.pathCommands[1]
        let finish = res.pathCommands[res.pathCommands.length-1]
        if (start[0] !== finish[0]){
            till ++
        } else {
            
            if (start[0] ===  'L') {
                let x0 = res.pathCommands[0][1]
                let y0 = res.pathCommands[0][2]
                let x1 = start[1]
                let y1 = start[2]
                let preFin = res.pathCommands[res.pathCommands.length-2]
                let x2 = preFin[preFin.length-2]
                let y2 = preFin[preFin.length-1]
                // проверяем коллинеарность
                if ( util.round((x1 - x0) * (y2 - y0)) !== util.round((y1 - y0) * (x2 - x0))) till++;
            }

            if (start[0] ===  'A') {
                if (    util.round(start[1]) !== util.round(finish[1]) ||
                        util.round(start[2]) !== util.round(finish[2]) ||
                        start[3] !== finish[3] || 
                        //start[4] !== finish[4] ||
                        start[5] !== finish[5]
                        ){
                    till++
                }
            }
        }

        res.pathCommands.forEach((seg, index) =>{
            if (index === 0 &&  seg.includes("M")) {
                segments.push (["M", point.x, point.y])
            } else if (index >= res.index && index < till) {
				segments.push(seg)
            } 
        })

        res.pathCommands.forEach((seg, index) =>{
           if (index < res.index && !seg.includes("M") ) {
                segments.push(seg)
            }
        })

        const commandType = res.command[0]
        if (commandType === "M") return;
        switch (commandType) {
            case 'M':
                lastString=''
                break;
            case 'L':
                lastString=['L', point.x, point.y]              
                break;
            case 'H':
                lastString=['H',point.x]              
                break;
            case 'V':
                lastString=['V',point.y]              
                break;
            case 'A':
                const rx = parseFloat(res.command[1]);
                const ry = parseFloat(res.command[2]);
                const flag1 = parseFloat(res.command[3]);
                const flag2 = parseFloat(res.command[4]);
                const flag3 = parseFloat(res.command[5]);
                lastString=['A', rx, ry, flag1, flag2, flag3, point.x, point.y]   
                break;
        }

        if (lastString) segments.push(lastString);  
		segments.forEach((seg, index, arr) =>{
			if (seg.includes('A') ) {
				const rx = parseFloat(seg[1]);
				const ry = parseFloat(seg[2]);
				const flag1 = parseFloat(seg[3]);
				let flag2 = parseFloat(seg[4]);
				const flag3 = parseFloat(seg[5]);
				const x2 = parseFloat(seg[6]);
				const y2 = parseFloat(seg[7]);
				let current = this.detectPreviousPoint ( segments, index-1 )
				//this.centers;
                if (index){

                    let oIndex = (index+res.index-1)%(segments.length-1)
                    if (oIndex === 0 ) oIndex=1
                    if (index+res.index > segments.length)
                    oIndex = index+res.index - segments.length+1
                    let ocurrent = this.detectPreviousPoint ( res.pathCommands, oIndex-1 < 0 ? 1 : oIndex-1 )
                    let OV= res.pathCommands[oIndex]
                    let orx = OV[1]
                    let ory = OV[2]
                    let oflag1 = OV[3]
                    let oflag2 = OV[4]
                    let oflag3 = OV[5]
                    let ox2 = OV[6]
                    let oy2 = OV[7]
                    try {
                        this.centers = util.svgArcToCenterParam (ocurrent.currentX, ocurrent.currentY, orx, ory, oflag1, oflag2, oflag3, ox2, oy2, true);
 					    flag2 = this.calculateAngle ( this.centers.x, this.centers.y,  current.currentX, current.currentY, x2, y2,  Boolean(flag3) )
                         segments[index]=['A', rx, ry, flag1, flag2, flag3, x2, y2] 
                    } catch (e) {
                        console.log (`bitch`)
                    }
				}
			}
		})

        //console.log (JSON.stringify(segments))
        //segments = util.divideArcs(segments)
        segments = segments.map( a => a.join(" ")).join(" ")
        document.querySelector(`.contour[data-cid="${inlet.dataCid}"] path`).setAttribute('d',  segments )
		inlet.dataCid = false
        inlet.inletPath = false
        //inlet.inletInMove = false
        inlet.initialCommand = false
        try {
            inlet.dataCid = +document.querySelector('.selectedContour[data-cid]').getAttribute("data-cid")
            inlet.inlet = document.querySelector(`.inlet[data-cid="${inlet.dataCid}"] path`)
            inlet.inletPath =  inlet.inlet.getAttribute("d")
        } catch(e) {
            console.log("this.inletPath not defined!!" )
        }
    } 

    calculateAngle(centerX, centerY, x1, y1, x2, y2, clockwise) {
        // Вычисляем векторы между центром и точками
        const vector1X = x1 - centerX;
        const vector1Y =  (y1*-1 - centerY*-1);
        const vector2X = x2 - centerX;
        const vector2Y = (y2*-1 - centerY*-1);
    
        // Вычисляем угол между векторами
        let angle = Math.atan2(vector1X * vector2Y - vector2X * vector1Y, vector1X * vector2X + vector1Y * vector2Y);
    
        // Приводим угол к диапазону [0, 2π]
        angle = (angle + 2 * Math.PI) % (2 * Math.PI);
    
        // Проверяем направление угла
        if (clockwise) {
        // Если угол идет по часовой стрелке, переворачиваем его
           angle = 2 * Math.PI - angle;
        }

        //console.log (util.radianToDegree(angle)+ " "+ `${angle > Math.PI ? 1 : 0}`)    
        return angle >= Math.PI ? 1 : 0;
    }
    
    setInletType (newInleType, dataCid=false, endPoint=false, action='set', contourPath, oldInletPath,contourType='inner') {

        //debugger
        console.log ('setInletType')

        let centers, IL, checkPoint;
        let contour = document.querySelector(`.contour[data-cid="${dataCid}"] path`)
        let newInletPath = ''
        let contourCommand  = SVGPathCommander.normalizePath( contourPath )
        var clockwise = Number(SVGPathCommander.getDrawDirection(contourCommand))
        
        let oldInletPathSegs = SVGPathCommander.normalizePath(oldInletPath)
        if (!endPoint) {
            endPoint = {x:contourCommand[0][1], y:contourCommand[0][2]}
        }

        /*try {
            if (!document.querySelector(`.contour[data-cid="${inlet.dataCid}"]`).classList.contains("noInlet")){
                //let start = util.getFirstPointOfPath(element.getAttribute('d'))
                //let end = util.getLastPointOfPath(element.getAttribute('d'))
                let start = util.getFirstPointOfPath( contourPath)
                let end = util.getLastPointOfPath( contourPath)
                IL = Math.round(util.distance(start, end)*100)/100
            }           
        } catch (e) {
            console.log ("cant find inlet length")
        } */

        const oldInletType = inlet.detectInletType(oldInletPath)
        if ( action === 'set') {
            if (!oldInletType || !newInleType || (newInleType === oldInletType)) {
                return
            }
        }

      
        // тут мы определяем  точку  начала рисования при изменениии типа врезка тут по любому будет первый сегмент
        // при движении вот приходит из moveInlet 
        let nearestSegment =  contourCommand[1]
        if (action === 'move') nearestSegment=endPoint.command
        let inletAngle
        
        if ( oldInletPathSegs &&  oldInletPathSegs.length > 1 ){
            let M = oldInletPathSegs[0]
            let L = oldInletPathSegs[1]
            inletAngle = util.angleBetweenPoints ( M[1], M[2], L[1], L[2] )
        } 
        if (!IL && newInleType !== "Straight" ) IL = 6//util.detectInletLength(contourCommand, nearestSegment, endPoint, contourType)
        
        if (newInleType === "Straight") {
            //newInletPath= `M ${endPoint.x} ${endPoint.y} L ${endPoint.x-1} ${endPoint.y-1}  L ${endPoint.x+1} ${endPoint.y-1} L ${endPoint.x} ${endPoint.y}`
            newInletPath =`M ${endPoint.x} ${endPoint.y} `
        } 
        else if (newInleType === "Direct") {
            const commandType = nearestSegment[0]
            let A, x1, y1;
            let path =  SVGPathCommander.normalizePath(oldInletPath)
            if (typeof inlet.newAngleInlet === 'number') {
                this.inletAngle=this.newAngleInlet
            }

            if (typeof inlet.inletAngle === 'number') {
                // здесь выясняем был ли повернут ранее путь
                this.newAngleInlet=this.inletAngle
            }

            switch (commandType) {       
                
                case 'L':
                    if ( typeof inlet.inletAngle !== 'number') {
                        inlet.inletAngle = util.angleBetwenContourAndInlet (path, contourCommand)
                    }    
                    x1=nearestSegment[1]
                    y1=nearestSegment[2]
                    let perpendicular=util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, IL)
                    checkPoint =util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, 1)
                    var pointIn = util.pointInSvgPath(contourPath , checkPoint[0].x, checkPoint[0].y)
                    console.log ('pointIn' + pointIn)
                    console.log (contour , checkPoint[0].x, checkPoint[0].y)

                    if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                        pointIndex=0
                    } else {
                        pointIndex=1
                    }
                    if (action === 'move') {
                        perpendicular[pointIndex]=util.rotatePoint (perpendicular[pointIndex].x, perpendicular[pointIndex].y, endPoint.x, endPoint.y, 90, this.inletAngle) 
                    }
                    newInletPath= `M ${perpendicular[pointIndex].x} ${perpendicular[pointIndex].y} L ${endPoint.x} ${endPoint.y}`
                    break;

                case 'A':
                    const rx = parseFloat(nearestSegment[1]);
                    const ry = parseFloat(nearestSegment[2]);
                    const flag1 = parseFloat(nearestSegment[3]);
                    const flag2 = parseFloat(nearestSegment[4]);
                    const flag3 = parseFloat(nearestSegment[5]);
                    const EX = parseFloat(nearestSegment[6]);
                    const EY = parseFloat(nearestSegment[7]);
                    let CX= contourCommand[0][1]
                    let CY= contourCommand[0][2]
                    for (let i = 1; i < contourCommand.length; i++) {
                        let seg = contourCommand[i];
                        if ( util.arraysAreEqual(seg, nearestSegment)) {
                            if (contourCommand[i - 1] && contourCommand[i - 1][0] === 'A') {
                                CX = contourCommand[i - 1][6];
                                CY = contourCommand[i - 1][7];
                            } else if (contourCommand[i - 1] && contourCommand[i - 1][0] === 'L') {
                                CX = contourCommand[i - 1][1];
                                CY = contourCommand[i - 1][2];
                            }
                        }
                    }          

                    if (rx !== ry) {
                        let arcParams= arc.svgArcToCenterParam ( endPoint.x, endPoint.y, rx, ry, flag1, flag2, flag3, EX, EY, true)
                        let perpPoint = util.getPerpendicularCoordinates(arcParams, IL);
                        let startPoint 
                        pointIn = util.pointInSvgPath(contourPath , perpPoint.point1.x, perpPoint.point1.y)


                        console.log ('pointIn' + pointIn)
                        console.log (contour , checkPoint[0].x, checkPoint[0].y)

                        if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                            startPoint = perpPoint.point1
                        }  else {
                            startPoint = perpPoint.point2
                        } 
                        newInletPath= `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}` 
                        if (action === 'move') {
                            console.log ("Ебааать !")
                            let MX, MY, LX, LY;
                            if (path.length) {
                                path.forEach( seg=>{
                                    if ( seg.includes('M')) {
                                        MX=seg[1]
                                        MY=seg[2]
                                    }
                                    if ( seg.includes('L')) {
                                        LX=seg[1]
                                        LY=seg[2]    
                                    } else if (seg.includes('V')) {
                                        LY=seg[1]
                                        LX=MX 
                                    } else if (seg.includes('H')) {
                                        LY=MY
                                        LX=seg[1]
                                    }
                                }) 
                            }               

                            let OP = util.rotatePoint(  startPoint.x, startPoint.y,  perpPoint.point1.x, perpPoint.point1.y, 0, 270)
                            if (typeof this.newAngleInlet !== `number`) {
                                let sds = Math.round(util.calculateAngleVector (  endPoint.x, endPoint.y, startPoint.x, startPoint.y, perpPoint.point1.x, perpPoint.point1.y)*100)/100
                                this.newAngleInlet = (Number(sds||0)%180+90)    
                            }

                            let sds = Math.round(util.calculateAngleVector (  endPoint.x, endPoint.y, startPoint.x, startPoint.y, perpPoint.point1.x, perpPoint.point1.y)*100)/100
                            //console.log (Number(sds||0)%180+90)
                            //console.log (Number(sds))

                            this.newEnds=util.rotatePoint (startPoint.x, startPoint.y, endPoint.x, endPoint.y, 90, this.newAngleInlet) 
                            newInletPath= `M ${this.newEnds.x} ${this.newEnds.y} L ${endPoint.x} ${endPoint.y}`       
                        } 


                    } else {
                        centers = util.svgArcToCenterParam (CX, CY, rx, ry, flag1, flag2, flag3, EX, EY, true) 
                        let inletPoint= util.findPointWithSameDirection( endPoint.x, endPoint.y, centers.x, centers.y, 1)
                        var pointIn = util.pointInSvgPath(contourPath , (inletPoint.x), (inletPoint.y))    
                        
                        
                        console.log ('pointIn' + pointIn)
                        console.log (contour , (inletPoint.x), (inletPoint.y))


                        if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                            inletPoint= util.findPointWithSameDirection( endPoint.x, endPoint.y, centers.x, centers.y, IL)
                        } else {
                            inletPoint= util.findPointWithSameDirection(  centers.x, centers.y, endPoint.x, endPoint.y, IL+rx)
                        } 
                        newInletPath= `M ${inletPoint.x} ${inletPoint.y} L ${endPoint.x} ${endPoint.y}` 

                        if (action === 'move' /*&& A !==90*/) {
                            let MX, MY, LX, LY;
                            if (path.length) {
                                path.forEach( seg=>{
                                    if ( seg.includes('M')) {
                                        MX=seg[1]
                                        MY=seg[2]
                                    }
                                    if ( seg.includes('L')) {
                                        LX=seg[1]
                                        LY=seg[2]    
                                    } else if (seg.includes('V')) {
                                        LY=seg[1]
                                        LX=MX 
                                    } else if (seg.includes('H')) {
                                        LY=MY
                                        LX=seg[1]
                                    }
                                }) 
                            }               

                            let OP = util.rotatePoint(  centers.x, centers.y,  LX, LY, 0, 270)
                            if (typeof this.newAngleInlet !== `number`) {
                                this.newAngleInlet = Math.round(util.calculateAngleVector ( LX, LY, MX, MY, OP.x, OP.y)*100)/100
                            }
                            //console.log ('this.newAngleInlet   ' + this.newAngleInlet)
                            this.newEnds=util.rotatePoint (inletPoint.x, inletPoint.y, endPoint.x, endPoint.y, 90, this.newAngleInlet) 
                            newInletPath= `M ${this.newEnds.x} ${this.newEnds.y} L ${endPoint.x} ${endPoint.y}`       
                        } 
                    }
                    break;
             } 
        } 
        else if (newInleType === "Tangent") {
          
            if (contourType==='outer') clockwise=Number(!Boolean(clockwise));
            let r = IL*0.5

            let detectOldInletType = this.detectInletType(oldInletPath)
            if (detectOldInletType === "Tangent") {
                oldInletPathSegs.forEach((seg)=>{
                    if (seg[0] === "A" ) {
                        r=seg[1]                        
                    }
                })
            }

            const commandType = nearestSegment[0]
            switch (commandType) {                
                case 'L':
                    let x1=nearestSegment[1]
                    let y1=nearestSegment[2]
                    let perpendicular=util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, r*2) 
                    checkPoint=util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, 1) 
                    pointIn = util.pointInSvgPath(contourPath , (checkPoint[0].x), (checkPoint[0].y))
                    if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                        pointIndex=0
                    } else {
                        pointIndex=1
                    }
                    newInletPath= `M ${perpendicular[pointIndex].x} ${perpendicular[pointIndex].y} A ${r} ${r} 0 0 ${clockwise} ${endPoint.x} ${endPoint.y}`                   

                    if (detectOldInletType === "Tangent") {
                        let arcLength =  util.arcLength(oldInletPath)
                        let radius, flag2, flag3;
                        if (oldInletPathSegs.length) {
                            oldInletPathSegs.forEach( seg=>{
                                if ( seg.includes('A')) {
                                    flag2=seg[4]
                                    flag3=seg[5]
                                    radius=seg[1]                             
                                }                                
                            }) 
                        }
                        if (radius <= 0 || arcLength <= 0 || arcLength > 2*Math.PI*radius ) {
                            newInletPath= oldInletPath
                        }
                        centers={}
                        perpendicular=util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, r)
                        checkPoint = util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, 1) 
                        pointIn = util.pointInSvgPath(contourPath , checkPoint[0].x, checkPoint[0].y)
                        if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                            centers.x=perpendicular[0].x
                            centers.y=perpendicular[0].y    
                        } else {
                            centers.x=perpendicular[1].x
                            centers.y=perpendicular[1].y
                        }
                        if ( Math.abs(arcLength) > Math.PI*radius) {
                            flag2=1
                        } else {
                            flag2=0
                        }
                        let pp = util.calculateEndPoint(centers.x, centers.y, radius, endPoint.x, endPoint.y, arcLength, clockwise);               
                        newInletPath= `M ${pp.x} ${pp.y} A ${radius} ${radius}  0  ${flag2} ${clockwise} ${endPoint.x}, ${endPoint.y}`   
                    }              
                    break;

                case 'A':
                    const rx = parseFloat(nearestSegment[1]);
                    const ry = parseFloat(nearestSegment[2]);
                    const flag1 = parseFloat(nearestSegment[3]);
                    const flag2 = parseFloat(nearestSegment[4]);
                    const flag3 = parseFloat(nearestSegment[5]);
                    const EX = parseFloat(nearestSegment[6]);
                    const EY = parseFloat(nearestSegment[7]);
                    if (rx !== ry || true) {
                        let arcParams= arc.svgArcToCenterParam ( endPoint.x, endPoint.y, rx, ry, flag1, flag2, flag3, EX, EY, true)
                        let perpPoint = util.getPerpendicularCoordinates(arcParams, r);
                        let startPoint 
                        pointIn = util.pointInSvgPath(contourPath , perpPoint.point1.x, perpPoint.point1.y)
                        if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                            startPoint = perpPoint.point1
                        }  else {
                            startPoint = perpPoint.point2
                        }  
                        let inletPoint= util.findPointWithSameDirection( endPoint.x, endPoint.y, startPoint.x, startPoint.y, IL)
                        newInletPath= `M ${inletPoint.x} ${inletPoint.y} A ${r} ${r} 0 0 ${clockwise} ${endPoint.x} ${endPoint.y}`                   
            
                       if (detectOldInletType === "Tangent") {
                            let arcLength =  util.arcLength(oldInletPath)
                            let radius, flag2, flag3;
                            if (oldInletPathSegs.length) {
                                oldInletPathSegs.forEach( seg=>{
                                    if ( seg.includes('A')) {
                                        flag2=seg[4]
                                        flag3=seg[5]
                                        radius=seg[1]                             
                                    }                                
                                }) 
                            }
                            if (radius <= 0 || arcLength <= 0 || arcLength > 2*Math.PI*radius ) {
                                newInletPath= oldInletPath
                            }
    
                            inletPoint= util.findPointWithSameDirection( endPoint.x, endPoint.y, startPoint.x, startPoint.y, radius)
                            checkPoint = util.findPointWithSameDirection( endPoint.x, endPoint.y, startPoint.x, startPoint.y, 1)
                            var pointIn = util.pointInSvgPath(contourPath , checkPoint.x, checkPoint.y)
                            if (Math.abs(arcLength) > Math.PI*radius) {
                                flag2=1
                            } else {
                                flag2=0
                            } 
                            
                            if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                                let pp = util.calculateEndPoint(inletPoint.x, inletPoint.y, radius, endPoint.x, endPoint.y, arcLength, clockwise);               
                                newInletPath= `M ${pp.x} ${pp.y} A ${r} ${r} 0 ${flag2} ${clockwise} ${endPoint.x} ${endPoint.y}`   
                            } else {
                                inletPoint= util.findPointWithSameDirection( centers.x, centers.y, endPoint.x, endPoint.y, radius+rx)
                                let pp = util.calculateEndPoint(inletPoint.x, inletPoint.y, radius, endPoint.x, endPoint.y, arcLength, clockwise);               
                                newInletPath= `M ${pp.x} ${pp.y} A ${r} ${r} 0 ${flag2} ${clockwise} ${endPoint.x} ${endPoint.y}`  
                            }
                        }       
    
                } 
                break;
            } 
        } 
        else if (newInleType === "Hook") {
            if (contourType==='outer') clockwise=Number(!Boolean(clockwise));
            let r = IL*0.25
            if (oldInletType == newInleType) /*  {
                false
            } else */ {
               oldInletPathSegs.forEach((seg)=>{
                    if (seg[0] === "A" ) {
                        r=seg[1]
                    }
                })
            }

            var pointIndex, directionIndex;
            var midPoint;
            var startPointPath={}
            var pointOn, pointIn, perpendicular, direction;
            var fakePath, fakePoint

            const commandType = nearestSegment[0]
             switch (commandType) {                
                case 'L':
                    let x1=nearestSegment[1]
                    let y1=nearestSegment[2]
                    perpendicular=util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, IL) 
                    checkPoint = util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, 1) 
                    pointIn = util.pointInSvgPath(contourPath , checkPoint[0].x, checkPoint[0].y)

                    if ( endPoint.x===x1 && endPoint.y=== y1) {
                        return
                        let altX=SVGPathCommander.normalizePath(contour.getAttribute('d'))[0][1]
                        let altY=SVGPathCommander.normalizePath(contour.getAttribute('d'))[0][2]
                        perpendicular=util.findPerpendicularPoints( endPoint.x,endPoint.y, altX, altY, IL)
                    }
                    if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                        directionIndex=0
                    } else {
                        directionIndex=1
                    }

                    pointOn =  util.findPointWithSameDirection( perpendicular[directionIndex].x, perpendicular[directionIndex].y, endPoint.x, endPoint.y, IL-r)
                    midPoint= util.findTangentPoints(pointOn.x, pointOn.y, r, perpendicular[directionIndex].x, perpendicular[directionIndex].y)
                    fakePath =  document.createElementNS("http://www.w3.org/2000/svg", "path");
                    fakePath.setAttribute('d',  `M ${perpendicular[directionIndex].x} ${perpendicular[directionIndex].y}  A ${IL*0.5} ${IL*0.5} 0 0 ${clockwise} ${endPoint.x} ${endPoint.y}`)
                    fakePoint  = fakePath.getPointAtLength( fakePath.getTotalLength()*.5 );
                    pointIndex = this.pointIndex (midPoint[0].x, midPoint[0].y, midPoint[1].x, midPoint[1].y,fakePoint.x,fakePoint.y )

                    newInletPath= `M ${perpendicular[directionIndex].x} ${perpendicular[directionIndex].y}
                    L ${midPoint[pointIndex].x} ${midPoint[pointIndex].y}
                    A ${r} ${r} 0 0 ${clockwise} ${endPoint.x} ${endPoint.y}`

                break;
                case 'A':
                    const rx = parseFloat(nearestSegment[1]);
                    const ry = parseFloat(nearestSegment[2]);
                    const flag1 = parseFloat(nearestSegment[3]);
                    const flag2 = parseFloat(nearestSegment[4]);
                    const flag3 = parseFloat(nearestSegment[5]);
                    const EX = parseFloat(nearestSegment[6]);
                    const EY = parseFloat(nearestSegment[7]);
                    let CX= contourCommand[0][1]
                    let CY= contourCommand[0][2]
                    for (let i = 1; i < contourCommand.length; i++) {
                        let seg = contourCommand[i];
                        if ( util.arraysAreEqual(seg, nearestSegment)) {
                            if (contourCommand[i - 1] && contourCommand[i - 1][0] === 'A') {
                                CX = contourCommand[i - 1][6];
                                CY = contourCommand[i - 1][7];
                            } else if (contourCommand[i - 1] && contourCommand[i - 1][0] === 'L') {
                                CX = contourCommand[i - 1][1];
                                CY = contourCommand[i - 1][2];
                            }
                        }
                    }          

                    if (rx == ry) {
                        let centers= util.svgArcToCenterParam ( CX, CY, rx, ry, flag1, flag2, flag3, EX, EY, true)
                        let inletPoint= util.findPointWithSameDirection( endPoint.x, endPoint.y, centers.x, centers.y, 1)
                        let startPoint 
                        var pointIn = util.pointInSvgPath(contourPath , (inletPoint.x), (inletPoint.y))                    
                        if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                            startPoint = util.findPointWithSameDirection( endPoint.x, endPoint.y, centers.x, centers.y, IL)
                        }  else {
                            startPoint = util.findPointWithSameDirection(  centers.x, centers.y, endPoint.x, endPoint.y, rx+IL)
                        } 
                        pointOn = util.findPointWithSameDirection( startPoint.x,startPoint.y, endPoint.x, endPoint.y, IL-r) 
                        midPoint= util.findTangentPoints(pointOn.x, pointOn.y, r, startPoint.x, startPoint.y,)
                        fakePath =  document.createElementNS("http://www.w3.org/2000/svg", "path");
                        fakePath.setAttribute('d',  `M ${startPoint.x} ${startPoint.y}  A ${IL*0.5} ${IL*0.5} 0 0 ${clockwise} ${endPoint.x} ${endPoint.y}`)
                        fakePoint  = fakePath.getPointAtLength( fakePath.getTotalLength()*.5 );
                        pointIndex = this.pointIndex (midPoint[0].x, midPoint[0].y, midPoint[1].x, midPoint[1].y,fakePoint.x,fakePoint.y )
                        newInletPath= `M ${startPoint.x} ${startPoint.y} L ${ midPoint[pointIndex].x } ${ midPoint[pointIndex].y } A ${r} ${r} 0 0 ${clockwise} ${endPoint.x} ${endPoint.y}`  
                    } else {
                        let arcParams= arc.svgArcToCenterParam ( endPoint.x, endPoint.y, rx, ry, flag1, flag2, flag3, EX, EY, true)
                        let perpPoint = util.getPerpendicularCoordinates(arcParams, IL);
                        let startPoint 
                        pointIn = util.pointInSvgPath(contourPath , perpPoint.point1.x, perpPoint.point1.y)
                        if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                            startPoint = perpPoint.point1
                        }  else {
                            startPoint = perpPoint.point2
                        } 
                        pointOn = util.findPointWithSameDirection( startPoint.x,startPoint.y, endPoint.x, endPoint.y, IL-r) 
                        midPoint= util.findTangentPoints(pointOn.x, pointOn.y, r, startPoint.x, startPoint.y,)
                        fakePath =  document.createElementNS("http://www.w3.org/2000/svg", "path");
                        fakePath.setAttribute('d',  `M ${startPoint.x} ${startPoint.y}  A ${IL*0.5} ${IL*0.5} 0 0 ${clockwise} ${endPoint.x} ${endPoint.y}`)
                        fakePoint  = fakePath.getPointAtLength( fakePath.getTotalLength()*.5 );
                        pointIndex = this.pointIndex (midPoint[0].x, midPoint[0].y, midPoint[1].x, midPoint[1].y,fakePoint.x,fakePoint.y )
                        newInletPath= `M ${startPoint.x} ${startPoint.y} L ${ midPoint[pointIndex].x } ${ midPoint[pointIndex].y } A ${r} ${r} 0 0 ${clockwise} ${endPoint.x} ${endPoint.y}`  

                    } 
                break;
               
            } 
        }

        let resp={}
        resp.newInleType = newInleType
		resp.oldInletType = oldInletType
		resp.oldInletPath = oldInletPath
		resp.newInletPath = newInletPath
		resp.action = action
        resp.contourType =  contourType
        return resp     
    }

    inletMoving (e) {
        let contour = document.querySelector(`.contour[data-cid="${inlet.inletInMove.dataCid}"] path`).getAttribute('d')
        inlet.inletPath = document.querySelector(`.inlet[data-cid="${inlet.inletInMove.dataCid}"] path`).getAttribute('d')
        if (!contour || !inlet.inletPath) return; 
        let svg = document.querySelector('svg')         
        var pt = svg.createSVGPoint();

        if (e.type === 'mousemove') {
            pt.x = e.pageX;
            pt.y = e.pageY;
        } else if (e.type === 'touchmove') {
            pt.x = e.touches[0].pageX;
            pt.y = e.touches[0].pageY;
        }

        pt = pt.matrixTransform(document.querySelector('#group').getScreenCTM().inverse());
        let nearest = util.findNearestPointOnPath (contour, { x: pt.x, y: pt.y })
        if (inlet.inletInMove.type) {
            this.dataCid = +document.querySelector('.selectedContour[data-cid]').getAttribute("data-cid")
            let respInlet, respOutlet;
            try {            
                respInlet=inlet.setInletType(inlet.inletInMove.type, this.dataCid, {x:nearest.x, y:nearest.y, command: nearest.command.split(' ').map((a,i) => i== 0 ? a : Number(a))}, 'move')
                respOutlet=inlet.setOutletType(inlet.outletInMove.type, this.dataCid, {x:nearest.x, y:nearest.y, command: nearest.command.split(' ').map((a,i) => i== 0 ? a : Number(a))}, 'move')
                if (respInlet && respOutlet) {
                    inlet.updateInletAndOutlet (respInlet, respOutlet, 'move')
                }
           } catch (e) { console.log (e+'catch in inletMoving')
           }
            //console.log ('inletMoving')       
        }  
    }

    checkInletPosition (path, type, inletType, inletOutlet,seg=1) {
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
		pathElement.setAttribute("d", path);
		const totalLength = Math.round(pathElement.getTotalLength() / seg);
        let contour = document.querySelector(`.contour[data-cid="${this.dataCid}"] path`)
        if (inletType ==='Straight') return true;

        if (inletOutlet ==='inlet'){
            for (let i = 0; i < totalLength-1; i++) {
                let point = pathElement.getPointAtLength(i * seg);
                //console.log (point)
                // тут нужен путь не элемент!!! TODO
                let fill = util.pointInSvgPath(contour, point.x, point.y) 
                if ((type === 'inner' && !fill) || (type === 'outer' && fill)) {
                    console.log ('shit')
                    return false
                }
            }

        } else {
            for (let i = 1; i < totalLength; i++) {
                let point = pathElement.getPointAtLength(i * seg);
                //console.log (point)
                let fill = util.pointInSvgPath( contour, point.x, point.y) 
                if ((type === 'inner' && !fill) || (type === 'outer' && fill)) {
                    console.log ('shit')
                    return false
                }
            }

        } 
        return true
    }

    setOutletType (newOutleType, dataCid=false, endPoint=false, action='set') {
        if (!document.querySelectorAll('.selectedContour[data-cid]').length) return;
        if (!(dataCid || dataCid===0)){
            this.dataCid = +document.querySelector('.selectedContour[data-cid]').getAttribute("data-cid")
        } else {
            this.dataCid=dataCid
        }
        if (!(dataCid || dataCid ==0)) return;
    
        let contour = document.querySelector(`.contour[data-cid="${this.dataCid}"] path`)
        let contourPath = contour.getAttribute('d')
        let element = document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`)
        let oldOutletPath = element.getAttribute('d')
        let newOutletPath = ''
        let contourType = document.querySelector(`.contour[data-cid="${this.dataCid}"]`).classList.contains('inner') ? "inner" : "outer"
        let centers, IL, checkPoint;
        let contourCommand  = SVGPathCommander.normalizePath( contourPath )
        var clockwise = Number(SVGPathCommander.getDrawDirection(contourCommand))
        let oldOutletPathSegs =  SVGPathCommander.normalizePath( oldOutletPath )
        if (!endPoint) {
            endPoint = {x:contourCommand[0][1], y:contourCommand[0][2]}
        }
        try {
            if (!document.querySelector(`.contour[data-cid="${inlet.dataCid}"]`).classList.contains("noOutlet")
            ){
                let start = util.getFirstPointOfPath(element.getAttribute('d'))
                let end = util.getLastPointOfPath(element.getAttribute('d'))
                IL = Math.round(util.distance(start, end)*100)/100
            }           
        } catch (e) {
            console.log ("cant find outlet length")
        }
        if (!IL) IL=6
        document.querySelector(`.contour[data-cid="${this.dataCid}"]`).classList.remove("noOutlet")
        document.querySelector(`.outlet[data-cid="${this.dataCid}"]`).classList.remove("noOutlet")

        const oldOutletType = this.detectOutletType(oldOutletPath, this.dataCid)
        if ( action === 'set') {
            if (!oldOutletType || !newOutleType || (newOutleType === oldOutletType)) {
                return
            }
        }
        let nearestSegment =  contourCommand[1]
        if (action === 'move') nearestSegment=endPoint.command
        let outletAngle
        
        if ( oldOutletPathSegs.length >1){
            let M = oldOutletPathSegs[0]
            let L = oldOutletPathSegs[1]
            outletAngle = util.angleBetweenPoints (M[1], M[2], L[1], L[2])
        } 
        
        if (newOutleType === "Straight") {
            document.querySelector(`.contour[data-cid="${this.dataCid}"]`).classList.add("noOutlet")
            document.querySelector(`.outlet[data-cid="${this.dataCid}"]`).classList.add("noOutlet")
            newOutletPath= `M ${endPoint.x} ${endPoint.y}`
        } else if (newOutleType === "Direct")  {
            const commandType = nearestSegment[0]
            let A, x1, y1;
            let path =  SVGPathCommander.normalizePath( this.outletPath)
            if (typeof inlet.newAngleOutlet === 'number') {
                this.outletAngle=180-this.newAngleOutlet
            }
    
            if (typeof inlet.outletAngle === 'number') {
                this.newAngleOutlet=180-this.outletAngle
            }
    
            switch (commandType) {       
                
                case 'L':
                    if ( typeof inlet.outletAngle !== 'number') {
                        inlet.outletAngle = util.angleBetwenContourAndInlet (path, contourCommand, false)
                    }    
                    x1=nearestSegment[1]
                    y1=nearestSegment[2]
                    let perpendicular = util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, IL)
                    checkPoint = util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, 1)
                    var pointIn = util.pointInSvgPath(contour , checkPoint[0].x, checkPoint[0].y)
                    if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                        pointIndex=0
                    } else {
                        pointIndex=1
                    }
                    if (action === 'move') {
                        perpendicular[pointIndex]=util.rotatePoint (perpendicular[pointIndex].x, perpendicular[pointIndex].y, endPoint.x, endPoint.y, 90, 180-this.outletAngle) 
                    }
                    newOutletPath= `M${endPoint.x} ${endPoint.y} L${perpendicular[pointIndex].x} ${perpendicular[pointIndex].y}`
                    break;

                break;
                case 'A':
                    const rx = parseFloat(nearestSegment[1]);
                    const ry = parseFloat(nearestSegment[2]);
                    const flag1 = parseFloat(nearestSegment[3]);
                    const flag2 = parseFloat(nearestSegment[4]);
                    const flag3 = parseFloat(nearestSegment[5]);
                    const EX = parseFloat(nearestSegment[6]);
                    const EY = parseFloat(nearestSegment[7]);
                    // Calculate the center of the arc
                    let CX= contourCommand[0][1]
                    let CY= contourCommand[0][2]
                    for (let i = 1; i < contourCommand.length; i++) {
                        let seg = contourCommand[i];
                        if ( util.arraysAreEqual(seg, nearestSegment)) {
                            if (contourCommand[i - 1] && contourCommand[i - 1][0] === 'A') {
                                CX = contourCommand[i - 1][6];
                                CY = contourCommand[i - 1][7];
                            } else if (contourCommand[i - 1] && contourCommand[i - 1][0] === 'L') {
                                CX = contourCommand[i - 1][1];
                                CY = contourCommand[i - 1][2];
                            }
                        }
                    }          

                    if (rx !== ry) {
                        let arcParams= arc.svgArcToCenterParam ( endPoint.x, endPoint.y, rx, ry, flag1, flag2, flag3, EX, EY, true)
                        let perpPoint = util.getPerpendicularCoordinates(arcParams, IL);
                        let startPoint 
                        pointIn = util.pointInSvgPath(contour , perpPoint.point1.x, perpPoint.point1.y)
                        if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                            startPoint = perpPoint.point1
                        }  else {
                            startPoint = perpPoint.point2
                        } 
                        newOutletPath= `M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}` 
                        if (action === 'move') {
                            console.log ("Ебааать !")
                            let MX, MY, LX, LY;
                            if (path.length) {
                                path.forEach( seg=>{
                                    if ( seg.includes('M')) {
                                        MX=seg[1]
                                        MY=seg[2]
                                    }
                                    if ( seg.includes('L')) {
                                        LX=seg[1]
                                        LY=seg[2]    
                                    } else if (seg.includes('V')) {
                                        LY=seg[1]
                                        LX=MX 
                                    } else if (seg.includes('H')) {
                                        LY=MY
                                        LX=seg[1]
                                    }
                                }) 
                            }               

                            let OP = util.rotatePoint(  startPoint.x, startPoint.y,  perpPoint.point1.x, perpPoint.point1.y, 0, 270)
                            if (typeof this.newAngleOutlet !== `number`) {
                                let sds = Math.round(util.calculateAngleVector (  endPoint.x, endPoint.y, startPoint.x, startPoint.y, perpPoint.point1.x, perpPoint.point1.y)*100)/100
                                //console.log (Number(sds||0)%180+90)    
                                this.newAngleOutlet = (Number(sds||0)%180+90)    
                            }

                            let sds = Math.round(util.calculateAngleVector (  endPoint.x, endPoint.y, startPoint.x, startPoint.y, perpPoint.point1.x, perpPoint.point1.y)*100)/100
                            //console.log (Number(sds||0)%180+90)
                            console.log (Number(sds))

                            this.newEnds=util.rotatePoint (startPoint.x, startPoint.y, endPoint.x, endPoint.y, 90, this.newAngleOutlet) 
                            newOutletPath= `M${endPoint.x} ${endPoint.y} L${this.newEnds.x} ${this.newEnds.y}`       
                        } 


                    } else {
                        centers = util.svgArcToCenterParam (CX, CY, rx, ry, flag1, flag2, flag3, EX, EY, true) 
                        let inletPoint= util.findPointWithSameDirection( endPoint.x, endPoint.y, centers.x, centers.y, 1)
                        var pointIn = util.pointInSvgPath(contour , (inletPoint.x), (inletPoint.y))                    
                        if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                            inletPoint= util.findPointWithSameDirection( endPoint.x, endPoint.y, centers.x, centers.y, IL)
                        } else {
                            inletPoint= util.findPointWithSameDirection(  centers.x, centers.y, endPoint.x, endPoint.y, IL+rx)
                        } 
                        newOutletPath= `M${endPoint.x} ${endPoint.y} L${inletPoint.x} ${inletPoint.y}` 

                        if (action === 'move' && A !==90) {
                            //console.log ("Ебааать !")
                            let MX, MY, LX, LY;
                            if (path.length) {
                                path.forEach( seg=>{
                                    if ( seg.includes('M')) {
                                        MX=seg[1]
                                        MY=seg[2]
                                    }
                                    if ( seg.includes('L')) {
                                        LX=seg[1]
                                        LY=seg[2]    
                                    } else if (seg.includes('V')) {
                                        LY=seg[1]
                                        LX=MX 
                                    } else if (seg.includes('H')) {
                                        LY=MY
                                        LX=seg[1]
                                    }
                                }) 
                            }               

                            let OP = util.rotatePoint(  centers.x, centers.y,  LX, LY, 0, 270)
                            if (typeof this.newAngleOutlet !== `number`) {
                                this.newAngleOutlet = Math.round(util.calculateAngleVector ( LX, LY, MX, MY, OP.x, OP.y)*100)/100
                            }
                            this.newEnds=util.rotatePoint (inletPoint.x, inletPoint.y, endPoint.x, endPoint.y, 90, this.newAngleOutlet) 
                            newOutletPath= `M${endPoint.x} ${endPoint.y} L${this.newEnds.x} ${this.newEnds.y}`       
                        } 
                    }
                    break;
             } 
        } else if (newOutleType === "Tangent")  {
          
            if (contourType==='outer') clockwise=Number(!Boolean(clockwise));
            let r = IL*0.5
    
            let detectOldOutletType = this.detectOutletType(oldOutletPath,dataCid )
            if (detectOldOutletType === "Tangent") {
                oldOutletPathSegs.forEach((seg)=>{
                    if (seg[0] === "A" ) {
                        r=seg[1]                        
                    }
                })
            }
    
            const commandType = nearestSegment[0]
             switch (commandType) {                
                case 'L':
                    let x1=nearestSegment[1]
                    let y1=nearestSegment[2]
                    let perpendicular=util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, IL) 
                    checkPoint=util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, 1) 
                    pointIn = util.pointInSvgPath(contourPath , (checkPoint[0].x), (checkPoint[0].y))
                    if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                        newOutletPath= `M ${endPoint.x} ${endPoint.y} A ${r} ${r} 0 0 ${clockwise} ${perpendicular[0].x} ${perpendicular[0].y}`                   
                    } else {
                        newOutletPath= `M ${endPoint.x} ${endPoint.y} A ${r} ${r} 0 0 ${clockwise} ${perpendicular[1].x} ${perpendicular[1].y}`                   
                    }
    
                    if (detectOldOutletType === "Tangent") {
                        let arcLength =  util.arcLength(oldOutletPath)
                        let radius, flag2, flag3;
                        if (oldOutletPathSegs.length) {
                            oldOutletPathSegs.forEach( seg=>{
                                if ( seg.includes('A')) {
                                    flag2=seg[4]
                                    flag3=seg[5]
                                    radius=seg[1]                             
                                }                                
                            }) 
                        }
                        if (radius <= 0 || arcLength <= 0 || arcLength > 2*Math.PI*radius ) {
                            newOutletPath= oldOutletPath
                        }
                        centers={}
                        perpendicular=util.findPerpendicularPoints(  endPoint.x,endPoint.y, x1, y1, r) 
                        checkPoint=util.findPerpendicularPoints(  endPoint.x,endPoint.y, x1, y1, 1)                         
                        pointIn = util.pointInSvgPath(contourPath , checkPoint[0].x, checkPoint[0].y)
                        if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                            centers.x=perpendicular[0].x
                            centers.y=perpendicular[0].y
                        } else {
                            centers.x=perpendicular[1].x
                            centers.y=perpendicular[1].y
                        }
                        if ( Math.abs(arcLength) > Math.PI*radius) {
                            flag2=1
                        } else {
                            flag2=0
                        }
                        let pp = util.calculateEndPoint(centers.x, centers.y, radius, endPoint.x, endPoint.y , arcLength, clockwise===0 ? 1:0);               
                        newOutletPath= `M ${endPoint.x}, ${endPoint.y} A ${radius} ${radius}  0  ${flag2} ${clockwise} ${pp.x} ${pp.y} `   
                        //pointIn = util.pointInSvgPath(contourPath , pp.x, pp.y)                        
                    }              
                    break;
                case 'A':
                    const rx = parseFloat(nearestSegment[1]);
                    const ry = parseFloat(nearestSegment[2]);
                    const flag1 = parseFloat(nearestSegment[3]);
                    const flag2 = parseFloat(nearestSegment[4]);
                    const flag3 = parseFloat(nearestSegment[5]);
                    const EX = parseFloat(nearestSegment[6]);
                    const EY = parseFloat(nearestSegment[7]);
                    // Calculate the center of the arc
                    if (rx !== ry || true) {
                        let arcParams= arc.svgArcToCenterParam ( endPoint.x, endPoint.y, rx, ry, flag1, flag2, flag3, EX, EY, true)
                        let perpPoint = util.getPerpendicularCoordinates(arcParams, 1);
                        let startPoint 
                        pointIn = util.pointInSvgPath(contourPath , perpPoint.point1.x, perpPoint.point1.y)
                        if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                            startPoint = perpPoint.point1
                        }  else {
                            startPoint = perpPoint.point2
                        }  
                        let inletPoint= util.findPointWithSameDirection( endPoint.x, endPoint.y, startPoint.x, startPoint.y, IL)
                        newOutletPath= `M ${endPoint.x} ${endPoint.y} A ${r} ${r} 0 0 ${clockwise} ${inletPoint.x} ${inletPoint.y}`                   
            
                        if (detectOldOutletType === "Tangent") {
                            let arcLength =  util.arcLength(oldOutletPath)
                            let radius, flag2, flag3;
                            if (oldOutletPathSegs.length) {
                                oldOutletPathSegs.forEach( seg=>{
                                    if ( seg.includes('A')) {
                                        flag2=seg[4]
                                        flag3=seg[5]
                                        radius=seg[1]                             
                                    }                                
                                }) 
                            }
                            if (radius <= 0 || arcLength <= 0 || arcLength > 2*Math.PI*radius ) {
                                newOutletPath= oldOutletPath
                            }
    
                            inletPoint = util.findPointWithSameDirection( endPoint.x, endPoint.y, startPoint.x, startPoint.y, radius)

                            checkPoint = util.findPointWithSameDirection(  endPoint.x, endPoint.y,startPoint.x, startPoint.y, 1)
                            var pointIn = util.pointInSvgPath(contourPath , checkPoint.x, checkPoint.y)
                            if (Math.abs(arcLength) > Math.PI*radius) {
                                flag2=1
                            } else {
                                flag2=0
                            } 
                            
                            if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                                let pp = util.calculateEndPoint(inletPoint.x, inletPoint.y, radius, endPoint.x, endPoint.y, arcLength, clockwise===0 ? 1:0);               
                                newOutletPath= `M ${endPoint.x} ${endPoint.y} A ${r} ${r} 0 ${flag2} ${clockwise} ${pp.x} ${pp.y}`   
                            } else {
                                inletPoint= util.findPointWithSameDirection( centers.x, centers.y, endPoint.x, endPoint.y, radius+rx)
                                let pp = util.calculateEndPoint(inletPoint.x, inletPoint.y, radius, endPoint.x, endPoint.y, arcLength, clockwise===0 ? 1:0);               
                                newOutletPath= `M ${endPoint.x} ${endPoint.y} A ${r} ${r} 0 ${flag2} ${clockwise} ${pp.x} ${pp.y}`  
                            }
                        }              
                    }              
                break;
             } 
        } else if (newOutleType === "Hook")  {
            if (contourType==='outer') clockwise=Number(!Boolean(clockwise));
            let r = IL*0.25
            oldOutletPathSegs.forEach((seg)=>{
                if (seg[0] === "A" ) {
                    r=seg[1]
                    if (Math.round(r*2) >= Math.round(IL)) {
                        r = IL*0.25 
                    }
                }
            })
    
            var pointIndex, directionIndex;
            var midPoint;
            var startPointPath={}
            var pointOn, pointIn, perpendicular, direction;
            var fakePath, fakePoint
    
            const commandType = nearestSegment[0]
            switch (commandType) {                
                case 'L':
                    let x1=nearestSegment[1]
                    let y1=nearestSegment[2]
                    perpendicular=util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, IL) 
                    checkPoint=util.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, 1) 
                    pointIn = util.pointInSvgPath(contourPath , checkPoint[0].x, checkPoint[0].y)
                    //здесь обрабатывается тот редкий случай когда точка совпадает с началом линии и к ней никак не построить перпендикуляр
                    if ( endPoint.x===x1 && endPoint.y=== y1) {
                        return
                        let altX=SVGPathCommander.normalizePath(contour.getAttribute('d'))[0][1]
                        let altY=SVGPathCommander.normalizePath(contour.getAttribute('d'))[0][2]
                        perpendicular=util.findPerpendicularPoints( endPoint.x,endPoint.y, altX, altY, IL)
                    }
                    if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                        directionIndex=0
                    } else {
                        directionIndex=1
                    }
    
                    pointOn =  util.findPointWithSameDirection( perpendicular[directionIndex].x, perpendicular[directionIndex].y, endPoint.x, endPoint.y, IL-r)
                    midPoint= util.findTangentPoints(pointOn.x, pointOn.y, r, perpendicular[directionIndex].x, perpendicular[directionIndex].y)
                    fakePath =  document.createElementNS("http://www.w3.org/2000/svg", "path");
                    fakePath.setAttribute('d',  `M ${endPoint.x} ${endPoint.y}   A ${IL*0.5} ${IL*0.5} 0 0 ${clockwise} ${perpendicular[directionIndex].x} ${perpendicular[directionIndex].y}`)
                    fakePoint  = fakePath.getPointAtLength( fakePath.getTotalLength()*.5 );
                    pointIndex = this.pointIndex (midPoint[0].x, midPoint[0].y, midPoint[1].x, midPoint[1].y,fakePoint.x,fakePoint.y )
                    newOutletPath= `M ${endPoint.x} ${endPoint.y}
                    A ${r} ${r} 0 0 ${clockwise}  ${midPoint[pointIndex].x} ${midPoint[pointIndex].y}
                    L ${perpendicular[directionIndex].x} ${perpendicular[directionIndex].y}`
                    
    
                break;
                
                case 'A':
                    const rx = parseFloat(nearestSegment[1]);
                    const ry = parseFloat(nearestSegment[2]);
                    const flag1 = parseFloat(nearestSegment[3]);
                    const flag2 = parseFloat(nearestSegment[4]);
                    const flag3 = parseFloat(nearestSegment[5]);
                    const EX = parseFloat(nearestSegment[6]);
                    const EY = parseFloat(nearestSegment[7]);
                    let CX= contourCommand[0][1]
                    let CY= contourCommand[0][2]
                    for (let i = 1; i < contourCommand.length; i++) {
                        let seg = contourCommand[i];
                        if ( util.arraysAreEqual(seg, nearestSegment)) {
                            if (contourCommand[i - 1] && contourCommand[i - 1][0] === 'A') {
                                CX = contourCommand[i - 1][6];
                                CY = contourCommand[i - 1][7];
                            } else if (contourCommand[i - 1] && contourCommand[i - 1][0] === 'L') {
                                CX = contourCommand[i - 1][1];
                                CY = contourCommand[i - 1][2];
                            }
                        }
                    } 
                    if (rx == ry ) {
                        let centers = util.svgArcToCenterParam ( CX, CY, rx, ry, flag1, flag2, flag3, EX, EY, true)
                        let inletPoint= util.findPointWithSameDirection( endPoint.x, endPoint.y, centers.x, centers.y, 1)
                        let startPoint 
                        var pointIn = util.pointInSvgPath(contourPath , (inletPoint.x), (inletPoint.y))                    
                        if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                            startPoint = util.findPointWithSameDirection( endPoint.x, endPoint.y, centers.x, centers.y, IL)
                        }  else {
                            startPoint = util.findPointWithSameDirection(  centers.x, centers.y, endPoint.x, endPoint.y, rx+IL)
                        } 
                        pointOn = util.findPointWithSameDirection( startPoint.x,startPoint.y, endPoint.x, endPoint.y, IL-r) 
                        midPoint= util.findTangentPoints(pointOn.x, pointOn.y, r, startPoint.x, startPoint.y,)
                        fakePath =  document.createElementNS("http://www.w3.org/2000/svg", "path");
                        fakePath.setAttribute('d',  `M${endPoint.x} ${endPoint.y} A ${IL*0.5} ${IL*0.5} 0 0 ${clockwise}  ${startPoint.x} ${startPoint.y}`)
                        fakePoint  = fakePath.getPointAtLength( fakePath.getTotalLength()*.5 );
                        pointIndex = this.pointIndex (midPoint[0].x, midPoint[0].y, midPoint[1].x, midPoint[1].y, fakePoint.x,fakePoint.y )
                        newOutletPath= `M ${endPoint.x} ${endPoint.y}  A ${r} ${r} 0 0 ${clockwise}  ${ midPoint[pointIndex].x }  ${ midPoint[pointIndex].y } L ${startPoint.x} ${startPoint.y}`  
                        
                } else {
                        let arcParams= arc.svgArcToCenterParam ( endPoint.x, endPoint.y, rx, ry, flag1, flag2, flag3, EX, EY, true)
                        let perpPoint = util.getPerpendicularCoordinates(arcParams, IL);
                        let startPoint 
                        pointIn = util.pointInSvgPath(contourPath , perpPoint.point1.x, perpPoint.point1.y)
                        if ((pointIn && contourType==='inner') ||(!pointIn && contourType==='outer')){
                            startPoint = perpPoint.point1
                        }  else {
                            startPoint = perpPoint.point2
                        } 
                        pointOn = util.findPointWithSameDirection( endPoint.x, endPoint.y, startPoint.x,startPoint.y, r) 
                        midPoint= util.findTangentPoints(pointOn.x, pointOn.y, r, startPoint.x, startPoint.y,)
                        fakePath =  document.createElementNS("http://www.w3.org/2000/svg", "path");
                        fakePath.setAttribute('d',  `M${endPoint.x} ${endPoint.y} A ${IL*0.5} ${IL*0.5} 0 0 ${clockwise}  ${startPoint.x} ${startPoint.y}`)
                        fakePoint  = fakePath.getPointAtLength( fakePath.getTotalLength()*.5 );
                        pointIndex = this.pointIndex (midPoint[0].x, midPoint[0].y, midPoint[1].x, midPoint[1].y, fakePoint.x,fakePoint.y )
                        newOutletPath= `M ${endPoint.x} ${endPoint.y}  A ${r} ${r} 0 0 ${clockwise}  ${ midPoint[pointIndex].x }  ${ midPoint[pointIndex].y } L ${startPoint.x} ${startPoint.y}`  

                }
                break;
            } 
        } else if (newOutleType === "Unfinished"){
            document.querySelector(`.contour[data-cid="${this.dataCid}"]`).classList.add("noOutlet")
            document.querySelector(`.outlet[data-cid="${this.dataCid}"]`).classList.add("noOutlet")
            newOutletPath= `M ${endPoint.x} ${endPoint.y}`            
        }

        let resp={}
        resp.newOutleType =  newOutleType
		resp.oldOutletType = oldOutletType
		resp.oldOutletPath = oldOutletPath
		resp.newOutletPath = newOutletPath
        resp.contourType = contourType
		resp.action = action
        resp.element=element
        return resp     
        
     }

    outletTangentR (radius) {
        if ( inlet.outletModeEdit !=='outletModeEdit') return;
        console.log ("outletTangentR")
        let x1, y1, x2, y2 ,flag1, flag2, flag3, rO;
        let arcLength = util.arcLength(inlet.outletPath)
        if (radius <= 0 || arcLength <= 0 || 2*Math.PI*radius < arcLength ) {
            //throw Error ("radius it too small")
            return false
        }

        let pathArc  = SVGPathCommander.normalizePath( this.outletPath )
        if (pathArc.length) {
			pathArc.forEach( seg=>{
				if ( seg.includes('A')) {
                    flag1=seg[3]
                    flag2=seg[4]
                    flag3=seg[5]
				 	x2=seg[6]
					y2=seg[7]
                    rO=seg[1]
				}
				if ( seg.includes('M')) {
					x1=seg[1]
					y1=seg[2]
				}
			}) 
		}

        if ( x1 === x2 && y1===y2 ) return;
        let centers, endPoint, newCenters
        centers = util.svgArcToCenterParam (x1, y1, rO, rO, flag1, flag2, flag3, x2, y2, true) 
        newCenters =  util.findPointWithSameDirection (x1, y1, centers.x, centers.y,  radius) 
        endPoint = util.calculateEndPoint( newCenters.x, newCenters.y, radius, x1, y1, arcLength, flag3 ===1 ? 0:1);
      
        if ( pathArc.length && pathArc[1].includes("A") ) {
            pathArc[1][1]=radius
            pathArc[1][2]=radius
            pathArc[1][6]=endPoint.x
            pathArc[1][7]=endPoint.y   
        }        
        if ( Math.abs(arcLength) > Math.PI*radius) {
            pathArc[1][4]=1
        } else {
            pathArc[1][4]=0 
        } 

        let maxArcLength =Math.PI*radius*2
        if ( arcLength > maxArcLength ) {
            //$(`#outletTangentL`).val(maxArcLength);
            //$(`#outletTangentL`).trigger('change');
            console.log ("Error detected  " + (maxArcLength - arcLength))
        }

 
        let resp ={}
        resp.newOutleType = "Tangent"
		resp.oldOutletType = "Tangent"
		resp.oldOutletPath = document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`).getAttribute('d')
		resp.newOutletPath = pathArc.toString().replaceAll(',', ' ')
        resp.contourType = document.querySelector(`.contour[data-cid="${this.dataCid}"]`).classList.contains('inner') ? "inner" : "outer"
		resp.action = 'change'
        resp.element=  document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`)
        console.log( "outletTangentR")
        this.updateInletAndOutlet (false, resp)  

    }

    outletTangentL (arcLength) {
		if (  inlet.outletModeEdit !=='outletModeEdit') return;
        console.log ("outletTangentL "+ arcLength)
        let radius, x1, y1, x2, y2 ,flag1, flag2, flag3;
        let pathArc  = SVGPathCommander.normalizePath( this.outletPath )


		if (pathArc.length) {
			pathArc.forEach( seg=>{
				if ( seg.includes('A')) {
                    flag1=seg[3]
                    flag2=seg[4]
                    flag3=seg[5]
					radius=seg[1]
					x2=seg[6]
					y2=seg[7]
				}
				if ( seg.includes('M')) {
					x1=seg[1]
					y1=seg[2]
				}
			}) 
		}

        if (radius <= 0 || arcLength <= 0 || arcLength > 2*Math.PI*radius ) {
            throw Error ("length it too big")
            return
        }
         if (x1 === x2 && y1===y2) return;
        let centers =	util.svgArcToCenterParam(x1, y1, radius, radius, flag1, flag2, flag3, x2, y2, true) 
        let endPoint = util.calculateEndPoint( centers.x, centers.y, radius, x1, y1, arcLength, Number(!Boolean(flag3)));

        //console.log ( endPoint )
        if ( pathArc.length && pathArc[1].includes("A") ) {
            pathArc[1][6]=endPoint.x
            pathArc[1][7]=endPoint.y   
        }
        if ( Math.abs(arcLength) > Math.PI*radius) {
            pathArc[1][4]=1
        } else {
            pathArc[1][4]=0 
        }
        let resp ={}
        resp.newOutleType = "Tangent"
		resp.oldOutletType = "Tangent"
		resp.oldOutletPath = document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`).getAttribute('d')
		resp.newOutletPath = pathArc.toString().replaceAll(',', ' ')
        resp.contourType = document.querySelector(`.contour[data-cid="${this.dataCid}"]`).classList.contains('inner') ? "inner" : "outer"
		resp.action = 'change'
        resp.element=  document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`)
        this.updateInletAndOutlet (false, resp)  
        console.log( "outletTangentL")


    }

    outletHookR ( radius ) {
		if (  inlet.outletModeEdit !=='outletModeEdit') return;
        console.log ('outletHookR   '+radius)
        radius = Number(radius)
        let MX, MY, LX, LY, R, EX, EY, flag1, flag2, flag3;
        let path =  SVGPathCommander.normalizePath( this.outletPath)
        let outletLength = +document.querySelector("#outletHookL").value
        if (path.length) {
            path.forEach( seg=>{
                if ( seg.includes('M')) {
                    MX=seg[1]
                    MY=seg[2]
                }
                if ( seg.includes('L')) {
                    LX=seg[1]
                    LY=seg[2]    
                } else if (seg.includes('V')) {
                    LY=seg[1]
                    LX=MX 
                } else if (seg.includes('H')) {
                    LY=MY
                    LX=seg[1]
                } else if (seg.includes('A')){
                    R=seg[1]
                    EX=seg[6]
                    EY=seg[7]
                    flag1=seg[3]
                    flag2=seg[4]
                    flag3=seg[5]
                }
            }) 
        }

        if (radius <= 0  ) {
            document.querySelector("#outletHookR").value = outletLength*0.5
            //throw Error ("radius it too small")
            return
        }

        if ( radius > outletLength*0.5 ) {
            document.querySelector("#outletHookR").value = outletLength*0.5
            return
        }
        
        let centers = util.svgArcToCenterParam (MX, MY, R, R, flag1, flag2, flag3, EX, EY, true) 
        let newCenters =  util.findPointWithSameDirection (MX, MY, centers.x, centers.y, radius) 

        let c = util.distance (newCenters.x,newCenters.y, LX, LY)
		let b = radius
		let a = Math.sqrt((c**2) - (b**2) )
		let theta = Math.PI*2 -(Math.PI - Math.atan(a/b))
		let arcLength = radius * theta;
        let endPoint = util.calculateEndPoint( newCenters.x, newCenters.y, radius, MX, MY, arcLength, flag3);
        if ( radius > outletLength*0.5 ) {
            return
        }

        if ( path.length && path[1].includes("A") ) {
            path[1][1]=radius
            path[1][2]=radius
            path[1][6]=endPoint.x
            path[1][7]=endPoint.y
        }
        let resp ={}
        resp.newOutleType = "Hook"
		resp.oldOutletType = "Hook"
		resp.oldOutletPath = document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`).getAttribute('d')
		resp.newOutletPath = path.toString().replaceAll(',', ' ')
        resp.contourType = document.querySelector(`.contour[data-cid="${this.dataCid}"]`).classList.contains('inner') ? "inner" : "outer"
		resp.action = 'change'
        resp.element=  document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`)
        this.updateInletAndOutlet (false, resp)  
        console.log( "outletHookR")

    }

    outletHookL (D) {
		if (  inlet.outletModeEdit !=='outletModeEdit') return;
        let radius = +document.querySelector("#outletHookR").value
        console.log (D, radius)
        if (D <= 0  ) {
            document.querySelector("#outletHookL").value = radius*2
            throw Error ("Impossible length")
            return
        }
        if ( D * 0.5 < radius ) {
            document.querySelector("#outletHookL").value = radius*2
            return
        }

        let MX, MY, LX, LY, EX, EY;
        let path =  SVGPathCommander.normalizePath(this.outletPath)
        if (path.length) {
            path.forEach( seg=>{
                if ( seg.includes('M')) {
                    MX=seg[1]
                    MY=seg[2]
                }
                if ( seg.includes('L')) {
                    LX=seg[1]
                    LY=seg[2]    
                } else if (seg.includes('V')) {
                    LY=seg[1]
                    LX=MX 
                } else if (seg.includes('H')) {
                    LY=MY
                    LX=seg[1]
                } else if (seg.includes('A')){
                    EX=seg[6]
                    EY=seg[7]
                }
            }) 
        }

        let newEndPoint = util.getNewEndPoint(LX, LY, MX, MY,  D);
        path.forEach( seg=>{
            if ( seg.includes('L')) {
                seg[1]=newEndPoint.x
                seg[2]=newEndPoint.y    
            } 
        }) 
        let resp ={}
        resp.newOutleType = "Hook"
		resp.oldOutletType = "Hook"
		resp.oldOutletPath = document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`).getAttribute('d')
		resp.newOutletPath = path.toString().replaceAll(',', ' ')
        resp.contourType = document.querySelector(`.contour[data-cid="${this.dataCid}"]`).classList.contains('inner') ? "inner" : "outer"
		resp.action = 'change'
        resp.element=  document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`)
        this.updateInletAndOutlet (false, resp)  
        this.outletHookR( +document.querySelector("#outletHookR").value)
        console.log ('outletHookL')

    }

    outletDirectL(D) {
		if (  inlet.outletModeEdit !=='outletModeEdit') return;
        console.log (D)
        let MX, MY, LX, LY;
        let path =  SVGPathCommander.normalizePath(this.outletPath)
        if (path.length) {
            path.forEach( seg=>{
                if ( seg.includes('M')) {
                    MX=seg[1]
                    MY=seg[2]
                }
                if ( seg.includes('L')) {
                    LX=seg[1]
                    LY=seg[2]    
                } else if (seg.includes('V')) {
                    LY=seg[1]
                    LX=MX 
                } else if (seg.includes('H')) {
                    LY=MY
                    LX=seg[1]
                }
            }) 
        }

        let newEndPoint = util.getNewEndPoint(LX, LY, MX, MY,  D);
        path.forEach( seg=>{
            if ( seg.includes('L')) {
                seg[1]=newEndPoint.x
                seg[2]=newEndPoint.y    
            } 
        }) 

        let resp ={}
        resp.newOutleType = "Direct"
		resp.oldOutletType = "Direct"
		resp.oldOutletPath = document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`).getAttribute('d')
		resp.newOutletPath = path.toString().replaceAll(',', ' ')
        resp.contourType = document.querySelector(`.contour[data-cid="${this.dataCid}"]`).classList.contains('inner') ? "inner" : "outer"
		resp.action = 'change'
        resp.element=  document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`)
        this.updateInletAndOutlet (false, resp)  
        console.log ('outlertDirecrL')

    }

    outletDirectA(newAxis ) {
		if (  inlet.outletModeEdit !=='outletModeEdit') return;
        if (newAxis < 0 || newAxis > 180 ) return;
        let contourElement= document.querySelector(`.contour[data-cid="${inlet.dataCid}"] path`)
        let contourPath = contourElement.getAttribute('d')

        let MX, MY, LX, LY, PX, PY;
        let path =  SVGPathCommander.normalizePath(this.outletPath)
        if (path.length) {
            path.forEach( seg=>{
                if ( seg.includes('M')) {
                    MX=seg[1]
                    MY=seg[2]
                }
                if ( seg.includes('L')) {
                    LX=seg[1]
                    LY=seg[2]    
                } else if (seg.includes('V')) {
                    LY=seg[1]
                    LX=MX 
                } else if (seg.includes('H')) {
                    LY=MY
                    LX=seg[1]
                }
            }) 
        }

        let contour =  SVGPathCommander.normalizePath(contourPath)
        contour.forEach((seg, i)=>{
            if (i<2){
                if (seg.includes('M')) {
                    PX=seg[1]
                    PY=seg[2]
                } else if ( seg.includes('L')) {
                    PX=seg[1]
                    PY=seg[2]    
                } else if (seg.includes('V')) {
                    PY=seg[1]
                } else if (seg.includes('H')) {
                    PX=seg[1]
                } else if (seg.includes('A')) {
                    PX=seg[6]
                    PY=seg[7]
                }
            }
        })

        let oldAxis  = util.calculateAngleVector( MX, MY,LX, LY, PX, PY )
         if (contour[1][0] === 'A') {
            console.log('Arc position detected')
            let nearestSegment = contour[1]
            const rx = parseFloat(nearestSegment[1]);
            const ry = parseFloat(nearestSegment[2]);
            const flag1 = parseFloat(nearestSegment[3]);
            const flag2 = parseFloat(nearestSegment[4]);
            const flag3 = parseFloat(nearestSegment[5]);
            const EX = parseFloat(nearestSegment[6]);
            const EY = parseFloat(nearestSegment[7]);

            let C = util.svgArcToCenterParam (MX, MY, rx, ry, flag1, flag2, flag3, EX, EY, true)   
            let OP = util.rotatePoint(  C.x, C.y,  MX, MY,0, 270)
            oldAxis = Math.round(util.calculateAngleVector ( MX, MY, LX, LY, OP.x, OP.y)*100)/100
            console.log('Arc position detected in degree '+ oldAxis)
        }

        let pathDirection = Number(SVGPathCommander.getDrawDirection(contour))
        let outerInner = document.querySelector(`.contour[data-cid="${this.dataCid}"]`).classList.contains('inner') ? "inner" : "outer"
        if (pathDirection === 1 && outerInner === 'outer'){
             newAxis=180-newAxis
             oldAxis=180-oldAxis
        }
        
        let newEndPoint= util.rotatePoint(LX, LY, MX, MY, oldAxis, newAxis)
        if (inlet.outletPath.includes("NaN")) {
            return
        }
        let resp ={}
        resp.newOutleType = "Direct"
		resp.oldOutletType = "Direct"
		resp.oldOutletPath = document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`).getAttribute('d')
		resp.newOutletPath = `M${MX} ${MY} L${ newEndPoint.x} ${newEndPoint.y}`
        resp.contourType = document.querySelector(`.contour[data-cid="${this.dataCid}"]`).classList.contains('inner') ? "inner" : "outer"
		resp.action = 'change'
        resp.element=  document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`)
        this.updateInletAndOutlet (false, resp)
        console.log ('outletDirectAA')  
 
    }

    findDangerInlets () {
        document.querySelectorAll(`.inlet[data-cid]`).forEach( element =>{
            //console.log (element)
            inlet.dataCid = +element.getAttribute("data-cid")
            let contour = document.querySelector(`.contour[data-cid="${inlet.dataCid}"]`)
            let elementPath = document.querySelector(`.inlet[data-cid="${inlet.dataCid}"] path`)
            let oldInletPath = elementPath.getAttribute('d')
            let resp={}
            resp.newInleType =  this.detectInletType(oldInletPath)
            resp.oldInletType = resp.newInleType
            resp.oldInletPath = oldInletPath
            resp.newInletPath = oldInletPath
            resp.action = 'check'
            resp.contourType =  element.classList.contains('inner') ? "inner" : "outer"
            resp.element=element
            let check = this.checkInletIntend (resp)
            if (!check) {
                element.classList.add('collisionInlet')
                contour.classList.add('collisionInlet')
            }
            inlet.inletInMove = false
            inlet.inletAngle = false
            inlet.contourEdges =''
            inlet.contourEdges1 =''
        })

        setTimeout(()=>{    
          //  $(".collisionInlet").removeClass('collisionInlet')
        }, 15000)

        let collInl= 0//$(".collisionInlet").length
        if (collInl === 0) {
            util.messaging ("All inlets are Ok!", false, true)
        }else {
            util.messaging ( "Some inlets have danger position!", true, false)
        } 
    }

    updateInletAndOutlet (inl, outlet, action='set') {
        //console.log (inl)
        let inletIscorrect 
        let outletIscorrect 
        if (inl) {
            if ( inl.newInletPath.includes('NaN')) {
                //log.add(__("Error outlet editing"), 'error')
                console.log (inl.newInletPath)
                return
            }
            inletIscorrect = true//this.checkInletPosition (inl.newInletPath,  inl.contourType, inl.newInleType, 'inlet')
            //console.log ("!!!  "+ JSON.stringify(inl))
            if (inletIscorrect) {
                inletIscorrect = this.checkInletIntend (inl)
            } 
            //console.log ("!!!  "+ inletIscorrect)
        } else {
            inletIscorrect = true
        }

        if (outlet) {
            if ( outlet.newOutletPath.includes('NaN')) {
                //log.add(__("Error outlet editing"), 'error')
                console.log (outlet.newOutletPath)
                return
            }
            outletIscorrect = this.checkInletPosition (outlet.newOutletPath, outlet.contourType, outlet.newOutleType, 'outlet')             
        } else {
            outletIscorrect = true
        }

        if (outletIscorrect && inletIscorrect) {

            if (inl) {                

                inl.newInletPath= inl.newInletPath.replace(/[\s\n]{2,}/gm, ' ')
                this.inletPath = inl.newInletPath
                inl.element.setAttribute('d', this.inletPath)
                this.inlet = document.querySelector(`.inlet[data-cid="${this.dataCid}"] path`)
                if (inl.action ==='set') {
                    this.updateInletPanel( inl.newInleType )
                }        
            }

            if (outlet) {
                outlet.newOutletPath= outlet.newOutletPath.replace(/[\s\n]{2,}/gm, ' ')
                this.outletPath = outlet.newOutletPath
                outlet.element.setAttribute('d', this.outletPath)
                this.outlet = document.querySelector(`.outlet[data-cid="${this.dataCid}"] path`)
                if (outlet.action ==='set') {
                    this.updateOutletPanel( outlet.newOutleType )
                }
            }

            if (inl && inl.action ==='set') {
                //log.add( __("New inlet set"))
            }

            if (outlet  && outlet.action ==='set') {
                //log.add( __("New outlet set"))
            } 
            //здесь в панели уст значение макроИнлет на равное макро
            if (inl && inl.action ==='set' && inl.oldInletType === 'Straight' && inl.newInleType !== 'Straight'){
                part.macroInlet = part.macro
                part.setCoord() 
            }
            //здесь в панели уст значение макроИнлет равное -1 так врезки нет
            if (inl && inl.action ==='set' && inl.newInleType === 'Straight' && inl.oldInletType !== 'Straight'){
                part.macroInlet = -1
                part.setCoord() 
            }

            if ((inl && inl.action === 'move') || (outlet && outlet.action === 'move')) {
                this.updateInletPath()
            }
            return true
        } else {
            if (action === 'reverse' || action === 'set'){
                //util.messaging(__("Danger inlet position"), true, false)
                this.updateInletPanel( inl.oldInletType )
                this.updateOutletPanel( outlet.oldOutletType)
                return false
            }
        }
    }

    checkInletIntend (inl) {
        //return true

        let needCheck = document.querySelector("#preventDangerInlets").checked
        if (!needCheck && inl.action !=='check') return true

		if (typeof inlet.dataCid !== `number`) {
			console.log ('выбери контур !') 
			return
		}
		if (inl.newInleType === "Straight") {
			return  true	
		} 

		let intend= Math.round( Math.abs(+document.querySelector("#inletIntend").value))
        if ( !intend ||  typeof intend !== 'number') {
            intend=2
        }

        if (intend > 5){
            intend=2
        }
        //$("#inletIntend").val(intend)
		let contour = document.querySelector(`.contour[data-cid="${inlet.dataCid}"]`)
		let	contourElement= document.querySelector(`.contour[data-cid="${inlet.dataCid}"] path`)
		let	contourPath = contourElement.getAttribute('d')
        let contourPoints=util.pointInSvgPath(contourPath, 1);
        let contourInner = contour.classList.contains('inner') ? 1:0
        let contourCommand = SVGPathCommander.normalizePath (contourPath)
		
		if ( !this.contourEdges/*  && !this.contourEdges.length */) {		
			this.contourEdges = util.parsePointsString(contourPoints, false, contourInner, intend*2)
            this.contourEdges.push(this.contourEdges[0])
			//createSVG(this.contourEdges, 'blue',  'contInt')
		}

		if (!this.contourEdges1/*  && !this.contourEdges1.length */) {		
			this.contourEdges1 = util.parsePointsString(contourPoints, false, contourInner, intend*2+2 )
			this.contourEdges1.push(this.contourEdges1[0])
			//createSVG(this.contourEdges1, 'pink',  'contInt1')
		}

		let MX,MY,EX,EY,distance,radius,cuttedInlet,inletPoint,inletPoints,CX,CY,flag1,flag2,flag3,intersection, nesIntesect;
        if (inl.newInleType === "Hook" ) {
			cuttedInlet = SVGPathCommander.normalizePath( inl.newInletPath)
			cuttedInlet.forEach((seg) =>{
				if ( seg.includes('M')) {
					MX=seg[1]
					MY=seg[2]    
				} else if (seg.includes('A')) {
					radius=seg[1]
                    EX=seg[6]
                    EY=seg[7]
				} 
			})

			distance = util.distance({x:MX,y:MY},{x:EX,y:EY})
			inletPoint= util.findPointWithSameDirection( MX, MY, EX, EY, distance-intend-0.5)

            let perpendicular=util.findPerpendicularPoints( EX, EY, MX, MY, 10)
			CX = perpendicular[0].x
			CY = perpendicular[0].y

			let PP = util.findParallelLine(EX, EY, CX, CY,  inletPoint.x, inletPoint.y, 1000)
			////createSVG( [[PP[0].x,PP[0].y],[PP[1].x,PP[1].y]], 'white',  'pp')

			inletPoints = util.pointInSvgPath(cuttedInlet, 1).split(';').map ( a => a.split(',').map( aa => Number(aa)))
            //createSVG(inletPoints, 'yellow',  'inletPoints1')
			let intersection;

			// в этом цикле ообрезаем inlet до чтоки пресечения
			for (let ind = 0; ind < inletPoints.length-1; ind++) {
				let x = inletPoints[ind][0]
				let xx = inletPoints[ind+1][0]
				let y = inletPoints[ind][1]
				let yy = inletPoints[ind+1][1]

				intersection = util.intersects (PP,[{x:x,y:y},{x:xx,y:yy}])
				if (intersection) {
					inletPoints.splice(ind+1);
					let IL = util.distance ({x:MX,y:MY},{x:intersection.x,y:intersection,y})
					let lastPoint = util.findPointWithSameDirection(MX,MY,intersection.x, intersection.y, IL )
					if(inletPoints.length===1){
						inletPoints.push([intersection.x, intersection.y])
					} else {
						inletPoints.push([lastPoint.x, lastPoint.y])
					}
					break;
				}	
				intersection=false
			}
			//createSVG(inletPoints, 'red',  'inletPoints')
            //return true
			// в этом цикле ищем столкновение 
			for (let ind = 0; ind < inletPoints.length-1; ind++) {
				let x = inletPoints[ind][0]
				let xx = inletPoints[ind+1][0]
				let y = inletPoints[ind][1]
				let yy = inletPoints[ind+1][1]

				for (let ind = 0; ind < this.contourEdges.length-1; ind++) {
					let cx =  this.contourEdges[ind][0]
					let cxx = this.contourEdges[ind+1][0]
					let cy =  this.contourEdges[ind][1]
					let cyy = this.contourEdges[ind+1][1]

					let intersection = util.intersects ([{x:cx,y:cy},{x:cxx,y:cyy}],[{x:x,y:y},{x:xx,y:yy}])
					if (intersection) {
						return false;
					}	
				}
			}

			nesIntesect=false
			// в этом цикле ищем столкновение которое должно быть!!
			for (let ind = 0; ind < inletPoints.length-1; ind++) {
				let x = inletPoints[ind][0]
				let xx = inletPoints[ind+1][0]
				let y = inletPoints[ind][1]
				let yy = inletPoints[ind+1][1]

				for (let ind = 0; ind < this.contourEdges1.length-1; ind++) {
					let cx =  this.contourEdges1[ind][0]
					let cxx = this.contourEdges1[ind+1][0]
					let cy =  this.contourEdges1[ind][1]
					let cyy = this.contourEdges1[ind+1][1]

					let intersection = util.intersects ([{x:cx,y:cy},{x:cxx,y:cyy}],[{x:x,y:y},{x:xx,y:yy}])
					if (intersection) {
						nesIntesect= true
						//console.log ("Find  necessary intersection  " +  intersection )
					}	
				}
			}
			return nesIntesect
		} else if (inl.newInleType === "Tangent") {
               // return true
            
                cuttedInlet = SVGPathCommander.normalizePath( inl.newInletPath)
                cuttedInlet.forEach((seg) =>{
                        if ( seg.includes('A')) {
                            flag1=seg[3]
                            flag2=seg[4]
                            flag3=seg[5]
                            EX=seg[6]
                            EY=seg[7]
                            radius=seg[1]        
                        }
                        if ( seg.includes('M')) {
                            MX=seg[1]
                            MY=seg[2]
                        }
                }) 
        
                var centers = util.svgArcToCenterParam (MX, MY, radius, radius, flag1, flag2, flag3, EX, EY, true) 
                var topPoint = util.findPointWithSameDirection( EX, EY, centers.x, centers.y, 2*radius)
    
                distance = 2*radius//util.distance({x:topPoint.x,y:topPoint.y},{x:EX,y:EY})
                inletPoint= util.findPointWithSameDirection( topPoint.x, topPoint.y, EX, EY, distance-intend-0.5)
    
                let perpendicular=util.findPerpendicularPoints( EX, EY, topPoint.x, topPoint.y, 10)
                CX = perpendicular[0].x
                CY = perpendicular[0].y
    
                let PP = util.findParallelLine(EX, EY, CX, CY,  inletPoint.x, inletPoint.y, 1000)
                //createSVG( [[PP[0].x,PP[0].y],[PP[1].x,PP[1].y]], 'white',  'pp')
    
                inletPoints = util.pointInSvgPath(cuttedInlet, 1).split(';').map ( a => a.split(',').map( aa => Number(aa)))
    
                // в этом цикле ообрезаем inlet до чтоки пресечения
                for (let ind = 0; ind < inletPoints.length-1; ind++) {
                    let x = inletPoints[ind][0]
                    let xx = inletPoints[ind+1][0]
                    let y = inletPoints[ind][1]
                    let yy = inletPoints[ind+1][1]
    
                    intersection = util.intersects (PP,[{x:x,y:y},{x:xx,y:yy}])
                    if (intersection) {
                        inletPoints.splice(ind);
                        inletPoints.push([intersection.x, intersection.y])
                        break;
                    }	
                    intersection=false
                }
                //createSVG(inletPoints, 'yellow',  'inletPoints')   
                // в этом цикле ищем столкновение 
                for (let ind = 0; ind < inletPoints.length-1; ind++) {
                    let x = inletPoints[ind][0]
                    let xx = inletPoints[ind+1][0]
                    let y = inletPoints[ind][1]
                    let yy = inletPoints[ind+1][1]
    
                    for (let ind = 0; ind < this.contourEdges.length-1; ind++) {
                        let cx =  this.contourEdges[ind][0]
                        let cxx = this.contourEdges[ind+1][0]
                        let cy =  this.contourEdges[ind][1]
                        let cyy = this.contourEdges[ind+1][1]
    
                        let intersection = util.intersects ([{x:cx,y:cy},{x:cxx,y:cyy}],[{x:x,y:y},{x:xx,y:yy}])
                        if (intersection) {
                            return false;
                        }	
                    }
                }
    
                nesIntesect=false
                // в этом цикле ищем столкновение которое должно быть!!
                for (let ind = 0; ind < inletPoints.length-1; ind++) {
                    let x = inletPoints[ind][0]
                    let xx = inletPoints[ind+1][0]
                    let y = inletPoints[ind][1]
                    let yy = inletPoints[ind+1][1]
    
                    for (let ind = 0; ind < this.contourEdges1.length-1; ind++) {
                        let cx =  this.contourEdges1[ind][0]
                        let cxx = this.contourEdges1[ind+1][0]
                        let cy =  this.contourEdges1[ind][1]
                        let cyy = this.contourEdges1[ind+1][1]
    
                        let intersection = util.intersects ([{x:cx,y:cy},{x:cxx,y:cyy}],[{x:x,y:y},{x:xx,y:yy}])
                        if (intersection) {
                            nesIntesect= true
                            //console.log ("Find  necessary intersection  " +  intersection )
                        }	
                    }
                }
                return nesIntesect

        } else if (inl.newInleType === "Direct") {
            cuttedInlet = SVGPathCommander.normalizePath( inl.newInletPath)
			cuttedInlet.forEach((seg) =>{
				if ( seg.includes('M')) {
					MX=seg[1]
					MY=seg[2]    
				} else if (seg.includes('L')) {
                    EX=seg[1]
                    EY=seg[2]
				} 
			})
             
            // здесь обезаем по место столкновения(!)
            let inletPoint
            for (let ind = 0; ind < this.contourEdges.length-1; ind++) {
                let cx =  this.contourEdges[ind][0]
                let cxx = this.contourEdges[ind+1][0]
                let cy =  this.contourEdges[ind][1]
                let cyy = this.contourEdges[ind+1][1]
                let intersection = util.intersects ([{x:cx,y:cy},{x:cxx,y:cyy}],[{x:MX,y:MY},{x:EX,y:EY}])
                if (intersection) {
                    distance = util.distance({x:MX,y:MY},{x:intersection.x,y:intersection.y})
                    inletPoint= util.findPointWithSameDirection( MX, MY, intersection.x,intersection.y, distance)                  
                    //createSVG( [[MX,MY],[inletPoint.x,inletPoint.y]], 'yellow',  'inletPoints')
                }	
            }
            nesIntesect=false
            // в этом цикле ищем столкновение которое должно быть!!
             for (let ind = 0; ind < this.contourEdges1.length-1; ind++) {
                let cx =  this.contourEdges1[ind][0]
                let cxx = this.contourEdges1[ind+1][0]
                let cy =  this.contourEdges1[ind][1]
                let cyy = this.contourEdges1[ind+1][1]

                try{
                    intersection = util.intersects ([{x:cx,y:cy},{x:cxx,y:cyy}],[{x:MX,y:MY},{x:inletPoint.x,y:inletPoint.y}])
                    if (intersection) {
                        nesIntesect= true
                        //console.log ("Find  necessary intersection  " +  intersection )
                    }
                } catch(e){}
            }
            return nesIntesect
		}
	}
}

const inlet = new Inlet()

export default inlet;