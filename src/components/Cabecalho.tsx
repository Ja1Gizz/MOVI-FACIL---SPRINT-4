import { Link } from 'react-router'
import moviFacilLogo from '../assets/MoviFacil Logo.png'

export default function Cabecalho() {
  const links = [
    { label: 'Início', to: '/' },
    { label: 'Integrantes', to: '/integrantes' },
    { label: 'Sobre', to: '/sobre' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Contato', to: '/contato' }
  ]

  return (
    <header className="bg-[#111111] px-4 pt-4 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-3 pb-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-white">
              <img src={moviFacilLogo} alt="" aria-hidden="true" className="h-10 w-10 object-contain" />
              Movi Fácil
            </Link>
          </div>

          <nav
            aria-label="Navegação principal"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:col-start-2 md:row-start-1"
          >
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-white transition hover:text-white/75"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:col-start-3 md:row-start-1 md:justify-self-end">
            <Link
              to="/troca-de-pontos"
              className="text-sm font-medium text-white transition hover:text-white/75"
            >
              Troca de pontos
            </Link>
            <span aria-hidden="true" className="text-sm text-white/60">|</span>
            <Link
              to="/perfil"
              className="text-sm font-medium text-white transition hover:text-white/75"
            >
              Perfil
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
