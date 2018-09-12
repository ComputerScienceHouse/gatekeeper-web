import express from "express";
import React from "react";
import fetch from "cross-fetch";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import App from "./components/App";

let assets: any;

const syncLoadAssets = () => {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

const server = express()
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .get("/*", (req: express.Request, res: express.Response) => {
    const client = new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        fetch,
        uri: "http://localhost:8000/graphql",
        credentials: "same-origin",
        headers: {
          cookie: req.header("Cookie")
        }
      }),
      cache: new InMemoryCache()
    });

    const context = {};

    const markup = renderToString(
      <ApolloProvider client={client}>
        <StaticRouter context={context} location={req.url}>
          <App/>
        </StaticRouter>
      </ApolloProvider>
    );

    res.send(
      `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Gatekeeper</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootswatch/4.1.2/yeti/bootstrap.min.css" />
        ${assets.client.css
          ? `<link rel="stylesheet" href="${assets.client.css}">`
          : ""
        }
    </head>
    <body>
        <div id="root">${markup}</div>

        <script>
          window.__APOLLO_STATE__ = ${JSON.stringify(client.cache.extract())};
        </script>
        ${process.env.NODE_ENV === "production"
          ? `<script src="${assets.client.js}" defer></script>`
          : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
      </body>
  </html>`
    );
  });

export default server;
