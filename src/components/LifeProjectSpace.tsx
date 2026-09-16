import React, { useState } from 'react';
import { 
  Milestone, 
  Sparkles, 
  ShieldAlert, 
  SunMedium, 
  CalendarCheck, 
  RotateCcw, 
  CheckCircle2, 
  HeartHandshake, 
  Flag,
  Flame,
  Clock
} from 'lucide-react';
import { LifeProjectPlan } from '../types';
import { playGentleChime } from '../utils/soundAndBreathing';

interface LifeProjectSpaceProps {
  username?: string;
}

export const LifeProjectSpace: React.FC<LifeProjectSpaceProps> = ({ username }) => {
  const [oneYearVision, setOneYearVision] = useState('');
  const [fiveYearVision, setFiveYearVision] = useState('');
  const [deepFears, setDeepFears] = useState('');
  const [boldDreams, setBoldDreams] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [plan, setPlan] = useState<LifeProjectPlan | null>(() => {
    const saved = localStorage.getItem('lumi_life_project_plan');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      title: "Plan de Vie : Sérénité, Autonomie & Rayonnement",
      visionHorizon1Year: "Avoir validé mes examens avec mention, posséder mon propre ordinateur de travail financé par mon épargne, et me sentir serein(e) et confiant(e) au quotidien.",
      visionHorizon5Years: "Être indépendant(e) financièrement, diriger des projets qui ont du sens, voyager et inspirer ma communauté en redonnant aux plus jeunes.",
      roadmapMilestones: [
        {
          period: "Trimestre 1 (Fondations & Clarté)",
          goal: "Mettre en place la routine matinale douce, sécuriser les 50 000 premiers FCFA d'épargne et maîtriser la méthode Feynman.",
          practicalAction: "Bloquer 25 minutes chaque matin sans écran pour réviser et méditer."
        },
        {
          period: "Trimestre 2 (Accélération & Confiance)",
          goal: "Passer les examens blancs sans stress et s'engager dans un projet collaboratif ou associatif.",
          practicalAction: "Prendre la parole en public une fois par semaine."
        },
        {
          period: "Trimestre 3 (Concrétisation)",
          goal: "Acquérir l'ordinateur portable et valider la certification d'anglais B2.",
          practicalAction: "Célébrer cette immense victoire et écrire la lettre de gratitude à son passé."
        },
        {
          period: "Trimestre 4 (Bilan & Envol)",
          goal: "Lancer son premier micro-projet ou décrocher son stage de rêve.",
          practicalAction: "Proposer son aide comme parrain bienveillant à un nouvel arrivant."
        }
      ],
      fearAntidotes: [
        {
          fear: "Peur de ne pas être à la hauteur ou d'échouer face aux attentes de la famille",
          antidote: "L'échec n'est pas le contraire de la réussite, c'est son atelier d'apprentissage. Tu avances à ton propre rythme, et ta valeur est intrinsèque."
        },
        {
          fear: "Peur du manque d'argent ou d'opportunités",
          antidote: "La discipline d'un petit pas régulier (500 FCFA/jour, 20 min d'apprentissage) finit par déplacer des montagnes d'obstacles."
        }
      ],
      dailyTenMinutesRitual: "Chaque matin : 3 respirations profondes, 1 intention claire pour la journée. Chaque soir : noter 3 victoires, même minuscules.",
      lumiPledge: "Je serai toujours là à tes côtés, dans les jours de doute comme dans les jours de gloire. Tu es plus fort(e) que tes peurs les plus sombres. ✨🌱"
    };
  });

  const handleGeneratePlan = async () => {
    if (!oneYearVision.trim() && !boldDreams.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/life-project-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oneYearVision,
          fiveYearVision,
          deepFears,
          boldDreams,
        }),
      });
      const data = await res.json();
      setPlan(data);
      localStorage.setItem('lumi_life_project_plan', JSON.stringify(data));
      playGentleChime(659);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-rose-950 text-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Milestone className="w-4 h-4" />
            <span>Mode « Projet de Vie »</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Transformer tes rêves en feuille de route inébranlable.
          </h2>
          <p className="text-sm text-amber-100/90 leading-relaxed">
            Parce qu’au fond, tu ne cherches pas seulement du réconfort passager. Tu cherches à guérir, à grandir, à créer, à réussir et à donner un sens puissant à ton existence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input questions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-amber-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-slate-800 text-sm">Les 4 Questions Fondatrices</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>1. Où veux-tu être dans 1 an ?</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Diplôme en poche, sérénité retrouvée, ordi financé, en paix avec moi-même..."
                  value={oneYearVision}
                  onChange={(e) => setOneYearVision(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                  <Flag className="w-3.5 h-3.5 text-indigo-600" />
                  <span>2. Où veux-tu être dans 5 ans ?</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Vivre de ma passion, avoir mon autonomie, inspirer les autres..."
                  value={fiveYearVision}
                  onChange={(e) => setFiveYearVision(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  <span>3. Quelles sont tes peurs les plus profondes ?</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Peur d'échouer, peur de décevoir, peur de manquer d'argent..."
                  value={deepFears}
                  onChange={(e) => setDeepFears(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>4. Quels sont tes rêves les plus audacieux ?</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Créer mon entreprise au Bénin, voyager, soutenir ma famille..."
                  value={boldDreams}
                  onChange={(e) => setBoldDreams(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>

              <button
                onClick={handleGeneratePlan}
                disabled={isLoading || (!oneYearVision.trim() && !boldDreams.trim())}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-700 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-amber-800 transition-colors disabled:opacity-50 shadow-2xs"
              >
                {isLoading ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Lumi tisse ta feuille de route...</span>
                  </>
                ) : (
                  <>
                    <Milestone className="w-4 h-4 text-amber-200" />
                    <span>Construire mon Projet de Vie</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: The Roadmap Plan */}
        <div className="lg:col-span-7">
          {plan ? (
            <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  ⭐ Ta Feuille de Route Stratégique
                </span>
                <h3 className="text-xl font-bold text-slate-800">{plan.title}</h3>
              </div>

              {/* 1 Year and 5 Years Horizons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                    🎯 Horizon 1 An
                  </span>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed">{plan.visionHorizon1Year}</p>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                  <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block mb-1">
                    🚀 Horizon 5 Ans
                  </span>
                  <p className="text-xs text-indigo-950 font-medium leading-relaxed">{plan.visionHorizon5Years}</p>
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Les Étapes Clés pour l’Année à Venir
                </span>
                <div className="space-y-2.5">
                  {plan.roadmapMilestones.map((m, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-amber-800">{m.period}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-xs font-semibold text-slate-800">{m.goal}</p>
                      <p className="text-[11px] text-teal-800">
                        <strong>Action pratique :</strong> {m.practicalAction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fear Antidotes */}
              {plan.fearAntidotes && plan.fearAntidotes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Antidotes Contre Tes Peurs
                  </span>
                  <div className="space-y-2">
                    {plan.fearAntidotes.map((fa, i) => (
                      <div key={i} className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs">
                        <div className="font-bold text-rose-900 mb-0.5">Peur : {fa.fear}</div>
                        <div className="text-slate-700 italic">Antidote : {fa.antidote}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Daily 10 min ritual */}
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider block mb-1">
                  ⏳ Rituel Quotidien de 10 Minutes
                </span>
                <p className="text-xs text-teal-950 font-medium leading-relaxed">{plan.dailyTenMinutesRitual}</p>
              </div>

              {/* Lumi's pledge */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-amber-900 italic">
                <span>« {plan.lumiPledge} »</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-200 text-slate-600 text-xs">
              Réponds aux 4 questions pour que Lumi tisse ta feuille de route personnelle.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
