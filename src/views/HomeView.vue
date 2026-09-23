<script setup>
import { onMounted } from 'vue';
import { usePostsStore } from '@/stores/posts';
import { storeToRefs } from 'pinia';

const postsStore = usePostsStore();
const { posts } = storeToRefs(postsStore);

onMounted(() => {
  postsStore.getPosts();
});
</script>

<template>
  <main class="container mx-auto p-4">
    <h1 class="title mb-6">Latest Posts</h1>
    
    <div v-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="post in posts" :key="post.id" class="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 class="text-xl font-bold mb-2 text-slate-800">{{ post.title }}</h2>
        <p class="text-slate-600 mb-4">{{ post.body }}</p>
        <div class="text-sm text-slate-400">
          Posted by {{ post.author }}
        </div>
      </div>
    </div>
    
    <div v-else class="text-center text-slate-500 py-10">
      <p>No posts available yet. Create one!</p>
    </div>
  </main>
</template>
