import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import bcrypt from 'bcryptjs';
import { FaUserPlus } from 'react-icons/fa';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'User' | 'Admin'>('User');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let emailExists = false;
      await db.users.iterate((value: any) => {
        if (value.email === email) {
          emailExists = true;
        }
      });

      if (emailExists) {
        setError('Email already exists');
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      const userId = Date.now().toString();
      await db.users.setItem(userId, {
        id: userId,
        name,
        email,
        passwordHash,
        role
      });

      navigate('/login');
    } catch (err) {
      setError('Error creating account');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-12 px-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 -rotate-3 hover:-rotate-6 transition-transform">
            <FaUserPlus className="w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Create Account</CardTitle>
          <CardDescription className="text-base mt-2">Join SkyWings today</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" required value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(val) => setRole(val as 'User' | 'Admin')}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full mt-2">Sign Up</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 mt-2">
          <div className="text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium ml-1">Log in</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
