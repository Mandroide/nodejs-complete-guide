exports.getLogin = (req, res) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.isAuthenticated
    });
};

exports.postLogin = (req, res) => {
    res.cookie("isAuthenticated", true);
    res.cookie("Max-Age", 10);
    res.redirect('/');
};