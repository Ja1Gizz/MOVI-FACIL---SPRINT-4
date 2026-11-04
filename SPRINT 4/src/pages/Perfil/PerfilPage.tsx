import { useEffect, useState, type FormEvent } from 'react'
import {
  deleteAccount,
  formatFare,
  formatPointValue,
  getPointCount,
  getPointSummary,
  getUserId,
  loginUser,
  registerUser,
  registerTrip,
  replaceTicket,
  type AccountType,
  type PointSummary,
  type UserType
} from '../../services/moviFacilApi'
import {
  clearStoredUserId,
  getStoredAccountType,
  getStoredUserId,
  storeAccountType,
  storeUserId
} from '../../services/userStorage'

const fieldClassName = 'mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-[#6a27c4] focus:ring-2 focus:ring-[#6a27c4]/20'
const buttonClassName = 'rounded-full bg-[#6a27c4] px-5 py-3 font-semibold text-white transition hover:bg-[#4c1d95] disabled:cursor-not-allowed disabled:opacity-60'

type PerfilPageProps = {
  idDaRota?: string
}

export default function PerfilPage({ idDaRota }: PerfilPageProps = {}) {
  const [authTab, setAuthTab] = useState<'login' | 'cadastro'>('login')
  const [loginCpf, setLoginCpf] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registrationName, setRegistrationName] = useState('')
  const [registrationCpf, setRegistrationCpf] = useState('')
  const [registrationPassword, setRegistrationPassword] = useState('')
  const [registrationEmail, setRegistrationEmail] = useState('')
  const [registrationDate, setRegistrationDate] = useState('')
  const [registrationPhone, setRegistrationPhone] = useState('')
  const [registrationAccountType, setRegistrationAccountType] = useState<UserType>('comum')
  const [registrationTicketType, setRegistrationTicketType] = useState<AccountType>('comum')
  const [loggingIn, setLoggingIn] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [registeringTrip, setRegisteringTrip] = useState(false)
  const [authenticated, setAuthenticated] = useState(() => Boolean(idDaRota))
  const [userId, setUserId] = useState(() => idDaRota ?? getStoredUserId())
  const [accountType, setAccountType] = useState<AccountType>(getStoredAccountType)
  const [ticketType, setTicketType] = useState<AccountType>(getStoredAccountType)
  const [ticketNumber, setTicketNumber] = useState('')
  const [summary, setSummary] = useState<PointSummary | null>(null)
  const [loadingPoints, setLoadingPoints] = useState(() => Boolean(idDaRota))
  const [savingTicket, setSavingTicket] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const availablePoints = summary ? getPointCount(summary.total) : null

  useEffect(() => {
    if (!idDaRota) return

    storeUserId(idDaRota)
    let active = true

    getPointSummary(idDaRota)
      .then((resultado) => {
        if (active) setSummary(resultado)
      })
      .catch((requestError: unknown) => {
        if (!active) return
        setSummary(null)
        setErrorMessage(
          requestError instanceof Error ? requestError.message : 'Não foi possível consultar os pontos.'
        )
      })
      .finally(() => {
        if (active) setLoadingPoints(false)
      })

    return () => {
      active = false
    }
  }, [idDaRota])

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthMessage('')
    setLoggingIn(true)

    try {
      const resposta = await loginUser(loginCpf, loginPassword)
      const id = getUserId(resposta)

      if (!id) {
        setAuthMessage('Não foi possível encontrar sua conta. Confira os dados e tente novamente.')
        return
      }

      storeUserId(id)
      storeAccountType('comum')
      setUserId(id)
      setAccountType('comum')
      setTicketType('comum')
      setAuthenticated(true)
      await consultarPontos(id)
      setLoginPassword('')
      setMessage('Login realizado com sucesso.')
    } catch (requestError) {
      setAuthMessage(
        requestError instanceof Error ? requestError.message : 'Não foi possível fazer login.'
      )
    } finally {
      setLoggingIn(false)
    }
  }

  async function handleRegistrationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthMessage('')

    setRegistering(true)
    try {
      const registrationResponse = await registerUser({
        nome: registrationName,
        cpf: registrationCpf,
        senha: registrationPassword,
        email: registrationEmail,
        data: registrationDate,
        telefone: registrationPhone,
        tipo: registrationAccountType,
        tipoBilhete: registrationTicketType
      })
      let id = getUserId(registrationResponse)

      if (!id) {
        try {
          const loginResponse = await loginUser(registrationCpf, registrationPassword)
          id = getUserId(loginResponse)
        } catch {
          setAuthTab('login')
          setLoginCpf(registrationCpf)
          setRegistrationPassword('')
          setAuthMessage('Conta criada. Entre com seu CPF e senha para continuar.')
          return
        }
      }

      if (!id) {
        setAuthTab('login')
        setLoginCpf(registrationCpf)
        setRegistrationPassword('')
        setAuthMessage('Conta criada, mas não foi possível acessar seu ID. Tente entrar com seu CPF e senha.')
        return
      }

      storeUserId(id)
      storeAccountType(registrationTicketType)
      setUserId(id)
      setAccountType(registrationTicketType)
      setTicketType(registrationTicketType)
      setAuthenticated(true)
      await consultarPontos(id)
      setLoginCpf(registrationCpf)
      setLoginPassword('')
      setRegistrationPassword('')
      setMessage('Conta criada com sucesso. Esta é a sua carteira.')
    } catch (requestError) {
      setAuthMessage(
        requestError instanceof Error ? requestError.message : 'Não foi possível concluir o cadastro.'
      )
    } finally {
      setRegistering(false)
    }
  }

  async function consultarPontos(id: string) {
    setLoadingPoints(true)
    setErrorMessage('')

    try {
      setSummary(await getPointSummary(id))
    } catch (requestError) {
      setSummary(null)
      setErrorMessage(
        requestError instanceof Error ? requestError.message : 'Não foi possível consultar os pontos.'
      )
    } finally {
      setLoadingPoints(false)
    }
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const id = userId.trim()
    if (!id) {
      setErrorMessage('Informe o ID do usuário para consultar o perfil.')
      return
    }

    storeUserId(id)
    setErrorMessage('')
    setMessage('')
    await consultarPontos(id)
  }

  async function handleTicketSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const id = userId.trim()
    const number = ticketNumber.trim()
    if (!id || !number) {
      setErrorMessage('Informe o ID do usuário e o número do novo bilhete.')
      return
    }

    storeUserId(id)
    setSavingTicket(true)
    setErrorMessage('')
    setMessage('')
    try {
      await replaceTicket(id, ticketType, number)
      setMessage('Número do bilhete atualizado com sucesso.')
      setTicketNumber('')
    } catch (requestError) {
      setErrorMessage(
        requestError instanceof Error ? requestError.message : 'Não foi possível atualizar o bilhete.'
      )
    } finally {
      setSavingTicket(false)
    }
  }

  async function handleTripSubmit() {
    const id = userId.trim()
    if (!id) {
      setErrorMessage('Informe o ID do usuário para registrar a viagem.')
      return
    }

    setRegisteringTrip(true)
    setErrorMessage('')
    setMessage('')
    try {
      await registerTrip(id, accountType)
      await consultarPontos(id)
      setMessage('Viagem registrada com sucesso.')
    } catch (requestError) {
      setErrorMessage(
        requestError instanceof Error ? requestError.message : 'Não foi possível registrar a viagem.'
      )
    } finally {
      setRegisteringTrip(false)
    }
  }

  async function handleDeleteAccount() {
    const id = userId.trim()
    if (!id) {
      setErrorMessage('Informe o ID do usuário antes de excluir a conta.')
      return
    }

    setDeleting(true)
    setErrorMessage('')
    setMessage('')
    try {
      await deleteAccount(id)
      clearStoredUserId()
      setUserId('')
      setSummary(null)
      setAuthenticated(false)
      setMessage('Conta excluída com sucesso.')
    } catch (requestError) {
      setErrorMessage(
        requestError instanceof Error ? requestError.message : 'Não foi possível excluir a conta.'
      )
    } finally {
      setDeleting(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="mx-auto my-8 max-w-2xl space-y-8 rounded-[14px] border border-slate-200 bg-[#f0e9fa] p-6 text-slate-800 shadow-sm md:p-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6a27c4]">Sua conta</p>
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Acesse seu perfil</h1>
          <p className="text-lg text-slate-600">Entre ou crie sua conta para acessar seu perfil.</p>
        </header>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-2 border-b border-slate-200" role="tablist" aria-label="Acesso à conta">
            <button
              type="button"
              role="tab"
              aria-selected={authTab === 'login'}
              onClick={() => {
                setAuthTab('login')
                setAuthMessage('')
              }}
              className={`px-4 py-4 font-semibold transition ${authTab === 'login' ? 'border-b-2 border-[#6a27c4] text-[#6a27c4]' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Entrar
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={authTab === 'cadastro'}
              onClick={() => {
                setAuthTab('cadastro')
                setAuthMessage('')
              }}
              className={`px-4 py-4 font-semibold transition ${authTab === 'cadastro' ? 'border-b-2 border-[#6a27c4] text-[#6a27c4]' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Criar conta
            </button>
          </div>

          <div className="space-y-5 p-5 md:p-7">
            {authMessage && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                {authMessage}
              </p>
            )}
            {authTab === 'login' ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h2>
                  <p className="mt-1 text-slate-600">Entre com seu CPF e senha.</p>
                </div>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <label className="block font-semibold text-slate-800">
                    CPF
                    <input
                      className={fieldClassName}
                      type="text"
                      inputMode="numeric"
                      autoComplete="username"
                      placeholder="000.000.000-00"
                      value={loginCpf}
                      onChange={(event) => setLoginCpf(event.target.value)}
                      required
                    />
                  </label>
                  <label className="block font-semibold text-slate-800">
                    Senha
                    <input
                      className={fieldClassName}
                      type="password"
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      required
                    />
                  </label>
                  <button className={buttonClassName} type="submit" disabled={loggingIn}>
                    {loggingIn ? 'Entrando...' : 'Entrar'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Crie sua conta</h2>
              <p className="mt-1 text-slate-600">Preencha seus dados e escolha o tipo de conta.</p>
                </div>
                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  <label className="block font-semibold text-slate-800">
                    Nome
                    <input
                      className={fieldClassName}
                      type="text"
                      autoComplete="name"
                      value={registrationName}
                      onChange={(event) => setRegistrationName(event.target.value)}
                      required
                    />
                  </label>
                  <label className="block font-semibold text-slate-800">
                    CPF
                    <input
                      className={fieldClassName}
                      type="text"
                      inputMode="numeric"
                      autoComplete="username"
                      placeholder="000.000.000-00"
                      value={registrationCpf}
                      onChange={(event) => setRegistrationCpf(event.target.value)}
                      required
                    />
                  </label>
                  <label className="block font-semibold text-slate-800">
                    E-mail
                    <input
                      className={fieldClassName}
                      type="email"
                      autoComplete="email"
                      value={registrationEmail}
                      onChange={(event) => setRegistrationEmail(event.target.value)}
                      required
                    />
                  </label>
                  <label className="block font-semibold text-slate-800">
                    Data de nascimento
                    <input
                      className={fieldClassName}
                      type="date"
                      autoComplete="bday"
                      value={registrationDate}
                      onChange={(event) => setRegistrationDate(event.target.value)}
                      required
                    />
                  </label>
                  <label className="block font-semibold text-slate-800">
                    Telefone
                    <input
                      className={fieldClassName}
                      type="tel"
                      autoComplete="tel"
                      value={registrationPhone}
                      onChange={(event) => setRegistrationPhone(event.target.value)}
                      required
                    />
                  </label>
                  <label className="block font-semibold text-slate-800">
                    Senha
                    <input
                      className={fieldClassName}
                      type="password"
                      autoComplete="new-password"
                      value={registrationPassword}
                      onChange={(event) => setRegistrationPassword(event.target.value)}
                      minLength={1}
                      required
                    />
                  </label>
                  <label className="block font-semibold text-slate-800">
                    Tipo de conta
                    <select
                      className={fieldClassName}
                      value={registrationAccountType}
                      onChange={(event) => setRegistrationAccountType(event.target.value as UserType)}
                    >
                      <option value="comum">Comum</option>
                      <option value="premium">Premium</option>
                    </select>
                  </label>
                  <label className="block font-semibold text-slate-800">
                    Tipo de bilhete
                    <select
                      className={fieldClassName}
                      value={registrationTicketType}
                      onChange={(event) => setRegistrationTicketType(event.target.value as AccountType)}
                    >
                      <option value="comum">Comum</option>
                      <option value="estudante">Estudante</option>
                      <option value="vt">Vale-transporte</option>
                    </select>
                  </label>
                  <button className={buttonClassName} type="submit" disabled={registering}>
                    {registering ? 'Cadastrando...' : 'Criar conta'}
                  </button>
                </form>
              </>
            )}

          </div>
        </section>

        <div className="flex justify-end">
          <button
            className="text-sm text-slate-500 underline underline-offset-2 hover:text-slate-700"
            type="button"
            onClick={() => setAuthenticated(true)}
          >
            Continuar sem login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto my-8 max-w-4xl space-y-8 rounded-[14px] border border-slate-200 bg-[#f0e9fa] p-6 text-slate-800 shadow-sm md:p-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#6a27c4]">Sua conta</p>
        <h1 className="text-3xl font-black text-slate-900 md:text-4xl">Carteira</h1>
        <p className="text-lg text-slate-600">Confira seus pontos e as viagens gratuitas disponíveis.</p>
      </header>

      {errorMessage && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {errorMessage}
        </p>
      )}

      {userId.trim() && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">Seu ID</h2>
          <p className="mt-2 break-all text-xl font-bold text-slate-900">{userId}</p>
        </section>
      )}

      <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-end">
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
          {loadingPoints ? 'Consultando...' : 'Consultar perfil'}
        </button>
      </form>

      <p className="text-sm leading-6 text-slate-600">
        Acompanhe seus pontos, veja quantas viagens gratuitas tem e atualize o número do bilhete nesta página.
      </p>

      {summary && (
        <section aria-label="Resumo da carteira" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-500">Pontos disponíveis</h2>
            <p className="mt-2 break-words text-2xl font-black text-slate-900">{formatPointValue(summary.total)}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-500">Viagens gratuitas disponíveis</h2>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {availablePoints === null ? 'Sem informação' : Math.floor(availablePoints / 100)}
            </p>
            <p className="mt-1 text-sm text-slate-500">Cada 100 pontos pode ser convertido em uma viagem gratuita.</p>
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

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Registrar viagem</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Informe uma viagem feita com bilhete {accountType === 'vt' ? 'vale-transporte' : accountType} para atualizar seus pontos.
          </p>
        </div>
        <button className={buttonClassName} type="button" onClick={handleTripSubmit} disabled={registeringTrip || !userId.trim()}>
          {registeringTrip ? 'Registrando...' : 'Registrar viagem feita'}
        </button>
      </section>

      <form onSubmit={handleTicketSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Trocar número do bilhete</h2>
          <p className="mt-1 text-sm text-slate-600">Use esta opção se perdeu ou precisa substituir seu bilhete.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="font-semibold text-slate-800">
            Tipo de bilhete
            <select className={fieldClassName} value={ticketType} onChange={(event) => setTicketType(event.target.value as AccountType)}>
              <option value="comum">Comum</option>
              <option value="estudante">Estudante</option>
              <option value="vt">Vale-transporte</option>
            </select>
          </label>
          <label className="font-semibold text-slate-800">
            Novo número do bilhete
            <input
              className={fieldClassName}
              value={ticketNumber}
              onChange={(event) => setTicketNumber(event.target.value)}
              autoComplete="off"
              required
            />
          </label>
        </div>
        <button className={buttonClassName} type="submit" disabled={savingTicket || !userId.trim()}>
          {savingTicket ? 'Atualizando...' : 'Atualizar bilhete'}
        </button>
      </form>

      <section className="space-y-3 rounded-xl border border-red-200 bg-white p-5 shadow-sm md:p-6">
        <div>
          <h2 className="text-xl font-bold text-red-800">Excluir conta</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">A exclusão é permanente. Confirme a ação somente se tiver certeza.</p>
        </div>
        <button
          className="rounded-full border border-red-300 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={handleDeleteAccount}
          disabled={deleting || !userId.trim()}
        >
          {deleting ? 'Excluindo...' : 'Excluir minha conta'}
        </button>
      </section>

      {message && <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">{message}</p>}
    </div>
  )
}
