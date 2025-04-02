// https://modelcontextprotocol.io/introduction

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import express from "express";

const app = express();

const server = new McpServer({
  name: "Weather Data MCP Server",
  version: "1.0.0",
});

// server.prompt // we can give a prompt to the user
// server.resource // we can give a resource to the user

// function that will get weather by city
async function getWeatherDataByCityName(city: string) {
  // for this example we will not going to fetch data from api
  if (city.toLowerCase() === "kathmandu") {
    return {
      temp: "30C",
      forecast: "sunny",
    };
  }
  if (city.toLowerCase() === "lalitpur") {
    return {
      temp: "25C",
      forecast: "cloudy",
    };
  }

  if (city.toLowerCase() === "damak") {
    return {
      temp: "20C",
      forecast: "rainy",
    };
  }

  return {
    temp: null,
    error: "Unable to get data",
  };
}

// we can also give a tool to the user
server.tool(
  "getWeatherDataByCityName",
  // give a specific name to the tool so that LLM will know which tool to use
  {
    // so this tool will take a city name as input and return the weather data for that city
    city: z.string(),
  },
  async ({ city }) => {
    // return bellow format
    // content: [
    //     {
    //       type: "text",
    //       text: "Failed to retrieve alerts data",
    //     },
    //   ],

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(await getWeatherDataByCityName(city)), // here we have to give data in the form of string
        },
      ],
    };
  }
);

// Now we have to convert this server into Standard Input Output format
// So whatever above tool will take and return data in this format

(async () => {
  // NOTE that if you want to use StdIO then you need to have to runnable code in your local machine where you are calling it from like 'node index.js' which client will call the server
  // https://modelcontextprotocol.io/docs/concepts/transports#standard-input%2Foutput-stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // But in most of the case where you want to use third party tools where they will not provide you MCP server code then you can't use StdIO which only runs in your local machine throw terminal or any process
  // In that case you have to use SSE Transport
  // https://modelcontextprotocol.io/docs/concepts/transports#server-sent-events-sse
})();
