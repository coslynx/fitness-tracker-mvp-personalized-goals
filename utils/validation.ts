import validator from 'validator';

export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateGoalName = (name: string): boolean => {
  return name.trim() !== '' && name.length <= 50;
};

export const validateTarget = (target: string): boolean => {
  return target.trim() !== '';
};

export const validateDeadline = (deadline: Date): boolean => {
  return deadline instanceof Date && !isNaN(deadline.getTime());
};

export const validateWorkoutData = (
  name: string,
  duration: number,
  calories: number,
  date: Date,
): boolean => {
  return (
    validateGoalName(name) &&
    duration >= 0 &&
    calories >= 0 &&
    validateDeadline(date)
  );
};