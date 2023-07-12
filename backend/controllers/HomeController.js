

const home = (req, res) => {
    try {
        res.send("WELCOME TO Att- System BACKEND")
    } catch (err) {
        res.send({
            status: false,
            msg: "Internal Server error",
            error: err
        })
    }
}

const HomeController = {
    home
}

module.exports = HomeController