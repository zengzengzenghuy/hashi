import { Chain } from "viem"
import winston from "winston"

import Multiclient from "../MultiClient"

export type ControllerType = "classic" | "lightClient"

export type BaseControllerConfigs = {
  type: ControllerType
  sourceChain: Chain
  destinationChains: Chain[]
  reporterAddress?: string
  adapterAddresses: { [chainName: string]: `0x${string}` }
  logger: winston.Logger
  multiClient: Multiclient
}

class BaseController {
  name: string
  type: ControllerType
  sourceChain: Chain
  destinationChains: Chain[]
  reporterAddress?: `0x${string}`
  adapterAddresses: { [chainName: string]: `0x${string}` }
  logger: winston.Logger
  multiClient: Multiclient

  constructor(configs: BaseControllerConfigs, name: string) {
    this.sourceChain = configs.sourceChain
    this.destinationChains = configs.destinationChains
    this.reporterAddress = configs.reporterAddress as `0x${string}`
    this.adapterAddresses = configs.adapterAddresses
    this.multiClient = configs.multiClient
    this.type = configs.type
    this.name = name

    this.logger = configs.logger.child({ service: this.name })
  }

  onBlocks(_blockNumbers: bigint[]) {}

  update() {}
}

export default BaseController
