const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;

const { UserModel, LogsModel, ItemModel } = require("./database");
const {
  getCryptocurrencyListings,
  getCryptoCurrencyByName,
  getStockByTicker,
  getNews,
  getLastTrade,
} = require("./api");
const { getWindDirection, getCurrentTimeString } = require("./utils");

app.use(
  session({
    secret: "adilkenzhiyev",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !true, maxAge: 3600000 },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("trust proxy", true);

// Index page
// Index page
app.get("/", async (req, res) => {
  const user = await getUserInstance(req);
  const items = await ItemModel.find().exec();

  res.render("pages/index.ejs", {
    activePage: "home",
    user: user ? user : null,
    error: null,
    items: items,
  });
});

// listings page
app.get("/listings", async (req, res) => {
  const user = await getUserInstance(req);

  try {
    const listings = await getCryptocurrencyListings();

    if (listings) {
      res.render("pages/listings.ejs", {
        activePage: "listings",
        user: user ? user : null,
        error: null,
        stockInfo: null, // Pass the stockInfo here or update the logic to populate it
        listings: listings,
      });
    } else {
      res.render("pages/listings.ejs", {
        activePage: "listings",
        user: user ? user : null,
        error: "Failed to fetch cryptocurrency listings",
        stockInfo: null,
        listings: null,
      });
    }
  } catch (error) {
    console.error("Error fetching cryptocurrency listings:", error);
    res.render("pages/listings.ejs", {
      activePage: "listings",
      user: user ? user : null,
      error: "Failed to fetch cryptocurrency listings",
      stockInfo: null,
      listings: null,
    });
  }
});

// stocks page
app.get("/stocks", async (req, res) => {
  const user = await getUserInstance(req);
  res.render("pages/stocks.ejs", {
    activePage: "stocks",
    user: user ? user : null,
    error: null,
    stockInfo: null,
  });
});
app.post("/stocks", async (req, res) => {
  const user = await getUserInstance(req);
  const ticker = req.body.ticker;

  try {
    const stockInfo = await getLastTrade(ticker);

    if (stockInfo) {
      res.render("pages/stocks.ejs", {
        activePage: "stocks",
        user: user ? user : null,
        error: null,
        stockInfo: stockInfo,
      });
    } else {
      res.render("pages/stocks.ejs", {
        activePage: "stocks",
        user: user ? user : null,
        error: "Failed to fetch stock info",
        stockInfo: null,
      });
    }
  } catch (error) {
    console.error("Error fetching stock info:", error);
    res.render("pages/stocks.ejs", {
      activePage: "stocks",
      user: user ? user : null,
      error: "Failed to fetch stock info",
      stockInfo: null,
    });
  }
});

// crypto page
app.get("/crypto", async (req, res) => {
  const user = await getUserInstance(req);
  res.render("pages/crypto.ejs", {
    activePage: "crypto",
    user: user ? user : null,
    error: null,
    info: null,
  });
});

app.post("/crypto", async (req, res) => {
  const user = await getUserInstance(req);
  const ticker = req.body.ticker;
  const info = await getCryptoCurrencyByName(ticker);

  if (info) {
    res.render("pages/crypto.ejs", {
      activePage: "crypto",
      user: user ? user : null,
      error: null,
      info: info,
    });
  } else {
    res.render("pages/crypto.ejs", {
      activePage: "crypto",
      user: user ? user : null,
      error: "Failed to fetch cryptocurrency info",
      info: null,
    });
  }
  LogsModel.create({
    user: user ? user._id : null,
    request_type: "crypto",
    request_data: ticker,
    status_code: info ? "200" : "404",
    timestamp: new Date(),
    response_data: info ? JSON.stringify(info) : "failed",
  });
});

// news page
app.get("/news", async (req, res) => {
  const user = await getUserInstance(req);
  try {
    const news = await getNews("crypto");
    res.render("pages/news.ejs", {
      activePage: "news",
      user: user,
      data: news,
      error: null,
    });
    LogsModel.create({
      user: user ? user._id : null,
      request_type: "news",
      request_data: null,
      status_code: "200",
      timestamp: new Date(),
      response_data: JSON.stringify(news),
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.render("pages/news.ejs", {
      activePage: "news",
      user: user,
      data: null,
      error: "Could not fetch news",
    });
  }
});

// History page
app.get("/history", ensureAuthenticated, async (req, res) => {
  const user = await getUserInstance(req);
  if (!user) {
    return res.status(303).redirect("/");
  }

  const logs = await LogsModel.find({ user: user._id })
    .sort({ _id: -1 })
    .exec();
  res.render("pages/history.ejs", {
    activePage: "history",
    user: user,
    logs: logs,
    error: logs ? null : "No logs found",
  });
});

app.get("/history/:objectId", ensureAuthenticated, async (req, res) => {
  const objectId = req.params.objectId;
  const log = await LogsModel.findById(objectId).exec();
  try {
    if (!log) {
      return res.status(404).send("Log not found");
    }

    res.json(JSON.parse(log.response_data));
  } catch (error) {
    res.status(200).json({ data: log.response_data });
  }
});

app.get("/history/:objectId/delete", ensureAuthenticated, async (req, res) => {
  const user = await getUserInstance(req);
  if (!user) {
    return res.status(303).redirect("/");
  }

  const objectId = req.params.objectId;

  await LogsModel.findByIdAndDelete(objectId).exec();
  res.status(303).redirect("/history");
});

app.get("/history/delete/all", ensureAuthenticated, async (req, res) => {
  const user = await getUserInstance(req);

  if (!user) {
    return res.status(303).redirect("/");
  }

  const logs = await LogsModel.find({ user: user._id }).exec();

  if (!logs || logs.length === 0) {
    return res.status(404).send("No logs found to delete.");
  }

  await LogsModel.deleteMany({ user: user._id }).exec();
  res.status(303).redirect("/history");
});

// Admin page
app.get("/admin", ensureAdmin, async (req, res) => {
  const user = await getUserInstance(req);

  if (!user || !user.is_admin) {
    return res.status(303).redirect("/");
  }

  const allUsers = await UserModel.find().exec();

  res.render("pages/admin.ejs", {
    activePage: "admin",
    user: user,
    users: allUsers,
  });
});

app.get("/admin/:userid/delete", ensureAdmin, async (req, res) => {
  const user = await getUserInstance(req);

  if (!user || !user.is_admin) {
    return res.status(403).redirect("/");
  }

  const userId = req.params.userid;

  await UserModel.findByIdAndDelete(userId).exec();
  res.status(202).redirect("/admin");
});

app.get("/admin/:userid/makeAdmin", ensureAdmin, async (req, res) => {
  const user = await getUserInstance(req);

  if (!user || !user.is_admin) {
    return res.status(403).redirect("/");
  }

  const userId = req.params.userid;

  await UserModel.findByIdAndUpdate(userId, { is_admin: true }).exec();
  res.status(202).redirect("/admin");
});

app.post("/admin/addUser", ensureAdmin, async (req, res) => {
  const { username, email, password, is_admin } = req.body;
  const user = await getUserInstance(req);

  if (!user || !user.is_admin) {
    return res.status(403).redirect("/");
  }

  const userInstance = new UserModel({
    username: username,
    email: email,
    password: password,
    is_admin: is_admin === "on",
  });
  await userInstance.save();

  res.status(202).redirect("/admin");
});

app.get("/admin/user/:username", ensureAdmin, async (req, res) => {
  const username = req.params.username;
  const s_user = await UserModel.findOne({ username: username }).exec();
  const history = await LogsModel.find({ user: s_user._id })
    .sort({ _id: -1 })
    .exec();
  const user = await getUserInstance(req);

  res.render("pages/admin_user.ejs", {
    activePage: "admin",
    user: user,
    s_user: s_user,
    logs: history,
    error: history ? null : "No logs found",
  });
});

app.post("/admin/updateUser", ensureAdmin, async (req, res) => {
  const { userId, username, email, password } = req.body;
  const updated_at = new Date();
  await UserModel.findByIdAndUpdate(userId, {
    username,
    email,
    password,
    updated_at,
  }).exec();

  res.redirect("/admin");
});

// Admin Items
app.get("/admin/items", ensureAdmin, async (req, res) => {
  const user = await getUserInstance(req);
  const items = await ItemModel.find().exec();

  res.render("pages/admin_items.ejs", {
    activePage: "admin",
    user: user,
    items: items,
  });
});

// This route is ONLY for fetching it from frontend, not the FORM submissions
app.get("/admin/item/:itemId", ensureAdmin, async (req, res) => {
  const item = await ItemModel.findOne({ _id: req.params.itemId }).exec();
  return item ? res.json(item) : res.status(404).send("Item not found");
});

app.post("/admin/addItem", ensureAdmin, async (req, res) => {
  const { names, descriptions, pictures } = req.body;

  const newItem = new ItemModel({
    names: {
      en: names.en,
      ru: names.ru,
      kz: names.kz,
    },
    descriptions: {
      en: descriptions.en,
      ru: descriptions.ru,
      kz: descriptions.kz,
    },
    pictures: pictures,
  });

  await newItem.save();

  res.status(303).redirect("/admin/items");
});

app.post("/admin/updateItem", ensureAdmin, async (req, res) => {
  console.log(req.body);
  const { itemId, names, descriptions, pictures } = req.body;
  const updated_at = new Date();

  await ItemModel.findByIdAndUpdate(itemId, {
    names: {
      en: names.en,
      ru: names.ru,
      kz: names.kz,
    },
    descriptions: {
      en: descriptions.en,
      ru: descriptions.ru,
      kz: descriptions.kz,
    },
    pictures: pictures,
    updated_at: updated_at,
  }).exec();

  res.status(303).redirect("/admin/items");
});

app.get("/admin/item/:itemId/delete", ensureAdmin, async (req, res) => {
  await ItemModel.findByIdAndDelete(req.params.itemId).exec();
  res.status(303).redirect("/admin/items");
});

// Login page
app.get("/login", alreadyLoggedIn, async (req, res) => {
  const user = await getUserInstance(req);
  if (user) {
    return res.status(303).redirect("/");
  }
  res.render("pages/login.ejs", {
    activePage: "login",
    error: null,
    user: null,
  });
});

app.post("/login", alreadyLoggedIn, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.render("pages/login.ejs", {
      activePage: "login",
      error: "All fields are required",
      user: null,
    });
    return;
  }

  let userInstance = await UserModel.findOne({ username: username }).exec();

  if (!userInstance) {
    res.render("pages/login.ejs", {
      activePage: "login",
      error: "User does not exist",
      user: null,
    });
    return;
  }

  const match = await bcrypt.compare(password, userInstance.password);

  if (!match) {
    LogsModel.create({
      user: userInstance._id,
      request_type: "login",
      request_data: username,
      status_code: "401",
      timestamp: new Date(),
      response_data: "wrong password",
    });
    res.render("pages/login.ejs", {
      activePage: "login",
      error: "Password is incorrect",
      user: null,
    });
    return;
  }

  req.session.userId = userInstance._id;
  res.status(303).redirect("/");
  LogsModel.create({
    user: userInstance._id,
    request_type: "login",
    request_data: username,
    status_code: "200",
    timestamp: new Date(),
    response_data: "success",
  });
});

// Signup page
app.get("/signup", alreadyLoggedIn, async (req, res) => {
  const user = await getUserInstance(req);
  if (user) {
    return res.status(303).redirect("/");
  }

  res.render("pages/signup.ejs", {
    activePage: "signup",
    error: null,
    user: null,
  });
});

app.post("/signup", alreadyLoggedIn, async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !email || !password) {
    res.render("pages/signup.ejs", {
      activePage: "signup",
      error: "All fields are required",
      user: null,
    });
    return;
  }

  let userInstance = await UserModel.findOne({ username: username }).exec();

  if (userInstance) {
    res.render("pages/signup.ejs", {
      activePage: "signup",
      error: "User already exists",
      user: null,
    });
    return;
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  userInstance = new UserModel({
    username: username,
    email: email,
    password: hashedPassword,
    created_at: new Date(),
    updated_at: new Date(),
    is_admin: false,
  });
  await userInstance.save();

  res.status(303).redirect("/login");
  LogsModel.create({
    user: userInstance._id,
    request_type: "signup",
    request_data: username,
    status_code: "200",
    timestamp: new Date(),
    response_data: "success",
  });
});

// Logout logic
app.get("/logout", ensureAuthenticated, async (req, res) => {
  req.session.destroy();
  res.status(303).redirect("/");
  LogsModel.create({
    user: null,
    request_type: "logout",
    request_data: null,
    status_code: "200",
    timestamp: new Date(),
    response_data: "success",
  });
});

// Listening
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Utils
async function getUserInstance(req) {
  if (req.session.userId) {
    return await UserModel.findById(req.session.userId).exec();
  }

  return null;
}

// Middleware
async function ensureAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }

  res.status(403).redirect("/login");
}

async function ensureAdmin(req, res, next) {
  let user = null;

  if (req.session.userId) {
    user = await UserModel.findById(req.session.userId).exec();
  }

  if (user?.is_admin) {
    return next();
  }

  res.status(403).redirect("/");
}

async function alreadyLoggedIn(req, res, next) {
  if (req.session.userId) {
    return res.status(303).redirect("/");
  }

  return next();
}
