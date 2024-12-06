import React, { useRef, useState } from 'react';
import Part from './../scripts/part';
import Util from './../utils/util';


const SvgComponent = ({ matrix, gmatrix, svgContent, gridState }) => {
    const wrapperRef = useRef(null);
    const matrixM = `${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f}`;
    const matrixG = `${gmatrix.a} ${gmatrix.b} ${gmatrix.c} ${gmatrix.d} ${gmatrix.e} ${gmatrix.f}`;
	const widthSVG = 189
	const heightSVG = 200


    const calculateRectAttributes = () => {
        // Ширина и высота исходя из scale
        const combinedMatrix = Util.multiplyMatrices(gmatrix, matrix);
        const scaleX = combinedMatrix.a;
        const scaleY = combinedMatrix.d;

        const width = widthSVG/ scaleX;
        const height = heightSVG / scaleY;

        // Координаты x и y исходя из translate
        const x = -combinedMatrix.e / scaleX;
        const y = -combinedMatrix.f / scaleY;

        return { x, y, width, height };
    };
    const { x, y, width, height } = calculateRectAttributes();

    return (
        <svg
            id="svg"
            baseProfile="full"
            viewBox={`0.00 0.00 ${widthSVG} ${heightSVG}`}
            style={{ overflow: 'hidden', border: '1px solid var(--color)' }}
            version="1.1"
            stroke='var(--color)'
            strokeWidth="0.2"
        >
            <defs>
                <pattern  
                    id="xsGrid" 
                    width="1" 
                    height="1" 
                    fill="var(--gridColorFill)" 
                    patternUnits="userSpaceOnUse" 
                    visibility={gridState.xsGrid.visibility}>
                    <path  d="M 0 0 1 0 1 1 0 1 0 0" fill="var(--gridColorFill)" stroke="var(--gridColorStroke)" strokeWidth="0.05"/>
                </pattern>
                <pattern 
                    id="smallGrid" 
                    width="10" 
                    height="10" 
                    patternUnits="userSpaceOnUse" >
                    <rect  width="100" height="100" fill="url(#xsGrid)"/>
                    <path  
                    d="M 10 0 L 0 0 0 10 10 10 10 0" 
                    fill={gridState.smallGrid.fill} 
                    stroke="var(--gridColorStroke)" 
                    strokeWidth="0.1" 
                    visibility={gridState.smallGrid.visibility}/>
                </pattern>
                <pattern  
                    id="grid" 
                    width="100" 
                    height="100" 
                    patternUnits="userSpaceOnUse"
                    visibility={gridState.grid.visibility}>
                    <rect  
                    width="100" height="100" 
                    fill="url(#smallGrid)"/>
                    <path  
                    d="M 100 0 0 0 0 100 100 100 100 0" 
                    fill={gridState.grid.fill} 
                    stroke="var(--gridColorStroke)" 
                    strokeWidth="0.2"/>
                </pattern>
                    <marker id="dotRed" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
                    <circle 
                    cx="5" 
                    cy="5" 
                    r="5" 
                    fill="red"></circle>
                </marker>
            </defs>
            <g id="group2" fill="url(#grid)">
                <g id="group1" transform={`matrix(${matrixG})`}>
                    <g id="group" transform={`matrix(${matrixM})`} className="grab">
                        <g id="contours">
                            <rect
                                id="dimensionalGrid"
                                height={height}
                                width={width}
                                x={x}
                                y={y}
                                fill="url(#grid)"
                                transform-origin="50% 50%"
                                stroke='var(--color)'
                                strokeWidth="0"
                            ></rect>
                            <>
                             { svgContent }
                            </>
                       </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};

export default SvgComponent;