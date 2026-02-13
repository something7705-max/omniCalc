
import React, { useState } from 'react';
import { updateProfile, User } from 'firebase/auth';
import { auth } from '../firebaseConfig.ts';

interface ProfileProps {
  user: User;
  onClose: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onClose }) => {
  const [name, setName] = useState(user.displayName || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(auth.currentUser, { displayName: name });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Small delay before close to show success
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const memberSince = user.metadata.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-dark/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="premium-card w-full max-w-md p-10 relative animate-in zoom-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-300 hover:text-dark transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-4 border-2 border-primary/20">
             <i className="fas fa-user-tie text-primary text-3xl"></i>
          </div>
          <h2 className="text-xl font-black text-dark tracking-tight">Account Profile</h2>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1">Premium Member Suite</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl text-[10px] font-black uppercase tracking-wider border transition-all ${
            message.type === 'success' ? 'bg-green-50 border-green-100 text-green-500' : 'bg-red-50 border-red-100 text-red-500'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2 opacity-60">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
            <div className="w-full px-6 py-4 bg-slate-100 rounded-2xl font-bold text-sm text-slate-500 cursor-not-allowed">
              {user.email}
            </div>
          </div>

          <div className="flex justify-between items-center px-2 py-4 bg-slate-50/50 rounded-2xl border border-slate-100">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</span>
              <span className="text-[10px] font-black text-green-500 uppercase">Active Pro</span>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Member Since</span>
              <p className="text-[10px] font-black text-dark uppercase">{memberSince}</p>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-dark text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
