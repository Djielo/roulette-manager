import { FC, useEffect } from "react";
import BetMarker from "./BetMaker";
import {
  BetType,
  CarreValueHight,
  CarreValueLow,
  ColumnValue,
  SimpleValue,
  SixainValue,
  TransversaleValue,
} from "./betPositions";

interface Bet {
  type: BetType;
  value:
    | number
    | SimpleValue
    | ColumnValue
    | SixainValue
    | CarreValueHight
    | CarreValueLow
    | TransversaleValue;
  amount: number;
}

interface BetsOverlayProps {
  bets: Bet[];
}

const BetsOverlay: FC<BetsOverlayProps> = ({ bets }) => {
  // Log pour déboguer les mises reçues
  useEffect(() => {
    console.log(`BetsOverlay: ${bets.length} mises reçues`);
    if (bets.length > 0) {
      console.log("Détail des mises reçues:", JSON.stringify(bets));

      // Vérifier si les mises contiennent les numéros attendus
      const numberValues = bets
        .filter((bet) => bet.type === "number")
        .map((bet) => bet.value);
      console.log("Numéros à miser:", numberValues);
    }
  }, [bets]);

  // Vérifier si nous avons des mises de type "number"
  const numberBets = bets.filter((bet) => bet.type === "number");
  console.log(`BetsOverlay: ${numberBets.length} mises de type "number"`);

  return (
    <div className="grid grid-cols-14 grid-rows-5 gap-1 h-full">
      <div className="row-span-3 grid grid-rows-2 gap-1">
        {/* 0 et 00 */}
        <div className="w-full h-full relative">
          {bets.find((b) => b.type === "number" && b.value === 0) && (
            <div
              className="absolute inset-0 flex items-start justify-center"
              style={{ top: "-10px" }}
            >
              <BetMarker
                amount={
                  bets.find((b) => b.type === "number" && b.value === 0)!.amount
                }
              />
            </div>
          )}
        </div>
        <div className="w-full h-full relative">
          {bets.find((b) => b.type === "number" && b.value === 37) && (
            <div
              className="absolute inset-0 flex items-start justify-center"
              style={{ top: "-10px" }}
            >
              <BetMarker
                amount={
                  bets.find((b) => b.type === "number" && b.value === 37)!
                    .amount
                }
              />
            </div>
          )}
        </div>
      </div>

      <div className="col-span-12 row-span-3 grid grid-rows-3 gap-1">
        <div className="grid grid-cols-12 gap-1">
          {[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].map((num) => (
            <div key={num} className="w-full h-full relative">
              {bets.find((b) => b.type === "number" && b.value === num) && (
                <div
                  className="absolute inset-0 flex items-start justify-center"
                  style={{ top: "-10px" }}
                >
                  <BetMarker
                    amount={
                      bets.find((b) => b.type === "number" && b.value === num)!
                        .amount
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-1">
          {[2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].map((num) => (
            <div key={num} className="w-full h-full relative">
              {bets.find((b) => b.type === "number" && b.value === num) && (
                <div
                  className="absolute inset-0 flex items-start justify-center"
                  style={{ top: "-10px" }}
                >
                  <BetMarker
                    amount={
                      bets.find((b) => b.type === "number" && b.value === num)!
                        .amount
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-1">
          {[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].map((num) => (
            <div key={num} className="w-full h-full relative">
              {bets.find((b) => b.type === "number" && b.value === num) && (
                <div
                  className="absolute inset-0 flex items-start justify-center"
                  style={{ top: "-10px" }}
                >
                  <BetMarker
                    amount={
                      bets.find((b) => b.type === "number" && b.value === num)!
                        .amount
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sixains */}
        {bets
          .filter((bet) => bet.type === "sixain")
          .map((bet) => (
            <div
              key={bet.value}
              className="absolute"
              style={{
                left: getSixainPosition(bet.value as SixainValue),
                top: "58%",
              }}
            >
              <BetMarker amount={bet.amount} type="sixain" />
            </div>
          ))}

        {/* Carrés niveau haut (1-2-4-5, 4-5-7-8, etc.) */}
        {bets
          .filter((bet) => bet.type === "carre" && isCarreHigh(bet.value))
          .map((bet) => (
            <div
              key={bet.value}
              className="absolute"
              style={{
                left: getCarreHightPosition(bet.value as CarreValueHight),
                top: "15%",
              }}
            >
              <BetMarker amount={bet.amount} type="carre" />
            </div>
          ))}

        {/* Carrés niveau bas (2-3-5-6, 5-6-8-9, etc.) */}
        {bets
          .filter((bet) => bet.type === "carre" && !isCarreHigh(bet.value))
          .map((bet) => (
            <div
              key={bet.value}
              className="absolute"
              style={{
                left: getCarreLowPosition(bet.value as CarreValueLow),
                top: "37%",
              }}
            >
              <BetMarker amount={bet.amount} type="carre" />
            </div>
          ))}

        {/* Transversales */}
        {bets
          .filter((bet) => bet.type === "transversale")
          .map((bet) => (
            <div
              key={bet.value}
              className="absolute"
              style={{
                left: getTransversalePosition(bet.value as TransversaleValue),
                top: "58%", // Position verticale ajustable
              }}
            >
              <BetMarker amount={bet.amount} type="transversale" />
            </div>
          ))}
      </div>

      <div className="row-span-3 col-start-14 grid grid-rows-3 gap-1">
        <div className="w-full h-full relative">
          {bets.find((b) => b.type === "column" && b.value === "C3") && (
            <BetMarker
              amount={
                bets.find((b) => b.type === "column" && b.value === "C3")!
                  .amount
              }
            />
          )}
        </div>
        <div className="w-full h-full relative">
          {bets.find((b) => b.type === "column" && b.value === "C2") && (
            <BetMarker
              amount={
                bets.find((b) => b.type === "column" && b.value === "C2")!
                  .amount
              }
            />
          )}
        </div>
        <div className="w-full h-full relative">
          {bets.find((b) => b.type === "column" && b.value === "C1") && (
            <BetMarker
              amount={
                bets.find((b) => b.type === "column" && b.value === "C1")!
                  .amount
              }
            />
          )}
        </div>
      </div>

      <div className="row-span-2 row-start-4" />

      <div className="col-span-12 row-start-4 grid grid-cols-3 gap-1">
        {[1, 2, 3].map((dozen) => (
          <div key={dozen} className="w-full h-full relative">
            {bets.find((b) => b.type === "dozen" && b.value === dozen) && (
              <BetMarker
                amount={
                  bets.find((b) => b.type === "dozen" && b.value === dozen)!
                    .amount
                }
              />
            )}
          </div>
        ))}
      </div>

      <div className="col-span-12 col-start-2 row-start-5 grid grid-cols-6 gap-1">
        {["1-18", "PAIR", "ROUGE", "NOIR", "IMPAIR", "19-36"].map((value) => (
          <div key={value} className="w-full h-full relative">
            {bets.find((b) => b.type === "simple" && b.value === value) && (
              <BetMarker
                amount={
                  bets.find((b) => b.type === "simple" && b.value === value)!
                    .amount
                }
              />
            )}
          </div>
        ))}
      </div>

      <div className="row-span-2 col-start-14 row-start-4" />
    </div>
  );
};

// Helper pour la position des sixains
const getSixainPosition = (value: SixainValue): string => {
  const positions_sixains: Record<SixainValue, string> = {
    "1-4": "12%", // 1/12
    "7-10": "27.33%", // 4/12
    "13-16": "42.66%", // 7/12
    "19-22": "57.3%", // 10/12
    "25-28": "72.5%", // 13/12
    "31-34": "87.8%", // 16/12
  };
  return positions_sixains[value];
};

// Helper pour la position des carrés haut
const getCarreHightPosition = (value: CarreValueHight): string => {
  const positions_carres: Record<CarreValueHight, string> = {
    "1-2-4-5": "12.3%",
    "4-5-7-8": "20%",
    "7-8-10-11": "27.4%",
    "10-11-13-14": "35%",
    "13-14-16-17": "42.4%",
    "16-17-19-20": "50%",
    "19-20-22-23": "57.5%",
    "22-23-25-26": "65%",
    "25-26-28-29": "73%",
    "28-29-31-32": "80%",
    "31-32-34-35": "87.5%",
  };
  return positions_carres[value];
};

// Helper pour la position des carrés bas
const getCarreLowPosition = (value: CarreValueLow): string => {
  const positions_carres: Record<CarreValueLow, string> = {
    "2-3-5-6": "12.3%",
    "5-6-8-9": "20%",
    "8-9-11-12": "27.4%",
    "11-12-14-15": "35%",
    "14-15-17-18": "42.4%",
    "17-18-20-21": "50%",
    "20-21-23-24": "57.5%",
    "23-24-26-27": "65%",
    "26-27-29-30": "73%",
    "29-30-32-33": "80%",
    "32-33-35-36": "87.5%",
  };
  return positions_carres[value];
};

// Helper pour distinguer les carrés hauts des bas
const isCarreHigh = (value: string | number): value is CarreValueHight => {
  return [
    "1-2-4-5",
    "4-5-7-8",
    "7-8-10-11",
    "10-11-13-14",
    "13-14-16-17",
    "16-17-19-20",
    "19-20-22-23",
    "22-23-25-26",
    "25-26-28-29",
    "28-29-31-32",
    "31-32-34-35",
  ].includes(value as string);
};

// Helper pour la position des transversales
const getTransversalePosition = (value: TransversaleValue): string => {
  const positions_transversales: Record<TransversaleValue, string> = {
    "1-2-3": "8.25%",
    "4-5-6": "16%",
    "7-8-9": "23.5%",
    "10-11-12": "31.25%",
    "13-14-15": "38.75%",
    "16-17-18": "46.25%",
    "19-20-21": "53.5%",
    "22-23-24": "61.25%",
    "25-26-27": "68.75%",
    "28-29-30": "76.5%",
    "31-32-33": "83.75%",
    "34-35-36": "91.75%",
  };
  return positions_transversales[value];
};

export default BetsOverlay;
