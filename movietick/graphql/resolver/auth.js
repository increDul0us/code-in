

const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({
                email: args.userInput.email
            });
            if (existingUser) {
                throw new Error('User exists already.');
            }

            const user = new User({
                email: args.userInput.email,
                password: args.userInput.password
            });

            const result = await user.save();

            return {
                ...result._doc,
                _id: result.id
            };
        } catch (err) {
            throw err;
        }
    },
    login: async ({email,password}) => {
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await User.findOne({
            password: password
        });
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        return {
            userId: user.id,
            email, password
        };
    }
};
