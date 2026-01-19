<template>
  <div>
    <h2>Counter: {{ counter }}</h2>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const counter = ref(0);

    // Redis counter olish
    const getCounter = async () => {
      await makeAuthRequest('get', '/api/counter');
    };

    // Increment / decrement
    const updateCounter = async (action) => {
      await makeAuthRequest('post', `/api/counter/${action}`);
    };

    // Logout
    const logout = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.post('http://86.106.181.36:4000/api/auth/logout', { refreshToken });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/login');
    };

    // Universal function access token refresh bilan
    const makeAuthRequest = async (method, url, data = {}) => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios({
          method,
          url: `http://86.106.181.36:4000${url}`,
          data,
          headers: { Authorization: `Bearer ${token}` }
        });
        // Agar counter qiymati qaytsa
        if (res.data.counter !== undefined) counter.value = res.data.counter;
        return res.data;
      } catch (err) {
        // Access token expired
        if (err.response?.status === 403) {
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            const refreshRes = await axios.post('http://86.106.181.36:4000/api/auth/refresh', { refresh: refreshToken });
            // Yangi access token saqlash
            localStorage.setItem('accessToken', refreshRes.data.access);
            // So‘rovni qayta yuborish
            return await makeAuthRequest(method, url, data);
          } catch (err2) {
            alert('Session expired. Logging out...');
            logout();
          }
        } else {
          alert(err.response?.data?.message || 'Server error');
        }
      }
    };

    const increment = () => updateCounter('increment');
    const decrement = () => updateCounter('decrement');

    onMounted(() => getCounter());

    return { counter, increment, decrement, logout };
  }
};
</script>
