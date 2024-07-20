import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Settings from './Settings';

const AppRouter: React.FC = () => (
    <Router>
        <Routes>
            <Route path='/' element={<App />} />
            <Route path='/settings' element={<Settings />} />
        </Routes>
    </Router>
);

export default AppRouter;
