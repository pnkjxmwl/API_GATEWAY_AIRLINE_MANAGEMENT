const express= require('express')
const morgan = require('morgan')
const { createProxyMiddleware} =require('http-proxy-middleware')
const { rateLimit } = require('express-rate-limit')
const axios= require('axios')
const e = require('express')
const app =express()

const PORT= 3005

const limiter=  rateLimit({
    windowMs:2*60*1000,
    max:5
})

app.use(morgan("combined"))
app.use(limiter)
app.use('/bookingservice', async (req,resp,next)=>{
        //console.log('hi');
          //console.log(req.header('x-access-token'));  
          try {

            const response= await axios.get('http://localhost:3001/api/v1/isAuthenticated',{
                headers:{
                    'x-access-token':req.header('x-access-token')
                }
            })  
            
            console.log(response.data);
            if(response.data.success)
                next()
            else 
            {
                throw {error:'token is not valid'}
            }
          } catch (error) {
            resp.status(401).json({
                err: {error},
                message:'unauthorized'
            })
          }
       
})
app.use('/bookingservice',createProxyMiddleware({target:'http://localhost:3002/',changeOrigin:true}))
app.get('/home',(req,resp)=>{
    return resp.json({
        message:'ok'
    })
})

app.listen(PORT,()=>{
    
    console.log('server statrted at port',PORT);

})