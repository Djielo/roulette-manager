import { FC, useEffect, useMemo } from "react";
import { useCommonMethodsStore } from "../../store/useCommonMethodsStore";
import { useMethodCapitalStore } from "../../store/useMethodCapitalStore";
import { useRouletteStore } from "../../store/useRouletteStore";
import { RouletteNumber } from "../../types/roulette";
import { formatRouletteNumber } from "../../utils/rouletteUtils";
import BetsOverlay from "./BetsOverlay";

interface RouletteTableProps {
  onNumberClick?: (number: RouletteNumber) => void;
  highlightedNumbers?: RouletteNumber[];
  bets?: { number: RouletteNumber; amount: number }[];
}

const RouletteTable: FC<RouletteTableProps> = ({ onNumberClick }) => {
  const { chasseState, methodConfigs, isPlaying } = useRouletteStore();
  // Récupérer activeMethodId directement du store
  const activeMethodId = useCommonMethodsStore((state) => state.activeMethodId);
  const config = methodConfigs["chasse"];
  const addSpin = useCommonMethodsStore((state) => state.addSpin);
  const creditWin = useMethodCapitalStore((state) => state.creditWin);

  // Log pour déboguer l'état de chasseState (une seule fois lors des changements importants)
  useEffect(() => {
    if (chasseState.phase === "play") {
      console.log("État de chasseState dans RouletteTable:", {
        phase: chasseState.phase,
        selectedNumbers: chasseState.selectedNumbers,
        remainingPlayTours: chasseState.remainingPlayTours,
      });
    }
  }, [
    chasseState.phase,
    chasseState.remainingPlayTours,
    chasseState.selectedNumbers,
  ]);

  // Calculer les mises une seule fois avec useMemo
  const bets = useMemo(() => {
    // Ne générer les mises que si nous sommes en phase de jeu
    if (chasseState.phase !== "play") {
      return [];
    }

    if (!activeMethodId) {
      console.log(
        "Aucune méthode active (activeMethodId=null), pas de mises à afficher"
      );
      return [];
    }

    switch (activeMethodId) {
      case "chasse":
        if (chasseState.selectedNumbers.length > 0) {
          const generatedBets = chasseState.selectedNumbers.map((number) => ({
            type: "number" as const,
            value: number,
            amount: config?.betUnit || 0.2,
          }));

          // Log une seule fois lors de la génération initiale des mises
          if (chasseState.remainingPlayTours === 12) {
            console.log("Mises générées pour le tapis:", generatedBets);
          }

          return generatedBets;
        } else {
          return [];
        }
      default:
        return [];
    }
  }, [
    chasseState.phase,
    chasseState.selectedNumbers,
    chasseState.remainingPlayTours,
    activeMethodId,
    config,
  ]);

  const handleNumberClick = (number: RouletteNumber) => {
    if (!isPlaying) return;

    console.log(
      `Clic sur le numéro ${number}, méthode active: ${activeMethodId}, phase: ${chasseState.phase}, tours restants: ${chasseState.remainingPlayTours}`
    );

    // Vérifier si le numéro cliqué est un numéro sélectionné pour les mises
    if (
      chasseState.phase === "play" &&
      activeMethodId &&
      chasseState.selectedNumbers.includes(number)
    ) {
      console.log(`Numéro gagnant: ${number}, crédit du gain`);
      // Créditer le gain (mise * 36)
      const betAmount = config?.betUnit || 0.2;
      creditWin(activeMethodId, betAmount);
    }

    // Ajouter le spin et déclencher le callback
    addSpin(number);
    onNumberClick?.(number);
  };

  const renderNumber = (number: number) => (
    <div
      key={number}
      className={`${getNumberColor(
        number
      )} text-white p-4 flex items-center justify-center cursor-pointer hover:opacity-80`}
      onClick={() => handleNumberClick(number as RouletteNumber)}
    >
      {formatRouletteNumber(number)}
    </div>
  );

  const renderText = (text: string, color = "green") => (
    <div
      key={text}
      className={`bg-roulette-${color} text-white p-4 text-center cursor-pointer hover:opacity-80`}
    >
      {text}
    </div>
  );

  const getNumberColor = (num: number) => {
    if (num === 0 || num === 37) return "bg-roulette-green";
    const redNumbers = [
      1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
    ];
    return redNumbers.includes(num) ? "bg-roulette-red" : "bg-roulette-black";
  };

  // Déterminer si les mises doivent être affichées
  const shouldShowBets =
    chasseState.phase === "play" &&
    chasseState.selectedNumbers.length > 0 &&
    chasseState.remainingPlayTours >= 0; // Inclure le dernier tour (0)

  return (
    <div className="max-w-4xl mx-auto p-4 pb-0 relative">
      {/* Grille du tapis */}
      <div className="grid grid-cols-14 grid-rows-5 gap-1">
        <div className="row-span-3 grid grid-rows-2 gap-1">
          {[0, 37].map((num) => renderNumber(num))}
        </div>

        <div className="col-span-12 row-span-3 grid grid-rows-3 gap-1">
          <div className="grid grid-cols-12 gap-1">
            {[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].map((num) =>
              renderNumber(num)
            )}
          </div>
          <div className="grid grid-cols-12 gap-1">
            {[2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].map((num) =>
              renderNumber(num)
            )}
          </div>
          <div className="grid grid-cols-12 gap-1">
            {[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].map((num) =>
              renderNumber(num)
            )}
          </div>
        </div>

        <div className="row-span-3 col-start-14 grid grid-rows-3 gap-1">
          {["C3", "C2", "C1"].map((text) => renderText(text))}
        </div>

        <div className="row-span-2 row-start-4" />

        <div className="col-span-12 row-start-4 grid grid-cols-3 gap-1">
          {[
            { text: "1ère Douzaine", color: "green" },
            { text: "2ème Douzaine", color: "green" },
            { text: "3ème Douzaine", color: "green" },
          ].map(({ text, color }) => renderText(text, color))}
        </div>

        <div className="col-span-12 col-start-2 row-start-5 grid grid-cols-6 gap-1">
          {[
            { text: "1-18", color: "green" },
            { text: "PAIR", color: "green" },
            { text: "ROUGE", color: "red" },
            { text: "NOIR", color: "black" },
            { text: "IMPAIR", color: "green" },
            { text: "19-36", color: "green" },
          ].map(({ text, color }) => renderText(text, color))}
        </div>

        <div className="row-span-2 col-start-14 row-start-4" />
      </div>

      {/* N'afficher les mises que si nous sommes en phase de jeu */}
      {shouldShowBets && (
        <div
          key={JSON.stringify(chasseState.selectedNumbers)}
          className="absolute pointer-events-none z-10"
          style={{
            left: "19px",
            right: "19px",
            top: "16px",
            bottom: "0",
          }}
        >
          <BetsOverlay bets={bets} />
        </div>
      )}
    </div>
  );
};

export default RouletteTable;
