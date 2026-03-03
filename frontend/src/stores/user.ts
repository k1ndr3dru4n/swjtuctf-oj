import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types/user';

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  // Actions
  function setAuth(newToken: string, newUser: User) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('token', newToken);
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  }

  function updateUser(newUser: User) {
    user.value = newUser;
  }

  return {
    // State
    token,
    user,
    // Getters
    isAuthenticated,
    isAdmin,
    // Actions
    setAuth,
    logout,
    updateUser,
  };
});
