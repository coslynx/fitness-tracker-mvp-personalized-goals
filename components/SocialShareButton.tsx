import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store';
import { useModal } from '@/utils/modal';

interface SocialShareButtonProps {
  platform: 'facebook' | 'twitter' | 'instagram';
  url: string;
  title?: string;
}

const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  platform,
  url,
  title,
}) => {
  const { data: session } = useSession();
  const { showModal } = useModal();
  const [isSharing, setIsSharing] = useState(false);
  const store = useStore();

  const handleShare = async () => {
    setIsSharing(true);
    try {
      switch (platform) {
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`,
            '_blank',
          );
          break;
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
            '_blank',
          );
          break;
        case 'instagram':
          showModal('instagram-share', { url });
          break;
        default:
          break;
      }
      store.addSocialShare(platform);
    } catch (error) {
      // Handle error
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <button
      className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      onClick={handleShare}
      disabled={isSharing}
    >
      {isSharing ? 'Sharing...' : `Share on ${platform}`}
    </button>
  );
};

export default SocialShareButton;