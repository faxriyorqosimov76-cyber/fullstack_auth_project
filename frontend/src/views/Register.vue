<template>
  <div>
    <h2>Register</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="register">Register</button>
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

    const register = async () => {
      try {
        await axios.post('http://localhost:4000/api/auth/register', {
          email: username.value,
          password: password.value
        });
        alert('Registered successfully! Now logging in...');
        const res = await axios.post('http://localhost:4000/api/auth/login', {
          email: username.value,
          password: password.value
        });
        localStorage.setItem('accessToken', res.data.access);
        localStorage.setItem('refreshToken', res.data.refresh);
        router.push('/counter');
      } catch (err) {
        alert(err.response?.data?.message || 'Error registering');
      }
    };

    return { username, password, register };
  }
};
</script>
