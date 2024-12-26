// App.tsx
import { FC } from 'react'
import MainLayout from './components/layout/MainLayout'
import MethodManager from './components/manager/MethodManager'
// import RouletteTable from './components/roulette/RouletteTable'
import MethodView from '../src/components/methods/MethodView'

const App: FC = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-[1fr_1.6fr] gap-4 min-h-[calc(100vh-7rem)] mb-2">
        <div className="flex flex-col gap-4">
          {/* Manager */}
          <MethodManager />
        </div>

        {/* Section méthodes */}
        <div className="border-2 border-roulette-gold/30 rounded-lg">
          <MethodView />
        </div>
      </div>
    </MainLayout>
  )
}

export default App