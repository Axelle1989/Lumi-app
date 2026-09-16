import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Sparkles, 
  Brain, 
  HelpCircle, 
  Clock, 
  Plus, 
  Trash2, 
  Award,
  Zap,
  Bookmark,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { StudySheet, QuizData, ExamCountdown } from '../types';
import { playGentleChime } from '../utils/soundAndBreathing';

interface StudyCoachSpaceProps {
  username?: string;
}

export const StudyCoachSpace: React.FC<StudyCoachSpaceProps> = ({ username }) => {
  const [subTab, setSubTab] = useState<'exams' | 'sheets' | 'quiz' | 'methods'>('sheets');

  // Exam Countdown state
  const [exams, setExams] = useState<ExamCountdown[]>(() => {
    const saved = localStorage.getItem('lumi_study_exams');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'exam-1',
        subject: 'Mathématiques & Statistiques',
        examDate: '2026-11-20',
        totalDays: 65,
        remainingDays: 45,
        keyPriority: 'Maîtriser les probabilités conditionnelles & lois normales',
      },
      {
        id: 'exam-2',
        subject: 'Anglais B2 (Oral & Écrit)',
        examDate: '2026-12-15',
        totalDays: 90,
        remainingDays: 70,
        keyPriority: 'Enrichir le vocabulaire académique & fluidité d’élocution',
      },
      {
        id: 'exam-3',
        subject: 'Algorithmique & Programmation',
        examDate: '2027-01-10',
        totalDays: 120,
        remainingDays: 95,
        keyPriority: 'Arbres binaires et complexité temporelle',
      },
    ];
  });

  const [newSubject, setNewSubject] = useState('');
  const [newExamDate, setNewExamDate] = useState('');
  const [newPriority, setNewPriority] = useState('');

  // Study Sheets state
  const [sheets, setSheets] = useState<StudySheet[]>(() => {
    const saved = localStorage.getItem('lumi_study_sheets');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'sheet-1',
        title: 'Fiche Synthèse : La Méthode Feynman',
        subject: 'Méthodologie d’Apprentissage',
        topic: 'Comprendre en profondeur n’importe quel concept',
        createdAt: '14/09/2026',
        feynmanSummary: 'Si tu ne peux pas l’expliquer simplement à un enfant de 10 ans, c’est que tu ne l’as pas encore compris.',
        keyConcepts: [
          { term: 'Vulgarisation', definition: 'Traduire le jargon technique en analogies vivantes et simples.' },
          { term: 'Identification des lacunes', definition: 'Repérer exactement l’endroit où l’explication bloque pour y revenir.' },
          { term: 'Simplification itérative', definition: 'Raccourcir et clarifier le discours jusqu’à une clarté absolue.' },
        ],
        essentialPoints: [
          'Étape 1 : Choisis le concept et écris son nom en haut d’une feuille blanche.',
          'Étape 2 : Écris l’explication avec tes propres mots, sans consulter tes cours.',
          'Étape 3 : Relis et identifie les zones floues, puis consulte tes notes pour combler le vide.',
          'Étape 4 : Raconte l’histoire du concept comme s’il s’agissait d’une aventure concrète.',
        ],
        memoryHook: 'Pense à FE-YN-MAN : Focus, Explain, Yield gaps, Master & simplify !',
        examTip: 'Avant l’épreuve, explique 3 théorèmes clés à haute voix à toi-même pour verrouiller la mémoire.',
        encouragement: 'Ton cerveau est un muscle prodigieux. Chaque explication le rend plus agile ! ✨',
      },
    ];
  });

  const [activeSheet, setActiveSheet] = useState<StudySheet | null>(sheets[0] || null);
  const [sheetSubjectInput, setSheetSubjectInput] = useState('');
  const [sheetTopicInput, setSheetTopicInput] = useState('');
  const [sheetLevelInput, setSheetLevelInput] = useState('Université / Licence');
  const [isGeneratingSheet, setIsGeneratingSheet] = useState(false);

  // Quiz state
  const [quizSubjectInput, setQuizSubjectInput] = useState('');
  const [quizTopicInput, setQuizTopicInput] = useState('');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Save exams to localStorage
  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newExamDate) return;

    const examDateObj = new Date(newExamDate);
    const now = new Date();
    const diffTime = Math.max(0, examDateObj.getTime() - now.getTime());
    const remaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const item: ExamCountdown = {
      id: `exam-${Date.now()}`,
      subject: newSubject.trim(),
      examDate: newExamDate,
      totalDays: remaining,
      remainingDays: remaining,
      keyPriority: newPriority.trim() || 'Révision globale du programme',
    };

    const updated = [...exams, item];
    setExams(updated);
    localStorage.setItem('lumi_study_exams', JSON.stringify(updated));
    setNewSubject('');
    setNewExamDate('');
    setNewPriority('');
    playGentleChime(528);
  };

  const handleDeleteExam = (id: string) => {
    const updated = exams.filter((e) => e.id !== id);
    setExams(updated);
    localStorage.setItem('lumi_study_exams', JSON.stringify(updated));
  };

  // Generate Study Sheet
  const handleGenerateSheet = async () => {
    if (!sheetTopicInput.trim()) return;
    setIsGeneratingSheet(true);
    try {
      const res = await fetch('/api/generate-study-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: sheetSubjectInput || 'Matière générale',
          topic: sheetTopicInput,
          level: sheetLevelInput,
        }),
      });
      const data = await res.json();
      const newSheet: StudySheet = {
        id: `sheet-${Date.now()}`,
        title: data.title || `Fiche : ${sheetTopicInput}`,
        subject: sheetSubjectInput || 'Études',
        topic: sheetTopicInput,
        createdAt: new Date().toLocaleDateString('fr-FR'),
        feynmanSummary: data.feynmanSummary || '',
        keyConcepts: data.keyConcepts || [],
        essentialPoints: data.essentialPoints || [],
        memoryHook: data.memoryHook || '',
        examTip: data.examTip || '',
        encouragement: data.encouragement || 'Bravo pour ton travail !',
      };

      const updated = [newSheet, ...sheets];
      setSheets(updated);
      setActiveSheet(newSheet);
      localStorage.setItem('lumi_study_sheets', JSON.stringify(updated));
      setSheetTopicInput('');
      playGentleChime(659);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSheet(false);
    }
  };

  // Generate Quiz
  const handleGenerateQuiz = async () => {
    if (!quizTopicInput.trim()) return;
    setIsGeneratingQuiz(true);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: quizSubjectInput || 'Matière générale',
          topic: quizTopicInput,
          questionCount: 4,
        }),
      });
      const data = await res.json();
      setCurrentQuiz(data);
      playGentleChime(587);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    if (!currentQuiz) return 0;
    let score = 0;
    currentQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>Coach Études & Réussite Académique</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Révise avec méthode, clarté et sérénité.
          </h2>
          <p className="text-sm text-teal-100/90 leading-relaxed">
            Ici, l’apprentissage s’appuie sur les sciences cognitives : mémorisation active, fiches de révision intelligentes, quiz d’ancrage et gestion sereine du calendrier d’examens.
          </p>
        </div>
      </div>

      {/* Sub-tabs selector */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-amber-100/70 border border-amber-200/80">
        <button
          onClick={() => setSubTab('sheets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            subTab === 'sheets'
              ? 'bg-white text-teal-900 shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-teal-700" />
          <span>Fiches de Révision IA ({sheets.length})</span>
        </button>

        <button
          onClick={() => setSubTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            subTab === 'quiz'
              ? 'bg-white text-teal-900 shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Quiz Automatiques</span>
        </button>

        <button
          onClick={() => setSubTab('exams')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            subTab === 'exams'
              ? 'bg-white text-teal-900 shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Calendrier & Examens ({exams.length})</span>
        </button>

        <button
          onClick={() => setSubTab('methods')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            subTab === 'methods'
              ? 'bg-white text-teal-900 shadow-2xs'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Brain className="w-4 h-4 text-purple-600" />
          <span>Techniques de Mémorisation</span>
        </button>
      </div>

      {/* 1. FICHES DE RÉVISION */}
      {subTab === 'sheets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel: Creator & list */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-teal-100 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <h3 className="font-bold text-slate-800 text-sm">Générer une nouvelle fiche de cours</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Matière ou domaine</label>
                  <input
                    type="text"
                    placeholder="Ex: Droit civil, Biologie cellulaire, Histoire..."
                    value={sheetSubjectInput}
                    onChange={(e) => setSheetSubjectInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chapitre ou notion clé *</label>
                  <input
                    type="text"
                    placeholder="Ex: La mitose et ses étapes, La responsabilité délictuelle..."
                    value={sheetTopicInput}
                    onChange={(e) => setSheetTopicInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Niveau d'études</label>
                  <select
                    value={sheetLevelInput}
                    onChange={(e) => setSheetLevelInput(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  >
                    <option value="Collège / Brevet">Collège / Brevet</option>
                    <option value="Lycée / Baccalauréat">Lycée / Baccalauréat</option>
                    <option value="Université / Licence (L1, L2, L3)">Université / Licence (L1, L2, L3)</option>
                    <option value="Master & Concours d'excellence">Master & Concours d'excellence</option>
                    <option value="Formation professionnelle & Autodidacte">Formation professionnelle & Autodidacte</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateSheet}
                  disabled={isGeneratingSheet || !sheetTopicInput.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-800 text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-teal-900 transition-colors disabled:opacity-50 shadow-2xs"
                >
                  {isGeneratingSheet ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Lumi synthétise la fiche...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-teal-300" />
                      <span>Créer la Fiche avec Lumi IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* List of saved sheets */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider px-1">
                Mes fiches sauvegardées
              </span>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {sheets.map((sheet) => (
                  <div
                    key={sheet.id}
                    onClick={() => setActiveSheet(sheet)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      activeSheet?.id === sheet.id
                        ? 'border-teal-600 bg-teal-50/70 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-teal-800 mb-1">
                      <span>{sheet.subject}</span>
                      <span className="text-[11px] text-slate-600 font-normal">{sheet.createdAt}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{sheet.title}</h4>
                    <p className="text-[11px] text-slate-700 mt-1 line-clamp-2">{sheet.feynmanSummary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Active sheet display */}
          <div className="lg:col-span-7">
            {activeSheet ? (
              <div className="p-6 rounded-3xl bg-white border border-teal-200/80 shadow-2xs space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 mb-1">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{activeSheet.subject}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{activeSheet.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">Sujet : {activeSheet.topic}</p>
                </div>

                {/* Feynman Summary */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                    💡 Résumé Simple (Méthode Feynman)
                  </span>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    « {activeSheet.feynmanSummary} »
                  </p>
                </div>

                {/* Key Concepts */}
                {activeSheet.keyConcepts && activeSheet.keyConcepts.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Concepts Fondamentaux
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeSheet.keyConcepts.map((kc, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="font-bold text-xs text-teal-800 block mb-0.5">{kc.term}</span>
                          <p className="text-[11px] text-slate-700 leading-relaxed">{kc.definition}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Essential Points */}
                {activeSheet.essentialPoints && activeSheet.essentialPoints.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      Points Clés à Retenir pour l'Examen
                    </span>
                    <ul className="space-y-1.5">
                      {activeSheet.essentialPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Memory Hook & Exam Tip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                    <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block mb-1">
                      🧠 Mnémotechnique
                    </span>
                    <p className="text-xs text-purple-900 leading-relaxed">{activeSheet.memoryHook}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200">
                    <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider block mb-1">
                      🎯 Conseil du Jour J
                    </span>
                    <p className="text-xs text-teal-900 leading-relaxed">{activeSheet.examTip}</p>
                  </div>
                </div>

                {/* Encouragement note */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="italic text-teal-800">« {activeSheet.encouragement} » — Lumi</span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-200 text-slate-600 text-xs">
                Sélectionne une fiche ou génère-en une nouvelle pour la visualiser.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. QUIZ AUTOMATIQUES */}
      {subTab === 'quiz' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-700" />
              <h3 className="font-bold text-slate-800 text-sm">Générer un quiz d'entraînement interactif</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="Matière (ex: Philosophie, SVT, Comptabilité)"
                  value={quizSubjectInput}
                  onChange={(e) => setQuizSubjectInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="Sujet / Chapitre précis pour le quiz *"
                  value={quizTopicInput}
                  onChange={(e) => setQuizTopicInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  onClick={handleGenerateQuiz}
                  disabled={isGeneratingQuiz || !quizTopicInput.trim()}
                  className="w-full h-full py-2.5 px-3 rounded-xl bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  {isGeneratingQuiz ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Créer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Current Quiz Card */}
          {currentQuiz ? (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Entraînement</span>
                  <h3 className="text-lg font-bold text-slate-800">{currentQuiz.title}</h3>
                </div>
                {quizSubmitted && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs">
                    <Award className="w-4 h-4" />
                    <span>Score : {calculateScore()} / {currentQuiz.questions.length}</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {currentQuiz.questions.map((q, idx) => {
                  const isSelected = selectedAnswers[q.id] !== undefined;
                  const chosenOpt = selectedAnswers[q.id];
                  const isCorrect = chosenOpt === q.correctIndex;

                  return (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-lg bg-teal-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 pt-0.5">{q.question}</h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const isOptChosen = chosenOpt === oIdx;
                          let btnStyle = "border-slate-200 bg-white hover:bg-slate-100 text-slate-700";

                          if (quizSubmitted) {
                            if (oIdx === q.correctIndex) {
                              btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold";
                            } else if (isOptChosen && !isCorrect) {
                              btnStyle = "border-rose-400 bg-rose-50 text-rose-900";
                            } else {
                              btnStyle = "border-slate-200 bg-white opacity-60 text-slate-500";
                            }
                          } else if (isOptChosen) {
                            btnStyle = "border-teal-600 bg-teal-50 text-teal-900 font-bold";
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelectOption(q.id, oIdx)}
                              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2 ${btnStyle}`}
                            >
                              <span className="font-bold text-[11px] text-slate-600">{String.fromCharCode(65 + oIdx)}.</span>
                              <span className="flex-1">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation after submit */}
                      {quizSubmitted && (
                        <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 leading-relaxed">
                          <span className="font-bold block mb-0.5">Explication pédagogique :</span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2">
                {!quizSubmitted ? (
                  <button
                    onClick={() => {
                      setQuizSubmitted(true);
                      playGentleChime(784);
                    }}
                    disabled={Object.keys(selectedAnswers).length < currentQuiz.questions.length}
                    className="py-2.5 px-6 rounded-xl bg-teal-800 text-white font-bold text-xs hover:bg-teal-900 transition-colors disabled:opacity-50 shadow-2xs"
                  >
                    Valider mes réponses
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedAnswers({});
                      setQuizSubmitted(false);
                      playGentleChime(528);
                    }}
                    className="py-2.5 px-6 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition-colors shadow-2xs"
                  >
                    Recommencer ce quiz
                  </button>
                )}

                {currentQuiz.lumiBonusTip && (
                  <span className="text-xs text-amber-800 italic">
                    💡 Astuce Lumi : {currentQuiz.lumiBonusTip}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-200 text-slate-600 text-xs">
              Entre un sujet ci-dessus pour générer un premier quiz d'entraînement interactif.
            </div>
          )}
        </div>
      )}

      {/* 3. CALENDRIER & EXAMENS */}
      {subTab === 'exams' && (
        <div className="space-y-6">
          {/* Add exam form */}
          <form onSubmit={handleAddExam} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">Ajouter une date d'épreuve ou d'examen</h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Matière (ex: Économie générale)"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="date"
                  value={newExamDate}
                  onChange={(e) => setNewExamDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  required
                />
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Priorité clé de révision"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div className="sm:col-span-1">
                <button
                  type="submit"
                  className="w-full h-full p-2 rounded-xl bg-teal-800 text-white flex items-center justify-center hover:bg-teal-900 transition-colors shadow-2xs"
                  title="Ajouter l'examen"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Exam list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exams.map((exam) => (
              <div key={exam.id} className="p-5 rounded-3xl bg-white border border-teal-100 shadow-2xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span className="font-semibold text-teal-800">{new Date(exam.examDate).toLocaleDateString('fr-FR')}</span>
                    <button
                      onClick={() => handleDeleteExam(exam.id)}
                      className="text-slate-600 hover:text-rose-600 transition-colors p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-2">{exam.subject}</h4>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                    <span className="font-semibold block text-slate-700">Focus prioritaire :</span>
                    {exam.keyPriority}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-slate-800">{exam.remainingDays} jours restants</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold">
                    {exam.remainingDays < 15 ? 'Sprint final' : 'Rythme régulier'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TECHNIQUES DE MÉMORISATION */}
      {subTab === 'methods' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-teal-100 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
              <Brain className="w-4 h-4 text-teal-600" />
              <span>1. La Répétition Espacée (Spaced Repetition)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Pour lutter contre la « courbe de l'oubli d'Ebbinghaus », relis tes fiches à des intervalles précis :
            </p>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-teal-50 border border-teal-100">
                <span className="font-bold text-teal-800 block">J + 1</span>
                <span className="text-[10px] text-slate-600">Le lendemain</span>
              </div>
              <div className="p-2 rounded-xl bg-teal-50 border border-teal-100">
                <span className="font-bold text-teal-800 block">J + 3</span>
                <span className="text-[10px] text-slate-600">3 jours après</span>
              </div>
              <div className="p-2 rounded-xl bg-teal-50 border border-teal-100">
                <span className="font-bold text-teal-800 block">J + 7</span>
                <span className="text-[10px] text-slate-600">1 semaine après</span>
              </div>
              <div className="p-2 rounded-xl bg-teal-50 border border-teal-100">
                <span className="font-bold text-teal-800 block">J + 21</span>
                <span className="text-[10px] text-slate-600">Ancrage durable</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-amber-100 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>2. Le Pomodoro 25 / 5 avec Respiration</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Travaille par sessions intenses de 25 minutes sans aucune notification, suivies de 5 minutes de déconnexion totale (marche, verre d'eau, respiration 432Hz). Après 4 blocs, prends 20 minutes de pause.
            </p>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
              💡 Règle d'or : Ton téléphone doit être physiquement hors de portée de ta main durant les 25 minutes.
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-purple-100 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-purple-700" />
              <span>3. Le Palais Mental (Méthode des Loci)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Associe les idées que tu dois retenir aux pièces d'un lieu que tu connais par cœur (ta chambre, ta maison d'enfance). En marchant mentalement d'un meuble à l'autre, chaque souvenir réapparaît sans effort.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-emerald-100 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>4. Le Rituel Anti-Trac avant l'Épreuve</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              10 minutes avant de rentrer en salle : expire deux fois plus longtemps que tu n'inspires (effet apaisant sur le nerf vague). Dis-toi : « Tout ce que j'ai appris est là. Je n'ai besoin que de mon calme. »
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
