import { observer } from "mobx-react-lite";
import svgStore from "./svgStore.js";
import Part from "./../scripts/part";
import React, { useState, useEffect } from 'react';



const SimpleReturnComponent = () => {
    const [svgData, setSvgData] = useState(null); // Состояние для хранения данных SVG
    const handle = 0;
    const partNumber = 6;

    useEffect(() => {
      const fetchData = async () => {
        const svgData = await Part.getPartCode(handle, partNumber);
        svgStore.setSvgData(svgData); // Сохраняем данные в store
      };
      fetchData();
    }, [handle, partNumber]);

    return (
      <>
        {svgStore.svgData.map((element, i) => (
          <g
            key={i}
            data-cid={element.cid}
            className={element.class}
            fill={element.class.includes("inner") ? "url(#grid)" : ""}
          >
            <path d={element.path}></path>
          </g>
        ))}
      </>
    );
         
};

export default SimpleReturnComponent;