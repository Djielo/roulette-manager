import { FC } from 'react'
import { useRouletteStore } from '../../store/useRouletteStore'

interface CapitalValidationModalProps {
  methodId: string
  isOpen: boolean
  onClose: () => void
}

const CapitalValidationModal: FC<CapitalValidationModalProps> = ({ methodId, isOpen, onClose }) => {
  const { methodCapital, validateMethodCapital } = useRouletteStore()
  const currentMethodCapital = methodCapital[methodId]?.current || 0

  const handleValidate = (finalCapital: number) => {
    validateMethodCapital(methodId, finalCapital)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-roulette-navy border-2 border-roulette-gold/30 p-6 rounded-lg w-96">
        <h3 className="text-xl text-roulette-gold mb-4">Validation du Capital Final</h3>
        
        <div className="mb-4">
          <label className="block text-roulette-gold/80 text-sm mb-2">
            Capital final de la méthode
          </label>
          <input
            type="number"
            defaultValue={currentMethodCapital}
            onChange={(e) => handleValidate(Number(e.target.value))}
            className="bg-roulette-roi text-white p-2 rounded w-full"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => handleValidate(currentMethodCapital)}
            className="bg-roulette-green text-white px-4 py-2 rounded"
          >
            Valider
          </button>
          <button
            onClick={onClose}
            className="bg-roulette-red text-white px-4 py-2 rounded"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  )
}

export default CapitalValidationModal