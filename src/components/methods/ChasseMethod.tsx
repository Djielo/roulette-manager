import { FC } from 'react'
import { useRouletteStore } from '../../store/useRouletteStore'
import { ChasseMethodState } from '../../types/methods/chasse'

const ChasseMethod: FC = () => {
  // État et config de la méthode
  const chasseState: ChasseMethodState = useRouletteStore(state => state.chasseState)
  const {
    phase,
    remainingObservationTours,
    remainingPlayTours,
    numberCounts,
  } = chasseState

  // Helper pour obtenir la couleur selon le nombre de sorties
  const getNumberColor = (count: number) => {
    if (count < 2) return 'text-white'
    if (count === 2) return 'text-green-300'
    return 'text-red-500'
  }

  return (
    <div className="p-4">
      {/* En-tête avec phase et tours restants */}
      <div className="mb-4 text-center">
        <div className="text-roulette-gold text-xl">
          Phase : {phase === 'observation' ? 'Observation' : 'Jeu'}
        </div>
        <div className="text-white/70">
          {phase === 'observation'
            ? `${remainingObservationTours} tours d'observation restants`
            : `${remainingPlayTours} tours de jeu restants`
          }
        </div>
      </div>

      {/* Affichage des numéros */}
      <div className="grid grid-cols-6 gap-2">
        {history.length > 0 && Object.entries(numberCounts).map(([number, data]) => (
          <div
            key={number}
            className={`${getNumberColor(data.count)} p-2 text-center border border-roulette-gold/30 rounded`}
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChasseMethod