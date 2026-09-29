import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { db } from '../lib/db';
import { loginSuccess } from '../features/auth/authSlice';
import bcrypt from 'bcryptjs';
import { FaPlaneDeparture } from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      let foundUser: any = null;
      await db.users.iterate((value: any) => {
        if (value.email === email) {
          foundUser = value;
        }
      });

      if (foundUser) {
        const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
        if (isMatch) {
          dispatch(loginSuccess({
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role
          }));
          navigate('/');
        } else {
          setError('Invalid credentials');
        }
      } else {
        setError('User not found');
      }
    } catch (err) {
      setError('Something went wrong during login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 rotate-3 hover:rotate-6 transition-transform">
            <FaPlaneDeparture className="w-8 h-8 -rotate-12" />
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Welcome Back</CardTitle>
          <CardDescription className="text-base mt-2">Sign in to your SkyWings account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full mt-2">Log In</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 mt-2">
          <div className="text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline font-medium ml-1">Sign up</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
