import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  Volume2, 
  Lock, 
  Image as ImageIcon, 
  Mic, 
  Plus, 
  RotateCcw, 
  Globe, 
  BookOpen, 
  Calendar,
  Share2,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { PodcastEpisode, SouvenirItem } from '../types';
import { 
  INITIAL_PODCASTS, 
  INITIAL_SOUVENIRS, 
  AFRICAN_WISDOM_PROVERBS 
} from '../data/initialData';
import { playGentleChime } from '../utils/soundAndBreathing';

interface PodcastsSpaceProps {
  username?: string;
}

export const PodcastsSpace: React.FC<PodcastsSpaceProps> = ({ username }) => {
  const [subTab, setSubTab] = useState<'podcasts' | 'vault' | 'wisdom'>('podcasts');

  // Podcasts list
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(() => {
    const saved = localStorage.getItem('lumi_podcasts');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_PODCASTS;
  });

  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode>(episodes[0] || INITIAL_PODCASTS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.95);

  // New podcast generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [genTopic, setGenTopic] = useState('');
  const [genType, setGenType] = useState<PodcastEpisode['type']>('motivation');

  // Souvenir Vault state
  const [souvenirs, setSouvenirs] = useState<SouvenirItem[]>(() => {
    const saved = localStorage.getItem('lumi_souvenirs');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_SOUVENIRS;
  });

  const [newSouvTitle, setNewSouvTitle] = useState('');
  const [newSouvType, setNewSouvType] = useState<SouvenirItem['type']>('photo');
  const [newSouvContent, setNewSouvContent] = useState('');
  const [newSouvMediaUrl, setNewSouvMediaUrl] = useState('');
  const [newSouvLockedUntil, setNewSouvLockedUntil] = useState('2028');

  // Speech synthesis handlers
  const handlePlayPodcast = (episode: PodcastEpisode) => {
    if (!('speechSynthesis' in window)) {
      alert("La synthèse vocale n'est pas supportée sur ce navigateur.");
      return;
    }

    if (isPlaying && activeEpisode.id === episode.id) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    setActiveEpisode(episode);

    const utterance = new SpeechSynthesisUtterance(episode.spokenScript.replace(/\[.*?\]/g, ''));
    utterance.lang = 'fr-FR';
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    // Pick French voice if available
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find((v) => v.lang.startsWith('fr'));
    if (frVoice) utterance.voice = frVoice;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleStopPodcast = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Generate Podcast with AI
  const handleGeneratePodcast = async () => {
    if (!genTopic.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: genTopic,
          type: genType,
          username: username || 'cher ami',
        }),
      });
      const data = await res.json();
      const newEp: PodcastEpisode = {
        id: `pod-${Date.now()}`,
        title: data.title || genTopic,
        type: genType,
        duration: '2 min 30',
        quoteIntro: data.quoteIntro || 'Méditation audio personnalisée générée par Lumi.',
        spokenScript: data.spokenScript || '',
        keyTakeaway: data.keyTakeaway || 'Prends soin de ta paix intérieure.',
        dateAdded: new Date().toLocaleDateString('fr-FR'),
      };

      const updated = [newEp, ...episodes];
      setEpisodes(updated);
      setActiveEpisode(newEp);
      localStorage.setItem('lumi_podcasts', JSON.stringify(updated));
      setGenTopic('');
      playGentleChime(784);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Add Souvenir
  const handleAddSouvenir = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSouvTitle.trim() || !newSouvContent.trim()) return;

    const item: SouvenirItem = {
      id: `souv-${Date.now()}`,
      title: newSouvTitle.trim(),
      type: newSouvType,
      content: newSouvContent.trim(),
      mediaUrl: newSouvMediaUrl.trim() || undefined,
      date: new Date().toLocaleDateString('fr-FR'),
      lockedUntil: newSouvLockedUntil.trim() || undefined,
      tags: ['Mémoire', 'Avenir'],
    };

    const updated = [item, ...souvenirs];
    setSouvenirs(updated);
    localStorage.setItem('lumi_souvenirs', JSON.stringify(updated));
    setNewSouvTitle('');
    setNewSouvContent('');
    setNewSouvMediaUrl('');
    playGentleChime(528);
  };

  const handleDeleteSouvenir = (id: string) => {
    const updated = souvenirs.filter((s) => s.id !== id);
    setSouvenirs(updated);
    localStorage.setItem('lumi_souvenirs', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-indigo-950 text-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Headphones className="w-4 h-4" />
            <span>Voix Douce, Coffre & Sagesses</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Des mots qui réparent et des souvenirs pour l'éternité.
          </h2>
          <p className="text-sm text-teal-100/90 leading-relaxed">
            Écoute les podcasts vocaux de Lumi (motivation matinale, conte du soir, apaisement d'angoisse), scelle tes précieux souvenirs pour ton futur moi, et ressource-toi avec les sagesses d'Afrique.
          </p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-amber-100/70 border border-amber-200/80">
        <button
          onClick={() => setSubTab('podcasts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            subTab === 'podcasts'
              ? 'bg-white text-teal-950 shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Headphones className="w-4 h-4 text-teal-600" />
          <span>🎤 Podcasts & Audios ({episodes.length})</span>
        </button>

        <button
          onClick={() => setSubTab('vault')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            subTab === 'vault'
              ? 'bg-white text-teal-950 shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Lock className="w-4 h-4 text-amber-600" />
          <span>🎁 Coffre à Souvenirs ({souvenirs.length})</span>
        </button>

        <button
          onClick={() => setSubTab('wisdom')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            subTab === 'wisdom'
              ? 'bg-white text-teal-950 shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Globe className="w-4 h-4 text-indigo-600" />
          <span>🌍 Sagesses Africaines (Fon & Yoruba)</span>
        </button>
      </div>

      {/* 1. PODCASTS & AUDIOS */}
      {subTab === 'podcasts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Player & Episode selector */}
          <div className="lg:col-span-7 space-y-4">
            {/* Player Deck */}
            {activeEpisode && (
              <div className="p-6 rounded-3xl bg-white border border-teal-200 shadow-2xs space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-teal-100 text-teal-800">
                    {activeEpisode.type === 'motivation'
                      ? 'Éveil & Motivation'
                      : activeEpisode.type === 'story'
                      ? 'Histoire du Soir'
                      : 'Méditation Anti-Angoisse'}
                  </span>
                  <span className="text-xs text-slate-600">{activeEpisode.duration}</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{activeEpisode.title}</h3>
                  <p className="text-xs text-slate-600 italic">« {activeEpisode.quoteIntro} »</p>
                </div>

                {/* Animated sound wave bars when playing */}
                <div className="flex items-center justify-center gap-1.5 h-12 bg-slate-50 rounded-2xl px-4 border border-slate-100">
                  {[24, 38, 18, 48, 30, 16, 42, 28, 52, 20, 36, 44, 22].map((height, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isPlaying
                          ? 'bg-teal-600 animate-pulse'
                          : 'bg-slate-300'
                      }`}
                      style={{
                        height: isPlaying ? `${Math.max(12, (height * (i % 2 === 0 ? 1 : 0.8)))}px` : '10px',
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Playback Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePlayPodcast(activeEpisode)}
                      className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center hover:bg-teal-900 transition-colors shadow-2xs"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    <button
                      onClick={handleStopPodcast}
                      className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors"
                      title="Arrêter la lecture"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                    <div className="text-xs text-slate-700">
                      <span className="font-bold block">{isPlaying ? 'En cours de diffusion' : 'Prêt à écouter'}</span>
                      <span className="text-[11px] text-slate-600">Voix apaisante de Lumi</span>
                    </div>
                  </div>

                  {/* Vitesse */}
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-600 text-[11px]">Vitesse :</span>
                    {[0.85, 0.95, 1.1].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setSpeechRate(rate)}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                          speechRate === rate ? 'bg-teal-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spoken Script view */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Texte de l'audio :
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-serif">
                    {activeEpisode.spokenScript}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
                  💡 <strong>À retenir :</strong> {activeEpisode.keyTakeaway}
                </div>
              </div>
            )}
          </div>

          {/* Right: List of episodes + Generator */}
          <div className="lg:col-span-5 space-y-4">
            {/* Generate custom podcast */}
            <div className="p-5 rounded-3xl bg-white border border-teal-100 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-800 text-sm">Créer un podcast audio sur mesure</h3>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quel besoin ou émotion as-tu en ce moment ?
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Confiance avant un grand oral, fatigue du soir..."
                    value={genTopic}
                    onChange={(e) => setGenTopic(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Type d'audio</label>
                  <select
                    value={genType}
                    onChange={(e) => setGenType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  >
                    <option value="motivation">Motivation & Énergie du matin</option>
                    <option value="story">Histoire douce pour dormir</option>
                    <option value="meditation">Apaisement d'angoisse & respiration</option>
                  </select>
                </div>

                <button
                  onClick={handleGeneratePodcast}
                  disabled={isGenerating || !genTopic.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-800 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-teal-900 transition-colors disabled:opacity-50 shadow-2xs"
                >
                  {isGenerating ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Lumi compose l'audio...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-teal-300" />
                      <span>Générer le Podcast avec Lumi</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* List of episodes */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider px-1">
                Bibliothèque d'épisodes
              </span>
              <div className="space-y-2">
                {episodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => {
                      setActiveEpisode(ep);
                      if (isPlaying) handleStopPodcast();
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      activeEpisode.id === ep.id
                        ? 'border-teal-600 bg-teal-50/70 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-teal-800 uppercase mb-0.5">
                        <span>{ep.type}</span>
                        <span>•</span>
                        <span>{ep.duration}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{ep.title}</h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPodcast(ep);
                      }}
                      className="w-8 h-8 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center hover:bg-teal-200 transition-colors shrink-0"
                    >
                      {isPlaying && activeEpisode.id === ep.id ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. COFFRE À SOUVENIRS */}
      {subTab === 'vault' && (
        <div className="space-y-6">
          {/* Add to vault form */}
          <form onSubmit={handleAddSouvenir} className="p-6 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Déposer un souvenir dans le Coffre Secret</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <input
                  type="text"
                  placeholder="Titre du souvenir ou de la promesse"
                  value={newSouvTitle}
                  onChange={(e) => setNewSouvTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>
              <div className="sm:col-span-4">
                <select
                  value={newSouvType}
                  onChange={(e) => setNewSouvType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                >
                  <option value="photo">Photo importante</option>
                  <option value="audio">Note vocale ou promesse</option>
                  <option value="message_futur">Message à relire dans le futur</option>
                  <option value="reussite">Attestation de réussite</option>
                </select>
              </div>
              <div className="sm:col-span-12">
                <textarea
                  rows={3}
                  placeholder="Écris ton message, tes pensées ou l'histoire derrière cette photo..."
                  value={newSouvContent}
                  onChange={(e) => setNewSouvContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                  required
                />
              </div>
              <div className="sm:col-span-8">
                <input
                  type="url"
                  placeholder="URL d'une photo / image (facultatif)"
                  value={newSouvMediaUrl}
                  onChange={(e) => setNewSouvMediaUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div className="sm:col-span-4 flex items-center gap-2">
                <span className="text-[11px] text-slate-600 font-semibold whitespace-nowrap">À réouvrir en :</span>
                <input
                  type="text"
                  placeholder="Ex: 2028, 2030"
                  value={newSouvLockedUntil}
                  onChange={(e) => setNewSouvLockedUntil(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div className="sm:col-span-12 flex justify-end">
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-amber-700 text-white font-bold text-xs hover:bg-amber-800 transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verrouiller dans mon Coffre</span>
                </button>
              </div>
            </div>
          </form>

          {/* Vault cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {souvenirs.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-3xl bg-white border border-amber-200/80 shadow-2xs flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all"
              >
                <div className="space-y-3">
                  {s.mediaUrl && (
                    <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-100">
                      <img
                        src={s.mediaUrl}
                        alt={s.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                      {s.type}
                    </span>
                    {s.lockedUntil && (
                      <span className="text-[11px] font-semibold text-amber-800 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Ouvrir en {s.lockedUntil}</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{s.title}</h4>
                    <p className="text-xs text-slate-700 mt-1 line-clamp-3 leading-relaxed">
                      {s.content}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Enregistré en {s.date}</span>
                  <button
                    onClick={() => handleDeleteSouvenir(s.id)}
                    className="text-slate-600 hover:text-rose-600 transition-colors p-1"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SAGESSES AFRICAINES (FON, YORUBA...) */}
      {subTab === 'wisdom' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-indigo-100 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Paroles des Anciens & Héritage Africain</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Une collection vivante de proverbes béninois et panafricains pour éclairer tes choix de vie avec la profondeur de nos racines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AFRICAN_WISDOM_PROVERBS.map((wis) => (
              <div
                key={wis.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-800">
                    {wis.language}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-sm font-bold text-slate-800 block mb-1 font-serif">
                    « {wis.nativeText} »
                  </span>
                  <span className="text-xs text-slate-600 italic block">
                    Traduction : {wis.translation}
                  </span>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-indigo-950">Sens profond : </strong>
                  {wis.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
