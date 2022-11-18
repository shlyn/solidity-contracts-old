import { providers, Wallet } from 'ethers'
import * as dotenv from "dotenv"

dotenv.config()

const privekey = process.env.PRIVEKEY as string
const infura_url = `${process.env.URL_INFURA}/${process.env.API_KEY_INFURA}`

export const provider = new providers.JsonRpcProvider(infura_url)
export const wallet = new Wallet(privekey, provider)