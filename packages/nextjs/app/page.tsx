"use client";

import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, Typography } from "@mui/material";
import { animated, useSpring } from "@react-spring/web";

import { InputBase } from "~~/components/scaffold-eth";
import Link from "next/link";
import type { NextPage } from "next";
import React from "react";
import { useState } from "react";

const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeData(url: string) {}

const Home: NextPage = () => {
  const [url, setUrl] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [lastCommitHash, setLastCommitHash] = useState("Placeholder commit hash");
  const [dateVerified, setDateVerified] = useState("Placeholder date");
  const [analysis, setAnalysis] = useState("Placeholder analysis");
  const [results, setResults] = useState("Placeholder results");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    scrapeData(url);

    event.preventDefault();
    // Handle form submission logic here
    setSubmitted(true);
  };

  const fade = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    reset: submitted,
  });

  return (
    <>
      <div className="flex flex-col items-center flex-grow">
        <animated.div className="flex flex-col items-center justify-center flex-grow pt-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xl font-bold mb-4">Welcome to ZKML Code Verifier!</p>
            <InputBase placeholder="Enter your Github URL" value={url} onChange={setUrl} />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150"
            >
              Submit
            </button>
          </form>
        </animated.div>
        {submitted && (
          <animated.div style={fade} className="mt-10">
            <Card>
              <CardContent>
                <Typography variant="h6">Your code has been processed!</Typography>
                <Typography variant="body1">Github URL: {url}</Typography>
                <Typography variant="body1">Last Commit Hash: {lastCommitHash}</Typography>
                <Typography variant="body1">Date Verified: {dateVerified}</Typography>
                <Typography variant="body1">Results: {results}</Typography>
                <Typography variant="body1">Analysis: {analysis}</Typography>
              </CardContent>
            </Card>
          </animated.div>
        )}
      </div>
    </>
  );
};

export default Home;
