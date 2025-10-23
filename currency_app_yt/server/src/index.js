const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

//middle wares
app.use(express.json());
app.use(cors());

//all currencies
app.get("/getAllCurrencies" , async (req, res)=>{
const nameURL ="https://openexchangerates.org/api/currencies.json?app_id=9001ef57a2994bf8b1afe89808456526";
 


try{
const namesResponce = await axios.get(nameURL);
const nameData = namesResponce.data;

return res.json(nameData);
}catch (err) {
     console.error(err);
}

});

 app.get("/convert", async (req, res) => {
  const { sourceCurrency, targetCurrency, amountInSourceCurrency } = req.query;

  if (!sourceCurrency || !targetCurrency || !amountInSourceCurrency) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  try {
    const dataUrl = `https://openexchangerates.org/api/latest.json?app_id=9001ef57a2994bf8b1afe89808456526`;
    const response = await axios.get(dataUrl);
    const rates = response.data.rates;

    const sourceRate = rates[sourceCurrency];
    const targetRate = rates[targetCurrency];
    const amount = parseFloat(amountInSourceCurrency);

    if (!sourceRate || !targetRate) {
      return res.status(400).json({ error: "Invalid currency code" });
    }

    const targetAmount = (targetRate / sourceRate) * amount;

    return res.json(targetAmount);
  } catch (err) {
    console.error("Conversion error:", err.response ? err.response.data : err.message);
    return res.status(500).json({ error: "Failed to fetch conversion rates" });
  }
});


//listen to a part 
app.listen(5000, () => {
     console.log("SERVER STARTED");
});