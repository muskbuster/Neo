const express = require('express');
const bodyParser = require('body-parser');
const { invokeContract } = require('./transactionUtils');

const app = express();
app.use(bodyParser.json());

app.post('/invoke', async (req, res) => {
  try {
    const { sender, DataHash, inputData1, signature1} = req.body;
    // You can validate and sanitize inputs here

    const tx = await invokeContract(sender, DataHash, inputData1,signature1);

    // Serialize the transaction to hex and send it in the response
    res.status(200).json({ message: 'Transaction signed and serialized'});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(3003, () => {
  console.log('API server is running on port 3000');
});
