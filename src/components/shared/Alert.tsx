// src/components/shared/Alert.tsx
import { FC, useEffect } from "react";
import { useRouletteStore } from "../../store/useRouletteStore";

const Alert: FC = () => {
  const errors = useRouletteStore().validationErrors || [];

  useEffect(() => {
    if (errors.length > 0) {
      console.log("Composant Alert: Erreurs détectées", errors);
    }
  }, [errors]);

  if (errors.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] w-96">
      {errors.map((error: string, index: number) => (
        <div
          key={index}
          className="bg-red-900/90 border-2 border-red-500 text-white p-4 rounded-lg mb-2 shadow-xl font-bold"
        >
          {error}
        </div>
      ))}
    </div>
  );
};

export default Alert;
