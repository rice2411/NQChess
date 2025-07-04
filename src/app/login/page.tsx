'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, Google } from '@mui/icons-material';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase-auth';
import BaseInput from '@/components/ui/input/BaseInput';
import { useGlobalLoadingStore } from '@/store/useGlobalLoadingStore';

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    // Set default values after component mounts to avoid hydration mismatch
    setEmail('admin@nqchess.com');
    setPassword('Pass123@');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    useGlobalLoadingStore.getState().setLoading(true);

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      setLoading(false);
      useGlobalLoadingStore.getState().setLoading(false);
      return;
    }

    const result = await signInWithEmail(email, password);
    
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
    
    setLoading(false);
    useGlobalLoadingStore.getState().setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    const result = await signInWithGoogle();
    
    if (result.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
    
    setLoading(false);
  };

  // Don't render until component is mounted on client
  if (!mounted) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ padding: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Đăng nhập
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Chào mừng bạn đến với NQ-Chess
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <BaseInput
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              disabled={loading}
            />
            
            <BaseInput
              fullWidth
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    tabIndex={-1}
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng nhập
            </Button>
          </form>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              hoặc
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            Đăng nhập với Google
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có tài khoản?{' '}
              <Button
                color="primary"
                onClick={() => router.push('/register')}
                sx={{ textTransform: 'none' }}
              >
                Đăng ký ngay
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 