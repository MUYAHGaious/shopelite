import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDefaultCredentials, setShowDefaultCredentials] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, createDefaultAdmin } = useAdminAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Login failed');
      if (result.error?.includes('Invalid credentials')) {
        setShowDefaultCredentials(true);
      }
    }
    
    setLoading(false);
  };

  const handleCreateDefaultAdmin = async () => {
    setLoading(true);
    const result = await createDefaultAdmin();
    
    if (result.success) {
      setFormData({ username: 'admin', password: 'admin123' });
      setError('');
      setShowDefaultCredentials(true);
    } else {
      setError(result.data?.error || 'Failed to create default admin');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
            <CardDescription className="text-gray-300">
              Access the EliteShop admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              {showDefaultCredentials && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-500/20 border border-blue-500/50 text-blue-200 px-4 py-3 rounded-lg"
                >
                  <p className="text-sm font-medium">Default credentials:</p>
                  <p className="text-sm">Username: admin</p>
                  <p className="text-sm">Password: admin123</p>
                </motion.div>
              )}
              
              <Button
                onClick={handleCreateDefaultAdmin}
                disabled={loading}
                variant="outline"
                className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Create Default Admin
              </Button>
              
              <button
                onClick={() => navigate('/')}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                ← Back to Store
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;

