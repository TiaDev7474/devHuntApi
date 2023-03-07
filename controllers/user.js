const bcrypt = require('bcrypt')

exports.login = async (req, res) => {
    const { email, password } = req.body

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(valid => {
                        const token = jwt.sign({
                            userid: user._id,

                        })
                        res.status(201).json({
                            user: {
                                id: user._id,
                                isAdmin: user.isAdmin,
                            },
                            token: token
                        })
                    })
                    .catch(err => res.status(401).json({ message: "pair email / password incorrect!!" }))



            }
        })
        .catch(err => res.status(500).json({ message: err }))
}