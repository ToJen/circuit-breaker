"use client";

import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SetStateAction, useState } from "react";

import { InputBase } from "~~/components/scaffold-eth";
import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  const [name, setName] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [lastCommitHash, setLastCommitHash] = useState("Placeholder commit hash");
  const [dateVerified, setDateVerified] = useState("Placeholder date");
  const [analysis, setAnalysis] = useState("Placeholder analysis");
  const [results, setResults] = useState("Placeholder results");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
    setSubmitted(true);
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow">
        {/* Rest of the code */}
        <div>
          <div className="flex items-center justify-center flex-col flex-grow pt-10">
            <form onSubmit={handleSubmit}>
              <p>Welcome to ZKML Code Verifier!</p>
              <InputBase name="url" placeholder="Enter your Github URL" value={name} onChange={setName} />
              <br />
              <button type="submit">Submit</button>
            </form>
          </div>
          <br />
          {submitted && (
            <div>
              <p>Your code has been processed!</p>
              <p>Github URL: {name}</p>
              <p>Last Commit Hash: {lastCommitHash}</p>
              <p>Date Verified: {dateVerified}</p>
              <p>Results: {results}</p>
              <p>Analysis: {analysis}</p>
            </div>
          )}
        </div>

        {/* <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contract
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Home;
