"use client";

import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, Typography } from "@mui/material";
import { animated, useSpring } from "@react-spring/web";

import Chat from "./chat"
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
        <Chat />
      </div>
    </>
  );
};

export default Home;
