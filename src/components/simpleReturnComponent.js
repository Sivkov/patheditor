import { observer } from "mobx-react-lite";
import svgStore from "./svgStore.js";
import logStore from "./logStore.js";
import Part from "./../scripts/part";
import React, { useEffect } from 'react';

  const SimpleReturnComponent = observer(() => {

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
        svgStore.setSvgData(newSvgData); 
      };
      fetchData();
      logStore.add({time: new Date().getTime(), action:'Ready to work'})
    }, []);

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