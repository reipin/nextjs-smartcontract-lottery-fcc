import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div className="border-b-2 p-5 flex flex-row">
            <h1 className="text-3xl font-blog">! Decentralized Raffle !</h1>
            <div className="ml-auto">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
