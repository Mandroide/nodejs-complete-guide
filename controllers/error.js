exports.getNotFound = (req, res) => {
    res.status(404).render("not-found", {
        pageTitle: "Page Not Found",
        layout: false,
    });
}