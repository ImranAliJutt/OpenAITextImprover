import React, { useState } from 'react';
import './App.css';
import OpenAI from 'openai';
import { BeatLoader } from 'react-spinners';

function App() {
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleButtonClick = () => {
    setError('');
    setIsLoading(true);
    gptResponse(inputText);
  };

  // Initialize OpenAI with your API key
  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const gptResponse = async (input) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You will be provided with statements, and your task is to convert them to standard English.",
          },
          {
            role: "user",
            content: input,
          },
        ],
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1,
      });
  
      // Check if response contains choices and completion content
      if (
        response &&
        response.choices &&
        response.choices.length > 0 &&
        response.choices[0].message &&
        response.choices[0].message.content
      ) {
        const completionText = response.choices[0].message.content.trim();
        setDisplayText(completionText);
      } else {
        setError('Error: Unexpected response format. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error: An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Convert to Good English</h1>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text"
      />
      <button onClick={handleButtonClick}>Convert</button>
      <div className="translation">
        {isLoading ? <BeatLoader size={12} color={"red"} /> : <textarea value={displayText} readOnly rows="10" cols="30" placeholder="Displayed text will appear here" />}
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;
