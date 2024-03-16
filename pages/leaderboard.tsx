import type {NextPage} from 'next';
import Head from 'next/head';
import {useWriteContract, useReadContract,} from 'wagmi';
import abi from './abi.json';
import Navbar from "../components/Navbar";

const config = {
    "sendUniversalPacket": {
        "optimism": {
            "portAddr": process.env.NEXT_PUBLIC_OPTIMISM_PORTADDR,
            "channelId": "channel-16",
            "timeout": 36000,
            "explorerUrl": "https://optimism-sepolia.blockscout.com/"
        },
        "base": {
            "portAddr": process.env.NEXT_PUBLIC_BASE_PORTADDR,
            "channelId": "channel-17",
            "timeout": 36000,
            "explorerUrl": "https://base-sepolia.blockscout.com/"
        }
    }
}

const Home: NextPage = () => {
    const {data: hash, writeContract} = useWriteContract();
    const {data: getLeaderboards} = useReadContract({
        address: config['sendUniversalPacket']['optimism'].portAddr,
        abi: abi,
        functionName: 'getLeaderboard',
    });
    return (
        <div>
            <Head>
                <title>Polymers Score - Leaderboard</title>
            </Head>

            <header className="bg-white">
                <Navbar/>
            </header>

            <main>
                <div className="mx-auto my-8 max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="flow-root">
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table
                                className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead
                                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3 dark:text-white">
                                        Address
                                    </th>
                                    <th scope="col" className="px-6 py-3 dark:text-white">
                                        Point
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {getLeaderboards?.map((getLeaderboard, index) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                                        <td className="px-6 py-4 dark:text-white">
                                            <p>{getLeaderboard?.user.substring(0, 4)}...
                                                {getLeaderboard?.user.substring(getLeaderboard?.user.length - 4)}</p>
                                        </td>
                                        <td className="px-6 py-4 dark:text-white">
                                            {getLeaderboard?.point.toString()}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default Home;
