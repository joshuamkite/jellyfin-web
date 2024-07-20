import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './components/AppRouter';
import { applySystemTheme, getSystemTheme } from './utils/theme';
import UserThemeProvider from './hooks/UserThemeProvider';

// Check if the user has set the app to match the system theme
const matchSystemTheme = JSON.parse(localStorage.getItem('matchSystemTheme') || 'false');

if (matchSystemTheme) {
    applySystemTheme();
} else {
    const userTheme = localStorage.getItem('theme') || getSystemTheme();
    document.documentElement.setAttribute('data-theme', userTheme);
}

ReactDOM.render(
    <React.StrictMode>
        <UserThemeProvider>
            <AppRouter />
        </UserThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
