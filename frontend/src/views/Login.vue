<template>
  <div>
    <h2>Login</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Login</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');

    const login = async () => {
      try {
        const res = await axios.post('http://86.106.181.36:4000/api/auth/login', {
          email: username.value,
          password: password.value
        });
        localStorage.setItem('accessToken', res.data.access);
        localStorage.setItem('refreshToken', res.data.refresh);
        router.push('/counter');
      } catch (err) {
        alert(err.response?.data?.message || 'Login failed');
      }
    };

    return { username, password, login };
  }
};
</script>
