import { FC, useEffect } from "react";
import { useChasseStore } from "../../store/useChasseStore";
import { useMethodCapitalStore } from "../../store/useMethodCapitalStore";
import { useRouletteStore } from "../../store/useRouletteStore";
import { ChasseMethodState } from "../../types/methods/chasse";
import { BetPosition, RouletteNumber } from "../../types/roulette";
import type { CombinedStoreState } from "../../types/stores";

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
  const store = useRouletteStore() as CombinedStoreState;
  const activeMethod = store.methods.find((m) => m.selected);
  const config = store.methodConfigs["chasse"];
  const pendingMethods = store.pendingMethods;
  const cyclicMode = store.cyclicMode;
  const { deductBets, switchToNextMethod } = store;

  const methodCapital = useMethodCapitalStore((state) =>
    activeMethod?.id ? state.methodCapital[activeMethod.id] : null
  );

  const {
    phase,
    remainingObservationTours,
    remainingPlayTours,
    numberCounts,
    selectedNumbers,
  } = chasseState;

  // Logs pour suivre la phase de jeu
  useEffect(() => {
    if (phase === "play") {
      console.log("Phase de jeu démarrée");
    } else if (phase === "observation") {
      console.log("Phase d'observation démarrée");
    }
  }, [phase]);

  // Logs pour suivre remainingPlayTours
  useEffect(() => {
    console.log(`Tours de jeu restants : ${remainingPlayTours}`);
  }, [remainingPlayTours]);

  // Déduire les mises à chaque tour de la phase de jeu
  useEffect(() => {
    if (phase === "play") {
      const bets: BetPosition[] = selectedNumbers.map((number) => ({
        type: "number",
        value: number,
        amount: config?.betUnit ?? 0.2,
      }));

      if (activeMethod?.id) {
        deductBets(activeMethod.id, bets);
      }
    }
  }, [
    phase,
    remainingPlayTours,
    selectedNumbers,
    activeMethod,
    config,
    deductBets,
  ]);

  // Gérer la fin de la phase de jeu
  useEffect(() => {
    if (phase === "play" && remainingPlayTours === 0 && activeMethod?.id) {
      console.log("Fin de la phase de jeu détectée");
      const currentMethodId = activeMethod.id;

      let nextMethodId: string | null = null;
      if (cyclicMode && pendingMethods.length === 1) {
        console.log("Mode cyclique activé avec une seule méthode sélectionnée");
        nextMethodId = currentMethodId;
      } else {
        console.log("Recherche de la méthode suivante");
        const activeMethodIndex = pendingMethods.indexOf(currentMethodId);
        const nextMethodIndex = (activeMethodIndex + 1) % pendingMethods.length;
        nextMethodId = pendingMethods[nextMethodIndex];
      }

      if (nextMethodId) {
        console.log(`Passage à la méthode suivante : ${nextMethodId}`);
        switchToNextMethod(currentMethodId, nextMethodId);
      } else {
        console.log("Aucune méthode suivante trouvée");
      }
    }
  }, [
    phase,
    remainingPlayTours,
    activeMethod,
    pendingMethods,
    cyclicMode,
    switchToNextMethod,
  ]);

  // Helper pour obtenir la couleur du bouton selon le nombre de sorties
  const getButtonColor = (count: number) => {
    if (count < 2) return "bg-white text-black";
    if (count === 2) return "bg-green-400 text-black font-bold";
    return "bg-red-500 text-black font-bold";
  };

  // Détermine les numéros à afficher en fonction de la phase
  const numbersToDisplay =
    phase === "observation"
      ? Object.entries(numberCounts).map(([number]) => parseInt(number))
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
        {methodCapital && (
          <div className="mt-2">
            <div className="text-white/80">
              Capital initial : {methodCapital.initial.toFixed(2)}€
            </div>
            <div className="text-white/80">
              Capital actuel : {methodCapital.current.toFixed(2)}€
            </div>
          </div>
        )}
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
                  numberCounts[number]?.count || 0
                )}`}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChasseMethod;
