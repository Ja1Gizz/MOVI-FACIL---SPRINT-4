import { Link } from 'react-router'

const perguntas = [
  {
    pergunta: 'O que é o Movifácil?',
    resposta: 'O Movifácil é um aplicativo que incentiva o uso do transporte público por meio de um sistema de pontos e recompensas.'
  },
  {
    pergunta: 'Como ganhar pontos no aplicativo?',
    resposta: 'O usuário ganha pontos ao pagar passagens utilizando o aplicativo ou ao completar missões propostas pela plataforma.'
  },
  {
    pergunta: 'Para que servem os pontos acumulados?',
    resposta: 'Os pontos podem ser trocados por descontos em passagens ou até mesmo por passagens gratuitas.'
  },
  {
    pergunta: 'Quantos pontos são recebidos por pagamento?',
    resposta: 'Cada pagamento realizado pelo aplicativo gera 10 pontos para o usuário.'
  },
  {
    pergunta: 'Existe limite de pontos que posso acumular?',
    resposta: 'Não. O usuário pode acumular pontos livremente ao utilizar o aplicativo e concluir missões.'
  }
]

export default function FAQPage() {
  return (
    <div className="mx-auto my-8 max-w-4xl space-y-8 rounded-[14px] border border-slate-200 bg-[#f0e9fa] p-6 text-slate-800 shadow-sm backdrop-blur-sm md:p-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6a27c4]">Central de ajuda</p>
        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Perguntas frequentes</h1>
        <p className="text-lg text-slate-600">Respostas rápidas para você aproveitar melhor os serviços da Movi Fácil.</p>
      </header>

      <section aria-label="Perguntas frequentes" className="space-y-3">
        {perguntas.map(({ pergunta, resposta }) => (
          <details key={pergunta} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900">
              {pergunta}
              <span aria-hidden="true" className="text-xl text-[#6a27c4] transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 leading-6 text-slate-600">{resposta}</p>
          </details>
        ))}
      </section>

      <section className="flex flex-col gap-4 rounded-[14px] bg-[#f0e9fa] p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-slate-800">Ainda precisa de ajuda? Estamos à disposição.</p>
        <Link
          to="/contato"
          className="w-fit rounded-full bg-[#6a27c4] px-5 py-3 font-semibold text-white transition hover:bg-[#4c1d95]"
        >
          Fale com a gente
        </Link>
      </section>
    </div>
  )
}
