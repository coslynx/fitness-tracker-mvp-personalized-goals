import { SessionProvider } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { useModal } from '@/utils/modal';
import { api } from '@/utils/api';
import { Goal } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import Layout from '@/components/Layout';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const store = useStore();
  const { showModal } = useModal();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.get('/api/goals');
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
        setError('Failed to fetch goals');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleGoalCreate = () => {
    showModal('goal-input');
  };

  const handleLogout = () => {
    api.post('/api/auth/logout').then(() => {
      router.push('/login');
    });
  };

  return (
    <SessionProvider session={session}>
      <Layout onLogout={handleLogout} goals={goals} isLoading={isLoading} error={error} handleGoalCreate={handleGoalCreate}>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}