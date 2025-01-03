exports.getNotFound = (req, res) => {
    res.status(404).render("not-found", {
        path: "/not-found",
        pageTitle: "Page Not Found"
    });
}

exports.get500 = (req, res) => {
    res.status(500).render("500", {
        path: "/500",
        pageTitle: "Internal Server Error",
        isAuthenticated: req.session.isAuthenticated
    });
}