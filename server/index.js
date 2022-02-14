require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@flynn.apbru.mongodb.net/Flynn?retryWrites=true&w=majority`, {
            // useCreateIndex: true, Not supported
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false Not supported
        })

        console.log('Mongoose Db connected')
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

connectDB();

const app = express();
app.use(express.json());

// auth
app.use('/api/auth', authRouter);

// category
app.use('/api/category', categoryRouter);

// product
app.use('/api/product', productRouter);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))