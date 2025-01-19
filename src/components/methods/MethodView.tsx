import { FC } from 'react';
import RouletteTable from '../roulette/RouletteTable';
import ChasseMethod from './ChasseMethod';
import SDCMethod from './SDCMethod'
import { useRouletteStore } from '../../store/useRouletteStore';

const MethodView: FC = () => {
  const activeMethodId = useRouletteStore(state => state.activeMethodId); // Récupérer activeMethodId
  const activeMethod = useRouletteStore(state =>
    state.methods.find(m => m.id === activeMethodId) // Trouver la méthode active
  );

  // Récupère les capitaux de la méthode active
  const methodCapital = useRouletteStore(state =>
    activeMethod ? state.methodCapital[activeMethod.id] : null
  );

  // Récupère le capital global pour l'évolution
  const globalCapital = useRouletteStore(state => state.capital);

  const renderActiveMethod = () => {
    if (!activeMethod) return null;

    switch (activeMethod.id) {
      case 'chasse':
        return <ChasseMethod />;
      case 'sdc':
        return <SDCMethod />; // Assurez-vous d'avoir un composant SDCMethod
      default:
        return null;
    }
  };

  return (
    <div key={activeMethodId} className="h-full p-4 flex flex-col"> {/* Utilisez activeMethodId comme clé */}
      {/* En-tête méthode */}
      <div className="mb-4 border-b border-roulette-gold/30 pb-4">
        <div className="text-roulette-gold text-xl">
          {activeMethod?.name || 'Sélectionnez une méthode'}
        </div>
      </div>

      {/* Section principale */}
      <div className='flex gap-4 flex-1 border-b-2 border-roulette-gold/30'>
        {/* Bloc gauche */}
        <div className="flex-1">
          {/* Zone de la méthode active */}
          {renderActiveMethod()}
        </div>

        {/* Capitaux à droite */}
        <div className="w-36">
          <div className="flex flex-col gap-2">
            <div className="bg-roulette-roi p-2 rounded-lg">
              <div className="text-sm text-roulette-gold/80">Capital Initial</div>
              <div className="text-white">
                {methodCapital ? `${methodCapital.initial.toFixed(2)}€` : 'N/A'}
              </div>
            </div>
            <div className="bg-roulette-roi p-2 rounded-lg">
              <div className="text-sm text-roulette-gold/80">Capital Actuel</div>
              <div className="text-white">
                {methodCapital ? `${methodCapital.current.toFixed(2)}€` : 'N/A'}
              </div>
            </div>
            <div className="bg-roulette-roi p-2 rounded-lg">
              <div className="text-sm text-roulette-gold/80">Évolution</div>
              <div className={`${globalCapital.evolution.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {globalCapital.evolution.amount >= 0 ? '+' : ''}{globalCapital.evolution.amount.toFixed(2)}€ ({globalCapital.evolution.percentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table de roulette */}
      <div className="mt-1">
        <RouletteTable />
      </div>
    </div>
  );
};

export default MethodView;