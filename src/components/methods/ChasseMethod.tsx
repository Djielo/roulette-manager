import { FC } from 'react';
import { useRouletteStore } from '../../store/useRouletteStore';
import { ChasseMethodState } from '../../types/methods/chasse';

const ChasseMethod: FC = () => {
  const chasseState: ChasseMethodState = useRouletteStore(state => state.chasseState);
  const {
    phase,
    remainingObservationTours,
    remainingPlayTours,
    numberCounts,
    selectedNumbers,
  } = chasseState;

  // Helper pour obtenir la couleur du bouton selon le nombre de sorties
  const getButtonColor = (count: number) => {
    if (count < 2) return 'bg-white text-black'; // Bouton blanc pour les numéros sortis moins de 2 fois
    if (count === 2) return 'bg-green-400 text-black font-bold'; // Bouton vert pour les numéros sortis exactement 2 fois
    return 'bg-red-500 text-black font-bold'; // Bouton rouge pour les numéros sortis plus de 2 fois
  };

  // Détermine les numéros à afficher en fonction de la phase
  const numbersToDisplay = phase === 'observation'
    ? Object.entries(numberCounts).map(([number]) => parseInt(number)) // Affiche tous les numéros pendant l'observation
    : selectedNumbers.slice(0, 3); // Affiche uniquement les numéros éligibles pendant le jeu

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
        {numbersToDisplay.map((number) => (
          <button
            key={number}
            className={`p-2 text-center border border-roulette-gold/30 rounded transition-colors duration-200 font-bold ${getButtonColor(numberCounts[number]?.count || 0)}`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChasseMethod;