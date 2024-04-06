const catchAsync = require("./Utils/catchAsync");
const User = require('./models/user');
const Product = require('./models/product');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
// Assuming 'catchAsync' is a function defined elsewhere
// User must be an admin
module.exports.Isadmin = (req, res, next) => {
        const  user = req.user;
        // IF THE SER.ROLE IS ADMIN
        if(user && user.role === "Admin"){
            console.log(`User ${user.name} is authorized.`);
            return next()
        } else {
            req.flash('error','Only admins can perform this action')
          return res.redirect("/products");
          
          }
      };
    

      module.exports.isSeller = async (req, res, next) => {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product.seller.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!');
            return res.redirect(`/products/${id}`);
        }
        next();
    }
//   Checks that the user



    // router.get('/:id/edit',isLoggedIn,IsAdmin, catchAsync( async (req, res) => {
    //     const product = await Product.findById(req.params.id)
    //     res.render('products/edit', {product});
    // }))



