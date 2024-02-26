### Installation

- Clone the repository `git clone https://github.com/neobyvatel/aitu_backend_final_project`
- Enter the folder `cd backend`
- Install dependencies `npm i`
- Run the server using dev script `npm run dev`

### Used npm dependencies

- [express](https://www.npmjs.com/package/express) - Easy and Fast JavaScript framework
- [express-session](https://www.npmjs.com/package/express-session) - Sessions with express js
- [bcrypt](https://www.npmjs.com/package/bcrypt) - A library to hash passwords
- [nodemon](https://www.npmjs.com/package/nodemon) - Automatically restarts the node application when file changes (developers dependency)
- [axios](https://www.npmjs.com/package/axios) - A promise-based HTTP library
- [body-parser](https://www.npmjs.com/package/body-parser) - NodeJS body parsing middleware
- [ejs](https://www.npmjs.com/package/ejs) - Embedded JavaScript templates
- [mongoose](https://www.npmjs.com/package/mongoose) - Mongoose is a MongoDB object modeling tool that supports Node.js

## Resources Used

- [Bootstrap 5 CSS](https://getbootstrap.com/) - CSS framework for styling
- [Font Awesome](https://fontawesome.com/) - Icon library for web projects
- [Google Fonts (Poppins)](https://fonts.google.com/specimen/Poppins) - Font family used in the project
- [SweetAlerts 2](https://sweetalert2.github.io/) - Library for more intuitive alert boxes
- [Popper JS](https://popper.js.org/) - Tooltip & popover positioning engine
- [jQuery](https://jquery.com/) - JavaScript library for DOM manipulation and event handling

## APIs

### 1. Get Cryptocurrency Listings

- **Description:** Fetches the latest cryptocurrency listings including name, symbol, price, market cap, volume, and percent change.
- **Endpoint:** `/listings`
- **Method:** GET

### 2. Get Cryptocurrency Info by Ticker

- **Description:** Fetches detailed information about a cryptocurrency based on its ticker symbol.
- **Endpoint:** `/crypto`
- **Method:** POST
- **Parameters:**
  - `ticker`: Symbol of the cryptocurrency

### 3. Get Stock Info by Ticker

- **Description:** Fetches information about a stock based on its ticker symbol.
- **Endpoint:** `/stocks`
- **Method:** POST
- **Parameters:**
  - `ticker`: Symbol of the stock

### 4. Get Last Trade

- **Description:** Fetches the last trade information for a given stock.
- **Endpoint:** `/stocks/lastTrade`
- **Method:** POST
- **Parameters:**
  - `ticker`: Symbol of the stock

### 5. Get News

- **Description:** Fetches news articles related to a given keyword.
- **Endpoint:** `/news`
- **Method:** GET
- **Parameters:**
  - `keyword`: Keyword to search for news articles

## Admin account data

- login: admin
- email: admin@example.com
- password: admin123
