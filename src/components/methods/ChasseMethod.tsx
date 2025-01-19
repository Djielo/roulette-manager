import { FC, useEffect } from 'react';
import { useRouletteStore } from '../../store/useRouletteStore';
import { ChasseMethodState } from '../../types/methods/chasse';

const ChasseMethod: FC = () => {
  const chasseState: ChasseMethodState = useRouletteStore(state => state.chasseState);
  const { deductBets } = useRouletteStore();
  const activeMethod = useRouletteStore(state => state.methods.find(m => m.selected));
  const config = useRouletteStore(state => state.methodConfigs['chasse']);

  const {
    phase,
    remainingObservationTours,
    remainingPlayTours,
    numberCounts,
    selectedNumbers,
  } = chasseState;

  // Déduire les mises à chaque tour de la phase de jeu
  useEffect(() => {
    if (phase === 'play') {
      const bets = selectedNumbers.map(number => ({
        type: 'number' as const,
        value: number,
        amount: config?.betUnit || 0.2,
      }));
  
      if (activeMethod) {
        deductBets(activeMethod.id, bets);
      }
    }
  }, [phase, remainingPlayTours, selectedNumbers, activeMethod, config, deductBets]);

  // Helper pour obtenir la couleur du bouton selon le nombre de sorties
  const getButtonColor = (count: number) => {
    if (count < 2) return 'bg-white text-black';
    if (count === 2) return 'bg-green-400 text-black font-bold';
    return 'bg-red-500 text-black font-bold';
  };

  // Détermine les numéros à afficher en fonction de la phase
  const numbersToDisplay = phase === 'observation'
    ? Object.entries(numberCounts).map(([number]) => parseInt(number))
    : selectedNumbers.slice(0, 3);

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