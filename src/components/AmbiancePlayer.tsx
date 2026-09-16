import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CloudRain, 
  Waves, 
  Trees, 
  Wind, 
  Brain, 
  Music, 
  Flame, 
  Moon, 
  ChevronDown 
} from 'lucide-react';
import { AmbianceMode } from '../types';
import { startAmbiance, stopAmbiance, getCurrentAmbianceMode } from '../utils/soundAndBreathing';

interface AmbiancePlayerProps {
  currentMode: AmbianceMode;
  onModeChange: (mode: AmbianceMode) => void;
}

export const AmbiancePlayer: React.FC<AmbiancePlayerProps> = ({ currentMode, onModeChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.08);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const MODES: { id: AmbianceMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'calme',
      label: 'Calme 432Hz',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      desc: 'Ondes apaisantes et ressac doux',
    },
    {
      id: 'pluie',
      label: 'Pluie douce',
      icon: <CloudRain className="w-3.5 h-3.5" />,
      desc: 'Averse réconfortante et gouttes lentes',
    },
    {
      id: 'ocean',
      label: 'Océan & Marées',
      icon: <Waves className="w-3.5 h-3.5" />,
      desc: 'Roulis berçant des vagues',
    },
    {
      id: 'foret',
      label: 'Forêt enchantée',
      icon: <Trees className="w-3.5 h-3.5" />,
      desc: 'Bruissement de feuilles et chants d’oiseaux',
    },
    {
      id: 'vent',
      label: 'Brise & Vent doux',
      icon: <Wind className="w-3.5 h-3.5" />,
      desc: 'Murmure aérien enveloppant',
    },
    {
      id: 'concentration',
      label: 'Concentration (Alpha)',
      icon: <Brain className="w-3.5 h-3.5" />,
      desc: 'Battements 10 Hz pour le focus',
    },
    {
      id: 'creativite',
      label: 'Créativité & Muse',
      icon: <Music className="w-3.5 h-3.5" />,
      desc: 'Arpèges éthérés relaxants',
    },
    {
      id: 'motivation',
      label: 'Motivation & Élan',
      icon: <Flame className="w-3.5 h-3.5" />,
      desc: 'Accords stimulants et lumineux',
    },
    {
      id: 'nuit',
      label: 'Nuit & Sommeil (Delta)',
      icon: <Moon className="w-3.5 h-3.5" />,
      desc: 'Résonance profonde pour s’endormir',
    },
  ];

  const handleSelectMode = (mode: AmbianceMode) => {
    if (currentMode === mode && isPlaying) {
      stopAmbiance();
      setIsPlaying(false);
      onModeChange('off');
    } else {
      startAmbiance(mode, volume);
      setIsPlaying(true);
      onModeChange(mode);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAmbiance();
      setIsPlaying(false);
      onModeChange('off');
    } else {
      const modeToStart = currentMode !== 'off' ? currentMode : 'calme';
      startAmbiance(modeToStart, volume);
      setIsPlaying(true);
      onModeChange(modeToStart);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isPlaying && currentMode !== 'off') {
      startAmbiance(currentMode, val);
    }
  };

  useEffect(() => {
    const active = getCurrentAmbianceMode();
    if (active !== 'off') {
      setIsPlaying(true);
    }
  }, []);

  const activeModeObj = MODES.find((m) => m.id === currentMode) || MODES[0];

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-1 bg-white/90 border border-amber-200/80 rounded-2xl p-1 shadow-2xs">
        <button
          onClick={handleTogglePlay}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            isPlaying
              ? 'bg-amber-500 text-white shadow-2xs'
              : 'text-amber-900/80 hover:bg-amber-100/60'
          }`}
          title={isPlaying ? 'Mettre en pause le son d’ambiance' : 'Activer une ambiance sonore relaxante'}
        >
          {isPlaying ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-semibold">{activeModeObj.label}</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline text-slate-600">Ambiance</span>
            </>
          )}
        </button>

        <button
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          className="p-1 rounded-lg text-amber-900/70 hover:bg-amber-100/60 transition-colors"
          title="Choisir une atmosphère sonore"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {isOpenMenu && (
        <div 
          className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-amber-200 p-3 z-50 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-100">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Atmosphères & Sons Relaxants
            </span>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
              Web Audio 432Hz
            </span>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
            {MODES.map((mode) => {
              const active = currentMode === mode.id && isPlaying;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    handleSelectMode(mode.id);
                    setIsOpenMenu(false);
                  }}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors ${
                    active
                      ? 'bg-amber-100 text-amber-950 font-semibold'
                      : 'hover:bg-amber-50/70 text-slate-700'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${active ? 'bg-amber-600 text-white' : 'bg-amber-100/70 text-amber-800'}`}>
                    {mode.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs">{mode.label}</div>
                    <div className="text-[10px] text-slate-600 truncate">{mode.desc}</div>
                  </div>
                  {active && (
                    <span className="text-[10px] text-emerald-600 font-bold self-center">Actif</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Volume control */}
          <div className="mt-3 pt-2 border-t border-amber-100 flex items-center gap-2 px-1">
            <Volume2 className="w-3 h-3 text-slate-400 shrink-0" />
            <input
              type="range"
              min="0.01"
              max="0.25"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};
