import { FC, useState } from 'react'

import { useRouletteStore } from '../../store/useRouletteStore'
import HistoryDisplay from '../history/HistoryDisplay'
import MethodConfig from '../config/MethodConfig'
import MethodsModal from '../modal/MethodsModal'

const MethodManager: FC = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'stats' | 'trends'>('history')
  const [configMethodId, setConfigMethodId] = useState<string | null>(null)
  const [methodsModalOpen, setMethodsModalOpen] = useState(false)
  const {
    capital,
    timer,
    limits,
    setCapital,
    setTimer,
    setMaxLoss,
    setTargetProfit,
    togglePlay,
    reset,
    sessionLocked,
  } = useRouletteStore()

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="border-2 border-roulette-gold/30 p-4 rounded-lg">
        {/* Capital */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-roulette-gold">Gestion  du Capital</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-roulette-gold/80 text-sm">Capital Initial:</label>
              <input
                type="text"
                inputMode="decimal"
                disabled={sessionLocked}
                value={capital.initial === 0 ? '' : capital.initial.toString()}
                onKeyDown={(e) => {
                  if (e.key === '.') {
                    e.preventDefault();
                    const cursorPosition = e.currentTarget.selectionStart || 0;
                    const currentValue = e.currentTarget.value;
                    const newValue = !currentValue.includes(',') ?
                      currentValue.slice(0, cursorPosition) + ',' + currentValue.slice(cursorPosition) :
                      currentValue;
                    e.currentTarget.value = newValue;
                    setTimeout(() => {
                      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = cursorPosition + 1;
                    }, 0);
                  }
                }}
                onChange={(e) => {
                  let inputValue = e.target.value.replace(',', '.');
                  const regex = /^\d*(\.\d{0,2})?$/;
                  if (regex.test(inputValue) || inputValue === '') {
                    setCapital('initial', inputValue === '' ? '' : inputValue);
                  }
                }}
                onBlur={() => {
                  const currentValue = String(capital.initial);
                  if (currentValue === '' || currentValue === '.') {
                    setCapital('initial', 0);
                  } else {
                    let normalizedValue = parseFloat(String(capital.initial).replace(',', '.'));
                    normalizedValue = Math.max(0.01, normalizedValue);
                    setCapital('initial', Number(normalizedValue.toFixed(2)));
                  }
                }}
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
          <h3 className="font-semibold mb-2 text-roulette-gold">Gestion de la sécurité</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-roulette-gold/80 text-sm">Temps (min):</label>
              <input
                type="number"
                disabled={sessionLocked}
                value={timer.duration}
                onChange={e => setTimer(+e.target.value)}
                className="bg-roulette-navy border border-roulette-gold/30 p-1 rounded w-full text-white"
              />
            </div>
            <div>
              <label className="block text-roulette-gold/80 text-sm">Perte max (%):</label>
              <input
                type="number"
                disabled={sessionLocked}
                value={limits.maxLoss}
                onChange={e => setMaxLoss(+e.target.value)}
                className="bg-roulette-navy border border-roulette-gold/30 p-1 rounded w-full text-white"
              />
            </div>
            <div>
              <label className="block text-roulette-gold/80 text-sm">Objectif gain (%):</label>
              <input
                type="number"
                disabled={sessionLocked}
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
            <h3 className="font-semibold mb-2 text-roulette-gold">Gestion de la session</h3>
            <div className="mb-4">
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-between gap-2">
          <div className="flex gap-2">
            <button
              className={`bg-roulette-green text-white px-4 py-2 rounded border border-roulette-gold/30 hover:border-roulette-gold ${sessionLocked ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              onClick={togglePlay}
              disabled={sessionLocked}
            >
              Démarrer
            </button>
            <button
              className="bg-gray-700 text-white px-4 py-2 rounded border border-roulette-gold/30 hover:border-roulette-gold"
              onClick={reset}
            >
              Réinitialiser
            </button>
          </div>
          <button
            className="bg-roulette-navy text-white px-4 py-2 rounded border border-roulette-gold/30 hover:border-roulette-gold"
            onClick={() => setMethodsModalOpen(true)}
            disabled={sessionLocked}
          >
            Gérer les méthodes
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
            Historique
          </button>
          <button
            className={`text-roulette-gold/80 px-4 py-2 ${activeTab === 'stats' ? 'border-b-2 border-roulette-gold' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistiques des méthodes
          </button>
          <button
            className={`text-roulette-gold/80 px-4 py-2 ${activeTab === 'trends' ? 'border-b-2 border-roulette-gold' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            Tendances de la session
          </button>
        </div>

        <div className="bg-roulette-roi p-4 rounded h-[calc(100%-3.5rem)]">
          {activeTab === 'history' && <HistoryDisplay />}
          {activeTab === 'stats' && <div className='color: text-white'>Statistiques des méthodes</div>}
          {activeTab === 'trends' && <div className='color: text-white'>Tendances de la session</div>}
        </div>
      </div>

      {/* Composant de configuration */}
      <MethodConfig
        methodId={configMethodId!}
        isOpen={configMethodId !== null}
        onClose={() => setConfigMethodId(null)}
      />

      <MethodsModal
        isOpen={methodsModalOpen}
        onClose={() => setMethodsModalOpen(false)}
        configMethodId={configMethodId}
        setConfigMethodId={setConfigMethodId}
      />
    </div>
  )
}

export default MethodManager