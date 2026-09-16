import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Image as ImageIcon, 
  Feather, 
  Music, 
  FileText, 
  Quote, 
  Plus, 
  Heart, 
  Share2, 
  Eye, 
  Download,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { PortfolioItem } from '../types';
import { INITIAL_PORTFOLIO_CREATIONS } from '../data/initialData';
import { playGentleChime } from '../utils/soundAndBreathing';

interface PersonalPortfolioSpaceProps {
  username?: string;
  onShareToCommunity?: (item: PortfolioItem) => void;
}

export const PersonalPortfolioSpace: React.FC<PersonalPortfolioSpaceProps> = ({ 
  username,
  onShareToCommunity 
}) => {
  const [filter, setFilter] = useState<'all' | PortfolioItem['type']>('all');
  const [creations, setCreations] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('lumi_personal_portfolio');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_PORTFOLIO_CREATIONS;
  });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<PortfolioItem['type']>('poeme');
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const [activeItemModal, setActiveItemModal] = useState<PortfolioItem | null>(null);

  const handleSaveCreation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const item: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      content: newContent.trim(),
      imageUrl: newImageUrl.trim() || undefined,
      createdAt: new Date().toLocaleDateString('fr-FR'),
      sharedToCommunity: false,
    };

    const updated = [item, ...creations];
    setCreations(updated);
    localStorage.setItem('lumi_personal_portfolio', JSON.stringify(updated));
    setNewTitle('');
    setNewContent('');
    setNewImageUrl('');
    setIsAddingNew(false);
    playGentleChime(784);
  };

  const handleDeleteCreation = (id: string) => {
    const updated = creations.filter((c) => c.id !== id);
    setCreations(updated);
    localStorage.setItem('lumi_personal_portfolio', JSON.stringify(updated));
    if (activeItemModal?.id === id) setActiveItemModal(null);
  };

  const handleShare = (item: PortfolioItem) => {
    const updated = creations.map((c) => (c.id === item.id ? { ...c, sharedToCommunity: true } : c));
    setCreations(updated);
    localStorage.setItem('lumi_personal_portfolio', JSON.stringify(updated));
    if (onShareToCommunity) {
      onShareToCommunity(item);
    }
    playGentleChime(528);
  };

  const filteredCreations = filter === 'all' ? creations : creations.filter((c) => c.type === filter);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-rose-950 text-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Palette className="w-4 h-4" />
              <span>Mon Musée Intérieur & Portfolio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Chaque étincelle créée est une preuve vivante de ta lumière.
            </h2>
            <p className="text-sm text-purple-100/90 leading-relaxed">
              Conserve précieusement tes poèmes, dessins, paroles de chansons, citations illustrées et affirmations. Tu peux choisir de les garder intimes ou de les offrir au Mur Bienveillant.
            </p>
          </div>

          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="py-2.5 px-5 rounded-2xl bg-white text-purple-950 font-bold text-xs hover:bg-purple-50 transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Plus className="w-4 h-4 text-purple-700" />
            <span>Ajouter une création</span>
          </button>
        </div>
      </div>

      {/* Add creation form modal / card */}
      {isAddingNew && (
        <form onSubmit={handleSaveCreation} className="p-6 rounded-3xl bg-white border border-purple-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Ajouter une œuvre à mon portfolio</h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-slate-600 hover:text-slate-700"
            >
              Fermer
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8">
              <input
                type="text"
                placeholder="Titre de l'œuvre (ex: Poème du crépuscule, Dessin de l'arbre)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <div className="sm:col-span-4">
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 outline-none bg-white"
              >
                <option value="poeme">Poème</option>
                <option value="chanson">Paroles de chanson</option>
                <option value="dessin">Dessin ou toile</option>
                <option value="texte">Texte ou conte</option>
                <option value="affirmation">Affirmation inspirante</option>
                <option value="citation_illustree">Citation illustrée</option>
              </select>
            </div>
            <div className="sm:col-span-12">
              <textarea
                rows={4}
                placeholder="Écris le texte, les paroles ou la description ici..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 outline-none resize-none font-mono"
                required
              />
            </div>
            <div className="sm:col-span-12">
              <input
                type="url"
                placeholder="URL d'une image ou illustration (facultatif)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="sm:col-span-12 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-950 shadow-2xs"
              >
                Enregistrer dans mon portfolio
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Categories Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'Toutes les créations', icon: Palette },
          { id: 'poeme', label: 'Poèmes', icon: Feather },
          { id: 'chanson', label: 'Chansons', icon: Music },
          { id: 'dessin', label: 'Dessins & Art', icon: ImageIcon },
          { id: 'texte', label: 'Textes & Contes', icon: FileText },
          { id: 'citation_illustree', label: 'Citations illustrées', icon: Quote },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = filter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCreations.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-all group"
          >
            <div className="space-y-3">
              {item.imageUrl && (
                <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-50 text-purple-800">
                  {item.type}
                </span>
                <span className="text-[11px] text-slate-600">{item.createdAt}</span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.title}</h4>
                <p className="text-xs text-slate-700 mt-1 line-clamp-3 font-serif whitespace-pre-line leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setActiveItemModal(item)}
                className="text-purple-800 font-semibold hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ouvrir</span>
              </button>

              <div className="flex items-center gap-2">
                {!item.sharedToCommunity ? (
                  <button
                    onClick={() => handleShare(item)}
                    className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                    title="Partager sur le Mur Bienveillant"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Partager</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Sur le Mur</span>
                  </span>
                )}

                <button
                  onClick={() => handleDeleteCreation(item.id)}
                  className="text-slate-600 hover:text-rose-600 transition-colors p-1"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal View for full item */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                  {activeItemModal.type}
                </span>
                <h3 className="text-lg font-bold text-slate-800">{activeItemModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveItemModal(null)}
                className="text-slate-600 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {activeItemModal.imageUrl && (
              <div className="w-full h-56 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={activeItemModal.imageUrl}
                  alt={activeItemModal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
              <p className="text-xs text-slate-800 font-serif whitespace-pre-line leading-relaxed">
                {activeItemModal.content}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span>Créé le {activeItemModal.createdAt}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${activeItemModal.title}\n\n${activeItemModal.content}`);
                  playGentleChime(659);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 transition-colors"
              >
                Copier le texte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
