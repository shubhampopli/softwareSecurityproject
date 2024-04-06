const express = require('express');
const path = require('path');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoose = require('mongoose');
const catchAsync = require('./Utils/catchAsync');
const ExpressError = require('./Utils/ExpressError');
const methodOverride = require('method-override');
const productRoutes = require('./routes/products.js');
const userRoutes = require('./routes/users');
const orderRoutes =require('./routes/orderRouter.js')
const bodyParser = require('body-parser');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

mongoose.connect('mongodb+srv://shubham:spopliii_67@cluster0.kej5hm5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
//   useFindAndModify:false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine('ejs', ejsMate)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
// Sanitize user input to prevent MongoDB Operator Injection

// By default, $ and . characters are removed completely from user-supplied input in the following places:
// - req.body
// - req.params
// - req.headers
// - req.query

// To remove data using these defaults:
app.use(mongoSanitize());

// const productSchema = (req, res, next) => {
//     const { error } = productSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

// app.use(helmet({
//     contentSecurityPolicy: false,
// }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    console.log(req.query);
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();

})



app.use("/products",productRoutes)
app.use('/', userRoutes);
app.use('/orders', orderRoutes);


// app.use(mongoSanitize)
// app.get('/', (req, res) => {
//     res.render('home')
// });

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
