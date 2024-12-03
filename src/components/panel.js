import React, { useState, useRef } from "react";

const Panel = ({ element, index }) => {
	const [isMinified, setIsMinified] = useState(element.mini);
	const [zIndex, setZIndex] = useState(index+1);
	const [position, setPosition] = useState({
		top: element.style.top,
		left: element.style.left		
	});
	
	const [size, setSize] = useState({
		width: element.style.width,
		height: element.style.height,
	});

	const panelRef = useRef(null);
	const startPos = useRef({ x: 0, y: 0 });
	const startWidth = useRef(0);
	const startHeight = useRef(0);
	const startY = useRef(0);
	const startX = useRef(0);
	const move = useRef(0);

 	const toggleMinified = () => {
		setIsMinified((prev) => !prev);
	};

 	const handleMouseDown = (e) => {
		handleIncreaseZIndex()
		e.preventDefault();
		e.stopPropagation();
		startPos.current = {
			x: e.clientX - panelRef.current.offsetLeft,
			y: e.clientY - panelRef.current.offsetTop,
		};

		move.current = 'move'

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const initDrag =(e)=>{
		startX.current = e.clientX;
        startY.current = e.clientY;

		startWidth.current = size.width
		startHeight.current = size.height

		move.current = 'resize'
			
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	}
	
	const handleMouseMove = (e) => {
		if (move.current === 'move') {
			const newLeft = e.clientX - startPos.current.x;
			const newTop = e.clientY - startPos.current.y;
			setPosition({
				top: newTop,
				left: newLeft,
			});
		} else {
			let w = startWidth.current + e.clientX - startX.current ;
			let h = startHeight.current + e.clientY - startY.current;
			setSize ({
				width:w,
				height:h
			})
		}
	};

	const handleMouseUp = () => {
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
		move.current= ''
	};

	const findHighestZIndex = () => {
		let currentMaxZIndex = 0;
		const popups = document.querySelectorAll('.window.popup');
		popups.forEach((popup) => {
			const zIndex = getComputedStyle(popup).getPropertyValue('z-index');
			const parsedZIndex = parseInt(zIndex, 10);

			if (!isNaN(parsedZIndex) && parsedZIndex > currentMaxZIndex) {
				currentMaxZIndex = parsedZIndex;
			}
		});
		return currentMaxZIndex;
	};

	const handleIncreaseZIndex = () => {
		const currentMaxZIndex = findHighestZIndex();
		setZIndex(currentMaxZIndex + 1);
		console.log ('Set Z')
	};

	return (
		<div
			ref={panelRef}
			id={element.id}
			className={`window popup${isMinified ? " mini h45" : ""}`}
			style={{
				zIndex: zIndex,
				top: `${position.top}px`,
				left: `${position.left}px`,
				width: `${size.width}px`,
				height: `${size.height}px`,
			}}			
		>
			<div className="window-top popup-header" 
				onMouseDown={handleMouseDown}>
				<div className="d-flex align-items-center justify-content-between">
					<div className="nav-link">{element.fa}</div>
					<div className="minify_wrapper d-flex align-items-center justify-content-center">
						<div
							className={`minify ${isMinified ? "minified" : ""}`}
							onClick={(e) => {
								e.stopPropagation();
								toggleMinified();
							}}
						></div>
					</div>
				</div>
			</div>
			<div className={`window-content ${isMinified ? "mini" : ""}`}>
				{element.content}
			</div>
			<div 
				className={`resizer-right ${isMinified ? "mini" : ""}`}
				onMouseDown={initDrag}				
				onMouseUp={handleMouseUp}
			></div>
			<div 
				className={`resizer-bottom ${isMinified ? "mini" : ""}`}
				onMouseDown={initDrag}
				onMouseUp={handleMouseUp}
			></div>
			<div 
				className={`resizer-both ${isMinified ? "mini" : ""}`}
				onMouseDown={initDrag}
				onMouseUp={handleMouseUp}
			></div>
		</div>
	);
};

export default Panel;
