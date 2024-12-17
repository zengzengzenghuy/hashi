import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  gnosis,
  gnosisChiado,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  sepolia,
} from "viem/chains"
import { unichainSepolia, worldchainSepolia, polygonAmoy } from "./utils/customChain"
import { Chain } from "viem"
import { logger } from "@gnosis/hashi-common"

import Multiclient from "./MultiClient"
import StandardReporterController from "./controllers/StandardReporterController"
import WormholeReporterController from "./controllers/WormholeReporterController"

import Coordinator from "./Coordinator"
import { settings } from "./settings/index"
;(async () => {
  const controllersEnabled = process.env.REPORTERS_ENABLED?.split(",")

  const sourceChainId = Number(process.env.SOURCE_CHAIN_ID)
  const destinationChainIds = process.env.DESTINATION_CHAIN_IDS?.split(",").map((_chainId) => Number(_chainId))
  const chains = [
    arbitrum,
    avalanche,
    arbitrumSepolia,
    base,
    baseSepolia,
    bsc,
    bscTestnet,
    gnosis,
    gnosisChiado,
    optimism,
    optimismSepolia,
    polygon,
    polygonAmoy,
    mainnet,
    sepolia,
    unichainSepolia,
    worldchainSepolia,
  ]
  const sourceChain: Chain = Object.values(chains).find((_chain) => _chain.id === sourceChainId) as Chain
  const destinationChains: Chain[] = Object.values(chains).filter((_chain) => destinationChainIds?.includes(_chain.id))
  const unidirectionalAdaptersAddresses = settings.contractAddresses.adapterAddresses.unidirectional as any
  const unidirectionalReportersAddresses = settings.contractAddresses.reporterAddresses.unidirectional as any
  const lightClientAddresses = settings.contractAddresses.lightClientAddresses as any

  const multiClient = new Multiclient({
    chains: [sourceChain, ...destinationChains],
    privateKey: process.env.PRIVATE_KEY as `0x${string}`,
    rpcUrls: settings.rpcUrls,
  })

  const ambReporterController = new StandardReporterController({
    name: "AMBReporterController",
    type: "classic",
    sourceChain,
    destinationChains: destinationChains.filter(({ name }) => name === gnosis.name || name === gnosisChiado.name),
    logger,
    multiClient,
    reporterAddresses: {
      [gnosis.name]: unidirectionalReportersAddresses[sourceChain.name]?.[gnosis.name]?.AMBReporter,
      [gnosisChiado.name]: unidirectionalReportersAddresses[sourceChain.name]?.[gnosisChiado.name]?.AMBReporter,
    },
    adapterAddresses: {
      [gnosis.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[gnosis.name]?.AMBAdapter,
      [gnosisChiado.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[gnosisChiado.name]?.AMBAdapter,
    },
  })

  const sygmaReporterController = new StandardReporterController({
    name: "SygmaReporterController",
    type: "classic",
    sourceChain,
    destinationChains,
    logger,
    multiClient,
    reporterAddresses: {
      [gnosis.name]: unidirectionalReportersAddresses[sourceChain.name]?.[gnosis.name]?.SygmaReporter,
    },
    adapterAddresses: {
      [gnosis.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.Gnosis?.SygmaAdapter,
    },
  })

  const wormholeReporterController = new WormholeReporterController({
    type: "classic",
    sourceChain,
    destinationChains,
    logger,
    multiClient,
    reporterAddress: (settings.contractAddresses.reporterAddresses as any)[sourceChain.name]?.WormholeReporter,
    adapterAddresses: {
      // [gnosis.name]: (settings.contractAddresses.adapterAddresses as any)?.Gnosis?.WormholeAdapter,
      // [optimism.name]: (settings.contractAddresses.adapterAddresses as any)["OP Mainnet"]?.WormholeAdapter,
      // [bsc.name]: (settings.contractAddresses.adapterAddresses as any)["BNB Smart Chain"]?.WormholeAdapter,
      // [polygon.name]: (settings.contractAddresses.adapterAddresses as any)?.Polygon.WormholeAdapter,
      // [avalanche.name]: (settings.contractAddresses.adapterAddresses as any)?.Avalanche.WormholeAdapter,
      [gnosisChiado.name]: (settings.contractAddresses.adapterAddresses as any)?.[gnosisChiado.name]?.WormholeAdapter,
    },
    wormholeScanBaseUrl: settings.reporterControllers.WormholeReporterController.wormholeScanBaseUrl,
    wormholeAddress: (settings.contractAddresses as any)[sourceChain.name]?.Wormhole,
    wormholeChainIds: settings.reporterControllers.WormholeReporterController.wormholeChainIds,
  })

  const axelarReporterController = new StandardReporterController({
    name: "AxelarReporterController",
    type: "classic",
    sourceChain,
    destinationChains,
    logger,
    multiClient,
    reporterAddresses: {
      [bsc.name]: unidirectionalReportersAddresses[sourceChain.name]?.[bsc.name]?.AxelarReporter,
    },
    adapterAddresses: {
      [bsc.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[bsc.name]?.AxelarAdapter,
    },
    reportHeadersValue: settings.reporterControllers.AxelarReporterController.reportHeadersValue,
  })

  const connextReporterController = new StandardReporterController({
    name: "ConnextReporterController",
    type: "classic",
    sourceChain,
    destinationChains,
    logger,
    multiClient,
    reporterAddresses: {
      [gnosis.name]: unidirectionalReportersAddresses[sourceChain.name]?.[gnosis.name]?.ConnextReporter,
    },
    adapterAddresses: {
      [gnosis.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[gnosis.name]?.ConnextAdapter,
    },
    reportHeadersValue: settings.reporterControllers.ConnextReporterController.reportHeadersValue,
  })

  const celerReporterController = new StandardReporterController({
    name: "CelerReporterController",
    type: "classic",
    sourceChain,
    destinationChains,
    logger,
    multiClient,
    reporterAddresses: {
      [polygon.name]: unidirectionalReportersAddresses[sourceChain.name]?.[polygon.name]?.CelerReporter,
    },
    adapterAddresses: {
      [polygon.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[polygon.name]?.CelerAdapter,
    },
    reportHeadersValue: settings.reporterControllers.CelerReporterController.reportHeadersValue,
  })

  const layerZeroReporterController = new StandardReporterController({
    name: "LayerZeroReporterController",
    type: "classic",
    sourceChain,
    destinationChains,
    logger,
    multiClient,
    reporterAddresses: {
      [polygon.name]: unidirectionalReportersAddresses[sourceChain.name]?.[polygon.name]?.LayerZeroReporter,
      [bsc.name]: unidirectionalReportersAddresses[sourceChain.name]?.[bsc.name]?.LayerZeroReporter,
      [gnosis.name]: unidirectionalReportersAddresses[sourceChain.name]?.[gnosis.name]?.LayerZeroReporter,
      [base.name]: unidirectionalReportersAddresses[sourceChain.name]?.[base.name]?.LayerZeroReporter,
      [optimism.name]: unidirectionalReportersAddresses[sourceChain.name]?.[optimism.name]?.LayerZeroReporter,
      [arbitrum.name]: unidirectionalReportersAddresses[sourceChain.name]?.[arbitrum.name]?.LayerZeroReporter,
      [unichainSepolia.name]:
        unidirectionalReportersAddresses[sourceChain.name]?.[unichainSepolia.name]?.LayerZeroReporter,
      [sepolia.name]: unidirectionalReportersAddresses[sourceChain.name]?.[sepolia.name]?.LayerZeroReporter,
      [gnosisChiado.name]: unidirectionalReportersAddresses[sourceChain.name]?.[gnosisChiado.name]?.LayerZeroReporter,
      [arbitrumSepolia.name]:
        unidirectionalReportersAddresses[sourceChain.name]?.[arbitrumSepolia.name]?.LayerZeroReporter,
      [baseSepolia.name]: unidirectionalReportersAddresses[sourceChain.name]?.[baseSepolia.name]?.LayerZeroReporter,
      [unichainSepolia.name]:
        unidirectionalReportersAddresses[sourceChain.name]?.[unichainSepolia.name]?.LayerZeroReporter,
      [worldchainSepolia.name]:
        unidirectionalReportersAddresses[sourceChain.name]?.[worldchainSepolia.name]?.LayerZeroReporter,
      [polygonAmoy.name]: unidirectionalReportersAddresses[sourceChain.name]?.[polygonAmoy.name]?.LayerZeroReporter,
      [optimismSepolia.name]:
        unidirectionalReportersAddresses[sourceChain.name]?.[optimismSepolia.name]?.LayerZeroReporter,
    },
    adapterAddresses: {
      [polygon.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[polygon.name]?.LayerZeroAdapter,
      [bsc.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[bsc.name]?.LayerZeroAdapter,
      [gnosis.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[gnosis.name]?.LayerZeroAdapter,
      [base.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[base.name]?.LayerZeroAdapter,
      [optimism.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[optimism.name]?.LayerZeroAdapter,
      [arbitrum.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[arbitrum.name]?.LayerZeroAdapter,
      [unichainSepolia.name]:
        unidirectionalAdaptersAddresses[sourceChain.name]?.[unichainSepolia.name]?.LayerZeroAdapter,
      [sepolia.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[sepolia.name]?.LayerZeroAdapter,
      [gnosisChiado.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[gnosisChiado.name]?.LayerZeroAdapter,
      [arbitrumSepolia.name]:
        unidirectionalAdaptersAddresses[sourceChain.name]?.[arbitrumSepolia.name]?.LayerZeroAdapter,
      [baseSepolia.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[baseSepolia.name]?.LayerZeroAdapter,
      [unichainSepolia.name]:
        unidirectionalAdaptersAddresses[sourceChain.name]?.[unichainSepolia.name]?.LayerZeroAdapter,
      [worldchainSepolia.name]:
        unidirectionalAdaptersAddresses[sourceChain.name]?.[worldchainSepolia.name]?.LayerZeroAdapter,
      [polygonAmoy.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[polygonAmoy.name]?.LayerZeroAdapter,
      [optimismSepolia.name]:
        unidirectionalAdaptersAddresses[sourceChain.name]?.[optimismSepolia.name]?.LayerZeroAdapter,
    },
    reportHeadersValue: settings.reporterControllers.LayerZeroReporterController.reportHeadersValue,
  })

  const hyperlaneReporterController = new StandardReporterController({
    name: "HyperlaneReporterController",
    type: "classic",
    sourceChain,
    destinationChains,
    logger,
    multiClient,
    reporterAddresses: {
      [bsc.name]: unidirectionalReportersAddresses[sourceChain.name]?.[bsc.name]?.HyperlaneReporter,
    },
    adapterAddresses: {
      [bsc.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[bsc.name]?.HyperlaneAdapter,
    },
  })

  const ccipReporterController = new StandardReporterController({
    name: "CCIPReporterController",
    type: "classic",
    sourceChain,
    destinationChains,
    logger,
    multiClient,
    reporterAddresses: {
      [avalanche.name]: unidirectionalReportersAddresses[sourceChain.name]?.[avalanche.name]?.CCIPReporter,
      [gnosisChiado.name]: unidirectionalReportersAddresses[sourceChain.name]?.[gnosisChiado.name]?.CCIPReporter,
    },
    adapterAddresses: {
      [bscTestnet.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[bscTestnet.name]?.CCIPAdapter,
      [avalanche.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[avalanche.name]?.CCIPAdapter,
      [gnosisChiado.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[gnosisChiado.name]?.CCIPAdapter,
    },
    reportHeadersValue: settings.reporterControllers.CCIPReporterController.reportHeadersValue,
  })

  const zetaReporterController = new StandardReporterController({
    name: "ZetaReporterController",
    type: "classic",
    sourceChain,
    destinationChains,
    logger,
    multiClient,
    reporterAddresses: {
      [bscTestnet.name]: unidirectionalReportersAddresses[sourceChain.name]?.[bscTestnet.name]?.ZetaChainReporter,
    },
    adapterAddresses: {
      [bscTestnet.name]: unidirectionalAdaptersAddresses[sourceChain.name]?.[bscTestnet.name]?.ZetaChainAdapter,
    },
    reportHeadersValue: settings.reporterControllers.ZetaReporterController.reportHeadersValue,
  })

  const coordinator = new Coordinator({
    controllers: [
      ambReporterController,
      ccipReporterController,
      sygmaReporterController,
      wormholeReporterController,
      axelarReporterController,
      connextReporterController,
      celerReporterController,
      layerZeroReporterController,
      hyperlaneReporterController,
      zetaReporterController,
    ].filter((_controller) => controllersEnabled?.includes(_controller.name)),
    intervalFetchBlocksMs: settings.Coordinator.intervalFetchBlocksMs,
    logger,
    multiclient: multiClient,
    sourceChain,
    queryBlockLength: settings.Coordinator.queryBlockLength,
    blockBuffer: settings.Coordinator.blockBuffer,
    intervalsUpdateLightClients: settings.Coordinator.intervalsUpdateLightClients,
  })

  coordinator.start()
})()
