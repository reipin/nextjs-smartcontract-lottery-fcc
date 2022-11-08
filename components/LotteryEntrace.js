import { useWeb3Contract } from "react-moralis"
// import both abi & contrctAddresses in one file
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    // set isWeb3Enabled
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()

    // moralis knows which chainId we are in from the wallet connected
    // below means pull chainId from useMoralis and name it to chainIdHex
    const { chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)

    // verify if chainId do exists in contractAddresses key
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    console.log(parseInt(chainIdHex))

    // useState is a react func. 0 is a starting value
    // entraceFee is a varable name has value, setEntranseFee is a func name to update or set entranceFee
    // it like doing let enranceFee = ??? but....
    // ...when ever the entraceFee is set or updated, re-render the page
    const [entranceFee, setEntraseFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    // useWeb3Contract is react-moralis func.
    // useWeb3Contract to run enterRaffle function in raffle contract
    // this brings enterRaffle in Raffle.sol to be executable in frontend as func.
    const {
        data,
        error,
        isFetching,
        isLoading,
        runContractFunction: enterRaffle,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    // useWeb3Contract to run getEntranecFee function in raffle contract
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    // useWeb3Contract to run getNumberOfPlayers function in raffle contract
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    // useWeb3Contract to run getRecentWinner function in raffle contract
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    // useEffect is a react function
    useEffect(() => {
        if (isWeb3Enabled) {
            // getEntraceFee is a async function
            // async function updateUI() {
            //     const entraceFeeFromCall = (await getEntranceFee()).toString()
            //     const numPlayersFromCall = (await getNumberOfPlayers()).toString()
            //     const recentWinnerFromCall = await getRecentWinner()
            //     // update entrenceFee
            //     setEntraseFee(entraceFeeFromCall)
            //     setNumPlayers(numPlayersFromCall)
            //     setRecentWinner(recentWinnerFromCall)
            // }
            updateUI()
        }
    }, [isWeb3Enabled])

    // declear stand alone async func to be able to call from handleSuccess
    // this will re-render page each tiem numPlayers get updated
    // setting useWeb3Contract let us use getEntranceFee() and other func
    async function updateUI() {
        const entraceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        // update entrenceFee
        setEntraseFee(entraceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    // notification popup section
    const dispatch = useNotification()

    // you can set a async func. to a constant var
    // this func will be called when ever enterRaffla returns onSuccess
    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    // web3uikit
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Trancaction complete",
            title: "Tx Notification",
            icon: "bell",
            position: "topR",
        })
    }
    return (
        <div>
            {raffleAddress ? (
                <div className="p-5">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 px-3 py-3 text-white font-bold rounded"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>Entrance Fee is {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>Number of players: {numPlayers}</div>
                    <div>Recent winner: {recentWinner}</div>
                </div>
            ) : (
                <div>No raffle address detected...</div>
            )}
        </div>
    )
}
