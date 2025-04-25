import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { signup, clearError } from '../../features/auth/authSlice';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(signup({ name, email, password }));
    if (signup.fulfilled.match(result)) {
      onClose();
      setName('');
      setEmail('');
      setPassword('');
    }
  };
  
  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign Up">
      <form onSubmit={handleSubmit}>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        
        <Input
          id="name"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        <Input
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          id="password"
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <div className="mt-6">
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Login
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SignupModal;