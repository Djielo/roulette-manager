import { FC } from 'react'
import { Method } from '../../types/methodsTypes'
import { useRouletteStore } from '../../store/useRouletteStore'

interface MethodsModalProps {
  isOpen: boolean
  onClose: () => void
  configMethodId: string | null
  setConfigMethodId: (id: string | null) => void
}

const MethodsModal: FC<MethodsModalProps> = ({ isOpen, onClose, setConfigMethodId }) => {
  const {
    methods,
    cyclicMode,
    sessionLocked,
    toggleMethod,
    toggleCyclicMode,
    getMethodConfig,
  } = useRouletteStore()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-roulette-navy border-2 border-roulette-gold/30 p-6 rounded-lg w-[800px]">
        <div className='flex justify-between'>
          <h3 className="text-xl text-roulette-gold mb-4">Gestion des Méthodes</h3>
          <div className="mb-4">
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                disabled={sessionLocked}
                checked={cyclicMode}
                onChange={toggleCyclicMode}
                className="rounded border-roulette-gold/30"
              />
              <span>Mode cyclique</span>
            </label>
          </div>
        </div>

        {methods.map((method: Method) => {
          const config = getMethodConfig(method.id)

          return (
            <div key={method.id} className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  disabled={sessionLocked}
                  checked={method.active}
                  onChange={() => toggleMethod(method.id)}
                  className="rounded border-roulette-gold/30"
                />
                <span>{method.name}</span>
              </label>
              <div className="flex items-center gap-2">
                {!sessionLocked && config?.isConfigured && (
                  <>
                    <span className="text-green-500 relative group">
                      ✓
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-roulette-navy border border-roulette-gold/30 rounded p-2 text-white text-sm whitespace-nowrap">
                        Mise de base: {config.betUnit}€
                      </div>
                    </span>
                    <button
                      onClick={() => setConfigMethodId(method.id)}
                      className="text-roulette-gold hover:text-roulette-gold/80"
                    >
                      ✎
                    </button>
                  </>
                )}
                {!sessionLocked && !config?.isConfigured && (
                  <button
                    onClick={() => setConfigMethodId(method.id)}
                    className="text-roulette-gold hover:text-roulette-gold/80"
                  >
                    ⚙️
                  </button>
                )}
              </div>
            </div>
          )
        })}

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="bg-roulette-red text-white px-4 py-2 rounded"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default MethodsModal