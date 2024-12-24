import svgPath from "svgpath";
import SVGPathCommander from "svg-path-commander";

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

	static distance(point1, point2) {
		const dx = point1.x - point2.x;
		const dy = point1.y - point2.y;
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

	static transformContour (path, id, val, contourPointXvalue ,contourPointYvalue, contourIntendsWidth, contourIntendsHeight, t=false) {
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
            
            const isProportionChecked = document.getElementById('proportion').checked;
            const proportionX = +document.getElementById('proportionX').value / 100
            const proportionY = +document.getElementById('proportionY').value / 100
            if (id === "contourPointXvalue") {
                t.translateX = val - contourPointXvalue;
            } else if (id === "contourPointYvalue") {
                t.translateY = val - contourPointYvalue;
            } else if (id === "contourWidthValue") {
                t.scaleX = val / contourIntendsWidth
                t.translateX = contourPointXvalue - contourPointXvalue * t.scaleX
                if (isProportionChecked) {
                    t.scaleY = t.scaleX * (proportionY / proportionX)
                    t.translateY = contourPointYvalue - contourPointYvalue * t.scaleY
                }
            } else if (id === "contourHeightValue") {
                t.scaleY = val / contourIntendsHeight
                t.translateY = contourPointYvalue - contourPointYvalue * t.scaleY;
                if (isProportionChecked) {
                    t.scaleX = t.scaleY * (proportionX / proportionY)
                    t.translateX = contourPointXvalue - contourPointXvalue * t.scaleX
                }
            } else if (id === "contourRotateValue") {
                let angle = +(document.getElementById(id).innerHTML)
                if (angle) t.rotate={angle: angle, x:contourPointXvalue, y:contourPointYvalue}     
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
}

export default Util;
