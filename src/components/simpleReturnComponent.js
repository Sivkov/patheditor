import React, { useEffect, useState } from "react";
import Part from './../scripts/part';

const SimpleReturnComponent = () => {
    const [svgData, setSvgData] = useState(null); // Состояние для хранения данных SVG
    const handle = 0;
    const partNumber = 6;

    useEffect(() => {
        const fetchData = async () => {
            const svg = await Part.getPartCode(3,6)
            setSvgData(svg); 
        }
        fetchData();
    }, [handle, partNumber]);

    if (!svgData) {
        return [];
    }
    return (
        <>
          {svgData.map((element, i) => (
            <g key={i} data-cid={element.cid} className={element.class} fill={ element.class.includes('inner') ? 'url(#grid)' : ''}>
              <path d={element.path}></path>
            </g>
          ))}
        </>
      );

        
  
};

export default SimpleReturnComponent;