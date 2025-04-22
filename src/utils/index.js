export const getDecimals = (value) => {
    return (Math.round(value * 100) / 100).toFixed(2);
  };