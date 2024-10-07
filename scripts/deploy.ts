import { AccountWallet, CompleteAddress, ContractDeployer, createDebugLogger, Fr, PXE, waitForPXE, TxStatus, createPXEClient, getContractInstanceFromDeployParams, DebugLogger } from "@aztec/aztec.js";
import { TokenContract } from "@aztec/noir-contracts.js";
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";

const setupSandbox = async () => {
    const { PXE_URL = 'http://localhost:8080' } = process.env;
    const pxe = await createPXEClient(PXE_URL);
    await waitForPXE(pxe);
    return pxe;
};

async function main() {

    let pxe: PXE;
    let wallets: AccountWallet[] = [];
    let accounts: CompleteAddress[] = [];
    let logger: DebugLogger;

    logger = createDebugLogger('aztec:aztec-starter');

    pxe = await setupSandbox();
    wallets = await getInitialTestAccountsWallets(pxe);

    console.log("wallet 1", wallets[0].getAddress())
    console.log("wallet 2", wallets[1].getAddress())
    console.log("wallet 3", wallets[2].getAddress())

    let wallet = await wallets[0]
    let token = await TokenContract.deploy(wallet, wallet.getAddress(), "Test", "TST", 18).send().deployed();
}

main();
