import React, { useState, useRef } from "react";

const Panel = ({ element, index }) => {
	const [isMinified, setIsMinified] = useState(element.mini);
	const [zIndex, setZIndex] = useState(index+1);
	const [position, setPosition] = useState({
		top: element.style.top,
		left: element.style.left,
	});

	const panelRef = useRef(null);
	const startPos = useRef({ x: 0, y: 0 });

	// Toggle minimization
	const toggleMinified = () => {
		setIsMinified((prev) => !prev);
	};

	// Handle dragging
	const handleMouseDown = (e) => {
		handleIncreaseZIndex()
		e.preventDefault();
		e.stopPropagation();
		// Save the initial position of the mouse
		startPos.current = {
			x: e.clientX - panelRef.current.offsetLeft,
			y: e.clientY - panelRef.current.offsetTop,
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		//document.addEventListener("mouseleave", handleMouseUp);
	};

	const handleMouseMove = (e) => {
		e.preventDefault();
		e.stopPropagation();
		// Calculate new position
		const newLeft = e.clientX - startPos.current.x;
		const newTop = e.clientY - startPos.current.y;

		// Update position
		setPosition({
			top: newTop,
			left: newLeft,
		});
	};

	const handleMouseUp = () => {
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
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
				width: `${element.style.width}px`,
				height: `${element.style.height}px`,
			}}			
		>
			<div className="window-top popup-header" 
				onMouseDown={handleMouseDown}
				onMouseLeave={handleMouseUp}>
				<div className="d-flex align-items-center justify-content-between">
					<div className="nav-link">{element.fa}</div>
					<div
						className="minify_wrapper d-flex align-items-center justify-content-center"
					>
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
			<div className={`resizer-right ${isMinified ? "mini" : ""}`}></div>
			<div className={`resizer-bottom ${isMinified ? "mini" : ""}`}></div>
			<div className={`resizer-both ${isMinified ? "mini" : ""}`}></div>
		</div>
	);
};

export default Panel;
