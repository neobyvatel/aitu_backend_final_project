const axios = require("axios");
// const { Iconify } = require("@iconify/iconify");
const COINMARKETCAP_API_KEY = "21f32e33-6011-4289-8583-b92cf636ac67";
const POLYGONIO_API_KEY = "h0hrGc3VH6O92rxZBN3ExnOeZpkyiMeP";
const NEWS_API_KEY = "e0d57efa44a849c29289364fa1000031";
const { convertToDate } = require("./utils");

async function getLastTrade(ticker) {
  try {
    const response = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker.toUpperCase()}`
    );

    const data = response.data;

    // Check if the response contains valid data
    if (
      data &&
      data.chart &&
      data.chart.result &&
      data.chart.result.length > 0 &&
      data.chart.result[0].meta &&
      data.chart.result[0].meta.regularMarketPrice
    ) {
      const regularMarketPrice = data.chart.result[0].meta.regularMarketPrice;

      return {
        T: ticker.toUpperCase(),
        p: regularMarketPrice,
        // You can add more fields here if needed
      };
    } else {
      throw new Error("Invalid response from Yahoo Finance API");
    }
  } catch (error) {
    console.error("Error fetching stock by ticker:", error);
    return null;
  }
}

// async function getCryptocurrencyIconUrl(symbol) {
//   try {
//     // Generate the icon URL using the symbol
//     const iconUrl = Iconify.renderIcon(
//       `cryptocurrency:${symbol.toLowerCase()}`,
//       { color: "#888888" }
//     ).url;
//     return iconUrl;
//   } catch (error) {
//     console.error("Error retrieving cryptocurrency icon:", error);
//     return null;
//   }
// }

async function getCryptocurrencyListings() {
  try {
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
        },
      }
    );

    const data = response.data.data;
    const answer = data.map((crypto) => ({
      name: crypto.name,
      symbol: crypto.symbol,
      price: crypto.quote.USD.price,
      market_cap: crypto.quote.USD.market_cap,
      volume_24h: crypto.quote.USD.volume_24h,
      percent_change_1h: crypto.quote.USD.percent_change_1h,
      percent_change_24h: crypto.quote.USD.percent_change_24h,
      circulating_supply: crypto.circulating_supply,
    }));

    return answer;
  } catch (error) {
    console.error("Error fetching cryptocurrency listings:", error);
    return null;
  }
}

async function getCryptoCurrencyByName(ticker) {
  try {
    const symbol = ticker.toUpperCase();

    const response = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${symbol}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
        },
      }
    );
    const data = response.data;

    const cryptoData = data.data[symbol];

    const answer = {
      name: cryptoData.name,
      symbol: cryptoData.symbol,
      logo: cryptoData.logo,
      category: cryptoData.category,
      description: cryptoData.description,
      date_added: convertToDate(cryptoData.date_added),
      tags: cryptoData.tags,
      urls: cryptoData.urls,
    };
    console.log(answer);
    return answer;
  } catch (error) {
    console.error("Error fetching cryptocurrency info:", error);
    return null;
  }
}

async function getStockByTicker(ticker) {
  try {
    const response = await axios.get(
      `https://api.polygon.io/v1/meta/symbols/${ticker.toUpperCase()}/company?&apiKey=${POLYGONIO_API_KEY}`
    );
    const data = response.data;
    const answer = {
      name: data.name || "Unknown",
      logo: data.logo || "https://example.com/default-logo.png",
      ticker: data.ticker || "N/A",
      market: data.market || "N/A",
      locale: data.locale || "N/A",
      currency: data.currency || "N/A",
      active: data.active || false,
      primary_exchange: data.primary_exchange || "N/A",
      updated: data.updated || "N/A",
      url: data.url || "#",
    };
    return answer;
  } catch (error) {
    console.error("Error fetching stock by ticker:", error);
    return null;
  }
}

async function getNews(keyword) {
  const NEWS_API_KEY = "e0d57efa44a849c29289364fa1000031";
  const url = `https://newsapi.org/v2/everything?q=${keyword}&apiKey=${NEWS_API_KEY}&pageSize=7`;

  try {
    const response = await axios.get(url);
    const answer = response.data.articles.map((article) => ({
      title: article.title,
      url: article.url,
      source: article.source.name,
      description: article.description,
      date: article.publishedAt,
      image: article.urlToImage,
    }));
    return answer;
  } catch (error) {
    console.error("Error fetching news:", error);
    return null;
  }
}

module.exports = {
  getCryptocurrencyListings,
  getCryptoCurrencyByName,
  getStockByTicker,
  getNews,
  getLastTrade,
};
