import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store';
import { api } from '@/utils/api';
import { Goal } from '@prisma/client';
import Button from '@/components/Button';
import Header from '@/components/Header';
import ProgressChart from '@/components/ProgressChart';
import GoalInput from '@/components/GoalInput';
import SocialShareButton from '@/components/SocialShareButton';

const DashboardPage = () => {
  const { data: session } = useSession();
  const store = useStore();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    store.showModal('goal-input');
  };

  const handleLogout = () => {
    api.post('/api/auth/logout').then(() => {
      store.router.push('/login');
    });
  };

  if (!session) {
    return (
      <main className="bg-gray-100 h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to the Fitness Tracker
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Please log in or sign up to track your progress and join the community!
          </p>
          <Button onClick={() => store.router.push('/login')}>Login</Button>
          <Button onClick={() => store.router.push('/signup')}>Signup</Button>
        </div>
      </main>
    );
  }

  return (
    <>
      <Header onLogout={handleLogout} />
      <main className="bg-gray-100 min-h-screen py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Your Fitness Journey
          </h1>

          <div className="flex justify-center mb-4">
            <Button onClick={handleGoalCreate} className="mr-4">
              Create Goal
            </Button>
            <SocialShareButton platform="twitter" url="https://example.com" />
          </div>

          {isLoading && (
            <p className="text-center text-gray-600">Loading...</p>
          )}

          {error && (
            <p className="text-center text-red-500 font-bold">{error}</p>
          )}

          {!isLoading && goals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-white p-4 rounded shadow">
                  <h2 className="text-xl font-bold mb-2">{goal.name}</h2>
                  <p className="text-gray-600 mb-2">Target: {goal.target}</p>
                  <p className="text-gray-600 mb-2">
                    Deadline:{' '}
                    {new Date(goal.deadline).toLocaleDateString('en-US')}
                  </p>
                  <ProgressChart goalId={goal.id} />
                  <Button
                    onClick={() =>
                      store.showModal('goal-input', { goal: goal as Goal })
                    }
                    className="mt-4"
                  >
                    Edit Goal
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default DashboardPage;