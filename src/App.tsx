import { Outlet } from 'react-router'
import Cabecalho from './components/Cabecalho'
import Rodape from './components/Rodape'

function App() {
  return (
    <div
      className="flex min-h-screen flex-col bg-[url('/Wallpaper7.png')] bg-cover bg-center font-[Times_New_Roman,Times,serif] text-slate-800 antialiased"
    >
      <Cabecalho />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-2 md:px-6 lg:px-8">
        <Outlet />
      </main>
      <Rodape />
    </div>
  )
}

export default App
