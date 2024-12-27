import { FC, useState } from 'react'
import { useRouletteStore } from '../../store/useRouletteStore'

const DevTools: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const store = useRouletteStore()

  return (
    <div className="fixed bottom-0 right-0 z-50">
      {/* Bouton Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-4 py-2 rounded-tl-lg hover:bg-gray-700"
      >
        {isOpen ? 'Fermer DevTools' : 'Ouvrir DevTools'}
      </button>

      {/* Panneau DevTools */}
      {isOpen && (
        <div className="bg-gray-800 text-white p-4 w-96 h-96 overflow-auto">
          <div className="grid grid-cols-1 gap-4">
            {/* Capital */}
            <div>
              <h3 className="text-roulette-gold font-bold mb-2">Capital</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Initial: {store.capital.initial}€</div>
                <div>Actuel: {store.capital.current}€</div>
                <div>Évolution: {store.capital.evolution.amount}€</div>
                <div>%: {store.capital.evolution.percentage.toFixed(2)}%</div>
              </div>
            </div>

            {/* Timer */}
            <div>
              <h3 className="text-roulette-gold font-bold mb-2">Timer</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Durée: {store.timer.duration}min</div>
                <div>Restant: {store.timer.remaining}min</div>
              </div>
            </div>

            {/* Historique */}
            <div>
              <h3 className="text-roulette-gold font-bold mb-2">Historique</h3>
              <div className="text-sm flex flex-wrap gap-1">
                {store.history.map((spin) => (
                  <span key={spin.timestamp} className="bg-gray-700 px-2 py-1 rounded">
                    {spin.number}
                  </span>
                ))}
              </div>
            </div>

            {/* État Global */}
            <div>
              <h3 className="text-roulette-gold font-bold mb-2">État</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>En jeu: {store.isPlaying ? 'Oui' : 'Non'}</div>
                <div>Cyclique: {store.cyclicMode ? 'Oui' : 'Non'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DevTools