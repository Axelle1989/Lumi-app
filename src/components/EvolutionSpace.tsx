import React, { useState } from 'react';
import { 
  Sprout, 
  Trophy, 
  BookHeart, 
  Calendar, 
  CheckCircle, 
  Sparkles, 
  Clock, 
  Award, 
  ChevronRight, 
  RotateCcw,
  Flame,
  Plus,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { EvolutionReport, AnnualRecapData, LifeStoryMoment } from '../types';
import { 
  INITIAL_CHALLENGES_30, 
  INITIAL_EVOLUTION_REPORT, 
  INITIAL_LIFE_STORY_MOMENTS 
} from '../data/initialData';
import { playGentleChime } from '../utils/soundAndBreathing';

interface EvolutionSpaceProps {
  username?: string;
}

export const EvolutionSpace: React.FC<EvolutionSpaceProps> = ({ username }) => {
  const [subTab, setSubTab] = useState<'evolution' | 'challenges' | 'story'>('evolution');

  // Evolution Report state
  const [evolutionReport, setEvolutionReport] = useState<EvolutionReport>(() => {
    const saved = localStorage.getItem('lumi_evolution_report');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_EVOLUTION_REPORT;
  });
  const [isAnalyzingEvolution, setIsAnalyzingEvolution] = useState(false);

  // 30 Days Challenges state
  const [challenges, setChallenges] = useState(() => {
    const saved = localStorage.getItem('lumi_challenges_30');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_CHALLENGES_30;
  });
  const [activeChallengeId, setActiveChallengeId] = useState<string>('c-30-confiance');

  // Life Story state
  const [storyMoments, setStoryMoments] = useState<LifeStoryMoment[]>(() => {
    const saved = localStorage.getItem('lumi_story_moments');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_LIFE_STORY_MOMENTS;
  });

  const [newMomentTitle, setNewMomentTitle] = useState('');
  const [newMomentType, setNewMomentType] = useState<LifeStoryMoment['type']>('success');
  const [newMomentDesc, setNewMomentDesc] = useState('');

  // Annual Recap state
  const [annualRecap, setAnnualRecap] = useState<AnnualRecapData | null>(() => {
    const saved = localStorage.getItem('lumi_annual_recap_2026');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null;
  });
  const [isGeneratingRecap, setIsGeneratingRecap] = useState(false);

  // Toggle challenge day
  const handleToggleDay = (challengeId: string, dayNum: number) => {
    const updated = challenges.map((c) => {
      if (c.id !== challengeId) return c;
      const updatedDays = c.days.map((d) => (d.day === dayNum ? { ...d, completed: !d.completed } : d));
      return { ...c, days: updatedDays };
    });
    setChallenges(updated);
    localStorage.setItem('lumi_challenges_30', JSON.stringify(updated));
    playGentleChime(659);
  };

  // Add story moment
  const handleAddMoment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMomentTitle.trim() || !newMomentDesc.trim()) return;

    const item: LifeStoryMoment = {
      id: `moment-${Date.now()}`,
      title: newMomentTitle.trim(),
      type: newMomentType,
      date: new Date().toLocaleDateString('fr-FR'),
      description: newMomentDesc.trim(),
      lumiNote: "Un jalon précieux gravé dans ton carnet d'âme.",
    };

    const updated = [item, ...storyMoments];
    setStoryMoments(updated);
    localStorage.setItem('lumi_story_moments', JSON.stringify(updated));
    setNewMomentTitle('');
    setNewMomentDesc('');
    playGentleChime(528);
  };

  // Refresh Evolution Analysis
  const handleRefreshEvolution = async () => {
    setIsAnalyzingEvolution(true);
    try {
      const res = await fetch('/api/evolution-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recentNotes: storyMoments.map((s) => s.description).join(' | '),
          timeRange: '1 an',
        }),
      });
      const data = await res.json();
      setEvolutionReport(data);
      localStorage.setItem('lumi_evolution_report', JSON.stringify(data));
      playGentleChime(784);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingEvolution(false);
    }
  };

  // Generate Annual Recap
  const handleGenerateRecap = async () => {
    setIsGeneratingRecap(true);
    try {
      const res = await fetch('/api/annual-recap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: 2026,
          moments: storyMoments,
        }),
      });
      const data = await res.json();
      setAnnualRecap(data);
      localStorage.setItem('lumi_annual_recap_2026', JSON.stringify(data));
      playGentleChime(880);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingRecap(false);
    }
  };

  const selectedChallenge = challenges.find((c) => c.id === activeChallengeId) || challenges[0];
  const completedDaysCount = selectedChallenge.days.filter((d) => d.completed).length;
  const progressPercent = Math.round((completedDaysCount / selectedChallenge.days.length) * 100);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sprout className="w-4 h-4" />
            <span>Mon Évolution, Défis & Mémoires</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Mesurer le chemin parcouru et honorer ses métamorphoses.
          </h2>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Ici, tu ne repars jamais de zéro. Redécouvre qui tu étais il y a 1 mois, 6 mois ou 1 an, relève les défis de 30 jours et immortalise ton histoire avec les bilans annuels de Lumi.
          </p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-amber-100/70 border border-amber-200/80">
        <button
          onClick={() => setSubTab('evolution')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            subTab === 'evolution'
              ? 'bg-white text-emerald-950 shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Sprout className="w-4 h-4 text-emerald-600" />
          <span>🌱 Mon Évolution dans le Temps</span>
        </button>

        <button
          onClick={() => setSubTab('challenges')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            subTab === 'challenges'
              ? 'bg-white text-emerald-950 shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>🏆 Défis Personnels 30 Jours</span>
        </button>

        <button
          onClick={() => setSubTab('story')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            subTab === 'story'
              ? 'bg-white text-emerald-950 shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <BookHeart className="w-4 h-4 text-rose-600" />
          <span>📖 Mon Histoire & Année 2026 ({storyMoments.length})</span>
        </button>
      </div>

      {/* 1. MON ÉVOLUTION */}
      {subTab === 'evolution' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-2xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Regard Rétrospectif de Lumi
                </span>
                <h3 className="text-xl font-bold text-slate-800">{evolutionReport.headline}</h3>
              </div>
              <button
                onClick={handleRefreshEvolution}
                disabled={isAnalyzingEvolution}
                className="py-2 px-4 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-2xs"
              >
                {isAnalyzingEvolution ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-emerald-300" />}
                <span>Actualiser l'Analyse</span>
              </button>
            </div>

            {/* Timeline: 1 month, 6 months, 1 year */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Qui j'étais il y a 1 mois</span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  {evolutionReport.oneMonthAgo}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-teal-50/60 border border-teal-200/80 space-y-2">
                <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-teal-700" />
                  <span>Qui j'étais il y a 6 mois</span>
                </div>
                <p className="text-xs text-teal-950 leading-relaxed font-medium">
                  {evolutionReport.sixMonthsAgo}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-indigo-700" />
                  <span>Qui j'étais il y a 1 an</span>
                </div>
                <p className="text-xs text-indigo-950 leading-relaxed font-medium">
                  {evolutionReport.oneYearAgo}
                </p>
              </div>
            </div>

            {/* Lumi's key insights */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Ce que Lumi remarque dans ton comportement :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {evolutionReport.growthInsights.map((insight, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-800 leading-relaxed">{insight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Celebration note */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-950 italic">
              « {evolutionReport.celebrationMessage} »
            </div>
          </div>
        </div>
      )}

      {/* 2. DÉFIS 30 JOURS */}
      {subTab === 'challenges' && (
        <div className="space-y-6">
          {/* Challenge Selector tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {challenges.map((c) => {
              const count = c.days.filter((d) => d.completed).length;
              const pct = Math.round((count / c.days.length) * 100);
              const isActive = c.id === activeChallengeId;

              return (
                <div
                  key={c.id}
                  onClick={() => setActiveChallengeId(c.id)}
                  className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                    isActive
                      ? 'border-amber-500 bg-amber-50/80 shadow-2xs ring-2 ring-amber-400/40'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-amber-800 uppercase text-[10px]">{c.category}</span>
                    <span className="font-bold text-slate-700">{pct}%</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-2">{c.title}</h4>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Challenge Detailed Days */}
          <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>Récompense promise : {selectedChallenge.badgeReward}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">{selectedChallenge.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{selectedChallenge.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 block">
                    {completedDaysCount} / {selectedChallenge.days.length} jours validés
                  </span>
                  <span className="text-[11px] text-emerald-800 font-semibold">{progressPercent}% terminé</span>
                </div>
              </div>
            </div>

            {/* 30 days grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedChallenge.days.map((d) => (
                <div
                  key={d.day}
                  onClick={() => handleToggleDay(selectedChallenge.id, d.day)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    d.completed
                      ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      d.completed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {d.completed ? '✓' : d.day}
                  </div>

                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                      Jour {d.day}
                    </span>
                    <p className="text-xs font-medium leading-snug">{d.task}</p>
                    {d.reflection && (
                      <p className="text-[11px] mt-1 text-slate-500 italic">« {d.reflection} »</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MON HISTOIRE & BILAN ANNUEL */}
      {subTab === 'story' && (
        <div className="space-y-6">
          {/* Annual Recap Generator Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-xl">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1">
                L'Album de Vie Lumi
              </span>
              <h3 className="text-xl font-bold mb-1">Ton Année 2026 en Résumé</h3>
              <p className="text-xs text-purple-100/90 leading-relaxed">
                Génère une rétrospective poétique de tes moments forts, des tempêtes que tu as traversées et de tes plus beaux progrès.
              </p>
            </div>
            <button
              onClick={handleGenerateRecap}
              disabled={isGeneratingRecap}
              className="py-2.5 px-5 rounded-xl bg-white text-purple-900 font-bold text-xs hover:bg-purple-50 transition-colors flex items-center gap-2 shadow-2xs disabled:opacity-50"
            >
              {isGeneratingRecap ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-purple-600" />}
              <span>Générer mon bilan 2026</span>
            </button>
          </div>

          {/* Annual recap display if generated */}
          {annualRecap && (
            <div className="p-6 rounded-3xl bg-white border border-purple-200 shadow-2xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                  Rétrospective Officielle
                </span>
                <h3 className="text-xl font-bold text-slate-800">{annualRecap.headline}</h3>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                <p className="text-xs text-purple-950 font-medium leading-relaxed">
                  « {annualRecap.openingPoem} »
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-800 uppercase block">Épreuves Surmontées</span>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {annualRecap.hardshipsOvercome.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-800 uppercase block">Grandes Victoires</span>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {annualRecap.biggestAchievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-800 uppercase block">Métamorphoses</span>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    {annualRecap.transformedBeliefs.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 font-medium">
                <strong>Vœu de Lumi pour l'an prochain :</strong> {annualRecap.lumiWishForNextYear}
              </div>
            </div>
          )}

          {/* Add story moment form */}
          <form onSubmit={handleAddMoment} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">Écrire un nouveau chapitre de mon parcours</h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <input
                  type="text"
                  placeholder="Titre du souvenir ou de l'épreuve"
                  value={newMomentTitle}
                  onChange={(e) => setNewMomentTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  required
                />
              </div>
              <div className="sm:col-span-4">
                <select
                  value={newMomentType}
                  onChange={(e) => setNewMomentType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none bg-white"
                >
                  <option value="success">Grande victoire</option>
                  <option value="hardship_overcome">Épreuve surmontée</option>
                  <option value="milestone">Étape marquante</option>
                  <option value="key_memory">Souvenir précieux</option>
                </select>
              </div>
              <div className="sm:col-span-12">
                <textarea
                  rows={2}
                  placeholder="Raconte ce qui s'est passé et ce que cela t'a appris sur toi-même..."
                  value={newMomentDesc}
                  onChange={(e) => setNewMomentDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                  required
                />
              </div>
              <div className="sm:col-span-12 flex justify-end">
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-rose-700 text-white font-semibold text-xs hover:bg-rose-800 transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enregistrer dans mon histoire</span>
                </button>
              </div>
            </div>
          </form>

          {/* Moments timeline */}
          <div className="space-y-3">
            {storyMoments.map((m) => (
              <div key={m.id} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {m.type === 'hardship_overcome'
                        ? 'Épreuve surmontée'
                        : m.type === 'success'
                        ? 'Victoire'
                        : m.type === 'milestone'
                        ? 'Jalon'
                        : 'Souvenir'}
                    </span>
                    <span className="font-semibold text-slate-800">{m.title}</span>
                  </div>
                  <span className="text-slate-600 text-[11px]">{m.date}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{m.description}</p>
                {m.lumiNote && (
                  <p className="text-[11px] text-teal-800 italic pt-1 border-t border-slate-100">
                    « {m.lumiNote} » — Lumi
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
