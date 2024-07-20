import { ThemeProvider } from '@mui/material';
import React, { type FC, type PropsWithChildren, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { DASHBOARD_APP_PATHS } from 'apps/dashboard/routes/routes';
import { useUserTheme } from 'hooks/useUserTheme';

import { DEFAULT_DARK_THEME, DEFAULT_LIGHT_THEME, getTheme } from './themes';

const isDashboardThemePage = (pathname: string) => [
    DASHBOARD_APP_PATHS.Dashboard,
    DASHBOARD_APP_PATHS.PluginConfig
].some(path => pathname.startsWith(`/${path}`));

const UserThemeProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
    const [isDashboard, setIsDashboard] = useState(false);
    const [muiTheme, setMuiTheme] = useState(DEFAULT_DARK_THEME);

    const location = useLocation();
    const { theme, dashboardTheme, lightTheme, darkTheme, syncWithSystemTheme } = useUserTheme();

    useEffect(() => {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

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

    // Check if we are on a dashboard page when the path changes
    useEffect(() => {
        setIsDashboard(isDashboardThemePage(location.pathname));
    }, [location.pathname]);

    useEffect(() => {
        if (isDashboard) {
            setMuiTheme(getTheme(dashboardTheme));
        }
    }, [dashboardTheme, isDashboard]);

    return (
        <ThemeProvider theme={muiTheme}>
            {children}
        </ThemeProvider>
    );
};

export default UserThemeProvider;
