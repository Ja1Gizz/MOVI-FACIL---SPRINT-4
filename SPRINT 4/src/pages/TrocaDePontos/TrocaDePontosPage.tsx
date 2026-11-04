import { useState, type FormEvent } from 'react'
import {
  formatFare,
  formatPointValue,
  getPointCount,
  getPointSummary,
  redeemDiscount,
  type PointSummary
} from '../../services/moviFacilApi'
import { getStoredUserId, storeUserId } from '../../services/userStorage'

const transportOptions = [
  { value: 'metro', label: 'Metrô' },
  { value: 'onibus', label: 'Ônibus' }
] as const

const categoryOptions = [
  { value: 'comum', label: 'Comum' },
  { value: 'estudante', label: 'Estudante' },
  { value: 'vt', label: 'Vale-transporte' }
] as const

const discountOptions = [25, 50, 100] as const

const fareByTransportAndCategory = {
  metro: { comum: 5.4, estudante: 2.7, vt: 6 },
  onibus: { comum: 5.3, estudante: 2.65, vt: 5.82 }
} as const

const fieldClassName = 'mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-[#6a27c4] focus:ring-2 focus:ring-[#6a27c4]/20'
const buttonClassName = 'rounded-full bg-[#6a27c4] px-5 py-3 font-semibold text-white transition hover:bg-[#4c1d95] disabled:cursor-not-allowed disabled:opacity-60'
const secondaryButtonClassName = 'rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50'
const moneyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function TrocaDePontosPage() {
  const [userId, setUserId] = useState(getStoredUserId)
  const [transport, setTransport] = useState<(typeof transportOptions)[number]['value']>('metro')
  const [category, setCategory] = useState<(typeof categoryOptions)[number]['value']>('comum')
  const [discount, setDiscount] = useState<(typeof discountOptions)[number]>(25)
  const [selectedPoints, setSelectedPoints] = useState<(typeof discountOptions)[number]>(25)
  const [summary, setSummary] = useState<PointSummary | null>(null)
  const [loadingPoints, setLoadingPoints] = useState(false)
  const [redeeming, setRedeeming] = useState(false)
  const [showPointsDialog, setShowPointsDialog] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const availablePoints = summary ? getPointCount(summary.total) : null
  const estimatedDiscount = fareByTransportAndCategory[transport][category] * discount / 100
  const selectedDiscountEstimate = fareByTransportAndCategory[transport][category] * selectedPoints / 100

  async function loadPoints(id: string) {
    setLoadingPoints(true)
    try {
      const result = await getPointSummary(id)
      setSummary(result)
    } catch (requestError) {
      setSummary(null)
      setErrorMessage(
        requestError instanceof Error ? requestError.message : 'Não foi possível consultar os pontos.'
      )
    } finally {
      setLoadingPoints(false)
    }
  }

  async function handleConsult(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const id = userId.trim()
    if (!id) {
      setErrorMessage('Informe o ID do usuário para consultar os pontos.')
      return
    }

    storeUserId(id)
    setErrorMessage('')
    setMessage('')
    await loadPoints(id)
  }

  async function handleRedeem() {
    const id = userId.trim()
    if (!id) {
      setErrorMessage('Informe o ID do usuário antes de solicitar a troca.')
      return
    }

    storeUserId(id)
    setShowPointsDialog(false)
    setShowConfirmation(false)
    setRedeeming(true)
    setErrorMessage('')
    setMessage('')

    try {
      await redeemDiscount(id, transport, category, discount)
      setMessage('Solicitação de desconto realizada com sucesso.')
      setShowConfirmation(false)
      await loadPoints(id)
    } catch (requestError) {
      setErrorMessage(
        requestError instanceof Error ? requestError.message : 'Não foi possível aplicar o desconto.'
      )
    } finally {
      setRedeeming(false)
    }
  }

  return (
    <div className="mx-auto my-8 max-w-4xl space-y-8 rounded-[14px] border border-slate-200 bg-[#f0e9fa] p-6 text-slate-800 shadow-sm md:p-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6a27c4]">Recompensas Movi Fácil</p>
        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Pagamento com pontos</h1>
        <p className="text-lg text-slate-600">Escolha quantos pontos usar na próxima viagem e confira o desconto antes de confirmar.</p>
      </header>

        {errorMessage && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleConsult} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-end">
        <label className="flex-1 font-semibold text-slate-800">
          ID do usuário
          <input
            className={fieldClassName}
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            autoComplete="off"
            required
            placeholder="Informe o ID fornecido pelo sistema"
          />
        </label>
        <button className={buttonClassName} type="submit" disabled={loadingPoints || !userId.trim()}>
          {loadingPoints ? 'Consultando...' : 'Consultar pontos'}
        </button>
      </form>

      {summary && (
        <section aria-label="Resumo da carteira" className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-500">Pontos disponíveis</h2>
            <p className="mt-2 break-words text-2xl font-black text-slate-900">{formatPointValue(summary.total)}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-500">Viagens gratuitas disponíveis</h2>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {availablePoints === null ? 'Sem informação' : Math.floor(availablePoints / 100)}
            </p>
            <p className="mt-1 text-sm text-slate-500">A cada 100 pontos, você pode resgatar uma viagem.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-500">Próxima viagem de metrô</h2>
            <p className="mt-2 break-words text-2xl font-black text-slate-900">{formatFare(summary.metro)}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-500">Próxima viagem de ônibus</h2>
            <p className="mt-2 break-words text-2xl font-black text-slate-900">{formatFare(summary.onibus)}</p>
          </article>
        </section>
      )}

      <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Adicionar pontos à próxima viagem</h2>
          <p className="mt-1 text-sm text-slate-600">Cada ponto representa 1% de desconto; 100 pontos cobrem uma viagem.</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Você ganha 10 pontos por viagem de transporte público validada.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="font-semibold text-slate-800">
            Transporte
            <select className={fieldClassName} value={transport} onChange={(event) => setTransport(event.target.value as typeof transport)}>
              {transportOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="font-semibold text-slate-800">
            Tipo de bilhete
            <select className={fieldClassName} value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>
              {categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            className={buttonClassName}
            type="button"
            disabled={!summary || availablePoints === null || availablePoints < 25 || !userId.trim()}
            onClick={() => {
              setSelectedPoints(Math.min(discount, Math.floor((availablePoints ?? 0) / 25) * 25) as typeof selectedPoints)
              setShowPointsDialog(true)
              setMessage('')
            }}
          >
            Adicionar pontos
          </button>
          <p className="text-sm text-slate-600">
            {discount}% de desconto estimado: {moneyFormatter.format(estimatedDiscount)}
          </p>
        </div>
        <p className="text-sm text-slate-500">
          O desconto escolhido será aplicado à sua próxima viagem após a confirmação.
        </p>
      </section>

      {message && <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">{message}</p>}

      {showPointsDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="points-dialog-title"
            className="w-full max-w-md space-y-5 rounded-xl bg-white p-6 shadow-xl"
          >
            <div>
              <h2 id="points-dialog-title" className="text-2xl font-bold text-slate-900">Adicionar pontos</h2>
              <p className="mt-2 text-slate-600">
                Saldo disponível: {availablePoints ?? 'Sem informação'} pontos
              </p>
            </div>
            <label className="block font-semibold text-slate-800">
              Pontos para usar nesta viagem
              <select
                className={fieldClassName}
                value={selectedPoints}
                onChange={(event) => {
                  const points = Number(event.target.value) as typeof selectedPoints
                  setSelectedPoints(points)
                }}
              >
                {discountOptions.map((points) => (
                  <option key={points} value={points} disabled={(availablePoints ?? 0) < points}>
                    {points} pontos ({points}%)
                  </option>
                ))}
              </select>
            </label>
            <p className="rounded-lg bg-slate-50 p-4 text-slate-700">
              Desconto estimado na passagem: <strong>{moneyFormatter.format(selectedDiscountEstimate)}</strong>
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <button className={secondaryButtonClassName} type="button" onClick={() => setShowPointsDialog(false)}>
                Voltar
              </button>
              <button
                className={buttonClassName}
                type="button"
                onClick={() => {
                  setDiscount(selectedPoints)
                  setShowPointsDialog(false)
                  setShowConfirmation(true)
                }}
                disabled={(availablePoints ?? 0) < selectedPoints}
              >
                Ir para o pagamento
              </button>
            </div>
          </section>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-confirmation-title"
            className="w-full max-w-md space-y-5 rounded-xl bg-white p-6 text-center shadow-xl"
          >
            <h2 id="payment-confirmation-title" className="text-2xl font-bold text-slate-900">Confirmar uso dos pontos?</h2>
            <p className="text-lg text-slate-700">
              Você está usando <strong>{discount} pontos</strong> e terá <strong>{discount}% de desconto</strong> na passagem.
            </p>
            <p className="text-slate-600">Desconto estimado: {moneyFormatter.format(estimatedDiscount)}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className={secondaryButtonClassName} type="button" onClick={() => setShowConfirmation(false)} disabled={redeeming}>
                Não, voltar
              </button>
              <button className={buttonClassName} type="button" onClick={handleRedeem} disabled={redeeming}>
                {redeeming ? 'Processando...' : 'Sim, confirmar'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}