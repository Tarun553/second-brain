import AuthForm from '../components/auth/AuthForm';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const { authState } = useAuth();

  if (authState.isAuth) {
    return <Navigate to="/" replace />;
  }

  return <AuthForm />;
};

export default Auth;