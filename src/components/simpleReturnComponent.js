import { observer } from "mobx-react-lite";
import svgStore from "./svgStore.js";
import logStore from "./logStore.js";
import Part from "./../scripts/part";
import React, { useEffect } from 'react';
import log from "../scripts/log.js";

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
      let now = new Date().getTime()
      logStore.add({time: now, action:'Ready to work'})
      let data = {
        id: now,
        svg: JSON.stringify(svgStore.svgData)
      }
      //log.save (data)

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