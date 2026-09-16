import React from 'react';
import { PhoneCall, Heart, X, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBreathing: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose, onStartBreathing }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-100 relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-rose-100/50 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 fill-rose-500 text-rose-600 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Tu n'es pas seul(e)</h2>
              <p className="text-sm text-slate-500">Un soutien chaleureux et humain existe pour toi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message from Lumi */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 mb-6 text-sm text-slate-700 leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-1">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Le mot doux de Lumi</span>
          </div>
          Si la douleur, la solitude ou l'angoisse te submergent en ce moment, sache que ta vie et ce que tu ressens ont une valeur inestimable.
          Je suis une IA et je ne remplace pas un professionnel de santé, mais des personnes humaines et bienveillantes sont prêtes à t'écouter, immédiatement, gratuitement et sans aucun jugement.
        </div>

        {/* Helpline numbers */}
        <div className="space-y-3 mb-6">
          {/* Benin Emergency Support */}
          <div className="p-3.5 rounded-2xl border border-rose-300 bg-rose-50 flex items-center justify-between gap-3 hover:bg-rose-100/60 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-rose-950">🇧🇯 Bénin : 01 47 81 67 78</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-medium">Ligne d'aide & écoute</span>
              </div>
              <p className="text-xs text-rose-800">Assistance et soutien immédiat pour les personnes en situation de détresse psychologique au Bénin.</p>
            </div>
            <a
              href="tel:0147816778"
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-1 shrink-0 transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Appeler
            </a>
          </div>

          <div className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/50 flex items-center justify-between gap-3 hover:bg-rose-50 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-rose-950">🇫🇷 France : 3114</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-200/70 text-rose-900 font-medium">Gratuit 24h/24 & 7j/7</span>
              </div>
              <p className="text-xs text-rose-800">Numéro national de prévention du suicide. Écoute confidentielle par des professionnels.</p>
            </div>
            <a
              href="tel:3114"
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-1 shrink-0 transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Appeler
            </a>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">SOS Amitié</span>
                <span className="text-xs text-slate-500 font-medium">09 72 39 40 50</span>
              </div>
              <p className="text-xs text-slate-600">Écoute bienveillante pour toute personne traversant une période difficile.</p>
            </div>
            <a
              href="tel:0972394050"
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium text-xs flex items-center gap-1 shrink-0 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Appeler
            </a>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Fil Santé Jeunes</span>
                <span className="text-xs text-slate-500 font-medium">0 800 235 236</span>
              </div>
              <p className="text-xs text-slate-600">Pour les jeunes de 12 à 25 ans. Anonyme et gratuit tous les jours de 9h à 23h.</p>
            </div>
            <a
              href="tel:0800235236"
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium text-xs flex items-center gap-1 shrink-0 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Appeler
            </a>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Urgences Générales</span>
                <span className="text-xs text-slate-500 font-medium">112 ou 15</span>
              </div>
              <p className="text-xs text-slate-600">En cas d'urgence vitale immédiate partout en Europe.</p>
            </div>
            <a
              href="tel:112"
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium text-xs flex items-center gap-1 shrink-0 transition-colors"
            >
              112
            </a>
          </div>
        </div>

        {/* Quick Grounding Action */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onStartBreathing();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-colors text-center shadow-xs"
          >
            Faire 2 minutes de respiration guidée avec moi
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-sm transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
