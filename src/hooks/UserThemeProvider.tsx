import React, { useState, FC, PropsWithChildren, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getUserDarkThemePreference, getUserLightThemePreference } from 'scripts/settings/userSettings';
import { useUserTheme } from '../hooks/useUserTheme';

const UserThemeProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
    const { lightTheme, darkTheme } = useUserTheme();
    const [muiTheme, setMuiTheme] = useState(createTheme({ palette: { mode: 'dark' } }));

    useEffect(() => {
        const theme = createTheme({
            palette: {
                mode: darkTheme === 'dark' ? 'dark' : 'light',
                primary: {
                    main: darkTheme === 'dark' ? '#000' : '#fff'
                }
            }
        });
        setMuiTheme(theme);
    }, [darkTheme]);

    return (
        <ThemeProvider theme={muiTheme}>
            {children}
        </ThemeProvider>
    );
};

export default UserThemeProvider;
