import { createWalletClient, custom, createPublicClient, parseEther, defineChain, formatEther, type WalletClient, type PublicClient, type Address, type Chain } from "viem";
import "viem/window";
import { contractAddress, abi } from "./constants-ts.js";

const connectButton = document.getElementById("connectButton") as HTMLButtonElement;
const fundButton = document.getElementById("fundButton") as HTMLButtonElement;
const ethAmountInput = document.getElementById("ethAmountInput") as HTMLInputElement;
const balanceButton = document.getElementById("balanceButton") as HTMLButtonElement;
const withdrawButton = document.getElementById("withdrawButton") as HTMLButtonElement;

let walletClient: WalletClient | undefined; // walletClient is the client that we use to interact with the user's wallet, it is created using the createWalletClient method from viem
// It is used to send transactions, request addresses, etc. It is a viem type
let publicClient: PublicClient | undefined; // publicClient is the client that we use to interact with the blockchain, it is created using the createPublicClient method from viem
// It is used to read data from the blockchain, such as balances, contract calls, etc

async function connect(): Promise<void> {

    if (typeof window.ethereum !== "undefined") {

        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        await walletClient.requestAddresses() // requestAddresses is a viem method to get the user's addresses, it returns a promise
        connectButton.innerText = "Connected!"

    } else {
        connectButton.innerText = "Please install MetaMask!"
    }

}

async function fund(): Promise<void> {
    const ethAmount = ethAmountInput.value
    console.log(`Funding with ${ethAmount}...`)

    if (typeof window.ethereum !== "undefined") {

        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })

        const [connectedAccount] = await walletClient.requestAddresses() // requestAddresses is a viem method that returns user's addresses, it returns a promise
        const currentChain = await getCurrentChain(walletClient)

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })

        const { request } = await publicClient.simulateContract({ // simulateContract is a viem method that simulates a contract call with abi, account/contract address, chain, etc.; it returns a promise
            address: contractAddress as Address,
            abi, // shorthand for abi: abi, // abi is the interface of the smart contract, it tells us how to interact with the smart contract
            functionName: "fund",
            account: connectedAccount,
            // viem doen't currently support the RPC URL or custom chain that we create, so we need to explicitely pass the chain

            chain: currentChain,
            value: parseEther(ethAmount), // parseEther is a viem method that converts ether to wei, it returns a promise
        })

        const hash = await walletClient.writeContract(request) // writeContract is a viem method that writes to the contract, it returns a promise
        console.log(`Transaction hash: ${hash}`)

    } else {
        connectButton.innerText = "Please install MetaMask!"
    }
}

async function getCurrentChain(client: WalletClient): Promise<Chain> { // This function gets the current chain from the client, as of this
    const chainId = await client.getChainId()
    const currentChain = defineChain({
        id: chainId,
        name: "CustomChain",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: {
            default: {
                http: ["http://localhost:8545"]
            }
        },
    })

    return currentChain
}

async function getbalance(): Promise<void> {
    if (typeof window.ethereum !== "undefined") {

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        // we don't need to create a wallet client or request address here, because we are just reading the balance
        const balance = await publicClient.getBalance({
            address: contractAddress as Address
        })
        console.log(formatEther(balance)) // formatEther is a viem method that converts wei to ether, it returns a promise
    }
}

async function withdraw(): Promise<void> {
    console.log("Withdrawing funds...")

    if (typeof window.ethereum !== "undefined") {

        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })

        const [connectedAccount] = await walletClient.requestAddresses() // requestAddresses is a viem method that returns user's addresses, it returns a promise
        const currentChain = await getCurrentChain(walletClient)

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })

        const { request } = await publicClient.simulateContract({ // simulateContract is a viem method that simulates a contract call with abi, account/contract address, chain, etc.; it returns a promise
            account: connectedAccount,
            address: contractAddress as Address,
            abi, // shorthand for abi: abi, // abi is the interface of the smart contract, it tells us how to interact with the smart contract
            functionName: "withdraw",
            
            // viem doen't currently support the RPC URL or custom chain that we create, so we need to explicitely pass the chain

            chain: currentChain,
            // value: parseEther("0") // Its ok that we wrote this, but we don't need it here because we are not sending any ether with the withdraw function
        })
        console.log("Simulation result:", request);

        const hash = await walletClient.writeContract(request) // writeContract is a viem method that writes to the contract, it returns a promise
        console.log("Withdraw transaction hash:", hash)

    } else {
        connectButton.innerText = "Please install MetaMask!"
    }

}

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getbalance
withdrawButton.onclick = withdraw