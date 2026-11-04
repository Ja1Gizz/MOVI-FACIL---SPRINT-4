import { Link } from 'react-router'
import moviFacilLogo from '../../assets/MoviFacil Logo.png'

const beneficios = [
  'Ganhe 10 pontos por viagem',
  'Complete missões e acumule pontos',
  'Troque pontos por passagens e descontos'
]

const motivosParaEscolher = [
  {
    titulo: 'Economia e recompensa',
    texto: 'Usuários acumulam pontos ao usar o transporte público e podem resgatar descontos ou passagens gratuitas.',
    icone: '✦'
  },
  {
    titulo: 'Acesso simplificado',
    texto: 'Interface clara para registrar bilhetes, acompanhar missões e verificar saldo de créditos.',
    icone: '✎'
  },
  {
    titulo: 'Mobilidade inteligente',
    texto: 'Fluxos pensados para reduzir o tempo de uso e incentivar a adesão ao transporte coletivo.',
    icone: '☎'
  }
]

export default function HomePage() {
  return (
    <div className="space-y-12 py-8 text-slate-800">
      <section className="grid items-center gap-8 overflow-hidden rounded-[16px] border border-slate-200 bg-[#f0e9fa] p-6 shadow-sm md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl">
              Movi Fácil: Transformando o transporte público em uma jornada mais acessível e divertida!
            </h1>
            <p className="max-w-xl text-base text-slate-600 md:text-lg">
              O Movi Fácil é uma plataforma criada para tornar o transporte coletivo mais acessível, com mais conveniência e incentivo ao uso de ônibus e metrô.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/contato"
              className="rounded-full bg-[#6a27c4] px-5 py-3 font-semibold text-white transition hover:bg-[#4c1d95]"
            >
              Fale com a gente
            </Link>
            <Link
              to="/integrantes"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Conhecer equipe
            </Link>
          </div>

        </div>

        <div className="grid gap-4">
          <img
            src={moviFacilLogo}
            alt="Logo Movi Fácil"
            className="h-96 w-full object-contain"
          />

          <div className="grid grid-cols-3 gap-3">
            {beneficios.map((beneficio, index) => (
              <div
                key={beneficio}
                className={`rounded-lg border border-slate-200 bg-slate-50 p-3 text-center text-sm font-medium text-slate-700 ${
                  index === 1 ? 'bg-[#f0e9fa] text-[#6a27c4]' : ''
                }`}
              >
                {beneficio}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[14px] border border-slate-200 bg-[#f0e9fa] p-6 md:p-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Por que o Movi Fácil?</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {motivosParaEscolher.map((motivo) => (
            <article key={motivo.titulo} className="rounded-[20px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <span
                aria-hidden="true"
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#6a27c4] text-2xl font-bold text-white"
              >
                {motivo.icone}
              </span>
              <h3 className="mb-2 font-semibold text-slate-800">{motivo.titulo}</h3>
              <p className="text-sm leading-5 text-slate-600">{motivo.texto}</p>
            </article>
          ))}
        </div>
      </section>

    </div>
  )
}
