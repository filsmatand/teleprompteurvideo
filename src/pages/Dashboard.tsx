import {
  FileText,
  Plus,
  Play,
  MoreHorizontal,
  Clock3,
  Search,
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { supabase } from "../lib/supabase";

/* ================================================= */
/* TYPES */
/* ================================================= */

interface Script {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/* ================================================= */
/* DASHBOARD */
/* ================================================= */

export default function Dashboard() {
  const navigate = useNavigate();

  /* ================================================= */
  /* STATE */
  /* ================================================= */

  const [scripts, setScripts] = useState<Script[]>([]);

  const [username, setUsername] =
    useState("Utilisateur");

  const [search, setSearch] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* ================================================= */
  /* LOAD DATA */
  /* ================================================= */

  useEffect(() => {
    loadDashboard();

    /*
      Écoute les changements d'authentification.
      Si l'utilisateur se connecte / déconnecte,
      le Dashboard se met à jour.
    */

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          loadDashboard();
        }

        if (event === "SIGNED_OUT") {
          setScripts([]);
          setUsername("Utilisateur");
          navigate("/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  /* ================================================= */
  /* LOAD DASHBOARD */
  /* ================================================= */

  const loadDashboard = async () => {
    setIsLoading(true);
    setError("");

    try {
      /* --------------------------------------------- */
      /* AUTH USER */
      /* --------------------------------------------- */

      const {
        data: {
          user,
        },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      /* --------------------------------------------- */
      /* NO USER */
      /* --------------------------------------------- */

      if (!user) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      /* --------------------------------------------- */
      /* PROFILE */
      /* --------------------------------------------- */

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(
          "Erreur profile :",
          profileError
        );
      }

      /* --------------------------------------------- */
      /* USERNAME */
      /* --------------------------------------------- */

      const finalUsername =
        profile?.username ||
        user.user_metadata?.username ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Utilisateur";

      setUsername(finalUsername);

      /* --------------------------------------------- */
      /* SCRIPTS */
      /* --------------------------------------------- */

      const {
        data: scriptData,
        error: scriptsError,
      } = await supabase
        .from("scripts")
        .select(
          "id, title, content, created_at, updated_at"
        )
        .eq("user_id", user.id)
        .order(
          "updated_at",
          {
            ascending: false,
          }
        );

      if (scriptsError) {
        throw scriptsError;
      }

      setScripts(scriptData || []);

    } catch (err: any) {
      console.error(
        "Erreur Dashboard :",
        err
      );

      setError(
        err?.message ||
          "Impossible de charger vos scripts."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ================================================= */
  /* SEARCH */
  /* ================================================= */

  const filteredScripts = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return scripts;
    }

    return scripts.filter((script) => {
      return (
        script.title
          .toLowerCase()
          .includes(value) ||
        script.content
          .toLowerCase()
          .includes(value)
      );
    });
  }, [scripts, search]);

  /* ================================================= */
  /* CREATE SCRIPT */
  /* ================================================= */

  const createScript = () => {
    navigate("/script/new");
  };

  /* ================================================= */
  /* OPEN SCRIPT */
  /* ================================================= */

  const openScript = (
    id: string
  ) => {
    navigate(`/script/${id}`);
  };

  /* ================================================= */
  /* PROFILE */
  /* ================================================= */

  const openProfile = () => {
    navigate("/profile");
  };

  /* ================================================= */
  /* AVATAR */
  /* ================================================= */

  const avatarLetter =
    username
      ?.charAt(0)
      ?.toUpperCase() || "U";

  /* ================================================= */
  /* RENDER */
  /* ================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-[#EAEFF2]
        px-4
        py-6
        font-sans
        sm:px-6
        lg:px-10
      "
    >

      <div className="mx-auto max-w-5xl">

        {/* ======================================== */}
        {/* HEADER */}
        {/* ======================================== */}

        <header
          className="
            mb-8
            flex
            items-center
            justify-between
          "
        >

          <div>

            {/* LOGO */}

            <div className="mb-3 flex items-center">

              <img
                src="/images/logo.png"
                alt="LunaCreator"
                className="
                  h-8
                  w-auto
                  object-contain
                "
              />

            </div>

            {/* TITLE */}

            <h1
              className="
                text-2xl
                font-medium
                tracking-tight
                text-[#171717]
                sm:text-3xl
              "
            >
              Tes scripts
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-[#777777]
              "
            >
              Prépare tes textes et lance ton
              enregistrement.
            </p>

          </div>

          {/* PROFILE */}

          <button
            type="button"
            onClick={openProfile}
            title={`Profil de ${username}`}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
              text-xs
              font-semibold
              text-[#171717]
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:shadow-md
            "
          >
            {avatarLetter}
          </button>

        </header>

        {/* ======================================== */}
        {/* CREATE SCRIPT */}
        {/* ======================================== */}

        <section className="mb-8">

          <button
            type="button"
            onClick={createScript}
            className="
              group
              flex
              w-full
              items-center
              justify-between
              overflow-hidden
              rounded-[28px]
              bg-[#050505]
              p-6
              text-left
              text-white
              shadow-[0_15px_35px_rgba(0,0,0,0.12)]
              transition
              hover:-translate-y-0.5
              hover:shadow-[0_20px_40px_rgba(0,0,0,0.16)]
              sm:p-7
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white/10
                "
              >
                <Plus size={22} />
              </div>

              <div>

                <h2 className="text-lg font-medium">
                  Créer un script
                </h2>

                <p className="mt-1 text-sm text-white/55">
                  Écris ton texte et prépare ton
                  enregistrement.
                </p>

              </div>

            </div>

            <div
              className="
                hidden
                rounded-full
                bg-white
                px-5
                py-2.5
                text-xs
                font-medium
                text-[#050505]
                transition
                group-hover:px-6
                sm:block
              "
            >
              Nouveau script
            </div>

          </button>

        </section>

        {/* ======================================== */}
        {/* SEARCH */}
        {/* ======================================== */}

        <div className="mb-6 flex items-center gap-3">

          <div className="relative flex-1">

            <Search
              size={17}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#999999]
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Rechercher un script..."
              className="
                h-12
                w-full
                rounded-2xl
                border
                border-black/[0.04]
                bg-white
                pl-11
                pr-4
                text-sm
                text-[#171717]
                outline-none
                placeholder:text-[#AAAAAA]
                focus:border-black/10
              "
            />

          </div>

        </div>

        {/* ======================================== */}
        {/* SCRIPTS */}
        {/* ======================================== */}

        <section>

          <div
            className="
              mb-4
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h2
                className="
                  text-base
                  font-medium
                  text-[#171717]
                "
              >
                Mes scripts
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-[#888888]
                "
              >
                {search
                  ? `${filteredScripts.length} résultat${
                      filteredScripts.length > 1
                        ? "s"
                        : ""
                    }`
                  : `${scripts.length} script${
                      scripts.length > 1
                        ? "s"
                        : ""
                    }`}
              </p>

            </div>

          </div>

          {/* ====================================== */}
          {/* LOADING */}
          {/* ====================================== */}

          {isLoading && (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                rounded-[28px]
                bg-[#F9FAFE]
                px-6
                py-16
              "
            >

              <Loader2
                size={25}
                className="
                  animate-spin
                  text-[#55514A]
                "
              />

              <p
                className="
                  mt-4
                  text-xs
                  text-[#888888]
                "
              >
                Chargement de tes scripts...
              </p>

            </div>
          )}

          {/* ====================================== */}
          {/* ERROR */}
          {/* ====================================== */}

          {!isLoading && error && (
            <div
              className="
                rounded-[28px]
                border
                border-red-100
                bg-red-50
                px-6
                py-8
                text-center
              "
            >

              <p
                className="
                  text-sm
                  font-medium
                  text-red-600
                "
              >
                Impossible de charger tes scripts.
              </p>

              <p
                className="
                  mt-2
                  text-xs
                  text-red-400
                "
              >
                {error}
              </p>

              <button
                type="button"
                onClick={loadDashboard}
                className="
                  mt-5
                  rounded-full
                  bg-black
                  px-5
                  py-2.5
                  text-xs
                  font-medium
                  text-white
                "
              >
                Réessayer
              </button>

            </div>
          )}

          {/* ====================================== */}
          {/* SCRIPT LIST */}
          {/* ====================================== */}

          {!isLoading &&
            !error &&
            filteredScripts.length > 0 && (
              <div className="space-y-3">

                {filteredScripts.map(
                  (script) => (

                    <button
                      key={script.id}
                      type="button"
                      onClick={() =>
                        openScript(
                          script.id
                        )
                      }
                      className="
                        group
                        flex
                        w-full
                        items-center
                        gap-4
                        rounded-[24px]
                        border
                        border-black/[0.035]
                        bg-[#F9FAFE]
                        p-4
                        text-left
                        transition
                        hover:-translate-y-0.5
                        hover:bg-white
                        hover:shadow-[0_10px_30px_rgba(40,50,60,0.07)]
                        sm:p-5
                      "
                    >

                      {/* ICON */}

                      <div
                        className="
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          bg-[#E8E5DE]
                          text-[#55514A]
                        "
                      >
                        <FileText
                          size={20}
                        />
                      </div>

                      {/* CONTENT */}

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <h3
                            className="
                              truncate
                              text-sm
                              font-medium
                              text-[#171717]
                            "
                          >
                            {script.title}
                          </h3>

                        </div>

                        <p
                          className="
                            mt-1
                            truncate
                            text-xs
                            leading-5
                            text-[#888888]
                          "
                        >
                          {getPreview(
                            script.content
                          )}
                        </p>

                        <div
                          className="
                            mt-2
                            flex
                            items-center
                            gap-3
                            text-[11px]
                            text-[#AAAAAA]
                          "
                        >

                          <span
                            className="
                              flex
                              items-center
                              gap-1
                            "
                          >
                            <Clock3 size={12} />

                            {formatRelativeDate(
                              script.updated_at
                            )}
                          </span>

                          <span>
                            {calculateDuration(
                              script.content
                            )}
                          </span>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >

                        {/* RECORD */}

                        <div
                          className="
                            hidden
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-[#050505]
                            text-white
                            transition
                            group-hover:scale-105
                            sm:flex
                          "
                          title="Enregistrer"
                        >
                          <Play
                            size={15}
                            fill="currentColor"
                          />
                        </div>

                        <MoreHorizontal
                          size={19}
                          className="text-[#AAAAAA]"
                        />

                      </div>

                    </button>

                  )
                )}

              </div>
            )}

          {/* ====================================== */}
          {/* EMPTY STATE */}
          {/* ====================================== */}

          {!isLoading &&
            !error &&
            filteredScripts.length === 0 && (

              <div
                className="
                  rounded-[28px]
                  bg-[#F9FAFE]
                  px-6
                  py-16
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#E8E5DE]
                    text-[#55514A]
                  "
                >
                  <FileText size={23} />
                </div>

                <h3
                  className="
                    mt-5
                    text-base
                    font-medium
                    text-[#171717]
                  "
                >
                  {search
                    ? "Aucun script trouvé"
                    : "Aucun script pour le moment"}
                </h3>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-sm
                    text-sm
                    leading-6
                    text-[#888888]
                  "
                >
                  {search
                    ? "Essaie avec un autre titre ou un autre mot-clé."
                    : "Crée ton premier script et prépare ta prochaine vidéo avec LunaCreator."}
                </p>

                {!search && (
                  <button
                    type="button"
                    onClick={createScript}
                    className="
                      mt-6
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-[#050505]
                      px-6
                      py-3
                      text-xs
                      font-medium
                      text-white
                      transition
                      hover:scale-[1.02]
                      active:scale-95
                    "
                  >
                    <Plus size={15} />
                    Créer mon premier script
                  </button>
                )}

              </div>

            )}

        </section>

      </div>

    </div>
  );
}

/* ================================================= */
/* PREVIEW */
/* ================================================= */

function getPreview(
  content: string
) {
  if (!content) {
    return "Aucun contenu pour ce script.";
  }

  const cleanContent =
    content
      .replace(/\s+/g, " ")
      .trim();

  if (cleanContent.length <= 90) {
    return cleanContent;
  }

  return (
    cleanContent.substring(0, 90) +
    "..."
  );
}

/* ================================================= */
/* DURATION */
/* ================================================= */

function calculateDuration(
  content: string
) {
  if (!content) {
    return "0 min";
  }

  const words =
    content
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .length;

  /*
    Estimation :
    environ 130 mots/minute
    pour une lecture naturelle.
  */

  const minutes =
    Math.max(
      1,
      Math.ceil(words / 130)
    );

  return `${minutes} min`;
}

/* ================================================= */
/* DATE */
/* ================================================= */

function formatRelativeDate(
  dateString: string
) {
  const date =
    new Date(dateString);

  const now =
    new Date();

  const diff =
    now.getTime() -
    date.getTime();

  const minutes =
    Math.floor(
      diff / (1000 * 60)
    );

  const hours =
    Math.floor(
      diff / (1000 * 60 * 60)
    );

  const days =
    Math.floor(
      diff / (1000 * 60 * 60 * 24)
    );

  if (minutes < 1) {
    return "À l'instant";
  }

  if (minutes < 60) {
    return `Il y a ${minutes} min`;
  }

  if (hours < 24) {
    return `Il y a ${hours} h`;
  }

  if (days === 1) {
    return "Hier";
  }

  if (days < 7) {
    return `Il y a ${days} jours`;
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      day: "numeric",
      month: "short",
    }
  ).format(date);
}