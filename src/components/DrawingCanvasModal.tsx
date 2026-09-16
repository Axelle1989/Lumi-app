import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, RotateCcw, Check, Sparkles, Palette, Download } from 'lucide-react';

interface DrawingCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDrawing: (dataUrl: string, title: string, text: string) => void;
}

const PASTEL_COLORS = [
  { label: 'Nuit', color: '#1e293b' },
  { label: 'Lavande', color: '#8b5cf6' },
  { label: 'Rose poudré', color: '#f43f5e' },
  { label: 'Soleil d’or', color: '#f59e0b' },
  { label: 'Menthe', color: '#10b981' },
  { label: 'Ciel doux', color: '#0ea5e9' },
  { label: 'Terre d’Afrique', color: '#b45309' },
];

export const DrawingCanvasModal: React.FC<DrawingCanvasModalProps> = ({
  isOpen,
  onClose,
  onSaveDrawing,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentColor, setCurrentColor] = useState(PASTEL_COLORS[0].color);
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTitle, setDrawingTitle] = useState('');
  const [drawingNote, setDrawingNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTimeout(initCanvas, 50);
    }
  }, [isOpen]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill soft warm off-white canvas
    ctx.fillStyle = '#fffdfa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
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
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#fffdfa' : currentColor;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (window.confirm("Effacer tout le dessin pour recommencer ?")) {
      initCanvas();
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!drawingTitle.trim()) {
      alert("Merci de donner un joli titre à ton dessin.");
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');
    onSaveDrawing(dataUrl, drawingTitle.trim(), drawingNote.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-amber-200 relative max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Palette className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Coin Créativité & Dessin</h2>
              <p className="text-xs text-slate-500">Laisse parler ton cœur à travers les formes et les couleurs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 mb-3">
          {/* Colors */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {PASTEL_COLORS.map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => {
                  setCurrentColor(c.color);
                  setIsEraser(false);
                }}
                className={`w-7 h-7 rounded-full border-2 transition-transform shrink-0 ${
                  !isEraser && currentColor === c.color
                    ? 'scale-115 border-slate-900 shadow-xs'
                    : 'border-white hover:scale-105'
                }`}
                style={{ backgroundColor: c.color }}
                title={c.label}
              />
            ))}
          </div>

          {/* Tools */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEraser(!isEraser)}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-colors ${
                isEraser
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
              }`}
            >
              <Eraser className="w-4 h-4" />
              <span>Gomme</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 bg-white text-slate-700 border border-amber-200 hover:bg-rose-50 hover:text-rose-700 transition-colors"
              title="Effacer tout"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Effacer</span>
            </button>
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Épaisseur :</span>
            <input
              type="range"
              min={2}
              max={24}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 accent-amber-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Canvas area */}
        <div className="border border-amber-200/90 rounded-2xl overflow-hidden shadow-inner bg-[#fffdfa] flex justify-center">
          <canvas
            ref={canvasRef}
            width={600}
            height={380}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
            className="w-full max-h-[380px] touch-none cursor-crosshair"
          />
        </div>

        {/* Title & Description Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Titre de ton dessin *
            </label>
            <input
              type="text"
              required
              value={drawingTitle}
              onChange={(e) => setDrawingTitle(e.target.value)}
              placeholder="Ex: Mon arbre de paix, Un cœur léger..."
              className="w-full px-3 py-2 rounded-xl border border-amber-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ce que ce dessin t'inspire (optionnel)
            </label>
            <input
              type="text"
              value={drawingNote}
              onChange={(e) => setDrawingNote(e.target.value)}
              placeholder="Ex: Dessiné pour calmer mon esprit ce soir..."
              className="w-full px-3 py-2 rounded-xl border border-amber-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm transition-transform active:scale-98 shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Déposer sur le Mur</span>
          </button>
        </div>
      </div>
    </div>
  );
};
