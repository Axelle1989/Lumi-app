import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Heart, 
  Lightbulb, 
  Briefcase, 
  Rocket, 
  CheckCircle, 
  ArrowRight, 
  RotateCcw,
  Star
} from 'lucide-react';
import { OrientationResult } from '../types';
import { playGentleChime } from '../utils/soundAndBreathing';

interface FindYourPathSpaceProps {
  username?: string;
}

export const FindYourPathSpace: React.FC<FindYourPathSpaceProps> = ({ username }) => {
  const [loves, setLoves] = useState('');
  const [skills, setSkills] = useState('');
  const [values, setValues] = useState('');
  const [dreamProjects, setDreamProjects] = useState('');
  const [preferredEnvironment, setPreferredEnvironment] = useState('Autonomie, créativité et technologie');
  const [isLoading, setIsLoading] = useState(false);

  const [result, setResult] = useState<OrientationResult | null>(() => {
    const saved = localStorage.getItem('lumi_orientation_result');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      profileSummary: "Tu as un profil hybride mêlant sensibilité humaine, capacité d'organisation et goût pour l'innovation utile. Tu t'épanouis quand tes actions apportent une aide concrète aux autres.",
      dominantStrengths: [
        "Intelligence relationnelle & écoute active",
        "Sens de la structure et de la méthode",
        "Curiosité pour les outils numériques et créatifs"
      ],
      careerPaths: [
        {
          title: "Chef de projet digital & impact social",
          whyItFits: "Ce rôle valorise ta capacité à coordonner des idées, écouter les besoins réels et concrétiser des projets porteurs de sens.",
          startingStep: "Gérer un petit projet associatif ou scolaire de A à Z avec un tableau Notion ou Trello.",
          growthPotential: "Très forte demande au Bénin, en Afrique de l'Ouest et en télétravail international."
        },
        {
          title: "Conseiller / Formateur en développement personnel & compétences",
          whyItFits: "Ton empathie naturelle et ta clarté pédagogique permettent d'accompagner les personnes avec douceur.",
          startingStep: "Animer un premier atelier de révision ou d'organisation pour des camarades.",
          growthPotential: "Secteur en plein essor auprès de la jeunesse et des universités."
        },
        {
          title: "Créateur de contenus éducatifs & médias bienveillants",
          whyItFits: "Idéal pour exprimer ton talent d'écriture et diffuser des messages d'espoir et de méthode.",
          startingStep: "Rédiger et publier un premier article de synthèse sur les savoirs Lumi.",
          growthPotential: "Visibilité rapide et opportunités de collaborations valorisantes."
        }
      ],
      entrepreneurshipProject: {
        projectIdea: "Service de tutorat méthodique et mentorat académique pour lycéens et étudiants",
        targetAudience: "Les étudiants préparant leurs examens ou cherchant de la méthode",
        minimalViableStep: "Créer 3 fiches de synthèse soignées et les tester auprès de 5 camarades ce mois-ci."
      },
      lumiEncouragement: "Trouver sa voie n'est pas choisir une destination fixe, c'est apprendre à faire confiance à sa boussole intérieure. Tu as déjà toutes les graines en toi ! ✨🧭"
    };
  });

  const handleAnalyze = async () => {
    if (!loves.trim() && !skills.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/orientation-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loves,
          skills,
          values,
          dreamProjects,
          preferredEnvironment,
        }),
      });
      const data = await res.json();
      setResult(data);
      localStorage.setItem('lumi_orientation_result', JSON.stringify(data));
      playGentleChime(784);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950 text-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>Boussole Intérieure & Ikigai</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Trouver sa voie : aligner passion, talent et avenir.
          </h2>
          <p className="text-sm text-indigo-100/90 leading-relaxed">
            Tu n'es pas obligé(e) de tout savoir tout de suite. Réponds simplement à ces 4 questions sincères, et laisse Lumi croiser tes forces pour éclairer des pistes de métiers et de projets faits pour toi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-indigo-100 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">Mon Bilan d'Exploration</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>1. Qu'est-ce que j'aime ? (Passions, curiosités)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Écouter les gens, écrire des poèmes, comprendre la tech, dessiner, résoudre des énigmes..."
                  value={loves}
                  onChange={(e) => setLoves(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>2. Dans quoi suis-je doué(e) ? (Talents, facilités)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: M'exprimer clairement, organiser des plannings, garder mon calme, apprendre vite..."
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                  <Star className="w-3.5 h-3.5 text-indigo-500" />
                  <span>3. Ce qui compte le plus pour moi (Valeurs)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Liberté, entraide, sécurité financière, impact social..."
                  value={values}
                  onChange={(e) => setValues(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                  <Rocket className="w-3.5 h-3.5 text-emerald-500" />
                  <span>4. Un rêve ou un projet qui m'inspire secrètement</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Lancer une entreprise utile, écrire un livre, voyager..."
                  value={dreamProjects}
                  onChange={(e) => setDreamProjects(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isLoading || (!loves.trim() && !skills.trim())}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-900 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-indigo-950 transition-colors disabled:opacity-50 shadow-2xs"
              >
                {isLoading ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Lumi calcule ton Ikigai...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4 text-indigo-300" />
                    <span>Révéler ma voie avec Lumi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results View */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="p-6 rounded-3xl bg-white border border-indigo-200/80 shadow-2xs space-y-6">
              {/* Profile Summary */}
              <div>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                  🌟 Synthèse de ton profil unique
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100">
                  {result.profileSummary}
                </p>
              </div>

              {/* Dominant Strengths */}
              {result.dominantStrengths && result.dominantStrengths.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Tes Forces Dominantes Détectées
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {result.dominantStrengths.map((str, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{str}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Paths */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Métiers & Filières qui te Correspondent
                </span>
                <div className="space-y-3">
                  {result.careerPaths.map((cp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-indigo-900 flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{cp.title}</span>
                        </h4>
                        <span className="text-[10px] text-emerald-700 font-semibold px-2 py-0.5 rounded-full bg-emerald-50">
                          {cp.growthPotential}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{cp.whyItFits}</p>
                      <div className="pt-1 text-[11px] text-teal-800 font-medium flex items-center gap-1">
                        <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
                        <span><strong>Premier pas immédiat :</strong> {cp.startingStep}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entrepreneurship project idea */}
              {result.entrepreneurshipProject && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <Rocket className="w-4 h-4 text-amber-600" />
                    <span>Idée de Projet ou d'Entreprise à Lancer</span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-800">
                    {result.entrepreneurshipProject.projectIdea}
                  </h5>
                  <p className="text-xs text-slate-700">
                    <strong>Public cible :</strong> {result.entrepreneurshipProject.targetAudience}
                  </p>
                  <p className="text-xs text-amber-900 font-medium">
                    <strong>Action test cette semaine :</strong> {result.entrepreneurshipProject.minimalViableStep}
                  </p>
                </div>
              )}

              {/* Lumi's encouragement */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-800 italic">
                <span>« {result.lumiEncouragement} »</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-200 text-slate-600 text-xs">
              Remplis tes centres d'intérêt à gauche pour révéler ta boussole professionnelle.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
