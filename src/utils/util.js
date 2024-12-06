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
	
	static multiplyMatrices(matrixA, matrixB) {

		if (!Array.isArray(matrixA) && !Array.isArray(matrixB)) {
			matrixA = [
				[matrixA.a, matrixA.c, matrixA.e],
				[matrixA.b, matrixA.d, matrixA.f],
				[0, 0, 1],
			];
			matrixB = [
				[matrixB.a, matrixB.c, matrixB.e],
				[matrixB.b, matrixB.d, matrixB.f],
				[0, 0, 1],
			];
		}

		let aNumRows = matrixA.length;
		let aNumCols = matrixA[0].length;
		//let bNumRows = matrixB.length;
		let bNumCols = matrixB[0].length;
		let newMatrix = new Array(aNumRows);

		for (let r = 0; r < aNumRows; ++r) {
			newMatrix[r] = new Array(bNumCols);

			for (let c = 0; c < bNumCols; ++c) {
				newMatrix[r][c] = 0;

				for (let i = 0; i < aNumCols; ++i) {
					newMatrix[r][c] += matrixA[r][i] * matrixB[i][c];
				}
			}
		}
		return {
			a: newMatrix[0][0],
			b: newMatrix[1][0],
			c: newMatrix[0][1],
			d: newMatrix[1][1],
			e: newMatrix[0][2],
			f: newMatrix[1][2]
		};
	}

	// Utility method 2
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
}

export default Util;
