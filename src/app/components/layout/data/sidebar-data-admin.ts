import {
  Library,
  Package,
  CreditCard,
  ShieldCheck,
  Menu,
  LayoutDashboard,
  Layers,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarDataAdmin: SidebarData = {
  navGroups: [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '/admin/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Account Categories',
          icon: Library,
          url: '/admin/account-categories',
        },
        {
          title: 'Transaction Types',
          icon: Layers,
          url: '/admin/transaction-types',
        },
        {
          title: 'Plan',
          icon: Package,
          url: '/admin/plans',
        },
        {
          title: 'Subscriptions',
          icon: CreditCard,
          url: '/admin/subscriptions',
        },
        {
          title: 'Permissions',
          url: '/admin/permissions',
          icon: ShieldCheck,
        },
        {
          title: 'Menus',
          url: '/admin/menus',
          icon: Menu,
        },
        {
          title: 'Menu Categories',
          url: '/admin/menu-categories',
          icon: Library,
        },
      ],
    },
  ],
}

// export const sidebarDataAdmin: SidebarData = {
//   navGroups: [
//     {
//       title: 'Overview',
//       items: [
//         {
//           title: 'Dashboard',
//           url: '/admin/dashboard',
//           icon: LayoutDashboard,
//         },
//       ],
//     },
//     {
//       title: 'Accounting',
//       items: [
//         {
//           title: 'Account Categories',
//           icon: Library,
//           url: '/admin/account-categories',
//         },
//         {
//           title: 'Transaction Types',
//           icon: Layers,
//           url: '/admin/transaction-types',
//         },
//       ],
//     },
//     {
//       title: 'Billing & Subscriptions',
//       items: [
//         {
//           title: 'Plan',
//           icon: Package,
//           url: '/admin/plans',
//         },
//         {
//           title: 'Subscriptions',
//           icon: CreditCard,
//           url: '/admin/subscriptions',
//         },
//       ],
//     },
//     {
//       title: 'Access Control',
//       items: [
//         {
//           title: 'Permissions',
//           url: '/admin/permissions',
//           icon: ShieldCheck,
//         },
//       ],
//     },
//     {
//       title: 'Settings',
//       items: [
//         {
//           title: 'Menus',
//           url: '/admin/menus',
//           icon: Menu,
//         },
//         {
//           title: 'Menu Categories',
//           url: '/admin/menu-categories',
//           icon: Library,
//         },
//       ],
//     },
//   ],
// }
