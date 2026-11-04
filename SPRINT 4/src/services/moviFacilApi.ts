const API_URL = 'https://movifacil-api.onrender.com'
const moneyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
})

export type AccountType = 'comum' | 'estudante' | 'vt'
export type UserType = 'comum' | 'premium'

export type ApiResponse =
  | string
  | number
  | boolean
  | null
  | ApiResponse[]
  | { [key: string]: ApiResponse }

export type UserResponse = Record<string, ApiResponse> & {
  id?: ApiResponse
  idUsuario?: ApiResponse
  usuarioId?: ApiResponse
  userId?: ApiResponse
  usuario?: ApiResponse
  user?: ApiResponse
}

export interface PointSummary {
  total: ApiResponse
  metro: ApiResponse
  onibus: ApiResponse
}

export interface RegistrationData {
  nome: string
  cpf: string
  senha: string
  email: string
  data: string
  telefone: string
  tipo: UserType
  tipoBilhete: AccountType
}

async function fazerRequisicao(caminho: string, metodo = 'GET', dados?: object): Promise<ApiResponse> {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    method: metodo,
    headers: dados === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: dados === undefined ? undefined : JSON.stringify(dados)
  })

  const texto = await resposta.text()

  if (!resposta.ok) {
    let detalhe = texto

    try {
      const respostaJson = JSON.parse(texto) as ApiResponse
      const mensagem = isUserResponse(respostaJson)
        ? respostaJson.message ?? respostaJson.error ?? respostaJson.detail
        : null
      if (typeof mensagem === 'string') {
        detalhe = mensagem
      }
    } catch {
      // A resposta pode ser texto simples.
    }

    throw new Error(
      detalhe
        ? `${resposta.status}: ${detalhe.slice(0, 400)}`
        : `${resposta.status} ${resposta.statusText}`
    )
  }

  if (!texto) return null

  try {
    return JSON.parse(texto) as ApiResponse
  } catch {
    return texto
  }
}

function isUserResponse(value: ApiResponse): value is UserResponse {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function idParaUrl(id: string): string {
  return encodeURIComponent(id.trim())
}

export function registerUser(dados: RegistrationData): Promise<ApiResponse> {
  const dadosCadastro = {
    ...dados,
    cpf: dados.cpf.replace(/\D/g, '')
  }

  return fazerRequisicao(`/usuario/cadastro/${dados.tipoBilhete}`, 'POST', dadosCadastro).then((resposta) => {
    if (resposta === null || resposta === '') {
      throw new Error('O servidor não retornou uma confirmação do cadastro.')
    }

    return resposta
  })
}

export function loginUser(cpf: string, password: string): Promise<ApiResponse> {
  const parametros = new URLSearchParams({
    cpf: cpf.replace(/\D/g, ''),
    senha: password
  })

  return fazerRequisicao(`/usuario/login?${parametros.toString()}`, 'POST')
}

export function getUserId(resposta: ApiResponse): string | null {
  if (typeof resposta === 'number' && Number.isFinite(resposta)) {
    return String(resposta)
  }

  if (typeof resposta === 'string' && /^\d+$/.test(resposta.trim())) {
    return resposta.trim()
  }

  if (!isUserResponse(resposta)) {
    return null
  }

  const id = resposta.id ?? resposta.idUsuario ?? resposta.usuarioId ?? resposta.userId
  if (typeof id === 'string' || typeof id === 'number') {
    return String(id)
  }

  const contaInterna = resposta.usuario ?? resposta.user
  return contaInterna ? getUserId(contaInterna) : null
}

export function getPointSummary(id: string): Promise<PointSummary> {
  const idFormatado = idParaUrl(id)

  return Promise.all([
    fazerRequisicao(`/carteira/${idFormatado}/pontos`),
    fazerRequisicao(`/carteira/${idFormatado}/pontos/metro`),
    fazerRequisicao(`/carteira/${idFormatado}/pontos/onibus`)
  ]).then(([total, metro, onibus]) => {
    if ([total, metro, onibus].some((valor) => valor === null || valor === '')) {
      throw new Error('O servidor retornou uma resposta vazia ao consultar os pontos.')
    }

    return { total, metro, onibus }
  })
}

export function redeemDiscount(
  id: string,
  transport: 'metro' | 'onibus',
  category: 'comum' | 'estudante' | 'vt',
  discount: 25 | 50 | 100
): Promise<ApiResponse> {
  return fazerRequisicao(
    `/carteira/${idParaUrl(id)}/descontos/${transport}-${category}/${discount}`,
    'POST'
  )
}

export function registerTrip(id: string, accountType: AccountType): Promise<ApiResponse> {
  return fazerRequisicao(`/carteira/${idParaUrl(id)}/viagem-feita/${accountType}`, 'POST')
}

export function replaceTicket(id: string, category: string, ticketNumber: string): Promise<ApiResponse> {
  const query = new URLSearchParams({
    tipoNovo: category,
    bilheteNovo: ticketNumber
  })

  return fazerRequisicao(`/carteira/${idParaUrl(id)}/bilhete/trocar?${query.toString()}`, 'POST')
}

export function deleteAccount(id: string): Promise<ApiResponse> {
  return fazerRequisicao(`/usuario/${idParaUrl(id)}/delete`, 'DELETE')
}

export function formatPointValue(valor: ApiResponse): string {
  if (typeof valor === 'number') {
    return `${valor} pontos`
  }

  if (typeof valor === 'string') {
    const texto = valor.trim()
    if (!texto) return 'Sem informação'

    const quantidade = Number(texto)
    return Number.isNaN(quantidade) ? valor : `${quantidade} pontos`
  }

  if (valor && typeof valor === 'object') {
    const campoDePontos = Object.entries(valor).find(([chave]) =>
      /ponto|saldo|valor|point/i.test(chave)
    )

    if (campoDePontos) {
      return formatPointValue(campoDePontos[1])
    }
  }

  return valor == null ? 'Sem informação' : String(valor)
}

export function formatFare(valor: ApiResponse): string {
  if (typeof valor === 'number' && Number.isFinite(valor)) {
    return moneyFormatter.format(valor)
  }

  if (typeof valor === 'string') {
    const texto = valor.trim()
    if (!texto) return 'Sem informação'

    const tarifa = Number(texto.replace(',', '.'))
    return Number.isNaN(tarifa) ? texto : moneyFormatter.format(tarifa)
  }

  if (valor && typeof valor === 'object') {
    const campoDeTarifa = Object.entries(valor).find(([chave]) =>
      /valor|tarifa|preco|price|fare/i.test(chave)
    )

    if (campoDeTarifa) {
      return formatFare(campoDeTarifa[1])
    }
  }

  return valor == null ? 'Sem informação' : String(valor)
}

export function getPointCount(valor: ApiResponse): number | null {
  if (typeof valor === 'number' && Number.isFinite(valor)) {
    return Math.max(0, Math.floor(valor))
  }

  if (typeof valor === 'string') {
    const quantidade = Number(valor.replace(',', '.'))
    return Number.isFinite(quantidade) ? Math.max(0, Math.floor(quantidade)) : null
  }

  if (valor && typeof valor === 'object') {
    const campoDePontos = Object.entries(valor).find(([chave]) =>
      /ponto|saldo|point|total/i.test(chave)
    )

    return campoDePontos ? getPointCount(campoDePontos[1]) : null
  }

  return null
}