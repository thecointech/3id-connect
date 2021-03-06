import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import Ceramic from '@ceramicnetwork/http-client'
import { DID } from 'dids'

import { EthereumAuthProvider, ThreeIdConnect } from '../src'

import web3Modal from './providers'

const CERAMIC_URL = process.env.CERAMIC_API || 'http://localhost:7007'

const threeIdConnect = new ThreeIdConnect()

const authenticate = async () => {
  const ethProvider = await web3Modal.connect()
  const addresses = await ethProvider.enable()

  const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])
  await threeIdConnect.connect(authProvider)

  const ceramic = new Ceramic(CERAMIC_URL)
  const did = new DID({
    provider: threeIdConnect.getDidProvider(),
    resolver: ThreeIdResolver.getResolver(ceramic),
  })

  await did.authenticate()
  console.log(did.id)

  const jws = await did.createJWS({ hello: 'world' })
  console.log(jws)
}

// TODO must connect first
let accountslist
const accounts = async () => {
  const dids = await threeIdConnect.accounts()
  accountslist = Object.keys(dids)
  console.log(dids)
}

const create = async () => {
  const res = await threeIdConnect.createAccount()
  console.log(res)
}

const link = async () => {
  // @ts-ignore
  const res = await threeIdConnect.addAuthAndLink(accountslist[0])
  console.log(res)
}

document.getElementById('bauth').addEventListener('click', authenticate)
document.getElementById('baccounts').addEventListener('click', accounts)
document.getElementById('bcreate').addEventListener('click', create)
document.getElementById('blink').addEventListener('click', link)
