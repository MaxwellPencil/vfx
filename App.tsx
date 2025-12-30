import React from 'react';
import VFXGenerator from './components/VFXGenerator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 selection:bg-chroma-green selection:text-black font-sans">
      <VFXGenerator />
    </div>
  );
};

export default App;