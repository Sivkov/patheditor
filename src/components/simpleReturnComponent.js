import { observer } from "mobx-react-lite";
import svgStore from "./svgStore.js";
import Part from "./../scripts/part";
import React, { useState, useEffect } from 'react';

  const SimpleReturnComponent = observer(() => {

    const [svgData, setSvgData] = useState(null); // Состояние для хранения данных SVG
    const handle = 0;
    const partNumber = 6;

    useEffect(() => {
      const fetchData = async () => {
        const svg = await Part.getPartCode(handle, partNumber); // Получаем данные
        const newSvgData = {
          width: svg.width,
          height: svg.height,
          code: svg.code,
        };
        svgStore.setSvgData(newSvgData); // Сохраняем данные в store
      };
      fetchData();
    }, [handle, partNumber]);

    return (
      <>
        {svgStore.svgData['code'].map((element, i) => (
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
  //}         
});

export default SimpleReturnComponent;