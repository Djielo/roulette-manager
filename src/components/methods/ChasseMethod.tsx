import { FC, useEffect, useRef } from "react";
import { useChasseStore } from "../../store/useChasseStore";
import { useCommonMethodsStore } from "../../store/useCommonMethodsStore";
import { useMethodCapitalStore } from "../../store/useMethodCapitalStore";
import { useRouletteStore } from "../../store/useRouletteStore";
import { ChasseMethodState } from "../../types/methods/chasse";
import { BetPosition, RouletteNumber } from "../../types/roulette";
import { formatRouletteNumber } from "../../utils/rouletteUtils";

export interface ChasseStore {
  chasseState: ChasseMethodState;
  initializeChasse: () => void;
  updateChasseState: (number: RouletteNumber) => void;
  decrementPlayTours: () => void;
}

const ChasseMethod: FC = () => {
  // Utilisation directe de useChasseStore pour l'état de la chasse
  const chasseState = useChasseStore().chasseState;

  // Extraction des méthodes du store roulette combiné avec le type correct
  const store = useRouletteStore();
  const { activeMethodId } = useCommonMethodsStore();
  const config = store.methodConfigs["chasse"];
  const { deductBets } = store;
  const methodCapital =
    useMethodCapitalStore().methodCapital[activeMethodId || ""];

  // Log pour déboguer les valeurs de methodCapital
  console.log("ChasseMethod - methodCapital:", methodCapital);
  console.log("ChasseMethod - activeMethodId:", activeMethodId);

  const {
    phase,
    remainingObservationTours,
    remainingPlayTours,
    numberCounts,
    selectedNumbers,
  } = chasseState;

  // Référence pour suivre le dernier tour traité
  const lastProcessedTourRef = useRef(remainingPlayTours);

  // Référence pour suivre si les mises initiales ont été déduites
  const initialBetsDeductedRef = useRef(false);

  // Surveiller les changements de phase
  useEffect(() => {
    console.log(
      `Phase actuelle: ${phase}, Tours restants: ${
        phase === "observation" ? remainingObservationTours : remainingPlayTours
      }, Active Method: ${activeMethodId}, Selected Numbers: ${
        selectedNumbers.length
      }`
    );

    // Réinitialiser le flag lorsqu'on revient en phase d'observation
    if (phase === "observation") {
      initialBetsDeductedRef.current = false;
      lastProcessedTourRef.current = 12; // Réinitialiser à la valeur maximale
    }
  }, [
    phase,
    remainingObservationTours,
    remainingPlayTours,
    activeMethodId,
    selectedNumbers,
  ]);

  // Déduire les mises initiales dès l'entrée en phase de jeu
  useEffect(() => {
    if (
      phase === "play" &&
      chasseState.phaseChanged &&
      selectedNumbers.length > 0 &&
      !initialBetsDeductedRef.current &&
      activeMethodId
    ) {
      console.log(
        "Déduction des mises initiales à l'entrée en phase de jeu (détecté par phaseChanged)"
      );

      const bets: BetPosition[] = selectedNumbers.map((number) => ({
        type: "number",
        value: number,
        amount: config?.betUnit ?? 0.2,
      }));

      console.log("Mises initiales à déduire:", bets);
      console.log("Active Method ID:", activeMethodId);

      deductBets(activeMethodId, bets);
      initialBetsDeductedRef.current = true;
      lastProcessedTourRef.current = remainingPlayTours; // Utiliser le nombre actuel de tours
    }
  }, [
    chasseState.phaseChanged,
    phase,
    selectedNumbers,
    activeMethodId,
    config,
    deductBets,
    remainingPlayTours,
  ]);

  // Déduire les mises à chaque tour de la phase de jeu
  useEffect(() => {
    console.log(
      `Vérification de déduction - Tour actuel: ${remainingPlayTours}, Dernier tour traité: ${lastProcessedTourRef.current}`
    );

    if (
      phase === "play" &&
      remainingPlayTours !== lastProcessedTourRef.current &&
      remainingPlayTours < lastProcessedTourRef.current && // S'assurer que nous avançons dans les tours
      selectedNumbers.length > 0 &&
      activeMethodId
    ) {
      console.log(`Traitement du tour ${remainingPlayTours}`);

      const bets: BetPosition[] = selectedNumbers.map((number) => ({
        type: "number",
        value: number,
        amount: config?.betUnit ?? 0.2,
      }));

      console.log("Mises générées dans ChasseMethod:", bets);
      console.log("Active Method ID pour déduction:", activeMethodId);

      deductBets(activeMethodId, bets);

      // Mettre à jour la référence du dernier tour traité
      lastProcessedTourRef.current = remainingPlayTours;
    }
  }, [
    phase,
    remainingPlayTours,
    selectedNumbers,
    activeMethodId,
    config,
    deductBets,
  ]);

  // Gérer la fin de la phase de jeu
  useEffect(() => {
    const checkGameEnd = () => {
      const chasseState = useChasseStore.getState().chasseState;
      const { cyclicMode } = useCommonMethodsStore.getState();

      console.log("Vérification de la fin de la phase de jeu...");
      console.log("Phase actuelle:", chasseState.phase);
      console.log("Tours restants:", chasseState.remainingPlayTours);
      console.log("Mode cyclique:", cyclicMode);

      // En mode non cyclique, terminer la partie quand tous les tours sont joués
      if (
        chasseState.phase === "play" &&
        chasseState.remainingPlayTours === 0 &&
        !cyclicMode &&
        chasseState.playCount === 12 // S'assurer que le dernier tour a été joué
      ) {
        console.log("Fin de la phase de jeu - Mode non cyclique");
        // Marquer la phase comme terminée sans réinitialiser
        useChasseStore.setState((state) => ({
          chasseState: {
            ...state.chasseState,
            phase: "finished",
          },
        }));
      }
    };

    const unsubscribeChasse = useChasseStore.subscribe(checkGameEnd);
    const unsubscribeCommon = useCommonMethodsStore.subscribe(checkGameEnd);

    // Vérification initiale
    checkGameEnd();

    return () => {
      unsubscribeChasse();
      unsubscribeCommon();
    };
  }, []);

  // Helper pour obtenir la couleur du bouton selon le nombre de sorties
  const getButtonColor = (number: number) => {
    const count = numberCounts[number]?.count || 0;
    if (count < 2) return "bg-white text-black";
    if (count === 2) return "bg-green-400 text-black font-bold";
    return "bg-red-500 text-black font-bold";
  };

  // Détermine les numéros à afficher en fonction de la phase
  const numbersToDisplay =
    phase === "observation"
      ? [...new Set(chasseState.displayedNumbers)]
      : selectedNumbers.slice(0, 3);

  return (
    <div className="p-4">
      {/* En-tête avec phase, tours restants et capital */}
      <div className="mb-4 text-center">
        <div className="text-roulette-gold text-xl">
          Phase : {phase === "observation" ? "Observation" : "Jeu"}
        </div>
        <div className="text-white/70">
          {phase === "observation"
            ? `${remainingObservationTours} tours d'observation restants`
            : `${remainingPlayTours} tours de jeu restants`}
        </div>
      </div>

      {/* Affichage des numéros */}
      <div className="space-y-4">
        <div>
          <div className="text-white/70 mb-2">Numéros observés :</div>
          <div className="grid grid-cols-6 gap-2">
            {numbersToDisplay.map((number) => (
              <button
                key={number}
                className={`p-2 text-center border border-roulette-gold/30 rounded transition-colors duration-200 font-bold ${getButtonColor(
                  number
                )}`}
              >
                {formatRouletteNumber(number)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChasseMethod;
