import { useState } from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  type = 'button',
  disabled,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (onClick && !isLoading) {
      setIsLoading(true);
      try {
        await onClick();
      } catch (error) {
        console.error('Error during button click:', error);
        // Handle errors appropriately, potentially display an error message to the user
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled || isLoading}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export default Button;