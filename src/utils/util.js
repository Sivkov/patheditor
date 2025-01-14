import svgPath from "svgpath";
import SVGPathCommander from "svg-path-commander";
import inlet from "../scripts/inlet";

class Util {
	static radian(ux, uy, vx, vy) {
		var dot = ux * vx + uy * vy;
		var mod = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
		var rad = Math.acos(dot / mod);
		if (ux * vy - uy * vx < 0.0) {
			rad = -rad;
		}
		return rad;
	}

	static distance(arg1, arg2, arg3 = null, arg4 = null) {
        let x1, y1, x2, y2;

        if (arg2 !== null && arg3 === null && arg4 === null) {
            // Если переданы два объекта с координатами
            x1 = arg1.x;
            y1 = arg1.y;
            x2 = arg2.x;
            y2 = arg2.y;
        } else if (arg2 !== null && arg3 !== null && arg4 !== null) {
            // Если переданы четыре отдельных числа
            x1 = arg1;
            y1 = arg2;
            x2 = arg3;
            y2 = arg4;
        } else {
            throw new Error("Invalid arguments. Use either two points as objects or four numbers.");
        }

        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

	static convertScreenCoordsToSvgCoords(x, y) {
		var svg = document.getElementById("svg")
		var group = document.getElementById("group");
		var pt = svg.createSVGPoint();  // An SVGPoint SVG DOM object
		pt.x = x;
		pt.y = y;

		try {
			pt = pt.matrixTransform(group.getScreenCTM().inverse());
			return { 'x': pt.x, 'y': pt.y };
		} catch (e) {
			return false
		}
	}
	 
	static getMousePosition = (evt) => {
		var svg = document.getElementById("svg")
    	let CTM = svg.getScreenCTM();
        
        return   {
            x: (evt.clientX + CTM.f)/ CTM.a,
            y: (evt.clientY + CTM.e)/ CTM.d
        }; 
    }

	static multiplyMatrices = (m1, m2) => {
        return {
            a: m1.a * m2.a + m1.c * m2.b,
            b: m1.b * m2.a + m1.d * m2.b,
            c: m1.a * m2.c + m1.c * m2.d,
            d: m1.b * m2.c + m1.d * m2.d,
            e: m1.a * m2.e + m1.c * m2.f + m1.e,
            f: m1.b * m2.e + m1.d * m2.f + m1.f,
        };
    };

	static mirror () {
		return 'xui'
	}

	static getValueFromString(str, targetChar, num = true) {
		// Create a regular expression pattern to match the target character and its value
		const pattern = new RegExp(targetChar + '(\\S+)');

		// Use the regular expression to find a match in the input string
		const match = str.match(pattern);

		// If a match is found, return the matched value; otherwise, return null
		if (match && match[1]) {
			if (num) {
				return +match[1];
			} else {
				return match[1];
			}
		} else {
			return null;
		}
	}

	static getAttributeValue(inputString, attributeName) {
		const pattern = new RegExp(`${attributeName}="([^"]+)"`, 'i');
		const match = inputString.match(pattern);

		if (match && match[1]) {
			return match[1];
		} else {
			return null;
		}
	}

	static round(i, pow = 6, format = false) {
		if (!format) {
			return (Math.round(Number(i) * 10 ** pow)) / 10 ** pow
		} else {
			let d = String((Math.round(Number(i) * 10 ** pow)) / 10 ** pow)
			if (d.match(/\./)) {
				let afderDot =  d.split('.').reverse()[0].length
				return d +( afderDot < pow ? '0'.repeat(pow-afderDot) : '')
			} else {
				return (d + '.'+'0'.repeat(pow))
			}
		}
	}

	static getJoint (x,y) {
		return `M${x} ${y} l2 2 -4 -4 2 2 2 -2 -4 4`
	}

	static uuid() {
		let d = new Date().getTime();
		if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
			d += performance.now(); // Add high-precision timestamp if available
		}

		// Use a version-4 UUID, which has 122 bits of randomness
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}

	static getLargeArcFlag(currentX, currentY, x, y, i, j, is_ccw) {
		const cp = {
			x: currentX + i,
			y: currentY + j
		};
		const sp = {
			x: currentX,
			y: currentY
		};
		const ep = { x, y };

		let sang = Math.atan2(sp.y - cp.y, sp.x - cp.x);
		let eang = Math.atan2(ep.y - cp.y, ep.x - cp.x);

		if (!is_ccw) {
			while (sang < eang) {
				sang += 2 * Math.PI;
			}

			if (sp.x === ep.x && sp.y === ep.y) {
				eang += 2 * Math.PI;
			}
		} else {
			while (sang > eang) {
				eang += 2 * Math.PI;
			}

			if (sp.x === ep.x && sp.y === ep.y) {
				sang += 2 * Math.PI;
			}
		}
		return (eang * 180) / Math.PI - (sang * 180) / Math.PI <= 180 ? 0 : 1;
	}

	static transformContour (path, id, val, params, t=false) {
        let {x, y, width, height, angle, proportion} = params
		if (!t) {
            t = {
                scaleX: 1,
                scaleY: 1,
                translateX: 0,
                translateY: 0,
                rotate:{angle:0, x:0, y:0},
                update: false,
                element:false
            }      
            
            //const isProportionChecked = document.getElementById('proportion').checked;
            //const proportionX = +document.getElementById('proportionX').value / 100
            //const proportionY = +document.getElementById('proportionY').value / 100
            if (id === "contourPointXvalue") {
                t.translateX = val - x;
            } else if (id === "contourPointYvalue") {
                t.translateY = val - y;
            } else if (id === "contourWidthValue") {
                t.scaleX = val / width
                t.translateX = x - x * t.scaleX
                if (proportion) {
                    t.scaleY = t.scaleX * 1//(proportionY / proportionX)
                    t.translateY = y - y * t.scaleY
                }
            } else if (id === "contourHeightValue") {
                t.scaleY = val / height
                t.translateY = y - y * t.scaleY;
                if (proportion) {
                    t.scaleX = t.scaleY * 1//(proportionX / proportionY)
                    t.translateX = x - x * t.scaleX
                }
            } else if (id === "contourRotateValue") {
                if (angle) t.rotate={angle: angle, x:x, y:y}     
            }
        }
      /*   if (!t.element) {
            t.element = document.querySelector('.selectedContour');
        } */

/*         if (document.querySelector('#transformAll').checked  && $(t.element).hasClass('outer') ) {
            document.querySelectorAll(".contour[data-cid]").forEach((element)=>{
                this.applyTransform(t.scaleX, t.scaleY, t.translateX, t.translateY, t.rotate, t.update, element)
            })
        } else {
            this.applyTransform(t.scaleX, t.scaleY, t.translateX, t.translateY, t.rotate, t.update, t.element)
        } */

		let newPath = this.applyTransform(path,t.scaleX, t.scaleY, t.translateX, t.translateY, t.rotate, t.update, t.element)
		return newPath
        
    }

    static applyTransform(path, scaleX, scaleY, translateX, translateY, rotate={angle: 0, x:0, y:0}, update = true, element =false, updatePanels=true) {
        //console.log(arguments)
        //const mybigPathBBox = SVGPathCommander.getPathBBox(path);
        //const mybigPathBBox = text.fakeBox(path);
        //$('#inletModeSet').trigger('click')
        var transformed = svgPath(path)
            .scale(scaleX, scaleY)
            .translate(translateX, translateY)
            .rotate(rotate.angle, rotate.x /*+ mybigPathBBox.width * 0.5*/, rotate.y /*+ mybigPathBBox.height * 0.5*/)
            .toString();
        
		return transformed
     
    }

	static 	pathToPolyline(path, segments = 1) {
		let points = [] 
		let contourPath = SVGPathCommander.normalizePath(path);
		let PX, PY, SX, SY;

		contourPath.forEach((seg, i)=>{
			if (seg.includes('M')) {
				SX=seg[1]
				SY=seg[2]
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
				let fakePath = "M"+PX+" "+PY+' '+seg.join(' ')
				const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
				pathElement.setAttribute("d", fakePath);
				const totalLength = Math.round(pathElement.getTotalLength() / segments);
				for (let i = 0; i < totalLength; i++) {
					let point = pathElement.getPointAtLength(i * segments);
					if (i == totalLength - segments) {
						point = pathElement.getPointAtLength( pathElement.getTotalLength() );
					}
					const { x, y } = point;
					points.push(`${x},${y}`);
				}
				PX=seg[6]
				PY=seg[7]   
			}  else if (seg.includes('z') || seg.includes('Z')) {
				PX=SX
				PY=SY   				
			} 
			points.push(`${PX},${PY}`);
		})
		return points.join(";");
	}

	static intersects(edge1, edge, asSegment=true) {
		const a = edge1[0];
		const b = edge1[1];
		const e = edge[0];
		const f = edge[1]
		const a1 = (b.y - a.y);
		const a2 = (f.y - e.y);
		const b1 = (a.x - b.x);
		const b2 = (e.x - f.x);
		const denom = ((a1 * b2) - (a2 * b1));	   
		if (denom === 0) {
			return null;
		}
		const c1 = ((b.x * a.y) - (a.x * b.y));
		const c2 = ((f.x * e.y) - (e.x * f.y));
		
		let point={}
		point.x = ((b1 * c2) - (b2 * c1)) / denom;
		point.y = ((a2 * c1) - (a1 * c2)) / denom;

		if (asSegment) {
			const uc = ((f.y - e.y) * (b.x - a.x) - (f.x - e.x) * (b.y - a.y));
			const ua = (((f.x - e.x) * (a.y - e.y)) - (f.y - e.y) * (a.x - e.x)) / uc;
			const ub = (((b.x - a.x) * (a.y - e.y)) - ((b.y - a.y) * (a.x - e.x))) / uc;

			if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
				return point;
			} else {
				return null;
			}
		}	
		return point;
	}

	static 	getPerpendicularCoordinates(arcParams, length) {
		const { clockwise, cx, cy, deltaAngle, endAngle, phi, rx, ry, startAngle } = arcParams;
	
		// Calculate coordinates of the point on the ellipse at startAngle
		const x0 = cx + rx * Math.cos(startAngle) * Math.cos(phi) - ry * Math.sin(startAngle) * Math.sin(phi);
		const y0 = cy + rx * Math.cos(startAngle) * Math.sin(phi) + ry * Math.sin(startAngle) * Math.cos(phi);
	
		// Calculate derivatives at startAngle
		const xPrime = -rx * Math.sin(startAngle) * Math.cos(phi) - ry * Math.cos(startAngle) * Math.sin(phi);
		const yPrime = -rx * Math.sin(startAngle) * Math.sin(phi) + ry * Math.cos(startAngle) * Math.cos(phi);
	
		// Slope of the tangent
		const m = yPrime / xPrime;
	
		// Slope of the perpendicular
		const mPerp = -1 / m;
	
		// Calculate coordinates of the end points of the perpendicular line
		const dx = length / Math.sqrt(1 + mPerp * mPerp);
		const dy = mPerp * dx;
	
		const x1 = x0 + dx;
		const y1 = y0 + dy;
		const x2 = x0 - dx;
		const y2 = y0 - dy;

		//this.showPoint( { x: x1, y: y1 },{ x: x2, y: y2 })

		return {
			point1: { x: x1, y: y1 },
			point2: { x: x2, y: y2 }
		};
	}

	static 	arraysAreEqual(arr1, arr2) {
		if (arr1.length !== arr2.length) {
		   return false;
	   }
		for (let i = 0; i < arr1.length; i++) {
		   if (arr1[i] !== arr2[i]) {
			   return false;
		   }
	   }
		return true;
   }

	static svgArcToCenterParam(x1, y1, rx, ry, degree, fA, fS, x2, y2, centers=false) {
		var cx, cy, startAngle, deltaAngle, endAngle, outputObj;
		var PIx2 = Math.PI * 2.0;
		var phi = degree * Math.PI / 180;

		if (rx < 0) {
			rx = -rx;
		}
		if (ry < 0) {
			ry = -ry;
		}
		if (rx == 0.0 || ry == 0.0) { // invalid arguments
			return false
			throw Error('rx and ry can not be 0');
		}

		// SVG use degrees, if your input is degree from svg,
		// you should convert degree to radian as following line.
		// phi = phi * Math.PI / 180;
		var s_phi = Math.sin(phi);
		var c_phi = Math.cos(phi);
		var hd_x = (x1 - x2) / 2.0; // half diff of x
		var hd_y = (y1 - y2) / 2.0; // half diff of y
		var hs_x = (x1 + x2) / 2.0; // half sum of x
		var hs_y = (y1 + y2) / 2.0; // half sum of y

		// F6.5.1
		var x1_ = c_phi * hd_x + s_phi * hd_y;
		var y1_ = c_phi * hd_y - s_phi * hd_x;

		// F.6.6 Correction of out-of-range radii
		//   Step 3: Ensure radii are large enough
		var lambda = (x1_ * x1_) / (rx * rx) + (y1_ * y1_) / (ry * ry);
		if (lambda > 1) {
			rx = rx * Math.sqrt(lambda);
			ry = ry * Math.sqrt(lambda);
		}

		var rxry = rx * ry;
		var rxy1_ = rx * y1_;
		var ryx1_ = ry * x1_;
		var sum_of_sq = rxy1_ * rxy1_ + ryx1_ * ryx1_; // sum of square
		if (!sum_of_sq) {
			return false
			throw Error('start point can not be same as end point');
		}
		var coe = Math.sqrt(Math.abs((rxry * rxry - sum_of_sq) / sum_of_sq));
		if (fA == fS) { coe = -coe; }

		// F6.5.2
		var cx_ = coe * rxy1_ / ry;
		var cy_ = -coe * ryx1_ / rx;

		// F6.5.3
		cx = c_phi * cx_ - s_phi * cy_ + hs_x;
		cy = s_phi * cx_ + c_phi * cy_ + hs_y;

		if (!centers) {

			var xcr1 = (x1_ - cx_) / rx;
			var xcr2 = (x1_ + cx_) / rx;
			var ycr1 = (y1_ - cy_) / ry;
			var ycr2 = (y1_ + cy_) / ry;

			// F6.5.5
			startAngle = this.radian(1.0, 0.0, xcr1, ycr1);

			// F6.5.6
			deltaAngle = this.radian(xcr1, ycr1, -xcr2, -ycr2);
			while (deltaAngle > PIx2) { deltaAngle -= PIx2; }
			while (deltaAngle < 0.0) { deltaAngle += PIx2; }
			if (fS == false || fS == 0) { deltaAngle -= PIx2; }
			endAngle = startAngle + deltaAngle;
			while (endAngle > PIx2) { endAngle -= PIx2; }
			while (endAngle < 0.0) { endAngle += PIx2; }

			outputObj = {   
				cx: cx,
				cy: cy,
				rx: rx,
				ry: ry,
				phi: phi,
				startAngle: startAngle,
				deltaAngle: deltaAngle,
				endAngle: endAngle,
				clockwise: (fS == true || fS == 1),
				i:cx - x1,
				j:y1 - cy,
			}
		}

		if (centers) {
			outputObj= { x: cx, y: cy }
		}
		return outputObj;
	}

	static leBetwenContourAndInlet ( path, contourPath, inlet=true) {
		let  A, MX, MY, LX, LY,  PX, PY;
		if(inlet){
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
		
			contourPath.forEach((seg, i, arr)=>{
				if (i < 2){
					if (seg.includes('M')) {
						PX=seg[1]
						PY=seg[2]
					} else if ( seg.includes('L')) {
						PX=seg[1]
						PY=seg[2]    
					} else if (seg.includes('V')) {
						PY=seg[1]//-1
					 } else if (seg.includes('H')) {
						PX=seg[1]//-1
					} else if (seg.includes('A')) {
						PX=seg[6]
						PY=seg[7]
					}
				}
			})
			
			A = this.calculateAngleVector ( LX, LY, MX, MY, PX, PY)
			return A
		} else {
			if(!path.hasOwnProperty('segments')){
				path =  SVGPathCommander.normalizePath(path)
			}
            if (path.length) {
                path.forEach((seg,i)=>{
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

			if(!contourPath.hasOwnProperty('segments')){
				contourPath =  SVGPathCommander.normalizePath(contourPath)
			}

            contourPath.forEach((seg, i)=>{
                if (i < contourPath.length-1){
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
            A = this.calculateAngleVector ( MX, MY,  LX, LY, PX, PY)
			return A			
		}
	}

	static 	calculateAngleVector(x, y, x1, y1, x2, y2) {
		// Calculate vectors
		const vector1 = { x: x1 - x, y: y1 - y };
		const vector2 = { x: x2 - x, y: y2 - y };
	
		// Calculate dot product
		const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
	
		// Calculate magnitudes
		const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
		const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
	
		// Check if magnitudes are non-zero to avoid division by zero
		if (magnitude1 === 0 || magnitude2 === 0) {
			return NaN; // Angle is undefined if either vector has zero length
		}
	
		// Calculate cosine of the angle
		const cosTheta = dotProduct / (magnitude1 * magnitude2);
	
		// Clamp the value of cosTheta to the range [-1, 1] to avoid NaN from Math.acos
		const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta));
	
		// Calculate angle in radians
		let angleRad = Math.acos(clampedCosTheta);
	
		// Convert angle from radians to degrees
		let angleDeg = angleRad * (180 / Math.PI);
	
		return angleDeg;
	}

	static 	detectInletLength (contourCommand, nearestSegment, endPoint, contourType) {
		return 6
		if (contourType === 'outer') return 6// VALUES.defaultInletLenght
		//console.log (JSON.stringify(arguments))
		const commandType = nearestSegment[0]
		let contourOnSheet =document.querySelector(".selectedContour").getBBox()
		let maxLength = contourOnSheet.width+ contourOnSheet.height

            let centers, x1, y1;              
			let ballsCutter = []
            switch (commandType) {       
                
                case 'L':
                    x1=nearestSegment[1]
                    y1=nearestSegment[2]
                    ballsCutter = this.findPerpendicularPoints( endPoint.x,endPoint.y, x1, y1, maxLength)
					
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
                        if ( this.arraysAreEqual(seg, nearestSegment)) {
                            if (contourCommand[i - 1] && contourCommand[i - 1][0] === 'A') {
                                CX = contourCommand[i - 1][6];
                                CY = contourCommand[i - 1][7];
                            } else if (contourCommand[i - 1] && contourCommand[i - 1][0] === 'L') {
                                CX = contourCommand[i - 1][1];
                                CY = contourCommand[i - 1][2];
                            }
                        }
                    }          
                    centers = this.svgArcToCenterParam (CX, CY, rx, ry, flag1, flag2, flag3, EX, EY, true) 
                    ballsCutter.push( this.findPointWithSameDirection( endPoint.x, endPoint.y, centers.x, centers.y, maxLength ))
                    ballsCutter.push( this.findPointWithSameDirection(centers.x, centers.y, endPoint.x, endPoint.y, maxLength )) 
                break;
             } 

		//console.log (ballsCutter)
		let contourPoints=this.pathToPolyline( contourCommand.join(" ").replaceAll(',', ' '), 1).split(';').map ( a => a.split(',').map( aa => Number(aa)));
		let x =  ballsCutter[0].x
		let xx = ballsCutter[1].x
		let y =  ballsCutter[0].y
		let yy = ballsCutter[1].y
		let intersections=[]
		let minLenght=maxLength;

		for (let ind = 1; ind < contourPoints.length-2; ind++) {
			let cx =  contourPoints[ind][0]
			let cxx = contourPoints[ind+1][0]
			let cy =  contourPoints[ind][1]
			let cyy = contourPoints[ind+1][1]

			let intersection = this.intersects ([{x:cx,y:cy},{x:cxx,y:cyy}],[{x:x,y:y},{x:xx,y:yy}])
			if (intersection) {
				let dist = this.distance(intersection, endPoint)
				if (Math.round(dist) > 0 && Math.round(dist) < minLenght) {
					minLenght=Math.round(dist)
				}				
			}	
		}
		//console.log (minLenght)
		if (minLenght-2 > 6 /*VALUES.defaultInletLenght*/) {
			return 6//VALUES.defaultInletLenght	
		}
		return minLenght*0.5
	}

	static findPointWithSameDirection(x, y, x1, y1, L) {
		// Вычисляем вектор направления отрезка
		let directionVector = { x: x1 - x, y: y1 - y };
	
		// Находим длину вектора направления
		let length = Math.sqrt(directionVector.x * directionVector.x + directionVector.y * directionVector.y);
	
		// Нормализуем вектор направления
		let normalizedDirection = { x: directionVector.x / length, y: directionVector.y / length };
	
		// Вычисляем координаты точки на расстоянии L в направлении вектора
		let pointX = x + normalizedDirection.x * L;
		let pointY = y + normalizedDirection.y * L;
	
		return { x: pointX, y: pointY };
	}

	static angleBetweenPoints (x1, y1, x2, y2) {
		const delta_x = x2 - x1;
		const delta_y = y2 - y1;
		const angle_AB = Math.atan2(delta_y, delta_x);
		let angle_degrees_AB = angle_AB * 180 / Math.PI;
		angle_degrees_AB = (angle_degrees_AB + 360) % 360
		return angle_degrees_AB
	}

	static 	findTangentPoints(circleCenterX, circleCenterY, radius, pointX, pointY) {
		// Расчет расстояния между центром окружности и точкой
		var distance = Math.sqrt(Math.pow(pointX - circleCenterX, 2) + Math.pow(pointY - circleCenterY, 2));
		
		// Если расстояние больше радиуса, то точка находится вне окружности и касательных не существует
		if (distance < radius) {
			return null;
		}
		
		// Находим угол между центром окружности и точкой
		var angle = Math.atan2(pointY - circleCenterY, pointX - circleCenterX);
		
		// Находим углы касательных линий с учетом радиуса окружности и расстояния до точки
		var tangentAngle = Math.acos(radius / distance);
		
		// Координаты точек касания касательных линий
		var tangentPoint1X = circleCenterX + radius * Math.cos(angle + tangentAngle);
		var tangentPoint1Y = circleCenterY + radius * Math.sin(angle + tangentAngle);
		var tangentPoint2X = circleCenterX + radius * Math.cos(angle - tangentAngle);
		var tangentPoint2Y = circleCenterY + radius * Math.sin(angle - tangentAngle);
		
		// Возвращаем координаты точек касания
		return [{x: tangentPoint1X, y: tangentPoint1Y}, {x: tangentPoint2X, y: tangentPoint2Y}];
	}

	static arcLength (svgArc) {

		let radius, x1, y1, x2, y2, flag1, flag2, flag3;
		let pathArc  = SVGPathCommander.normalizePath (svgArc)
		if (pathArc.length) {
			pathArc.forEach( seg=>{
				if ( seg.includes('A')) {
					radius=seg[1]
					x2=seg[6]
					y2=seg[7]
					flag1=seg[3]
                    flag2=seg[4]
                    flag3=seg[5]
				}
				if ( seg.includes('M')) {
					x1=seg[1]
					y1=seg[2]
				}

				if ( seg.includes('L')) {
					x1=seg[1]
					y1=seg[2]
				}
			}) 
		}
 	
	 	const chordLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
		const theta = 2 * Math.asin(Math.round( (chordLength / (2 * radius)) * 10**5) /10**5);
		inlet.theta = theta
		let arcLength = radius * theta;
		if (flag2 === 1 ) arcLength = 2*radius*Math.PI - arcLength
		return +arcLength;
	}

	static rotatePoint(MX, MY, LX, LY, oldAxis, newAxis) {
		// Step 1: Find the difference between the new and old axes
		const angleDifference = newAxis - oldAxis;
	
		// Step 2: Convert the difference to radians
		const angleRadians = angleDifference * (Math.PI / 180);
	
		// Step 3: Find the coordinates of the vector from LX, LY to MX, MY
		const dx = MX - LX;
		const dy = MY - LY;
	
		// Step 4: Rotate the vector
		const newX = LX + dx * Math.cos(angleRadians) - dy * Math.sin(angleRadians);
		const newY = LY + dx * Math.sin(angleRadians) + dy * Math.cos(angleRadians);
	
		// Return the new coordinates of the point
		return { x:newX, y:newY };
	}

	static 	getNewEndPoint(MX, MY, LX, LY, newLength) {
		// Step 1: Calculate the vector of the line segment
		const dx = LX - MX;
		const dy = LY - MY;
		const originalLength = Math.sqrt(dx ** 2 + dy ** 2);
	
		// Step 2: Normalize the direction of the original segment
  
		// Step 3: Scale the normalized direction by the new length
		const newEndPointX = LX - dx * newLength/originalLength;
		const newEndPointY = LY - dy * newLength/originalLength;
	
		// Step 4: Return the coordinates of the new end point
		return { x: newEndPointX, y: newEndPointY };
	}

	static 	calculateEndPoint(centerX, centerY, radius, startX, startY, arcLength, flag3) {
		// Step 1: Calculate the initial angle of the arc
		let endX, endY;
		const startAngle = Math.atan2(startY - centerY, startX - centerX);
	
		// Step 2: Calculate the angular distance based on arc length and radius
		//const angularDistance = arcLength / radius;
		const angularDistance = arcLength / radius;
	
		if (flag3 === 0) {
			// Step 3: Calculate the angle of the end point
			const endAngle = startAngle + angularDistance;
		
			// Step 4: Calculate the coordinates of the end point
			endX = centerX + radius * Math.cos(endAngle);
			endY = centerY + radius * Math.sin(endAngle);
		} else {
			// Step 3: Calculate the angle of the end point (counter-clockwise)
			const endAngle = startAngle - angularDistance; // Subtract angular distance for counter-clockwise direction
			// Step 4: Calculate the coordinates of the end point
			endX = centerX + radius * Math.cos(endAngle);
			endY = centerY + radius * Math.sin(endAngle);
		}
		// Return the coordinates of the end point
		return { x: endX, y: endY };
	}	

	static angleBetwenContourAndInlet ( path, contourPath, inlet=true) {
		let  A, MX, MY, LX, LY,  PX, PY;
		if(inlet){
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
		
			contourPath.forEach((seg, i, arr)=>{
				if (i < 2){
					if (seg.includes('M')) {
						PX=seg[1]
						PY=seg[2]
					} else if ( seg.includes('L')) {
						PX=seg[1]
						PY=seg[2]    
					} else if (seg.includes('V')) {
						PY=seg[1]//-1
					 } else if (seg.includes('H')) {
						PX=seg[1]//-1
					} else if (seg.includes('A')) {
						PX=seg[6]
						PY=seg[7]
					}
				}
			})
			
			A = this.calculateAngleVector ( LX, LY, MX, MY, PX, PY)
			return A
		} else {
			if(!path.hasOwnProperty('segments')){
				path =  SVGPathCommander.normalizePath(path)
			}
            if (path.length) {
                path.forEach((seg,i)=>{
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

			if(!contourPath.hasOwnProperty('segments')){
				contourPath =  SVGPathCommander.normalizePath(contourPath)
			}

            contourPath.forEach((seg, i)=>{
                if (i < contourPath.length-1){
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
            A = this.calculateAngleVector ( MX, MY,  LX, LY, PX, PY)
			return A			
		}
	}

	static findPerpendicularPoints(x, y, x1, y1, L) {
		//return [point1, point2];
	   let dx = x1-x
	   let dy = y1-y
	   //Длина
	   let len = Math.sqrt(dx*dx+dy*dy)
	   //Нормализованный вектор (единичной длины)
	   let udx = dx / len
	   let udy = dy / len
	   //Перпендикулярный единичный вектор
	   let nx = - udy
	   let ny =  udx
	   //Точки (C, D) на перпендикуляре на расстоянии R
	   return [{x:x + nx * L, y: y + ny * L}, {x:x - nx * L, y:y - ny * L}]
   }

}

export default Util;
