import type {NextPage} from 'next';
import Head from 'next/head';
import {useWriteContract, useReadContract, useWaitForTransactionReceipt, useAccount} from 'wagmi';
import abi from './abi.json';
import {ethers} from 'ethers';
import {useEffect, useState,} from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Navbar from '../components/Navbar';

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
    const [score, setScore] = useState([]);
    const [isAlreadySubmit, setIsAlreadySubmit] = useState(false);
    const MySwal = withReactContent(Swal);
    const {address} = useAccount();

    const {data: hash, writeContract} = useWriteContract();
    const {data: getMatches} = useReadContract({
        address: config['sendUniversalPacket']['optimism'].portAddr,
        abi: abi,
        functionName: 'getMatches',
    });
    const getPlayerBet = useReadContract({
        address: config['sendUniversalPacket']['optimism'].portAddr,
        abi: abi,
        functionName: 'getPlayerBet',
        args: [address]
    });

    useEffect(() => {
        let addScore = [];

        for (let index = 0; index < getMatches?.length; index++) {
            addScore.push({
                scoreOne: 0,
                scoreTwo: 0,
            })
        }

        setScore(old => [...old, ...addScore]);
    }, [getMatches]);

    async function submit() {
        Swal.fire({
            title: "Are you sure?",
            showDenyButton: true,
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
                writeContract({
                    address: config['sendUniversalPacket']['optimism'].portAddr,
                    abi: abi,
                    functionName: 'betting',
                    args: [score],
                })
            }
        });
    }

    async function reveal() {
        writeContract({
            address: config['sendUniversalPacket']['optimism'].portAddr,
            abi: abi,
            functionName: 'reveal',
            args: [
                config['sendUniversalPacket']['base'].portAddr,
                ethers.encodeBytes32String(config['sendUniversalPacket']['optimism'].channelId),
                config['sendUniversalPacket']['base'].timeout,
            ]
        })
    }

    const {isLoading: isConfirming, isSuccess: isConfirmed} =
        useWaitForTransactionReceipt({
            hash,
    })

    useEffect(() => {
        if (isConfirmed) {
            Swal.fire("Success!", "", "success");
        }
    }, [isConfirmed]);

    useEffect(() => {
        if (address) {
            const fetchData = async () => {
                const result = await getPlayerBet.refetch?.();

                let addScore = [];

                if (result.data?.length > 0) {
                    setIsAlreadySubmit(true);
                }

                for (let index = 0; index < result.data?.length; index++) {
                    addScore.push({
                        scoreOne: parseInt(result.data[index].scoreOne.toString(), 10),
                        scoreTwo: parseInt(result.data[index].scoreTwo.toString(), 10),
                    })
                }

                setScore(old => [...old, ...addScore]);
            }
            fetchData();
        }
    }, [address, isConfirmed]);

    return (
        <div>
            <Head>
                <title>Polymers Score - Home</title>
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
                                        Teams
                                    </th>
                                    <th scope="col" className="px-6 py-3 dark:text-white">
                                        Schedule
                                    </th>
                                    <th scope="col" className="px-6 py-3 dark:text-white">
                                        Your Score
                                    </th>
                                    <th scope="col" className="px-6 py-3 dark:text-white">
                                        Score
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {getMatches?.map((getMatch, index) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-6 py-4 dark:text-white text-center">
                                            <div className="flex justify-center items-center">
                                                <figure className="max-w-lg">
                                                    <img className="w-48 h-48 rounded-lg" src={getMatch?.teamOne.logo}/>
                                                    <figcaption
                                                        className="mt-4 text-sm text-center text-black-500  text-3xl">{getMatch?.teamOne.name}</figcaption>
                                                </figure>
                                            </div>
                                            <div className="flex justify-center items-center mt-6">
                                                <figure className="max-w-lg">
                                                    <img className="w-48 h-48 rounded-lg" src={getMatch?.teamTwo.logo}/>
                                                    <figcaption
                                                        className="mt-4 text-sm text-center text-black-500  text-3xl">{getMatch?.teamTwo.name}</figcaption>
                                                </figure>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 dark:text-white">
                                            <p>{getMatch?.schedule}</p>
                                            <p>Link : <a href={getMatch?.link}>{getMatch?.link}</a></p>
                                        </td>
                                        <td className="px-6 py-4 dark:text-white">
                                            <div className="mb-6">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    {getMatch?.teamOne.name}
                                                </label>
                                                <input
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                                    min="0"
                                                    type="number"
                                                    disabled={isAlreadySubmit || getMatch?.reveal}
                                                    value={score[index]?.scoreOne}
                                                    onChange={(e) => {
                                                        score[index].scoreOne = parseInt(e.target.value)
                                                        setScore([...score]);
                                                    }}
                                                />
                                            </div>
                                            <div className="mb-6">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    {getMatch?.teamTwo.name}
                                                </label>
                                                <input
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                                    min="0"
                                                    type="number"
                                                    disabled={isAlreadySubmit || getMatch?.reveal}
                                                    value={score[index]?.scoreTwo}
                                                    onChange={(e) => {
                                                        score[index].scoreTwo = parseInt(e.target.value)
                                                        setScore([...score]);
                                                    }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 dark:text-white">
                                            {getMatch?.reveal == false && "-"}
                                            {getMatch?.reveal == true && `${getMatch?.scoreOne} - ${getMatch?.scoreTwo}`}
                                        </td>
                                    </tr>
                                ))}

                                <tr>
                                    <td className="px-6 py-4 dark:text-white text-center" colSpan={4}>
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-4"
                                            disabled={isAlreadySubmit ||
                                                getMatches ? getMatches[0]?.reveal : false
                                            }
                                            onClick={submit}>
                                            Submit
                                        </button>
                                        <button
                                            className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-4"
                                            disabled={isAlreadySubmit ||
                                                getMatches ? getMatches[0]?.reveal : false
                                            }
                                            onClick={reveal}>
                                            Reveal
                                        </button>
                                    </td>
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
