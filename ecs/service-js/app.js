const http = require('http');
const { generateKeyPairSync } = require('crypto');
const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = require('express')();

// Enable KeepAlive to speed up HTTP requests to another microservices
http.globalAgent.keepAlive = true;

const { PORT = 4000, NODE_ENV = '', VAR_A = '', VAR_B = '', VAR_C = '' } = process.env;

const getMyIp = async () => {
  const response = await fetch('https://checkip.amazonaws.com/');
  const ip = await response.text();
  return ip.replace('\n', '');
};

const testRoute = async (req, res) => {
  try {
    const ip = await getMyIp();
    res.send({
      message: 'UP',
      uptime: Math.round(process.uptime()),
      public_ip: ip,
      PORT,
      NODE_ENV,
      VAR_A,
      VAR_B,
      VAR_C,
    });
  } catch (e) {
    res.status(503).end();
  }
};

const keysRoute = (req, res) => {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: 'top secret',
    },
  });

  res.send({ publicKey, privateKey });
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/test', testRoute);
app.get('/keys', keysRoute);
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
