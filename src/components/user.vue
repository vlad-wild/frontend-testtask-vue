<script setup lang="ts">
import { useAPIStore } from "@/store";
import { onMounted, ref } from "vue";

interface User {
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
    company: {
        name: string;
    };
    address: {
        street: string;
        suite: string;
        city: string;
    };
}

const store = useAPIStore();

const user = ref<User | null>(null);

const props = defineProps<{
    email: string;
}>();

// Поиск пользователя по email из кэша users
function searchUserByEmail(email: string) {
    return store.users.find((user) => {
        if (user.email === email) {
            return user;
        }
    });
}

onMounted(async () => {
    user.value = searchUserByEmail(props.email);
});
const emit = defineEmits<{
    (event: "close"): void;
}>();
</script>

<template>
    <div
        id="modal-bg"
        class="absolute left-[0] top-[0] w-screen h-screen z-11 backdrop-blur-sm flex justify-center items-center"
        @click.self="emit('close')"
    >
        <div
            id="modal-info"
            class="bg-white shadow-md border border-gray-300 p-6 pt-4"
        >
            <div class="flex justify-end mb-2">
                <button
                    type="button"
                    class="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    @click="emit('close')"
                    aria-label="Закрыть"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            <div
                class="text-right mb-10 border-2 border-gray-300 p-2 rounded-md"
            >
                <p class="text-xs text-right border-gray-300">Автор поста:</p>
                <h3 class="font-medium text-2xl">{{ user?.name }}</h3>
                <p>{{ user?.username }}</p>
                <a class="underline" :href="'mailto:' + user?.email">{{
                    user?.email
                }}</a>
            </div>

            <div
                class="flex justify-between items-center border-b border-gray-300 pt-3"
            >
                <span class="text-xs text-center">Номер телефона:</span>
                {{ user?.phone }}
            </div>

            <div
                class="flex justify-between items-center border-b border-gray-300 pt-3"
            >
                <span class="text-xs text-center">Сайт:</span>
                <a
                    class="underline"
                    :href="'http://' + user?.website"
                    target="_blank"
                    >{{ user?.website }}</a
                >
            </div>

            <div
                class="flex justify-between items-center border-b border-gray-300 pt-3"
            >
                <span class="text-xs text-center">Компания:</span>
                {{ user?.company.name }}
            </div>
            <div class="border-b border-gray-300 pt-3">
                <p class="text-xs">Адрес:</p>
                <p>
                    {{ user?.address.street }}, {{ user?.address.suite }},
                    {{ user?.address.city }}
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#modal-info {
    width: 350px;
    height: 500px;
    border-radius: 10px;
}
</style>
