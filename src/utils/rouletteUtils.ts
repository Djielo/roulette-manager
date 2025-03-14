/**
 * Convertit un numéro de roulette en sa représentation d'affichage
 * @param number Le numéro de roulette (0-37)
 * @returns La représentation d'affichage du numéro (0-36 ou "00" pour 37)
 */
export const formatRouletteNumber = (number: number): string | number => {
  return number === 37 ? "00" : number;
};
