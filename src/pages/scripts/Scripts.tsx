import {
  ArrowLeft,
  Clock3,
  Edit3,
  FileText,
  MoreVertical,
  Play,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  supabase,
} from "../../lib/supabase";
// Si ton fichier supabase.ts est ailleurs,
// adapte simplement le chemin ci-dessus.


/* =========================================================
   TYPES
========================================================= */

type Script = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
};


/* =========================================================
   COMPONENT
========================================================= */

export default function Scripts() {
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [scripts, setScripts] = useState<Script[]>([]);

  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] =
    useState(false);

  const [editingScript, setEditingScript] =
    useState<Script | null>(null);

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [category, setCategory] =
    useState("Présentation");

  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);


  /* =======================================================
     CHARGER LES SCRIPTS
  ======================================================= */

  const loadScripts = async () => {
    try {
      setLoading(true);
      setError(null);

      /*
       * On vérifie que l'utilisateur est connecté.
       */

      const {
        data: {
          user,
        },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError) {
        throw sessionError;
      }

      if (!user) {
        navigate("/login");
        return;
      }

      /*
       * Récupération des scripts de l'utilisateur.
       *
       * Grâce à RLS, Supabase ne retournera
       * que les scripts autorisés.
       */

      const {
        data,
        error: scriptsError,
      } = await supabase
        .from("scripts")
        .select(`
          id,
          user_id,
          title,
          content,
          category,
          created_at,
          updated_at
        `)
        .eq("user_id", user.id)
        .order("updated_at", {
          ascending: false,
        });

      if (scriptsError) {
        throw scriptsError;
      }

      setScripts(data || []);

    } catch (err) {
      console.error(
        "Erreur chargement scripts :",
        err
      );

      setError(
        "Impossible de charger vos scripts."
      );
    } finally {
      setLoading(false);
    }
  };


  /* =======================================================
     INITIALISATION
  ======================================================= */

  useEffect(() => {
    loadScripts();

    /*
     * Si l'utilisateur se connecte ou se déconnecte,
     * on recharge automatiquement.
     */

    const {
      data: {
        subscription,
      },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          loadScripts();
        } else {
          setScripts([]);
          navigate("/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  /* =======================================================
     CREATE MODAL
  ======================================================= */

  const openCreateModal = () => {
    setEditingScript(null);

    setTitle("");
    setContent("");
    setCategory("Présentation");

    setError(null);

    setShowCreate(true);
  };


  /* =======================================================
     EDIT MODAL
  ======================================================= */

  const openEditModal = (
    script: Script
  ) => {
    setEditingScript(script);

    setTitle(script.title);
    setContent(script.content);
    setCategory(
      script.category || "Présentation"
    );

    setError(null);

    setShowCreate(true);

    setOpenMenu(null);
  };


  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    if (saving) return;

    setShowCreate(false);

    setTitle("");
    setContent("");
    setCategory("Présentation");

    setEditingScript(null);

    setError(null);
  };


  /* =======================================================
     SAVE / UPDATE
  ======================================================= */

  const handleSave = async () => {
    if (
      !title.trim() ||
      !content.trim()
    ) {
      setError(
        "Veuillez remplir le titre et le texte."
      );

      return;
    }

    try {
      setSaving(true);
      setError(null);

      /*
       * Vérifier l'utilisateur connecté
       */

      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }


      /* ===============================================
         MODIFICATION
      =============================================== */

      if (editingScript) {
        const {
          data,
          error: updateError,
        } = await supabase
          .from("scripts")
          .update({
            title: title.trim(),
            content: content.trim(),
            category,
            updated_at: new Date().toISOString(),
          })
          .eq(
            "id",
            editingScript.id
          )
          .eq(
            "user_id",
            user.id
          )
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        /*
         * Mise à jour immédiate de l'interface
         */

        setScripts((current) =>
          current.map((script) =>
            script.id === editingScript.id
              ? data
              : script
          )
        );

      }

      /* ===============================================
         CRÉATION
      =============================================== */

      else {
        const {
          data,
          error: insertError,
        } = await supabase
          .from("scripts")
          .insert({
            user_id: user.id,
            title: title.trim(),
            content: content.trim(),
            category,
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        /*
         * Ajouter le nouveau script en haut
         */

        setScripts((current) => [
          data,
          ...current,
        ]);
      }

      closeModal();

    } catch (err) {
      console.error(
        "Erreur sauvegarde script :",
        err
      );

      setError(
        "Impossible d'enregistrer le script."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =======================================================
     DELETE
  ======================================================= */

  const handleDelete = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Voulez-vous vraiment supprimer ce script ?"
      );

    if (!confirmed) return;

    try {
      setDeleting(id);
      setError(null);

      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const {
        error: deleteError,
      } = await supabase
        .from("scripts")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) {
        throw deleteError;
      }

      /*
       * Retirer immédiatement de l'interface
       */

      setScripts((current) =>
        current.filter(
          (script) =>
            script.id !== id
        )
      );

      setOpenMenu(null);

    } catch (err) {
      console.error(
        "Erreur suppression :",
        err
      );

      setError(
        "Impossible de supprimer ce script."
      );
    } finally {
      setDeleting(null);
    }
  };


  /* =======================================================
     TELEPROMPTER
  ======================================================= */

  const openTeleprompter = (
    script: Script
  ) => {
    /*
     * On garde le script courant pour la page
     * téléprompteur.
     *
     * Tu pourras ensuite également faire cette
     * page directement avec Supabase.
     */

    localStorage.setItem(
      "creatorflow_current_script",
      JSON.stringify(script)
    );

    navigate("/teleprompter");
  };


  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredScripts = useMemo(() => {
    const query =
      search
        .toLowerCase()
        .trim();

    if (!query) {
      return scripts;
    }

    return scripts.filter(
      (script) =>
        script.title
          .toLowerCase()
          .includes(query) ||
        script.content
          .toLowerCase()
          .includes(query) ||
        script.category
          ?.toLowerCase()
          .includes(query)
    );
  }, [
    scripts,
    search,
  ]);


  /* =======================================================
     STATISTICS
  ======================================================= */

  const totalWords = useMemo(() => {
    return scripts.reduce(
      (total, script) => {
        const words =
          script.content
            ?.trim()
            .split(/\s+/)
            .filter(Boolean)
            .length || 0;

        return total + words;
      },
      0
    );
  }, [scripts]);


  const scriptsThisWeek =
    useMemo(() => {
      const now =
        new Date();

      const sevenDaysAgo =
        new Date(
          now.getTime() -
            7 *
              24 *
              60 *
              60 *
              1000
        );

      return scripts.filter(
        (script) =>
          new Date(
            script.created_at
          ) >= sevenDaysAgo
      ).length;
    }, [scripts]);


  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (
    date: string
  ) => {
    const value =
      new Date(date);

    const now =
      new Date();

    const diff =
      now.getTime() -
      value.getTime();

    const minutes =
      Math.floor(
        diff / 60000
      );

    const hours =
      Math.floor(
        diff / 3600000
      );

    const days =
      Math.floor(
        diff / 86400000
      );

    if (minutes < 1) {
      return "à l'instant";
    }

    if (minutes < 60) {
      return `il y a ${minutes} min`;
    }

    if (hours < 24) {
      return `il y a ${hours} h`;
    }

    if (days === 1) {
      return "hier";
    }

    if (days < 7) {
      return `il y a ${days} jours`;
    }

    return value.toLocaleDateString(
      "fr-FR",
      {
        day: "numeric",
        month: "short",
      }
    );
  };


  /* =======================================================
     WORD COUNT
  ======================================================= */

  const wordCount =
    content.trim()
      ? content
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .length
      : 0;


  const estimatedMinutes =
    Math.max(
      1,
      Math.ceil(
        wordCount / 130
      )
    );


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9fd]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#eeeaf2] border-t-[#7041e8]" />

          <p className="mt-4 text-xs text-[#817a89]">
            Chargement de vos scripts...
          </p>
        </div>
      </div>
    );
  }


  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#faf9fd] text-[#17131f]">

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="sticky top-0 z-40 border-b border-[#eeeaf2]/80 bg-[#faf9fd]/85 backdrop-blur-2xl">

        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <Link
              to="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#e9e3f0] bg-white text-[#615b69] shadow-[0_3px_12px_rgba(40,25,60,0.03)] transition-all hover:-translate-x-0.5 hover:border-[#ddd4e9] hover:text-[#7041e8]"
            >
              <ArrowLeft size={17} />
            </Link>

            <div>
              <h1 className="text-sm font-bold tracking-tight">
                Mes scripts
              </h1>

              <p className="hidden text-[10px] text-[#aaa3b1] sm:block">
                Votre bibliothèque de contenu
              </p>
            </div>

          </div>


          <button
            type="button"
            onClick={openCreateModal}
            className="flex h-10 items-center gap-2 rounded-2xl bg-[#17131f] px-3.5 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(23,19,31,0.12)] transition-all hover:-translate-y-0.5 hover:bg-[#2b2632] active:scale-95"
          >
            <Plus
              size={15}
              strokeWidth={2.3}
            />

            <span className="hidden sm:inline">
              Nouveau script
            </span>

            <span className="sm:hidden">
              Nouveau
            </span>
          </button>

        </div>
      </header>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-8 sm:px-6 lg:px-8">

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-600">
            {error}
          </div>
        )}


        {/* INTRO */}

        <section>

          <div className="flex items-center gap-2">

            <span className="h-1.5 w-1.5 rounded-full bg-[#7041e8]" />

            <span className="text-[10px] font-bold tracking-[0.16em] text-[#7041e8]">
              BIBLIOTHÈQUE
            </span>

          </div>


          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <h2 className="text-[30px] font-bold tracking-[-0.04em] sm:text-[36px]">
                Vos scripts
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-[#817a89]">
                Écrivez, organisez et préparez vos textes avant de passer devant la caméra.
              </p>

            </div>


            <div className="hidden rounded-full border border-[#e8e2ef] bg-white px-3 py-1.5 text-[10px] font-medium text-[#817a89] sm:block">

              {scripts.length} script
              {scripts.length > 1
                ? "s"
                : ""}

            </div>

          </div>

        </section>


        {/* SEARCH */}

        <section className="mt-7">

          <div className="relative">

            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaa3b1]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Rechercher dans vos scripts..."
              className="h-[50px] w-full rounded-2xl border border-[#e7e1ed] bg-white pl-11 pr-4 text-sm shadow-[0_4px_18px_rgba(40,25,60,0.025)] outline-none transition-all placeholder:text-[#b6afbd] focus:border-[#bda9e9] focus:ring-4 focus:ring-[#7041e8]/5"
            />


            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#f3eff6] text-[#817a89]"
              >
                <X size={13} />
              </button>
            )}

          </div>

        </section>


        {/* STATS */}

        <section className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">

          <StatCard
            icon={FileText}
            label="SCRIPTS"
            value={scripts.length}
          />

          <StatCard
            icon={Clock3}
            label="CETTE SEMAINE"
            value={scriptsThisWeek}
          />

          <StatCard
            icon={Play}
            label="MOTS"
            value={totalWords}
          />

        </section>


        {/* SCRIPT HEADER */}

        <section className="mt-9">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h3 className="text-base font-bold tracking-tight">
                Tous vos scripts
              </h3>

              <p className="mt-0.5 text-[10px] text-[#aaa3b1]">
                Retrouvez ici tous vos contenus
              </p>

            </div>


            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-[#aaa3b1]">
              {filteredScripts.length} résultat
              {filteredScripts.length > 1
                ? "s"
                : ""}
            </span>

          </div>


          {/* EMPTY */}

          {filteredScripts.length === 0 ? (

            <div className="rounded-[28px] border border-dashed border-[#ddd5e8] bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#f0eaff] text-[#7041e8]">
                <FileText size={25} />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                {search
                  ? "Aucun script trouvé"
                  : "Aucun script pour le moment"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#817a89]">
                {search
                  ? "Essayez avec un autre terme de recherche."
                  : "Créez votre premier script pour commencer votre bibliothèque."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={
                    openCreateModal
                  }
                  className="mt-6 rounded-xl bg-[#17131f] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#2b2632]"
                >
                  Créer mon premier script
                </button>
              )}

            </div>

          ) : (

            <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">

              {filteredScripts.map(
                (script) => (
                  <ScriptCard
                    key={script.id}
                    script={script}
                    openMenu={
                      openMenu
                    }
                    setOpenMenu={
                      setOpenMenu
                    }
                    onEdit={
                      openEditModal
                    }
                    onDelete={
                      handleDelete
                    }
                    onTeleprompter={
                      openTeleprompter
                    }
                    deleting={
                      deleting ===
                      script.id
                    }
                    formatDate={
                      formatDate
                    }
                  />
                )
              )}

            </div>

          )}

        </section>

      </main>


      {/* ===================================================
          MODAL
      =================================================== */}

      {showCreate && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17131f]/35 px-4 py-6 backdrop-blur-md"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[30px] border border-white/70 bg-white p-5 shadow-[0_30px_100px_rgba(30,15,50,0.20)] sm:p-7">

            {/* HEADER */}

            <div className="flex items-start justify-between gap-5">

              <div>

                <div className="flex items-center gap-2">

                  <Sparkles
                    size={13}
                    className="text-[#7041e8]"
                  />

                  <p className="text-[10px] font-bold tracking-[0.14em] text-[#7041e8]">
                    {editingScript
                      ? "MODIFICATION"
                      : "NOUVEAU SCRIPT"}
                  </p>

                </div>

                <h2 className="mt-1 text-2xl font-bold tracking-tight">
                  {editingScript
                    ? "Modifier votre script"
                    : "Créer un nouveau script"}
                </h2>

                <p className="mt-1 text-xs text-[#817a89]">
                  Préparez votre texte avant de passer au téléprompteur.
                </p>

              </div>


              <button
                type="button"
                onClick={
                  closeModal
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5f2f8] text-[#817a89] transition hover:bg-[#eee9f3]"
              >
                <X size={16} />
              </button>

            </div>


            {/* TITLE */}

            <div className="mt-7">

              <label className="mb-2 block text-[11px] font-bold text-[#4d4655]">
                Titre du script
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="Ex : Ma prochaine vidéo TikTok"
                className="h-12 w-full rounded-2xl border border-[#e5dfea] bg-[#fcfbfd] px-4 text-sm outline-none transition focus:border-[#7041e8] focus:bg-white focus:ring-4 focus:ring-[#7041e8]/5"
              />

            </div>


            {/* CATEGORY */}

            <div className="mt-5">

              <label className="mb-2 block text-[11px] font-bold text-[#4d4655]">
                Catégorie
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                className="h-12 w-full rounded-2xl border border-[#e5dfea] bg-[#fcfbfd] px-4 text-sm outline-none transition focus:border-[#7041e8] focus:bg-white focus:ring-4 focus:ring-[#7041e8]/5"
              >
                <option>
                  Présentation
                </option>

                <option>
                  TikTok
                </option>

                <option>
                  YouTube
                </option>

                <option>
                  Éducation
                </option>

                <option>
                  Marketing
                </option>

                <option>
                  Storytelling
                </option>

                <option>
                  Autre
                </option>
              </select>

            </div>


            {/* CONTENT */}

            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between">

                <label className="text-[11px] font-bold text-[#4d4655]">
                  Votre texte
                </label>

                <span className="text-[10px] text-[#aaa3b1]">
                  {wordCount} mots · ~
                  {estimatedMinutes} min
                </span>

              </div>


              <textarea
                value={content}
                onChange={(event) =>
                  setContent(
                    event.target.value
                  )
                }
                placeholder="Écrivez ici le texte que vous allez lire pendant votre vidéo..."
                className="min-h-[280px] w-full resize-y rounded-[20px] border border-[#e5dfea] bg-[#fcfbfd] p-4 text-sm leading-6 outline-none transition focus:border-[#7041e8] focus:bg-white focus:ring-4 focus:ring-[#7041e8]/5"
              />

            </div>


            {/* AI */}

            <div className="mt-4 overflow-hidden rounded-[22px] border border-[#e7ddfa] bg-[#faf7ff]">

              <div className="flex items-start gap-3 p-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#7041e8] shadow-sm">
                  <Sparkles size={15} />
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <p className="text-xs font-bold">
                      Assistant IA
                    </p>

                    <span className="rounded-full bg-[#eee8ff] px-2 py-0.5 text-[8px] font-bold text-[#7041e8]">
                      BIENTÔT
                    </span>

                  </div>

                  <p className="mt-1 text-[10px] leading-4 text-[#817a89]">
                    Transformez une simple idée en script structuré, naturel et prêt pour le téléprompteur.
                  </p>

                </div>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={saving}
                className="rounded-xl px-5 py-3 text-xs font-semibold text-[#817a89] transition hover:bg-[#f7f4fa] disabled:opacity-40"
              >
                Annuler
              </button>


              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={
                  saving ||
                  !title.trim() ||
                  !content.trim()
                }
                className="rounded-xl bg-[#17131f] px-6 py-3 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(23,19,31,0.12)] transition hover:-translate-y-0.5 hover:bg-[#2b2632] disabled:cursor-not-allowed disabled:opacity-35"
              >
                {saving
                  ? "Enregistrement..."
                  : editingScript
                  ? "Enregistrer"
                  : "Créer le script"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[20px] border border-[#e9e3f1] bg-white p-3.5 shadow-[0_4px_18px_rgba(40,25,60,0.025)] transition hover:-translate-y-0.5">

      <div className="flex items-center gap-1.5 text-[#7041e8]">

        <Icon size={14} />

        <span className="text-[8px] font-bold tracking-[0.08em] sm:text-[9px]">
          {label}
        </span>

      </div>

      <p className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
        {value.toLocaleString("fr-FR")}
      </p>

    </div>
  );
}


/* =========================================================
   SCRIPT CARD
========================================================= */

function ScriptCard({
  script,
  openMenu,
  setOpenMenu,
  onEdit,
  onDelete,
  onTeleprompter,
  deleting,
  formatDate,
}: {
  script: Script;

  openMenu: string | null;

  setOpenMenu: React.Dispatch<
    React.SetStateAction<string | null>
  >;

  onEdit: (
    script: Script
  ) => void;

  onDelete: (
    id: string
  ) => void;

  onTeleprompter: (
    script: Script
  ) => void;

  deleting: boolean;

  formatDate: (
    date: string
  ) => string;
}) {

  const words =
    script.content
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .length || 0;

  const minutes =
    Math.max(
      1,
      Math.ceil(
        words / 130
      )
    );


  return (
    <article className="group relative rounded-[25px] border border-[#e9e3f1] bg-white p-4.5 shadow-[0_6px_25px_rgba(50,35,70,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#ded5e9] hover:shadow-[0_16px_35px_rgba(50,35,70,0.07)]">

      {/* TOP */}

      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#f0eaff] text-[#7041e8] transition duration-300 group-hover:scale-105">

            <FileText size={17} />

          </div>


          <div className="min-w-0">

            <h4 className="truncate text-sm font-bold tracking-tight">
              {script.title}
            </h4>

            <p className="mt-1 text-[9px] text-[#aaa3b1]">
              Modifié{" "}
              {formatDate(
                script.updated_at
              )}
            </p>

          </div>

        </div>


        {/* MENU */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setOpenMenu(
                openMenu ===
                  script.id
                  ? null
                  : script.id
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[#aaa3b1] transition hover:bg-[#f5f2f8] hover:text-[#7041e8]"
          >
            <MoreVertical size={16} />
          </button>


          {openMenu === script.id && (

            <div className="absolute right-0 top-9 z-30 w-40 overflow-hidden rounded-2xl border border-[#e9e3f1] bg-white p-1.5 shadow-[0_18px_45px_rgba(40,25,60,0.13)]">

              <button
                type="button"
                onClick={() =>
                  onEdit(
                    script
                  )
                }
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs text-[#4d4655] transition hover:bg-[#f7f4fb]"
              >
                <Edit3 size={13} />
                Modifier
              </button>


              <button
                type="button"
                onClick={() =>
                  onDelete(
                    script.id
                  )
                }
                disabled={
                  deleting
                }
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs text-red-500 transition hover:bg-red-50 disabled:opacity-40"
              >
                <Trash2 size={13} />

                {deleting
                  ? "Suppression..."
                  : "Supprimer"}
              </button>

            </div>

          )}

        </div>

      </div>


      {/* CATEGORY */}

      <div className="mt-4">

        <span className="rounded-full bg-[#f5f1fa] px-2.5 py-1 text-[9px] font-medium text-[#7041e8]">
          {script.category ||
            "Présentation"}
        </span>

      </div>


      {/* PREVIEW */}

      <div className="mt-4">

        <p className="line-clamp-3 min-h-[60px] text-xs leading-5 text-[#817a89]">
          {script.content}
        </p>

      </div>


      {/* FOOTER */}

      <div className="mt-5 flex items-center justify-between border-t border-[#f0ebf4] pt-4">

        <div className="flex items-center gap-1.5 text-[9px] text-[#aaa3b1]">

          <Clock3 size={11} />

          <span>
            {minutes} min
          </span>

          <span>
            ·
          </span>

          <span>
            {words} mots
          </span>

        </div>


        <button
          type="button"
          onClick={() =>
            onTeleprompter(
              script
            )
          }
          className="flex items-center gap-1.5 rounded-xl bg-[#f0eaff] px-3 py-2 text-[9px] font-bold text-[#7041e8] transition-all hover:bg-[#7041e8] hover:text-white active:scale-95"
        >

          <Play
            size={11}
            fill="currentColor"
          />

          Téléprompteur

        </button>

      </div>

    </article>
  );
}