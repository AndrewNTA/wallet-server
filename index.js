const express = require('express');
const cors = require('cors');
const prod = require('./prod');
const app = express();

app.use(cors());
app.use(express.json());

/**
 * 1 USD = 22,963.00
 * 1 EUR = 24,931.32
 * 1 YEN = 178.81
 */
const getExchangeRate = id => {
  switch (id) {
    case 'usd':
      return 22963;
    case 'eur':
      return 24931.32;
    case 'yen':
      return 178.81;
  }
}

const assets = [
  {
    id: 'usd',
    primary_value: 2000,
    primary_currency: 'USD',
    secondary_value: 45926000,
    secondary_currency: 'VND',
  },
  {
    id: 'eur',
    primary_value: 500,
    primary_currency: 'EUR',
    secondary_value: 12465660,
    secondary_currency: 'VND',
  },
  {
    id: 'yen',
    primary_value: 30000,
    primary_currency: 'YEN',
    secondary_value: 5364300,
    secondary_currency: 'VND',
  },
]

const findAssetIndex = id => {
  for(let i = 0; i < assets.length; i++) {
    if (assets[i].id === id) {
      return i;
    }
  }
  return -1;
}

// Get account wallet
app.get('/api/account', (req, res) => {
  res.send(assets)
})
// Send the asset
app.post('/api/assets', (req, res) => {
  const { id, value } = req.body;
  const index = findAssetIndex(id);
  if (index >= 0) {
    let updatedAsset = assets[index];
    const currentPrimaryValue = updatedAsset['primary_value'];
    const exchangeRate = getExchangeRate(id);
    const newPrimaryValue = currentPrimaryValue - value;
    updatedAsset = {
      ...updatedAsset,
      primary_value: newPrimaryValue,
      secondary_value: (newPrimaryValue * exchangeRate).toFixed(2),
    }
    assets[index] = updatedAsset;
  }
  res.send(assets);
});

prod(app);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
