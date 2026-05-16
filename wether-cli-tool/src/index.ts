import {z} from "zod";
import { generateText, tool, stepCountIs } from "ai";
import {google} from "@ai-sdk/google";

// read the API key from .env file
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// define the whether tool
const weatherTool = tool({
  description:"Get the current weather for a given location",
  inputSchema: z.object({
    location: z.string(), // AI must pass a location string 
  }),  
  execute: async ({ location }) => {
    //1. Convert city name to coordinates (lat, lon)
    const geo = await getCoordinates(location);
    // 2. use coordinates to get weather
    const weather = await getweather(geo.lat, geo.lon); 
    return weather;
  },
});

// convert city name to coordinates
// openWeather needs lat/lon, not city name
async function getCoordinates(location: string){
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${OPENWEATHER_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data[0];   // Returns { lat, lon, name }
}

// get actual weather using coordinates
async function getweather(lat:number, lon:number){
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;   // Returns temprature, humidity, description etc.
}

// Read the location from terminal command
// Example: bun run index.ts "Colombo" -> locationArg = "Colombo"
const locationArg = process.argv[2];

if(!locationArg){
  console.log("Usage: bun --env-file=.env run index.ts <locator>");
  process.exit(1);
}

// ask the AI to get weather using the tool
const result = await generateText({
  model: google("gemini-2.0-flash"),   // Google AI model
  tools: {weather: weatherTool},   // give AI access to weather tool
  stopWhen: stepCountIs(5),      // stop after max 5 steps
  prompt: ` What is the weather in ${locationArg} ?`,  // ask AI to get weather for the location
});

// print the AI's response
console.log(result.text);


