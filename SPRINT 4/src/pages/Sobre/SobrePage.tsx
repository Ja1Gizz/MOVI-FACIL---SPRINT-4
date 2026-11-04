const informacoesSobreProjeto = [
  {
    titulo: 'Motivação',
    texto: 'Segundo reportagens recentes, o uso do transporte público no Brasil tem caído e muitos passageiros relatam desconforto, limitação de horários e custos altos. O cidadão médio pode gastar mais de R$ 212,00 por mês com deslocamentos.'
  },
  {
    titulo: 'Nossa solução',
    texto: 'A nossa solução para esse problema foi a criação de uma aplicação que permite que o usuário ganhe pontos por utilizar o transporte público, seja ônibus ou metrô, ou por completar missões propostas pelo aplicativo.'
  },
  {
    titulo: 'Objetivo',
    texto: 'O objetivo do projeto é tornar o transporte público financeiramente mais viável para os usuários, reduzindo o trânsito e a emissão de poluentes.'
  }
]

export default function SobrePage() {
  return (
    <div className="mx-auto my-8 max-w-5xl space-y-8 rounded-[14px] border border-slate-200 bg-[#f0e9fa] p-6 text-slate-800 shadow-sm backdrop-blur-sm md:p-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6a27c4]">Sobre nós</p>
        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Sobre o Movi Fácil</h1>
        <p className="max-w-3xl text-lg leading-7 text-slate-700">
          O Movi Fácil é uma plataforma criada para tornar o transporte coletivo mais acessível, com mais conveniência e incentivo ao uso de ônibus e metrô.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {informacoesSobreProjeto.map((informacao) => (
          <article key={informacao.titulo} className="rounded-[14px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-slate-900">{informacao.titulo}</h2>
            <p className="leading-6 text-slate-600">{informacao.texto}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
