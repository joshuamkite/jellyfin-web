import { useCallback, useEffect, useState } from 'react';

import { currentSettings as userSettings } from 'scripts/settings/userSettings';
import Events, { type Event } from 'utils/events';

import { useApi } from './useApi';
import { useThemes } from './useThemes';

const THEME_FIELD_NAMES = [ 'appTheme', 'dashboardTheme', 'lightTheme', 'darkTheme', 'syncWithSystemTheme' ];

export function useUserTheme() {
    const [theme, setTheme] = useState<string>();
    const [dashboardTheme, setDashboardTheme] = useState<string>();
    const [lightTheme, setLightTheme] = useState<string>('light'); // Default light theme
    const [darkTheme, setDarkTheme] = useState<string>('dark'); // Default dark theme
    const [syncWithSystemTheme, setSyncWithSystemTheme] = useState<boolean>(true); // Default sync with system theme

    const { user } = useApi();
    const { defaultTheme } = useThemes();

    useEffect(() => {
        if (defaultTheme) {
            if (!theme) setTheme(defaultTheme.id);
            if (!dashboardTheme) setDashboardTheme(defaultTheme.id);
        }
    }, [ dashboardTheme, defaultTheme, theme ]);

    // Update the current themes with values from user settings
    const updateThemesFromSettings = useCallback(() => {
        const userTheme = userSettings.theme();
        if (userTheme) setTheme(userTheme);
        const userDashboardTheme = userSettings.dashboardTheme();
        if (userDashboardTheme) setDashboardTheme(userDashboardTheme);
        const userLightTheme = userSettings.lightTheme();
        if (userLightTheme) setLightTheme(userLightTheme);
        const userDarkTheme = userSettings.darkTheme();
        if (userDarkTheme) setDarkTheme(userDarkTheme);
        const userSyncWithSystemTheme = userSettings.syncWithSystemTheme();
        setSyncWithSystemTheme(userSyncWithSystemTheme !== undefined ? userSyncWithSystemTheme : true);
    }, []);

    const onUserSettingsChange = useCallback((_e: Event, name?: string) => {
        if (name && THEME_FIELD_NAMES.includes(name)) {
            updateThemesFromSettings();
        }
    }, [ updateThemesFromSettings ]);

    // Handle user settings changes
    useEffect(() => {
        Events.on(userSettings, 'change', onUserSettingsChange);

        return () => {
            Events.off(userSettings, 'change', onUserSettingsChange);
        };
    }, [ onUserSettingsChange ]);

    // Update the theme if the user changes
    useEffect(() => {
        updateThemesFromSettings();
    }, [ updateThemesFromSettings, user ]);

    return {
        theme,
        dashboardTheme,
        lightTheme,
        darkTheme,
        syncWithSystemTheme
    };
}
