import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusCircle, 
  Heart, 
  MessageSquare, 
  Sparkles, 
  Music, 
  Feather, 
  Quote, 
  Mic, 
  Square, 
  Volume2, 
  ShieldAlert, 
  Filter, 
  Check, 
  X,
  Share2,
  Info,
  Search,
  Palette,
  Tag
} from 'lucide-react';
import { CommunityPost, PostType, CommunityComment, ThemeTag, UserProfile } from '../types';
import { INITIAL_POSTS, THEME_TAGS_CATALOG } from '../data/initialData';
import { playGentleChime } from '../utils/soundAndBreathing';
import { DrawingCanvasModal } from './DrawingCanvasModal';

interface CommunityWallProps {
  onOpenPrivateChat: () => void;
  currentUser?: UserProfile | null;
}

export const CommunityWall: React.FC<CommunityWallProps> = ({ onOpenPrivateChat, currentUser }) => {
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const stored = localStorage.getItem('lumi_community_posts');
      return stored ? JSON.parse(stored) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [filterType, setFilterType] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<ThemeTag | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  const [selectedPostComments, setSelectedPostComments] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});

  // New Post Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<PostType>('poeme');
  const [newTheme, setNewTheme] = useState<ThemeTag>('poeme');
  const [newAuthor, setNewAuthor] = useState(currentUser?.username || '');
  const [askLumiReaction, setAskLumiReaction] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audio recording for new post
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [postAudioUrl, setPostAudioUrl] = useState<string | null>(null);
  const postMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const postAudioChunksRef = useRef<Blob[]>([]);

  // Feedback state
  const [reportedPostIds, setReportedPostIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('lumi_community_posts', JSON.stringify(posts));
    } catch {}
  }, [posts]);

  useEffect(() => {
    if (currentUser?.username) {
      setNewAuthor(currentUser.username);
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Recording audio for post
  const startPostAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      postAudioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      postMediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) postAudioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(postAudioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setPostAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecordingAudio(true);
    } catch {
      alert("Impossible d'accéder au microphone.");
    }
  };

  const stopPostAudio = () => {
    if (postMediaRecorderRef.current && isRecordingAudio) {
      postMediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
    }
  };

  // Reactions handler
  const handleReaction = (postId: string, reactionType: 'love' | 'warmth' | 'hope' | 'strength') => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            reactions: {
              ...post.reactions,
              [reactionType]: post.reactions[reactionType] + 1,
            },
          };
        }
        return post;
      })
    );
    playGentleChime(528);
  };

  // Add a public comment
  const handleAddComment = (postId: string) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    const authorName = currentUser?.username || 'Voyageur bienveillant';
    const newComment: CommunityComment = {
      id: Date.now().toString(),
      author: authorName,
      content: text,
      createdAt: 'À l’instant',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setNewCommentText((prev) => ({ ...prev, [postId]: '' }));
    showToast("Ton commentaire public a été publié avec douceur.");
    playGentleChime(480);
  };

  // Handle saving a drawing created in DrawingCanvasModal
  const handleSaveDrawingPost = async (dataUrl: string, title: string, text: string) => {
    setIsSubmitting(true);
    let lumiCommentContent: string | undefined = undefined;

    try {
      const lumiRes = await fetch('/api/lumi-react-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          type: 'dessin',
          content: text || "Un dessin artistique partagé avec le cœur",
          author: currentUser?.username || 'Artiste de Lumi',
        }),
      });
      const lumiData = await lumiRes.json();
      lumiCommentContent = lumiData.comment;
    } catch {
      lumiCommentContent = "Ton dessin illumine notre espace de mille couleurs douces. Merci pour ce cadeau sensible ! ✨🎨";
    }

    const newDrawingPost: CommunityPost = {
      id: 'drawing-' + Date.now(),
      title,
      content: text || "Un dessin créé dans le calme pour apaiser l'esprit.",
      type: 'dessin',
      author: currentUser?.username || 'Artiste de Lumi',
      authorId: currentUser?.id,
      createdAt: 'À l’instant',
      imageUrl: dataUrl,
      themeTag: 'dessin',
      reactions: { love: 2, warmth: 2, hope: 2, strength: 1 },
      comments: lumiCommentContent
        ? [
            {
              id: 'lumi-' + Date.now(),
              author: 'Lumi ✨',
              content: lumiCommentContent,
              createdAt: 'À l’instant',
              isLumi: true,
            },
          ]
        : [],
      lumiComment: lumiCommentContent,
    };

    setPosts((prev) => [newDrawingPost, ...prev]);
    setIsSubmitting(false);
    showToast("Ton dessin a été déposé avec succès sur le Mur Bienveillant !");
    playGentleChime(528);
  };

  // Submit standard new post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || (!newContent.trim() && !postAudioUrl)) {
      alert("Merci d'ajouter un titre et un contenu (texte ou audio).");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Moderate content with server endpoint
      const modRes = await fetch('/api/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${newTitle} ${newContent}` }),
      });
      const modData = await modRes.json();

      if (!modData.safe) {
        alert("Ce message ne semble pas respecter notre charte de respect et de bienveillance : " + (modData.reason || "Propos inappropriés."));
        setIsSubmitting(false);
        return;
      }

      let lumiCommentContent: string | undefined = undefined;

      // 2. Ask Lumi for immediate gentle reaction if checked
      if (askLumiReaction) {
        try {
          const lumiRes = await fetch('/api/lumi-react-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: newTitle,
              type: newType,
              content: newContent || "(Enregistrement audio partagé)",
              author: newAuthor.trim() || "Anonyme",
            }),
          });
          const lumiData = await lumiRes.json();
          lumiCommentContent = lumiData.comment;
        } catch {
          lumiCommentContent = "Merci infiniment pour ce magnifique partage. Ta voix apporte tant de douceur à notre espace. ✨💛";
        }
      }

      const newPost: CommunityPost = {
        id: Date.now().toString(),
        title: newTitle.trim(),
        content: newContent.trim(),
        type: newType,
        themeTag: newTheme,
        author: newAuthor.trim() || "Âme sensible",
        authorId: currentUser?.id,
        createdAt: 'À l’instant',
        audioUrl: postAudioUrl || undefined,
        reactions: { love: 1, warmth: 1, hope: 1, strength: 0 },
        comments: lumiCommentContent
          ? [
              {
                id: 'lumi-' + Date.now(),
                author: 'Lumi ✨',
                content: lumiCommentContent,
                createdAt: 'À l’instant',
                isLumi: true,
              },
            ]
          : [],
        lumiComment: lumiCommentContent,
      };

      setPosts((prev) => [newPost, ...prev]);
      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setPostAudioUrl(null);
      showToast("Ta création a été déposée sur le Mur Bienveillant !");
      playGentleChime(432);
    } catch (err) {
      console.error(err);
      showToast("Une erreur est survenue lors de la publication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportPost = (postId: string) => {
    if (reportedPostIds.includes(postId)) return;
    if (window.confirm("Souhaites-tu signaler cette publication pour qu'elle soit examinée par l'équipe de modération ?")) {
      setReportedPostIds((prev) => [...prev, postId]);
      showToast("Merci pour ta vigilance. Cette publication a été signalée.");
    }
  };

  // Filter posts by type, theme and search query
  const filteredPosts = posts.filter((post) => {
    if (reportedPostIds.includes(post.id)) return false;

    // Type filter
    if (filterType !== 'all') {
      if (filterType === 'audio' && !post.audioUrl) return false;
      if (filterType !== 'audio' && post.type !== filterType) return false;
    }

    // Theme tag filter
    if (selectedTheme !== 'all') {
      if (post.themeTag !== selectedTheme) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchAuthor = post.author.toLowerCase().includes(q);
      const matchTag = post.themeTag?.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchAuthor && !matchTag) return false;
    }

    return true;
  });

  const getTypeIcon = (type: PostType) => {
    switch (type) {
      case 'poeme':
        return <Feather className="w-3.5 h-3.5 text-amber-700" />;
      case 'chanson':
        return <Music className="w-3.5 h-3.5 text-purple-700" />;
      case 'temoignage':
        return <Quote className="w-3.5 h-3.5 text-emerald-700" />;
      case 'encouragement':
        return <Sparkles className="w-3.5 h-3.5 text-amber-600" />;
      case 'audio':
        return <Volume2 className="w-3.5 h-3.5 text-blue-700" />;
      case 'dessin':
        return <Palette className="w-3.5 h-3.5 text-rose-600" />;
    }
  };

  const getTypeBadgeClass = (type: PostType) => {
    switch (type) {
      case 'poeme':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'chanson':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'temoignage':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'encouragement':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'audio':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'dessin':
        return 'bg-rose-100 text-rose-900 border-rose-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
              Espace Public Bienveillant
            </span>
            <span className="text-xs text-slate-400">Règles 16 à 25</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Le Mur des Mots Doux & Créations
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Partage tes poèmes, chansons, dessins, témoignages et enregistrements vocaux.
            Ici, les échanges sont uniquement publics et solidaires.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsDrawingModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium text-sm transition-transform active:scale-98 border border-amber-300 shadow-2xs"
          >
            <Palette className="w-4 h-4 text-amber-700" />
            <span>Dessiner</span>
          </button>

          <button
            id="btn-open-create-post"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition-transform active:scale-98 shadow-sm"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Partager un texte ou audio</span>
          </button>
        </div>
      </div>

      {/* Public rules reminder notice (Rules 17, 18, 19) */}
      <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl px-4 py-3 text-xs text-amber-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Règle d'or de sécurité :</span> Aucun message privé entre membres. Tous les échanges entre utilisateurs sont exclusivement publics sous forme de commentaires bienveillants. Pour te confier en toute intimité, rends-toi dans l'onglet{' '}
          <button
            onClick={onOpenPrivateChat}
            className="font-bold underline text-amber-800 hover:text-amber-950"
          >
            Conversation avec Lumi
          </button>.
        </div>
      </div>

      {/* Search Bar & Explorer by Theme */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-200/80 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Explorer le mur par mot-clé, thème ou auteur..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-amber-50/30 border border-amber-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 text-xs"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Theme Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium mr-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Thèmes :</span>
          </span>
          <button
            onClick={() => setSelectedTheme('all')}
            className={`px-3 py-1 rounded-full shrink-0 transition-colors ${
              selectedTheme === 'all'
                ? 'bg-amber-600 text-white font-medium shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-amber-50'
            }`}
          >
            Tous les thèmes
          </button>
          {THEME_TAGS_CATALOG.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTheme(tag.id as ThemeTag)}
              className={`px-3 py-1 rounded-full shrink-0 transition-colors flex items-center gap-1 ${
                selectedTheme === tag.id
                  ? 'bg-amber-600 text-white font-medium shadow-2xs'
                  : 'bg-amber-50/80 text-amber-900 border border-amber-200/60 hover:bg-amber-100'
              }`}
            >
              <span>{tag.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 ${
            filterType === 'all'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-amber-200/60 hover:bg-amber-50'
          }`}
        >
          Tous les formats
        </button>
        <button
          onClick={() => setFilterType('poeme')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
            filterType === 'poeme'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-amber-200/60 hover:bg-amber-50'
          }`}
        >
          <Feather className="w-3.5 h-3.5" />
          Poèmes
        </button>
        <button
          onClick={() => setFilterType('dessin')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
            filterType === 'dessin'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-amber-200/60 hover:bg-amber-50'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Dessins & Arts
        </button>
        <button
          onClick={() => setFilterType('chanson')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
            filterType === 'chanson'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-amber-200/60 hover:bg-amber-50'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          Chansons
        </button>
        <button
          onClick={() => setFilterType('temoignage')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
            filterType === 'temoignage'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-amber-200/60 hover:bg-amber-50'
          }`}
        >
          <Quote className="w-3.5 h-3.5" />
          Témoignages
        </button>
        <button
          onClick={() => setFilterType('encouragement')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
            filterType === 'encouragement'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-amber-200/60 hover:bg-amber-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Encouragements
        </button>
        <button
          onClick={() => setFilterType('audio')}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
            filterType === 'audio'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-amber-200/60 hover:bg-amber-50'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          Notes Vocales
        </button>
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-amber-200/60 p-8 space-y-3">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="font-semibold text-slate-800">Aucune publication trouvée pour ces critères.</p>
            <p className="text-xs text-slate-500">Sois la première personne à déposer un mot doux, un dessin ou un poème !</p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isCommentsOpen = selectedPostComments === post.id;

            return (
              <article
                key={post.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-xs hover:border-amber-300 transition-all space-y-4"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100/80 border border-amber-200 text-amber-900 font-bold flex items-center justify-center text-sm shadow-2xs">
                      {post.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{post.author}</span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full border flex items-center gap-1 font-medium ${getTypeBadgeClass(post.type)}`}>
                          {getTypeIcon(post.type)}
                          <span className="capitalize">{post.type}</span>
                        </span>
                        {post.themeTag && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            #{post.themeTag}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{post.createdAt}</span>
                    </div>
                  </div>

                  {/* Report button (Rule 21) */}
                  <button
                    onClick={() => handleReportPost(post.id)}
                    className="text-slate-400 hover:text-rose-600 text-xs p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Signaler un contenu inapproprié"
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {post.title}
                </h3>

                {/* Drawing Image if present */}
                {post.imageUrl && (
                  <div className="rounded-2xl overflow-hidden border border-amber-200/80 bg-slate-50 max-h-96 flex items-center justify-center">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full object-contain max-h-96"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-serif whitespace-pre-wrap bg-amber-50/30 p-4 rounded-2xl border border-amber-100/60">
                  {post.content}
                </div>

                {/* Audio player if present */}
                {post.audioUrl && (
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-amber-700 shrink-0" />
                    <audio controls src={post.audioUrl} className="w-full h-8" />
                  </div>
                )}

                {/* Lumi's Dedicated Encouragement Box (Rule 15 & 23) */}
                {post.lumiComment && (
                  <div className="p-4 rounded-2xl bg-linear-to-r from-amber-50 via-amber-100/50 to-amber-50 border border-amber-300/80 shadow-2xs text-xs sm:text-sm text-amber-950 space-y-1 relative">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                      <span>Le regard bienveillant de Lumi</span>
                    </div>
                    <p className="leading-relaxed italic">{post.lumiComment}</p>
                  </div>
                )}

                {/* Reactions & Comments Footer Bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => handleReaction(post.id, 'love')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-900 text-xs font-medium transition-colors"
                      title="Apporter du soutien"
                    >
                      <span>💛</span>
                      <span>{post.reactions.love}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(post.id, 'warmth')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100/80 text-rose-900 text-xs font-medium transition-colors"
                      title="Envoyer de la douceur"
                    >
                      <span>🌸</span>
                      <span>{post.reactions.warmth}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(post.id, 'hope')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100/80 text-sky-900 text-xs font-medium transition-colors"
                      title="Semer de l'espoir"
                    >
                      <span>✨</span>
                      <span>{post.reactions.hope}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(post.id, 'strength')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 text-xs font-medium transition-colors"
                      title="Transmettre de la force"
                    >
                      <span>💪</span>
                      <span>{post.reactions.strength}</span>
                    </button>
                  </div>

                  {/* Public comments toggle */}
                  <button
                    onClick={() => setSelectedPostComments(isCommentsOpen ? null : post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                    <span>Commentaires publics ({post.comments.length})</span>
                  </button>
                </div>

                {/* Public Comments Section (Rule 17) */}
                {isCommentsOpen && (
                  <div className="pt-3 border-t border-amber-100 space-y-3 animate-fadeIn">
                    <p className="text-[11px] text-slate-400 italic">
                      Les échanges entre utilisateurs se font uniquement par ces commentaires publics bienveillants.
                    </p>

                    <div className="space-y-2">
                      {post.comments.map((cmt) => (
                        <div
                          key={cmt.id}
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            cmt.isLumi
                              ? 'bg-amber-100/80 border border-amber-300 text-amber-950'
                              : 'bg-slate-50 border border-slate-200/70 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span className="flex items-center gap-1">
                              {cmt.isLumi && <Sparkles className="w-3 h-3 text-amber-600" />}
                              {cmt.author}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">{cmt.createdAt}</span>
                          </div>
                          <p>{cmt.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={newCommentText[post.id] || ''}
                        onChange={(e) =>
                          setNewCommentText({
                            ...newCommentText,
                            [post.id]: e.target.value,
                          })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        placeholder="Dépose un mot d'encouragement public..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-amber-50/40 border border-amber-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!newCommentText[post.id]?.trim()}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-medium text-xs transition-colors shadow-2xs"
                      >
                        Publier
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Modal: Drawing Canvas */}
      <DrawingCanvasModal
        isOpen={isDrawingModalOpen}
        onClose={() => setIsDrawingModalOpen(false)}
        onSaveDrawing={handleSaveDrawingPost}
      />

      {/* Modal: Create Publication */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-amber-200 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Feather className="w-4 h-4 text-amber-700" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Déposer une création</h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Post Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Type de publication</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(['poeme', 'chanson', 'temoignage', 'encouragement'] as PostType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewType(t)}
                      className={`px-2.5 py-2 rounded-xl text-xs font-medium border transition-all capitalize ${
                        newType === t
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Tag Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Thème principal</label>
                <select
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value as ThemeTag)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {THEME_TAGS_CATALOG.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Titre de ton partage</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Espoir du matin, Renaissance, Mon petit poème..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Author name / pseudonym */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ton prénom ou pseudonyme</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Ex: Camille, Étoile d'or, Anonyme..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ton texte, poème ou paroles</label>
                <textarea
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Laisse parler ton cœur avec sincérité..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 text-sm font-serif focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Optional Voice Attachment */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-amber-700" />
                    Enregistrer une note vocale ou chanson (optionnel)
                  </span>
                  {!isRecordingAudio ? (
                    <button
                      type="button"
                      onClick={startPostAudio}
                      className="px-2.5 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-medium text-xs transition-colors"
                    >
                      Démarrer le micro
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopPostAudio}
                      className="px-2.5 py-1 rounded-lg bg-rose-500 text-white font-medium text-xs transition-colors animate-pulse"
                    >
                      Terminer l'audio
                    </button>
                  )}
                </div>

                {postAudioUrl && (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <audio controls src={postAudioUrl} className="h-7 flex-1" />
                    <button
                      type="button"
                      onClick={() => setPostAudioUrl(null)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Retirer
                    </button>
                  </div>
                )}
              </div>

              {/* Ask Lumi for sweet encouragement */}
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={askLumiReaction}
                  onChange={(e) => setAskLumiReaction(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
                />
                <span>Demander un mot doux et encourageant de Lumi ✨ sur ma création</span>
              </label>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm transition-transform active:scale-98 shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Publication en cours..." : "Publier sur le Mur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
