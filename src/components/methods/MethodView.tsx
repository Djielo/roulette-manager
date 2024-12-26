import { FC } from 'react'
import RouletteTable from '../roulette/RouletteTable'

const MethodView: FC = () => {
  return (
    <div className="h-full p-4 flex flex-col">
      {/* En-tête méthode */}
      <div className="mb-4 border-b border-roulette-gold/30 pb-4">
        <div className="text-roulette-gold text-xl">chasse-aux-numeros</div>
      </div>

      {/* Section principale - prend tout l'espace disponible jusqu'au tapis */}
      <div className='flex gap-4 flex-1 border-b-2 border-roulette-gold/30'>
        {/* Bloc gauche avec Mise de base et Phase actuelle */}
        <div className="flex-1">
          {/* Infos méthode */}
          <div className="mb-4 border border-roulette-gold/30 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-roulette-gold/80 text-sm">Mise de base</label>
                <div className="text-white text-2xl">0.5€</div>
              </div>
              <div>
                <label className="text-roulette-gold/80 text-sm">Profit méthode</label>
                <div className="text-white text-2xl">0.00€</div>
              </div>
            </div>
          </div>

          {/* Phase et sélection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-roulette-roi p-4 rounded-lg">
              <h4 className="text-roulette-gold mb-2">Phase actuelle</h4>
              <div className="text-yellow-500 mb-1">Observation</div>
              <div className="text-white/70">9 tours restants</div>
            </div>
            <div className="bg-roulette-roi p-4 rounded-lg">
              <h4 className="text-roulette-gold mb-2">Numéros sélectionnés</h4>
              <div className="flex gap-2">
                <span className="text-white">10</span>
                <span className="text-white">16</span>
                <span className="text-white">25</span>
              </div>
            </div>
          </div>
        </div>

        {/* Capitaux à droite */}
        <div className="w-36">
          <div className="flex flex-col gap-2">
            <div className="bg-roulette-roi p-2 rounded-lg">
              <div className="text-sm text-roulette-gold/80">Capital Initial</div>
              <div className="text-white">30.00€</div>
            </div>
            <div className="bg-roulette-roi p-2 rounded-lg">
              <div className="text-sm text-roulette-gold/80">Capital Actuel</div>
              <div className="text-white">30.00€</div>
            </div>
            <div className="bg-roulette-roi p-2 rounded-lg">
              <div className="text-sm text-roulette-gold/80">Évolution</div>
              <div className="text-green-500">+0.00€ (0.0%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Table de roulette */}
      <div className="mt-1">
        <RouletteTable />
      </div>
    </div>
  )
}

export default MethodView