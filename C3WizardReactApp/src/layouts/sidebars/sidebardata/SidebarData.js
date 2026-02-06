import * as Icon from 'react-feather';

const SidebarData = [
  {
    title: 'Dashboard',
    href: '/apps/dashboard',
    icon: <Icon.Home />,
    id: 2.3,
    collapisble: false,
    role: 'Administrative',
  },
  {
    title: 'Employer Details',
    href: '/apps/employerdetails',
    icon: <Icon.User />,
    id: 8.3,
    collapisble: false,
    role: 'Administrative',
  },

  {
    title: 'C3',
    href: '/C3',
    icon: <Icon.DollarSign />,
    id: 2.7,
    collapisble: true,
    role: 'Administrative',
    children: [
      {
        title: 'Employee',
        href: '/apps/C3/Employee',
        icon: <Icon.User />,
      },
      {
        title: 'Holiday/Other Payment',
        href: '/apps/C3/Holiday',
        icon: <Icon.Disc />,
      },
      {
        title: 'C3 Generation',
        href: '/apps/C3/C3Generation',
        icon: <Icon.Disc />,
      },
      {
        title: 'Bonus',
        href: '/apps/C3/Bonus',
        icon: <Icon.Disc />,
      },
      {
        title: 'Reports',
        href: '/apps/C3/Reports',
        icon: <Icon.Disc />,
      },
    ],
  },

  {
    title: 'Non Working Director',
    href: '/director',
    icon: <Icon.User />,
    id: 2.7,
    collapisble: true,
    role: 'Administrative',
    children: [
      {
        title: 'Nw Director',
        href: '/apps/director/NwDirector',
        icon: <Icon.Disc />,
      },
      {
        title: 'Nw Director Payroll',
        href: '/apps/director/NwDirectorPayroll',
        icon: <Icon.Disc />,
      },
      {
        title: 'Nw Director Reports',
        href: '/apps/director/NwDirectorReports',
        icon: <Icon.Disc />,
      },
    ],
  },

  {
    title: 'Administration',
    href: '/administration',
    icon: <Icon.ShoppingCart />,
    role: 'Administrative',
    id: 2.7,
    collapisble: true,
    children: [
      {
        title: 'User Management',
        href: '/apps/administration/UserManagement',
        icon: <Icon.Disc />,
      },
      {
        title: 'User Audit Trail',
        href: '/apps/administration/UserAuditTrail',
        icon: <Icon.Disc />,
      },
      {
        title: 'Logged in History',
        href: '/apps/administration/LoggedInHistory',
        icon: <Icon.Disc />,
      },
    ],
  },

  {
    title: 'About us',
    href: '/apps/aboutus',
    icon: <Icon.Info />,
    id: 8.3,
    collapisble: false,
    role: 'Administrative',
  },
  {
    title: 'Contact Us',
    href: '/apps/contacts',
    icon: <Icon.Headphones />,
    id: 2.3,
    collapisble: false,
    role: 'Administrative',
  },

  {
    title: 'Logout',
    href: '/apps/logout',
    icon: <Icon.LogOut />,
    id: 2.3,
    collapisble: false,
  },

  // **  Self-Employee  **//

  {
    title: 'Dashboard',
    href: '/apps/dashboards',
    icon: <Icon.Home />,
    id: 3.4,
    collapisble: false,
    role: 'Standard',
  },

  {
    title: 'Personal Details',
    href: '/apps/personalDetails',
    icon: <Icon.Users />,
    id: 3.5,
    collapisble: false,
    role: 'Standard',
  },

  {
    title: 'Self Employee Contribution',
    href: '/apps/selfEmployeeContribution',
    icon: <Icon.DollarSign />,
    id: 3.6,
    collapisble: false,
    role: 'Standard',
  },

  {
    title: 'Reports',
    href: '/apps/report',
    icon: <Icon.FileText />,
    id: 3.7,
    collapisble: false,
    role: 'Standard',
  },

  {
    title: 'User Profile',
    href: '/apps/Profile',
    icon: <Icon.User />,
    id: 3.8,
    collapisble: false,
    role: 'Standard',
  },
  {
    title: 'User Audit Trail',
    href: '/apps/userAuditTrails',
    icon: <Icon.BarChart />,
    id: 4.2,
    collapisble: false,
    role: 'Standard',
  },

  {
    title: 'Logged In History',
    href: '/apps/loggedInHistorys',
    icon: <Icon.Activity />,
    id: 4.3,
    collapisble: false,
    role: 'Standard',
  },

  {
    title: 'Contact Us',
    href: '/apps/contacts',
    icon: <Icon.Headphones />,
    id: 2.3,
    collapisble: false,
    role: 'Standard',
  },

  {
    title: 'About Us',
    href: '/apps/aboutUs',
    icon: <Icon.User />,
    id: 4.4,
    collapisble: false,
    role: 'Standard',
  },

  //Admin Menu

  {
    title: 'Dashboard',
    href: '/admin-dashboard',
    icon: <Icon.Home />,
    id: 2.3,
    collapisble: false,
    role: 'Admin',
  },
  {
    title: 'Employer Details',
    href: '/admin/employer-details',
    icon: <Icon.User />,
    id: 8.3,
    collapisble: false,
    role: 'Admin',
  },

  {
    title: 'C3 Details',
    href: '/C3',
    icon: <Icon.DollarSign />,
    id: 2.7,
    collapisble: true,
    role: 'Admin',
    children: [
      {
        title: 'C3 Contribution',
        href: '/admin/c3/c3-contribution',
        icon: <Icon.Disc />,
      },
      {
        title: 'NW Director',
        href: '/admin/c3/nw-director',
        icon: <Icon.Disc />,
      },
      {
        title: 'Self Employed',
        href: '/admin/c3/self-employed',
        icon: <Icon.Disc />,
      },
      {
        title: 'Report',
        href: '/admin/c3/report',
        icon: <Icon.Disc />,
      },
    ],
  },

  {
    title: 'Settings',
    href: '/settings',
    icon: <Icon.Settings />,
    id: 2.7,
    collapisble: true,
    role: 'Admin',
    children: [
      {
        title: 'C3 Settings',
        href: '/apps/settings/C3Settings',
        icon: <Icon.Disc />,
      },
      {
        title: 'Bonus Settings',
        href: '/apps/settings/BonusSettings',
        icon: <Icon.Disc />,
      },
      {
        title: 'Self Employed Settings',
        href: '/apps/settings/SelfEmployedSettings',
        icon: <Icon.Disc />,
      },
      {
        title: 'Levy Settings',
        href: '/apps/settings/LevySettings',
        icon: <Icon.Disc />,
      },
    ],
  },

  {
    title: 'Manage Users',
    href: '/manage-users',
    icon: <Icon.ShoppingCart />,
    role: 'Admin',
    id: 2.7,
    collapisble: true,
    children: [
      {
        title: 'My Users',
        href: '/admin/manage-users/my-users',
        icon: <Icon.Disc />,
      },
      {
        title: 'Company Users',
        href: '/admin/manage-users/company-users',
        icon: <Icon.Disc />,
      },

      {
        title: 'Self Employed Users',
        href: '/admin/manage-users/self-employed-users',
        icon: <Icon.Disc />,
      },

      {
        title: 'Logged in History',
        href: '/admin/logged-in-history',
        icon: <Icon.Disc />,
      },
      {
        title: 'Role Permission',
        href: '/apps/settings/rolePermission',
        icon: <Icon.Disc />,
      },
      {
        title: 'Role Master',
        href: '/apps/roleMaster/RoleMaster',
        icon: <Icon.Disc />,
      },
    ],
  },
];

export default SidebarData;
