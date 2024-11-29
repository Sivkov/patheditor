import React, { createContext, useContext, useState } from 'react';

const CoordsContext = createContext();

export const CoordsProvider = ({ children }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  return (
    <CoordsContext.Provider value={{ coords, setCoords }}>
      {children}
    </CoordsContext.Provider>
  );
};

 export const useCoords = () => useContext(CoordsContext);