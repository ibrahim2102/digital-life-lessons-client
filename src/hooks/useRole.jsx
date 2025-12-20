import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get('/users/role',  {
        params: { email: user.email }   // ✅ THIS WAS MISSING
      })
      .then(res => {
        setRole(res.data.role);
        setRoleLoading(false);
      })
      .catch(() => {
        setRole(null);
        setRoleLoading(false);
      });
  }, [user?.email, axiosSecure]);

  return { role, roleLoading };
};

export default useRole;
