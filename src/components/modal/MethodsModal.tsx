import { FC } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

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
    cyclicMode,
    sessionLocked,
    toggleCyclicMode,
    getMethodConfig,
    getSortedMethods,
    reorderMethods,
    pendingMethods,
    setPendingMethods,
  } = useRouletteStore();

  const sortedMethods = getSortedMethods();

  const handleToggleMethod = (id: string) => {
    const isSelected = pendingMethods.includes(id);
    if (isSelected) {
      setPendingMethods(pendingMethods.filter(methodId => methodId !== id));
    } else {
      setPendingMethods([...pendingMethods, id]);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
  
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const sourceMethod = sortedMethods[sourceIndex];
    const destinationMethod = sortedMethods[destinationIndex];
  
    // Ne permettre que le déplacement entre méthodes sélectionnées
    if (!pendingMethods.includes(sourceMethod.id) || !pendingMethods.includes(destinationMethod.id)) return;
  
    // Réorganise les méthodes sélectionnées dans pendingMethods
    const updatedPendingMethods = [...pendingMethods];
    const [removed] = updatedPendingMethods.splice(sourceIndex, 1);
    updatedPendingMethods.splice(destinationIndex, 0, removed);
  
    // Met à jour l'ordre des méthodes dans le store
    reorderMethods(sourceIndex, destinationIndex);
  
    // Met à jour pendingMethods
    setPendingMethods(updatedPendingMethods);
  };

  if (!isOpen) return null;

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

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="methods">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                {sortedMethods.map((method: Method, index) => (
                  <Draggable
                    key={`method-${method.id}`}
                    draggableId={`method-${method.id}`}
                    index={index}
                    isDragDisabled={!pendingMethods.includes(method.id) || sessionLocked}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`
                          flex items-center justify-between py-2 px-3
                          ${pendingMethods.includes(method.id) ? 'bg-roulette-roi/50' : ''}
                          ${snapshot.isDragging ? 'bg-roulette-roi shadow-lg' : ''}
                          ${pendingMethods.includes(method.id) ? 'cursor-move' : ''}
                          rounded transition-colors
                        `}
                      >
                        <label className="flex items-center gap-2 text-white">
                          <input
                            type="checkbox"
                            disabled={sessionLocked}
                            checked={pendingMethods.includes(method.id)}
                            onChange={() => handleToggleMethod(method.id)}
                            className="rounded border-roulette-gold/30"
                          />
                          <span>{method.name}</span>
                        </label>

                        <div className="flex items-center gap-2">
                          {!sessionLocked && getMethodConfig(method.id)?.isConfigured && (
                            <>
                              <span className="text-green-500 relative group">
                                ✓
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-roulette-navy border border-roulette-gold/30 rounded p-2 text-white text-sm whitespace-nowrap">
                                  Mise de base: {getMethodConfig(method.id)?.betUnit}€
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
                          {!sessionLocked && !getMethodConfig(method.id)?.isConfigured && (
                            <button
                              onClick={() => setConfigMethodId(method.id)}
                              className="text-roulette-gold hover:text-roulette-gold/80"
                            >
                              ⚙️
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

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
  );
};

export default MethodsModal