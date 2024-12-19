import { observer } from "mobx-react-lite";
import svgStore from "./stores/svgStore.js";
import SVGPathCommander from 'svg-path-commander';


const Selector = observer(() => {

    const { svgData } = svgStore;
    const visibility = svgData.code.some(element => element.selected);
    let  path = svgStore.getSelectedElement('path') 
    const box =  SVGPathCommander.getPathBBox(path);
    const selectorCoords = visibility
      ? { x: box.x, y: box.y, width: box.width, height:  box.height }
      : { x: 0, y: 0, width: 0, height: 0 };

      let circleSize = (box.width + box.height) / 40;
      circleSize = circleSize > 2 ? 2 : circleSize

    return (
        <>
            <g id="selectorPart" className={visibility ? '' : 'd-none'}> 
                <rect 
                    x={selectorCoords.x} 
                    y={selectorCoords.y} 
                    width={selectorCoords.width}
                    height={selectorCoords.height}
                    fill="none" 
                    stroke="black" 
                    strokeWidth={circleSize/10}>
                </rect>         
                <circle 
                    id="selectorGrip_resize_nw"
                    fill="black" stroke="white"
                    r={circleSize}
                    style={{cursor: "nwResize"}}
                    strokeWidth={circleSize/10}
                    pointerEvents="all"
                    cx={selectorCoords.x}
                    cy={selectorCoords.y}>
                </circle>
                <circle 
                    id="selectorGrip_resize_ne"
                    fill="black" stroke="white"
                    r={circleSize}
                    style={{cursor: "neResize"}}
                    strokeWidth={circleSize/10}
                    pointerEvents="all"
                    cx={selectorCoords.x+selectorCoords.width}
                    cy={selectorCoords.y}>
                </circle>
                <circle 
                    id="selectorGrip_resize_sw"
                    fill="black" stroke="white"
                    r={circleSize}
                    style={{cursor: "swResize"}}
                    strokeWidth={circleSize/10}
                    pointerEvents="all"
                    cx={selectorCoords.x}
                    cy={selectorCoords.y+selectorCoords.height}>
                </circle>
                <circle 
                    id="selectorGrip_resize_se"
                    fill="black" stroke="white"
                    r={circleSize}
                    style={{cursor: "seResize"}}
                    strokeWidth={circleSize/10}
                    pointerEvents="all"
                    cx={selectorCoords.x+selectorCoords.width}
                    cy={selectorCoords.y+selectorCoords.height}>
                </circle>
                <circle 
                    id="selectorGrip_resize_n"
                    fill="black" stroke="white"
                    r={circleSize}
                    style={{cursor: "nResize"}}
                    strokeWidth={circleSize/10}
                    pointerEvents="all"
                    cx={selectorCoords.x+selectorCoords.width*0.5}
                    cy={selectorCoords.y}>
                </circle>
                <circle 
                    id="selectorGrip_resize_w"
                    fill="black" stroke="white"
                    r={circleSize}
                    style={{cursor: "wResize"}}
                    strokeWidth={circleSize/10}
                    pointerEvents="all"
                    cx={selectorCoords.x}
                    cy={selectorCoords.y+selectorCoords.height*0.5}>
                </circle>
                <circle 
                    id="selectorGrip_resize_s"
                    fill="black" stroke="white"
                    r={circleSize}
                    style={{cursor: "sResize"}}
                    strokeWidth={circleSize/10}
                    pointerEvents="all"
                    cx={selectorCoords.x+selectorCoords.width*0.5}
                    cy={selectorCoords.y+selectorCoords.height}>
                </circle>
                <circle 
                    id="selectorGrip_resize_e"
                    fill="black" stroke="white"
                    r={circleSize}
                     style={{cursor: "eResize"}}
                    strokeWidth={circleSize/10}
                    pointerEvents="all"
                    cx={selectorCoords.x+selectorCoords.width}
                    cy={selectorCoords.y+selectorCoords.height*0.5}>
                </circle>
                <circle 
                    id="selectorGrip_central"
                    fill="white" stroke="black"
                    r={circleSize}
                    style={{cursor: "move"}}
                    strokeWidth={circleSize/10}
                    pointerEvents="all"
                    cx={selectorCoords.x+selectorCoords.width*0.5}
                    cy={selectorCoords.y+selectorCoords.height*0.5}>
                </circle>
            </g>
        </>
    );
})

export default Selector;
