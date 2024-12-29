import { FC } from 'react'

interface BetMarkerProps {
  amount: number
  type?: 'sixain' | 'carre' | 'transversale' | 'default'
}

const BetMarker: FC<BetMarkerProps> = ({ amount, type = 'default' }) => {
  // Déterminer la forme et la couleur selon le type
  const getStyles = (type: string) => {
    switch(type) {
      case 'sixain':
        return 'w-8 h-8 rounded-full bg-roulette-sixain'
      case 'carre':
        return 'w-8 h-8 rounded-full bg-roulette-carre'
      case 'transversale':
        return 'w-8 h-8 rounded-full bg-roulette-transversale'
      default:
        return 'w-8 h-6 rounded-full bg-roulette-gold'
    }
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center -translate-y-[40%]">
      <div className={`${getStyles(type)} flex items-center justify-center text-sm text-roulette-roi font-bold`}>
        {amount}€
      </div>
    </div>
  )
}

export default BetMarker