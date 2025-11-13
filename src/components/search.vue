<script setup lang="ts">
import { useAPIStore } from "@/store";
import { ref } from "vue";

const store = useAPIStore();

const emit = defineEmits<{
    (e: "clickSearch", value: string): void;
}>();

const value = ref("");
const loading = ref(false);
const lastSearch = ref("");

// Обработка клика на кнопку поиска с передачей значения родителю
async function searchHandle() {
    if (loading.value) return;
    if (value.value === lastSearch.value) return;

    loading.value = true;
    store.loading = true;
    lastSearch.value = value.value;
    await store.searchPosts(value.value).then(() => {
        loading.value = false;
        store.loading = false;
        emit("clickSearch", value.value);
    });
}
</script>

<template>
    <header
        @keypress.enter="searchHandle"
        id="header"
        class="text-sm bg-white border-b border-gray-300 shadow-md h-16 flex items-center justify-center gap-4"
    >
        <input
            v-model="value"
            type="search"
            placeholder="Введите запрос..."
            class="bg-gray-100 p-1 pl-4 pr-4 rounded-sm shadow-md border border-gray-300 h-8 w-xl focus:outline-none ml-1"
            :class="{
                'animate-pulse': loading,
                'animate-none': !loading,
                'bg-gray-300': loading,
                'text-gray-500': loading,
            }"
        />
        <button
            @click="searchHandle"
            class="bg-blue-500 p-1 text-white rounded-sm shadow-md h-8 cursor-pointer mr-1 hover:text-shadow-lg hover:bg-blue-600"
            :class="{
                'animate-pulse': loading,
                'animate-none': !loading,
                'bg-gray-300': loading,
                'text-gray-500': loading,
            }"
        >
            Найти
        </button>
    </header>
</template>
