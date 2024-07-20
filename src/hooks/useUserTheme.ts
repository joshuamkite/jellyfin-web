import { useCallback, useEffect, useState } from 'react';
import {
    getUserThemeSyncPreference,
    getUserLightThemePreference,
    getUserDarkThemePreference,
    saveUserThemeSyncPreference,
    saveUserLightThemePreference,
    saveUserDarkThemePreference,
    currentSettings as userSettings
} from 'scripts/settings/userSettings';
import Events, { type Event } from 'utils/events';

import { useApi } from './useApi';
import { useThemes } from './useThemes';
import { getSystemTheme, applySystemTheme } from '../utils/theme';

const THEME_FIELD_NAMES = ['appTheme', 'dashboardTheme', 'lightTheme', 'darkTheme', 'syncWithSystemTheme'];

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
    }, [dashboardTheme, defaultTheme, theme]);

    const applySystemThemeListener = useCallback((event: MediaQueryListEvent) => {
        if (event.matches) {
            applySystemTheme();
        }
    }, []);

    // Update the current themes with values from user settings
    const updateThemesFromSettings = useCallback(() => {
        const userTheme = userSettings.theme();
        if (userTheme) setTheme(userTheme);
        const userDashboardTheme = userSettings.dashboardTheme();
        if (userDashboardTheme) setDashboardTheme(userDashboardTheme);
        const userLightTheme = getUserLightThemePreference();
        if (userLightTheme) setLightTheme(userLightTheme);
        const userDarkTheme = getUserDarkThemePreference();
        if (userDarkTheme) setDarkTheme(userDarkTheme);
        const userSyncWithSystemTheme = getUserThemeSyncPreference();
        setSyncWithSystemTheme(userSyncWithSystemTheme !== undefined ? userSyncWithSystemTheme : true);

        if (userSyncWithSystemTheme) {
            applySystemTheme();
            window.matchMedia('(prefers-color-scheme: dark)').addListener(applySystemThemeListener);
            window.matchMedia('(prefers-color-scheme: light)').addListener(applySystemThemeListener);
        } else {
            window.matchMedia('(prefers-color-scheme: dark)').removeListener(applySystemThemeListener);
            window.matchMedia('(prefers-color-scheme: light)').removeListener(applySystemThemeListener);
        }
    }, [applySystemThemeListener]);

    const onUserSettingsChange = useCallback((_e: Event, name?: string) => {
        if (name && THEME_FIELD_NAMES.includes(name)) {
            updateThemesFromSettings();
        }
    }, [updateThemesFromSettings]);

    // Handle user settings changes
    useEffect(() => {
        Events.on(userSettings, 'change', onUserSettingsChange);

        return () => {
            Events.off(userSettings, 'change', onUserSettingsChange);
        };
    }, [onUserSettingsChange]);

    // Update the theme if the user changes
    useEffect(() => {
        updateThemesFromSettings();
    }, [updateThemesFromSettings, user]);

    return {
        theme,
        dashboardTheme,
        lightTheme,
        darkTheme,
        syncWithSystemTheme,
        setSyncWithSystemTheme: (value: boolean) => saveUserThemeSyncPreference(value),
        setLightTheme: (value: string) => saveUserLightThemePreference(value),
        setDarkTheme: (value: string) => saveUserDarkThemePreference(value)
    };
}
