import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Calendar, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  DollarSign, 
  BookOpen, 
  Heart, 
  Dumbbell, 
  Briefcase, 
  ChevronRight, 
  Trash2, 
  TrendingUp, 
  RefreshCw,
  Coins,
  Smile
} from 'lucide-react';
import { GoalItem, GoalCategory, GoalMilestone, ScheduleItem } from '../types';
import { playGentleChime } from '../utils/soundAndBreathing';

interface GoalsPlannerSpaceProps {
  goals: GoalItem[];
  onAddGoal: (goal: GoalItem) => void;
  onUpdateGoal: (goal: GoalItem) => void;
  onDeleteGoal: (id: string) => void;
  username?: string;
}

const PRESET_GOAL_TEMPLATES = [
  {
    title: 'Économiser 300 000 FCFA avant juin',
    category: 'financier' as GoalCategory,
    targetValue: '300 000 FCFA',
    currencyAmount: 300000,
    savedAmount: 45000,
    deadline: '2027-06-01',
    description: 'Acheter un ordinateur portable performant pour mes cours et projets de programmation.',
  },
  {
    title: 'Améliorer mon anglais courant (B2)',
    category: 'scolaire' as GoalCategory,
    targetValue: 'Niveau B2 & 30 min / jour',
    deadline: '2027-04-15',
    description: 'Pratiquer l’écoute de podcasts, le vocabulaire actif et parler sans appréhension.',
  },
  {
    title: 'Obtenir 16/20 de moyenne générale aux examens',
    category: 'scolaire' as GoalCategory,
    targetValue: '16/20',
    deadline: '2027-05-30',
    description: 'Réviser avec la méthode Feynman et des blocs réguliers pour aborder les épreuves sereinement.',
  },
  {
    title: 'Mieux dormir et apaiser mon stress du soir',
    category: 'personnel' as GoalCategory,
    targetValue: '7h30 de sommeil réparateur',
    deadline: 'En continu',
    description: 'Couper les écrans à 22h, 10 min de cohérence cardiaque et gratitude avant de dormir.',
  },
];

export const GoalsPlannerSpace: React.FC<GoalsPlannerSpaceProps> = ({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  username,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | 'all'>('all');
  const [selectedGoal, setSelectedGoal] = useState<GoalItem | null>(goals[0] || null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Form State for New Goal
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GoalCategory>('financier');
  const [newTargetValue, setNewTargetValue] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newSituation, setNewSituation] = useState('');

  // Update selected goal if goals change
  useEffect(() => {
    if (selectedGoal) {
      const updated = goals.find((g) => g.id === selectedGoal.id);
      if (updated) setSelectedGoal(updated);
    } else if (goals.length > 0) {
      setSelectedGoal(goals[0]);
    }
  }, [goals]);

  // Handle plan generation from Lumi
  const handleCreateWithLumiPlan = async () => {
    if (!newTitle.trim()) return;
    setIsGeneratingPlan(true);

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          targetValue: newTargetValue.trim(),
          deadline: newDeadline.trim(),
          currentSituation: newSituation.trim(),
        }),
      });

      const planData = await res.json();

      let currencyAmount: number | undefined = undefined;
      if (newCategory === 'financier') {
        const matches = (newTargetValue || newTitle).match(/\d[\d\s]*/);
        if (matches) {
          currencyAmount = parseInt(matches[0].replace(/\s/g, '')) || 100000;
        }
      }

      const milestones: GoalMilestone[] = (planData.milestones || []).map((m: any, idx: number) => ({
        id: `m-${Date.now()}-${idx}`,
        title: m.title || `Étape ${idx + 1}`,
        completed: false,
        targetDate: m.targetDate || '',
      }));

      const schedule: ScheduleItem[] = (planData.schedule || []).map((s: any, idx: number) => ({
        id: `s-${Date.now()}-${idx}`,
        day: s.day || 'Jour',
        time: s.time || '',
        activity: s.activity || '',
      }));

      const newGoal: GoalItem = {
        id: 'goal-' + Date.now(),
        title: newTitle.trim(),
        category: newCategory,
        targetValue: newTargetValue.trim() || undefined,
        currentProgress: 0,
        deadline: newDeadline.trim() || undefined,
        currencyAmount,
        savedAmount: currencyAmount ? 0 : undefined,
        planSummary: planData.summary,
        milestones,
        schedule,
        lumiEncouragement: planData.lumiEncouragement,
        createdAt: new Date().toLocaleDateString('fr-FR'),
        status: 'in_progress',
      };

      onAddGoal(newGoal);
      setSelectedGoal(newGoal);
      setIsCreatingNew(false);
      setNewTitle('');
      setNewTargetValue('');
      setNewDeadline('');
      setNewSituation('');
      playGentleChime(528);
    } catch (err) {
      console.error('Goal plan generation error:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleUsePreset = (template: typeof PRESET_GOAL_TEMPLATES[0]) => {
    setNewTitle(template.title);
    setNewCategory(template.category);
    setNewTargetValue(template.targetValue);
    setNewDeadline(template.deadline);
    setNewSituation(template.description);
    setIsCreatingNew(true);
  };

  // Toggle milestone completion
  const handleToggleMilestone = (goal: GoalItem, milestoneId: string) => {
    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progress = Math.round((completedCount / (updatedMilestones.length || 1)) * 100);

    const updatedGoal: GoalItem = {
      ...goal,
      milestones: updatedMilestones,
      currentProgress: progress,
      status: progress === 100 ? 'completed' : 'in_progress',
    };

    onUpdateGoal(updatedGoal);
    playGentleChime(progress === 100 ? 640 : 432);
  };

  // Add savings progress (FCFA)
  const handleAddSavings = (goal: GoalItem, amount: number) => {
    const current = goal.savedAmount || 0;
    const total = goal.currencyAmount || 300000;
    const newSaved = Math.min(total, current + amount);
    const progress = Math.round((newSaved / total) * 100);

    const updated: GoalItem = {
      ...goal,
      savedAmount: newSaved,
      currentProgress: progress,
      status: progress === 100 ? 'completed' : 'in_progress',
    };
    onUpdateGoal(updated);
    playGentleChime(528);
  };

  const filteredGoals = selectedCategory === 'all'
    ? goals
    : goals.filter((g) => g.category === selectedCategory);

  const CATEGORY_INFO: Record<GoalCategory, { label: string; icon: React.ReactNode; color: string }> = {
    personnel: { label: 'Personnel & Santé', icon: <Heart className="w-4 h-4" />, color: 'bg-rose-100 text-rose-800' },
    scolaire: { label: 'Scolaire & Études', icon: <BookOpen className="w-4 h-4" />, color: 'bg-amber-100 text-amber-900' },
    financier: { label: 'Financier & Épargne', icon: <DollarSign className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-800' },
    sport: { label: 'Sport & Énergie', icon: <Dumbbell className="w-4 h-4" />, color: 'bg-orange-100 text-orange-800' },
    projet: { label: 'Projet & Entreprise', icon: <Briefcase className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800' },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-100/80 via-amber-50 to-teal-100/70 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-200/70 text-emerald-900 text-xs font-semibold">
              <Target className="w-3.5 h-3.5 text-emerald-700" />
              <span>Objectifs & Planificateur Intelligent</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Donne une direction claire à tes rêves
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Que ce soit pour économiser 300 000 FCFA, réussir un examen, apprendre l’anglais ou retrouver un sommeil apaisé, Lumi t’aide à décomposer ton but en étapes simples et bienveillantes.
            </p>
          </div>

          <button
            onClick={() => setIsCreatingNew(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-transform active:scale-98 self-start sm:self-center shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel Objectif</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none mt-6 pt-4 border-t border-emerald-200/60">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-white/80 hover:bg-white text-slate-700'
            }`}
          >
            Tous mes objectifs ({goals.length})
          </button>
          {(['financier', 'scolaire', 'personnel', 'sport', 'projet'] as GoalCategory[]).map((cat) => {
            const count = goals.filter((g) => g.category === cat).length;
            const info = CATEGORY_INFO[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-white/80 hover:bg-white text-slate-700'
                }`}
              >
                {info.icon}
                <span>{info.label} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODAL / DRAWER TO CREATE A NEW GOAL WITH LUMI */}
      {isCreatingNew && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-emerald-300 shadow-md space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Créer un Objectif & Planifier avec Lumi
                </h3>
                <p className="text-xs text-slate-600">Lumi va automatiquement analyser ton but et créer un plan d'action réaliste.</p>
              </div>
            </div>
            <button
              onClick={() => setIsCreatingNew(false)}
              className="text-slate-400 hover:text-slate-700 text-sm font-semibold"
            >
              Fermer
            </button>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700">Ou choisis un modèle prêt à personnaliser :</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {PRESET_GOAL_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUsePreset(tmpl)}
                  className="p-2.5 rounded-xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 text-left text-xs text-emerald-950 font-medium transition-colors"
                >
                  <div className="font-bold truncate">{tmpl.title}</div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">{tmpl.targetValue}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Intitulé de l'objectif *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex : Économiser 300 000 FCFA, Réussir mon examen de droit..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Catégorie *</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as GoalCategory)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="financier">Financier & Épargne (ex: FCFA)</option>
                <option value="scolaire">Scolaire & Études (examens, diplômes)</option>
                <option value="personnel">Personnel & Bien-être (sommeil, lecture)</option>
                <option value="sport">Sport & Santé physique</option>
                <option value="projet">Projet créatif ou entrepreneurial</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Objectif chiffré / résultat visé</label>
              <input
                type="text"
                value={newTargetValue}
                onChange={(e) => setNewTargetValue(e.target.value)}
                placeholder="Ex : 300 000 FCFA, 16/20, 8h par nuit..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Échéance souhaitée</label>
              <input
                type="text"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                placeholder="Ex : 1er juin 2027, Fin du semestre, 3 mois..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">Ta situation de départ / précisions</label>
              <textarea
                value={newSituation}
                onChange={(e) => setNewSituation(e.target.value)}
                rows={2}
                placeholder="Ex : J'étudie à l'université et j'ai besoin d'un ordinateur pour coder. Je peux mettre de côté un petit montant chaque semaine..."
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsCreatingNew(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              onClick={handleCreateWithLumiPlan}
              disabled={isGeneratingPlan || !newTitle.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
            >
              {isGeneratingPlan ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Lumi conçoit ton plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Générer le plan intelligent</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN VIEW: LIST & ACTIVE GOAL DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Goals List */}
        <div className="space-y-3 lg:col-span-1">
          <h2 className="text-sm font-bold text-slate-800 flex items-center justify-between">
            <span>Mes Objectifs Actifs ({filteredGoals.length})</span>
          </h2>

          {filteredGoals.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center space-y-3">
              <Target className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-600">Aucun objectif dans cette catégorie pour le moment.</p>
              <button
                onClick={() => setIsCreatingNew(true)}
                className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100"
              >
                Créer mon premier objectif
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredGoals.map((goal) => {
                const isSelected = selectedGoal?.id === goal.id;
                const cat = CATEGORY_INFO[goal.category] || CATEGORY_INFO.personnel;
                return (
                  <div
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-white hover:bg-emerald-50/40 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.color}`}>
                          {cat.label}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {goal.title}
                        </h3>
                        {goal.targetValue && (
                          <p className="text-[11px] text-slate-600 font-medium">{goal.targetValue}</p>
                        )}
                      </div>
                      <span className="text-xs font-bold text-emerald-700 shrink-0">
                        {goal.currentProgress}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${goal.currentProgress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Goal Detail & Intelligent Planner */}
        <div className="lg:col-span-2">
          {selectedGoal ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-2xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${CATEGORY_INFO[selectedGoal.category].color}`}>
                      {CATEGORY_INFO[selectedGoal.category].label}
                    </span>
                    {selectedGoal.deadline && (
                      <span className="text-xs text-slate-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Échéance : {selectedGoal.deadline}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {selectedGoal.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm('Voulez-vous supprimer cet objectif ?')) {
                        onDeleteGoal(selectedGoal.id);
                        setSelectedGoal(null);
                      }
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Supprimer l'objectif"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Summary Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900">
                  <span>Progression globale</span>
                  <span className="text-emerald-800">{selectedGoal.currentProgress}% complété</span>
                </div>
                <div className="w-full bg-emerald-200/80 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${selectedGoal.currentProgress}%` }}
                  />
                </div>

                {/* If Financial Goal: Savings Adder */}
                {selectedGoal.category === 'financier' && selectedGoal.currencyAmount && (
                  <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-emerald-950 font-medium">
                      Épargné : <span className="font-bold">{selectedGoal.savedAmount?.toLocaleString('fr-FR')} FCFA</span> / {selectedGoal.currencyAmount?.toLocaleString('fr-FR')} FCFA
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-emerald-900 font-semibold">Ajouter épargne :</span>
                      {[5000, 15000, 25000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => handleAddSavings(selectedGoal, amt)}
                          className="px-2.5 py-1 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition-colors shadow-2xs"
                        >
                          +{amt.toLocaleString('fr-FR')} F
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lumi's Encouragement & Summary */}
              {selectedGoal.lumiEncouragement && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                  <Smile className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-amber-900">Le mot encourageant de Lumi</div>
                    <p className="text-xs text-amber-950 leading-relaxed italic">
                      « {selectedGoal.lumiEncouragement} »
                    </p>
                  </div>
                </div>
              )}

              {/* Milestones Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Étapes de progression à cocher</span>
                </h3>
                <div className="space-y-2">
                  {selectedGoal.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(selectedGoal, m.id)}
                      className={`flex items-start gap-3 p-3 rounded-2xl border transition-colors cursor-pointer ${
                        m.completed
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <button className="mt-0.5 shrink-0 text-emerald-600">
                        {m.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs sm:text-sm font-semibold ${m.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {m.title}
                        </div>
                        {m.targetDate && (
                          <span className="text-[10px] text-slate-600">{m.targetDate}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule / Timetable */}
              {selectedGoal.schedule && selectedGoal.schedule.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>Emploi du temps & Rythme hebdomadaire</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedGoal.schedule.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-teal-50/50 border border-teal-100 flex items-start gap-2.5"
                      >
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-teal-200/80 text-teal-900 shrink-0">
                          {item.day}
                        </span>
                        <div className="text-xs text-slate-800">
                          {item.time && <span className="font-semibold text-teal-900">({item.time}) </span>}
                          {item.activity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
              <Target className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Sélectionne un objectif</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Clique sur l’un de tes objectifs dans la colonne de gauche pour afficher son plan détaillé et cocher tes progrès.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
