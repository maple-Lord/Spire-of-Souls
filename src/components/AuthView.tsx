import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Shield, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

export default function AuthView({ onAuthComplete }: { onAuthComplete: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const syntheticEmail = `${username.toLowerCase().trim()}@spire.local`;

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, syntheticEmail, password);
      } else {
        if (!username.trim() || username.length < 3) throw new Error('Name must be at least 3 characters');
        const userCredential = await createUserWithEmailAndPassword(auth, syntheticEmail, password);
        const user = userCredential.user;

        // Initialize user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          username: username.trim(),
          highestFloor: 0,
          updatedAt: serverTimestamp()
        });
      }
      onAuthComplete();
    } catch (err: any) {
      console.error(err);
      let msg = 'The shadows reject this identity.';
      if (err.code === 'auth/wrong-password') msg = 'Incorrect spiritual cipher.';
      if (err.code === 'auth/user-not-found') msg = 'This name is unknown to the Spire.';
      if (err.code === 'auth/email-already-in-use') msg = 'This name is already bound to another soul.';
      if (err.code === 'auth/weak-password') msg = 'Cipher must be at least 6 characters.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-abyss-base flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-indigo-900/20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <Shield className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-serif italic mb-2">Identification</h1>
          <p className="text-white/40 text-sm italic">The Spire welcomes those with a name.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text"
                placeholder="Wanderer Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="password"
                placeholder="Spiritual Cipher (Password)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-400 text-center italic bg-red-400/5 py-3 rounded-xl border border-red-400/10"
            >
              {error}
            </motion.p>
          )}

          <button 
            disabled={loading}
            type="submit"
            className="w-full relative group py-5 bg-indigo-600 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-[0_15px_30px_-5px_rgba(79,70,229,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                {isLogin ? 'Enter Spire' : 'Bind Soul'} 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 hover:text-white transition-colors"
          >
            {isLogin ? "No identity? Create one." : "Already bound? Manifest."}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
