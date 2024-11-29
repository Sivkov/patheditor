import React from 'react';
import { useCoords } from './CoordsContext';

const Informer = () => {
  const { coords } = useCoords();

  return (
    <div className="nav-item unselectable">
      <a className="nav-link" href="#" id="informer">
        x: {typeof coords.x === 'number' ? coords.x : ''}
        y: {typeof coords.y === 'number' ? coords.y : ''}
      </a>
    </div>
  );
};

export default Informer;