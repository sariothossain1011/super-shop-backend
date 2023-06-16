const app = require("./app")

const PORT =  process.env.PORT || 8081 ;

app.listen(PORT,()=>{
    console.log(`Server is runing at http://localhost:${PORT}`)
})