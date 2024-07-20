<template>
    <div>
        <div class="setting-item">
            <label for="match-system-theme">Match System Theme</label>
            <input type="checkbox" id="match-system-theme" v-model="matchSystemTheme" @change="onMatchSystemThemeChange">
        </div>
    </div>
</template>

<script lang="ts">
import { getSystemTheme, applySystemTheme } from '@/utils/theme';
import Vue from 'vue';

export default Vue.extend({
    data() {
        return {
            matchSystemTheme: false,
        };
    },
    methods: {
        onMatchSystemThemeChange() {
            if (this.matchSystemTheme) {
                applySystemTheme();
                window.matchMedia('(prefers-color-scheme: dark)').addListener(this.applySystemThemeListener);
                window.matchMedia('(prefers-color-scheme: light)').addListener(this.applySystemThemeListener);
            } else {
                window.matchMedia('(prefers-color-scheme: dark)').removeListener(this.applySystemThemeListener);
                window.matchMedia('(prefers-color-scheme: light)').removeListener(this.applySystemThemeListener);
            }
        },
        applySystemThemeListener(event: MediaQueryListEvent) {
            if (event.matches) {
                applySystemTheme();
            }
        }
    },
    mounted() {
        const storedPreference = localStorage.getItem('matchSystemTheme');
        if (storedPreference) {
            this.matchSystemTheme = JSON.parse(storedPreference);
            if (this.matchSystemTheme) {
                applySystemTheme();
            }
        }
    },
    watch: {
        matchSystemTheme(newValue: boolean) {
            localStorage.setItem('matchSystemTheme', JSON.stringify(newValue));
        }
    }
});
</script>

<style scoped>
.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
}
</style>
