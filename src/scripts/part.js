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
            //return null;
            return Part.ncpToSvg ()
        }
    }

    static add(create=false) {
    }
    
    static ncpToSvg(ncpCode) {
        let svg = []
        //const ncpLines = ncpCode.code

        const ncpLines = [
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
            ,`(</Part id="6" part_id="6">)`]
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
                        cid:+cid,
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
                    cid: +this.lastContourId,
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
                    cid: +cid,
                    class:`contour ${innerOuter} ${'macro' + macroValue} ${'closed' + openClosed}`,
                    path:'',
                    stroke:'red',
                    strokeWidth:0.2,
                    piercingMode: null,
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
                    let x = Util.getValueFromString(line, 'x')
                    let y = Util.getValueFromString(line, 'y')
                    if (x == null) x = currentX;
                    if (y == null) y = currentY;
                    svg[svg.length-1]['path']+= `M${Util.round(x)} ${Util.round(Part.height - y)} `;
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
                        svg[svg.length-1]['path']+= `M${Util.round(x)} ${Util.round(Part.height - y)} `;
                    } else {
                        svg[svg.length-1]['path']+= `L${Util.round(x)} ${Util.round(Part.height - y)} `;
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

                    svg[svg.length-1]['path'] += `A${r} ${r} 0 ${largeArcFlag} 1 ${Util.round(x)} ${Util.round(Part.height - y)} `;
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
                    svg[svg.length-1]['path']+= `A${r} ${r} 0 ${largeArcFlag} 0 ${Util.round(x)} ${Util.round(Part.height - y)} `;
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
		return {width: Part.width, height: Part.height,code:svg}        
    }

    static detectElementType (classes) {
        let  contourTypes = ['engraving', 'inner', 'outer']
        for (let t in contourTypes) {
            if (classes.includes(contourTypes[t])){
                return contourTypes[t]
            } 
        }
        return ''
    }    
} 
export default Part;