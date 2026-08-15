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
      <div>
        {/* Navigation principale */}
        <div
          className="
            relative
            flex
            h-[72px]
            items-center
            rounded-full
            bg-white/90
            px-4
            sm:h-[76px]
            sm:px-6
          "
        >
          {/* GROUPE GAUCHE */}
          <div
            className="
              flex
              flex-1
              items-center
              justify-around
              pr-10
              sm:pr-12
            "
          >
            <NavItem
              to={navItems[0].to}
              label={navItems[0].label}
              icon={navItems[0].icon}
            />

            <NavItem
              to={navItems[1].to}
              label={navItems[1].label}
              icon={navItems[1].icon}
            />
          </div>

          {/* BOUTON CENTRAL */}
          <NavLink
          to="/script/new"
          aria-label="Créer un script"
          className="
            absolute
            left-1/2
            top-1/2
            z-10
            flex
            h-[58px]
            w-[58px]
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-[#252525]
            text-white
            shadow-[0_8px_22px_rgba(0,0,0,0.18)]
            ring-[4px]
            ring-white
            transition-all
            duration-300
            ease-out
            hover:scale-105
            hover:bg-[#333333]
            hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)]
            active:scale-90
          "
        >
          <Plus
            size={25}
            strokeWidth={2.2}
            className="text-white"
          />
        </NavLink>

          {/* GROUPE DROITE */}
          <div
            className="
              flex
              flex-1
              items-center
              justify-around
              pl-10
              sm:pl-12
            "
          >
            <NavItem
              to={navItems[2].to}
              label={navItems[2].label}
              icon={navItems[2].icon}
            />

            <NavItem
              to={navItems[3].to}
              label={navItems[3].label}
              icon={navItems[3].icon}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}


/* -------------------------------- */
/* ITEM DE NAVIGATION */
/* -------------------------------- */

function NavItem({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
}) {
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