const User = require('../models/user');
const Redis = require('../middleware/redisClient');

module.exports = {
    findAll: function (request, response) {
        Redis.client.scan("0").then(keys => {
            if (keys.keys.length === 0) {
                User.find({}).exec()
                    .then(users => {
                        users.forEach(
                            user => {
                                const userId = user._id.toString();
                                const userData = JSON.stringify(user);
                                Redis.addNewData(userId, userData);
                            }
                        );
                        response.json(users);
                    })
                    .catch(err => {
                        console.error(err);
                        response.status(500).send('Internal Server Error');
                    });
            }
            else {
                var userList = [];
                Promise.all(
                    keys.keys.map(key => {
                        return Redis.client.get(key)
                            .then(user => {
                                const userParse = JSON.parse(user);
                                userList.push(userParse);
                            })
                            .catch(error => {
                                console.error(`Error fetching user for key ${key}: ${error}`);
                            });
                    })
                )
                    .then(() => {
                        console.log("Retrieved user data from Redis:", userList);
                        response.json(userList);
                    })
                    .catch(error => {
                        console.error(error);
                        response.status(500).send('Internal Server Error');
                    });
            }
        }).catch(err => {
            console.error(err);
            response.status(500).send('Internal Server Error');
        });
    },

    save: function (request, response) {
        const { userName, accountNumber, emailAddress, identityNumber } = request.body;
        const user = new User({
            userName,
            accountNumber,
            emailAddress,
            identityNumber
        });

        user.save().then(savedUser => {
            const userId = savedUser._id.toString();
            const userData = JSON.stringify(savedUser);
            Redis.addNewData(userId, userData);
            response.status(201).json(savedUser);
            console.log("User saved successfully");
        }).catch(error => {
            console.error(error);
            response.status(500).send('Internal Server Error');
        });
    },

    updateById: function (request, response) {
        const userId = request.params.id;
        const updatedData = request.body;
        User.findByIdAndUpdate(userId, updatedData, { new: true }).exec()
            .then(updatedUser => {
                if (!updatedUser) {
                    response.status(404).send('User not found');
                } else {
                    Redis.flushAll();
                    response.json(updatedUser);
                    console.log("User updated successfully");
                }
            })
            .catch(error => {
                console.error(error);
                response.status(500).send('Internal Server Error');
            });
    },

    deleteById: function (request, response) {
        const userId = request.params.id;
        User.findByIdAndRemove(userId).exec()
            .then(deletedUser => {
                if (!deletedUser) response.status(404).send('User not found');
                else {
                    Redis.flushAll();
                    response.json(deletedUser);
                }
            })
            .catch(error => {
                console.error(error);
                response.status(500).send('Internal Server Error');
            });
    },

    findById: function (request, response) {
        const userId = request.params.id;
        Redis.client.get(userId).then(data => {
            if (data === null) {
                User.findById(userId).exec()
                    .then(user => {
                        if (!user) {
                            response.status(404).json({ message: 'User not found' });
                        } else {
                            const userId = user._id.toString();
                            const userData = JSON.stringify(user);
                            Redis.addNewData(userId, userData);
                            response.json(user);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        response.status(500).json({ message: 'Internal Server Error' });
                    });
            }
            else {
                console.log("Retrieved user data from Redis")
                const userData = JSON.parse(data);
                response.json(userData);
            }
        });
    },
    findByAccountNumber: function (request,response) {
        const accountNumber = request.params.accountNumber
        User.findOne({ accountNumber: accountNumber }).exec()
            .then(user => {
                if (!user) {
                    console.log('User not found');
                    response.status(404).send('User not found');
                } else {
                    console.log('Found user:', user);
                    response.json(user)
                }
            })
            .catch(error => {
                console.error('Error searching for user:', error);
                response.status(500).send('Internal Server Error');
            })
    },

    findByIdentityNumber:function (request, response){
        const identityNumber = request.params.identityNumber
        User.findOne({ identityNumber: identityNumber }).exec()
            .then(user => {
                if (!user) {
                    console.log('User not found');
                    response.status(404).send('User not found');
                } else {
                    console.log('Found user:', user);
                    response.json(user)
                }
            })
            .catch(error => {
                console.error('Error searching for user:', error);
                response.status(500).send('Internal Server Error');
            })
    }
};
