// src/types/methods/chasse.ts

// Types pour l'état de la méthode Chasse
export interface ChasseMethodState {
  phase: 'observation' | 'play' | 'finished'    // Phase actuelle de la méthode
  observationCount: number                      // Nombre de tours d'observation effectués
  remainingObservationTours: number            // Tours d'observation restants
  remainingPlayTours: number                   // Tours de jeu restants
  playCount: number                            // Nombre de tours de jeu effectués
  numberCounts: Record<number, {               // Suivi des numéros sortis
    count: number,                             // Nombre de fois sorti
    firstSeen: number                          // Premier tour où il est apparu
  }>
  selectedNumbers: number[]                    // Numéros retenus pour le jeu (max 3)
 }
 
 // Fonctions pour gérer la méthode
 export const chasseActions = {
  // Analyse l'historique des numéros au démarrage
  analyzeHistory: (state: ChasseMethodState, history: number[]) => {
    const relevantHistory = history.slice(-24)    // Prend les 24 derniers numéros
    state.observationCount = relevantHistory.length
    state.remainingObservationTours = Math.max(0, 24 - state.observationCount)
 
    relevantHistory.forEach((number, index) => {
      if (!state.numberCounts[number]) {
        state.numberCounts[number] = {
          count: 1,
          firstSeen: index
        }
      } else {
        state.numberCounts[number].count++
      }
    })
 
    chasseActions.updateSelectedNumbers(state)
 
    if (state.observationCount === 24) {
      if (state.selectedNumbers.length > 0) {
        state.phase = 'play'
        state.playCount = 0
        state.remainingPlayTours = 12
      } else {
        state.phase = 'finished'
      }
    }
  },
 
  // Ajoute un nouveau numéro sorti
  addNumber: (state: ChasseMethodState, number: number) => {
    if (state.phase === 'observation' && state.observationCount < 24) {
      state.observationCount++
      state.remainingObservationTours--

      // Ajoute le numéro cliqué dans les counts
      if (!state.numberCounts[number]) {
        state.numberCounts[number] = {
          count: 1,
          firstSeen: state.observationCount - 1
        }
      } else {
        state.numberCounts[number].count++
      }

      // Met à jour les numéros sélectionnés
      chasseActions.updateSelectedNumbers(state)

      // Passe à la phase de jeu si l'observation est terminée
      if (state.observationCount === 24) {
        if (state.selectedNumbers.length > 0) {
          state.phase = 'play'
          state.playCount = 0
          state.remainingPlayTours = 12
        } else {
          state.phase = 'finished'
        }
      }
    }
  },
 
  // Met à jour la sélection des numéros
  updateSelectedNumbers: (state: ChasseMethodState) => {
    const eligibleNumbers = Object.entries(state.numberCounts)
      .filter(([_, data]) => data.count === 2)    // Uniquement les numéros sortis 2 fois
      .sort((a, b) => a[1].firstSeen - b[1].firstSeen)    // Tri par ordre d'apparition
      .slice(0, 3)    // Maximum 3 numéros
      .map(([number]) => parseInt(number))
 
    state.selectedNumbers = eligibleNumbers
  }
 }
