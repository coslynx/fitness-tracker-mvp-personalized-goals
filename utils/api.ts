import axios from 'axios';
import { getSession } from 'next-auth/react';
import { Goal, Workout } from '@prisma/client';

const api = axios.create({
  baseURL: process.env.NEXTAUTH_URL,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return config;
});

export const getGoals = async () => {
  try {
    const response = await api.get('/api/goals');
    return response.data;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

export const createGoal = async (goal: Goal) => {
  try {
    const response = await api.post('/api/goals', goal);
    return response.data;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

export const getProgress = async (goalId: number) => {
  try {
    const response = await api.get(`/api/progress/${goalId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching progress data:', error);
    throw error;
  }
};

export const logWorkout = async (workout: Workout) => {
  try {
    const response = await api.post('/api/workouts', workout);
    return response.data;
  } catch (error) {
    console.error('Error logging workout:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export default api;