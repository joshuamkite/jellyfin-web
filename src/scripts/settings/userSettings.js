import appSettings from './appSettings';
import browser from '../browser';
import Events from '../../utils/events.ts';
import { toBoolean } from '../../utils/string.ts';

function onSaveTimeout() {
    const self = this;
    self.saveTimeout = null;
    self.currentApiClient.updateDisplayPreferences('usersettings', self.displayPrefs, self.currentUserId, 'emby');
}

function saveServerPreferences(instance) {
    if (instance.saveTimeout) {
        clearTimeout(instance.saveTimeout);
    }

    instance.saveTimeout = setTimeout(onSaveTimeout.bind(instance), 50);
}

const defaultSubtitleAppearanceSettings = {
    verticalPosition: -3
};

const defaultComicsPlayerSettings = {
    langDir: 'ltr',
    pagesPerView: 1
};

export class UserSettings {
    setUserInfo(userId, apiClient) {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        this.currentUserId = userId;
        this.currentApiClient = apiClient;

        if (!userId) {
            this.displayPrefs = null;
            return Promise.resolve();
        }

        const self = this;

        return apiClient.getDisplayPreferences('usersettings', userId, 'emby').then(function (result) {
            result.CustomPrefs = result.CustomPrefs || {};
            self.displayPrefs = result;
        });
    }

    getData() {
        return this.displayPrefs;
    }

    importFrom(instance) {
        this.displayPrefs = instance.getData();
    }

    set(name, value, enableOnServer) {
        const userId = this.currentUserId;
        const currentValue = this.get(name, enableOnServer);
        const result = appSettings.set(name, value, userId);

        if (enableOnServer !== false && this.displayPrefs) {
            this.displayPrefs.CustomPrefs[name] = value == null ? value : value.toString();
            saveServerPreferences(this);
        }

        if (currentValue !== value) {
            Events.trigger(this, 'change', [name]);
        }

        return result;
    }

    get(name, enableOnServer) {
        const userId = this.currentUserId;
        if (enableOnServer !== false && this.displayPrefs) {
            return this.displayPrefs.CustomPrefs[name];
        }

        return appSettings.get(name, userId);
    }

    serverConfig(config) {
        const apiClient = this.currentApiClient;
        if (config) {
            return apiClient.updateUserConfiguration(this.currentUserId, config);
        }

        return apiClient.getUser(this.currentUserId).then(function (user) {
            return user.Configuration;
        });
    }

    allowedAudioChannels(val) {
        if (val !== undefined) {
            return this.set('allowedAudioChannels', val, false);
        }

        return this.get('allowedAudioChannels', false) || '-1';
    }

    preferFmp4HlsContainer(val) {
        if (val !== undefined) {
            return this.set('preferFmp4HlsContainer', val.toString(), false);
        }

        return toBoolean(this.get('preferFmp4HlsContainer', false), browser.safari || browser.firefox || browser.chrome || browser.edgeChromium);
    }

    enableCinemaMode(val) {
        if (val !== undefined) {
            return this.set('enableCinemaMode', val.toString(), false);
        }

        return toBoolean(this.get('enableCinemaMode', false), true);
    }

    selectAudioNormalization(val) {
        if (val !== undefined) {
            return this.set('selectAudioNormalization', val, false);
        }

        return this.get('selectAudioNormalization', false) || 'TrackGain';
    }

    enableNextVideoInfoOverlay(val) {
        if (val !== undefined) {
            return this.set('enableNextVideoInfoOverlay', val.toString());
        }

        return toBoolean(this.get('enableNextVideoInfoOverlay', false), true);
    }

    enableVideoRemainingTime(val) {
        if (val !== undefined) {
            return this.set('enableVideoRemainingTime', val.toString());
        }

        return toBoolean(this.get('enableVideoRemainingTime', false), true);
    }

    enableThemeSongs(val) {
        if (val !== undefined) {
            return this.set('enableThemeSongs', val.toString(), false);
        }

        return toBoolean(this.get('enableThemeSongs', false), false);
    }

    enableThemeVideos(val) {
        if (val !== undefined) {
            return this.set('enableThemeVideos', val.toString(), false);
        }

        return toBoolean(this.get('enableThemeVideos', false), false);
    }

    enableFastFadein(val) {
        if (val !== undefined) {
            return this.set('fastFadein', val.toString(), false);
        }

        return toBoolean(this.get('fastFadein', false), true);
    }

    enableBlurhash(val) {
        if (val !== undefined) {
            return this.set('blurhash', val.toString(), false);
        }

        return toBoolean(this.get('blurhash', false), true);
    }

    enableBackdrops(val) {
        if (val !== undefined) {
            return this.set('enableBackdrops', val.toString(), false);
        }

        return toBoolean(this.get('enableBackdrops', false), false);
    }

    disableCustomCss(val) {
        if (val !== undefined) {
            return this.set('disableCustomCss', val.toString(), false);
        }

        return toBoolean(this.get('disableCustomCss', false), false);
    }

    customCss(val) {
        if (val !== undefined) {
            return this.set('customCss', val.toString(), false);
        }

        return this.get('customCss', false);
    }

    detailsBanner(val) {
        if (val !== undefined) {
            return this.set('detailsBanner', val.toString(), false);
        }

        return toBoolean(this.get('detailsBanner', false), true);
    }

    useEpisodeImagesInNextUpAndResume(val) {
        if (val !== undefined) {
            return this.set('useEpisodeImagesInNextUpAndResume', val.toString(), true);
        }

        return toBoolean(this.get('useEpisodeImagesInNextUpAndResume', true), false);
    }

    language(val) {
        if (val !== undefined) {
            return this.set('language', val.toString(), false);
        }

        return this.get('language', false);
    }

    dateTimeLocale(val) {
        if (val !== undefined) {
            return this.set('datetimelocale', val.toString(), false);
        }

        return this.get('datetimelocale', false);
    }

    skipBackLength(val) {
        if (val !== undefined) {
            return this.set('skipBackLength', val.toString());
        }

        return parseInt(this.get('skipBackLength') || '10000', 10);
    }

    skipForwardLength(val) {
        if (val !== undefined) {
            return this.set('skipForwardLength', val.toString());
        }

        return parseInt(this.get('skipForwardLength') || '30000', 10);
    }

    dashboardTheme(val) {
        if (val !== undefined) {
            return this.set('dashboardTheme', val);
        }

        return this.get('dashboardTheme');
    }

    skin(val) {
        if (val !== undefined) {
            return this.set('skin', val, false);
        }

        return this.get('skin', false);
    }

    theme(val) {
        if (val !== undefined) {
            return this.set('appTheme', val, false);
        }

        return this.get('appTheme', false);
    }

    screensaver(val) {
        if (val !== undefined) {
            return this.set('screensaver', val, false);
        }

        return this.get('screensaver', false);
    }

    backdropScreensaverInterval(val) {
        if (val !== undefined) {
            return this.set('backdropScreensaverInterval', val.toString(), false);
        }

        return parseInt(this.get('backdropScreensaverInterval', false), 10) || 5;
    }

    libraryPageSize(val) {
        if (val !== undefined) {
            return this.set('libraryPageSize', val.toString(), false);
        }

        const libraryPageSize = parseInt(this.get('libraryPageSize', false), 10);
        if (libraryPageSize === 0) {
            return 0;
        } else {
            return libraryPageSize || 100;
        }
    }

    maxDaysForNextUp(val) {
        if (val !== undefined) {
            return this.set('maxDaysForNextUp', val.toString(), false);
        }

        const maxDaysForNextUp = parseInt(this.get('maxDaysForNextUp', false), 10);
        if (maxDaysForNextUp === 0) {
            return 0;
        } else {
            return maxDaysForNextUp || 365;
        }
    }

    enableRewatchingInNextUp(val) {
        if (val !== undefined) {
            return this.set('enableRewatchingInNextUp', val.toString(), false);
        }

        return toBoolean(this.get('enableRewatchingInNextUp', false), false);
    }

    soundEffects(val) {
        if (val !== undefined) {
            return this.set('soundeffects', val, false);
        }

        return this.get('soundeffects', false);
    }

    loadQuerySettings(key, query) {
        let values = this.get(key);
        if (values) {
            values = JSON.parse(values);
            return Object.assign(query, values);
        }

        return query;
    }

    saveQuerySettings(key, query) {
        const values = {};
        if (query.SortBy) {
            values.SortBy = query.SortBy;
        }

        if (query.SortOrder) {
            values.SortOrder = query.SortOrder;
        }

        return this.set(key, JSON.stringify(values));
    }

    getSavedView(key) {
        return this.get(key + '-_view');
    }

    saveViewSetting(key, value) {
        return this.set(key + '-_view', value);
    }

    getSubtitleAppearanceSettings(key) {
        key = key || 'localplayersubtitleappearance3';
        return Object.assign(defaultSubtitleAppearanceSettings, JSON.parse(this.get(key, false) || '{}'));
    }

    setSubtitleAppearanceSettings(value, key) {
        key = key || 'localplayersubtitleappearance3';
        return this.set(key, JSON.stringify(value), false);
    }

    getComicsPlayerSettings(mediaSourceId) {
        const settings = JSON.parse(this.get('comicsPlayerSettings', false) || '{}');
        return Object.assign(defaultComicsPlayerSettings, settings[mediaSourceId]);
    }

    setComicsPlayerSettings(value, mediaSourceId) {
        const settings = JSON.parse(this.get('comicsPlayerSettings', false) || '{}');
        settings[mediaSourceId] = value;
        return this.set('comicsPlayerSettings', JSON.stringify(settings), false);
    }

    setFilter(key, value) {
        return this.set(key, value, true);
    }

    getFilter(key) {
        return this.get(key, true);
    }

    getSortValuesLegacy(key, defaultSortBy) {
        return {
            sortBy: this.getFilter(key + '-sortby') || defaultSortBy,
            sortOrder: this.getFilter(key + '-sortorder') === 'Descending' ? 'Descending' : 'Ascending'
        };
    }

    // Theme-related methods
    saveUserThemeSyncPreference(sync) {
        localStorage.setItem('userThemeSync', sync);
    }

    saveUserLightThemePreference(theme) {
        localStorage.setItem('userLightTheme', theme);
    }

    saveUserDarkThemePreference(theme) {
        localStorage.setItem('userDarkTheme', theme);
    }

    getUserThemeSyncPreference() {
        return JSON.parse(localStorage.getItem('userThemeSync')) || false;
    }

    getUserLightThemePreference() {
        return localStorage.getItem('userLightTheme') || 'light';
    }

    getUserDarkThemePreference() {
        return localStorage.getItem('userDarkTheme') || 'dark';
    }
}

export const currentSettings = new UserSettings;

// Wrappers for non-ES6 modules and backward compatibility
export const setUserInfo = currentSettings.setUserInfo.bind(currentSettings);
export const getData = currentSettings.getData.bind(currentSettings);
export const importFrom = currentSettings.importFrom.bind(currentSettings);
export const set = currentSettings.set.bind(currentSettings);
export const get = currentSettings.get.bind(currentSettings);
export const serverConfig = currentSettings.serverConfig.bind(currentSettings);
export const allowedAudioChannels = currentSettings.allowedAudioChannels.bind(currentSettings);
export const preferFmp4HlsContainer = currentSettings.preferFmp4HlsContainer.bind(currentSettings);
export const enableCinemaMode = currentSettings.enableCinemaMode.bind(currentSettings);
export const selectAudioNormalization = currentSettings.selectAudioNormalization.bind(currentSettings);
export const enableNextVideoInfoOverlay = currentSettings.enableNextVideoInfoOverlay.bind(currentSettings);
export const enableVideoRemainingTime = currentSettings.enableVideoRemainingTime.bind(currentSettings);
export const enableThemeSongs = currentSettings.enableThemeSongs.bind(currentSettings);
export const enableThemeVideos = currentSettings.enableThemeVideos.bind(currentSettings);
export const enableFastFadein = currentSettings.enableFastFadein.bind(currentSettings);
export const enableBlurhash = currentSettings.enableBlurhash.bind(currentSettings);
export const enableBackdrops = currentSettings.enableBackdrops.bind(currentSettings);
export const detailsBanner = currentSettings.detailsBanner.bind(currentSettings);
export const useEpisodeImagesInNextUpAndResume = currentSettings.useEpisodeImagesInNextUpAndResume.bind(currentSettings);
export const language = currentSettings.language.bind(currentSettings);
export const dateTimeLocale = currentSettings.dateTimeLocale.bind(currentSettings);
export const skipBackLength = currentSettings.skipBackLength.bind(currentSettings);
export const skipForwardLength = currentSettings.skipForwardLength.bind(currentSettings);
export const dashboardTheme = currentSettings.dashboardTheme.bind(currentSettings);
export const skin = currentSettings.skin.bind(currentSettings);
export const theme = currentSettings.theme.bind(currentSettings);
export const screensaver = currentSettings.screensaver.bind(currentSettings);
export const backdropScreensaverInterval = currentSettings.backdropScreensaverInterval.bind(currentSettings);
export const libraryPageSize = currentSettings.libraryPageSize.bind(currentSettings);
export const maxDaysForNextUp = currentSettings.maxDaysForNextUp.bind(currentSettings);
export const enableRewatchingInNextUp = currentSettings.enableRewatchingInNextUp.bind(currentSettings);
export const soundEffects = currentSettings.soundEffects.bind(currentSettings);
export const loadQuerySettings = currentSettings.loadQuerySettings.bind(currentSettings);
export const saveQuerySettings = currentSettings.saveQuerySettings.bind(currentSettings);
export const getSubtitleAppearanceSettings = currentSettings.getSubtitleAppearanceSettings.bind(currentSettings);
export const setSubtitleAppearanceSettings = currentSettings.setSubtitleAppearanceSettings.bind(currentSettings);
export const getComicsPlayerSettings = currentSettings.getComicsPlayerSettings.bind(currentSettings);
export const setComicsPlayerSettings = currentSettings.setComicsPlayerSettings.bind(currentSettings);
export const setFilter = currentSettings.setFilter.bind(currentSettings);
export const getFilter = currentSettings.getFilter.bind(currentSettings);
export const customCss = currentSettings.customCss.bind(currentSettings);
export const disableCustomCss = currentSettings.disableCustomCss.bind(currentSettings);
export const getSavedView = currentSettings.getSavedView.bind(currentSettings);
export const saveViewSetting = currentSettings.saveViewSetting.bind(currentSettings);
export const getSortValuesLegacy = currentSettings.getSortValuesLegacy.bind(currentSettings);

// Exporting theme-related functions for external use
export const saveUserThemeSyncPreference = currentSettings.saveUserThemeSyncPreference.bind(currentSettings);
export const saveUserLightThemePreference = currentSettings.saveUserLightThemePreference.bind(currentSettings);
export const saveUserDarkThemePreference = currentSettings.saveUserDarkThemePreference.bind(currentSettings);
export const getUserThemeSyncPreference = currentSettings.getUserThemeSyncPreference.bind(currentSettings);
export const getUserLightThemePreference = currentSettings.getUserLightThemePreference.bind(currentSettings);
export const getUserDarkThemePreference = currentSettings.getUserDarkThemePreference.bind(currentSettings);
