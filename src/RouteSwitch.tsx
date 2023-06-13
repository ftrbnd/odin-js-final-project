import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';

const RouteSwitch: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;
