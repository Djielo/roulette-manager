import { FC } from 'react'
import RouletteTable from '../roulette/RouletteTable'
import MartingaleMethod from './MartingaleMethod'
import TempOverlayTest from '../roulette/TempOverlayTest'

const MethodView: FC = () => {
  return (
    <div className="h-full p-4 flex flex-col">
      {/* En-tête méthode */}
      <div className="mb-4 border-b border-roulette-gold/30 pb-4">
        <div className="text-roulette-gold text-xl">Martingale Progressions</div>
      </div>

      {/* Section principale */}
      <div className='flex gap-4 flex-1 border-b-2 border-roulette-gold/30'>
        {/* Bloc gauche */}
        <div className="flex-1">
          {/* Zone de la méthode active */}
          <MartingaleMethod />
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