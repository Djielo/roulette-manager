import { FC } from 'react'
import { RouletteNumber } from '../../types/roulette'
import { useRouletteStore } from '../../store/useRouletteStore'
import BetsOverlay from './BetsOverlay'

interface RouletteTableProps {
  onNumberClick?: (number: RouletteNumber) => void
  highlightedNumbers?: RouletteNumber[]
  bets?: { number: RouletteNumber; amount: number }[]
}

const RouletteTable: FC<RouletteTableProps> = ({ onNumberClick }) => {
  const activeMethod = useRouletteStore(state => state.methods.find(m => m.active))
  const chasseState = useRouletteStore(state => state.chasseState)
  const config = useRouletteStore(state => state.methodConfigs['chasse'])
  const canClickTable = useRouletteStore(state => state.isPlaying);

  const getBets = () => {
    if (!activeMethod) return []

    switch (activeMethod.id) {
      case 'chasse':
        return chasseState.selectedNumbers.map(number => ({
          type: 'number' as const,
          value: number,
          amount: config?.betUnit || 0.2
        }))
      default:
        return []
    }
  }

  const addSpin = useRouletteStore(state => state.addSpin)

  const handleNumberClick = (number: RouletteNumber) => {
    if (!canClickTable) return;
    addSpin(number);
    onNumberClick?.(number);
  };

  const renderNumber = (number: number) => (
    <div
      key={number}
      className={`${getNumberColor(number)} text-white p-4 flex items-center justify-center cursor-pointer hover:opacity-80`}
      onClick={() => handleNumberClick(number as RouletteNumber)}
    >
      {number === 37 ? '00' : number}
    </div>
  )

  const renderText = (text: string, color = 'green') => (
    <div
      key={text}
      className={`bg-roulette-${color} text-white p-4 text-center cursor-pointer hover:opacity-80`}
    >
      {text}
    </div>
  )

  const getNumberColor = (num: number) => {
    if (num === 0 || num === 37) return 'bg-roulette-green'
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
    return redNumbers.includes(num) ? 'bg-roulette-red' : 'bg-roulette-black'
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-0 relative">
      {/* Grille du tapis */}
      <div className="grid grid-cols-14 grid-rows-5 gap-1">
        <div className="row-span-3 grid grid-rows-2 gap-1">
          {[0, 37].map(num => renderNumber(num))}
        </div>

        <div className="col-span-12 row-span-3 grid grid-rows-3 gap-1">
          <div className="grid grid-cols-12 gap-1">
            {[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].map(num => renderNumber(num))}
          </div>
          <div className="grid grid-cols-12 gap-1">
            {[2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].map(num => renderNumber(num))}
          </div>
          <div className="grid grid-cols-12 gap-1">
            {[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].map(num => renderNumber(num))}
          </div>
        </div>

        <div className="row-span-3 col-start-14 grid grid-rows-3 gap-1">
          {['C3', 'C2', 'C1'].map(text => renderText(text))}
        </div>

        <div className="row-span-2 row-start-4" />

        <div className="col-span-12 row-start-4 grid grid-cols-3 gap-1">
          {['1ère Douzaine', '2ème Douzaine', '3ème Douzaine'].map(text => renderText(text))}
        </div>

        <div className="col-span-12 col-start-2 row-start-5 grid grid-cols-6 gap-1">
          {[
            { text: '1-18', color: 'green' },
            { text: 'PAIR', color: 'green' },
            { text: 'ROUGE', color: 'red' },
            { text: 'NOIR', color: 'black' },
            { text: 'IMPAIR', color: 'green' },
            { text: '19-36', color: 'green' }
          ].map(({ text, color }) => renderText(text, color))}
        </div>

        <div className="row-span-2 col-start-14 row-start-4" />
      </div>
      <div
        className="absolute  pointer-events-none"
        style={{
          left: '19px',    // équivalent au padding gauche
          right: '19px',   // équivalent au padding droit
          top: '16px',     // équivalent au padding haut
          bottom: '0',     // équivalent à pb-0
        }}
      >
        <BetsOverlay bets={getBets()} />
      </div>
    </div>
  )
}

export default RouletteTable