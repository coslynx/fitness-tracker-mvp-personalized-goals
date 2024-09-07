import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/utils/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const goals = await prisma.goal.findMany({
      where: { userId: session.user.id },
    });

    return res.status(200).json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}