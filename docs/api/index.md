---
lastUpdated: false
editLink: false
sidebar: false
footer: false
aside: false
prev: false
next: false
---

# APIs Disponíveis

<hr>

<div style="display: flex; flex-wrap: wrap; gap: 12px;">
    <div v-for="(api, index) in apis" class="info custom-block" :key="index">
        <p class="custom-block-title custom-block-title-default">{{ api.group.toUpperCase() }}</p>
        <ul v-for="(method, index) in api.methods" :key="index">
            <li>
                <a :href="method.link">{{ method.text }}</a>
            </li>
        </ul>
    </div>
</div>

<script lang="ts" setup>
const apis = [
    {
        group: "Componentes",
        methods: [
            { text: "Button", link: "./components/button" },
            { text: "Checkbox", link: "./components/checkbox" },
            { text: "Content Area", link: "./components/sections/section" },
            { text: "Form", link: "./components/form" },
            { text: "Grid", link: './components/grid/container' },
            { text: "Main", link: './components/main' },
            { text: "Table", link: "./components/table" },
            { text: "TextField", link: "./components/text-field" }
        ]
    },
    {
        group: "Composables",
        methods: [
            { text: "useToast", link: "./composables/use-toast" },
            { text: "useRunOrToast", link: "./composables/use-run-or-toast" },
        ]
    },
];
</script>
