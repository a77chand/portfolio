import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import './index.css';

// No React.StrictMode: @react-three/rapier's WASM-backed RigidBodies/joints
// (used by Lanyard) get initialized twice under StrictMode's double-invoked
// effects, which corrupts the physics world and crashes the render loop.
ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
