/*
Note that these E2E tests simulate cross-chain interactions but,
for the sake of convenience, use only one network as both the origin and destination chain.

*/
import { expect } from "chai"
import { ethers, network } from "hardhat"

const DOMAIN_ID = network.config.chainId
const BYTES32_DOMAIN_ID = "0x0000000000000000000000000000000000000000000000000000000000007A69"

// const ID_ZERO = 0
const ID_ONE = 10000000
const ID_TWO = 2
const CryptoPunkAddress = "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb"
const CryptoPunk420OwnerAtBlock10Mil = "0xc352b534e8b987e036a93539fd6897f53488e56a"
// https://etherscan.io/tx/0x324ba0703e783108b0b5f66ab520de9b13529b6bb7db789ce8f39f1369973a43
// storage key for cryptopunk 0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB
// https://demo.axiom.xyz/custom
// Function: attestSlots((uint32,bytes32,bytes32,uint32,bytes32[10]), bytes)
// #	Name	Type	Data
// 0	blockData.blockNumber	uint32	10000000
// 0	blockData.claimedBlockHash	bytes32	0xaa20f7bde5be60603f11a45fc4923aab7552be775403fc00c2e6b805e6297dbe
// 0	blockData.prevHash	bytes32	0x00dccd7227da056f4a439347923411d11e7756a88e3c9d4efbe9852cee671b65
// 0	blockData.numFinal	uint32	1024
// 0	blockData.merkleProof	bytes32[10]	0x7823fa4da327cf97a9b86da990b0755ebfaa3b490ecd0be80b0ed24106d1a8d7,0x126a2dc8ecfedc0ceb5d312da2ad5f88a93c6a3f4a38a8b778bc5ccb1d39f937,0x0cf1cf53800ec678d0deacea8ef8e57747185fa438c5a823f25274ecc3613463,0x356b4d133078199280cf008daddc4bc4ebc2fd543e144b6e01859b026a5c5115,0xbf337229d4003538b1d2b44c21c5b566b6036a00c2d389204222d328dbb72821,0xeb259a83488c376707bd80d3bc63e1b55bf6ed9248ea72392ffc7f125133293d,0x93d75de9876136b28cb9334615785f472696a7fe448c5b983c0f1f916de033b3,0xd7bdbe170113c89491892ea3fd0e4f9a0ec17109141536e78550e82ee6860f28,0xe16c89a378abf45439eb41475f93fb52c38bc987425f5bcebbcd13ec3f0d36df,0x4f57444b9a4f732d077c3c3062043ff61ff001afed844cd074e00c5f73c64f5d
// 2	proof	bytes	0x000000000000000000000000000000000000000000af8fdb20c227d925248e42000000000000000000000000000000000000000000644db7116af142304717e2000000000000000000000000000000000000000000002063eb172efc8cd28c7700000000000000000000000000000000000000000084da9135a9629d12a554af00000000000000000000000000000000000000000058bb95a1264192c555eb180000000000000000000000000000000000000000000008b46561cf0d581f19d9000000000000000000000000000000000000000000e6c200773117d79ace781f00000000000000000000000000000000000000000091411a01fc5663579b998a00000000000000000000000000000000000000000000201f607169410341ed5300000000000000000000000000000000000000000003beb92fd8db4c92fc4323000000000000000000000000000000000000000000c2de15bab300d3b076e1dc000000000000000000000000000000000000000000002ef20ab8392eed55288700000000000000000000000000000000aa20f7bde5be60603f11a45fc4923aab000000000000000000000000000000007552be775403fc00c2e6b805e6297dbe0000000000000000000000000000000000000000000000000000000000989680000000000000000000000000b47e3cd837ddf8e4c57f05d70ab865de6e193bbb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000043727970746f50756e6b73000000000000000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a2c417b53ac258dea0e9c3a09d465fa7b2ad9817949830926652cccf9e457ccff0a3520e219203ce55d67133c7044e722cd1c62b332863afac1b8aa172925e51a038d06fea82e77649ee6ff7d78478d50e4f76c29297f011806f3ea5087092b5021d6565ad78f3fe4b586de17653d0d83c54f020d8edc847f715b188fe8c9b5df00f76251d51443cbeb6de48750b01e75dcf232105c77d8b1ad56ca45daa1fe751dad7cf6b6c5aba58e16fb2c380fb861cbf69228fbd662736341e4ebe19beae02ee2ff31085b71de6b8ea37fcd87e5e040ab0ce40f84f4919a5f8da433e8e0421d923eec9ca9d87ceee7307df0da870d03e6c86dc7a2ceb975290856d49a14f716f87687189db783f45fc071cc00b57479efacd2a81d20d80ade7d9cc3b9427604a354b94ea14fc45a8821e424b2432770416b635c14488aaa56d021ada72b30259a5cc3dbc0c70b4033990cf0256b00a2bb4e3f95091011abb04dcb167d20a10b5962c321f9250c76008f986767a4fb019595b307af3e17ed8667606c4c02b011205e3aaca1c0e3fdaf0fe0440c13b393cc60818cd3807e717a671655a850b22f3d3fe0ae70e5be87b078dfa93ffe024857feadcc85444a38f4cb5815cf837f1027ba5859ac2347603af8d92b864641f276ea731575d905d8aeb7c5bf0614a70c8f50c5eb504142756459bf9ad890a1e98a0c0bb6985753b032e39234d78d8b1334e88a5c5345456317bf3c323f5059ed451bff0a3b98b7b7bcd2a6a2e2eda4029a0257f2ae62da324efdc2d501415659153b3fddc4de0325e1ee2334f1c7ce0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000229c401756e1f1bf00a43e9091579781658e52d2411c09444b529c1c604cd09bd2447dc0526bb32fd06a26544d5c564f89260eb2c34315d7538bef78fd24243062fb0db58ebc6fb463894fab1fe0cda941d0bbcc97011875b95324ce68e255a5123cda5eb0f1404d4dfbbf6322010bc1f63a6701a10f3333b61a0bb199fafce330982d83b8646a63f6dfdbebd4c6e6f6c622cc64ca598e65c3a9b43bebbb401fe211f9c1cde3f95f867527cc14bde911e94fd3115b725803b83a768a5aa6bfaba056ed9da84987ba89dc11838efc71789395cbdbb8bc51e731979409744e0b28f19806de8bc36e2335fb77f561b7535be30c51451ad60ff9d6c3dea8591f6bad00d80f4627e6fc496a8d35efc7ee2247ebc1fe940c966115965e04019ee73ae47213ddc26f47c6bd48ccc6059d9da9ea91538cf9f80f4e3be8fed91e85f90150802bf21cb3805aab138e17ac6ea5433eab028a0dfe206364e2acc4e074fcefabf03b7df4afc594d202ca2a892afd4935e5a5fd9a7e80c9be3d26926a217af5aae00420c111a7311fa500ae6e95fcf52cbee8378be50b85ba9e7fd9f4f1afdf0a216b20f3e7fd807e8695ce1689de2c62aa79fad10c9a5f621bcf25fd4e59b80b11fd0f3ddf53445b77fdb5cc9384532b17db631d4c371ec8582dcb79c4d14cd9e2501804dae3e71f9b8434bbc808363dd4d79b1248b35b15053c31c2b26edd2e0181c0bb5c799a84a9c219e0cfe55ed78b5ead9a441ab1812d3d0f0d07b9334a801d91543a42d1763640f8eccaca82af95415a88fe494607edac09fadf6c6f75227a04bc30233135a1ced057f0866cc8398a18c8547f767027d99a9a728fc1d4c00000000000000000000000000000000000000000000000000000000000000011d5d1460c917d52426c75b3be66a3273eea78f1bb27c9193cd44c23c8f6a84e520f0005a8cc725d671c522b3babef27c1adb38ebd18f41dabf581794df165676251d1f286f5cb238c1d95e149b37ec6a0ada2b65416303d371ed8607cd9558f711d3eca5b425ddb7ae6ab6760cf36123e63da627bfaa93f6d35cba5b22511bc5192609ee19ae267f2cd42ee93174692da524a1109daef4a06bbe47cb4880fda21854b7719fe26e00ee5de50d57cd229724f0370a1f860cfc95a8d7c117d5f23c2d0866e798112bf67b647c2ad0e83fcecc1abd2989350d45345611f63db5d2201f34c4a32c3d98e498455036c20f3601caa007f71691d53efa0ba7bfcde3594f155e0dbde630af0736817e818df64c8acf53b63ec316464f5963d7c6d33f55d602d6a3d6de0b695bddfab9e74fa87cfb72cf377f35f79ae8602e8fdc8ea8550e085347ca45e928f8025696856778d660d957b26faa90e5c731b57a3a7891457e0b5f5d9530b74eecf70b2c7b0b6dc936d86fb86e5d057f55cc260ffd0eba583d1a2e20d53b9fd6abcd0629bc5ba9bafde1b28b1d39d68853ddc05a49bb1c083d062c135ac184127e8ade0ad40b765f51f9a01d4242e36189ec8352259953ab2c27ccbba9c63f44a0614c7801d179515d945a135d9aad8df9d32d4b36bf6a8e680726e91a97cb641fa4f7f624dd260bf17a97393a642232319846f9052ba3e3c51a2d48aee7f6d0309964e5210eeb8d7597febbe7a86a3e8bdfb087020902899901020c077d97947319135f61d8b72801357bfc280f4254ab1b3f33fad2b05cc021c7bf12369c7d9e322669d04581a4aab17855b6789db89209c4911799b3980d152507f853337bbffb5634153fd157a5881706377ad3ad104d3030cf76b57d88178b2ff9f0c150022c23dec41317d668e7b756a8a2d57c891b23e12c0910397027b491d766663c03a534cb9c8b4681e28f4121d2f8fa9ce7b7e9a866b4762ed4

const blockHashWitness = {
  blockNumber: 10000000,
  claimedBlockHash: "0xaa20f7bde5be60603f11a45fc4923aab7552be775403fc00c2e6b805e6297dbe",
  prevHash: "0x00dccd7227da056f4a439347923411d11e7756a88e3c9d4efbe9852cee671b65",
  numFinal: 1024,
  merkleProof: [
    "0x7823fa4da327cf97a9b86da990b0755ebfaa3b490ecd0be80b0ed24106d1a8d7",
    "0x126a2dc8ecfedc0ceb5d312da2ad5f88a93c6a3f4a38a8b778bc5ccb1d39f937",
    "0x0cf1cf53800ec678d0deacea8ef8e57747185fa438c5a823f25274ecc3613463",
    "0x356b4d133078199280cf008daddc4bc4ebc2fd543e144b6e01859b026a5c5115",
    "0xbf337229d4003538b1d2b44c21c5b566b6036a00c2d389204222d328dbb72821",
    "0xeb259a83488c376707bd80d3bc63e1b55bf6ed9248ea72392ffc7f125133293d",
    "0x93d75de9876136b28cb9334615785f472696a7fe448c5b983c0f1f916de033b3",
    "0xd7bdbe170113c89491892ea3fd0e4f9a0ec17109141536e78550e82ee6860f28",
    "0xe16c89a378abf45439eb41475f93fb52c38bc987425f5bcebbcd13ec3f0d36df",
    "0x4f57444b9a4f732d077c3c3062043ff61ff001afed844cd074e00c5f73c64f5d",
  ],
}

const proof =
  "0x000000000000000000000000000000000000000000c20a750285a779a8f382940000000000000000000000000000000000000000009040749a7b21fbbbc56ab1000000000000000000000000000000000000000000000cfa5466d74518ec8fc20000000000000000000000000000000000000000005df3478e70672aef4924ce000000000000000000000000000000000000000000231c15e9f1d049b4906f360000000000000000000000000000000000000000000028f4ec9495f4ac35ba99000000000000000000000000000000000000000000b4ea379117dbb72eb018e6000000000000000000000000000000000000000000d02a7285294fc5b3e33ce7000000000000000000000000000000000000000000002cd026928629d6bde1220000000000000000000000000000000000000000008c7d9b39cd4b8001427b92000000000000000000000000000000000000000000b71a51e053a0d595d1c0950000000000000000000000000000000000000000000018168d68ca1de197cf0700000000000000000000000000000000aa20f7bde5be60603f11a45fc4923aab000000000000000000000000000000007552be775403fc00c2e6b805e6297dbe0000000000000000000000000000000000000000000000000000000000989680000000000000000000000000b47e3cd837ddf8e4c57f05d70ab865de6e193bbb000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a068289d29f77618bbdcc6c71439a097a276013e033be69d8365ee3f31330cb720f5a67cf836f713e3cd4334b1cddf68091628f397af8834697d383c46ff30bd728a71b966ef58f2085906901b8721c12c6e4bdbfbd944fa61b5f32d6bb3034260f1c347c2c3f76bf78bc1ff9a0db6355644e79f3e61259b78020b867707f1c382496e73fef160560bc27269102bdccfad037b7d73a09041dd7f6b4fb7f3d4875097d4857f9b0dac1f369f688c2299204b75ad707bb2158e7fbd7b8f16e61b9bb10b72622525962ac6189f50c65efb70cdfa8586ece1972885cb62297ad077c45156c7ac61eaf715afcc00f5b294320d4dddf1545d66e2c565646d4bb45894ca50eec1d5a454b34c1a66997bfb222ea87d93f31ff0528662626a46e57e3c19513299b9b6c08ceeb6c74317c2aedf8767c98568c4affe24421a43c70be4423a22128cc3661a3063d8c787b88a83258633eb03a1a1672062cd8e1fa8dd3bb2eff9e1b17d7de9c9a9ccc741cb643c13af808e4ec81e97a33437c3a33cc663972e695289f54201c49bde0b9551fb27fb51d4e6d208b21f99827887fd8ca467c39d13716500b7e73a058379e09d8c79f0a2eda1e699c81042b8e2647f3fe0f0dba677f25a81b7c54b1efe184426530ad1f12ace22255859b8325f97922231b6c1de3fb0610102f9856a361b7fa1a39a96e0bfac9bcd6dcc3ec1ff8e80d9195590d305f147d3c67016e1a6f13a244a0e09082ceb4c54a09cf777197c82a0940dfea287f02d345930ce03b8a1ef30efc65ddf2eaede252f562443888f31747097a7b3956000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020bfc7599b7ad525a7a5c5673f24831cb57330c6368cfee195c2c8e6e2dcdff3328d97b69dd606bb9c58081b1e5b481a14c4a86e8a3b93e2197f2df3c2d6b45ca10c19fd6de9c6c266fe319d317d562028a9c0cc1497aeccc08e06cc261ea9c9f1314a2543e41ccdeb3cf95792cc31597ea54a947345d8d4c777da128946154d710070a5a3b1da94a326debdd3e42fc7f212abbe8d41e9f2255d9b65e671993ae2c745546d019c9d80f35ae33777ea4a0ff2792cf7ca2ad3ec78d408fc6034daa0dc791655fe9900cf082b028e33ab4368df91e47acfd9ba73eb0fb239453eca102c6a7f3a6bdd7696732e0b00eaf8300124236fc661af10d7c8ab44a1227b30e069f109e21b1359543f617314953f5bd0de5cf754ff94a03feb8b628a0d702840452c6cf70191c30a2461ca712b18d1022792aeba142427f2dade8265d50adbe0cfb24eb5762a677de8ed5acbe0654b01894df77a838d58df6ccc6aadea436dc2000649b14adec14afe9f132afc1ab6deb50980cd54915359c9a20fb59127f212700dc6fde636038c75a918aa2aa7082265ea6ccc1f2380c59a5d6b85794d4be136ecca620dee85a87e5dc94b07814d36fb3bc698e546ef8ef4304f4ac49e2ca106db6229d808b98feb76ca2bacb6d08bae4f0442c031e4838d68babf72cbeed07f5c9b3c318f27212e12519e7434fc4a36ec32415d39cd0545701df1643f2261cee180b590c88a67480df8d770fa50811bea8a4047e8e72c140354d5630f39002e5fae847e670e8a71e49fe41dc3a90d5e0e6519230f4f0cfc6289f7d94b3d923dd9e445b4e723d652cb0a28c4903356c960e5abd4f1dd5e53864053b6881bf00000000000000000000000000000000000000000000000000000000000000012e0a8d9f0ffbf6bd32ed84839f22fe86183955e330dc32c71a7bb91a8a4a1ea906db2b670bae0f9bbe78fe5831cb3d5b04d3772ce8bbebe3f2203afdf3226d4319c919e92c8f35440c255be3c1e0ec605a4a135602e9a9e28fa7b130b5a2d9cf126cee39684d877a577301b4523586d60643692cfce5a9b7739577dbb270292b237d2e53bb5a536cf096398a8bd37e9cdbab0bef75d41538a932b30763261e1917e1b18cad3ae3eb8d2b6c72b0a0ac6131985a9bca46c5cdc5a690aae80633871e8f1e8706a972a124da6864dec1780e2628af87e2e2e1a246b3a4aead2ed5420ad699156b44b28089c1e001f56025927f44811f16da5e1627ed76aeec0476c50ad52cc72bdc305d4f95136e84aeb351bde85c5bcd61376252a762b25922fa0d2a78e5a89489bd3ca3ab1044d586d2ce1ecb3e67fb34f6c0f17b7c04ec7b6ccd00cfab3aa4660176290472248fb2e65dffe64c78735c0450bfd751a5df4f6cc22d23ce481ea6694d4e838d9ee90896d5e8dd1d383ceff8f0b1663adc5423cb801fef7f6ce0ae102ffefa790f3205392215e69fb6da0b188db31b7184ac3231af0450ecdcba2d09b5a928f1fe9a0c5b86c93cab01a3ff6a9b6ced1a08d112cf0b241f916f1326df53e6f0a378779d1858acd187eb4313bb47beb55942f5af3d5f0edd784e862c678e020bd222dbea1d8915c3ed46bc73ab0ea69b3df2438c513710f81e94e27dd8c81fe3a2ec350ce18b48c72927f4703ce2ab4915c7feb4ac3508044a522b16938d9fa9bd90a5a0c03aca11e38465f0104c5960420f1dba9a542a3394443534a115c2c1523450a8b9c000bb400e978a5e0c94cf6a87c01b858408062321c2720ef601121f822072883452be1adfb58d50acb9a97bc75fd8564d0997fbf9ad6fd83bdadd4c03a381818736bc0bdadc0a4ab7265102328677abb41a6f8f471fb3072b1710c891959c09ef6304a491d724e66c57760f4a38593c2b"

const setup = async () => {
  const [wallet] = await ethers.getSigners()

  // deploy hashi
  const Hashi = await ethers.getContractFactory("Hashi")
  const hashi = await Hashi.deploy()

  // deploy GiriGiriBashi
  const GiriGiriBashi = await ethers.getContractFactory("GiriGiriBashi")
  const giriGiriBashi = GiriGiriBashi.deploy(wallet.address, hashi.address)

  // deploy Yaho
  const Yaho = await ethers.getContractFactory("Yaho")
  const yaho = await Yaho.deploy()

  // deploy AMB
  const AMB = await ethers.getContractFactory("MockAMB")
  const amb = await AMB.deploy()

  const axiomAddressMainnet = "0xF990f9CB1A0aa6B51c0720a6f4cAe577d7AbD86A"
  const verifierAddress = "0x29052F4F5e96d71772AD2b145f8C3eb7db4DB33E"
  const AxiomV02 = await ethers.getContractFactory("AxiomV02")
  const axiomV02 = await AxiomV02.deploy(axiomAddressMainnet, verifierAddress)

  const AxiomV02StoragePf = await ethers.getContractFactory("AxiomV02StoragePf")
  const storageProof = await AxiomV02StoragePf.deploy(axiomAddressMainnet, verifierAddress, hashi.address)

  return {
    amb,
    wallet,
    hashi,
    giriGiriBashi,
    yaho,
    storageProof,
  }
}

describe("Axiom E2E test", function () {
  describe("Execution layer", function () {
    it("Attest slots for the claimed block head with the block hash agreed on by N adapters", async function () {
      const { amb, hashi, storageProof } = await setup()

      // deploy header storage
      const HeaderStorage = await ethers.getContractFactory("HeaderStorage")
      const headerStorage = await HeaderStorage.deploy()

      // deploy AMBHeaderReporter
      const AMBHeaderReporter = await ethers.getContractFactory("AMBHeaderReporter")
      const ambHeaderReporter = await AMBHeaderReporter.deploy(amb.address, headerStorage.address)

      // deploy AMBAdapter
      const AMBAdapter = await ethers.getContractFactory("AMBAdapter")
      const ambAdapter = await AMBAdapter.deploy(amb.address, ambHeaderReporter.address, BYTES32_DOMAIN_ID)

      await ambHeaderReporter.reportHeaders([ID_ONE], ambAdapter.address, 10000000)

      let expectedHash = await headerStorage.headers(ID_ONE)
      expect(
        await hashi.getHash(
          DOMAIN_ID,
          ID_ONE,
          // TODO: currently we query the AMB adapter twice. We should query two or more different adapters.
          [ambAdapter.address, ambAdapter.address],
        ),
      ).to.equal(expectedHash)

      const attestation = await storageProof.attestSlotsWithHashi(
        proof,
        DOMAIN_ID,
        ID_ONE,
        blockHashWitness.claimedBlockHash,
        [ambAdapter.address, ambAdapter.address],
      )

      // uint32 blockNumber, address addr, uint256 slot, uint256 slotValue
      // https://etherscan.io/tx/0x324ba0703e783108b0b5f66ab520de9b13529b6bb7db789ce8f39f1369973a43#eventlog
      await expect(attestation).to.emit(storageProof, "SlotAttestationEvent")
    })

    it("Reverts if the claimed block header is different from the block hash agreed on by N adapters", async function () {
      const { amb, hashi, storageProof } = await setup()

      // deploy header storage
      const HeaderStorage = await ethers.getContractFactory("HeaderStorage")
      const headerStorage = await HeaderStorage.deploy()

      // deploy AMBHeaderReporter
      const AMBHeaderReporter = await ethers.getContractFactory("AMBHeaderReporter")
      const ambHeaderReporter = await AMBHeaderReporter.deploy(amb.address, headerStorage.address)

      // deploy AMBAdapter
      const AMBAdapter = await ethers.getContractFactory("AMBAdapter")
      const ambAdapter = await AMBAdapter.deploy(amb.address, ambHeaderReporter.address, BYTES32_DOMAIN_ID)

      await ambHeaderReporter.reportHeaders([ID_ONE], ambAdapter.address, 10000000)

      let expectedHash = await headerStorage.headers(ID_ONE)
      expect(
        await hashi.getHash(
          DOMAIN_ID,
          ID_ONE,
          // TODO: currently we query the AMB adapter twice. We should query two or more different adapters.
          [ambAdapter.address, ambAdapter.address],
        ),
      ).to.equal(expectedHash)

      const invalidBlockHashWitness = {
        ...blockHashWitness,
        claimedBlockHash: "0x30db8cd39796630f83af6d4cb062a50f90d1768f8723f37af018be8b1d664e50",
      }

      await expect(
        storageProof.attestSlotsWithHashi(proof, DOMAIN_ID, ID_ONE, invalidBlockHashWitness.claimedBlockHash, [
          ambAdapter.address,
          ambAdapter.address,
        ]),
      ).to.revertedWith("block hash mismatch with hash block hash")
    })
  })

  describe("L1 State Verification Example", function () {
    it("Get the correct cryptopunk#420 owner address with the proof", async function () {
      const { amb, hashi, storageProof } = await setup()

      // deploy header storage
      const HeaderStorage = await ethers.getContractFactory("HeaderStorage")
      const headerStorage = await HeaderStorage.deploy()

      // deploy AMBHeaderReporter
      const AMBHeaderReporter = await ethers.getContractFactory("AMBHeaderReporter")
      const ambHeaderReporter = await AMBHeaderReporter.deploy(amb.address, headerStorage.address)

      // deploy AMBAdapter
      const AMBAdapter = await ethers.getContractFactory("AMBAdapter")
      const ambAdapter = await AMBAdapter.deploy(amb.address, ambHeaderReporter.address, BYTES32_DOMAIN_ID)

      await ambHeaderReporter.reportHeaders([ID_ONE], ambAdapter.address, 10000000)

      let expectedHash = await headerStorage.headers(ID_ONE)
      expect(
        await hashi.getHash(
          DOMAIN_ID,
          ID_ONE,
          // TODO: currently we query the AMB adapter twice. We should query two or more different adapters.
          [ambAdapter.address, ambAdapter.address],
        ),
      ).to.equal(expectedHash)

      const expectedAddress = await storageProof.callStatic.attestCryptoPunk420AddressWithHashi(
        proof,
        DOMAIN_ID,
        ID_ONE,
        blockHashWitness.claimedBlockHash,
        [ambAdapter.address, ambAdapter.address],
      )
      expect(expectedAddress.toLowerCase()).to.equal(CryptoPunk420OwnerAtBlock10Mil.toLowerCase())
    })

    it("Reverts if the proof for cryptopunk#420 owner address does not match with the block header", async function () {
      const { amb, hashi, storageProof } = await setup()

      // deploy header storage
      const HeaderStorage = await ethers.getContractFactory("HeaderStorage")
      const headerStorage = await HeaderStorage.deploy()

      // deploy AMBHeaderReporter
      const AMBHeaderReporter = await ethers.getContractFactory("AMBHeaderReporter")
      const ambHeaderReporter = await AMBHeaderReporter.deploy(amb.address, headerStorage.address)

      // deploy AMBAdapter
      const AMBAdapter = await ethers.getContractFactory("AMBAdapter")
      const ambAdapter = await AMBAdapter.deploy(amb.address, ambHeaderReporter.address, BYTES32_DOMAIN_ID)

      await ambHeaderReporter.reportHeaders([ID_ONE], ambAdapter.address, 10000000)

      let expectedHash = await headerStorage.headers(ID_ONE)
      expect(
        await hashi.getHash(
          DOMAIN_ID,
          ID_ONE,
          // TODO: currently we query the AMB adapter twice. We should query two or more different adapters.
          [ambAdapter.address, ambAdapter.address],
        ),
      ).to.equal(expectedHash)

      const incorrectProof =
        "0x000000000000000000000000000000000000000000d20a750285a779a8f382940000000000000000000000000000000000000000009040749a7b21fbbbc56ab1000000000000000000000000000000000000000000000cfa5466d74518ec8fc20000000000000000000000000000000000000000005df3478e70672aef4924ce000000000000000000000000000000000000000000231c15e9f1d049b4906f360000000000000000000000000000000000000000000028f4ec9495f4ac35ba99000000000000000000000000000000000000000000b4ea379117dbb72eb018e6000000000000000000000000000000000000000000d02a7285294fc5b3e33ce7000000000000000000000000000000000000000000002cd026928629d6bde1220000000000000000000000000000000000000000008c7d9b39cd4b8001427b92000000000000000000000000000000000000000000b71a51e053a0d595d1c0950000000000000000000000000000000000000000000018168d68ca1de197cf0700000000000000000000000000000000aa20f7bde5be60603f11a45fc4923aab000000000000000000000000000000007552be775403fc00c2e6b805e6297dbe0000000000000000000000000000000000000000000000000000000000989680000000000000000000000000b47e3cd837ddf8e4c57f05d70ab865de6e193bbb000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a000000000000000000000000000000000f92f3ad435570e9f610d535ca71c2a400000000000000000000000000000000c5ef34aa438e925fe55dbb614b291b4b00000000000000000000000000000000000000000000000000000000c352b53400000000000000000000000000000000e8b987e036a93539fd6897f53488e56a068289d29f77618bbdcc6c71439a097a276013e033be69d8365ee3f31330cb720f5a67cf836f713e3cd4334b1cddf68091628f397af8834697d383c46ff30bd728a71b966ef58f2085906901b8721c12c6e4bdbfbd944fa61b5f32d6bb3034260f1c347c2c3f76bf78bc1ff9a0db6355644e79f3e61259b78020b867707f1c382496e73fef160560bc27269102bdccfad037b7d73a09041dd7f6b4fb7f3d4875097d4857f9b0dac1f369f688c2299204b75ad707bb2158e7fbd7b8f16e61b9bb10b72622525962ac6189f50c65efb70cdfa8586ece1972885cb62297ad077c45156c7ac61eaf715afcc00f5b294320d4dddf1545d66e2c565646d4bb45894ca50eec1d5a454b34c1a66997bfb222ea87d93f31ff0528662626a46e57e3c19513299b9b6c08ceeb6c74317c2aedf8767c98568c4affe24421a43c70be4423a22128cc3661a3063d8c787b88a83258633eb03a1a1672062cd8e1fa8dd3bb2eff9e1b17d7de9c9a9ccc741cb643c13af808e4ec81e97a33437c3a33cc663972e695289f54201c49bde0b9551fb27fb51d4e6d208b21f99827887fd8ca467c39d13716500b7e73a058379e09d8c79f0a2eda1e699c81042b8e2647f3fe0f0dba677f25a81b7c54b1efe184426530ad1f12ace22255859b8325f97922231b6c1de3fb0610102f9856a361b7fa1a39a96e0bfac9bcd6dcc3ec1ff8e80d9195590d305f147d3c67016e1a6f13a244a0e09082ceb4c54a09cf777197c82a0940dfea287f02d345930ce03b8a1ef30efc65ddf2eaede252f562443888f31747097a7b3956000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020bfc7599b7ad525a7a5c5673f24831cb57330c6368cfee195c2c8e6e2dcdff3328d97b69dd606bb9c58081b1e5b481a14c4a86e8a3b93e2197f2df3c2d6b45ca10c19fd6de9c6c266fe319d317d562028a9c0cc1497aeccc08e06cc261ea9c9f1314a2543e41ccdeb3cf95792cc31597ea54a947345d8d4c777da128946154d710070a5a3b1da94a326debdd3e42fc7f212abbe8d41e9f2255d9b65e671993ae2c745546d019c9d80f35ae33777ea4a0ff2792cf7ca2ad3ec78d408fc6034daa0dc791655fe9900cf082b028e33ab4368df91e47acfd9ba73eb0fb239453eca102c6a7f3a6bdd7696732e0b00eaf8300124236fc661af10d7c8ab44a1227b30e069f109e21b1359543f617314953f5bd0de5cf754ff94a03feb8b628a0d702840452c6cf70191c30a2461ca712b18d1022792aeba142427f2dade8265d50adbe0cfb24eb5762a677de8ed5acbe0654b01894df77a838d58df6ccc6aadea436dc2000649b14adec14afe9f132afc1ab6deb50980cd54915359c9a20fb59127f212700dc6fde636038c75a918aa2aa7082265ea6ccc1f2380c59a5d6b85794d4be136ecca620dee85a87e5dc94b07814d36fb3bc698e546ef8ef4304f4ac49e2ca106db6229d808b98feb76ca2bacb6d08bae4f0442c031e4838d68babf72cbeed07f5c9b3c318f27212e12519e7434fc4a36ec32415d39cd0545701df1643f2261cee180b590c88a67480df8d770fa50811bea8a4047e8e72c140354d5630f39002e5fae847e670e8a71e49fe41dc3a90d5e0e6519230f4f0cfc6289f7d94b3d923dd9e445b4e723d652cb0a28c4903356c960e5abd4f1dd5e53864053b6881bf00000000000000000000000000000000000000000000000000000000000000012e0a8d9f0ffbf6bd32ed84839f22fe86183955e330dc32c71a7bb91a8a4a1ea906db2b670bae0f9bbe78fe5831cb3d5b04d3772ce8bbebe3f2203afdf3226d4319c919e92c8f35440c255be3c1e0ec605a4a135602e9a9e28fa7b130b5a2d9cf126cee39684d877a577301b4523586d60643692cfce5a9b7739577dbb270292b237d2e53bb5a536cf096398a8bd37e9cdbab0bef75d41538a932b30763261e1917e1b18cad3ae3eb8d2b6c72b0a0ac6131985a9bca46c5cdc5a690aae80633871e8f1e8706a972a124da6864dec1780e2628af87e2e2e1a246b3a4aead2ed5420ad699156b44b28089c1e001f56025927f44811f16da5e1627ed76aeec0476c50ad52cc72bdc305d4f95136e84aeb351bde85c5bcd61376252a762b25922fa0d2a78e5a89489bd3ca3ab1044d586d2ce1ecb3e67fb34f6c0f17b7c04ec7b6ccd00cfab3aa4660176290472248fb2e65dffe64c78735c0450bfd751a5df4f6cc22d23ce481ea6694d4e838d9ee90896d5e8dd1d383ceff8f0b1663adc5423cb801fef7f6ce0ae102ffefa790f3205392215e69fb6da0b188db31b7184ac3231af0450ecdcba2d09b5a928f1fe9a0c5b86c93cab01a3ff6a9b6ced1a08d112cf0b241f916f1326df53e6f0a378779d1858acd187eb4313bb47beb55942f5af3d5f0edd784e862c678e020bd222dbea1d8915c3ed46bc73ab0ea69b3df2438c513710f81e94e27dd8c81fe3a2ec350ce18b48c72927f4703ce2ab4915c7feb4ac3508044a522b16938d9fa9bd90a5a0c03aca11e38465f0104c5960420f1dba9a542a3394443534a115c2c1523450a8b9c000bb400e978a5e0c94cf6a87c01b858408062321c2720ef601121f822072883452be1adfb58d50acb9a97bc75fd8564d0997fbf9ad6fd83bdadd4c03a381818736bc0bdadc0a4ab7265102328677abb41a6f8f471fb3072b1710c891959c09ef6304a491d724e66c57760f4a38593c2b"

      const expectedAddress = await storageProof.callStatic.attestCryptoPunk420AddressWithHashi(
        proof,
        DOMAIN_ID,
        ID_ONE,
        blockHashWitness.claimedBlockHash,
        [ambAdapter.address, ambAdapter.address],
      )
      expect(expectedAddress.toLowerCase()).to.revertedWith("Proof verification failed")
    })
  })
})
