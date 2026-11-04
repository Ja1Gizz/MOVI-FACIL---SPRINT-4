import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import HomePage from './pages/Home/HomePage.tsx'
import SobrePage from './pages/Sobre/SobrePage.tsx'
import IntegrantesPage from './pages/Integrantes/IntegrantesPage.tsx'
import FAQPage from './pages/FAQ/FAQPage.tsx'
import ContatoPage from './pages/Contato/ContatoPage.tsx'
import PerfilPage from './pages/Perfil/PerfilPage.tsx'
import TrocaDePontosPage from './pages/TrocaDePontos/TrocaDePontosPage.tsx'
import NaoEncontradaPage from './pages/NaoEncontrada/NaoEncontradaPage.tsx'
import CarteiraComIdPage from './pages/Perfil/CarteiraComIdPage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/sobre', element: <SobrePage /> },
      { path: '/integrantes', element: <IntegrantesPage /> },
      { path: '/faq', element: <FAQPage /> },
      { path: '/contato', element: <ContatoPage /> },
      { path: '/perfil', element: <PerfilPage /> },
      { path: '/troca-de-pontos', element: <TrocaDePontosPage /> },
      { path: '/carteira/:id', element: <CarteiraComIdPage /> },
      { path: '*', element: <NaoEncontradaPage /> }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
