import {users} from '../config/mongoCollections.js';
import validationFuncs from '../validation.js';
import {ObjextId} from 'mongodb';

export const createUser = async(
    firstName,
    lastName,
    emailAddress,
    userName,
    password,
    role) => {

    firstName = validationFuncs.nameHelper(firstName, 'First name');
    lastName = validationFuncs.nameHelper(lastName, 'Last name');
    emailAddress = validationFuncs.emailHelper(emailAddres, 'Email');
    userName = validationFuncs.nameHelper(userName, 'Username');
    restrictions = validation.restrictionsHelper(restrictions, 'restrictions');
    password = validationFuncs.passwordHelper(password, 'Password');
    password = await validationFuncs.userPasswordHash(password);
    role = validationFuncs.roleHelper(role);

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        emailAddress: emailAddress,
        userName: userName,
        reviews: [],
        comments: [],
        restrictions: restrictions,
        password: password,
        role: role
    }

    if (Object.keys(newUser) === 0) {
        throw 'All fields must be filled'
    } 

    const userCollection = await users();
    const checkEmail = await userCollection.findOne(
        {emailAddress: emailAddress}
    );

    if (checkEmail) {
        return {insertedUser: true};
    }
    
    const insertInfo = await userCollection.insertOne(newUser);

    if (!insertInfo.acknowledged || !insertedInfo.insertedId) {
        return {insertedUser: false};
    } else {
        return {insertedUser: true};
    }
};

export const loginUser = async (
    emailAddress, 
    password
) => {
    
    emailAddress = velidationFuncs.emailHelper(emailAddress, 'Email');
    password = validationFunds.passwordHelper(password, 'Password');

    let userLogin = {
        emailAddress,
        password
    };

    if (Object.keys(userLogin) === 0) {
        throw 'Both email and password must be provided'
    }

    const userCollection = await user();
    const userFound = await userColledtion.findOne(
        {emailAddress: emailAddress}
    );

    if (!userFound) {
        throw 'Either the email address or password is invalid'
    }

    const passwordCheck = await validationFuncs.userPasswordCompare(password, userFound.password);

    const userChecked = {
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        emailAddress: userFound.emailAddress,
        role: userFound.role
    };

    if (passwordCheck) {
        return userChecked;
    } else {
        return false;
    }
};

const getAllUsers = async() => {

};

const getUserById = async() => {

};

const deleteUserById = async() => {

};

const updateUser = async() => {

};

const userDataFunctions = {
    createUser,
    loginUser,
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUser
};

export default userDataFunctions;
