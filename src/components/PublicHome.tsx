import React from 'react';
import { 
  Sparkles, 
  Target, 
  Palette, 
  Brain, 
  HeartHandshake, 
  BookOpen, 
  Users, 
  LogIn, 
  UserPlus, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Quote
} from 'lucide-react';
import { playGentleChime } from '../utils/soundAndBreathing';

interface PublicHomeProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenCrisis: () => void;
  onOpenCharter: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenCrisis,
  onOpenCharter,
}) => {
  return (
    <div className="space-y-12 sm:space-y-16 py-6 sm:py-10 max-w-6xl mx-auto px-4 sm:px-6 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center space-y-5 pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300/80 text-amber-900 text-xs sm:text-sm font-semibold shadow-2xs">
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Plateforme Globale de Bien-être & Réussite</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Lumi - Grandir, Créer, Guérir et{' '}
          <span className="text-amber-700 underline decoration-amber-300 decoration-wavy decoration-2">
            Réussir Ensemble
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Un compagnon de vie numérique chaleureux pour apaiser tes émotions, libérer ta créativité, 
          concrétiser tes objectifs scolaires, personnels et financiers, au sein d'une communauté 100% positive.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          <button
            onClick={() => {
              playGentleChime(528);
              onOpenRegister();
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow transition-all active:scale-98"
          >
            <UserPlus className="w-5 h-5" />
            <span>Créer mon compte bienveillant</span>
          </button>

          <button
            onClick={() => {
              playGentleChime(432);
              onOpenLogin();
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-slate-800 font-bold text-sm sm:text-base border border-amber-300 shadow-2xs transition-all active:scale-98"
          >
            <LogIn className="w-5 h-5 text-amber-700" />
            <span>Se connecter</span>
          </button>
        </div>

        {/* Privacy & Safety Guarantee */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 pt-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Espace sécurisé & confidentiel
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            Zéro message privé entre membres (protection totale)
          </span>
          <span className="hidden sm:inline">•</span>
          <button 
            onClick={onOpenCrisis}
            className="text-rose-600 hover:text-rose-700 font-medium underline flex items-center gap-1"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Aide d'urgence : Bénin 01 47 81 67 78
          </button>
        </div>
      </section>

      {/* Citation inspirante du jour */}
      <section className="bg-linear-to-r from-amber-100/70 via-amber-50 to-orange-100/70 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-2xs max-w-3xl mx-auto relative overflow-hidden text-center space-y-3">
        <Quote className="w-8 h-8 text-amber-400/40 absolute top-4 left-4" />
        <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
          Pensée du jour
        </span>
        <blockquote className="text-lg sm:text-xl font-medium text-slate-800 italic leading-snug">
          « Ce n’est pas parce que les choses sont difficiles que nous n’osons pas, c’est parce que nous n’osons pas qu’elles sont difficiles. Chaque petit pas vers ton rêve est une victoire. »
        </blockquote>
        <div className="text-xs text-amber-900 font-semibold">— Lumi, pour éclairer ta journée</div>
      </section>

      {/* 6 Piliers Majeurs de la Plateforme */}
      <section className="space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Tout ce dont tu as besoin pour t'épanouir
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Une synergie unique entre intelligence artificielle bienveillante, méthodologie de progression et entraide communautaire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Créativité Illimitée */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Espace Créativité Illimitée</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Génère des images inspirantes avec l'IA (« Dessine-moi un coucher de soleil qui représente l'espoir »), compose des poèmes, écris des chansons, peins sur le canevas et crée des affirmations.
            </p>
          </div>

          {/* Card 2: Objectifs & Planificateur */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Objectifs & Planificateur</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Fixe tes objectifs personnels (santé, sommeil), scolaires (examens, anglais) ou financiers (économiser 100 000 ou 300 000 FCFA). Lumi découpe ton but en plan d'action réaliste.
            </p>
          </div>

          {/* Card 3: Coach Personnel IA */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Coach Personnel IA Spécialisé</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Choisis ton mode d'accompagnement : Coach Motivation, Coach Études, Coach Organisation, Coach Créativité ou Coach Confiance en Soi.
            </p>
          </div>

          {/* Card 4: Bien-être Avancé & Sons */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Sérénité & Sons Relaxants</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Cohérence cardiaque, journal intime météo, méditations guidées et atmosphères sonores pures en Web Audio : Pluie apaisante, Vagues de l'Océan, Forêt, Brise et Ondes 432 Hz.
            </p>
          </div>

          {/* Card 5: Tableau de Progression */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Tableau de Progression</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Visualise la courbe de ton humeur, les objectifs accomplis, l'épargne cumulée, tes activités terminées et collectionne des badges de bienveillance.
            </p>
          </div>

          {/* Card 6: Communauté & Centre de Savoirs */}
          <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-2xs hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Savoirs & Mur Bienveillant</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Consulte des guides vérifiés (gestion du stress, révisions, finances simples) et participe aux défis communautaires sur un mur public sans aucun risque de harcèlement privé.
            </p>
          </div>
        </div>
      </section>

      {/* Témoignages Anonymisés */}
      <section className="bg-amber-100/50 rounded-3xl p-6 sm:p-10 border border-amber-200 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Ce que la communauté partage</h2>
          <p className="text-xs sm:text-sm text-slate-600">Des témoignages authentiques et anonymisés d'utilisateurs qui ont retrouvé le sourire et l'élan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-xs">
                A.
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Étudiante à Cotonou</div>
                <div className="text-[10px] text-slate-600">Objectif réussi : 15,5 de moyenne</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 italic">
              « Le coach études m'a appris à réviser sans paniquer avant les oraux. Et quand j'étais découragée, Lumi avait les mots justes pour me faire respirer. »
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center text-xs">
                M.
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Jeune professionnel</div>
                <div className="text-[10px] text-slate-600">Épargne : 300 000 FCFA atteints</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 italic">
              « Le planificateur d'épargne m'a donné un plan hebdomadaire très simple. J'ai acheté mon ordinateur pour mes cours de programmation sans m'endetter. »
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-sky-200 text-sky-900 font-bold flex items-center justify-center text-xs">
                S.
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Créatrice de poésie</div>
                <div className="text-[10px] text-slate-600">Confiance retrouvée</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 italic">
              « J'avais honte d'écrire et de dessiner. Le Mur Bienveillant est le seul endroit sur internet où je me suis sentie accueillie sans méchanceté ni jugement. »
            </p>
          </div>
        </div>
      </section>

      {/* Galerie Inspirante */}
      <section className="space-y-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Créations & Espoirs nés sur la plateforme
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl overflow-hidden shadow-2xs border border-amber-200 aspect-square group relative">
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80" 
              alt="Coucher de soleil sur l'océan" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end p-3 text-white text-xs text-left font-medium">
              « Coucher de soleil sur la plage de Fidjrossè »
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xs border border-amber-200 aspect-square group relative">
            <img 
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80" 
              alt="Nuit étoilée d'espoir" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end p-3 text-white text-xs text-left font-medium">
              « Même au cœur de la nuit, les étoiles veillent »
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xs border border-amber-200 aspect-square group relative">
            <img 
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80" 
              alt="Forêt verdoyante" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end p-3 text-white text-xs text-left font-medium">
              « Prendre racine patiemment avant de fleurir »
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xs border border-amber-200 aspect-square group relative">
            <img 
              src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80" 
              alt="Cahier et études" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end p-3 text-white text-xs text-left font-medium">
              « Le savoir est le plus beau des refuges »
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="bg-amber-600 rounded-3xl p-8 sm:p-12 text-white text-center space-y-5 shadow-lg">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Prêt(e) à commencer ton voyage avec Lumi ?
        </h2>
        <p className="text-amber-100 max-w-xl mx-auto text-sm sm:text-base">
          Rejoins un univers où chaque mot est respecté, chaque objectif est encouragé, et chaque émotion trouve un havre de paix.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              playGentleChime(528);
              onOpenRegister();
            }}
            className="px-7 py-3.5 rounded-2xl bg-white text-amber-800 font-bold text-sm sm:text-base hover:bg-amber-50 shadow-sm transition-transform active:scale-98"
          >
            Commencer gratuitement maintenant
          </button>
          <button
            onClick={onOpenCharter}
            className="px-6 py-3.5 rounded-2xl bg-amber-700/80 hover:bg-amber-700 text-white font-medium text-sm sm:text-base border border-amber-500/60 transition-colors"
          >
            Lire la Charte des 25 règles
          </button>
        </div>
      </section>
    </div>
  );
};
