import { default as bcrypt } from 'bcryptjs'
import { default as jwt } from 'jsonwebtoken';
import { UserInputError } from 'apollo-server';

import { validateRegisterInput, validateLoginInput, validateEditUserInput } from '../../util/Validator.js';
import { User } from '../../Models/User.js';
import { config } from '../../config.js';
const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin
    },
        config.jwtSecret,
        { expiresIn: '1h' });
}
export const userResolvers = {
    Query: {
        getUsers: async () => {
            try {
                const users = await User.find().sort({ createdAt: -1 });
                return users;
            } catch (err) {
                throw new Error(err)
            };
        },
    },
    Mutation: {
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);
            const user = await User.findOne({ username })
            if (!valid) {
                throw new UserInputError('Errors.', { errors });
            }
            if (!user) {
                errors.generals = 'User is not found.';
                throw new UserInputError('User is not found.', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.generals = 'Wrong credentials.';
                throw new UserInputError('Wrong credentials.', { errors });
            }

            const token = generateToken(user)

            return {
                ...user._doc,
                id: user._id,
                ...user.isAdmin,
                token
            }
        },
        async register(_, {
            registerInput: {
                username,
                email,
                password,
                confirmPassword,
                isAdmin
            }
        }) {
            // Validate user data.
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid) {
                throw new UserInputError('errors', { errors });
            }
            // Validate username/email is unique.
            const user = await User.findOne({ username });
            // const vEmail = await User.findOne({ email });
            if (user) {
                throw new UserInputError('This username is taken.', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }
            password = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
                isAdmin
            });
            const res = await newUser.save();

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                ...res.isAdmin,
                token
            }
        },
        async editUser(_, 
            {editUserInput: {
                id,
                username,
                email,
                password,
                confirmPassword,
                isAdmin
            }}) {
                const { valid, errors } = validateEditUserInput(username, email, password, confirmPassword)
                if (!valid) {
                    throw new UserInputError('errors', { errors });
                }
                const user = await User.findByIdAndUpdate(id, {
                    id,
                    username,
                    email,
                    password,
                    confirmPassword,
                    isAdmin
                }, { new: true });

                return {
                    ...user._doc,
                    id: user._id,
                    ...user.isAdmin,
                }
            }
    }
};