const getSupermarketBrandColor = (supermarket: string): string => {
  // todo: import them from theme.tsx
  const brandColors: Record<string, string> = {
    Aldi: 'yellow',
    Tesco: 'blue',
    Sainsburys: 'orange',
    Asda: 'green',
  };

  return brandColors[supermarket];
};

export default getSupermarketBrandColor;
