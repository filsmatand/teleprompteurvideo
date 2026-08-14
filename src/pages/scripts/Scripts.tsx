import {
  ArrowLeft,
  Clock3,
  Edit3,
  FileText,
  MoreVertical,
  Play,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type Script = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const initialScripts: Script[] = [
  {
    id: 1,
    title: "Présentation de mon projet",
    content:
      "Bonjour à tous ! Aujourd'hui, je vais vous présenter mon nouveau projet...",
    createdAt: "Aujourd'hui",
    updatedAt: "Aujourd'hui",
  },
  {
    id: 2,
    title: "5 conseils pour réussir sur TikTok",
    content:
      "Dans cette vidéo, je vais vous donner cinq conseils simples pour améliorer vos vidéos...",
    createdAt: "Hier",
    updatedAt: "Hier",
  },
  {
    id: 3,
    title: "Pourquoi apprendre JavaScript ?",
    content:
      "JavaScript est aujourd'hui l'une des technologies les plus importantes du web...",
    createdAt: "Il y a 3 jours",
    updatedAt: "Il y a 3 jours",
  },
];

export default function Scripts() {
  const navigate = useNavigate();

  const [scripts, setScripts] = useState<Script[]>(() => {
    const saved = localStorage.getItem("creatorflow_scripts");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialScripts;
      }
    }

    return initialScripts;
  });

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingScript, setEditingScript] =
    useState<Script | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [openMenu, setOpenMenu] = useState<number | null>(null);

  /*
   * Sauvegarde locale
   */

  useEffect(() => {
    localStorage.setItem(
      "creatorflow_scripts",
      JSON.stringify(scripts)
    );
  }, [scripts]);

  /*
   * Ouvrir création
   */

  const openCreateModal = () => {
    setEditingScript(null);
    setTitle("");
    setContent("");
    setShowCreate(true);
  };

  /*
   * Ouvrir modification
   */

  const openEditModal = (script: Script) => {
    setEditingScript(script);
    setTitle(script.title);
    setContent(script.content);
    setShowCreate(true);
    setOpenMenu(null);
  };

  /*
   * Créer / modifier
   */

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    if (editingScript) {
      setScripts((current) =>
        current.map((script) =>
          script.id === editingScript.id
            ? {
                ...script,
                title: title.trim(),
                content: content.trim(),
                updatedAt: "À l'instant",
              }
            : script
        )
      );
    } else {
      const newScript: Script = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        createdAt: "À l'instant",
        updatedAt: "À l'instant",
      };

      setScripts((current) => [
        newScript,
        ...current,
      ]);
    }

    setShowCreate(false);
    setTitle("");
    setContent("");
    setEditingScript(null);
  };

  /*
   * Supprimer
   */

  const handleDelete = (id: number) => {
    setScripts((current) =>
      current.filter((script) => script.id !== id)
    );

    setOpenMenu(null);
  };

  /*
   * Ouvrir dans téléprompteur
   */

  const openTeleprompter = (script: Script) => {
    localStorage.setItem(
      "creatorflow_current_script",
      JSON.stringify(script)
    );

    navigate("/teleprompter");
  };

  /*
   * Recherche
   */

  const filteredScripts = scripts.filter((script) => {
    const query = search.toLowerCase();

    return (
      script.title.toLowerCase().includes(query) ||
      script.content.toLowerCase().includes(query)
    );
  });

  /*
   * Nombre de mots
   */

  const wordCount = content.trim()
    ? content.trim().split(/\s+/).length
    : 0;

  /*
   * Durée approximative
   */

  const estimatedMinutes = Math.max(
    1,
    Math.ceil(wordCount / 130)
  );

  return (
    <div className="min-h-screen bg-[#faf9fd] text-[#17131f]">

      {/* =================================
          HEADER
      ================================= */}

      <header className="sticky top-0 z-40 border-b border-[#eee9f3] bg-white/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <Link
              to="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1edfa] text-[#7041e8] transition hover:bg-[#e8e1f8]"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h1 className="text-sm font-bold sm:text-base">
                Mes scripts
              </h1>

              <p className="hidden text-[10px] text-[#aaa3b1] sm:block">
                Préparez vos textes avant de tourner
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-[#7041e8] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(112,65,232,0.18)] transition hover:bg-[#6133d8]"
          >
            <Plus size={16} />

            <span className="hidden sm:inline">
              Nouveau script
            </span>

            <span className="sm:hidden">
              Nouveau
            </span>
          </button>

        </div>
      </header>

      {/* =================================
          MAIN
      ================================= */}

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-7 sm:px-6 lg:px-8">

        {/* INTRO */}

        <section>
          <p className="text-xs font-semibold text-[#7041e8]">
            BIBLIOTHÈQUE
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight">
            Vos scripts
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#817a89]">
            Écrivez vos textes, préparez vos vidéos et
            envoyez-les directement vers le téléprompteur.
          </p>
        </section>

        {/* =================================
            SEARCH
        ================================= */}

        <section className="mt-6">

          <div className="relative max-w-xl">

            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa3b1]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Rechercher un script..."
              className="h-12 w-full rounded-2xl border border-[#e8e2ef] bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-[#b7b0bd] focus:border-[#a88ae8] focus:ring-4 focus:ring-[#7041e8]/5"
            />

          </div>

        </section>

        {/* =================================
            STATS
        ================================= */}

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#e9e3f1] bg-white p-4">

            <div className="flex items-center gap-2 text-[#7041e8]">
              <FileText size={16} />

              <span className="text-[10px] font-semibold">
                SCRIPTS
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold">
              {scripts.length}
            </p>

          </div>

          <div className="rounded-2xl border border-[#e9e3f1] bg-white p-4">

            <div className="flex items-center gap-2 text-[#7041e8]">
              <Clock3 size={16} />

              <span className="text-[10px] font-semibold">
                CETTE SEMAINE
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold">
              {scripts.length}
            </p>

          </div>

          <div className="col-span-2 rounded-2xl border border-[#e9e3f1] bg-white p-4 sm:col-span-1">

            <div className="flex items-center gap-2 text-[#7041e8]">
              <Play size={16} />

              <span className="text-[10px] font-semibold">
                PRÊTS À TOURNER
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold">
              {scripts.length}
            </p>

          </div>

        </section>

        {/* =================================
            SCRIPT LIST
        ================================= */}

        <section className="mt-8">

          <div className="mb-4 flex items-center justify-between">

            <h3 className="text-lg font-bold">
              Tous vos scripts
            </h3>

            <span className="text-xs text-[#aaa3b1]">
              {filteredScripts.length} résultat
              {filteredScripts.length > 1 ? "s" : ""}
            </span>

          </div>

          {filteredScripts.length === 0 ? (

            /* EMPTY STATE */

            <div className="rounded-[28px] border border-dashed border-[#ddd5e8] bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eee8ff] text-[#7041e8]">
                <FileText size={26} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Aucun script trouvé
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#817a89]">
                Créez votre premier script ou essayez
                une autre recherche.
              </p>

              <button
                type="button"
                onClick={openCreateModal}
                className="mt-6 rounded-xl bg-[#7041e8] px-5 py-3 text-xs font-semibold text-white"
              >
                Créer mon premier script
              </button>

            </div>

          ) : (

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {filteredScripts.map((script) => (

                <article
                  key={script.id}
                  className="group relative overflow-visible rounded-[25px] border border-[#e9e3f1] bg-white p-5 shadow-[0_8px_30px_rgba(50,35,70,0.035)] transition hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(50,35,70,0.08)]"
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eee8ff] text-[#7041e8]">
                        <FileText size={19} />
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold">
                          {script.title}
                        </h4>

                        <p className="mt-1 text-[10px] text-[#aaa3b1]">
                          Modifié {script.updatedAt}
                        </p>
                      </div>

                    </div>

                    {/* MENU */}

                    <div className="relative">

                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === script.id
                              ? null
                              : script.id
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#aaa3b1] transition hover:bg-[#f5f2f8] hover:text-[#7041e8]"
                      >
                        <MoreVertical size={17} />
                      </button>

                      {openMenu === script.id && (
                        <div className="absolute right-0 top-9 z-30 w-40 overflow-hidden rounded-xl border border-[#e9e3f1] bg-white p-1.5 shadow-[0_15px_40px_rgba(40,25,60,0.12)]">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(script)
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-[#4d4655] hover:bg-[#f7f4fb]"
                          >
                            <Edit3 size={14} />
                            Modifier
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(script.id)
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Supprimer
                          </button>

                        </div>
                      )}

                    </div>

                  </div>

                  {/* CONTENT PREVIEW */}

                  <p className="mt-5 line-clamp-3 min-h-[60px] text-xs leading-5 text-[#817a89]">
                    {script.content}
                  </p>

                  {/* FOOTER */}

                  <div className="mt-5 flex items-center justify-between border-t border-[#f0ebf4] pt-4">

                    <div className="flex items-center gap-2 text-[10px] text-[#aaa3b1]">
                      <Clock3 size={12} />

                      {Math.max(
                        1,
                        Math.ceil(
                          script.content
                            .trim()
                            .split(/\s+/).length / 130
                        )
                      )}{" "}
                      min
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        openTeleprompter(script)
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-[#7041e8] px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-[#6133d8]"
                    >
                      <Play size={12} />
                      Téléprompteur
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* =================================
          CREATE / EDIT MODAL
      ================================= */}

      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17131f]/40 px-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-5 shadow-[0_25px_80px_rgba(30,15,50,0.2)] sm:p-7">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-semibold text-[#7041e8]">
                  {editingScript
                    ? "MODIFIER"
                    : "NOUVEAU SCRIPT"}
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {editingScript
                    ? "Modifier votre script"
                    : "Créer un nouveau script"}
                </h2>

                <p className="mt-1 text-xs text-[#817a89]">
                  Préparez votre texte avant de passer
                  au téléprompteur.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f2f8] text-[#817a89] hover:text-[#17131f]"
              >
                <X size={17} />
              </button>

            </div>

            {/* TITLE */}

            <div className="mt-7">

              <label className="mb-2 block text-xs font-semibold">
                Titre du script
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Ex : Ma prochaine vidéo TikTok"
                className="h-12 w-full rounded-xl border border-[#e5dfea] bg-[#fcfbfd] px-4 text-sm outline-none transition focus:border-[#7041e8] focus:ring-4 focus:ring-[#7041e8]/5"
              />

            </div>

            {/* CONTENT */}

            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between">

                <label className="text-xs font-semibold">
                  Votre texte
                </label>

                <span className="text-[10px] text-[#aaa3b1]">
                  {wordCount} mots • ~{estimatedMinutes} min
                </span>

              </div>

              <textarea
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder="Écrivez ici le texte que vous allez lire pendant votre vidéo..."
                className="min-h-[280px] w-full resize-y rounded-2xl border border-[#e5dfea] bg-[#fcfbfd] p-4 text-sm leading-6 outline-none transition focus:border-[#7041e8] focus:ring-4 focus:ring-[#7041e8]/5"
              />

            </div>

            {/* FUTURE AI */}

            <div className="mt-4 rounded-2xl border border-[#e7ddfa] bg-[#faf7ff] p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eee8ff] text-[#7041e8]">
                  ✨
                </div>

                <div>
                  <p className="text-xs font-bold">
                    Générer avec l'IA
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-[#817a89]">
                    Cette fonctionnalité sera bientôt
                    disponible. L'IA pourra créer votre
                    script automatiquement à partir d'une
                    simple idée.
                  </p>

                  <span className="mt-2 inline-block rounded-full bg-[#eee8ff] px-2 py-1 text-[9px] font-semibold text-[#7041e8]">
                    BIENTÔT
                  </span>
                </div>

              </div>

            </div>

            {/* ACTIONS */}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-xl px-5 py-3 text-xs font-semibold text-[#817a89] hover:bg-[#f7f4fa]"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!title.trim() || !content.trim()}
                className="rounded-xl bg-[#7041e8] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#6133d8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {editingScript
                  ? "Enregistrer les modifications"
                  : "Créer le script"}
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}