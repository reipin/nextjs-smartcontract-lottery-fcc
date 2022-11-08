import Head from "next/head"
import styles from "../styles/Home.module.css"
//import ManualHeader from "../components/ManualHeader"
import Header from "../components/Header"
import { useMoralis } from "react-moralis"
import LotteryEntrance from "../components/LotteryEntrace"
const supportedChains = ["31337", "5"]

export default function Home() {
    //const { isWeb3Enabled, chainId } = useMoralis()

    return (
        <div className={styles.container}>
            <Head>
                <title>Smart contract Lottery</title>
                <meta name="description" content="My first smart contrac lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/*<ManualHeader />*/}
            <Header />
            <LotteryEntrance />
        </div>
    )
}
