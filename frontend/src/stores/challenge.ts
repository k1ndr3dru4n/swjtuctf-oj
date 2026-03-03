import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Challenge, ContainerInfo } from '../types/challenge';

export const useChallengeStore = defineStore('challenge', () => {
  // State
  const challenges = ref<Challenge[]>([]);
  const currentChallenge = ref<Challenge | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function fetchChallenges(params?: {
    category?: string;
    difficulty?: string;
    search?: string;
  }) {
    loading.value = true;
    error.value = null;

    try {
      // TODO: Replace with actual API call
      // const response = await api.getChallenges(params);
      // challenges.value = response.data.items;
      console.log('Fetching challenges with params:', params);
    } catch (err) {
      error.value = 'Failed to fetch challenges';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchChallenge(_id: number) {
    loading.value = true;
    error.value = null;

    try {
      // TODO: Replace with actual API call
      // const response = await api.getChallenge(id);
      // currentChallenge.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch challenge';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  function setCurrentChallenge(challenge: Challenge | null) {
    currentChallenge.value = challenge;
  }

  function updateContainerState(challengeId: number, state: 'idle' | 'loading' | 'running', info?: ContainerInfo) {
    const challenge = challenges.value.find((c: Challenge) => c.id === challengeId);
    if (challenge) {
      challenge.containerState = state;
      if (info) {
        challenge.containerInfo = info;
      }
    }

    if (currentChallenge.value?.id === challengeId) {
      currentChallenge.value.containerState = state;
      if (info) {
        currentChallenge.value.containerInfo = info;
      }
    }
  }

  return {
    // State
    challenges,
    currentChallenge,
    loading,
    error,
    // Actions
    fetchChallenges,
    fetchChallenge,
    setCurrentChallenge,
    updateContainerState,
  };
});
