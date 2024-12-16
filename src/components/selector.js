import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import svgStore from "./svgStore.js";
import { toJS } from "mobx";
import SVGPathCommander from 'svg-path-commander';



const Selector = observer(() => {

    const { svgData } = svgStore;
    const visibility = svgData.code.some(element => element.selected);
    let  path = svgStore.getSelectedElement('path') 
    const box =  SVGPathCommander.getPathBBox(path);
    const selectorCoords = visibility
      ? { x: box.x, y: box.y, width: box.width, height:  box.height }
      : { x: 0, y: 0, width: 0, height: 0 };

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
                    strokeWidth="0.25">
                </rect>         
                <circle 
                    id="selectorGrip_resize_nw"
                    fill="black"
                    r="2"
                    style={{cursor: "nwResize"}}
                    strokeWidth="0.25"
                    pointerEvents="all"
                    cx={selectorCoords.x}
                    cy={selectorCoords.y}>
                </circle>
                <circle 
                    id="selectorGrip_resize_ne"
                    fill="black"
                    r="2"
                    style={{cursor: "neResize"}}
                    strokeWidth="0.25"
                    pointerEvents="all"
                    cx={selectorCoords.x+selectorCoords.width}
                    cy={selectorCoords.y}>
                </circle>
                <circle 
                    id="selectorGrip_resize_sw"
                    fill="black"
                    r="2"
                    style={{cursor: "swResize"}}
                    strokeWidth="0.25"
                    pointerEvents="all"
                    cx={selectorCoords.x}
                    cy={selectorCoords.y+selectorCoords.height}>
                </circle>
                <circle 
                    id="selectorGrip_resize_se"
                    fill="black"
                    r="2"
                    style={{cursor: "seResize"}}
                    strokeWidth="0.25"
                    pointerEvents="all"
                    cx={selectorCoords.x+selectorCoords.width}
                    cy={selectorCoords.y+selectorCoords.height}>
                </circle>
                <circle 
                    id="selectorGrip_resize_n"
                    fill="black"
                    r="2"
                    style={{cursor: "nResize"}}
                    strokeWidth="0.25"
                    pointerEvents="all"
                    cx={selectorCoords.x+selectorCoords.width*0.5}
                    cy={selectorCoords.y}>
                </circle>
                <circle 
                    id="selectorGrip_resize_w"
                    fill="black"
                    r="2"
                    style={{cursor: "wResize"}}
                    strokeWidth="0.25"
                    pointerEvents="all"
                    cx={selectorCoords.x}
                    cy={selectorCoords.y+selectorCoords.height*0.5}>
                </circle>
                <circle 
                    id="selectorGrip_resize_s"
                    fill="black"
                    r="2"
                    style={{cursor: "sResize"}}
                    strokeWidth="0.25"
                    pointerEvents="all"
                    cx={selectorCoords.x+selectorCoords.width*0.5}
                    cy={selectorCoords.y+selectorCoords.height}>
                </circle>
                <circle 
                    id="selectorGrip_resize_e"
                    fill="black"
                    r="2"
                     style={{cursor: "eResize"}}
                    strokeWidth="0.25"
                    pointerEvents="all"
                    cx={selectorCoords.x+selectorCoords.width}
                    cy={selectorCoords.y+selectorCoords.height*0.5}>
                </circle>
                <circle 
                    id="selectorGrip_central"
                    fill="black"
                    r="2"
                    style={{cursor: "move"}}
                    strokeWidth="0.25"
                    pointerEvents="all"
                    cx={selectorCoords.x+selectorCoords.width*0.5}
                    cy={selectorCoords.y+selectorCoords.height*0.5}>
                </circle>
            </g>
        </>
    );
})

export default Selector;
