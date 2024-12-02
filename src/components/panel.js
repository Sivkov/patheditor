import React, { useState } from 'react';

const Panel = ({ element, index }) => {
	const [isMinified, setIsMinified] = useState(element.mini);

	const toggleMinified = () => {
		setIsMinified((prevIsMinified) => !prevIsMinified);
	};
	const [zIndex, setZIndex] = useState(1);

	const handleIncreaseZIndex = () => {
		let index = findHighestZIndex()
		setZIndex(() => index + 1);
	};

	const findHighestZIndex = () => {
		let currentZIndex = 0;
		const popups = document.querySelectorAll('[data-panel]');
		popups.forEach((popup) => {
			const zIndex = getComputedStyle(popup).getPropertyValue('z-index');
			const parsedZIndex = parseInt(zIndex, 10);
			if (!isNaN(parsedZIndex) && parsedZIndex > currentZIndex) {
				currentZIndex = parsedZIndex;
			}
		});
		return currentZIndex;
	};


	return (
		<div
			id={element.id} 
			className={'window popup' + (isMinified ? " mini h45" : "")}
			key={'panel' + index}			
			data-panel={index}
			style={{ zIndex: zIndex,  top : element.style.top+'px', left: element.style.left+'px', width: element.style.width+"px", height: element.style.height+'px'}}
			onMouseDown={handleIncreaseZIndex}>
			<div >
				<div className="window-top popup-header">
					<div className="d-flex align-items-center justify-content-between">
						<div className="nav-link">{element.fa}</div>
						<div className="minify_wrapper d-flex align-items-center justify-content-center">
							<div className={"minify " + (isMinified ? "minified" : "")} onClick={toggleMinified}></div>
						</div>
					</div>
				</div>
				<div className={"window-content "  + (isMinified ? "mini" : "")}>
					{element.content}
				</div>
			</div>
			<div className={"resizer-right "  + (isMinified ? "mini" : "")}></div>
			<div className={"resizer-bottom " + (isMinified ? "mini" : "")}></div>
			<div className={"resizer-both "   + (isMinified ? "mini" : "")}></div>
		</div>
	);
};

export default Panel;