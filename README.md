---

# **FrontEnd Vue - Login Register**

---

1. Install Project Vue (Pilih Route dan Pinia)
2. Install Tailwindcss

```bash
npm install tailwindcss @tailwindcss/vite
```

3. ikuti langkah config di dokumentasi tailwindnya
4. hapus semua isi assets/main.css ganti dengan file tailwind_classes template kecuali @import tailwind
5. hapus isi HomeView.vue, ganti menjadi seperti ini

```vue
<script setup>
import TheWelcome from '../components/TheWelcome.vue'
</script>
<template>
  <main>
    <h1 class="title">Latest Post</h1>
  </main>
</template>
```

6. hapus isi App.vue, ganti jadi seperti ini

```vue
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
  <header>
    <nav>
      <RouterLink to="/" class="nav-link">Home</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>
```

7. Daftarkan server api ke project vue, edit file vite.config.js

```vue
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://test-backend-api.test",
        changeOrigin: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    },
  },
```

8. Buat halaman view untuk register, views/Auth/RegisterView.vue

```vue
<script setup>
</script>
<template>
  <main>
    <h1 class="title">Register a new account</h1>
  </main>
</template>
```

9. Edit App.vue, tambahkan navbar link ke register

```vue
  <header>
    <nav>
      <RouterLink to="/" class="nav-link">Home</RouterLink>
      <div>
        <RouterLink to="/register" class="nav-link">Register</RouterLink>
      </div>
    </nav>
  </header>
```

10. edit router/[index.js](http://index.js), tambahkan route ke register

```vue
import RegisterView from '@/views/Auth/RegisterView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
  ],
})
```

11. ubah route link menggunakan name route nya di app.vue

```vue
  <header>
    <nav>
      <RouterLink :to="{ name: 'home' }" class="nav-link">Home</RouterLink>
      <div>
        <RouterLink :to="{ name: 'register' }" class="nav-link">Register</RouterLink>
      </div>
    </nav>
  </header>
```

12. Edit halaman RegisterView.vue

```vue
<template>
  <main>
    <h1 class="title">Register a new account</h1>
    <form action="" class="w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Name" />
      </div>
      <div>
        <input type="email" placeholder="Email" />
      </div>
      <div>
        <input type="password" placeholder="Password" />
      </div>
      <div>
        <input type="password" placeholder="Confirm Password" />
      </div>
      <button class="primary-btn">Register</button>
    </form>
  </main>
</template>
```

13. tambahkan reactivite untuk menangkap data yang diisikan di form input

```vue
<script setup>
import { reactive } from 'vue';
const formData = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
})
</script>
<template>
  <main>
    <h1 class="title">Register a new account</h1>
    <form @submit.prevent="console.log(formData)"  class="w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Name" v-model="formData.name" />
      </div>
      <div>
        <input type="email" placeholder="Email" v-model="formData.email" />
      </div>
      <div>
        <input type="password" placeholder="Password" v-model="formData.password" />
      </div>
      <div>
        <input type="password" placeholder="Confirm Password" v-model="formData.password_confirmation" />
      </div>
      <button class="primary-btn">Register</button>
    </form>
  </main>
</template>
```

14. test data tertangkap dan tampil di console.log?
15. setelah data tertangkap, buat file [auth.js](http://auth.js) di dalam folder stores, dan buat function untuk memproses aunthentication.

```vue
import { defineStore } from "pinia";
export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
 //untuk menyimpan data variable yang diproses oleh action
    }
  },
  actions: {
    async authenticate() {
      const res = await fetch('/api/register', {
        method: 'post',
        body: JSON.stringify(formData),
      });
    }
  }
})
```

Pinia adalah state management library resmi untuk Vue.js (pengganti Vuex).

Sederhananya, Pinia digunakan untuk mengelola data (state) agar bisa dipakai di banyak komponen Vue tanpa harus melakukan props drilling (mengoper data bolak-balik lewat props & emit).

Konsep Utama di Pinia

1. Store

Tempat menyimpan state (data global).

Setiap store seperti sebuah "modul" (mirip file Vuex module).

2. State

Data yang disimpan di store.

Contoh: daftar produk, user login, keranjang belanja.

3. Getters

Mirip computed properties.

Untuk menghitung/olah data berdasarkan state.

4. Actions

Mirip methods.

Untuk melakukan operasi yang bisa mengubah state (sinkron/async).

16. agar bisa menangkap data dari formData dan alamat api nya bisa dinamis, tambahkan di parameter

```vue
import { defineStore } from "pinia";
export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
    }
  },
  actions: {
    async authenticate(*apiRoute*, *formData*) {
      const res = await fetch(\`/api/${*apiRoute*}\`, {
        method: 'post',
        body: JSON.stringify(*formData*),
      });
      const data = await res.json();
      console.log(data);
    }
  }
})
```

17. panggil function authenticate di RegisterView.vue, lalu coba register

```vue
const formData = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
})
const { authenticate } = useAuthStore();
</script>
<template>
  <main>
    <h1 class="title">Register a new account</h1>
    <form @submit.prevent="authenticate('register', formData)" class="w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Name" v-model="formData.name" />
      </div>
```

18. untuk membuat pesan error nya tampil perlu tambahkan variable ke state

```vue
import { defineStore } from "pinia";
export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      errors: {}
    }
  },
  actions: {
    async authenticate(*apiRoute*, *formData*) {
      const res = await fetch(\`/api/${*apiRoute*}\`, {
        method: 'post',
        body: JSON.stringify(*formData*),
      });
      const data = await res.json();
      if(data.errors) {
        this.errors = data.errors
      } else {
        console.log(data)
      }
    }
  }
})
```

19. tangkap data errors dari state ke RegisterView

```vue
<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';
const formData = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
})
const { errors } = storeToRefs(useAuthStore());
const { authenticate } = useAuthStore();
</script>
<template>
  <main>
    <h1 class="title">Register a new account</h1>
    <form @submit.prevent="authenticate('register', formData)" class="w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Name" v-model="formData.name" />
        <p v-if="errors.name" class="error">{{ errors.name[0] }}</p>
      </div>
      <div>
        <input type="email" placeholder="Email" v-model="formData.email" />
        <p v-if="errors.email" class="error">{{ errors.email[0] }}</p>
      </div>
      <div>
        <input type="password" placeholder="Password" v-model="formData.password" />
        <p v-if="errors.password" class="error">{{ errors.password[0] }}</p>
      </div>
      <div>
        <input type="password" placeholder="Confirm Password" v-model="formData.password_confirmation" />
      </div>
      <button class="primary-btn">Register</button>
    </form>
  </main>
</template>
```

20. test lagi validasi errornya, dan lakukan registrasi dengan data yang valid
21. akan muncul data informasi user dan token sanctum nya, tambahakn di stores/[auth.js](http://auth.js) untuk menyimpan token di localstorage

```vue
import { defineStore } from "pinia";
export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      user: null,
      errors: {},
    }
  },
  actions: {
    async authenticate(*apiRoute*, *formData*) {
      const res = await fetch(\`/api/${*apiRoute*}\`, {
        method: 'post',
        body: JSON.stringify(*formData*),
      });
      const data = await res.json();
      if(data.errors) {
        this.errors = data.errors
      } else {
  this.errors = {};
        localStorage.setItem('token', data.token)
        this.user = data.user
      }
    }
  }
})
```

22. setelah token berhasil di simpan dalam localStorage, buat redirect ke halaman home
23. Daftarkan route agar bisa diakses di state pinia, edit [main.js](http://main.js)

```vue
import './assets/main.css'
import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
const app = createApp(App)
const pinia = createPinia()
pinia.use(({*store*}) => {
  store.router = markRaw(router)
})
app.use(pinia)
app.use(router)
app.mount('#app')
```

24. Edit App.vue untuk mengambil nama user yang telah register untuk melihat apakah sudah berhasil login

```vue
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore();
</script>
<template>
  <header>
    <nav>
      <RouterLink :to="{ name: 'home' }" class="nav-link">Home</RouterLink>
      <p v-if="authStore.user" class="text-white">{{ authStore.user.name }}</p>
      <div>
        <RouterLink :to="{ name: 'register' }" class="nav-link">Register</RouterLink>
      </div>
    </nav>
  </header>
  <RouterView />
</template>
```

25. jika di refresh nama user nya akan hilang, karena state nya jadi kosong lagi, maka perlu buat get user authenticate ngambil dari api server, pastikan endpoint api /user laravel seperti ini

```vue
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
```

26. Buat action untuk get data melalui api/user di

```vue
import { defineStore } from "pinia";
export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      user: null,
      errors: {},
    }
  },
  actions: {
    // Get authenticated user
    async getUser() {
      if (localStorage.getItem("token")) {
        const res = await fetch("/api/user", {
          headers: {
            authorization: \`Bearer ${localStorage.getItem("token")}\`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          this.user = data;
        }
        console.log(data);
      }
    },
    // Login & Register User
    async authenticate(*apiRoute*, *formData*) {
```

27. panggil function getuser di App.vue

```vue
onMounted(() => {
  authStore.getUser();
});
```

28. sekarang buat login nya, buat file baru di views/Auth/LoginView.vue, copas isi dari register dan hapus name dan password confirmation

```vue
<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';
const formData = reactive({
  email: "",
  password: "",
})
const { errors } = storeToRefs(useAuthStore());
const { authenticate } = useAuthStore();
</script>
<template>
  <main>
    <h1 class="title">Login to your account</h1>
    <form @submit.prevent="authenticate('login', formData)" class="w-1/2 mx-auto space-y-6">
      <div>
        <input type="email" placeholder="Email" v-model="formData.email" />
        <p v-if="errors.email" class="error">{{ errors.email[0] }}</p>
      </div>
      <div>
        <input type="password" placeholder="Password" v-model="formData.password" />
        <p v-if="errors.password" class="error">{{ errors.password[0] }}</p>
      </div>
      <button class="primary-btn">Login</button>
    </form>
  </main>
</template>
```

29. Tambahkan button login di App.vue

```vue
  <header>
    <nav>
      <RouterLink :to="{ name: 'home' }" class="nav-link">Home</RouterLink>
      <p v-if="authStore.user" class="text-white">{{ authStore.user.name }}</p>
      <div>
        <RouterLink :to="{ name: 'register' }" class="nav-link">Register</RouterLink>
        <RouterLink :to="{ name: 'login' }" class="nav-link">Login</RouterLink>
      </div>
    </nav>
  </header>
```

30. Daftakan halaman LoginView di router/[index.js](http://index.js)

```vue
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
```

31. tes login
32. buat tombol logout di App.vue

```vue
<RouterLink :to="{ name: 'home' }" class="nav-link">Home</RouterLink>
      <div>
        <form>
          <button class="nav-link">Logout</button>
        </form>
      </div>
```

33. Buat method logout di stores/[auth.js](http://auth.js)

```vue
    // Logout user
    async logout() {
      const res = await fetch("/api/logout", {
        method: "post",
        headers: {
          authorization: \`Bearer ${localStorage.getItem("token")}\`,
        },
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        this.user = null;
        this.errors = {};
        localStorage.removeItem("token");
        this.router.push({ name: "home" });
      }
    },
```

34. Panggil method di button logout

```vue
<RouterLink :to="{ name: 'home' }" class="nav-link">Home</RouterLink>
      <div>
        <form @submit.prevent="authStore.logout">
          <button class="nav-link">Logout</button>
        </form>
      </div>
```

35. Ketika login muncul button logout dan button login register hilang, begitu sebaliknya

```vue
  <header>
    <nav>
      <RouterLink :to="{ name: 'home' }" class="nav-link">Home</RouterLink>
      <div v-if="authStore.user" class="flex items-center space-x-6">
        <p class="text-sm text-slate-300">Welcome back {{ authStore.user.name }}</p>
        <form @submit.prevent="authStore.logout">
          <button class="nav-link">Logout</button>
        </form>
      </div>
      <div v-else>
        <RouterLink :to="{ name: 'register' }" class="nav-link">Register</RouterLink>
        <RouterLink :to="{ name: 'login' }" class="nav-link">Login</RouterLink>
      </div>
    </nav>
  </header>
```

36. Masalah jika sudah login tapi masih bisa akses halaman /login & /register, maka tambahkan guard (penjagaan) di router/[index.js](http://index.js)

```vue
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import { useAuthStore } from '@/stores/auth'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guest: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guest: true },
    },
  ],
})
router.beforeEach(async (*to*) => {
  const authStore = useAuthStore();
  await authStore.getUser();
  if (authStore.user && *to*.meta.guest ) {
    return { name: 'home'};
  }
})
export default router
```

37. Bagaimana jika punya halaman yang hanya boleh diakses oleh yang sudah terauthentikasi, buat file CreateView.vue di folder views/Posts/

```vue
<script setup>
</script>
<template>
  <main>
    <h1 class="title">Create a new post</h1>
  </main>
</template>
```

38. daftarkan di router

```vue
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guest: true },
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
    },
```

39. tambahkan tombol di navigation bar App.vue

```vue
      <div v-if="authStore.user" class="flex items-center space-x-6">
        <p class="text-sm text-slate-300">Welcome back {{ authStore.user.name }}</p>
        <RouterLink :to="{ name: 'create' }" class="nav-link">New Post</RouterLink>
        <form @submit.prevent="authStore.logout">
          <button class="nav-link">Logout</button>
        </form>
      </div>
```

40. Coba akses halaman /create tanpa login
41. Tambahkan guard auth di router/[index.js](http://index.js)

```vue
    {
      path: '/create',
      name: 'create',
      component: CreateView,
      meta: { auth: true },
    },
  ],
})
router.beforeEach(async (*to*) => {
  const authStore = useAuthStore();
  await authStore.getUser();
  if (authStore.user && *to*.meta.guest) {
    return { name: 'home' };
  }
  if (\!authStore.user && *to*.meta.auth) {
    return { name: 'login' };
  }
})
```

42. ketika login masih terlihat data user di console.log, maka hapus itu

![][image1]

- di [auth.js](http://auth.js) hapus semua console.log(data)
- di app.vue hapus onMounted ke getUser()

43. Masalah jika form input register atau login ada error maka muncul di dua halaman tersebut sekaligus, tambahkan onMounted di page register dan login

```vue
onMounted(() => { errors.value = {} })
```

---

# **FrontEnd Vue - CRUD Post**

---

1. Buat form di halaman CreateView

```vue
<script setup>
</script>
<template>
  <main>
    <h1 class="title">Create a new post</h1>
    <form class="w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Post Title" />
      </div>
      <div>
        <textarea rows="6" placeholder="Post Content"></textarea>
      </div>
      <button class="primary-btn">Create</button>
    </form>
  </main>
</template>
```

2. Tambahkan data reactive

```vue
<script setup>
import { reactive } from 'vue';
const formData = reactive({
  title: '',
  body: '',
});
</script>
<template>
  <main>
    <h1 class="title">Create a new post</h1>
    <form @submit.prevent="" class=" w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Post Title" v-model="formData.title" />
      </div>
      <div>
        <textarea rows="6" placeholder="Post Content" v-model="formData.body"></textarea>
      </div>
      <button class="primary-btn">Create</button>
    </form>
  </main>
</template>
```

3. Buat fungsi untuk memproses pembuatan post ke api, buat file baru [posts.js](http://posts.js) di folder stores

```vue
import { defineStore } from "pinia";
export const usePostsStore = defineStore('postsStore', {
  state: () => {
    return {
      errors: {}
    }
  },
  actions: {
    // Create a post
    async createPost(*formData*) {
      const res = await fetch('/api/posts', {
        method: 'post',
        headers: {
          Authorization: \`Bearer ${localStorage.getItem('token')}\`,
        },
        body: JSON.stringify(*formData*),
      })
      const data = await res.json();
      console.log(data);
    },
  }
})
```

4. Edit form submit.prevent di createview

```vue
<script setup>
import { usePostsStore } from '@/stores/posts';
import { reactive } from 'vue';
const { createPost } = usePostsStore();
const formData = reactive({
  title: '',
  body: '',
});
</script>
<template>
  <main>
    <h1 class="title">Create a new post</h1>
    <form @submit.prevent="createPost(formData)" class=" w-1/2 mx-auto space-y-6">
      <div>
```

5. coba submit form kosong untuk cek error
6. tangkap data errors dari api ke state

```vue
import { defineStore } from "pinia";
export const usePostsStore = defineStore('postsStore', {
  state: () => {
    return {
      errors: {}
    }
  },
  actions: {
    // Create a post
    async createPost(*formData*) {
      const res = await fetch('/api/posts', {
        method: 'post',
        headers: {
          Authorization: \`Bearer ${localStorage.getItem('token')}\`,
        },
        body: JSON.stringify(*formData*),
      })
      const data = await res.json();
      if(data.errors) {
        this.errors = data.errors
      } else {
        this.router.push({ name: 'home' })
      }
    },
  }
})
```

7. ambil errors dari state ke CreateView.vue

```vue
<script setup>
import { usePostsStore } from '@/stores/posts';
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';
const { createPost } = usePostsStore();
const { errors } = storeToRefs(usePostsStore());
const formData = reactive({
  title: '',
  body: '',
});
</script>
<template>
  <main>
    <h1 class="title">Create a new post</h1>
    <form @submit.prevent="createPost(formData)" class=" w-1/2 mx-auto space-y-6">
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
```

8. Buat action method di stores/[posts.js](http://posts.js) untuk mengambil semua data post

```vue
  actions: {
    // Get all posts
    async getAllPosts() {
      const res = await fetch("/api/posts");
      const data = await res.json();
      return console.log(data);
    },
    // Create a post
    async createPost(*formData*) {
      const res = await fetch('/api/posts', {
```

9. Panggil method getAllPosts ketika halaman home dimuat, refresh halaman homeview

```vue
<script setup>
import { usePostsStore } from '@/stores/posts';
import { onMounted } from 'vue';
const { getAllPosts } = usePostsStore();
onMounted(() => getAllPosts());
</script>
<template>
  <main>
    <h1 class="title">Latest Post</h1>
  </main>
</template>
```

10. ganti return data

```vue
    async getAllPosts() {
      const res = await fetch("/api/posts");
      const data = await res.json();
      return data;
    },
```

11. edit HomeView.vue untuk menangkap dan menampilkan data post

```vue
<script setup>
import { usePostsStore } from '@/stores/posts';
import { onMounted, ref } from 'vue';
const { getAllPosts } = usePostsStore();
const posts = ref([]);
onMounted(async () => (posts.value = await getAllPosts()));
</script>
<template>
  <main>
    <h1 class="title">Latest Post</h1>
    <div v-if="posts.length > 0">
      <div v-for="post in posts" :key="post.id" class="border-l-4 border-blue-500 pl-4 mb-12">
        <h2 class="font-bold text-3xl">{{ post.title }}</h2>
      </div>
    </div>
    <div v-else>
      <h2 class="title">There are no posts</h2>
    </div>
  </main>
</template>
```

12. Untuk bisa menampilkan user siapa yang membuat posts, edit controller api laravel index PostController

```vue
    public function index()
    {
        return Post::with('user')->latest()->get();
    }
```

13. edit homeview untuk menampilkan user

```vue
      <div v-for="post in posts" :key="post.id" class="border-l-4 border-blue-500 pl-4 mb-12">
        <h2 class="font-bold text-3xl">{{ post.title }}</h2>
        <p class="text-xs text-slate-600 mb-4">
          Posted by {{ post.user.name }}
        </p>
        <p>
          {{ post.body }}
          <RouterLink :to="{ name: 'show', params: { id: post.id } }" class="text-blue-500 font-bold underline">Read
            more...</RouterLink>
        </p>
      </div>
    </div>
```

14. Buat file ShowView.vue di dalam folder views/posts

```vue
<script setup></script>
<template>
  <main>
    <h1>Show</h1>
  </main>
</template>
```

15. daftarkan di router

```vue
    {
      path: '/posts/:id',
      name: 'show',
      component: ShowView,
    },
```

16. coba test klink link Read More..
17. buat method getPost di stores/[posts.js](http://posts.js)

```vue
    // Get all posts
    async getAllPosts() {
      const res = await fetch("/api/posts");
      const data = await res.json();
      return data;
    },
    // Get a post
    async getPost(*post*) {
      const res = await fetch(\`/api/posts/${*post*}\`);
      const data = await res.json();
      return console.log(data);
    },
```

18. panggil method getPost di ShowView.vue, coba reload dan cek di console.log

```vue
<script setup>
import { usePostsStore } from "@/stores/posts";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const { getPost } = usePostsStore();
const post = ref(null);
onMounted(async () => (post.value = await getPost(route.params.id)));
</script>
```

19. edit function show di api laravel

```vue
    public function show(Post $post)
    {
        return response()->json([
            'status' => 'OK',
            'message' => 'Detail Post: ' . $post->title,
            'data' => $post->load('user'),
        ]);
    }
```

20. ubah return getPost

```vue
    async getPost(*post*) {
      const res = await fetch(\`/api/posts/${*post*}\`);
      const data = await res.json();
      return data.data;
    },
```

21. ubah isi tempate dari ShowView.vue

```vue
<template>
  <main>
    <div v-if="post">
      <div class="border-l-4 border-blue-500 pl-4 mt-12">
        <h2 class="font-bold text-3xl">{{ post.title }}</h2>
        <p class="text-xs text-slate-600 mb-4">
          Posted by {{ post.user.name }}
        </p>
        <p>
          {{ post.body }}
        </p>
      </div>
    </div>
    <div v-else>
      <h2 class="title">Post not found</h2>
    </div>
  </main>
</template>
```

22. tambahkan tombol delete

```vue
<template>
  <main>
    <div v-if="post">
      <div class="border-l-4 border-blue-500 pl-4 mt-12">
        <h2 class="font-bold text-3xl">{{ post.title }}</h2>
        <p class="text-xs text-slate-600 mb-4">
          Posted by {{ post.user.name }}
        </p>
        <p>
          {{ post.body }}
        </p>
        <div class="flex items-center gap-6 mt-6">
          <form action="">
            <button class="text-red-500 font-bold px-2 py-1 border border-red-300">
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="title">Post not found</h2>
    </div>
  </main>
</template>
```

23. buat function untuk delete post di stores/posts.js

```vue
    // Delete a post
    async deletePost(*post*) {
      const authStore = useAuthStore();
      if (authStore.user.id === *post*.user_id) {
        const res = await fetch(\`/api/posts/${*post*.id}\`, {
          method: "delete",
          headers: {
            Authorization: \`Bearer ${localStorage.getItem("token")}\`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          this.router.push({ name: "home" });
        }
        console.log(data);
      } else {
        console.log('You do not own this post')
      }
    },
```

24. Panggil function delete ke ShowView.vue

```vue
<script setup>
import { usePostsStore } from "@/stores/posts";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const { getPost, deletePost } = usePostsStore();
const post = ref(null);
onMounted(async () => (post.value = await getPost(route.params.id)));
</script>
<template>
  <main>
    <div v-if="post">
      <div class="border-l-4 border-blue-500 pl-4 mt-12">
        <h2 class="font-bold text-3xl">{{ post.title }}</h2>
        <p class="text-xs text-slate-600 mb-4">
          Posted by {{ post.user.name }}
        </p>
        <p>
          {{ post.body }}
        </p>
        <div class="flex items-center gap-6 mt-6">
          <form @submit.prevent="deletePost(post)">
            <button class="text-red-500 font-bold px-2 py-1 border border-red-300">
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="title">Post not found</h2>
    </div>
  </main>
</template>
```

25. Buat tombol delete tidak muncul jika bukan pemilik post

```vue
<script setup>
import { useAuthStore } from "@/stores/auth";
import { usePostsStore } from "@/stores/posts";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const { getPost, deletePost } = usePostsStore();
const authStore = useAuthStore();
const post = ref(null);
onMounted(async () => (post.value = await getPost(route.params.id)));
</script>
<template>
  <main>
    <div v-if="post">
      <div class="border-l-4 border-blue-500 pl-4 mt-12">
        <h2 class="font-bold text-3xl">{{ post.title }}</h2>
        <p class="text-xs text-slate-600 mb-4">
          Posted by {{ post.user.name }}
        </p>
        <p>
          {{ post.body }}
        </p>
        <div v-if="authStore.user && authStore.user.id === post.user_id" class="flex items-center gap-6 mt-6">
          <form @submit.prevent="deletePost(post)">
            <button class="text-red-500 font-bold px-2 py-1 border border-red-300">
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="title">Post not found</h2>
    </div>
  </main>
</template>
```

26. Buat page UpdateView.vue didalam folder views/posts/

```vue
<script setup>
</script>
<template>
  <main>
    Update
  </main>
</template>
```

27. Daftarkan di router/[index.js](http://index.js)

```vue
    {
      path: '/posts/:id',
      name: 'show',
      component: ShowView,
    },
    {
      path: "/posts/update/:id",
      name: "update",
      component: UpdateView,
      meta: { auth: true },
    },
```

28. Buat button update di ShowView.vue

```vue
<script setup>
import { useAuthStore } from "@/stores/auth";
import { usePostsStore } from "@/stores/posts";
import { onMounted, ref } from "vue";
import { useRoute, RouterLink } from "vue-router";
const route = useRoute();
const { getPost, deletePost } = usePostsStore();
const authStore = useAuthStore();
const post = ref(null);
onMounted(async () => (post.value = await getPost(route.params.id)));
</script>
<template>
  <main>
    <div v-if="post">
      <div class="border-l-4 border-blue-500 pl-4 mt-12">
        <h2 class="font-bold text-3xl">{{ post.title }}</h2>
        <p class="text-xs text-slate-600 mb-4">
          Posted by {{ post.user.name }}
        </p>
        <p>
          {{ post.body }}
        </p>
        <div v-if="authStore.user && authStore.user.id === post.user_id" class="flex items-center gap-6 mt-6">
          <form @submit.prevent="deletePost(post)">
            <button class="text-red-500 font-bold px-2 py-1 border border-red-300">
              Delete
            </button>
          </form>
          <RouterLink :to="{ name: 'update', params: { id: post.id } }"
            class="text-green-500 font-bold px-2 py-1 border border-green-300">Update</RouterLink>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="title">Post not found</h2>
    </div>
  </main>
</template>
```

29. Edit page ShowView.vue (copas dari CreateView.vue)

```vue
<script setup>
import { usePostsStore } from '@/stores/posts';
import { storeToRefs } from 'pinia';
import { reactive } from 'vue';
const { errors } = storeToRefs(usePostsStore());
const formData = reactive({
  title: '',
  body: '',
});
</script>
<template>
  <main>
    <h1 class="title">Update your post</h1>
    <form @submit.prevent="createPost(formData)" class=" w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Post Title" v-model="formData.title" />
        <p v-if="errors.title" class="error">{{ errors.title[0] }}</p>
      </div>
      <div>
        <textarea rows="6" placeholder="Post Content" v-model="formData.body"></textarea>
        <p v-if="errors.body" class="error">{{ errors.body[0] }}</p>
      </div>
      <button class="primary-btn">Update</button>
    </form>
  </main>
</template>
```

30. Buat agar form nya otomatis terisi dari api

```vue
<script setup>
import { usePostsStore } from '@/stores/posts';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const { errors } = storeToRefs(usePostsStore());
const { getPost } = usePostsStore();
const post = ref(null);
const formData = reactive({
  title: '',
  body: '',
});
onMounted(async() => {
  post.value = await getPost(route.params.id)
  formData.title = post.value.title;
  formData.body = post.value.body;
})
</script>
<template>
  <main>
    <h1 class="title">Update your post</h1>
    <form @submit.prevent="createPost(formData)" class=" w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Post Title" v-model="formData.title" />
        <p v-if="errors.title" class="error">{{ errors.title[0] }}</p>
      </div>
      <div>
        <textarea rows="6" placeholder="Post Content" v-model="formData.body"></textarea>
        <p v-if="errors.body" class="error">{{ errors.body[0] }}</p>
      </div>
      <button class="primary-btn">Update</button>
    </form>
  </main>
</template>
```

31. Masalah ketika orang lain bisa mengakses langsung halaman [http://localhost:5173/posts/update/3](http://localhost:5173/posts/update/3) yang dimana itu postingan bukan punya sendiri, maka tambahkan kondisi untuk cek [user.id](http://user.id) === post.user_id

```vue
<script setup>
import { useAuthStore } from '@/stores/auth';
import { usePostsStore } from '@/stores/posts';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const { user } = storeToRefs(useAuthStore());
const { errors } = storeToRefs(usePostsStore());
const { getPost } = usePostsStore();
const post = ref(null);
const formData = reactive({
  title: '',
  body: '',
});
onMounted(async () => {
  post.value = await getPost(route.params.id)
  if (user.value.id \!== post.value.user_id) {
    router.push({ name: "home" });
  } else {
    formData.title = post.value.title;
    formData.body = post.value.body;
  }
})
</script>
```

32. buat function update post

```vue
    // Update a post
    async updatePost(*post*, *formData*) {
      const authStore = useAuthStore();
      if (authStore.user.id === *post*.user_id) {
        const res = await fetch(\`/api/posts/${*post*.id}\`, {
          method: "put",
          headers: {
            Authorization: \`Bearer ${localStorage.getItem("token")}\`,
          },
          body: JSON.stringify(*formData*),
        });
        const data = await res.json();
        if (data.errors) {
          this.errors = data.errors
        } else {
          this.router.push({ name: "home" });
          this.errors = {};
        }
      }
    },
```

33. Panggil function update di UpdateView.vue

```vue
<script setup>
import { useAuthStore } from '@/stores/auth';
import { usePostsStore } from '@/stores/posts';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const { user } = storeToRefs(useAuthStore());
const { errors } = storeToRefs(usePostsStore());
const { getPost, updatePost } = usePostsStore();
const post = ref(null);
const formData = reactive({
  title: '',
  body: '',
});
onMounted(async () => {
  post.value = await getPost(route.params.id)
  if (user.value.id \!== post.value.user_id) {
    router.push({ name: "home" });
  } else {
    formData.title = post.value.title;
    formData.body = post.value.body;
  }
})
</script>
<template>
  <main>
    <h1 class="title">Update your post</h1>
    <form @submit.prevent="updatePost(post, formData)" class=" w-1/2 mx-auto space-y-6">
      <div>
        <input type="text" placeholder="Post Title" v-model="formData.title" />
        <p v-if="errors.title" class="error">{{ errors.title[0] }}</p>
      </div>
      <div>
        <textarea rows="6" placeholder="Post Content" v-model="formData.body"></textarea>
        <p v-if="errors.body" class="error">{{ errors.body[0] }}</p>
      </div>
      <button class="primary-btn">Update</button>
    </form>
  </main>
</template>
```

