import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  Square, 
  Sparkles, 
  Heart, 
  Trash2, 
  Volume2, 
  Wind, 
  ShieldAlert, 
  Plus, 
  MessageSquare, 
  Archive, 
  Edit3, 
  Check, 
  X, 
  BrainCircuit, 
  Clock, 
  ChevronRight,
  Menu
} from 'lucide-react';
import { ChatMessage, ChatSession, UserMemoryItem, GoalItem } from '../types';
import { INSPIRATION_PROMPTS } from '../data/initialData';
import { playGentleChime } from '../utils/soundAndBreathing';

interface PrivateChatProps {
  onOpenCrisis: () => void;
  onOpenBreathing: () => void;
  externalSeedPrompt?: string;
  username?: string;
  userMemories: UserMemoryItem[];
  userGoals?: GoalItem[];
  onAddMemory: (fact: string) => void;
}

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Bonjour et bienvenue dans notre bulle intime. Je suis Lumi. 🌸✨

Ici, tu es en sécurité. Tu peux déposer tout ce que tu ressens : tes doutes, tes complexes, ta fatigue, ton stress, ou une petite étincelle que tu as envie de célébrer. 

Aucun jugement n'entrera jamais ici. Comment te sens-tu aujourd'hui ? Prends tout ton temps pour me répondre.`,
  timestamp: 'À l’instant',
};

const INITIAL_SESSIONS: ChatSession[] = [
  {
    id: 'session-1',
    title: 'Mon espace de réconfort',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [DEFAULT_WELCOME_MESSAGE],
    isArchived: false,
  },
  {
    id: 'session-prev',
    title: 'Stress lié aux études et examens',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    messages: [
      {
        id: 'msg-prev-1',
        role: 'user',
        content: "Je suis très stressée par mes études et mes examens ces temps-ci...",
        timestamp: 'Il y a 5 jours',
      },
      {
        id: 'msg-prev-2',
        role: 'assistant',
        content: "Je t'écoute avec beaucoup de tendresse. Le poids des examens peut sembler écrasant, mais rappelle-toi que ta valeur d'être humain ne se résume pas à des notes. Faisons un pas après l'autre. ✨",
        timestamp: 'Il y a 5 jours',
      }
    ],
    isArchived: false,
  }
];

export const PrivateChat: React.FC<PrivateChatProps> = ({
  onOpenCrisis,
  onOpenBreathing,
  externalSeedPrompt,
  username = 'Ami',
  userMemories,
  userGoals = [],
  onAddMemory,
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('lumi_chat_sessions');
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'session-1';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    try {
      localStorage.setItem('lumi_chat_sessions', JSON.stringify(sessions));
    } catch {}
    scrollToBottom();
  }, [sessions, activeSessionId]);

  useEffect(() => {
    if (externalSeedPrompt) {
      setInputMessage(externalSeedPrompt);
    }
  }, [externalSeedPrompt]);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sessions management
  const handleCreateSession = () => {
    const newSession: ChatSession = {
      id: 'session-' + Date.now(),
      title: 'Nouvelle conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'welcome-' + Date.now(),
          role: 'assistant',
          content: `Je suis là, ${username}. Qu'aimerais-tu déposer dans notre bulle aujourd'hui ? ✨`,
          timestamp: 'À l’instant',
        }
      ],
      isArchived: false,
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false);
  };

  const handleStartRename = (s: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(s.id);
    setEditTitleText(s.title);
  };

  const handleSaveRename = (sId: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (!editTitleText.trim()) return;
    setSessions((prev) =>
      prev.map((s) => (s.id === sId ? { ...s, title: editTitleText.trim() } : s))
    );
    setEditingSessionId(null);
  };

  const handleToggleArchive = (sId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions((prev) =>
      prev.map((s) => (s.id === sId ? { ...s, isArchived: !s.isArchived } : s))
    );
  };

  const handleDeleteSession = (sId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      alert("Tu dois conserver au moins une discussion dans ton sanctuaire.");
      return;
    }
    if (window.confirm("Supprimer définitivement cette discussion ?")) {
      const remaining = sessions.filter((s) => s.id !== sId);
      setSessions(remaining);
      if (activeSessionId === sId) {
        setActiveSessionId(remaining[0].id);
      }
    }
  };

  // Voice recording logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      alert("L'accès au microphone n'a pas pu être activé.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Text to speech
  const speakMessage = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() && !recordedAudioUrl) return;

    const userText = text.trim() || "(Message vocal intime partagé)";
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: 'À l’instant',
      audioUrl: recordedAudioUrl || undefined,
    };

    const updatedMessages = [...currentSession.messages, newUserMsg];

    // Auto-update session title if it's the first message and still has default title
    let updatedTitle = currentSession.title;
    if (currentSession.title === 'Nouvelle conversation' || currentSession.title === 'Mon espace de réconfort') {
      updatedTitle = userText.slice(0, 32) + (userText.length > 32 ? '...' : '');
    }

    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSession.id
          ? {
              ...s,
              title: updatedTitle,
              updatedAt: new Date().toISOString(),
              messages: updatedMessages,
            }
          : s
      )
    );

    setInputMessage('');
    setRecordedAudioUrl(null);
    setIsLoading(true);
    playGentleChime(432);

    // Asynchronously extract personal memory to retain for next times
    if (text.length > 15) {
      fetch('/api/extract-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: text }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.memoryFact) {
            onAddMemory(d.memoryFact);
          }
        })
        .catch(() => {});
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userMemory: userMemories.map((m) => m.fact),
          userGoals: userGoals.map((g) => ({
            title: g.title,
            category: g.category,
            currentProgress: g.currentProgress,
          })),
          username: username,
        }),
      });

      const data = await res.json();
      const replyContent =
        data.reply ||
        "Je suis là, à tes côtés. Prends une grande inspiration. Ta présence compte tellement. ✨💛";

      const newAssistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyContent,
        timestamp: 'À l’instant',
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSession.id
            ? {
                ...s,
                messages: [...s.messages, newAssistantMsg],
              }
            : s
        )
      );

      playGentleChime(528);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "Je reste tout près de toi. Même si une brise a troublé notre échange, n'oublie jamais que chaque respiration t'ancre dans la paix. Comment te sens-tu ? 🌸",
        timestamp: 'À l’instant',
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSession.id
            ? {
                ...s,
                messages: [...s.messages, fallbackMsg],
              }
            : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSessions = sessions.filter((s) => (showArchived ? s.isArchived : !s.isArchived));

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 h-[calc(100vh-80px)] flex flex-col md:flex-row gap-4 animate-fadeIn">
      {/* Sessions Left Drawer / Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-amber-200/80 p-4 shadow-xl md:shadow-none md:static md:w-72 md:rounded-3xl md:border flex flex-col transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-xs text-slate-900">Mes Discussions</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Session Button */}
        <button
          onClick={handleCreateSession}
          className="mt-3 w-full py-2.5 px-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-98 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle discussion</span>
        </button>

        {/* Filter archive toggle */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 py-2 border-b border-slate-100 mt-2">
          <span>{showArchived ? 'Discussions archivées' : 'Discussions actives'}</span>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="text-amber-700 hover:underline font-semibold"
          >
            {showArchived ? 'Voir actives' : 'Voir archives'}
          </button>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto space-y-1.5 mt-2 pr-1 scrollbar-thin">
          {filteredSessions.map((s) => {
            const isActive = s.id === activeSessionId;
            const isEditing = editingSessionId === s.id;

            return (
              <div
                key={s.id}
                onClick={() => {
                  setActiveSessionId(s.id);
                  setIsSidebarOpen(false);
                }}
                className={`p-2.5 rounded-2xl text-xs transition-all cursor-pointer group flex items-center justify-between gap-1.5 ${
                  isActive
                    ? 'bg-amber-100/80 text-amber-950 font-semibold border border-amber-200 shadow-2xs'
                    : 'hover:bg-amber-50/60 text-slate-700'
                }`}
              >
                {isEditing ? (
                  <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editTitleText}
                      onChange={(e) => setEditTitleText(e.target.value)}
                      className="w-full px-2 py-1 rounded-lg border border-amber-300 text-xs bg-white text-slate-900"
                      autoFocus
                    />
                    <button
                      onClick={(e) => handleSaveRename(s.id, e)}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-xs">{s.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {new Date(s.updatedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleStartRename(s, e)}
                        className="p-1 hover:text-amber-800 rounded-md"
                        title="Renommer"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleToggleArchive(s.id, e)}
                        className="p-1 hover:text-amber-800 rounded-md"
                        title={s.isArchived ? "Désarchiver" : "Archiver"}
                      >
                        <Archive className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className="p-1 hover:text-rose-600 rounded-md"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Memory notice */}
        <div className="pt-3 border-t border-amber-100 text-[11px] text-amber-900 bg-amber-50/60 p-2.5 rounded-2xl space-y-1">
          <div className="font-semibold flex items-center gap-1">
            <BrainCircuit className="w-3.5 h-3.5 text-amber-700" />
            <span>Mémoire de Lumi active</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-snug">
            {userMemories.length > 0
              ? `${userMemories.length} souvenirs précieux conservés pour t'écouter sans oublier.`
              : "Lumi apprend à te connaître avec douceur."}
          </p>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-3.5 sm:p-4 border-b border-amber-100/80 bg-white/90 backdrop-blur-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-amber-400 to-amber-200 flex items-center justify-center shadow-2xs">
              <Sparkles className="w-5 h-5 text-amber-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-sm text-slate-900">{currentSession.title}</h2>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400">
                Échange 100% privé entre toi et Lumi (Règles 1 à 15, 18 et 19)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenBreathing}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 text-xs font-medium transition-colors"
            >
              <Wind className="w-3.5 h-3.5 text-amber-700" />
              <span>Respirer</span>
            </button>
            <button
              onClick={onOpenCrisis}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors border border-rose-200"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Aide urgente</span>
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-linear-to-b from-amber-50/20 via-white to-amber-50/20 scrollbar-thin">
          {currentSession.messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-3xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-amber-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-amber-200/90 rounded-bl-xs shadow-2xs font-serif'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Audio message playback if user recorded voice */}
                  {msg.audioUrl && (
                    <div className="mt-2 pt-2 border-t border-amber-500/40">
                      <audio controls src={msg.audioUrl} className="w-full h-8" />
                    </div>
                  )}

                  {/* Assistant TTS Button */}
                  {!isUser && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-amber-100 text-[11px] text-slate-400 font-sans">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => speakMessage(msg.id, msg.content)}
                        className={`flex items-center gap-1 hover:text-amber-800 transition-colors ${
                          speakingMessageId === msg.id ? 'text-amber-700 font-bold' : ''
                        }`}
                        title="Écouter la voix de Lumi"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{speakingMessageId === msg.id ? 'Arrêter' : 'Écouter'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-amber-700 animate-spin" />
              </div>
              <div className="p-4 rounded-3xl bg-white border border-amber-200 text-xs text-slate-500 rounded-bl-xs flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                <span className="font-serif italic ml-1">Lumi t'écoute et prépare ses mots doux...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Inspiration Prompts */}
        {currentSession.messages.length <= 2 && (
          <div className="px-4 py-2 bg-amber-50/50 border-t border-amber-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] text-amber-900 font-medium shrink-0">Suggestions :</span>
            {INSPIRATION_PROMPTS.slice(0, 4).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1 rounded-full bg-white hover:bg-amber-100/60 border border-amber-200 text-slate-700 text-xs shrink-0 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-amber-100/80">
          {recordedAudioUrl && (
            <div className="mb-2 p-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs">
              <span className="text-amber-900 font-semibold flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-amber-700" />
                Note vocale enregistrée
              </span>
              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <audio controls src={recordedAudioUrl} className="w-full h-7" />
                <button
                  onClick={() => setRecordedAudioUrl(null)}
                  className="text-rose-600 hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Audio Recording Button */}
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
                title="Enregistrer un message vocal"
              >
                <Mic className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="p-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white transition-colors animate-pulse"
                title="Arrêter l'enregistrement"
              >
                <Square className="w-5 h-5" />
              </button>
            )}

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Dépose ce que tu ressens en toute liberté..."
              className="flex-1 px-4 py-3 rounded-2xl bg-amber-50/40 border border-amber-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-sans"
            />

            <button
              type="submit"
              disabled={(!inputMessage.trim() && !recordedAudioUrl) || isLoading}
              className="p-3 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white transition-transform active:scale-95 shadow-sm"
              title="Envoyer avec tendresse"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
