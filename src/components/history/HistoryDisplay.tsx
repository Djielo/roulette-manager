import { FC } from "react";
import { useCommonMethodsStore } from "../../store/useCommonMethodsStore";
import { formatRouletteNumber } from "../../utils/rouletteUtils";

const HistoryDisplay: FC = () => {
  const history = useCommonMethodsStore((state) => state.history);

  const renderNumber = (number: number) => {
    const isRed = [
      1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
    ].includes(number);
    const bgColor =
      number === 0 || number === 37
        ? "bg-roulette-green"
        : isRed
        ? "bg-roulette-red"
        : "bg-roulette-black";

    return (
      <div
        className={`${bgColor} w-10 h-10 flex items-center justify-center text-white border rounded-full`}
      >
        {formatRouletteNumber(number)}
      </div>
    );
  };

  return (
    <div className="h-48 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-roulette-gold/80">
      <div className="grid grid-cols-12 gap-1">
        {[...history].reverse().map((spin) => (
          <div key={spin.timestamp}>{renderNumber(spin.number)}</div>
        ))}
      </div>
    </div>
  );
};

export default HistoryDisplay;
