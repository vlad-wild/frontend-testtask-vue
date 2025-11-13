<script setup lang="ts">
import UserModal from "@components/user.vue";
import { onMounted, ref, shallowRef, nextTick, watch } from "vue";
import { useAPIStore } from "@/store";

interface Row {
    id: number;
    title: string;
    author: string;
    body: string;
}

const props = defineProps<{ searchValue: string }>();

const store = useAPIStore();
const rows = shallowRef<Row[]>([]);
const displayedRows = ref<Row[]>([]);
const itemsPerPage = 30;
const currentSort = ref<{ key: keyof Row | null; asc: boolean }>({
    key: null,
    asc: true,
});

// Словарь для сопоставления заголовков и полей
const headerKeyMap: Record<string, keyof Row> = {
    ID: "id",
    Заголовок: "title",
    Автор: "author",
    Контент: "body",
};

onMounted(async () => {
    if (!store.posts || !store.users) {
        await Promise.all([store.fetchPosts(), store.fetchUsers()]);
    }

    // Собираем строки: post + email автора
    rows.value = store.posts!.map((post) => {
        const user = store.users!.find((u) => u.id === post.userId);
        return {
            id: post.id,
            title: post.title,
            author: user?.email || "unknown",
            body: post.body,
        };
    });

    // Сортируем по ID по умолчанию
    sortData("id", true);
});

watch(
    () => props.searchValue,
    async (searchValue) => {
        if (searchValue.length > 0) {
            rows.value = store.searchedPosts!.map((post) => {
                const user = store.users!.find((u) => u.id === post.userId);
                return {
                    id: post.id,
                    title: post.title,
                    author: user?.email || "unknown",
                    body: post.body,
                };
            });
        } else {
            rows.value = store.posts!.map((post) => {
                const user = store.users!.find((u) => u.id === post.userId);
                displayedRows.value = rows.value.slice(0, itemsPerPage);
                return {
                    id: post.id,
                    title: post.title,
                    author: user?.email || "unknown",
                    body: post.body,
                };
            });
        }
        // Перезагружаем отображаемые строки
        displayedRows.value = [];
        nextTick(() => {
            loadMore();
        });
    }
);

// Подгрузка первых 30 строк
const loadMore = () => {
    const currentLength = displayedRows.value.length;
    const nextBatch = rows.value.slice(
        currentLength,
        currentLength + itemsPerPage
    );
    displayedRows.value.push(...nextBatch);
};

// Сортировка
const sortData = (key: keyof Row, forceAsc = false) => {
    const isAsc = currentSort.value.key === key ? !currentSort.value.asc : true;
    currentSort.value = { key, asc: forceAsc || isAsc };

    rows.value.sort((a, b) => {
        let aVal = a[key];
        let bVal = b[key];

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return isAsc ? -1 : 1;
        if (aVal > bVal) return isAsc ? 1 : -1;
        return 0;
    });

    // Перезагружаем отображаемые строки
    displayedRows.value = [];
    nextTick(() => {
        loadMore();
    });
};

// Обработчик клика по заголовку
const onHeaderClick = (label: string) => {
    const key = headerKeyMap[label];
    if (key) sortData(key);
};

// Обработчик скролла
const onScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 5) {
        if (displayedRows.value.length < rows.value.length) {
            loadMore();
        }
    }
};

const showModalUser = ref(false);
const userEmail = ref("");
// Обработчик клика по автору поста
function handleAuthorClick(email: string) {
    showModalUser.value = true;
    userEmail.value = email;
}
</script>

<template>
    <div id="container" class="ml-auto mr-auto mt-4" @scroll.passive="onScroll">
        <table ref="table">
            <thead class="bg-gray-300 border-b border-gray-400">
                <tr>
                    <th
                        :class="
                            currentSort.key == 'id'
                                ? 'bg-blue-500 text-white text-shadow-md'
                                : ''
                        "
                        class="p-1 border-r border-gray-400 w-1/11 cursor-pointer hover:text-shadow-md"
                        @click="onHeaderClick('ID')"
                    >
                        ID
                    </th>
                    <th
                        :class="
                            currentSort.key == 'title'
                                ? 'bg-blue-500 text-white text-shadow-md'
                                : ''
                        "
                        class="p-1 border-r border-gray-400 cursor-pointer hover:text-shadow-md"
                        @click="onHeaderClick('Заголовок')"
                    >
                        Заголовок
                    </th>
                    <th
                        :class="
                            currentSort.key == 'author'
                                ? 'bg-blue-500 text-white text-shadow-md'
                                : ''
                        "
                        class="p-1 border-r border-gray-400 cursor-pointer hover:text-shadow-md"
                        @click="onHeaderClick('Автор')"
                    >
                        Автор
                    </th>
                    <th
                        :class="
                            currentSort.key == 'body'
                                ? 'bg-blue-500 text-white text-shadow-md'
                                : ''
                        "
                        class="p-1 cursor-pointer hover:text-shadow-md"
                        @click="onHeaderClick('Контент')"
                    >
                        Контент
                    </th>
                </tr>
            </thead>
            <tbody v-if="!store.loading">
                <tr
                    class="even:bg-gray-200 odd:border-b odd:border-gray-300"
                    v-for="row in displayedRows"
                    :key="row.id"
                >
                    <td
                        class="p-1 border-r border-gray-300"
                        :title="row.id.toString()"
                    >
                        {{ row.id }}
                    </td>
                    <td class="p-1 border-r border-gray-300" :title="row.title">
                        {{ row.title }}
                    </td>
                    <td
                        class="p-1 border-r border-gray-300 cursor-pointer hover:underline"
                        :title="row.author"
                        @click="handleAuthorClick(row.author)"
                    >
                        {{ row.author }}
                    </td>
                    <td class="p-1" :title="row.body">{{ row.body }}</td>
                </tr>
            </tbody>
            <tbody v-if="store.loading">
                <tr
                    v-for="_ in 20"
                    class="even:bg-gray-200 odd:border-b odd:border-gray-300 animate-pulse"
                >
                    <td class="p-1 border-r border-gray-300">
                        <div
                            class="bg-gray-300 rounded-md"
                            style="height: 1em"
                        ></div>
                    </td>
                    <td class="p-1 border-r border-gray-300">
                        <div
                            class="bg-gray-300 rounded-md"
                            style="height: 1em"
                        ></div>
                    </td>
                    <td class="p-1 border-r border-gray-300">
                        <div
                            class="bg-gray-300 rounded-md"
                            style="height: 1em"
                        ></div>
                    </td>
                    <td class="p-1 border-r border-gray-300">
                        <div
                            class="bg-gray-300 rounded-md"
                            style="height: 1em"
                        ></div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <UserModal
        v-if="showModalUser"
        :email="userEmail"
        @close="
            () => {
                showModalUser = false;
            }
        "
    />
</template>

<style lang="scss" scoped>
#container {
    max-width: 600px;
    max-height: 600px;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;

    table {
        font-size: 14px;
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        border-spacing: 0;

        thead {
            position: sticky;
            top: 0;
            z-index: 10;
        }

        td {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
</style>
