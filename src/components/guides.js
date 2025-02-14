import React, { useState, useEffect } from "react";
import svgStore from "./stores/svgStore";
import { toJS } from "mobx";


const Guides = () => {
    const {	selectedPointOnEdge	} = svgStore
    const [xGuide,setXGuide ] = useState({x1:0,y1:50,x2:100,y2:50})
    const [yGuide,setYGuide ] = useState({x1:50,y1:0,x2:50,y2:100})
    const [aGuide,setAGuide ] = useState({x1:0,y1:0,x2:100,y2:100})

    useEffect(()=>{
        console.log ('selectedPointOnEdge', toJS(selectedPointOnEdge))
    },[ selectedPointOnEdge])

	if (!selectedPointOnEdge) {
		return null;
	}

  return (
    <>
      {/* X-Гид (Вертикальная линия) */}
      <line
        x1={xGuide.x1}
        y1={xGuide.y1}
        x2={xGuide.x2}
        y2={xGuide.y2}
        stroke="green"
        strokeWidth="0.5"
        className="smartGuide"
        id="xGuide"
      />
      
      {/* Y-Гид (Горизонтальная линия) */}
      <line
        x1={yGuide.x1}
        y1={yGuide.y1}
        x2={yGuide.x2}
        y2={yGuide.y2}
        stroke="red"
        strokeWidth="0.5"
        className="smartGuide"
        id="yGuide"
      />

      {/* A-Гид (Дополнительная линия) */}
      <line
        x1={aGuide.x1}
        y1={aGuide.y1}
        x2={aGuide.x2}
        y2={aGuide.y2}
        stroke="white"
        strokeWidth="0.5"
        className="smartGuide"
        id="aGuide"
      />
    </>
  );
};

export default Guides;
