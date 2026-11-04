const canais = [
  {
    titulo: 'E-mail',
    descricao: 'Envie sua dúvida ou solicitação por e-mail.',
    acao: 'joaoluizmo23@gmail.com',
    href: 'mailto:joaoluizmo23@gmail.com'
  },
  {
    titulo: 'WhatsApp',
    descricao: 'Fale com a equipe pelo WhatsApp.',
    acao: '(11) 93278-4516',
    href: 'https://wa.me/5511932784516'
  },
  {
    titulo: 'Teams',
    descricao: 'Entre em contato pelo Microsoft Teams.',
    acao: 'rm568747@fiap.com.br',
    href: 'mailto:rm568747@fiap.com.br'
  }
]

export default function ContatoPage() {
  return (
    <div className="mx-auto my-8 max-w-5xl space-y-8 rounded-[14px] border border-slate-200 bg-[#f0e9fa] p-6 text-slate-800 shadow-sm backdrop-blur-sm md:p-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6a27c4]">Estamos à disposição</p>
        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Entre em contato</h1>
        <p className="max-w-2xl text-lg leading-7 text-slate-600">
          Escolha o canal mais conveniente para falar com a equipe da Movi Fácil.
        </p>
      </header>

      <section aria-label="Canais de contato" className="grid gap-5 md:grid-cols-3">
        {canais.map((canal) => (
          <article key={canal.titulo} className="flex flex-col rounded-[14px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-bold text-slate-900">{canal.titulo}</h2>
            <p className="mb-5 flex-1 leading-6 text-slate-600">{canal.descricao}</p>
            <a
              href={canal.href}
              target={canal.href.startsWith('https://') ? '_blank' : undefined}
              rel={canal.href.startsWith('https://') ? 'noreferrer' : undefined}
              className="font-semibold text-[#6a27c4] underline decoration-[#6a27c4]/40 underline-offset-4 hover:text-[#4c1d95]"
            >
              {canal.acao}
            </a>
          </article>
        ))}
      </section>
    </div>
  )
}
