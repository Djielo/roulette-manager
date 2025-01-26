import { FC } from 'react';
import RouletteTable from '../roulette/RouletteTable';
import ChasseMethod from './ChasseMethod';
import SDCMethod from './SDCMethod'
import { useRouletteStore } from '../../store/useRouletteStore';
import type { Method } from '../../types/methodsTypes';

const MethodView: FC = () => {
  const store = useRouletteStore();
  const activeMethodId = store.activeMethodId;
  const activeMethod = store.methods.find((m: Method) => m.id === activeMethodId);
  const methodCapital = activeMethod ? store.methodCapital[activeMethod.id] : null;
  const globalCapital = store.capital;

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
                {methodCapital ? `${typeof methodCapital.initial === 'number' ? methodCapital.initial.toFixed(2) : '0.00'}€` : 'N/A'}
              </div>
            </div>
            <div className="bg-roulette-roi p-2 rounded-lg">
              <div className="text-sm text-roulette-gold/80">Capital Actuel</div>
              <div className="text-white">
                {methodCapital ? `${typeof methodCapital.current === 'number' ? methodCapital.current.toFixed(2) : '0.00'}€` : 'N/A'}
              </div>
            </div>
            <div className="bg-roulette-roi p-2 rounded-lg">
              <div className="text-sm text-roulette-gold/80">Évolution</div>
              <div className={`${globalCapital?.evolution?.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {globalCapital?.evolution?.amount >= 0 ? '+' : ''}
                {globalCapital?.evolution?.amount?.toFixed(2) ?? '0.00'}€
                ({globalCapital?.evolution?.percentage?.toFixed(1) ?? '0.0'}%)
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