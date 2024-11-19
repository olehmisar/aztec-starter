import { EasyPrivateVotingContractArtifact, EasyPrivateVotingContract } from "../src/artifacts/EasyPrivateVoting.js"
import { AccountWallet, CompleteAddress, ContractDeployer, createDebugLogger, Fr, PXE, waitForPXE, TxStatus, createPXEClient, getContractInstanceFromDeployParams, DebugLogger } from "@aztec/aztec.js";
import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { AztecAddress, deriveSigningKey, GrumpkinScalar } from '@aztec/circuits.js';
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
    // wallets = await getInitialTestAccountsWallets(pxe);

    const account = await getSchnorrAccount(pxe, new Fr(123), new GrumpkinScalar(456), Fr.random()).waitSetup();

    const token = await TokenContract.deploy(account, account.getAddress(), "Token", "Symbol", 16).send().wait();

    await token.contract.methods.mint_to_private(account.getAddress(), 1000).send().wait();

    console.log(await token.contract.methods.balance_of_private(account.getAddress()).simulate());

    // 1000n

    await token.contract.methods.transfer(AztecAddress.random(), 123).send().wait();

    console.log(await token.contract.methods.balance_of_private(account.getAddress()).simulate());
}

main();
