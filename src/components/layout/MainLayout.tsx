import { FC, ReactNode } from 'react'
import DevTools from '../debug/DevTools'
import Alert from '../shared/Alert';

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-roulette-navy">
      <Alert />
      <header className="border-b border-roulette-gold/30">
        <div className="max-w-7xl ml-0 mr-auto py-4 px-4">
          <h1 className="text-2xl font-bold text-roulette-gold">Gestionnaire de Méthodes Roulette</h1>
        </div>
      </header>
      <main className="max-w-full max-h-max py-4 px-4">
        {children}
      </main>
      {import.meta.env.DEV && <DevTools />}
    </div>
  )
}

export default MainLayout