// src/components/shared/Alert.tsx
import { FC } from 'react';
import { useRouletteStore } from '../../store/useRouletteStore';

const Alert: FC = () => {
  const errors = useRouletteStore(state => state.validationErrors);
  
  if (!errors?.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      {errors.map((error: string, index: number) => (
        <div key={index} className="bg-red-900/90 border border-red-500 text-white p-4 rounded-lg mb-2">
          {error}
        </div>
      ))}
    </div>
  );
};

export default Alert;