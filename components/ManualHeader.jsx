import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function ManualHeader() {
    // This is called React Hook.
    // One of the function Hook does is re-render the
    // web page on state change.
    // ex. connecting to a wallet => show different content
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()

    // useEffect(()=> {some func.},[some dependencies])
    // no dependency array => run func. anytime something rerenders.
    // blank array => run func. once when loaded.
    // some dependencies => run anytime something is changed in dependencies.
    // useEffect to automatically enableWeb3 wheneve we refresh the page.
    useEffect(() => {
        //if (isWeb3Enabled) return
        if (!isWeb3Enabled && typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
        console.log(isWeb3Enabled)
    }, [isWeb3Enabled])

    // useEffect for desconnect wallet
    // deactivateWeb3 sets isWeb3Enable to false
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account === null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account detected!")
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}....{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}
