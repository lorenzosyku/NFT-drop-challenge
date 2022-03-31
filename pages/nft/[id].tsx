import React from 'react'

function NFTDropPage() {
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500 lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://links.papareact.com/8sg"
              alt=""
            />
          </div>

          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">Papafam</h1>
            <h2 className="text-gray-300">
              jcosidappdoqdpqwdqpwdpqwojpjdpqjdpqdpwpodvfvs
            </h2>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/*header */}
        <header className="flex items-center justify-between">
          <h2 className="sm:w-18 w-52 cursor-pointer text-xl font-extralight">
            the papafam nft marketplace
          </h2>
          <button className="rounded-full bg-rose-400 px-4 py-2 text-sm font-bold text-white lg:px-5 lg:py-3 lg:text-base">
            sign in
          </button>
        </header>
        <hr className="my-2 border" />
        {/*content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src="https://links.papareact.com/bdy"
            alt=""
          />
          <h1 className="text-xl font-bold lg:text-5xl ">
            the papafam coding club| NFT Drop
          </h1>

          <p className="pt-2 text-xl text-green-500">11 / 34 NFT's claimed</p>
        </div>
        {/*button */}
        <button className="h-16 text-white bg-rose-500 rounded-full mt-10"> Mint NFT (0.01 ETH)</button>
      </div>
    </div>
  )
}

export default NFTDropPage
