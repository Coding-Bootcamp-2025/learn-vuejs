import { defineStore } from "pinia";

export const usePostsStore = defineStore('postsStore', {
  state: () => {
    return {
      posts: [],
      post: null,
      errors: {}
    }
  },
  actions: {
    // Get all posts
    async getPosts() {
      const res = await fetch('/api/posts');
      const data = await res.json();
      this.posts = data;
    },
    // Get a post
    async getPost(id) {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      this.post = data;
    },
    // Create a post
    async createPost(formData) {
      const res = await fetch('/api/posts', {
        method: 'post',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.errors) {
        this.errors = data.errors
      } else {
        this.errors = {};
        this.router.push({ name: 'home' })
      }
    },
    // Update a post
    async updatePost(id, formData) {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'put',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(data.errors) {
        this.errors = data.errors
      } else {
        this.errors = {};
        this.router.push({ name: 'home' })
      }
    },
    // Delete a post
    async deletePost(id) {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'delete',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      if (res.ok) {
        this.getPosts();
      }
    }
  }
})
