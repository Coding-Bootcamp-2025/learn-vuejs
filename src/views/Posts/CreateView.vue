<script setup>
import { usePostsStore } from '@/stores/posts';
import { storeToRefs } from 'pinia';
import { reactive, onMounted } from 'vue';

const { createPost } = usePostsStore();
const { errors } = storeToRefs(usePostsStore());

const formData = reactive({
  title: '',
  body: '',
});

onMounted(() => {
  errors.value = {};
});
</script>

<template>
  <main>
    <h1 class="title">Create a new post</h1>
    <form @submit.prevent="createPost(formData)" class="w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Post Title" v-model="formData.title" />
        <p v-if="errors.title" class="error">{{ errors.title[0] }}</p>
      </div>
      <div>
        <textarea rows="6" placeholder="Post Content" v-model="formData.body"></textarea>
        <p v-if="errors.body" class="error">{{ errors.body[0] }}</p>
      </div>
      <button class="primary-btn">Create</button>
    </form>
  </main>
</template>
