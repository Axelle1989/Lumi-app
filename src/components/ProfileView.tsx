import React, { useState } from 'react';
import { 
  User, 
  Award, 
  BookOpen, 
  Quote, 
  Sparkles, 
  Calendar, 
  Edit3, 
  Plus, 
  Trash2, 
  LogOut, 
  Heart,
  Feather,
  Music,
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';
import { UserProfile, CommunityPost, UserMemoryItem } from '../types';
import { BADGES_CATALOG } from '../data/initialData';

interface ProfileViewProps {
  profile: UserProfile;
  posts: CommunityPost[];
  userMemories: UserMemoryItem[];
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
  onOpenCreatePost: () => void;
  onRemoveMemory: (id: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  posts,
  userMemories,
  onUpdateProfile,
  onLogout,
  onOpenCreatePost,
  onRemoveMemory,
}) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(profile.bio || '');
  const [newQuoteInput, setNewQuoteInput] = useState('');
  const [isAddingQuote, setIsAddingQuote] = useState(false);

  const userPosts = posts.filter(
    (p) => p.author.toLowerCase() === profile.username.toLowerCase() || p.authorId === profile.id
  );

  const handleSaveBio = () => {
    onUpdateProfile({ ...profile, bio: bioInput.trim() });
    setIsEditingBio(false);
  };

  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuoteInput.trim()) return;
    const updated = [newQuoteInput.trim(), ...profile.favoriteQuotes];
    onUpdateProfile({ ...profile, favoriteQuotes: updated });
    setNewQuoteInput('');
    setIsAddingQuote(false);
  };

  const handleRemoveQuote = (idx: number) => {
    const updated = profile.favoriteQuotes.filter((_, i) => i !== idx);
    onUpdateProfile({ ...profile, favoriteQuotes: updated });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-4 border-amber-100 shadow-md">
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1.5 rounded-xl shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {profile.username}
                </h1>
                <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Membre du sanctuaire depuis {profile.joinedAt}</span>
                </p>
              </div>

              <button
                onClick={onLogout}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors self-center sm:self-start"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            </div>

            {/* Bio */}
            {isEditingBio ? (
              <div className="pt-2 space-y-2">
                <textarea
                  rows={2}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-200 text-xs font-serif"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveBio}
                    className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-medium"
                  >
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="px-3 py-1 rounded-lg text-slate-500 text-xs"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-1 flex items-start gap-2 justify-center sm:justify-start">
                <p className="text-xs sm:text-sm text-slate-600 font-serif leading-relaxed max-w-lg italic">
                  « {profile.bio || "Aucune biographie rédigée pour le moment."} »
                </p>
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="text-slate-400 hover:text-amber-700 p-1"
                  title="Modifier ma biographie"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Stats row */}
            <div className="flex items-center justify-center sm:justify-start gap-6 pt-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 text-base">{userPosts.length}</span>
                <span className="text-slate-500 ml-1">créations partagées</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 text-base">{profile.badges.length}</span>
                <span className="text-slate-500 ml-1">badges bienveillants</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 text-base">{profile.favoriteQuotes.length}</span>
                <span className="text-slate-500 ml-1">citations favorites</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges System (Règles non compétitives) */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">Badges de Positivité</h2>
          </div>
          <span className="text-xs text-slate-400">Non compétitifs & valorisants</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BADGES_CATALOG.map((badge) => {
            const isUnlocked = profile.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/70 border-amber-200/90 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200/60 opacity-50 grayscale'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="font-bold text-xs text-slate-900">{badge.title}</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {badge.description}
                </div>
                {isUnlocked && (
                  <div className="mt-2 text-[10px] text-amber-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Obtenu</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lumi's Personal Memory for this User */}
      <div className="bg-linear-to-r from-amber-50 via-white to-amber-50 rounded-3xl p-6 border border-amber-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Ce que Lumi retient avec tendresse</h2>
              <p className="text-xs text-slate-500">
                La mémoire personnelle de Lumi qui lui permet de se souvenir de tes confidences au fil des semaines
              </p>
            </div>
          </div>
        </div>

        {userMemories.length === 0 ? (
          <p className="text-xs text-slate-500 italic p-4 rounded-2xl bg-white/70 border border-amber-100">
            Lumi n'a pas encore enregistré d'éléments marquants. Au fil de tes discussions dans le Sanctuaire privé, elle se souviendra de tes défis et de tes progrès.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {userMemories.map((mem) => (
              <div
                key={mem.id}
                className="p-3 rounded-2xl bg-white border border-amber-200/80 shadow-2xs flex items-center justify-between gap-2 text-xs text-slate-800"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-medium">{mem.fact}</span>
                </div>
                <button
                  onClick={() => onRemoveMemory(mem.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                  title="Effacer ce souvenir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Favorite Quotes Section */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">Citations Favorites</h2>
          </div>
          <button
            onClick={() => setIsAddingQuote(!isAddingQuote)}
            className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une citation</span>
          </button>
        </div>

        {isAddingQuote && (
          <form onSubmit={handleAddQuote} className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <input
              type="text"
              required
              value={newQuoteInput}
              onChange={(e) => setNewQuoteInput(e.target.value)}
              placeholder="« La citation inspirante qui t'aide à avancer... »"
              className="w-full p-2.5 rounded-xl border border-amber-200 text-xs font-serif"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingQuote(false)}
                className="px-3 py-1 rounded-lg text-xs text-slate-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-medium"
              >
                Ajouter à mes pépites
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {profile.favoriteQuotes.map((q, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100 flex items-start justify-between gap-3 text-xs sm:text-sm text-slate-700 font-serif"
            >
              <p className="italic leading-relaxed">{q}</p>
              <button
                onClick={() => handleRemoveQuote(idx)}
                className="text-slate-400 hover:text-rose-600 p-1 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* User's Publications */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Feather className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-900">Mes Publications sur le Mur</h2>
          </div>
          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau partage</span>
          </button>
        </div>

        {userPosts.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            Tu n'as pas encore déposé de création sur le Mur Bienveillant.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-2xl border border-amber-200/80 bg-amber-50/20 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 line-clamp-1">{post.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 capitalize">
                    {post.type}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-serif line-clamp-2 italic">
                  {post.content}
                </p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>{post.createdAt}</span>
                  <span>💛 {post.reactions.love + post.reactions.hope} soutiens</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
