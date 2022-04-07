import React, { useEffect, useState } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'
import Link from 'next/link'
import { BigNumber } from '@ethersproject/bignumber'
import toast, { Toaster } from 'react-hot-toast'

interface Props {
  collection: Collection
}

function NFTDropPage({ collection }: Props) {
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [priceInEth, setPriceInEth] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const nftDrop = useNFTDrop(collection.address)


  useEffect(() => {
    if(!nftDrop) return;

    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll()
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)
    }

    fetchPrice()
  }, [nftDrop])

  useEffect(() => {
    setIsLoading(true)
    if (!nftDrop) return

    const fetchNftDropData = async () => {
      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()
      setClaimedSupply(claimed.length)
      setTotalSupply(total)
      setIsLoading(false)
    }
    fetchNftDropData()
  }, [nftDrop])

  const connectwithMetaMask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  const mintNFT = () => {
    if (!nftDrop || !address) return
    const quantity = 1 // how many unique nft's you want to claimed
    setIsLoading(true)

    const notification = toast.loading('Minting NFT...', {
      style: {
        background: 'white',
        color: 'green',
        fontWeight: 'bold',
        fontSize: '17px',
        padding: '20px',
      },
    })

    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt
        const claimedTokenId = tx[0].id
        const claimedNFT = await tx[0].data()

        toast('HOORAY...You successfully Minted!!', {
          duration: 5000,
          style: {
            background: 'green',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })

        console.log('claimedNFT', claimedNFT)
        console.log('claimedTokenId', claimedTokenId)
        console.log('receipt', receipt)
      })
      .catch((error) => {
        console.error('mintNft func: ', error)
        toast('Whoops...Something went wrong!', {
          style: {
            background: 'red',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })
      })
      .finally(() => {
        setIsLoading(false)
        toast.dismiss(notification)
      })

  }

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Toaster position="bottom-center"/>
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={urlFor(collection.previewImage).url()}
              alt=""
            />
          </div>

          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/*header */}
        <header className="flex items-center justify-between">
          <Link href={'/'}>
            <h2 className="sm:w-18 w-52 cursor-pointer text-xl font-extralight italic hover:bg-gradient-to-br from-yellow-400 to-rose-600 p-2 hover:text-stone-50">
              Loro's NFT collection
            </h2>
          </Link>

          <button
            onClick={() => (address ? disconnect() : connectwithMetaMask())}
            className="rounded-full bg-rose-400 px-4 py-2 text-sm font-bold text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? 'Sing Out' : 'Sign In'}
          </button>
        </header>
        <hr className="my-2 border" />
        {address && (
          <p className="text-center text-rose-500">
            You're logged in with wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}
          </p>
        )}
        {/*content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src={urlFor(collection.mainImage).url()}
            alt=""
          />
          <h1 className="text-xl font-bold lg:text-5xl ">{collection.title}</h1>

          {isLoading ? (
            <p className="pt-2 text-xl text-green-500">Loading...</p>
          ) : (
            <p className="pt-2 text-xl text-green-500">
              {claimedSupply} / {totalSupply?.toString()} NFT's claimed
            </p>
          )}

          {isLoading && (
            <img
              className="h-80 w-80 object-contain"
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
              alt=""
            />
          )}
        </div>
        {/*button */}
        <button
          disabled={
            isLoading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className="mt-10 h-16 rounded-full bg-rose-500 text-white disabled:bg-gray-500"
        >
          {isLoading ? (
            <>Loading...</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>SOLD OUT</>
          ) : !address ? (
            <>Sign in to Mint</>
          ) : (
            <span onClick={mintNFT} className="font-bold">Mint NFT ({priceInEth}) ETH</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `
  *[_type == "collection" && slug.current == $id][0]{
    _id,
    title,
    address,
    description,
    nftCollectionName,
    mainImage{
      asset
    },
    previewImage{
      asset
    },
    slug{
      current
    },
    creator-> {
      _id,
      name,
      address,
      slug {
        current
      },
    },
  }
`
  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  // return 404 page
  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}
