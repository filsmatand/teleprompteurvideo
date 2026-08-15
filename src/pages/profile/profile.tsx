import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CircleHelp,
  FileText,
  Info,
  LogOut,
  Palette,
  Play,
  Settings,
  Shield,
  User,
  Video,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../lib/supabase";

/* ================================================= */
/* TYPES */
/* ================================================= */

interface UserProfile {
  id: string;
  username: string;
  email: string;
  mobile: string;
  role: string;
  createdAt: string | null;
}

interface ProfileItemProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  onClick?: () => void;
  danger?: boolean;
}

interface SectionTitleProps {
  eyebrow: string;
  title: string;
}

/* ================================================= */
/* PROFILE */
/* ================================================= */

export default function Profile() {
  const navigate = useNavigate();

  /* --------------------------------------------- */
  /* USER */
  /* --------------------------------------------- */

  const [user, setUser] = useState<UserProfile | null>(null);

  /* --------------------------------------------- */
  /* LOADING */
  /* --------------------------------------------- */

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  /* --------------------------------------------- */
  /* STATS */
  /* --------------------------------------------- */

  const [scriptCount, setScriptCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  /* --------------------------------------------- */
  /* SETTINGS */
  /* --------------------------------------------- */

  const [notifications, setNotifications] =
    useState<boolean>(true);

  const [showLogout, setShowLogout] =
    useState<boolean>(false);

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  /* ================================================= */
  /* LOAD USER */
  /* ================================================= */

  useEffect(() => {
    loadProfile();
  }, []);

  /* ================================================= */
  /* LOAD PROFILE FROM SUPABASE */
  /* ================================================= */

  const loadProfile = async () => {
    setIsLoading(true);
    setError("");

    try {
      /* ------------------------------------------- */
      /* AUTH USER */
      /* ------------------------------------------- */

      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      /* ------------------------------------------- */
      /* NO USER */
      /* ------------------------------------------- */

      if (!authUser) {
        navigate("/login", { replace: true });
        return;
      }

      /* ------------------------------------------- */
      /* PROFILE */
      /* ------------------------------------------- */

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(
          "id, username, mobile, created_at"
        )
        .eq("id", authUser.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      /* ------------------------------------------- */
      /* METADATA */
      /* ------------------------------------------- */

      const metadata =
        authUser.user_metadata || {};

      const username =
        profile?.username ||
        metadata.username ||
        metadata.full_name ||
        metadata.name ||
        authUser.email?.split("@")[0] ||
        "Utilisateur";

      const mobile =
        profile?.mobile ||
        metadata.mobile ||
        "";

      /* ------------------------------------------- */
      /* ROLE */
      /* ------------------------------------------- */

      const role =
        metadata.role ||
        "Créateur de contenu";

      /* ------------------------------------------- */
      /* SET USER */
      /* ------------------------------------------- */

      setUser({
        id: authUser.id,

        username,

        email:
          authUser.email || "",

        mobile,

        role,

        createdAt:
          profile?.created_at ||
          authUser.created_at ||
          null,
      });

      /* ------------------------------------------- */
      /* LOAD LOCAL STATS */
      /* ------------------------------------------- */

      loadLocalStats();

    } catch (err: any) {
      console.error(
        "Erreur lors du chargement du profil :",
        err
      );

      setError(
        err?.message ||
          "Impossible de charger votre profil."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ================================================= */
  /* LOCAL STATS */
  /* ================================================= */

  const loadLocalStats = () => {
    /* ------------------------------------------- */
    /* SCRIPTS */
    /* ------------------------------------------- */

    const savedScripts =
      localStorage.getItem(
        "creatorflow_scripts"
      );

    if (savedScripts) {
      try {
        const scripts = JSON.parse(
          savedScripts
        );

        if (Array.isArray(scripts)) {
          setScriptCount(scripts.length);
        }
      } catch (error) {
        console.error(
          "Erreur scripts :",
          error
        );
      }
    }

    /* ------------------------------------------- */
    /* VIDEOS */
    /* ------------------------------------------- */

    const savedVideos =
      localStorage.getItem(
        "creatorflow_videos"
      );

    if (savedVideos) {
      try {
        const videos = JSON.parse(
          savedVideos
        );

        if (Array.isArray(videos)) {
          setVideoCount(videos.length);
        }
      } catch (error) {
        console.error(
          "Erreur vidéos :",
          error
        );
      }
    }

    /* ------------------------------------------- */
    /* SESSIONS */
    /* ------------------------------------------- */

    const savedSessions =
      localStorage.getItem(
        "creatorflow_sessions"
      );

    if (savedSessions) {
      try {
        const sessions = JSON.parse(
          savedSessions
        );

        if (Array.isArray(sessions)) {
          setSessionCount(
            sessions.length
          );
        }
      } catch (error) {
        console.error(
          "Erreur sessions :",
          error
        );
      }
    }
  };

  /* ================================================= */
  /* AVATAR */
  /* ================================================= */

  const avatarLetter =
    user?.username
      ?.charAt(0)
      ?.toUpperCase() || "U";

  /* ================================================= */
  /* FORMAT DATE */
  /* ================================================= */

  const formatDate = (
    date: string | null
  ) => {
    if (!date) {
      return "";
    }

    try {
      return new Intl.DateTimeFormat(
        "fr-FR",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      ).format(new Date(date));
    } catch {
      return "";
    }
  };

  /* ================================================= */
  /* LOGOUT */
  /* ================================================= */

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const {
        error: logoutError,
      } = await supabase.auth.signOut();

      if (logoutError) {
        throw logoutError;
      }

      localStorage.removeItem(
        "creatorflow_current_script"
      );

      navigate("/login", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Erreur déconnexion :",
        error
      );

      setIsLoggingOut(false);
    }
  };

  /* ================================================= */
  /* NAVIGATION */
  /* ================================================= */

  const goTo = (path: string) => {
    navigate(path);
  };

  /* ================================================= */
  /* LOADING SCREEN */
  /* ================================================= */

  if (isLoading) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f5f5f5]
          flex
          items-center
          justify-center
        "
      >
        <div className="text-center">

          <div
            className="
              mx-auto
              h-10
              w-10
              rounded-full
              border-2
              border-gray-200
              border-t-black
              animate-spin
            "
          />

          <p
            className="
              mt-4
              text-xs
              text-gray-400
            "
          >
            Chargement du profil...
          </p>

        </div>
      </div>
    );
  }

  /* ================================================= */
  /* ERROR SCREEN */
  /* ================================================= */

  if (error && !user) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f5f5f5]
          flex
          items-center
          justify-center
          px-5
        "
      >
        <div
          className="
            w-full
            max-w-sm
            rounded-[28px]
            bg-white
            p-7
            text-center
            shadow-xl
          "
        >

          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-red-50
              text-red-500
            "
          >
            <Info size={20} />
          </div>

          <h2
            className="
              mt-4
              text-lg
              font-bold
            "
          >
            Impossible de charger le profil
          </h2>

          <p
            className="
              mt-2
              text-xs
              leading-5
              text-gray-400
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={loadProfile}
            className="
              mt-6
              w-full
              rounded-[18px]
              bg-black
              py-3
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-gray-800
            "
          >
            Réessayer
          </button>

        </div>
      </div>
    );
  }

  /* ================================================= */
  /* RENDER */
  /* ================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-[#f5f5f5]
        text-[#151515]
      "
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header
        className="
          sticky
          top-0
          z-40
          border-b
          border-black/[0.05]
          bg-[#f5f5f5]/85
          backdrop-blur-2xl
        "
      >

        <div
          className="
            mx-auto
            flex
            h-[70px]
            max-w-3xl
            items-center
            justify-between
            px-4
            sm:px-6
          "
        >

          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            aria-label="Retour"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-black/[0.07]
              bg-white
              text-gray-500
              shadow-sm
              transition-all
              duration-200
              hover:-translate-x-0.5
              hover:text-black
              active:scale-95
            "
          >
            <ArrowLeft size={18} />
          </button>

          {/* TITLE */}

          <div className="text-center">

            <h1
              className="
                text-sm
                font-semibold
                tracking-tight
              "
            >
              Profil
            </h1>

            <p className="text-[10px] text-gray-400">
              Votre espace personnel
            </p>

          </div>

          {/* SETTINGS */}

          <button
            type="button"
            onClick={() =>
              goTo("/profile/edit")
            }
            aria-label="Paramètres"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-black/[0.07]
              bg-white
              text-gray-500
              shadow-sm
              transition-all
              duration-300
              hover:rotate-45
              hover:text-black
            "
          >
            <Settings size={17} />
          </button>

        </div>

      </header>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main
        className="
          mx-auto
          max-w-3xl
          px-4
          pb-32
          pt-8
          sm:px-6
          sm:pt-10
        "
      >

        {/* ================================================= */}
        {/* PROFILE HERO */}
        {/* ================================================= */}

        <section className="text-center">

          {/* AVATAR */}

          <div className="relative mx-auto w-fit">

            <div
              className="
                flex
                h-[88px]
                w-[88px]
                items-center
                justify-center
                rounded-full
                bg-black
                text-3xl
                font-bold
                text-white
                shadow-[0_15px_35px_rgba(0,0,0,0.15)]
                ring-8
                ring-white
              "
            >
              {avatarLetter}
            </div>

            {/* ONLINE */}

            <span
              className="
                absolute
                bottom-1
                right-1
                h-5
                w-5
                rounded-full
                border-[3px]
                border-[#f5f5f5]
                bg-emerald-500
              "
            />

          </div>

          {/* NAME */}

          <h2
            className="
              mt-5
              text-2xl
              font-bold
              tracking-[-0.03em]
            "
          >
            {user?.username}
          </h2>

          {/* EMAIL */}

          <p
            className="
              mt-1
              text-xs
              text-gray-400
            "
          >
            {user?.email}
          </p>

          {/* MOBILE */}

          {user?.mobile && (
            <p
              className="
                mt-1
                text-xs
                text-gray-400
              "
            >
              {user.mobile}
            </p>
          )}

          {/* ROLE */}

          <div
            className="
              mx-auto
              mt-4
              w-fit
              rounded-full
              bg-[#7041e8]/[0.08]
              px-3
              py-1.5
              text-[10px]
              font-semibold
              text-[#7041e8]
            "
          >
            {user?.role}
          </div>

          {/* DATE */}

          {user?.createdAt && (
            <p
              className="
                mt-3
                text-[9px]
                text-gray-300
              "
            >
              Membre depuis le{" "}
              {formatDate(
                user.createdAt
              )}
            </p>
          )}

        </section>

        {/* ================================================= */}
        {/* STATISTICS */}
        {/* ================================================= */}

        <section
          className="
            mt-8
            grid
            grid-cols-3
            overflow-hidden
            rounded-[24px]
            border
            border-black/[0.06]
            bg-white
            shadow-[0_10px_35px_rgba(0,0,0,0.04)]
          "
        >

          <StatItem
            icon={<FileText size={16} />}
            value={scriptCount}
            label="Scripts"
          />

          <StatItem
            icon={<Video size={16} />}
            value={videoCount}
            label="Vidéos"
          />

          <StatItem
            icon={<Play size={16} />}
            value={sessionCount}
            label="Sessions"
            last
          />

        </section>

        {/* ================================================= */}
        {/* ACTIVITY */}
        {/* ================================================= */}

        <section className="mt-10">

          <SectionTitle
            eyebrow="ACTIVITÉ"
            title="Votre activité"
          />

          <div
            className="
              overflow-hidden
              rounded-[24px]
              border
              border-black/[0.06]
              bg-white
              shadow-[0_10px_35px_rgba(0,0,0,0.04)]
            "
          >

            <ProfileItem
              icon={Video}
              title="Vos enregistrements"
              description="Retrouvez vos dernières vidéos"
              onClick={() =>
                goTo("/recordings")
              }
            />

            <Divider />

            <ProfileItem
              icon={FileText}
              title="Vos scripts"
              description="Gérez et modifiez vos scripts"
              onClick={() =>
                goTo("/scripts")
              }
            />

          </div>

        </section>

        {/* ================================================= */}
        {/* ACCOUNT */}
        {/* ================================================= */}

        <section className="mt-10">

          <SectionTitle
            eyebrow="COMPTE"
            title="Préférences"
          />

          <div
            className="
              overflow-hidden
              rounded-[24px]
              border
              border-black/[0.06]
              bg-white
              shadow-[0_10px_35px_rgba(0,0,0,0.04)]
            "
          >

            {/* PERSONAL INFORMATION */}

            <ProfileItem
              icon={User}
              title="Informations personnelles"
              description={
                user?.mobile
                  ? "Nom, email et numéro de téléphone"
                  : "Nom, email et profil"
              }
              onClick={() =>
                goTo("/profile/edit")
              }
            />

            <Divider />

            {/* NOTIFICATIONS */}

            <button
              type="button"
              onClick={() =>
                setNotifications(
                  (previous) => !previous
                )
              }
              className="
                flex
                w-full
                items-center
                gap-4
                px-5
                py-4
                text-left
                transition
                hover:bg-gray-50
                active:bg-gray-100
              "
            >

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-[14px]
                  bg-gray-100
                  text-gray-600
                "
              >
                <Bell
                  size={17}
                  strokeWidth={1.9}
                />
              </div>

              <div className="min-w-0 flex-1">

                <p
                  className="
                    text-xs
                    font-semibold
                    text-gray-800
                  "
                >
                  Notifications
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    text-gray-400
                  "
                >
                  Recevoir les rappels et nouveautés
                </p>

              </div>

              {/* SWITCH */}

              <span
                className={`
                  relative
                  h-6
                  w-10
                  shrink-0
                  rounded-full
                  transition-colors
                  duration-200
                  ${
                    notifications
                      ? "bg-black"
                      : "bg-gray-200"
                  }
                `}
              >

                <span
                  className={`
                    absolute
                    top-1
                    h-4
                    w-4
                    rounded-full
                    bg-white
                    shadow-sm
                    transition-all
                    duration-200
                    ${
                      notifications
                        ? "left-5"
                        : "left-1"
                    }
                  `}
                />

              </span>

            </button>

            <Divider />

            {/* APPEARANCE */}

            <ProfileItem
              icon={Palette}
              title="Apparence"
              description="Personnalisez l'apparence de l'application"
              onClick={() =>
                goTo("/profile/appearance")
              }
            />

            <Divider />

            {/* PRIVACY */}

            <ProfileItem
              icon={Shield}
              title="Confidentialité"
              description="Gérez vos données et votre confidentialité"
              onClick={() =>
                goTo("/profile/privacy")
              }
            />

          </div>

        </section>

        {/* ================================================= */}
        {/* APPLICATION */}
        {/* ================================================= */}

        <section className="mt-10">

          <SectionTitle
            eyebrow="APPLICATION"
            title="À propos"
          />

          <div
            className="
              overflow-hidden
              rounded-[24px]
              border
              border-black/[0.06]
              bg-white
              shadow-[0_10px_35px_rgba(0,0,0,0.04)]
            "
          >

            <ProfileItem
              icon={Info}
              title="À propos de LunaCreator"
              description="Version 1.0.0"
              onClick={() =>
                goTo("/about")
              }
            />

            <Divider />

            <ProfileItem
              icon={CircleHelp}
              title="Centre d'aide"
              description="Besoin d'aide ?"
              onClick={() =>
                goTo("/help")
              }
            />

          </div>

        </section>

        {/* ================================================= */}
        {/* LOGOUT */}
        {/* ================================================= */}

        <section className="mt-10">

          <button
            type="button"
            onClick={() =>
              setShowLogout(true)
            }
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-[22px]
              border
              border-red-100
              bg-white
              px-5
              py-4
              text-xs
              font-semibold
              text-red-500
              shadow-sm
              transition-all
              hover:border-red-200
              hover:bg-red-50
              active:scale-[0.99]
            "
          >

            <LogOut size={16} />

            Se déconnecter

          </button>

        </section>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <footer
          className="
            pb-8
            pt-10
            text-center
          "
        >

          <div
            className="
              flex
              items-center
              justify-center
              gap-2
            "
          >

            <div
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                bg-black
                text-white
              "
            >
              <Play
                size={11}
                fill="currentColor"
              />
            </div>

            <span
              className="
                text-xs
                font-bold
                tracking-tight
              "
            >
              Luna
              <span className="text-[#7041e8]">
                Creator
              </span>
            </span>

          </div>

          <p
            className="
              mt-3
              text-[9px]
              text-gray-300
            "
          >
            Créez. Enregistrez. Publiez.
          </p>

        </footer>

      </main>

      {/* ================================================= */}
      {/* LOGOUT MODAL */}
      {/* ================================================= */}

      {showLogout && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/30
            px-5
            backdrop-blur-md
          "
          onClick={() =>
            setShowLogout(false)
          }
        >

          <div
            className="
              w-full
              max-w-sm
              rounded-[28px]
              bg-white
              p-6
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ICON */}

            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-red-50
                text-red-500
              "
            >
              <LogOut size={19} />
            </div>

            {/* TITLE */}

            <h3
              className="
                mt-5
                text-center
                text-lg
                font-bold
              "
            >
              Se déconnecter ?
            </h3>

            {/* DESCRIPTION */}

            <p
              className="
                mt-2
                text-center
                text-xs
                leading-5
                text-gray-400
              "
            >
              Vous pourrez vous reconnecter à tout
              moment pour retrouver votre espace.
            </p>

            {/* ACTIONS */}

            <div className="mt-6 flex gap-2">

              <button
                type="button"
                onClick={() =>
                  setShowLogout(false)
                }
                disabled={isLoggingOut}
                className="
                  flex-1
                  rounded-[18px]
                  bg-gray-100
                  py-3
                  text-xs
                  font-semibold
                  text-gray-600
                  transition
                  hover:bg-gray-200
                "
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="
                  flex-1
                  rounded-[18px]
                  bg-black
                  py-3
                  text-xs
                  font-semibold
                  text-white
                  transition
                  hover:bg-gray-800
                  disabled:opacity-50
                "
              >
                {isLoggingOut
                  ? "Déconnexion..."
                  : "Déconnexion"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ================================================= */
/* STAT ITEM */
/* ================================================= */

function StatItem({
  icon,
  value,
  label,
  last = false,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  last?: boolean;
}) {
  return (
    <div
      className={`
        flex
        flex-col
        items-center
        justify-center
        py-5
        ${
          !last
            ? "border-r border-black/[0.05]"
            : ""
        }
      `}
    >

      <div className="mb-2 text-gray-400">
        {icon}
      </div>

      <p className="text-xl font-bold">
        {value}
      </p>

      <p
        className="
          mt-1
          text-[9px]
          text-gray-400
        "
      >
        {label}
      </p>

    </div>
  );
}

/* ================================================= */
/* PROFILE ITEM */
/* ================================================= */

function ProfileItem({
  icon: Icon,
  title,
  description,
  onClick,
  danger = false,
}: ProfileItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        gap-4
        px-5
        py-4
        text-left
        transition-all
        duration-200
        hover:bg-gray-50
        active:bg-gray-100
      "
    >

      {/* ICON */}

      <div
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-[14px]
          transition-all
          duration-200
          ${
            danger
              ? "bg-red-50 text-red-500"
              : "bg-gray-100 text-gray-600 group-hover:bg-black group-hover:text-white"
          }
        `}
      >

        <Icon
          size={17}
          strokeWidth={1.9}
        />

      </div>

      {/* TEXT */}

      <div className="min-w-0 flex-1">

        <p
          className={`
            text-xs
            font-semibold
            ${
              danger
                ? "text-red-500"
                : "text-gray-800"
            }
          `}
        >
          {title}
        </p>

        {description && (
          <p
            className="
              mt-1
              text-[10px]
              leading-4
              text-gray-400
            "
          >
            {description}
          </p>
        )}

      </div>

      {/* ARROW */}

      {!danger && (
        <ChevronRight
          size={16}
          className="
            shrink-0
            text-gray-300
            transition-all
            duration-200
            group-hover:translate-x-0.5
            group-hover:text-gray-500
          "
        />
      )}

    </button>
  );
}

/* ================================================= */
/* DIVIDER */
/* ================================================= */

function Divider() {
  return (
    <div
      className="
        mx-5
        h-px
        bg-black/[0.04]
      "
    />
  );
}

/* ================================================= */
/* SECTION TITLE */
/* ================================================= */

function SectionTitle({
  eyebrow,
  title,
}: SectionTitleProps) {
  return (
    <div className="mb-4">

      <p
        className="
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.16em]
          text-gray-400
        "
      >
        {eyebrow}
      </p>

      <h3
        className="
          mt-1
          text-lg
          font-bold
          tracking-tight
        "
      >
        {title}
      </h3>

    </div>
  );
}