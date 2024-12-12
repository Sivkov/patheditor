import axios from 'axios';
import Util from '../utils/util';

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
        width: 150,
        height:150
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

    static async  simpleReturn() {
        Part.setSvgParams({width:189, height:200})
		const url = new URL('http://127.0.0.1/parteditor.html?filename=700x700-10.0-DD11-N0.ncp&handle=0&part=part_6');
        const searchParams = url.searchParams;
        //let file = searchParams.get('filename').replace(".ncp", "")
        //let part = searchParams.get('part')
        let pNumber = Number(searchParams.get('part').replace('part_', ''))
        let handle = +searchParams.get('handle')
		const assvg = await Part.getPartCode(0, 6);
		
       
        return (
          <>
            <g
              data-cid="1"
              className="contour outer macro0 closed1 noOutlet"
            >
              <path d="M6,74.356 H0 V125.689 H12 V150.286 H0 V187.286 H12 V200 H177 V187.286 H189 V150.286 H177 V125.689 H189 V74.356 H177 V54.678 H189 V19.678 H177 V0 H12 V19.678 H0 V54.678 H12 V74.356 H6 "></path>
            </g>
          </>
        );
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
			return Part.ncpToSvg ( response.data )
        } catch (error) {
            console.error("Ошибка при получении данных: ", error);
            return null;
        }
    }

    static add(create=false) {
    }
    
    static ncpToSvg(ncpCode) {
        let svg = []
        const ncpLines = ncpCode.code
        let currentX, currentY
        let path = 'closed'
        let mode = ''
        let cid;
        let jointContainerOpen = false;
        for (const line of ncpLines) {
            if (line.includes('(<Part id="')) {
                Part.width = +Util.getAttributeValue(line, 'originx')
                Part.height = +Util.getAttributeValue(line, 'originy')
				Part.setSvgParams({width: Part.width, height: Part.height})                                
            } else if (line.includes('(<Inlet')) {
                let x = Util.getValueFromString(line, 'x')
                let y = Util.getValueFromString(line, 'y')
                cid = Util.getAttributeValue(line, 'contour_id')
                let innerOuter = Util.getAttributeValue(line, 'mode')
                let macroValue = +Util.getAttributeValue(line, 'macro')
                let pulseValue = +Util.getAttributeValue(line, 'pulse')
                let piercingMode = 'dotRed'
                if (pulseValue === 0) {
                    piercingMode = 'dotRed'
                } else if (pulseValue === 1) {
                    piercingMode = 'dotPink'
                } else if (pulseValue === -1) {
                    piercingMode = 'dotYellow'
                }

                let inlet=  
                    {
                        cid:cid,
                        class:`inlet ${innerOuter} ${'macro' + macroValue}`,
                        path:'',
                        stroke:'red',
                        strokeWidth:0.2,
                        piercingMode:piercingMode
                    }
                svg.push(inlet)                
                
                currentX = x
                currentY = y
                mode = 'inlet'
                path = 'open'

            } else if (line.includes('(<Outlet')) {
                //svg += `"></path></g>`;
                let x = +Util.getValueFromString(line, 'x')
                let y = +Util.getValueFromString(line, 'y')
                let innerOuter = Util.getAttributeValue(line, 'mode')
                let macroValue = +Util.getAttributeValue(line, 'macro')
                //svg += `<g data-cid="${this.lastContourId}" fill="none" class="outlet ${innerOuter} ${'macro' + macroValue}" stroke="lime" stroke-width="0.2">`

                let outlet=  
                {
                    cid: this.lastContourId,
                    class:`outlet ${innerOuter} ${'macro' + macroValue}`,
                    path:'',
                    stroke:'lime',
                    strokeWidth:0.2,
                    piercingMode: null
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
                cid = Util.getAttributeValue(line, 'contour_id')
                let macroValue = +Util.getAttributeValue(line, 'macro')
                let innerOuter = Util.getAttributeValue(line, 'mode')
                let openClosed = +Util.getAttributeValue(line, 'closed')
                this.lastContourId = +cid
              
                let contour = 
                {
                    cid: cid,
                    class:`contour ${innerOuter} ${'macro' + macroValue} ${'closed' + openClosed}`,
                    path:'',
                    stroke:'red',
                    strokeWidth:0.2,
                    piercingMode: null
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
                    let x = Util.getValueFromString(line, 'x')
                    let y = Util.getValueFromString(line, 'y')
                    if (x == null) x = currentX;
                    if (y == null) y = currentY;
                    svg[svg.length-1]['path']+= `M${Util.round(x)},${Util.round(Part.height - y)} `;
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
                    let x = Util.getValueFromString(line, 'x')
                    let y = Util.getValueFromString(line, 'y')
                    if (x == null) x = currentX;
                    if (y == null) y = currentY;

                    if (path !== 'continued') {
                        svg[svg.length-1]['path']+= `M${Util.round(x)},${Util.round(Part.height - y)} `;
                    } else {
                        svg[svg.length-1]['path']+= `L${Util.round(x)},${Util.round(Part.height - y)} `;
                    }
                    currentX = x
                    currentY = y

                } else if (xMatch) {
                    // If only x is matched, add an SVG 'H' command
                    let x = Util.getValueFromString(line, 'x');
                    svg[svg.length-1]['path']+= `H${Util.round(x)} `;
                    currentX = x
                } else if (yMatch) {
                    // If only y is matched, add an SVG 'V' command
                    let y = Util.getValueFromString(line, 'y');
                    svg[svg.length-1]['path'] += `V${Util.round(Part.height - y)} `;
                    currentY = y
                }
                path = 'continued'

            } else if (line.includes('G2 ')) {
                // Process G2 commands
                if (true) {
                    let x = Util.getValueFromString(line, 'x')
                    let y = Util.getValueFromString(line, 'y')
                    let i = Util.getValueFromString(line, 'i');
                    let j = Util.getValueFromString(line, 'j');

                    if (i == null) i = 0;
                    if (j == null) j = 0;
                    if (x == null) x = currentX;
                    if (y == null) y = currentY;

                    let r = Util.round(Math.sqrt(i ** 2 + j ** 2))
                    let largeArcFlag = Util.getLargeArcFlag(currentX, currentY, x, y, i, j, false);

                    svg[svg.length-1]['path'] += `A${r},${r} 0 ${largeArcFlag} 1 ${Util.round(x)},${Util.round(Part.height - y)} `;
                    currentX = x;
                    currentY = y;
                }
            } else if (line.includes('G3 ')) {
                // Process G3 commands
                if (true) {
                    let x = Util.getValueFromString(line, 'x')
                    let y = Util.getValueFromString(line, 'y')
                    let i = Util.getValueFromString(line, 'i');
                    let j = Util.getValueFromString(line, 'j');
                    if (i == null) i = 0;
                    if (j == null) j = 0;
                    if (x == null) x = currentX;
                    if (y == null) y = currentY;

                    let r = Util.round(Math.sqrt(i ** 2 + j ** 2))
                    let largeArcFlag = Util.getLargeArcFlag(currentX, currentY, x, y, i, j, true);
                    svg[svg.length-1]['path']+= `A${r},${r} 0 ${largeArcFlag} 0 ${Util.round(x)},${Util.round(Part.height - y)} `;
                    currentX = x;
                    currentY = y;
                }
            } else if (line.includes('</Contour')) {
                path = 'closed'
                jointContainerOpen = false

            } else if (line.includes('(<Joint')){
                /*let x = +Util.getAttributeValue(line, 'x')
                let y = +Util.getAttributeValue(line, 'y')
                let dp = +Util.getAttributeValue(line, 'dp');
                let length = +Util.getAttributeValue(line, 'length');
                let path =  Util.getJoint(x,y)
                let uuid = Util.uuid()
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
		return svg//{width: Part.width, height: Part.height,code:svg}        
    }
} 
export default Part;