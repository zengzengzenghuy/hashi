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

export const worldchainSepolia: Chain = defineChain({
  id: 4801,
  name: "WorldchainSepolia",
  network: "worldchain-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://worldchain-sepolia.g.alchemy.com/public"],
    },
    public: {
      http: ["https://worldchain-sepolia.g.alchemy.com/public"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://worldchain-sepolia.explorer.alchemy.com" },
  },
})

export const polygonAmoy: Chain = defineChain({
  id: 80002,
  name: "polygonAmoy",
  network: "polygon-Amoy",
  nativeCurrency: { decimals: 18, name: "MATIC", symbol: "MATIC" },
  rpcUrls: {
    default: {
      http: ["https://rpc-amoy.polygon.technology/"],
    },
    public: {
      http: ["https://rpc-amoy.polygon.technology/"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://amoy.polygonscan.com/" },
  },
})
