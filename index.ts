// https://modelcontextprotocol.io/introduction

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

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
  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
