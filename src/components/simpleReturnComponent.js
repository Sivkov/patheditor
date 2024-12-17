import { observer } from "mobx-react-lite";
import svgStore from "./svgStore.js";
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

    }, []);

    const setSelected = (e) =>{
      let cid = Number(e.currentTarget.getAttribute('data-cid'));
      console.log ('Selected: '+cid)
      if(typeof cid  === 'number') {
        svgStore.setContourSelected(cid)
      }
    }

    return (
      <>
        {svgStore.svgData['code'].map((element, i) => (
          <g
            key={i}
            data-cid={element.cid}
            className={element.class}
            onMouseDown={element.class.includes('contour') ? setSelected : ()=>{}}
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