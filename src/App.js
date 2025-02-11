import './App.css';
import './../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import Watches from './components/watches.js';
import Informer from './components/informer.js';
import SvgWrapper from './components/svgWrapper';
import Navbar from './components/navbar.js';
import Panels from './components/panels/panels.js';
import './i18n.js'; 


function App() {
	return (
		<div className="App">
			<Navbar />
			<div className="dLine"></div>
			<SvgWrapper />
			<Watches />
			<Informer />
			<Panels />
		</div>
 	);
}

export default App;
