import React from "react";
import { ReactSortable } from "react-sortablejs";
import { useEffect } from "react";


const draggableList = [
  {
    name: "Mike"
  },
  {
    name: "Michael"
  },
  {
    name: "Mason"
  },
  {
    name: "Miller"
  },
  {
    name: "Milner"
  },
  {
    name: "Merry"
  }
];

const Example =()=> {

useEffect(() => {
  const fixTouchEnd = (e) => e.preventDefault();
  document.addEventListener("touchmove", fixTouchEnd, { passive: false });
  document.addEventListener("touchend", fixTouchEnd, { passive: false });

  return () => {
    document.removeEventListener("touchmove", fixTouchEnd);
    document.removeEventListener("touchend", fixTouchEnd);
  };
}, []);

  const [list, setList] = React.useState(draggableList);

  return (
    <div className="example">
      <h1>
        Very Simple Draggable Stuff <>⚛️</>
      </h1>
      <ReactSortable
        dragClass="sortableDrag"
        list={list}
        setList={setList}
        animation="200"
        easing="ease-out"
        
      >
        {list.map((item,i) => (
          <div className="draggableItem" key={i}>{item.name}</div>
        ))}
      </ReactSortable>
    </div>
  );
}

export default Example