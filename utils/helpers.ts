import { Goal, Workout } from "@prisma/client";
import { format } from "date-fns";

export const formatDate = (date: Date): string => {
  return format(date, "MMMM d, yyyy");
};

export const calculateProgress = (
  goal: Goal,
  workouts: Workout[]
): number => {
  const totalDuration = workouts.reduce(
    (acc, workout) => acc + workout.duration,
    0
  );
  return (totalDuration / goal.target) * 100;
};