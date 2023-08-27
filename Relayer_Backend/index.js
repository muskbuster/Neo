const express = require('express');
const bodyParser = require('body-parser');
const { invokeContract } = require('./transactionUtils');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/invoke', async (req, res) => {
  try {
    const { sender, Datahash, inputData1, signature1} = req.body;
    console.log(req.body);
    // You can validate and sanitize inputs here

    const tx = await invokeContract(sender, Datahash, inputData1,signature1);
    res.status(200).json({ message: 'Transaction signed and serialized'});

    // Serialize the transaction to hex and send it in the response
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(3003, () => {
  console.log('API server is running on port 3000');
});
