import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, Sparkles, Image as ImageIcon, Heart } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (profile: UserProfile) => void;
  onSuccess?: (profile: UserProfile) => void;
  initialMode?: 'signin' | 'signup' | 'login' | 'register';
}

const AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  onSuccess,
  initialMode = 'signin',
}) => {
  const normalizedInitial = (initialMode === 'register' || initialMode === 'signup') ? 'signup' : 'signin';
  const [mode, setMode] = useState<'signin' | 'signup'>(normalizedInitial);

  React.useEffect(() => {
    setMode((initialMode === 'register' || initialMode === 'signup') ? 'signup' : 'signin');
  }, [initialMode, isOpen]);
  const [username, setUsername] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!emailOrPhone.trim() || !password.trim()) {
      setErrorMsg("Merci de remplir tous les champs obligatoires.");
      return;
    }

    if (mode === 'signup') {
      if (!username.trim()) {
        setErrorMsg("Veuillez choisir un nom d'utilisateur ou pseudonyme.");
        return;
      }

      const newProfile: UserProfile = {
        id: 'user-' + Date.now(),
        username: username.trim(),
        emailOrPhone: emailOrPhone.trim(),
        bio: bio.trim() || "Bienvenue dans mon jardin secret sur Lumi. ✨",
        avatarUrl: selectedAvatar,
        joinedAt: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        badges: ['badge-share'],
        favoriteQuotes: [
          '« Tu as le droit d’aller à ton propre rythme. Rien ne presse. »'
        ],
      };

      try {
        localStorage.setItem('lumi_user_profile', JSON.stringify(newProfile));
        localStorage.setItem(`lumi_pwd_${newProfile.emailOrPhone}`, password);
      } catch {}

      (onAuthSuccess || onSuccess)?.(newProfile);
      onClose();
    } else {
      // Sign in logic
      try {
        const stored = localStorage.getItem('lumi_user_profile');
        if (stored) {
          const profile = JSON.parse(stored);
          (onAuthSuccess || onSuccess)?.(profile);
          onClose();
          return;
        }
      } catch {}

      // Fallback created session if first time
      const fallbackProfile: UserProfile = {
        id: 'user-' + Date.now(),
        username: emailOrPhone.split('@')[0] || "Ami(e) bienveillant(e)",
        emailOrPhone: emailOrPhone.trim(),
        bio: "De retour sur Lumi avec sérénité.",
        avatarUrl: AVATARS[0],
        joinedAt: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        badges: ['badge-share', 'badge-kindness'],
        favoriteQuotes: [],
      };
      localStorage.setItem('lumi_user_profile', JSON.stringify(fallbackProfile));
      (onAuthSuccess || onSuccess)?.(fallbackProfile);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-amber-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-2xs">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {mode === 'signup' ? 'Créer mon espace Lumi' : 'Connexion à mon espace'}
            </h2>
            <p className="text-xs text-slate-500">Un sanctuaire doux, intime et sécurisé</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom d'utilisateur / Pseudonyme *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: Axo, ÉtoileDouce, Camille..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Choisir une photo de profil
                </label>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 transition-all ${
                        selectedAvatar === url
                          ? 'border-amber-600 ring-2 ring-amber-400 scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Adresse email ou Numéro de téléphone *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="nom@exemple.com ou +229 01..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mot de passe *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Petite biographie (optionnelle)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Quelques mots sur ton parcours, tes passions ou ton aspiration..."
                className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-transform active:scale-98 shadow-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{mode === 'signup' ? 'Créer mon compte' : 'Se connecter'}</span>
          </button>
        </form>

        {/* Google OAuth placeholder / coming soon */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-xs font-medium flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Connexion Google (bientôt disponible)</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          {mode === 'signin' ? (
            <p className="text-xs text-slate-500">
              Pas encore de sanctuaire ?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-bold text-amber-700 hover:text-amber-900 underline"
              >
                Créer un compte
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Déjà inscrit(e) ?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-bold text-amber-700 hover:text-amber-900 underline"
              >
                Se connecter
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
