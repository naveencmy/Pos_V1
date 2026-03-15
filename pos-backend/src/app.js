const express = require('express')

const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const salesRoutes = require('./routes/salesRoutes')
const purchaseRoutes = require('./routes/purchaseRoutes')
const inventoryRoutes = require('./routes/inventoryRoutes')
const partyRoutes = require('./routes/partyRoutes')
const reportRoutes = require('./routes/reportRoutes')

const errorMiddleware = require('./middleware/errorMiddleware')

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/products', productRoutes)
app.use('/sales', salesRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/inventory', inventoryRoutes)
app.use('/parties', partyRoutes)
app.use('/reports', reportRoutes)

app.use(errorMiddleware)

module.exports = app