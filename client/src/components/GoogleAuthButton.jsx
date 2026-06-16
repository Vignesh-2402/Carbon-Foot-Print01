import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../services/api';

export default function GoogleAuthButton({ onSuccess, onError, label = 'Sign in with Google' }) {
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await authService.googleVerify(credentialResponse.credential);
      onSuccess(response.data.user, response.data.token);
    } catch (err) {
      console.error('Google auth error:', err);
      onError?.(err.response?.data?.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      {loading ? (
        <button disabled className="btn w-full bg-white border-2 border-gray-300 text-gray-700 flex items-center justify-center gap-2">
          Authenticating...
        </button>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => onError?.('Google login failed')}
          text={label === 'Sign up with Google' ? 'signup_with' : 'signin_with'}
          width="100%"
        />
      )}
    </div>
  );
}