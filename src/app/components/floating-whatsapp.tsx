import { IconBrandWhatsapp } from '@tabler/icons-react'

export function FloatingWhatsApp() {
  const phoneNumber = '6287787331091'
  const message = 'Halo'
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={waUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='fixed right-2 bottom-2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-102'
      aria-label='Chat on WhatsApp'
    >
      <IconBrandWhatsapp className='h-8 w-8' stroke={1.5} />
    </a>
  )
}
