import {
  Activity,
  Bell,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  Database,
  FileText,
  Globe,
  HandCoins,
  LayoutTemplate,
  ReceiptText,
  Ruler,
  Settings as SettingsIcon,
  Shield,
  Tag,
  Users,
  Workflow,
  Truck
} from 'lucide-react'

export const settingsTabs = [
  {
    name: 'Perusahaan',
    value: 'company',
    icon: Briefcase,
    items: [
      {
        title: 'Profil Perusahaan',
        description: 'Atur detail perusahaan Anda',
        url: '/settings/company',
        icon: Building2,
      },
      {
        title: 'Billing',
        description: 'Upgrade dan perpanjang paket Manajerku',
        url: '/settings/subscription',
        icon: ReceiptText,
      },
    ],
  },
  {
    name: 'Alur Bisnis',
    value: 'business_flow',
    icon: Workflow,
    items: [
      {
        title: 'Alur Bisnis',
        description: 'Atur alur bisnismu',
        icon: Workflow,
      },
      {
        title: 'Penomoran Otomatis',
        description: 'Atur penomoran otomatis invoice',
        url: '/settings/auto-sequencing',
        icon: FileText,
      },
      {
        title: 'Tanggal Penguncian',
        description: 'Kunci data lama untuk tutup buku',
        icon: Calendar,
      },
      {
        title: 'Pemetaan Akun',
        description: 'Pemetaan akun CoA untuk transaksi di Manajerku',
        icon: Database,
      },
      {
        title: 'Audit',
        description: 'Pantau log perubahan data',
        icon: Activity,
      },
      {
        title: 'Konsolidasi',
        description: 'Atur perusahaan dan akun untuk laporan konsolidasi',
        icon: Briefcase,
      },
      {
        title: 'Custom Fields',
        description: 'Custom data pada invoicemu',
        icon: LayoutTemplate,
      },
      {
        title: 'Multi Mata Uang',
        description: 'Atur penggunaan banyak mata uang',
        icon: Globe,
      },
    ],
  },
  {
    name: 'Layout & Template',
    value: 'layout_template',
    icon: Bot,
    items: [
      {
        title: 'Template Invoice',
        description: 'Atur tampilan invoice Anda',
        icon: FileText,
      },
      {
        title: 'Email Template',
        description: 'Atur template email otomatis',
        icon: Bot,
      },
    ],
  },
  {
    name: 'Akun & Pengguna',
    value: 'user_account',
    icon: SettingsIcon,
    items: [
      {
        title: 'Pengguna',
        description: 'Undang staff dan kolega untuk menggunakan Manajerku',
        icon: Users,
        url: '/settings/users',
      },
      {
        title: 'Peran',
        description: 'Atur hak akses pengguna',
        url: '/settings/company-roles',
        icon: Shield,
      },
      {
        title: 'Profil',
        description: 'Atur profil dan ubah password',
        url: '/settings/profile',
        icon: SettingsIcon,
      },
      {
        title: 'Notifikasi',
        description: 'Atur preferensi notifikasi',
        icon: Bell,
      },
    ],
  },
  {
    name: 'Data Master',
    value: 'master_data',
    icon: Database,
    items: [
      {
        title: 'Satuan',
        description: 'Kelola data pelanggan dan vendor',
        url: '/settings/units',
        icon: Ruler,
      },
      {
        title: 'Pajak',
        description: 'Kelola data pelanggan dan vendor',
        url: '/settings/taxes',
        icon: HandCoins,
      },
      {
        title: 'Termin',
        description: 'Kelola data termin pembayaran',
        url: '/settings/payment-terms',
        icon: Calendar,
      },
      {
        title: 'Tags',
        description: 'Atur tag untuk pemisahan laporan',
        url: '/settings/tags',
        icon: Tag,
      },
       {
        title: 'Ekspedisi',
        description: 'Kelola data pengiriman ekspedisi',
        url: '/settings/expeditions',
        icon: Truck,
      },
    ],
  },
  {
    name: 'Integrasi',
    value: 'integration',
    icon: Globe,
    items: [
      {
        title: 'API Keys',
        description: 'Kelola API keys untuk integrasi',
        icon: Globe,
      },
      {
        title: 'Webhooks',
        description: 'Atur webhooks untuk event real-time',
        icon: Activity,
      },
    ],
  },
]
