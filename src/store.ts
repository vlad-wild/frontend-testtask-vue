import { defineStore } from "pinia";
import { ref } from "vue";

class User {
    name: string;
    id: number;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
    };
    phone: string;
    website: string;
    company: {
        name: string;
    };

    static async fetchUsers(): Promise<User[]> {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );
        return await response.json();
    }

    static async fetchUser(userId: number): Promise<User> {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        return await response.json();
    }
}

class Post {
    userId: number;
    id: number;
    title: string;
    body: string;

    static async fetchPosts(): Promise<Post[]> {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts"
        );
        return await response.json();
    }

    static async fetchPost(postId: number): Promise<Post> {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${postId}`
        );
        return await response.json();
    }

    static async searchPosts(query: string): Promise<Post[]> {
        const trimmed = query.trim();
        if (!trimmed) return [];

        const encodedQuery = encodeURIComponent(trimmed);
        const url = `https://jsonplaceholder.typicode.com/posts?title_like=${encodedQuery}`;

        const response = await fetch(url);
        return await response.json();
    }
}

export const useAPIStore = defineStore("api", () => {
    const users = ref<User[]>();
    const posts = ref<Post[]>();
    const searchedPosts = ref<Post[]>([]);
    const loading = ref(false);

    async function fetchUsers() {
        users.value = await User.fetchUsers();
    }

    async function fetchPosts() {
        posts.value = await Post.fetchPosts();
    }

    async function searchPosts(query: string) {
        searchedPosts.value = await Post.searchPosts(query);
    }

    return {
        users,
        posts,
        searchedPosts,
        fetchUsers,
        fetchPosts,
        searchPosts,
        loading,
    };
});
