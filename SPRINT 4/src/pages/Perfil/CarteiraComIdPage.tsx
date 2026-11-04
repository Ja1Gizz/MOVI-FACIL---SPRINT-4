import { useParams } from 'react-router'
import PerfilPage from './PerfilPage'

export default function CarteiraComIdPage() {
  const { id } = useParams<{ id: string }>()
  return <PerfilPage key={id} idDaRota={id} />
}
