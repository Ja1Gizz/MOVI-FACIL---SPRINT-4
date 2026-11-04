import { useNavigate } from 'react-router'

export default function NaoEncontradaPage() {
  const navegar = useNavigate()

  return (
    <section className="mx-auto my-8 max-w-2xl space-y-5 rounded-[14px] border border-slate-200 bg-[#f0e9fa] p-8 text-center text-slate-800 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6a27c4]">Erro 404</p>
      <h1 className="text-3xl font-black text-slate-900">Página não encontrada</h1>
      <p className="text-slate-600">Confira o endereço ou volte para a página inicial.</p>
      <button
        className="rounded-full bg-[#6a27c4] px-5 py-3 font-semibold text-white transition hover:bg-[#4c1d95]"
        type="button"
        onClick={() => navegar('/', { replace: true })}
      >
        Ir para o início
      </button>
    </section>
  )
}
