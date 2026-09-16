import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Unlock, 
  Sparkles, 
  Calendar, 
  PlusCircle, 
  Clock, 
  Heart, 
  Send,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { FutureLetter } from '../types';
import { INITIAL_FUTURE_LETTERS } from '../data/initialData';
import { playGentleChime } from '../utils/soundAndBreathing';

interface FutureLetterViewProps {
  username?: string;
  onOpenPrivateChat?: () => void;
}

export const FutureLetterView: React.FC<FutureLetterViewProps> = ({ username = 'Ami', onOpenPrivateChat }) => {
  const [letters, setLetters] = useState<FutureLetter[]>(() => {
    try {
      const stored = localStorage.getItem('lumi_future_letters');
      return stored ? JSON.parse(stored) : INITIAL_FUTURE_LETTERS;
    } catch {
      return INITIAL_FUTURE_LETTERS;
    }
  });

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('2027-06-08');
  const [selectedPreset, setSelectedPreset] = useState<'1m' | '6m' | '1y' | 'custom'>('custom');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<FutureLetter | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('lumi_future_letters', JSON.stringify(letters));
    } catch {}
  }, [letters]);

  // Quick preset dates
  const handleSelectPreset = (preset: '1m' | '6m' | '1y' | '2027') => {
    const d = new Date();
    if (preset === '1m') {
      d.setMonth(d.getMonth() + 1);
    } else if (preset === '6m') {
      d.setMonth(d.getMonth() + 6);
    } else if (preset === '1y') {
      d.setFullYear(d.getFullYear() + 1);
    } else if (preset === '2027') {
      setUnlockDate('2027-06-08');
      setSelectedPreset('custom');
      return;
    }
    const iso = d.toISOString().split('T')[0];
    setUnlockDate(iso);
    setSelectedPreset(preset as any);
  };

  const handleCreateLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert("Merci de donner un titre et de rédiger le contenu de ta lettre.");
      return;
    }

    setIsSubmitting(true);
    let lumiBlessingText = "Que cette capsule temporelle préserve tes plus beaux espoirs. Ton futur moi sera si fier de ton parcours. ✨💛";

    try {
      const res = await fetch('/api/bless-future-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          unlockDate,
          username,
        }),
      });
      const data = await res.json();
      if (data.blessing) {
        lumiBlessingText = data.blessing;
      }
    } catch {}

    const newLetter: FutureLetter = {
      id: 'letter-' + Date.now(),
      title: newTitle.trim(),
      content: newContent.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      unlockDate: unlockDate,
      isOpened: false,
      lumiBlessing: lumiBlessingText,
    };

    setLetters([newLetter, ...letters]);
    setIsSubmitting(false);
    setIsWriteModalOpen(false);
    setNewTitle('');
    setNewContent('');
    playGentleChime(528);
  };

  const getDaysRemaining = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const today = new Date().getTime();
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-linear-to-br from-amber-100/70 via-white to-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-200/80 text-amber-900 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-700" />
              <span>Capsule Temporelle Émotionnelle</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Lettre à mon futur moi
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed font-serif">
            Écris aujourd'hui avec le cœur. Scelle tes espoirs, tes doutes ou tes rêves, et choisis la date future où Lumi te rouvrira cette capsule sacrée.
          </p>
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-transform active:scale-98 shadow-sm shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Écrire une lettre</span>
        </button>
      </div>

      {/* Letters List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {letters.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-amber-200/60 p-8 space-y-3">
            <Mail className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="font-bold text-slate-800">Aucune lettre scellée pour le moment</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Prends quelques minutes pour envoyer de la force ou de la douceur à la personne que tu seras dans 6 mois ou dans 1 an.
            </p>
          </div>
        ) : (
          letters.map((letter) => {
            const daysLeft = getDaysRemaining(letter.unlockDate);
            const isReadyToOpen = daysLeft <= 0 || letter.isOpened;

            return (
              <div
                key={letter.id}
                onClick={() => setSelectedLetter(letter)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isReadyToOpen
                    ? 'bg-white border-amber-300 hover:border-amber-400 hover:shadow-md'
                    : 'bg-amber-50/50 border-amber-200/80 hover:bg-amber-50/80'
                }`}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Créée le {letter.createdAt}</span>
                  </span>

                  {isReadyToOpen ? (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Déverrouillée</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 flex items-center gap-1 border border-amber-300">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Scellée (dans {daysLeft} jours)</span>
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-700 transition-colors">
                  {letter.title}
                </h3>

                <div className="text-xs text-slate-600 mb-4 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>À ouvrir le : <strong className="text-slate-900">{letter.unlockDate}</strong></span>
                </div>

                {isReadyToOpen ? (
                  <p className="text-xs text-slate-700 font-serif line-clamp-2 italic">
                    « {letter.content} »
                  </p>
                ) : (
                  <div className="p-3 rounded-2xl bg-white/70 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Le contenu reste secret jusqu’à la date d’ouverture. Ton futur t’attend.</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Write New Letter */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-amber-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Sceller une lettre pour l'avenir</h2>
                  <p className="text-xs text-slate-500">Un message d'amour et de courage pour ton futur moi</p>
                </div>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLetter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titre ou intention de la lettre
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Quand j'aurai enfin mon diplôme, Pour un jour de doute..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Date selection presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Quand souhaites-tu l'ouvrir ?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('1m')}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-medium border border-amber-200 hover:bg-amber-50 transition-colors"
                  >
                    Dans 1 mois
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('6m')}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-medium border border-amber-200 hover:bg-amber-50 transition-colors"
                  >
                    Dans 6 mois
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('1y')}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-medium border border-amber-200 hover:bg-amber-50 transition-colors"
                  >
                    Dans 1 an
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('2027')}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-medium border border-amber-300 bg-amber-50 text-amber-900"
                  >
                    8 juin 2027
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Date précise :</span>
                  <input
                    type="date"
                    required
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-amber-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ta lettre intime
                </label>
                <textarea
                  rows={6}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Raconte à ton futur toi ce que tu traverses aujourd'hui, tes rêves, tes peurs surmontées, et promets-lui d'être fier(e) de son chemin..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 text-sm font-serif leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Lumi scellera cette lettre avec une douce bénédiction personnalisée qui se révélera le jour de l'ouverture.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-transform active:scale-98 shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? "Scellement en cours..." : "Sceller la lettre"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Letter Details */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#fffdf9] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedLetter(null)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {getDaysRemaining(selectedLetter.unlockDate) > 0 && !selectedLetter.isOpened ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-8 h-8 text-amber-700 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{selectedLetter.title}</h3>
                <p className="text-sm text-slate-600 font-serif max-w-xs mx-auto">
                  Cette lettre est encore scellée dans le temps. Elle se déverrouillera automatiquement le <strong>{selectedLetter.unlockDate}</strong> (dans {getDaysRemaining(selectedLetter.unlockDate)} jours).
                </p>
                <p className="text-xs text-amber-700 italic">
                  Garde confiance en ton chemin, le meilleur est à venir. ✨
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold uppercase tracking-wider">
                  <Unlock className="w-4 h-4 text-emerald-600" />
                  <span>Capsule Ouverte</span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 font-serif">{selectedLetter.title}</h2>
                <div className="text-xs text-slate-400 flex items-center gap-3">
                  <span>Écrite le {selectedLetter.createdAt}</span>
                  <span>•</span>
                  <span>Prévue pour le {selectedLetter.unlockDate}</span>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-sm text-slate-800 leading-relaxed font-serif whitespace-pre-wrap">
                  {selectedLetter.content}
                </div>

                {selectedLetter.lumiBlessing && (
                  <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-300 text-xs text-amber-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>La bénédiction de Lumi</span>
                    </div>
                    <p className="italic leading-relaxed">{selectedLetter.lumiBlessing}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
