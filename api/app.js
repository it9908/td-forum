const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.use('/upload', require('./router/upload/upload'))
app.use(require("./router/role/index"))
app.use('/admin', require("./router/role/admin"))

app.listen(5000, () => {
  console.log(`Server started on port http://localhost:5000`);
});





