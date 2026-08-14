import {
  FileText,
  Home,
  Plus,
  User,
  Activity,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const navItems = [
    {
      to: "/dashboard",
      label: "Accueil",
      icon: Home,
    },
    {
      to: "/scripts",
      label: "Scripts",
      icon: FileText,
    },
    {
      to: "/activity",
      label: "Activité",
      icon: Activity,
    },
    {
      to: "/profile",
      label: "Profil",
      icon: User,
    },
  ];

  return (
    <nav
      className="
        fixed
        bottom-4
        left-1/2
        z-50
        w-[calc(100%-24px)]
        max-w-[560px]
        -translate-x-1/2
        sm:bottom-6
        sm:w-[calc(100%-40px)]
      "
    >
      {/* Conteneur extérieur */}
      <div
        className="
          relative
          rounded-[46px]
          border
          border-dashed
          border-gray-300/70
          bg-white/20
          p-3
          shadow-[0_18px_50px_rgba(0,0,0,0.05)]
          backdrop-blur-[2px]
          sm:p-4
        "
      >
        {/* Navigation principale */}
        <div
          className="
            relative
            flex
            h-[72px]
            items-center
            justify-between
            rounded-full
            border
            border-gray-200/80
            bg-white/90
            px-4
            shadow-[0_10px_35px_rgba(0,0,0,0.07)]
            backdrop-blur-2xl
            sm:h-[76px]
            sm:px-6
          "
        >
          {/* ACCUEIL */}
          <NavItem
            to={navItems[0].to}
            label={navItems[0].label}
            icon={navItems[0].icon}
          />

          {/* SCRIPTS */}
          <NavItem
            to={navItems[1].to}
            label={navItems[1].label}
            icon={navItems[1].icon}
          />

          {/* BOUTON CENTRAL */}
          <NavLink
            to="/new-script"
            aria-label="Créer un script"
            className="
              absolute
              left-1/2
              top-1/2
              flex
              h-[60px]
              w-[60px]
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-black
              text-white
              shadow-[0_10px_28px_rgba(0,0,0,0.20)]
              ring-[5px]
              ring-white
              transition-all
              duration-300
              ease-out
              hover:scale-105
              hover:shadow-[0_14px_35px_rgba(0,0,0,0.25)]
              active:scale-90
            "
          >
            <Plus
              size={26}
              strokeWidth={2.2}
            />
          </NavLink>

          {/* ACTIVITÉ */}
          <NavItem
            to={navItems[2].to}
            label={navItems[2].label}
            icon={navItems[2].icon}
          />

          {/* PROFIL */}
          <NavItem
            to={navItems[3].to}
            label={navItems[3].label}
            icon={navItems[3].icon}
          />
        </div>
      </div>
    </nav>
  );
}


/* -------------------------------- */
/* ITEM DE NAVIGATION */
/* -------------------------------- */

function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
          group
          flex
          min-w-[58px]
          flex-col
          items-center
          justify-center
          gap-[5px]
          rounded-full
          px-2
          py-2
          transition-all
          duration-300
          ease-out
          active:scale-95

          ${
            isActive
              ? "text-black"
              : "text-gray-400 hover:text-gray-700"
          }
        `
      }
    >
      {({ isActive }) => (
        <>
          {/* Icône */}
          <Icon
            size={21}
            strokeWidth={isActive ? 2.3 : 1.7}
            className="
              transition-all
              duration-300
              ease-out
              group-hover:-translate-y-[1px]
              group-hover:scale-105
            "
          />

          {/* Label */}
          <span
            className={`
              whitespace-nowrap
              text-[10px]
              font-medium
              leading-none
              tracking-[-0.01em]
              transition-all
              duration-300

              ${
                isActive
                  ? "text-black"
                  : "text-gray-400"
              }
            `}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}