import React from "react";
import svgStore from "./stores/svgStore";
import { observer } from "mobx-react-lite";

const HighLighted = observer(() => {
    const { highLighted } = svgStore;

    if (typeof highLighted !== "number") {
        return null;
    }

    const pathData = svgStore.getElementByCidAndClass(highLighted, "contour", "path") || "";

    return (
        <>
            <path 
                className="highLighted" 
                id="highLighted"
                d={pathData} 
            />
        </>
    );
});

export default HighLighted;