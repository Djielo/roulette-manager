import { FC, memo, useEffect, useRef, useState } from "react";
import { useRouletteStore } from "../../store/useRouletteStore";
import type { Method } from "../../types/methodsTypes";
import RouletteTable from "../roulette/RouletteTable";
import ChasseMethod from "./ChasseMethod";
import SDCMethod from "./SDCMethod";

// Mémoriser les composants de méthode pour éviter les rendus inutiles
const MemoizedChasseMethod = memo(ChasseMethod);
const MemoizedSDCMethod = memo(SDCMethod);

const MethodView: FC = () => {
  const store = useRouletteStore();
  const activeMethodId = store.activeMethodId;
  const activeMethod = store.methods.find(
    (m: Method) => m.id === activeMethodId
  );
  const methodCapital = activeMethod
    ? store.methodCapital[activeMethod.id]
    : null;
  const globalCapital = store.capital;

  // État et ref pour l'animation du capital
  const [capitalChanged, setCapitalChanged] = useState(false);
  const lastCapitalRef = useRef(methodCapital?.current);

  // Effet pour détecter les changements de capital et déclencher l'animation
  useEffect(() => {
    if (methodCapital && methodCapital.current !== lastCapitalRef.current) {
      setCapitalChanged(true);
      lastCapitalRef.current = methodCapital.current;

      // Réinitialiser l'animation après 1 seconde
      const timer = setTimeout(() => {
        setCapitalChanged(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [methodCapital]);

  // Utiliser des variables pour contrôler l'affichage des méthodes
  const showChasseMethod = activeMethod?.id === "chasse";
  const showSDCMethod = activeMethod?.id === "sdc";

  return (
    <div className="h-full p-4 flex flex-col">
      {/* En-tête méthode */}
      <div className="mb-4 border-b border-roulette-gold/30 pb-4">
        <div className="text-roulette-gold text-xl">
          {activeMethod?.name || "Sélectionnez une méthode"}
        </div>
      </div>

      {/* Section principale */}
      <div className="flex gap-4 flex-1 border-b-2 border-roulette-gold/30">
        {/* Bloc gauche */}
        <div className="flex-1">
          {/* Zone de la méthode active - utiliser des conditions pour afficher/masquer */}
          {showChasseMethod && <MemoizedChasseMethod />}
          {showSDCMethod && <MemoizedSDCMethod />}
        </div>

        {/* Capitaux à droite */}
        <div className="w-36">
          <div className="flex flex-col gap-2">
            <div className="bg-roulette-roi p-2 rounded-lg">
              <div className="text-sm text-roulette-gold/80">
                Capital Initial
              </div>
              <div className="text-white">
                {methodCapital
                  ? `${
                      typeof methodCapital.initial === "number"
                        ? methodCapital.initial.toFixed(2)
                        : "0.00"
                    }€`
                  : "N/A"}
              </div>
            </div>
            <div className="bg-roulette-roi p-2 rounded-lg">
              <div className="text-sm text-roulette-gold/80">
                Capital Actuel
              </div>
              <div
                className={`text-white transition-all duration-300 ${
                  capitalChanged ? "bg-yellow-500/30 font-bold scale-110" : ""
                }`}
              >
                {methodCapital
                  ? `${
                      typeof methodCapital.current === "number"
                        ? methodCapital.current.toFixed(2)
                        : "0.00"
                    }€`
                  : "N/A"}
              </div>
            </div>
            <div className="bg-roulette-roi p-2 rounded-lg">
              <div className="text-sm text-roulette-gold/80">Évolution</div>
              <div
                className={`${
                  globalCapital?.evolution?.amount >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {globalCapital?.evolution?.amount >= 0 ? "+" : ""}
                {globalCapital?.evolution?.amount?.toFixed(2) ?? "0.00"}€ (
                {globalCapital?.evolution?.percentage?.toFixed(1) ?? "0.0"}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table de roulette */}
      <div className="mt-1">
        <RouletteTable />
      </div>
    </div>
  );
};

export default MethodView;
