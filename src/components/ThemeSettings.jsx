import React, { useState, useEffect } from 'react';
import { currentSettings } from 'scripts/settings/userSettings';

const ThemeSettings = () => {
    const [theme, setTheme] = useState(currentSettings.theme() || 'dark');

    useEffect(() => {
        currentSettings.applyTheme();
    }, [theme]);

    const handleThemeChange = (event) => {
        const newTheme = event.target.value;
        setTheme(newTheme);
        currentSettings.theme(newTheme);
        currentSettings.applyTheme();
    };

    return (
        <div>
            <label htmlFor='themeSelect'>Select Theme:</label>
            <select id='themeSelect' value={theme} onChange={handleThemeChange}>
                <option value='auto'>Auto (Match System)</option>
                <option value='light'>Light</option>
                <option value='dark'>Dark</option>
                {/* Add other themes here if needed */}
            </select>
        </div>
    );
};

export default ThemeSettings;
