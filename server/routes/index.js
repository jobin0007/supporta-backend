const express = require('express')
const authRoutes = require('./authRoutes');
const brandRoutes = require('./brandRoutes');
const productRoutes = require('./productRoute');
const blockRoutes = require('./blockRoutes');



const routes = express()


routes.use('/user',authRoutes)
routes.use('/brand',brandRoutes);
routes.use('/product', productRoutes);
routes.use('/block', blockRoutes);






module.exports = routes