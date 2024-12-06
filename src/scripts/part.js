import axios from 'axios';

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

    static updateRect() {
        var rect = document.querySelector('#wrapper_svg').getBoundingClientRect();   
        var svg = document.querySelector('#svg')     
        var point = svg.createSVGPoint();
        point.y = rect.top;
        point.x = rect.left;
        let top = point.matrixTransform(document.querySelector('#group').getScreenCTM().inverse());

        var point1 = svg.createSVGPoint();
        point1.y = rect.bottom;
        point1.x = rect.right;
        let bottom = point1.matrixTransform(document.querySelector('#group').getScreenCTM().inverse());
 

        let width =  bottom.x  - top.x
        let height =  bottom.y - top.y
        let rect1 = document.querySelector('#dimensionalGrid')
        rect1.setAttribute('x', top.x)
        rect1.setAttribute('y', top.y)
        rect1.setAttribute('width', width)
        rect1.setAttribute('height', height)
    }

    static simpleReturn() {
        console.log('simpleReturn__simpleReturn__simpleReturn')
        return (
          <>
            <g
              data-cid="6"
              className="contour outer macro0 closed1 noOutlet"
            >
              <path d="M6,74.356 H0 V125.689 H12 V150.286 H0 V187.286 H12 V200 H177 V187.286 H189 V150.286 H177 V125.689 H189 V74.356 H177 V54.678 H189 V19.678 H177 V0 H12 V19.678 H0 V54.678 H12 V74.356 H6 "></path>
            </g>
            <g
              data-cid="6"
              fill="none"
              className="inlet outer macro1"
              stroke="red"
              strokeWidth="0.2"
            >
              <path
                markerStart="url(#dotRed)"
                d="M6,66.356 L7.885618,71.689333 A2,2 0 0 1 6,74.356 "
              ></path>
            </g>
            <g
              data-cid="6"
              fill="none"
              className="outlet inner macro0 noOutlet"
              stroke="lime"
              strokeWidth="0.2"
              type="Straight"
            >
              <path d="M 6 74.356"></path>
            </g>
          </>
        );
      }
      
    static normalizeIntends () {
 /*        let int = {x:Infinity,y:Infinity}
        let cid= $('.outer.contour').data('cid')
        let selectors = [".outer.outlet", ".outer.contour", ".outer.inlet"]
        selectors.forEach((selector)=>{
            try{
                let eBox = $(selector)[0].getBBox()
                if (eBox) {
                    if (eBox) {
                        if ( (eBox.x) < (int.x) ){
                            int.x = eBox.x
                        }
    
                        if ( (eBox.y) < (int.y) ){
                            int.y = eBox.y
                        }
                    }
                }
            } catch (e) {}
        })

        if (int.x !== 0 || int.y!== 0) {
            // проверить чек бокс на трансформацию всех. 
            if (!document.querySelector('#transformAll').checked) {
                document.querySelectorAll(`.contour[data-cid]`).forEach((element)=>{
                    this.transformContour(false, false, {scaleX:1, scaleY:1, translateX:-int.x, translateY:-int.y, rotate:{angle: 0, x:0, y:0},'update': false, element: element})
                })  
            } else {
                document.querySelectorAll(`.contour.outer[data-cid]`).forEach((element)=>{
                    this.transformContour(false, false, {scaleX:1, scaleY:1, translateX:-int.x, translateY:-int.y, rotate:{angle: 0, x:0, y:0},'update': false, element: element})
                })
            }    
        }

        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        
        selectors.forEach(selector => {
            try {
                const bbox = $(selector)[0].getBBox();        
                minX = Math.min(minX, bbox.x);
                minY = Math.min(minY, bbox.y);
                maxX = Math.max(maxX, bbox.x + bbox.width);
                maxY = Math.max(maxY, bbox.y + bbox.height);

            } catch (e) {}
          
        });
        
        const width = maxX - minX;
        const height = maxY - minY;
  
        part.width = width
        part.height = height

        part.updateRect()
        part.createContourIntendPanel()        
        part.updateContourIntendPanel()
        part.updateContourInfo()
        part.updateTransformPanel()
        log.add( __("Update canvas")) */

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

    static loadFileJson() {
        const url = new URL('http://127.0.0.1/parteditor.html?filename=700x700-10.0-DD11-N0.ncp&handle=0&part=part_6');
        const searchParams = url.searchParams;
        let file = searchParams.get('filename').replace(".ncp", "")
        let part = searchParams.get('part')
        let pNumber = Number(searchParams.get('part').replace('part_', ''))
        let handle = +searchParams.get('handle')
        Part.getPartCode(handle, pNumber)
        //if (this.handle >= 0) part.primaryPolling();
    }

    static getPartCode(handle=0, number=6) {        
        axios({
            method: "GET",
            url: "http://127.0.0.1/editor/getpart?handle=0&program_no=6",
          })
            .then((response) => {
              // Успешный ответ
              debugger;
              console.log(response.data);
            })
            .catch((error) => {
              // Обработка ошибок
              console.error(error);
            });
          
    }

    static add(create=false) {
    /*  const svg = document.querySelector('#svg');
        const lastContours = svg.querySelectorAll('g.contour');
        const lastContour = lastContours[lastContours.length - 1]

        if (lastContour) {
            svg.insertBefore(lastContour, svg.firstChild);
            //lastContour.setAttribute("fill", "aqua");
            //lastContour.setAttribute("opacity", 0.5);
            lastContour.classList.add('outer');
        }

        const inletElements = [];

        for (let i = 0; i < svg.children.length; i++) {
            const child = svg.children[i];

            if (child.classList.contains('inlet')) {
                inletElements.push(child); // Add to the array
                svg.removeChild(child); // Remove from the SVG
                i--; // Adjust the index to account for the removed element
            }
        }

        inletElements.forEach((inletElement) => {
            svg.appendChild(inletElement);
        });


        util.messaging("Ready to work", false, true)
        let grid = `<defs><pattern class="grid">
        <pattern  id="xsGrid" width="1" height="1" fill="var(--gridColorFill)" patternUnits="userSpaceOnUse" >
            <path  d="M 0 0 1 0 1 1 0 1 0 0" fill="var(--gridColorFill)" stroke="var(--gridColorStroke)" stroke-width="0.05"/>
        </pattern>
        <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect  width="100" height="100" fill="url(#xsGrid)"/>
            <path  d="M 10 0 L 0 0 0 10 10 10 10 0" fill="none" stroke="var(--gridColorStroke)" stroke-width="0.1"/>
        </pattern>
        <pattern  id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect  width="100" height="100" fill="url(#smallGrid)"/>
            <path  d="M 100 0 0 0 0 100 100 100 100 0" fill="none" stroke="var(--gridColorStroke)" stroke-width="0.2"/>
        </pattern>
            </pattern>
            <marker id="dotRed" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5"  markerHeight="5">
                <circle cx="5" cy="5" r="5" fill="red"/>
            </marker>
            <marker id="dotPink" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5"  markerHeight="5">
                <circle cx="5" cy="5" r="5" fill="pink"/>
            </marker>
            <marker id="dotYellow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5"  markerHeight="5">
                <circle cx="5" cy="5" r="5" fill="yellow"/>
            </marker>
            <marker id="smallDotRed" viewBox="0 0 5 5" refX="2.5" refY="2.5" markerWidth="2.5"  markerHeight="2.5">
            <circle cx="2.5" cy="2.5" r="2.5" fill="red"/>
            </marker>
          
      </defs>`
        let rect = `<rect id="dimensionalGrid" height="${part.height}" width="${part.width}" x="0" y="0" fill="url(#grid)" transform-origin="50% 50%" stroke="white" stroke-width="0"></rect>`
        /*let gridLine = `<g id="gridLines" stroke="lime" stroke-width="0.5">
        <!-- Горизонтальная линия -->
        <line id="horizontalLine" x1="0" y1="0" x2="0" y2="0"></line>
        <!-- Вертикальная линия -->
        <line id="verticalLine" x1="0" y1="0" x2="0" y2="0"></line></g>`*/

        
/*         $('#wrapper_svg svg').html(grid + '<g id="group2" stroke-width="0" transform-origin="center" style="touch-action: none;"><g id="group1" transform="translate(0 0)"><g id="group" transform="translate(0 0)"><g id="contours">' + rect + $('#wrapper_svg svg').html() + '</g></g></g></g>')
        part.wrapper_svg = document.getElementById("wrapper_svg")
        part.wrapper_svg.addEventListener("wheel", this.wheelZoom);
        part.svg = document.querySelector("svg")
        part.group = document.getElementById("group");
        part.gTransform = part.svg.createSVGMatrix()
        part.group1 = document.getElementById("group1");
        if (create) {
            part.pcode = 'new_part'
            part.uuid = util.uuid()
        } else {
            part.pcode = util.getValueFromString(part.code[1], 'code', false).replaceAll('="', '').replaceAll('">)', '')
            part.uuid = util.getValueFromString(part.code[2], 'uuid', false).replaceAll('="', '').replaceAll('">)', '')
        }  */
       /*  
        log.add(__("Ready to work"), 'warning')
        part.setCoord()
        part.fit_to_page()
        part.createContourIntendPanel()
        inlet.detectNoInletOutlet()
        tch.init()
        panels.updateSortableList()
        part.updateRect()
        joint.detectJointsClasses() */
    }
    
/*     static ncpToSvg(ncpCode) {

        let svg = ''
        const ncpLines = ncpCode//.split(',');
        let currentX, currentY
        let path = 'closed'
        let mode = ''
        let cid;
        let jointContainerOpen = false;
        for (const line of ncpLines) {
            if (line.includes('(<Part id="')) {
                part.width = +util.getAttributeValue(line, 'originx')
                part.height = +util.getAttributeValue(line, 'originy')
                svg += `<svg id="svg" baseProfile="full" viewBox="0.00 0.00 ${part.width} ${part.height}" style="overflow:visible;" part-code="114___10__2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xlink="http://www.w3.org/1999/xlink">`;
            } else if (line.includes('(<Inlet')) {
                let x = util.getValueFromString(line, 'x')
                let y = util.getValueFromString(line, 'y')
                cid = util.getAttributeValue(line, 'contour_id')
                let innerOuter = util.getAttributeValue(line, 'mode')
                let macroValue = +util.getAttributeValue(line, 'macro')
                let pulseValue = +util.getAttributeValue(line, 'pulse')
                let piercingMode = 'dotRed'
                if (pulseValue === 0) {
                    piercingMode = 'dotRed'
                } else if (pulseValue === 1) {
                    piercingMode = 'dotPink'
                } else if (pulseValue === -1) {
                    piercingMode = 'dotYellow'
                }

                svg += `<g data-cid="${cid}" fill="none" class="inlet ${innerOuter} ${'macro' + macroValue}" stroke="red" stroke-width="0.2">
                <path   marker-start="url(#${piercingMode})" d="`;
                currentX = x
                currentY = y
                mode = 'inlet'
                path = 'open'

            } else if (line.includes('(<Outlet')) {
                svg += `"></path></g>`;
                let x = +util.getValueFromString(line, 'x')
                let y = +util.getValueFromString(line, 'y')
                let innerOuter = util.getAttributeValue(line, 'mode')
                let macroValue = +util.getAttributeValue(line, 'macro')
                svg += `<g data-cid="${this.lastContourId}" fill="none" class="outlet ${innerOuter} ${'macro' + macroValue}" stroke="lime" stroke-width="0.2">
                <path d="`;
                currentX = x
                currentY = y
                mode = 'outlet'
                path = 'open'
            } else if (line.includes('(<Contour')) {
                if (mode === 'inlet') {
                    svg += `"></path></g>`;
                    mode = 'contour'
                }
                this.joints=''

                //path === "closed"
                let eng = line.includes('mode="engraving"')
                cid = util.getAttributeValue(line, 'contour_id')
                let macroValue = +util.getAttributeValue(line, 'macro')
                let innerOuter = util.getAttributeValue(line, 'mode')
                let openClosed = +util.getAttributeValue(line, 'closed')
                this.lastContourId = +cid
                svg += `<g data-cid="${cid}" 
                            class="contour ${innerOuter} ${'macro' + macroValue} ${'closed' + openClosed}" 
                            >
                    <path  d="`;
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
                    svg += `M${util.round(x)},${util.round(part.height - y)} `;
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
                        svg += `M${util.round(x)},${util.round(part.height - y)} `;
                    } else {
                        svg += `L${util.round(x)},${util.round(part.height - y)} `;
                    }
                    currentX = x
                    currentY = y

                } else if (xMatch) {
                    // If only x is matched, add an SVG 'H' command
                    let x = util.getValueFromString(line, 'x');
                    svg += `H${util.round(x)} `;
                    currentX = x
                } else if (yMatch) {
                    // If only y is matched, add an SVG 'V' command
                    let y = util.getValueFromString(line, 'y');
                    svg += `V${util.round(part.height - y)} `;
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

                    svg += `A${r},${r} 0 ${largeArcFlag} 1 ${util.round(x)},${util.round(part.height - y)} `;
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
                    svg += `A${r},${r} 0 ${largeArcFlag} 0 ${util.round(x)},${util.round(part.height - y)} `;
                    currentX = x;
                    currentY = y;
                }
            } else if (line.includes('</Contour')) {
                svg += `"></path></g>`;
                svg+=this.joints
                path = 'closed'
                jointContainerOpen = false

            } else if (line.includes('(<Joint')){
                let x = +util.getAttributeValue(line, 'x')
                let y = +util.getAttributeValue(line, 'y')
                let dp = +util.getAttributeValue(line, 'dp');
                let length = +util.getAttributeValue(line, 'length');
                let path =  joint.getJoint(x,y)
                let uuid = util.uuid()
                let jointClass = 'manual'
                if (!jointContainerOpen){
                    jointContainerOpen = true
                    document.querySelector('#jointSize').value = length
                    this.joints+=`<g data-cid="${cid}" fill="none" class="joint" stroke="white" stroke-width="0.5">`
                }
                this.joints=this.joints.replace(/<\/g>$/g,'')
                this.joints+=`<path d="${path}" fill="none" id="${uuid}" class="joint ${jointClass}" data-dist="${dp}" data-length='${length}'></path>`
                this.joints+=`</g>`;

            } 
        }
        // Закройте SVG элемент
        svg += '</svg>';
        
    }*/
} 
export default Part;