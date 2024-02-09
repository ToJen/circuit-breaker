import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import {
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

import OpenAI from "openai";
import { useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    "You are VeriBot, a cutting-edge chatbot designed to assist users in verifying and checking smart contracts securely within the decentralized finance (DeFi) ecosystem. Your chatbot, named VeriBot, employs advanced technologies such as Zero-Knowledge Proofs (ZK proofs) and Machine Learning (ML) to ensure the authenticity and security of smart contracts while preserving developers' privacy. Users rely on VeriBot to upload contract source code privately, generate ZK proofs, and receive comprehensive verification reports. Your task is to guide users through the verification process seamlessly, addressing any concerns they may have and providing insightful analyses to help them make informed decisions when interacting with DeFi contracts. Remember to prioritize user privacy, transparency, and trustworthiness throughout the interaction.",
};

async function verifySmartContract(contractAddress) {
  // Placeholder: In a real implementation, you might fetch the contract's source code
  // from a blockchain explorer API or use a service that verifies contract code.

  alert(`Verifying contract at address: ${contractAddress}`);

  // Simulate a verification process
  const isVerified = true; // This would be the result of the verification process

  if (isVerified) {
    console.log(`Contract at address ${contractAddress} is verified.`);
  } else {
    console.log(`Contract at address ${contractAddress} could not be verified.`);
  }

  return JSON.stringify({ contractAddress: "contractAddress", isVerified: isVerified });
}

async function checkSmartContractSafety(contractAddress) {
  // Placeholder: In reality, you would likely call an external API or use a library
  // that analyzes the contract's bytecode for known vulnerabilities.

  alert(`Checking safety of contract at address: ${contractAddress}`);

  // Simulate a safety check process
  const isSafe = true; // This would be determined by the safety check process

  if (isSafe) {
    console.log(`Contract at address ${contractAddress} is considered safe.`);
  } else {
    console.log(`Contract at address ${contractAddress} may have vulnerabilities.`);
  }

  return JSON.stringify({ contractAddress: "contractAddress", isSafe: isSafe });
}

function App() {
  const [messages, setMessages] = useState([
    {
      message:
        "Hello, Veribot here! I'm your personal ZKML smart contract verification assistant. 😄 What contracts do you want to verify or check today?",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

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
          description: "Verify the code of a given smart contract address",
          parameters: {
            type: "object",
            properties: {
              contractAddress: {
                type: "string",
                description: "The smart contract address to verify",
              },
            },
            required: ["contractAddress"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "check_smart_contract_safety",
          description: "Check if a given smart contract is safe",
          parameters: {
            type: "object",
            properties: {
              contractAddress: {
                type: "string",
                description: "The smart contract address to check for safety",
              },
            },
            required: ["contractAddress"],
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
            setMessages([
              ...chatMessages,
              {
                tool_call_id: toolCall.id,
                role: "tool",
                name: functionName,
                content: functionResponse,
              },
            ]);
            const secondResponse = await openai.chat.completions.create({
              model: "gpt-3.5-turbo-0125",
              messages: [
                systemMessage, // The system message DEFINES the logic of our chatGPT
                ...apiMessages, // The messages from our chat with ChatGPT
                {
                  role: "assistant",
                  content: functionResponse,
                },
              ],
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
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
