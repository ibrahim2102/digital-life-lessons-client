import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const usePremium = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    const fetchPremiumStatus = async () => {
      try {
        const res = await axiosSecure.get('/users/premium-status', {
          params: { email: user.email }
        });
        setIsPremium(res.data.isPremium || false);
      } catch (error) {
        console.error('Error fetching premium status:', error);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumStatus();
  }, [user?.email, axiosSecure]);

  return { isPremium, loading };
};

export default usePremium;