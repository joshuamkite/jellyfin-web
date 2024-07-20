// src/utils/theme.ts

export function getSystemTheme(): string {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
}

export function applySystemTheme(): void {
    const systemTheme = getSystemTheme();
    applyTheme(systemTheme);
}
