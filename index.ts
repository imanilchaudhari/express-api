import dotenv from 'dotenv';
import app from './src/App';

dotenv.config();

const serverHost = process.env.APP_HOST || "0.0.0.0";
const serverPort = process.env.APP_PORT || 3000;

app.listen(serverPort, () => {
  console.log(`Listening for traffic @ http://${serverHost}:${serverPort}`);
}).on('error', function(error) {
  console.log(error.message);
});