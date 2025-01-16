import { AccountWallet, createLogger, PXE, waitForPXE, createPXEClient, Logger, NoFeePaymentMethod } from "@aztec/aztec.js";
import { GasSettings } from '@aztec/circuits.js';
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { TokenContract } from "@aztec/noir-contracts.js/Token"

const setupSandbox = async () => {
    const { PXE_URL = 'http://localhost:8080' } = process.env;
    const pxe = await createPXEClient(PXE_URL);
    await waitForPXE(pxe);
    return pxe;
};

async function main() {

    let pxe: PXE;
    let wallets: AccountWallet[] = [];
    let logger: Logger;

    logger = createLogger('aztec:aztec-starter');

    pxe = await setupSandbox();
    const accounts = await getInitialTestAccountsWallets(pxe);
    const account = accounts[0]!;
    const token = await TokenContract
        .deploy(account, account.getAddress(), "test", "test", 18)
        .send()
        .deployed();
    const txRequest = await account.createTxExecutionRequest({
        calls: [
            token.methods.balance_of_public(account.getAddress()).request(),
        ],
        fee: {
            gasSettings: GasSettings.default({
                maxFeesPerGas: await pxe.getCurrentBaseFees(),
            }),
            paymentMethod: new NoFeePaymentMethod(),
        },
    });
    const simulated = await account.simulateTx(
        txRequest,
        true, // simulatePublic
        undefined, // fails with account.getAddress(),
        false, // skipTxValidation
    );
}

main();
