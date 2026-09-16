import React, { useState, useRef, useEffect } from 'react';
import { 
  Palette, 
  Sparkles, 
  Image as ImageIcon, 
  Feather, 
  Music, 
  BookOpen, 
  Lightbulb, 
  Heart, 
  Quote, 
  Send, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  RotateCcw, 
  Eraser, 
  RefreshCw,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { CreativeToolType, GeneratedImageItem, CreativePiece } from '../types';
import { playGentleChime } from '../utils/soundAndBreathing';

interface CreativitySpaceProps {
  onShareToCommunity?: (content: string, type: string, title: string, imageUrl?: string) => void;
  username?: string;
}

export const CreativitySpace: React.FC<CreativitySpaceProps> = ({
  onShareToCommunity,
  username,
}) => {
  const [activeTool, setActiveTool] = useState<CreativeToolType>('image');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState('Dessine-moi un coucher de soleil qui représente l’espoir');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageItem[]>([
    {
      id: 'img-demo-1',
      prompt: 'Un coucher de soleil qui représente l’espoir sur l’océan',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      createdAt: 'À l’instant',
      caption: 'L’aube nouvelle succède toujours à la marée haute de nos peines.',
    },
    {
      id: 'img-demo-2',
      prompt: 'Arbre majestueux fleurissant dans la clarté matinale',
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
      createdAt: 'Hier',
      caption: 'La patience des racines fait la beauté des branches.',
    }
  ]);

  // Text Creative Generation State
  const [creativePrompt, setCreativePrompt] = useState('');
  const [creativeTone, setCreativeTone] = useState('Chaleureux et inspirant');
  const [generatedPieces, setGeneratedPieces] = useState<CreativePiece[]>([
    {
      id: 'piece-1',
      type: 'poem',
      title: 'Les racines de l’aurore',
      content: `Sous la brume d’un soir où le doute s’étire,
J’ai appris la douceur d’un souffle sans soupir.
Rien ne force la fleur à presser sa corolle,
Le temps guérit le cœur mieux qu’une vaine parole.

Avance à ton élan, sans crainte du matin :
L’espérance a déjà fleuri sur ton chemin. ✨🌱`,
      createdAt: 'Aujourd’hui',
    },
    {
      id: 'piece-2',
      type: 'affirmations',
      title: 'Affirmations du matin pour la confiance',
      content: `1. Je suis digne de paix et de respect à chaque seconde.
2. Mes efforts d'aujourd'hui construisent la personne admirable de demain.
3. J'ai le droit de faire des erreurs, elles sont mes plus douces enseignantes.
4. Ma valeur ne dépend pas du regard des autres.
5. Mon esprit est capable d'apprendre et de progresser constamment.
6. Je respire le calme et je libère ce que je ne peux pas contrôler.`,
      createdAt: 'Hier',
    }
  ]);

  // Integrated Drawing Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentColor, setCurrentColor] = useState('#b45309');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');

  const PALETTE = [
    { label: 'Terre d’Afrique', color: '#b45309' },
    { label: 'Or chaud', color: '#f59e0b' },
    { label: 'Ambre nuit', color: '#1e293b' },
    { label: 'Feuille verte', color: '#10b981' },
    { label: 'Ciel azur', color: '#0ea5e9' },
    { label: 'Rose poudré', color: '#f43f5e' },
    { label: 'Lavande', color: '#8b5cf6' },
  ];

  // Initialize canvas
  useEffect(() => {
    if (activeTool === 'drawing') {
      setTimeout(initCanvas, 50);
    }
  }, [activeTool]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fffdfa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isEraser ? '#fffdfa' : currentColor;
    ctx.lineWidth = brushSize;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.closePath();
  };

  // Generate Image Handler
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt.trim() }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        const newImg: GeneratedImageItem = {
          id: 'img-' + Date.now(),
          prompt: imagePrompt.trim(),
          imageUrl: data.imageUrl,
          createdAt: 'À l’instant',
          caption: data.caption || `Inspiré de : "${imagePrompt.trim()}"`,
        };
        setGeneratedImages([newImg, ...generatedImages]);
        playGentleChime(528);
      }
    } catch (err) {
      console.error('Image generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Text Creative Piece Handler
  const handleGenerateCreativePiece = async (type: CreativeToolType) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          prompt: creativePrompt || 'Espoir, courage et renouveau',
          tone: creativeTone,
        }),
      });
      const data = await res.json();
      if (data.content) {
        const titles: Record<string, string> = {
          poem: 'Poème de résilience',
          song: 'Chanson d’élan & de cœur',
          story: 'Conte inspirant',
          affirmations: 'Paroles de confiance quotidienne',
          project_ideas: 'Idées de projets créatifs',
          quote_card: 'Citation & Méditation',
          journal: 'Page de journal intime guidée',
        };
        const newPiece: CreativePiece = {
          id: 'piece-' + Date.now(),
          type,
          title: titles[type] || 'Création poétique',
          content: data.content,
          createdAt: 'À l’instant',
        };
        setGeneratedPieces([newPiece, ...generatedPieces]);
        playGentleChime(432);
      }
    } catch (err) {
      console.error('Creative generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Save Canvas to Gallery or Share
  const handleSaveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const newImg: GeneratedImageItem = {
      id: 'draw-' + Date.now(),
      prompt: canvasTitle || 'Dessin d’expression libre',
      imageUrl: dataUrl,
      createdAt: 'À l’instant',
      caption: canvasTitle || 'Création artistique réalisée sur le canevas Lumi',
    };
    setGeneratedImages([newImg, ...generatedImages]);
    playGentleChime(528);
    if (onShareToCommunity) {
      onShareToCommunity(
        canvasTitle || 'Mon dessin d’expression créative',
        'dessin',
        canvasTitle || 'Création au canevas',
        dataUrl
      );
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const TOOL_TABS: { id: CreativeToolType; label: string; icon: React.ReactNode }[] = [
    { id: 'image', label: 'Générateur d’Images IA', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'poem', label: 'Poèmes', icon: <Feather className="w-4 h-4" /> },
    { id: 'song', label: 'Chansons & Paroles', icon: <Music className="w-4 h-4" /> },
    { id: 'story', label: 'Histoires & Contes', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'affirmations', label: 'Affirmations Positives', icon: <Heart className="w-4 h-4" /> },
    { id: 'drawing', label: 'Canevas de Dessin', icon: <Palette className="w-4 h-4" /> },
    { id: 'project_ideas', label: 'Idées de Projets', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'quote_card', label: 'Citations Illustrées', icon: <Quote className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Studio d’Expression & Magie Créative</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Espace Créativité Illimitée
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Donne vie à tes inspirations : génère des images avec l’IA, compose des rimes, écris des chansons réconfortantes ou peins sur ton canevas.
            </p>
          </div>
        </div>

        {/* Tool Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none mt-6 pt-4 border-t border-amber-200/60">
          {TOOL_TABS.map((tab) => {
            const active = activeTool === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTool(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  active
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-white/80 hover:bg-white text-slate-700 border border-amber-200/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. IMAGE GENERATOR TAB */}
      {activeTool === 'image' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-600" />
              Générer une image avec l’IA Lumi
            </h2>
            <p className="text-xs text-slate-600">
              Décris la scène, l'émotion ou le paysage que tu souhaites matérialiser. Lumi utilise son modèle d'imagerie pour créer ton illustration.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Ex : Dessine-moi un coucher de soleil qui représente l'espoir..."
                className="flex-1 px-4 py-3 rounded-2xl bg-amber-50/50 border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateImage()}
              />
              <button
                onClick={handleGenerateImage}
                disabled={isLoading}
                className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shrink-0 transition-all shadow-xs"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Création en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Générer l’image</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Inspiration Pills */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="text-slate-600 self-center text-[11px] font-medium">Suggestions :</span>
              {[
                "Dessine-moi un coucher de soleil qui représente l'espoir",
                "Un arbre de vie aux racines dorées sous la pluie",
                "Une aurore sereine sur la plage de Cotonou",
                "Une lanterne bienveillante au milieu des étoiles",
              ].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => setImagePrompt(sug)}
                  className="px-2.5 py-1 rounded-xl bg-amber-100/60 hover:bg-amber-200/80 text-amber-900 transition-colors text-[11px]"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Images Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Galerie de tes créations visuelles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {generatedImages.map((img) => (
                <div key={img.id} className="bg-white rounded-3xl overflow-hidden border border-amber-200 shadow-2xs group flex flex-col">
                  <div className="aspect-square bg-slate-900 relative overflow-hidden">
                    <img 
                      src={img.imageUrl} 
                      alt={img.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-800 line-clamp-2">« {img.prompt} »</p>
                      {img.caption && (
                        <p className="text-[11px] text-slate-600 mt-1 italic">{img.caption}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-amber-100 text-xs">
                      <span className="text-[10px] text-slate-600">{img.createdAt}</span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={img.imageUrl}
                          download={`lumi-${img.id}.png`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100"
                          title="Télécharger"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                        {onShareToCommunity && (
                          <button
                            onClick={() => onShareToCommunity(img.caption || img.prompt, 'dessin', img.prompt, img.imageUrl)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 text-white font-medium text-[11px] hover:bg-amber-700"
                            title="Partager sur le Mur Bienveillant"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>Partager</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. DRAWING CANVAS TAB */}
      {activeTool === 'drawing' && (
        <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-600" />
                Canevas d’Expression Artistique
              </h2>
              <p className="text-xs text-slate-600">Peins librement tes émotions, tes pensées ou tes symboles de paix.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={initCanvas}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-semibold text-slate-700 hover:bg-amber-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Effacer tout</span>
              </button>
              <button
                onClick={handleSaveCanvas}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Sauvegarder & Partager</span>
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80">
            {/* Color Palette */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Couleurs :</span>
              <div className="flex items-center gap-1.5">
                {PALETTE.map((p) => (
                  <button
                    key={p.color}
                    onClick={() => {
                      setCurrentColor(p.color);
                      setIsEraser(false);
                    }}
                    style={{ backgroundColor: p.color }}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      currentColor === p.color && !isEraser
                        ? 'ring-2 ring-offset-2 ring-amber-600 scale-110'
                        : 'hover:scale-105'
                    }`}
                    title={p.label}
                  />
                ))}
              </div>
            </div>

            {/* Eraser & Brush Size */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEraser(!isEraser)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
                  isEraser
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-50'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Gomme</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">Taille :</span>
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-24 accent-amber-600"
                />
              </div>
            </div>
          </div>

          <input
            type="text"
            value={canvasTitle}
            onChange={(e) => setCanvasTitle(e.target.value)}
            placeholder="Titre de ton dessin (ex: Mon arbre de sérénité)..."
            className="w-full px-4 py-2 rounded-xl bg-amber-50/40 border border-amber-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
          />

          {/* Interactive Canvas */}
          <div className="border-2 border-amber-200 rounded-3xl overflow-hidden shadow-inner bg-[#fffdfa] flex justify-center">
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
              className="touch-none cursor-crosshair max-w-full h-auto w-full max-h-[500px]"
            />
          </div>
        </div>
      )}

      {/* 3. WRITING TOOLS (POEMS, SONGS, STORIES, AFFIRMATIONS, PROJECT IDEAS, QUOTES) */}
      {activeTool !== 'image' && activeTool !== 'drawing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              Créer avec Lumi : {TOOL_TABS.find((t) => t.id === activeTool)?.label}
            </h2>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={creativePrompt}
                  onChange={(e) => setCreativePrompt(e.target.value)}
                  placeholder="Thème ou inspiration (ex : Le courage de recommencer après un échec, la paix du soir...)"
                  className="flex-1 px-4 py-3 rounded-2xl bg-amber-50/50 border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateCreativePiece(activeTool)}
                />
                <select
                  value={creativeTone}
                  onChange={(e) => setCreativeTone(e.target.value)}
                  className="px-3.5 py-3 rounded-2xl bg-white border border-amber-200 text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option value="Chaleureux et inspirant">Chaleureux et inspirant</option>
                  <option value="Doux et apaisant">Doux et apaisant</option>
                  <option value="Rythmé et plein d'énergie">Rythmé et motivant</option>
                  <option value="Philosophique et profond">Philosophique et profond</option>
                </select>
                <button
                  onClick={() => handleGenerateCreativePiece(activeTool)}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shrink-0 transition-all shadow-xs"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Feather className="w-4 h-4" />
                  )}
                  <span>Composer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Generated Pieces List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Tes créations littéraires & musicales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {generatedPieces.map((piece) => (
                <div key={piece.id} className="bg-white rounded-3xl p-6 border border-amber-200 shadow-2xs flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        {piece.type}
                      </span>
                      <span className="text-[11px] text-slate-600">{piece.createdAt}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{piece.title}</h4>
                    <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-amber-50/40 p-4 rounded-2xl border border-amber-100 font-serif">
                      {piece.content}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-amber-100 text-xs">
                    <button
                      onClick={() => handleCopyText(piece.id, piece.content)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 text-slate-700 hover:bg-amber-50"
                    >
                      {copiedId === piece.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>

                    {onShareToCommunity && (
                      <button
                        onClick={() => onShareToCommunity(piece.content, piece.type, piece.title)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 shadow-2xs"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Partager sur le Mur</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
