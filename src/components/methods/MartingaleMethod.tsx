import { FC, useState } from 'react'
//import { useRouletteStore } from '../../store/useRouletteStore'
import { MartingaleConfig } from '../../types/methods/martingale'

const DEFAULT_SEQUENCE = [1, 1, 1, 2, 3, 5, 8, 17, 35]

const MartingaleMethod: FC = () => {
  const [config, setConfig] = useState<MartingaleConfig>({
    sequence: DEFAULT_SEQUENCE,
    currentIndex: 0,
    betUnit: 0.2
  })
  
  const currentBet = config.sequence[config.currentIndex] * config.betUnit

  return (
    <div className="p-4">
      <h3 className="text-roulette-gold text-xl mb-4">Martingale Progressions</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-roulette-gold/80 text-sm">Mise de base</label>
          <div className="text-white text-2xl">{config.betUnit}€</div>
        </div>
        <div>
          <label className="text-roulette-gold/80 text-sm">Mise actuelle</label>
          <div className="text-white text-2xl">{currentBet.toFixed(2)}€</div>
        </div>
      </div>
    </div>
  )
}

export default MartingaleMethod