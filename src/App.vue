<script setup lang="ts">
import Search from "@components/search.vue";
import Table from "@components/table.vue";
import { ref } from "vue";

const searchValue = ref("");
</script>

<template>
    <Search
        @click-search="
            (value) => {
                searchValue = value;
            }
        "
    />
    <Table :search-value="searchValue" />
</template>

<style>
@import "tailwindcss";

body {
    margin: 0;
}
</style>
