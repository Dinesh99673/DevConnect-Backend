const  app  = require('./app');

require('dotenv').config();
const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
