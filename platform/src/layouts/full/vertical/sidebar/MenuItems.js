import {
  IconAward,
  IconBoxMultiple,
  IconPoint,
  IconAlertCircle,
  IconNotes,
  IconCalendar,
  IconMail,
  IconTicket,
  IconEdit,
  IconGitMerge,
  IconCurrencyDollar,
  IconApps,
  IconFileDescription,
  IconFileDots,
  IconFiles,
  IconBan,
  IconStar,
  IconMoodSmile,
  IconBorderAll,
  IconBorderHorizontal,
  IconLayoutBoard,
  IconBorderInner,
  IconBorderVertical,
  IconBorderTop,
  IconWorldWww,
  IconUserCircle,
  IconLicense,
  IconPackage,
  IconMessage2,
  IconBasket,
  IconChartLine,
  IconChartArcs,
  IconChartCandle,
  IconChartArea,
  IconChartDots,
  IconChartDonut3,
  IconChartRadar,
  IconLogin,
  IconUserPlus,
  IconRotate,
  IconBox,
  IconAperture,
  IconShoppingCart,
  IconHelp,
  IconBoxAlignBottom,
  IconBoxAlignLeft,
  IconLayout,
  IconZoomCode,
  IconSettings,
  IconBorderStyle2,
  IconAppWindow,
  IconLockAccess,
} from "@tabler/icons";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconAperture,
    href: "/dashboards",
  },

  {
    navlabel: true,
    subheader: "Ad Management",
  },
  {
    id: uniqueId(),
    title: "Creatives",
    icon: IconChartDonut3,
    href: "/ad-management/creatives",
  },
  {
    id: uniqueId(),
    title: "Sites",
    icon: IconWorldWww,
    href: "/ad-management/sites",
  },
  {
    id: uniqueId(),
    title: "Ad units",
    icon: IconLayoutBoard,
    href: "/ad-management/ad-units",
  },

  {
    navlabel: true,
    subheader: "User Management",
    requireRoles: ["Administrator", "Manager"],
  },
  {
    id: uniqueId(),
    title: "User",
    icon: IconUserCircle,
    href: "/user-management/users",
    requireRoles: ["Administrator", "Manager"]
  },
  {
    id: uniqueId(),
    title: "Role and permission",
    icon: IconLicense,
    href: "/user-management/role-permission",
    requireRoles: ["Administrator"]
  },

  {
    navlabel: true,
    subheader: "Student Management",
  },
  {
    id: uniqueId(),
    title: "Student",
    icon: IconUserCircle,
    href: "/student-management/students",
    requireRoles: ["Administrator"]
  },
];

export default Menuitems;
