const express = require("express")
const app = express()
const databaseConnection = require("./config/db")
const cors = require("cors")
const subjectRoutes = require("./routes/subject.routes")
const unitRouter = require('./routes/unit.routes')
const authRouter = require('./routes/auth.routes')
const bookmarkRouter = require('./routes/bookmark.routes')
const passport = require("passport")
const cookieParser = require("cookie-parser")

// passport google auth
require("./config/google-auth")
app.use(passport.initialize())



// middlewares
app.use(cookieParser())
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
  })
);

app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.use("/subject", subjectRoutes);
app.use("/unit", unitRouter);
app.use("/auth", authRouter )
app.use("/bookmark", bookmarkRouter)



app.get("/", (req, res)=>{
    if(req.user){
        res.send(user)
    }
})

const PORT = process.env.PORT || 3000
databaseConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log("✅ Server started on port", PORT)
    })
  })
  .catch(err => {
    console.error("❌ Failed to connect to database:", err)
  })