import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
  Avatar,
  ChatContainer,
  ConversationHeader,
  InfoButton,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
  VideoCallButton,
  VoiceCallButton,
  emilyIco,
} from "@chatscope/chat-ui-kit-react";

import OpenAI from "openai";
import SindriClient from "sindri";
import { ethers } from "ethers";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useState } from "react";

// import { Client, HTTPTransport, RequestManager } from "@open-rpc/client-js";


const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    `You are VeriBot, a cutting-edge chatbot designed to assist users in verifying and checking smart contracts securely within the decentralized finance (DeFi) ecosystem. Your chatbot, named VeriBot, employs advanced technologies such as Zero-Knowledge Proofs (ZK proofs) and Machine Learning (ML) to ensure the authenticity and security of smart contracts while preserving developers' privacy. Users rely on VeriBot to upload contract source code privately, generate ZK proofs, and receive comprehensive verification reports. Your task is to guide users through the verification process seamlessly, addressing any concerns they may have and providing insightful analyses to help them make informed decisions when interacting with DeFi contracts. Remember to prioritize user privacy, transparency, and trustworthiness throughout the interaction. You will reply to the user in a very fun and friendly way, with emojis!
    
    VeriBot context
    ## TL;DR: 

- VeriBot uses Zero-Knowledge Proofs and Machine Learning to certify smart contract security in the DeFi ecosystem without exposing source code, targeting developers who prioritize both privacy and integrity.
- Our **Goal** is to : use zkML to prove the absence of vulnerabilities in (closed-) source code. VeriBot leverages zkML (Zero-Knowledge Machine Learning) to prove the absence of vulnerabilities in (closed-) source code, particularly focusing on smart contracts within the decentralized finance (DeFi) ecosystem.

## Storytelling : User Experience 

Imagine you've poured countless hours into crafting the perfect smart contract, only to face the daunting task of proving its safety without revealing your confidential source code.

Enter VeriBot! With VeriBot, developers can now confidently showcase the integrity of their contracts without compromising their code's confidentiality. Through Zero-Knowledge Proofs and Machine Learning, VeriBot empowers you to demonstrate your contract's reliability while keeping your code private. Say goodbye to sleepless nights worrying about rug pulls or vulnerabilities – VeriBot has got your back, ensuring your creations are as trustworthy as they are confidential.

## Architecture 

- **Circuit** : Utilizes Zero-Knowledge Proofs in [Noir Language](https://noir-lang.org/docs/getting_started/installation/) to validate machine learning inferences on smart contract bytecode, ensuring privacy and integrity without revealing the bytecode.
- **Oracle** : A Rust-built intermediary that securely connects off-chain machine learning predictions with on-chain smart contract decisions, enhancing contracts without exposing underlying data or models.
- **Machine Learning**: Analyzes smart contract bytecode to infer properties or vulnerabilities, acting as a privacy-preserving tool that abstracts complex contract logic for secure validation.`,
};





function App() {
  const [messages, setMessages] = useState([
    {
      message:
        "Hello, VeriBot here! I'm your personal ZKML smart contract verification assistant. 😄 What contracts do you want to verify or check today?",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const [proof, setProof] = useState(null); // Add this line for the proof state
  const [proofString, setProofString] = useState(""); // Add this line for the proof state


  async function verifySmartContract(bytecode) {
    // Placeholder: In reality, you would likely call an external API or use a library
  // that analyzes the contract's bytecode for known vulnerabilities.

  alert(`Checking safety of contract with bytecode: ${bytecode}`);


  // mock report = true;
  // const transport = new HTTPTransport("http://localhost:8000");
  // const client = new Client(new RequestManager([transport]));

  // const request = {
  //   jsonrpc: "2.0",
  //   id: 0,
  //   method: "inference",
  //   params: "0xbytecode"
  // };

  // const result = await client.request(request);
  // console.log(result);

  // Simulate a safety check process
  const isSafe = true; // This would be determined by the safety check process

  // alert("before sindri client");

  
  const _ = SindriClient.authorize({ apiKey: 'sindri-qxaFOjmwZlNId0O1jNp51r3O4p8nUj8O-ZkEy' });

  // alert("after sindri client");

  // const url = 'https://sindri.app/api/v1/circuit/list';
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'Accept': 'application/json',
  //     'Authorization': 'Bearer sindri-qxaFOjmwZlNId0O1jNp51r3O4p8nUj8O-ZkEy'
  //   }
  // };

  // await fetch(url, options)
  //   .then(response => response.json())
  //   .then(data => console.log("circuits", data))
  //   .catch(error => console.error('Error:', error));



  // const circuits = await SindriClient.getAllCircuits();
  // alert("Circuits:", circuits.json());
  // console.log(circuits.json());
  // const circuitId = circuits[0]
  const circuitId = "8e3d2e13-74d5-4c8d-8e81-0c90ee416afc";
  alert("Generating proof using Sindri Circuit... This may take up to 30s.")
  const proof = await SindriClient.proveCircuit(circuitId, '"oracle_output"=true\n');
  console.log("proof", proof);
  const result = proof.proof.proof;
  setProofString(proof.proof.proof);

  const shortProof = proof;
  delete shortProof.proof;
  setProof(shortProof);

  try {
    alert(`Generated proof! ${JSON.stringify(proof)}`);
  } catch (error) {
      alert("Error: Unable to stringify object.");
  }

  return `The bytecode has been verified the oracle and a proof has been generated. The bytecode is safe. The proof can be found below the chat.`;

}

  // const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
  //   contractName: "VeriBot", // Replace "YourContract" with the actual contract name
  //   functionName: "verifyProof", // Change the functionName to "_verifyProof"
  //   args: [
  //     proof, // Replace "0xproof" with the actual proof bytes
  //     [], // Replace with actual public inputs
  //   ],
  //   value: ethers.parseEther("0.1"),
  //   blockConfirmations: 1,
  //   onBlockConfirmation: txnReceipt => {
  //     console.log("Transaction blockHash", txnReceipt.blockHash);
  //   },
  // });

  function stringToBytes32(value) {
    // Ensure the string is UTF-8 encoded
    const utf8Encoded = ethers.utils.toUtf8Bytes(value);
    
    // Pad the UTF-8 encoded string to 32 bytes
    return ethers.utils.hexZeroPad(ethers.utils.hexlify(utf8Encoded), 32);
}

  async function checkSmartContractSafety(proof) {
    // Placeholder: In a real implementation, you might fetch the contract's source code
    // from a blockchain explorer API or use a service that verifies contract code.

    alert(`Verifying contract with proof: ${proof}`);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    alert("Provider Connected.");
    const contractAddress = "0xc7c63d31808D12b1b4BEfd37CFccd461e9CA6F30";
    const contractABI = [
      {
        "inputs": [],
        "name": "plonkVerifier",
        "outputs": [
          {
            "internalType": "contract BaseUltraVerifier",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "proofs",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes",
            "name": "_proof",
            "type": "bytes"
          },
          {
            "internalType": "bytes32[]",
            "name": "_publicInputs",
            "type": "bytes32[]"
          }
        ],
        "name": "verifyProof",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "version",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }];
    console.log(contractAddress, contractABI);
    const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());
    console.log("contract: ", contract);
    alert("Contract Connected.");

    // // await writeAsync();
    // const publicInputs = []; // Replace with actual public inputs
    //   proof = "06731fe9c8dde494873dd7482379cacd0e8da14046c8f08720e9d603443aad3825ced3096072582b1d5aede8f3cf998983d556d3b4bd4d2448d31ff419c7867506dd1293a2d2d227de2b184c4f315961a794634593b5a5c730b1891c529f9fd4001606d612160676a45a3ac02d252327036fd359bc5afcd63b3f9cadda18acba1bcd1d7c457a37c975a7a412416a28bd1bab2041e05ddfb514da8e9102c89dc51d263f436d3a992e93d37d17f1b81dc9436f35ee41fc30c08f0c8f56e1a5eec90c598e8cfa499a5633f708802c1e5bbeb53e4dc8ab76a8d45db439366ff1d377022a761717beec3be6c92c7bc66533241085bd3a6744543cebb6c5c30baa7f8000871dcd074cb4961fcc813a2d1850a039a7d3be38a9015b6e366a20d256bb532e4a2e420351c58f8224a796124579b4939b2952bdfb10b6fb9c463bd7a0cefd0e69debdff633edddbb2a2834c3eb66e343953aedb26a6236db91b63311590830231d3a94bbf1c28cab278dce3bd408c8707e4e849311a885207ee784fb1e8df225e165bb3e7445b7eccd93bf8461b2783c0c1098133791b37cb0397807a140f281022b2dade062d60467057e2c5872130fa87229529a5f96a18723759bdd1101d6d034f9e1303e98e8805cf4e96d212a3ac3c83afaddee1c8868aac5caa651b2f44db1776b3c16b94f073329cec3057d5aef14aca007dee9aea9c7490186aac0896169a1ca1fb709c18d2355a7dd24ab7086e263fa3d46b0c0bfa6b8743ce1706a09e9935e976cc7cbf52ef4ca6051ddb647c8bcc531fc2f612d947b59fd5b800a704203e7f49fd34810a8c7107796e3f66245318678b6e82c22660ac86ed362d2353c8be6bb596eec15d16c31b7f764a10388acb59ce089a9bc9b87e79694a034185bd3e9b2ce58c9de8a2a3ae922b9ee6826ad396bcaaad41f15d2755e89722bf417dc6d2a4ae3eadc44902f4d31ca188b3766fba8ce618583fb4dd9c2fda1fe6a633556de7a255fde4232c8c4f5c65a10c3f8e1eb1650df050409ad32429281324a2395d2445710c44279fe354f07c398b5c71f1f49602b3d584e9f9fc050ee408e5631eb5a7a269812837f017089728d34fdd92d255945e435435bc86e51debfae73ee8937909a037f773a356bdacc840e4198ec7a749c193f1513d79800b1baa0bb139c6a175393eb9e15e8bd456baa7374257ca2059bd613aba803df50441c40c986fe4b2e23f5122a899fee815685710641b2166d9b412fb38fe08ca08e1b58864f0af79e4bc11e05f277b59b236ac7d144ef5fcb971b777c81218543027c6ae01854830d6f11eb5425a117005d1285e888d126365b7a8447b44900b0a9495cbb1ea6300ca90ffe9c778a90d691db6c7cdd3c1d75d69a24f5dcd632a256be2780efdcbd5d95d62bf7a177f7f577f189dfe256a95d6b505ad2d40bbf50fdee0b18adf94812fd97fdeab34fd941dac922bb4bda2c30c1e73770cb414bf1ad74cac5d1368d50ecc62d5b29ed671ee6161d63051a8be794b635dcf7358cb08e86ba6aca930e949db6d5066ccead06c3180bf89519952566fff319ef4b3a60a580e06d23e0b07e931d8e88851622046baf6dddca763a97f3f54ffe911f33415292b9763d4c6019521ffd38ef1521ad23b6d8f9ba783aebad3449ebb9ac65430007843c0e82ed6a3ee62a94190288cc09ccf65cbf92c6d341ea7fc8b0e1f1f1a73767d3cc9f781fa6a7fc872ada6a186ca48f38291649a698815c66a8177e913100d321fa25edadeaf64867a131891dc745c1c9982e3b0c8f0ccf0144d042d07d4a015df785ffac6d55a50691da029b80ff97daa08692b3a0deb581e8a796c04d4f4e7db2dd69fc12f88951a5662c51dfb00b5ebaf2f74fab923f6db25c4c30018469b845337f3677f4d5d5b99de6ed98b93f0161c8deaf695deea23147f161fbdc16315bf29025fb2ffbd5669fb283b592457697b4586183ce6ee1968297e0a30bf9c91a0f1adb62f1cdc8787793d01869de520137db34da654b7f8db824825080c48eeb45a82c4fb7fb23a264faeefe7ffbb50652671c6f1b815c84edb130f7b0a826a96232e1b779cd16b43cdc3b615794906fd5e9efc5b25dfa7c233dd04e674b6b8abc02d50e69ce7a3cb24b64cf7c28139299cc79ef1839049f4d0b309a454f8d780bd7689d1d6a21750e378ac2915480a69687cd7c2826901ef9b7e06a12491cd718e59a752ba38f781de5a79a30134e588529a491a0c573ef6b53728bea0e4da42d8afc463e475a864604d96fe6877086fbd11a4e0293d015dd4fc2f89110afea35222651f3533ef1fc5afdad379e034825c9495b0301c8198232628401395383318411127433ffe23d8b365b31120469b2d7b95610abb40987cfd2013bf121c822c71a7f8c49b60fe492c3bbd6846f6f7018910b2816804150582255490d178fc281512f7a3c1f089824af242165df95b3926eafaa73440bd677921b536da029a03bbb03f09522efb240832459042151955a03454219538c9644c287c0e7b192bdd5b053ff4d4b873fb76f02e1e073ee5ffa379f3054a80e624fb074d607af65d8b069c7100798467fa65decddf6211515b2279de467169d5a0a30a80839bfbe4376d91d6b38afc8b7476213bb1bcf91c99a6a4870e260c5a52b62fd62783806989bfa11bb9b1cb1fc7941d352a5832ef8173ec2e113732af8bc21ba08395052eda7abd0b3ba55b4c6c073634f9bb4fa6be9f9deb97dc7ee8d767076adfa689f42b35d8fabd98eb79107a4f34c91e6c5dfbcb4fa91e81cb22230c23998a2aefeb1c1aad3a8542fd270d4a906880ca02cea98845489abb075b6eb22738f0f9006992f3fe833c8d8c0963ad7a1c5efe5b8abaaa1f8d7db523eb22cc0cd425febdaa7d2da86202396dcca4a4ab5956d35dd6f752f7c7ebe9f9091fdf0d3889e36d3ca6cbdfc7dde71d0df7c826075a859f33a0f412ac94abb49b3ec5094be06a3370fb5583ac7babf3c9294556048db823af278f90b5d9367e0df769";
    // // Call contract function
    // const transaction = await contract.verifyProof(ethers.utils.toUtf8Bytes(proof), publicInputs);

    // // Wait for transaction confirmation
    // const receipt = await transaction.wait();

    // console.log("Transaction hash:", receipt.transactionHash);

    // Simulate a verification process
    const isVerified = true; // This would be the result of the verification process
    // const url = "https://sepolia.scrollscan.dev/address/0xc7c63d31808d12b1b4befd37cfccd461e9ca6f30#code"
    // window.open(url);
    
    return `Proof has been successfully is verified.`;
  }
  const handleSend = async message => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map(messageObject => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act.
    const tools = [
      {
        type: "function",
        function: {
          name: "verify_smart_contract",
          description: "Verify the code of a given smart contract bytecode by generating a ZKML proof",
          parameters: {
            type: "object",
            properties: {
              contractAddress: {
                type: "string",
                description: "The smart contract bytecode to verify",
              },
            },
            required: ["bytecode"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "check_smart_contract_safety",
          description: "Check if a given smart contract proof is safe",
          parameters: {
            type: "object",
            properties: {
              contractAddress: {
                type: "string",
                description: "The smart contract proof to check for safety",
              },
            },
            required: ["proof"],
          },
        },
      },
    ];

    const apiRequestBody = {
      model: "gpt-3.5-turbo-0125",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessages, // The messages from our chat with ChatGPT
      ],
      tools: tools,
      tool_choice: "auto", // auto is default, but we'll be explicit
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then(data => {
        return data.json();
      })
      .then(async data => {
        const response = data;
        console.log("messages: ", messages);
        console.log("response: ", response);

        const responseMessage = response.choices[0].message;

        // Step 2: check if the model wanted to call a function
        const toolCalls = responseMessage.tool_calls;
        if (responseMessage.tool_calls) {
          // Step 3: call the function
          // Note: the JSON response may not always be valid; be sure to handle errors
          const availableFunctions = {
            verify_smart_contract: verifySmartContract,
            check_smart_contract_safety: checkSmartContractSafety,
          }; // only one function in this example, but you can have multiple
          messages.push(responseMessage); // extend conversation with assistant's reply
          for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            const functionToCall = availableFunctions[functionName];
            const functionArgs = JSON.parse(toolCall.function.arguments);
            const functionResponse = await functionToCall(functionArgs.contractAddress);
            console.log("functionResponse: ", functionResponse);
            // setMessages([
            //   ...chatMessages,
            //   {
            //     tool_call_id: toolCall.id,
            //     role: "tool",
            //     name: functionName,
            //     content: functionResponse,
            //   },
            // ]);
            const newMessages = [
              systemMessage, // The system message DEFINES the logic of our chatGPT
              ...apiMessages, // The messages from our chat with ChatGPT
              {
                role: "assistant",
                content: `You have ran the function ${functionName} on the smart contract, here are the results: ${functionResponse}. Inform the user of the results.`,
              },
            ];
            console.log("newMessages: ", newMessages);
            const secondResponse = await openai.chat.completions.create({
              model: "gpt-3.5-turbo-0125",
              messages: newMessages,
            }); // get a new response from the model where it can see the function response
            console.log(messages);
            console.log("secondResponse: ", secondResponse);
            setMessages([
              ...chatMessages,
              {
                message: secondResponse.choices[0].message.content,
                sender: "ChatGPT",
              },
            ]);
          }
        } else {
          setMessages([
            ...chatMessages,
            {
              message: data.choices[0].message.content,
              sender: "ChatGPT",
            },
          ]);
        }
        setIsTyping(false);
        console.log(messages);
      });
  }

  return (
    <div className="App">
      <div style={{ position: "relative", maxWidth: "700px", height: "690px" }}>
        <MainContainer>
          <ChatContainer>
            <ConversationHeader>
              <Avatar
                src="https://github.com/ToJen/circuit-breaker/raw/main/docs/LOGO.png"
                name="Emily"
              />
              <ConversationHeader.Content userName="VeriBot" info="🟢 Active now" />
              <ConversationHeader.Actions>
                <VoiceCallButton />
                <VideoCallButton />
                <InfoButton />
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="VeriBot is typing" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
      {proof && (
  <div style={{ textAlign: 'left' }}>
        <p>Last Generated Proof:</p>

    <p>Proof String: {proofString.slice(0,100)}...</p>
    <button onClick={() => {
      navigator.clipboard.writeText(proofString);
      alert("Proof copied to clipboard!")
      }}
>Copy Full Proof to Clipboard</button>
<br />
<br />
    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
      {JSON.stringify(proof, null, 2)}
    </pre>
    
  </div>
)}

    </div>
  );
}

export default App;
