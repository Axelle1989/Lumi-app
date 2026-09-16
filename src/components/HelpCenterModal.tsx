import React from 'react';
import { Phone, HeartHandshake, ShieldAlert, X, Hospital, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBreathing: () => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  isOpen,
  onClose,
  onStartBreathing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-rose-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldAlert className="w-6 h-6 text-rose-600 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Centre d'Aide & Écoute Urgente
            </h2>
            <p className="text-xs text-slate-600">
              Tu n'es pas seul(e). Des personnes bienveillantes et qualifiées sont prêtes à t'aider.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Priority Benin Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 flex items-center gap-1">
                <span>🇧🇯</span>
                <span>Bénin — Besoin de parler à quelqu'un ?</span>
              </span>
              <span className="text-[11px] text-amber-800 font-semibold">Prioritaire</span>
            </div>

            <p className="text-xs text-amber-950 leading-relaxed">
              Si tu traverses une épreuve difficile, que la tristesse est trop lourde ou que tu as besoin d'une voix réconfortante :
            </p>

            <a
              href="tel:0147816778"
              className="flex items-center justify-between p-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-transform active:scale-98 shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 animate-bounce" />
                <span>📞 Appeler maintenant : 01 47 81 67 78</span>
              </div>
              <span className="text-xs bg-amber-700/60 px-2 py-0.5 rounded-md">Appel</span>
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900 pt-1">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-100/60 border border-amber-200">
                <MessageCircle className="w-4 h-4 text-amber-800 shrink-0" />
                <span>📱 Contacter un proche de confiance</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-100/60 border border-amber-200">
                <Hospital className="w-4 h-4 text-amber-800 shrink-0" />
                <span>🏥 Se rendre dans un centre de santé qualifié</span>
              </div>
            </div>
          </div>

          {/* France & Europe Section */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900">
                🇫🇷 France & Europe
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-rose-200 text-xs">
                <div>
                  <div className="font-bold text-slate-900">3114 — Prévention Suicide</div>
                  <div className="text-slate-500 text-[11px]">Gratuit, confidentiel 24h/24 et 7j/7</div>
                </div>
                <a
                  href="tel:3114"
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors"
                >
                  Appeler 3114
                </a>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-rose-200 text-xs">
                <div>
                  <div className="font-bold text-slate-900">SOS Amitié : 09 72 39 40 50</div>
                  <div className="text-slate-500 text-[11px]">Écoute attentive sans jugement, anonyme</div>
                </div>
                <a
                  href="tel:0972394050"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium transition-colors"
                >
                  Appeler
                </a>
              </div>
            </div>
          </div>

          {/* International */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
            <span>🌍 Urgences Internationales (Europe 112, Samu 15, International 911)</span>
            <span className="font-semibold text-slate-900">24/7</span>
          </div>

          {/* Grounding Exercise */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Exercice d'ancrage immédiat (Ici & Maintenant)</span>
            </div>
            <p className="leading-relaxed">
              Pose les deux pieds à plat sur le sol. Sens le contact avec la terre. Inspire profondément par le nez en comptant jusqu’à 4, puis expire lentement par la bouche. Tu es en sécurité.
            </p>
            <button
              onClick={() => {
                onClose();
                onStartBreathing();
              }}
              className="mt-1 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium transition-colors inline-flex items-center gap-1.5"
            >
              <span>Lancer la cohérence cardiaque</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-4 text-[11px] text-slate-400 text-center italic">
          Rappel : Lumi est un compagnon virtuel d'écoute et ne remplace jamais un médecin, un psychologue ou un service d'urgence médicale.
        </p>
      </div>
    </div>
  );
};
