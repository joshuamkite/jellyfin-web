import { ThemeProvider } from '@mui/material';
import React, { FC, PropsWithChildren, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserTheme } from '../hooks/useUserTheme'; // Adjust the import path as necessary

import { getTheme } from './themes'; // Adjust the import path as necessary

const UserThemeProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
    const [muiTheme, setMuiTheme] = useState(getTheme('dark')); // Default theme
    const location = useLocation();
    const { theme, dashboardTheme, lightTheme, darkTheme, syncWithSystemTheme } = useUserTheme();

    useEffect(() => {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = () => {
            if (syncWithSystemTheme) {
                setMuiTheme(prefersDarkScheme.matches ? getTheme(darkTheme) : getTheme(lightTheme));
            } else {
                setMuiTheme(getTheme(theme));
            }
        };

        applyTheme();

        prefersDarkScheme.addEventListener('change', applyTheme);

        return () => {
            prefersDarkScheme.removeEventListener('change', applyTheme);
        };
    }, [theme, lightTheme, darkTheme, syncWithSystemTheme]);

    useEffect(() => {
        if (location.pathname.startsWith('/dashboard')) {
            setMuiTheme(getTheme(dashboardTheme));
        }
    }, [dashboardTheme, location.pathname]);

    return (
        <ThemeProvider theme={muiTheme}>
            {children}
        </ThemeProvider>
    );
};

export default UserThemeProvider;
