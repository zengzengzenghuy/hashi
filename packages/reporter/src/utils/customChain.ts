import { defineChain, Chain } from "viem"

export const unichainSepolia: Chain = defineChain({
  id: 1301,
  name: "UnichainSepolia",
  network: "unichain-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.unichain.org"],
    },
    public: {
      http: ["https://sepolia.unichain.org"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://sepolia.uniscan.xyz/" },
  },
})
