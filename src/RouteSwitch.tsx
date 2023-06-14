import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Navbar from './components/Navbar';
import ColorModeProvider from './utils/ColorModeContext';

const RouteSwitch: FC = () => {
  return (
    <ColorModeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ColorModeProvider>
  );
};

export default RouteSwitch;
