const express = require('express');
const bodyParser = require('body-parser');
const { createAndSignTransaction } = require('./transactionUtils');

const app = express();
app.use(bodyParser.json());

app.post('/invoke', async (req, res) => {
  try {
    const { sender, dataHash, inputData1, inputData2, inputData3 } = req.body;
    // You can validate and sanitize inputs here

    const tx = await createAndSignTransaction(sender, dataHash, inputData1, inputData2, inputData3);

    // Serialize the transaction to hex and send it in the response
    res.status(200).json({ message: 'Transaction signed and serialized', transaction: tx.serialize(true) });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(3000, () => {
  console.log('API server is running on port 3000');
});
