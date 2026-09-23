<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore();
</script>

<template>
  <header class="bg-slate-800 p-4 shadow-md">
    <nav class="container mx-auto flex justify-between items-center">
      <RouterLink :to="{ name: 'home' }" class="nav-link text-xl font-bold">Home</RouterLink>
      
      <div v-if="authStore.user" class="flex items-center space-x-6">
        <p class="text-sm text-slate-300">Welcome back {{ authStore.user.name }}</p>
        <RouterLink :to="{ name: 'create' }" class="nav-link">New Post</RouterLink>
        <form @submit.prevent="authStore.logout">
          <button class="nav-link">Logout</button>
        </form>
      </div>
      <div v-else class="flex space-x-4">
        <RouterLink :to="{ name: 'register' }" class="nav-link">Register</RouterLink>
        <RouterLink :to="{ name: 'login' }" class="nav-link">Login</RouterLink>
      </div>
    </nav>
  </header>
  
  <div class="container mx-auto p-4 mt-6">
    <RouterView />
  </div>
</template>
