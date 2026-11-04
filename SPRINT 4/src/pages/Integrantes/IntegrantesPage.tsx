import pedru from '../../assets/Pedru.webp'
import thiago from '../../assets/Thiago.jpg'
import joao from '../../assets/João.jpg'
import caua from '../../assets/caua.webp'

const integrantes = [
  {
    nome: 'João Luiz Oliveira',
    rm: 'RM 568747',
    foto: joao,
    github: 'https://github.com/Ja1Gizz',
    linkedin: 'https://www.linkedin.com/in/jo%C3%A3o-luiz-silva-matias-de-oliveira-34599b408/'
  },
  {
    nome: 'Cauã Trevisanuto',
    rm: 'RM 570312',
    foto: caua,
    github: 'https://github.com/CauaTr',
    linkedin: 'https://www.linkedin.com/in/cau%C3%A3-trevisanuto-997405411/'
  },
  {
    nome: 'Pedro Basilisco',
    rm: 'RM 572370',
    foto: pedru,
    github: 'https://github.com/P3druuh',
    linkedin: 'https://www.linkedin.com/in/pedro-basilio-770108411'
  },
  {
    nome: 'Thiago Ferreira',
    rm: 'RM 572492',
    foto: thiago,
    github: 'https://github.com/thiago2908',
    linkedin: 'https://www.linkedin.com/in/thiago-f-rocha-325904290/'
  }
]

export default function IntegrantesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 py-8 text-slate-800">
      <section className="space-y-8 rounded-[14px] border border-slate-200 bg-[#f0e9fa] p-6 md:p-8">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6a27c4]">Quem somos</p>
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Conheça os integrantes</h1>
          <p className="text-slate-700">A equipe por trás da Movi Fácil.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {integrantes.map((integrante) => (
            <article key={integrante.rm} className="rounded-[14px] border border-slate-200 bg-white p-5 shadow-sm">
              <img
                src={integrante.foto}
                alt={`Foto de ${integrante.nome}`}
                className="mb-5 aspect-[3/4] w-full rounded-[11px] border border-slate-200 object-cover"
              />
              <div className="rounded-lg border border-[#4c1d95] bg-[#6a27c4] p-3 text-sm text-white">
                <p className="font-semibold">{integrante.nome}</p>
                <p>{integrante.rm}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-white/30 pt-3">
                  <a
                    href={integrante.github}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-white/80"
                  >
                    GitHub
                  </a>
                  <a
                    href={integrante.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-white/80"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
