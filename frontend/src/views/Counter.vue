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

    
    const getCounter = async () => {
      await makeAuthRequest('get', '/api/counter');
    };

    
    const updateCounter = async (action) => {
      await makeAuthRequest('post', `/api/counter/${action}`);
    };

    
    const logout = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      await axios.post('http://86.106.181.36:5000/api/auth/logout', { refreshToken });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      router.push('/login');
    };

    
    const makeAuthRequest = async (method, url, data = {}) => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios({
          method,
          url: `http://86.106.181.36:5000${url}`,
          data,
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.counter !== undefined) counter.value = res.data.counter;
        return res.data;
      } catch (err) {
        
        if (err.response?.status === 403) {
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            const refreshRes = await axios.post('http://86.106.181.36:5000/api/auth/refresh', { refresh: refreshToken });
         
            localStorage.setItem('accessToken', refreshRes.data.access);
         
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
