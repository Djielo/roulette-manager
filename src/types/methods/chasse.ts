// src/types/methods/chasse.ts

// Types pour l'état de la méthode Chasse
export interface ChasseMethodState {
  phase: "observation" | "play" | "finished"; // Phase actuelle de la méthode
  observationCount: number; // Nombre de tours d'observation effectués
  remainingObservationTours: number; // Tours d'observation restants
  remainingPlayTours: number; // Tours de jeu restants
  playCount: number; // Nombre de tours de jeu effectués
  numberCounts: Record<
    number,
    {
      // Suivi des numéros sortis
      count: number; // Nombre de fois sorti
      firstSeen: number; // Premier tour où il est apparu
    }
  >;
  selectedNumbers: number[]; // Numéros retenus pour le jeu (max 3)
  displayedNumbers: number[]; // Numéros à afficher dans l'interface (historique des numéros observés)
  phaseChanged?: boolean; // Indicateur de changement de phase pour déclencher des effets
}

// Fonctions pour gérer la méthode
export const chasseActions = {
  // Analyse l'historique des numéros au démarrage
  analyzeHistory: (state: ChasseMethodState, history: number[]) => {
    const relevantHistory = history.slice(-24); // Prend les 24 derniers numéros
    state.observationCount = relevantHistory.length;
    state.remainingObservationTours = Math.max(0, 24 - state.observationCount);

    // S'assurer que displayedNumbers est vide avant d'ajouter les numéros de l'historique
    state.displayedNumbers = [];

    // Ensemble pour suivre les numéros uniques
    const uniqueNumbers = new Set<number>();

    relevantHistory.forEach((number, index) => {
      // Ajouter le numéro à displayedNumbers seulement s'il n'est pas déjà présent
      if (!uniqueNumbers.has(number)) {
        state.displayedNumbers.push(number);
        uniqueNumbers.add(number);
      }

      if (!state.numberCounts[number]) {
        state.numberCounts[number] = {
          count: 1,
          firstSeen: index,
        };
      } else {
        state.numberCounts[number].count++;
      }
    });

    chasseActions.updateSelectedNumbers(state);

    if (state.observationCount === 24) {
      if (state.selectedNumbers.length > 0) {
        // Marquer le changement de phase
        const wasInObservation = state.phase === "observation";
        state.phase = "play";
        state.playCount = 0;
        state.remainingPlayTours = 12;
        state.phaseChanged = wasInObservation; // Vrai si on était en observation
      } else {
        state.phase = "finished";
      }
    }
  },

  // Ajoute un nouveau numéro sorti
  addNumber: (state: ChasseMethodState, number: number) => {
    if (state.phase === "play") {
      // En phase de jeu, on ajoute simplement le numéro aux displayedNumbers
      state.displayedNumbers.push(number);
      // Réinitialiser l'indicateur de changement de phase
      state.phaseChanged = false;
    } else if (state.phase === "observation" && state.observationCount < 24) {
      state.observationCount++;
      state.remainingObservationTours--;

      // Ajoute le numéro cliqué dans les counts
      if (!state.numberCounts[number]) {
        state.numberCounts[number] = {
          count: 1,
          firstSeen: state.observationCount - 1,
        };
        // Ajouter le numéro à displayedNumbers uniquement s'il n'y est pas déjà
        state.displayedNumbers.push(number);
      } else {
        state.numberCounts[number].count++;
        // Ne pas ajouter le numéro à displayedNumbers s'il y est déjà
      }

      // Met à jour les numéros sélectionnés
      chasseActions.updateSelectedNumbers(state);

      // Passe à la phase de jeu si l'observation est terminée
      if (state.observationCount === 24) {
        // Mettre à jour les numéros sélectionnés une dernière fois avant de passer à la phase de jeu
        chasseActions.updateSelectedNumbers(state);

        if (state.selectedNumbers.length > 0) {
          console.log(
            "Transition vers la phase de jeu. Numéros sélectionnés:",
            state.selectedNumbers
          );

          // Marquer le changement de phase
          const wasInObservation = state.phase === "observation";
          state.phase = "play";
          state.playCount = 0;
          state.remainingPlayTours = 12;
          state.phaseChanged = wasInObservation; // Vrai si on était en observation

          // Log supplémentaire pour vérifier l'état après la transition
          console.log("État après transition vers la phase de jeu:", {
            phase: state.phase,
            selectedNumbers: state.selectedNumbers,
            remainingPlayTours: state.remainingPlayTours,
            phaseChanged: state.phaseChanged,
          });
        } else {
          console.log(
            "Aucun numéro sélectionné, passage à la phase 'finished'"
          );
          state.phase = "finished";
        }
      }
    }
  },

  // Met à jour la sélection des numéros
  updateSelectedNumbers: (state: ChasseMethodState) => {
    const eligibleNumbers = Object.entries(state.numberCounts)
      .filter(([, data]) => data.count === 2) // Uniquement les numéros sortis 2 fois
      .sort((a, b) => a[1].firstSeen - b[1].firstSeen) // Tri par ordre d'apparition
      .slice(0, 3) // Maximum 3 numéros
      .map(([number]) => parseInt(number));

    console.log("Numéros éligibles pour les mises:", eligibleNumbers);

    // Mettre à jour les numéros sélectionnés
    state.selectedNumbers = eligibleNumbers;

    // Si nous sommes en phase d'observation et que nous avons des numéros éligibles,
    // vérifier si nous devons passer en phase de jeu
    if (
      state.phase === "observation" &&
      state.observationCount >= 24 &&
      eligibleNumbers.length > 0
    ) {
      console.log(
        "Passage automatique en phase de jeu avec les numéros:",
        eligibleNumbers
      );

      // Marquer le changement de phase
      const wasInObservation = state.phase === "observation";
      state.phase = "play";
      state.playCount = 0;
      state.remainingPlayTours = 12;
      state.phaseChanged = wasInObservation; // Vrai si on était en observation
    }
  },
};
