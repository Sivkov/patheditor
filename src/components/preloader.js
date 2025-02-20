import React from 'react';
import { observer } from 'mobx-react-lite';
import coordsStore from './stores/coordsStore';

const Preloader = observer(() => {
	return (
		<div id="preloader" className={coordsStore.preloader ? '' : 'fadeOut'}>
			<div id="arc_container">
				<div className="arc_reactor">
				<div className="case_container">
					<div className="e7">
					<div className="semi_arc_3 e5_1">
						<div className="semi_arc_3 e5_2">
						<div className="semi_arc_3 e5_3">
							<div className="semi_arc_3 e5_4"></div>
						</div>
						</div>
					</div>
					<div className="core2"></div>
					</div>
					<ul className="marks p-0">
					<li></li><li></li><li></li><li></li><li></li><li></li>
					<li></li><li></li><li></li><li></li><li></li><li></li>
					<li></li><li></li><li></li><li></li><li></li><li></li>
					<li></li><li></li><li></li><li></li><li></li><li></li>
					<li></li><li></li><li></li><li></li><li></li><li></li>
					<li></li><li></li><li></li><li></li><li></li><li></li>
					<li></li><li></li><li></li><li></li><li></li><li></li>
					<li></li><li></li><li></li><li></li><li></li><li></li>
					<li></li><li></li><li></li><li></li><li></li><li></li>
					<li></li><li></li><li></li><li></li><li></li><li></li>
					</ul>
				</div>
				</div>
			</div>
		</div>
	);
});

export default Preloader;


