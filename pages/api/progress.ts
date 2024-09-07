import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/utils/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const goalId = parseInt(req.query.goalId as string);

  if (!session || !goalId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userGoals = await prisma.goal.findMany({
      where: { userId: session.user.id },
    });

    const goal = userGoals.find((goal) => goal.id === goalId);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const workouts = await prisma.workout.findMany({
      where: { userId: session.user.id, date: { gte: goal.deadline } },
    });

    const totalDuration = workouts.reduce((acc, workout) => {
      return acc + workout.duration;
    }, 0);

    // Calculate progress based on total workout duration 
    // and the goal target. This is just an example
    // You might have a more complex calculation based
    // on your specific fitness goals.
    const progress = (totalDuration / goal.target) * 100;

    const progressData = workouts.map((workout) => ({
      date: workout.date.toISOString(),
      progress, // Assuming progress is a constant value across all dates for simplicity
    }));

    return res.status(200).json(progressData);
  } catch (error) {
    console.error('Error fetching progress data:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}