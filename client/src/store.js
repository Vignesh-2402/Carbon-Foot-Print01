import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    set({ token });
  }
}));

export const useActivityStore = create((set) => ({
  activities: [],
  summary: null,
  loading: false,

  setActivities: (activities) => set({ activities }),
  setSummary: (summary) => set({ summary }),
  setLoading: (loading) => set({ loading })
}));

export const useGoalStore = create((set) => ({
  goals: [],
  loading: false,

  setGoals: (goals) => set({ goals }),
  setLoading: (loading) => set({ loading })
}));

export const useChallengeStore = create((set) => ({
  challenges: [],
  participatedChallenges: [],
  loading: false,

  setChallenges: (challenges) => set({ challenges }),
  setParticipatedChallenges: (participated) => set({ participatedChallenges: participated }),
  setLoading: (loading) => set({ loading })
}));
