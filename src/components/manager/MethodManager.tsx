import { FC, useState } from 'react'
import { useRouletteStore } from '../../store/useRouletteStore'
import HistoryDisplay from '../history/HistoryDisplay'
import { Method } from '../../types/methods'

const MethodManager: FC = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'stats' | 'trends'>('history')
  const {
    capital,
    timer,
    limits,
    methods,
    isPlaying,
    cyclicMode,
    setCapital,
    setTimer,
    setMaxLoss,
    setTargetProfit,
    toggleMethod,
    toggleCyclicMode,
    togglePlay,
    reset
  } = useRouletteStore()

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="border-2 border-roulette-gold/30 p-4 rounded-lg">
        {/* Capital */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-roulette-gold">Suivi du Capital</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-roulette-gold/80 text-sm">Capital Initial:</label>
              <input
                type="number"
                value={capital.initial}
                onChange={e => setCapital('initial', +e.target.value)}
                className="bg-roulette-navy border border-roulette-gold/30 p-1 rounded w-full text-white"
              />
            </div>
            <div>
              <label className="block text-roulette-gold/80 text-sm">Capital Actuel:</label>
              <div className="p-2 bg-roulette-navy border border-roulette-gold/30 rounded text-white">
                {capital.current.toFixed(2)}€
              </div>
            </div>
            <div>
              <label className="block text-roulette-gold/80 text-sm">Évolution:</label>
              <div className="p-2 bg-roulette-navy border border-roulette-gold/30 rounded text-white">
                <span className={capital.evolution.amount >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {capital.evolution.amount >= 0 ? '+' : ''}{capital.evolution.amount.toFixed(2)}€
                  ({capital.evolution.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-roulette-gold">Contrôles</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-roulette-gold/80 text-sm">Temps (min):</label>
              <input
                type="number"
                value={timer.duration}
                onChange={e => setTimer(+e.target.value)}
                className="bg-roulette-navy border border-roulette-gold/30 p-1 rounded w-full text-white"
              />
            </div>
            <div>
              <label className="block text-roulette-gold/80 text-sm">Perte max (%):</label>
              <input
                type="number"
                value={limits.maxLoss}
                onChange={e => setMaxLoss(+e.target.value)}
                className="bg-roulette-navy border border-roulette-gold/30 p-1 rounded w-full text-white"
              />
            </div>
            <div>
              <label className="block text-roulette-gold/80 text-sm">Objectif gain (%):</label>
              <input
                type="number"
                value={limits.targetProfit}
                onChange={e => setTargetProfit(+e.target.value)}
                className="bg-roulette-navy border border-roulette-gold/30 p-1 rounded w-full text-white"
              />
            </div>
          </div>
        </div>

        {/* Méthodes */}
        <div className="mb-4">
          <div className='flex justify-between'>
            <h3 className="font-semibold mb-2 text-roulette-gold">Gestion des Méthodes</h3>
            {/* Mode cyclique */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={cyclicMode}
                  onChange={toggleCyclicMode}
                  className="rounded border-roulette-gold/30"
                />
                <span>Mode cyclique</span>
              </label>
            </div>
          </div>

          {methods.map((method: Method) => (
            <div key={method.id} className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={method.active}
                  onChange={() => toggleMethod(method.id)}
                  className="rounded border-roulette-gold/30"
                />
                <span>{method.name}</span>
              </label>
            </div>
          ))}
        </div>

        {/* Boutons */}
        <div className="flex justify-between gap-2">
          <button
            className={`${isPlaying ? 'bg-roulette-red' : 'bg-roulette-green'} text-white px-4 py-2 rounded border border-roulette-gold/30 hover:border-roulette-gold`}
            onClick={togglePlay}
          >
            {isPlaying ? 'Arrêter' : 'Démarrer'}
          </button>
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded border border-roulette-gold/30 hover:border-roulette-gold"
            onClick={reset}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Section historique et stats */}
      <div className="border-2 border-roulette-gold/30 p-4 rounded-lg flex-1">
        <div className="flex gap-4 mb-4">
          <button
            className={`text-roulette-gold/80 px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-roulette-gold' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Derniers Numéros
          </button>
          <button
            className={`text-roulette-gold/80 px-4 py-2 ${activeTab === 'stats' ? 'border-b-2 border-roulette-gold' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistiques
          </button>
          <button
            className={`text-roulette-gold/80 px-4 py-2 ${activeTab === 'trends' ? 'border-b-2 border-roulette-gold' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            Tendances
          </button>
        </div>

        <div className="bg-roulette-roi p-4 rounded h-[calc(100%-3.5rem)]">
          {activeTab === 'history' && <HistoryDisplay />}
          {activeTab === 'stats' && <div>Statistiques des méthodes</div>}
          {activeTab === 'trends' && <div>Tendances de la session</div>}
        </div>
      </div>
    </div>
  )
}

export default MethodManager