import { FC } from 'react'
import { RouletteNumber } from '../../types/roulette'
import { useRouletteStore } from '../../store/useRouletteStore'
import BetsOverlay from './BetsOverlay'
import TempOverlayTest from './TempOverlayTest'

interface RouletteTableProps {
  onNumberClick?: (number: RouletteNumber) => void
  highlightedNumbers?: RouletteNumber[]
  bets?: { number: RouletteNumber; amount: number }[]
}

const RouletteTable: FC<RouletteTableProps> = ({ onNumberClick }) => {
  const addSpin = useRouletteStore(state => state.addSpin)

  const handleNumberClick = (number: RouletteNumber) => {
    addSpin(number)
    onNumberClick?.(number)
  }

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

      {/* Overlay temporaire */}
      <div className="absolute" style={{
        left: '19px',    // équivalent au padding gauche
        right: '19px',   // équivalent au padding droit
        top: '16px',     // équivalent au padding haut
        bottom: '0'      // équivalent à pb-0
      }}>

        <BetsOverlay bets={[
          // Chances simples
          { type: 'simple', value: '1-18', amount: 1 },
          { type: 'simple', value: 'PAIR', amount: 2 },
          { type: 'simple', value: 'ROUGE', amount: 3 },
          { type: 'simple', value: 'NOIR', amount: 4 },
          { type: 'simple', value: 'IMPAIR', amount: 5 },
          { type: 'simple', value: '19-36', amount: 6 },

          // Numéros pleins
          { type: 'number', value: 0, amount: 10 },
          { type: 'number', value: 37, amount: 11 },
          { type: 'number', value: 1, amount: 12 },
          { type: 'number', value: 2, amount: 13 },
          { type: 'number', value: 3, amount: 14 },
          { type: 'number', value: 4, amount: 15 },
          { type: 'number', value: 5, amount: 16 },
          { type: 'number', value: 6, amount: 17 },
          { type: 'number', value: 7, amount: 18 },
          { type: 'number', value: 8, amount: 19 },
          { type: 'number', value: 9, amount: 20 },
          { type: 'number', value: 10, amount: 21 },
          { type: 'number', value: 11, amount: 22 },
          { type: 'number', value: 12, amount: 23 },
          { type: 'number', value: 13, amount: 24 },
          { type: 'number', value: 14, amount: 25 },
          { type: 'number', value: 15, amount: 26 },
          { type: 'number', value: 16, amount: 27 },
          { type: 'number', value: 17, amount: 28 },
          { type: 'number', value: 18, amount: 29 },
          { type: 'number', value: 19, amount: 30 },
          { type: 'number', value: 20, amount: 31 },
          { type: 'number', value: 21, amount: 32 },
          { type: 'number', value: 22, amount: 33 },
          { type: 'number', value: 23, amount: 34 },
          { type: 'number', value: 24, amount: 35 },
          { type: 'number', value: 25, amount: 36 },
          { type: 'number', value: 26, amount: 37 },
          { type: 'number', value: 27, amount: 38 },
          { type: 'number', value: 28, amount: 39 },
          { type: 'number', value: 29, amount: 40 },
          { type: 'number', value: 30, amount: 41 },
          { type: 'number', value: 31, amount: 42 },
          { type: 'number', value: 32, amount: 43 },
          { type: 'number', value: 33, amount: 44 },
          { type: 'number', value: 34, amount: 45 },
          { type: 'number', value: 35, amount: 46 },
          { type: 'number', value: 36, amount: 47 },

          // Colonnes
          { type: 'column', value: 'C1', amount: 50 },
          { type: 'column', value: 'C2', amount: 51 },
          { type: 'column', value: 'C3', amount: 52 },

          // Douzaines
          { type: 'dozen', value: 1, amount: 60 },
          { type: 'dozen', value: 2, amount: 61 },
          { type: 'dozen', value: 3, amount: 62 },
        ]} />
        <div className="absolute" style={{
          left: '19px',
          right: '19px',
          top: '16px',
          bottom: '0'
        }}>
          <BetsOverlay bets={[
            { type: 'sixain', value: '1-4', amount: 100 },
            { type: 'sixain', value: '7-10', amount: 110 },
            { type: 'sixain', value: '13-16', amount: 120 },
            { type: 'sixain', value: '19-22', amount: 130 },
            { type: 'sixain', value: '25-28', amount: 140 },
            { type: 'sixain', value: '31-34', amount: 150 },
          ]} />
          <BetsOverlay
            bets={[
              { type: 'carre', value: '1-2-4-5', amount: 200 },
              { type: 'carre', value: '2-3-5-6', amount: 201 },
              { type: 'carre', value: '4-5-7-8', amount: 202 },
              { type: 'carre', value: '5-6-8-9', amount: 203 },
              { type: 'carre', value: '7-8-10-11', amount: 204 },
              { type: 'carre', value: '8-9-11-12', amount: 205 },
              { type: 'carre', value: '10-11-13-14', amount: 206 },
              { type: 'carre', value: '11-12-14-15', amount: 207 },
              { type: 'carre', value: '13-14-16-17', amount: 208 },
              { type: 'carre', value: '14-15-17-18', amount: 209 },
              { type: 'carre', value: '16-17-19-20', amount: 210 },
              { type: 'carre', value: '17-18-20-21', amount: 211 },
              { type: 'carre', value: '19-20-22-23', amount: 212 },
              { type: 'carre', value: '20-21-23-24', amount: 213 },
              { type: 'carre', value: '22-23-25-26', amount: 214 },
              { type: 'carre', value: '23-24-26-27', amount: 215 },
              { type: 'carre', value: '25-26-28-29', amount: 216 },
              { type: 'carre', value: '26-27-29-30', amount: 217 },
              { type: 'carre', value: '28-29-31-32', amount: 218 },
              { type: 'carre', value: '29-30-32-33', amount: 219 },
              { type: 'carre', value: '31-32-34-35', amount: 220 },
              { type: 'carre', value: '32-33-35-36', amount: 221 },
            ]}
          />
          <BetsOverlay
            bets={[
              { type: 'transversale', value: '1-2-3', amount: 300 },
              { type: 'transversale', value: '4-5-6', amount: 301 },
              { type: 'transversale', value: '7-8-9', amount: 302 },
              { type: 'transversale', value: '10-11-12', amount: 303 },
              { type: 'transversale', value: '13-14-15', amount: 304 },
              { type: 'transversale', value: '16-17-18', amount: 305 },
              { type: 'transversale', value: '19-20-21', amount: 306 },
              { type: 'transversale', value: '22-23-24', amount: 307 },
              { type: 'transversale', value: '25-26-27', amount: 308 },
              { type: 'transversale', value: '28-29-30', amount: 309 },
              { type: 'transversale', value: '31-32-33', amount: 310 },
              { type: 'transversale', value: '34-35-36', amount: 311 },
            ]}
          />

        </div>
      </div>
    </div>
  )
}

export default RouletteTable