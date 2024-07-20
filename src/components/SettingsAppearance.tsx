// src/components/SettingsAppearance.tsx

import React, { useState, useEffect } from 'react';
import { applySystemTheme } from '../utils/theme';

const SettingsAppearance: React.FC = () => {
    const [matchSystemTheme, setMatchSystemTheme] = useState<boolean>(false);

    useEffect(() => {
        const storedPreference = localStorage.getItem('matchSystemTheme');
        if (storedPreference) {
            setMatchSystemTheme(JSON.parse(storedPreference));
            if (JSON.parse(storedPreference)) {
                applySystemTheme();
            }
        }
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setMatchSystemTheme(checked);
        localStorage.setItem('matchSystemTheme', JSON.stringify(checked));
        if (checked) {
            applySystemTheme();
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemTheme);
        } else {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', applySystemTheme);
        }
    };

    return (
        <div className='setting-item'>
            <label htmlFor='match-system-theme'>Match System Theme</label>
            <input
                type='checkbox'
                id='match-system-theme'
                checked={matchSystemTheme}
                onChange={handleChange}
            />
        </div>
    );
};

export default SettingsAppearance;
