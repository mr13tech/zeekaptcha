export const shortenCryptoAddress = (
  address: `0x${string}` | undefined
): string | null => {
  return `${address?.slice(0, 6) ?? ""}...${address?.slice(-4) ?? ""}`;
};
