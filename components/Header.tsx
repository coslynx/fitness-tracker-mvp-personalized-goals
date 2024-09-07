import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { data: session } = useSession();
  const store = useStore();

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-primary">Fitness Tracker</h1>
        </Link>
        {session ? (
          <div className="flex items-center">
            <p className="text-gray-600 mr-4">
              Welcome, {session.user.name}
            </p>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <Link href="/login">
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Signup
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;