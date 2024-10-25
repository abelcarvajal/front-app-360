<template>
    <div class="mode-toggle">
        <input type="checkbox" id="darkmode-toggle" />
        <label class="darkmode-toggle" for="darkmode-toggle">
            <el-icon><Sunny /></el-icon>
            <el-icon><Moon /></el-icon>
        </label>
    </div>
</template>

<script lang="ts" setup>
import {
    Sunny,
    Moon,
} from "@element-plus/icons-vue";
</script>

<script lang="ts">

export default {
    data() {
        return {};
    },
    mounted() {
        // identify the toggle switch HTML element
        const toggleSwitch = document.querySelector<HTMLInputElement>('input#darkmode-toggle[type="checkbox"]');

        // listener for changing themes
        toggleSwitch!.addEventListener('change', this.switchTheme, false);

        // get the localStorage theme value if it exists set the theme to the value
        const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
        currentTheme && document.documentElement.setAttribute('data-theme', currentTheme);

        // pre-check the dark-theme checkbox if dark-theme is set
        if (document.documentElement.getAttribute("data-theme") == "dark") {
            toggleSwitch!.checked = true;
        }
    },

    methods: {
        // function that changes the theme, and sets a localStorage variable to track the theme between page loads
        switchTheme(e: Event) {
            const toggleSwitch = document.querySelector<HTMLInputElement>('input#darkmode-toggle[type="checkbox"]');
            if ((<HTMLInputElement>e.target).checked) {
                localStorage.setItem('theme', 'dark');
                document.documentElement.setAttribute('data-theme', 'dark');
                toggleSwitch!.checked = true;
            } else {
                localStorage.setItem('theme', 'light');
                document.documentElement.setAttribute('data-theme', 'light');
                toggleSwitch!.checked = false;
            }
        },
    },
};
</script>