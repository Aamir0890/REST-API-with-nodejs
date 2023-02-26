require ('dotenv').config()
require('express-async-errors')
const express=require('express')

const app=express();

const connectDB=require('./db/connect')

const productsRouter=require('./routes/products')

const notFoundMiddleware=require('./middleware/not-found')
const errorMiddleware=require('./middleware/error-handler')


app.get('/',(req,res)=>{
    res.send('<h1>Store ApI</h1><a href="/api/v1/products">product routes</a>')
})

app.use('/api/v1/products',productsRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

//Manually setting up the port
const port=process.env.PORT ||3000


const start=async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
       app.listen(port,console.log(`Server is listening on port ${port}...`))
    }
    catch(err){
    console.log(err)
    }
}

start();