import { FC, useState } from 'react'
import { useRouletteStore } from '../../store/useRouletteStore'

interface MethodConfigProps {
  methodId: string
  isOpen: boolean
  onClose: () => void
}

const MethodConfig: FC<MethodConfigProps> = ({ methodId, isOpen, onClose }) => {
  const { updateMethodConfig, getMethodConfig } = useRouletteStore()
  const config = getMethodConfig(methodId)
  const [betUnit, setBetUnit] = useState(config?.betUnit || 0.2)

  const handleSave = () => {
    updateMethodConfig(methodId, { betUnit })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-roulette-navy border-2 border-roulette-gold/30 p-6 rounded-lg w-96">
        <h3 className="text-xl text-roulette-gold mb-4">Configuration de la méthode</h3>

        <div className="mb-4">
          <label className="block text-roulette-gold/80 text-sm mb-2">
            Mise de base
          </label>
          <input
            type="number"
            value={betUnit}
            step="0.1"
            min="0.1"
            onChange={(e) => setBetUnit(Number(e.target.value))}
            className="bg-roulette-roi text-white p-2 rounded w-full"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleSave}
            className="bg-roulette-green text-white px-4 py-2 rounded"
          >
            Sauvegarder
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

export default MethodConfig