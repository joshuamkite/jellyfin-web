import React, { useState, useEffect } from 'react';
import { getSystemTheme, applySystemTheme } from '../utils/theme';
import { useUserTheme } from '../hooks/useUserTheme';

const SettingsAppearance: React.FC = () => {
    const { syncWithSystemTheme, setSyncWithSystemTheme } = useUserTheme();
    const [isChecked, setIsChecked] = useState<boolean>(syncWithSystemTheme);

    useEffect(() => {
        setIsChecked(syncWithSystemTheme);
    }, [syncWithSystemTheme]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setIsChecked(checked);
        setSyncWithSystemTheme(checked);
        if (checked) {
            applySystemTheme();
            window.matchMedia('(prefers-color-scheme: dark)').addListener(applySystemThemeListener);
            window.matchMedia('(prefers-color-scheme: light)').addListener(applySystemThemeListener);
        } else {
            window.matchMedia('(prefers-color-scheme: dark)').removeListener(applySystemThemeListener);
            window.matchMedia('(prefers-color-scheme: light)').removeListener(applySystemThemeListener);
        }
    };

    const applySystemThemeListener = (event: MediaQueryListEvent) => {
        if (event.matches) {
            applySystemTheme();
        }
    };

    return (
        <div className='setting-item'>
            <label htmlFor='match-system-theme'>Match System Theme</label>
            <input
                type='checkbox'
                id='match-system-theme'
                checked={isChecked}
                onChange={handleChange}
            />
        </div>
    );
};

export default SettingsAppearance;
