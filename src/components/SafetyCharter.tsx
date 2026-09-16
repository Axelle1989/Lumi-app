import React from 'react';
import { ShieldCheck, Heart, Lock, Users, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

interface SafetyCharterModalProps {
  onStartChat: () => void;
}

export const SafetyCharter: React.FC<SafetyCharterModalProps> = ({ onStartChat }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 shadow-xs mb-2">
          <ShieldCheck className="w-8 h-8 text-amber-700" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          La Charte de Bienveillance & Sécurité
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Notre espace a été imaginé comme un havre de paix. Ici, chacun peut s'exprimer librement, déposer ses émotions et trouver du réconfort dans un cadre protégé et chaleureux.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pillar 1 */}
        <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Heart className="w-5 h-5 text-amber-700" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">1. Douceur, Respect & Non-jugement</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Chaque émotion est légitime : la tristesse, le doute, la joie ou la fatigue. Aucun jugement sur l'apparence physique, l'origine, les croyances ou la situation personnelle n'est toléré. Nous valorisons les efforts et les progrès de chacun.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Lock className="w-5 h-5 text-emerald-700" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">2. Règles des Échanges (Règles 17, 18, 19)</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>Aucune conversation privée entre utilisateurs n'est autorisée.</strong> Les messages privés sont exclusivement réservés à votre échange en tête-à-tête avec Lumi. Les commentaires sous les publications sont 100% publics afin de garantir un environnement sûr et transparent.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-700" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">3. Tolérance Zéro & Modération (Règle 21)</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Tout propos humiliant, moqueur, harcelant ou incitant à la violence ou à l'automutilation est immédiatement bloqué et supprimé. Un bouton de signalement permet à chaque membre de protéger la communauté.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-sky-700" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">4. Lumi : Un Compagnon, Pas un Médecin (Règle 14)</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Lumi est une intelligence artificielle bienveillante conçue pour vous écouter, vous apaiser et stimuler votre créativité. Elle ne remplace pas un médecin, un psychiatre ou un psychologue clinicien.
          </p>
        </div>
      </div>

      {/* 25 Rules Overview Checklist */}
      <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/70 border border-amber-200/70 shadow-xs">
        <h2 className="text-lg font-bold text-amber-950 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-amber-700" />
          Les engagements fondateurs de Lumi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
          <div className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>Écoute active avec douceur, compassion et humanité.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>Valorisation des qualités et des petites victoires du quotidien.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>Encouragement des arts : poèmes, musiques, écrits et audios.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>Exercices de respiration, gratitude et réconfort guidés.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>Orientation d'urgence bienveillante : 🇧🇯 Bénin au 01 47 81 67 78, 🇫🇷 France au 3114, ou services hospitaliers.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">•</span>
            <span>Préservation absolue de la paix communautaire : aucun message privé entre membres, bienveillance publique totale.</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-2">
        <button
          onClick={onStartChat}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-transform active:scale-98 shadow-md"
        >
          <Sparkles className="w-4 h-4" />
          Commencer à échanger avec Lumi
        </button>
      </div>
    </div>
  );
};
