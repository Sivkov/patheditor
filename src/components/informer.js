import React from 'react';
import { observer } from 'mobx-react-lite';  // Импортируем observer для оборачивания компонента
import coordsStore from './coordsStore.js';  // Импортируем store

const Informer = observer(() => {
  const { coords } = coordsStore;  // Получаем данные из store

  return (
    <div className="nav-item unselectable">
      <a className="nav-link" href="#" id="informer">
        x: {typeof coords.x === 'number' ? coords.x : ''}
        y: {typeof coords.y === 'number' ? coords.y : ''}
      </a>
    </div>
  );
});

export default Informer;