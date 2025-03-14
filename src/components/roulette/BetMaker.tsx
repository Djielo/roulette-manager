import { FC, useEffect } from "react";

interface BetMarkerProps {
  amount: number;
  type?: "sixain" | "carre" | "transversale" | "default";
}

const BetMarker: FC<BetMarkerProps> = ({ amount, type = "default" }) => {
  // Log pour déboguer le rendu du marqueur
  useEffect(() => {
    console.log(`BetMarker rendu avec amount=${amount}, type=${type}`);
  }, [amount, type]);

  // Déterminer la forme et la couleur selon le type
  const getStyles = (type: string) => {
    switch (type) {
      case "sixain":
        return "w-8 h-8 rounded-full bg-roulette-sixain";
      case "carre":
        return "w-8 h-8 rounded-full bg-roulette-carre";
      case "transversale":
        return "w-8 h-8 rounded-full bg-roulette-transversale";
      default:
        return "w-12 h-7 rounded-full bg-yellow-300"; // Ovale jaune plus large pour les mises sur numéros
    }
  };

  return (
    <div className="flex items-center justify-center z-20">
      <div
        className={`${getStyles(
          type
        )} pointer-events-auto flex items-center justify-center text-xs text-black font-bold border border-black`}
      >
        {amount}€
      </div>
    </div>
  );
};

export default BetMarker;
