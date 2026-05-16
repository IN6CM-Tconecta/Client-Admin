import { useAuthStore } from '../../features/auth/store/authStore';

export const useAuth = () => {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const role = useAuthStore(state => state.role);
  const logout = useAuthStore(state => state.logout);
  const isAuthenticated = !!token;

  return {
    user,
    token,
    role,
    isAuthenticated,
    logout
  };
};