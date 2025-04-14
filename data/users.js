import {users} from '../config/mongoCollections.js';
import validationFuncs from '../validation.js';
import {ObjectId} from 'mongodb';

export const createUser = async(
    firstName,
    lastName,
    emailAddress,
    userName,
    password,
    role) => {

    firstName = validationFuncs.nameHelper(firstName, 'First name');
    lastName = validationFuncs.nameHelper(lastName, 'Last name');
    emailAddress = validationFuncs.emailHelper(emailAddress, 'Email');
    userName = validationFuncs.nameHelper(userName, 'Username');
    restrictions = validationFuncs.restrictionsHelper(restrictions, 'restrictions');
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
    
    emailAddress = validationFuncs.emailHelper(emailAddress, 'Email');
    password = validationFuncs.passwordHelper(password, 'Password');

    let userLogin = {
        emailAddress,
        password
    };

    if (Object.keys(userLogin) === 0) {
        throw 'Both email and password must be provided'
    }

    const userCollection = await users();
    const userFound = await userCollection.findOne(
        {emailAddress: emailAddress}
    );

    if (!userFound) {
        throw 'Either the email address or password is invalid'
    }

    const passwordCheck = await validationFuncs.userPasswordCompare(password, userFound.password);

    const userChecked = {
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        userName: userFound.userName,
        emailAddress: userFound.emailAddress,
        role: userFound.role
    };

    if (passwordCheck) {
        return userChecked;
    } else {
        return false;
    }
};


//To be used only by admin
const getAllUsers = async() => {

    const userCollection = await users();
    let userList = await userCollection.find({}).toArray();

    if (!userList) {
        throw 'No user in data base, or could not find user list'
    }

    userList = userList.map((users) => {
        users._id = users._id.toString();
        return users;
    });
};

const getUserById = async(userId) => {

    validationFuncs.dataExists(userId, 'User ID');
    validationFuncs.isDataString(userId, 'User ID');
    validationFuncs.isSpaces(userId, 'User ID');
    userId = validationFuncs.trimStr(userId);

    validationFuncs.isObjId(userId, 'User ID');

    const userCollection = await users();
    const user = await userCollection.fincOne(
        {_id: new ObjectId(userId)}
    );

    if (user === null) {
        throw `No user with ID: ${userId}`
    }

    user._id = user._id.toString();

    return user;
};


//Can be used for the user or admin to delete their account
//Admin can delete any user

const deleteUserById = async(userId) => {
    validationFuncs.dataExists(userId);
    validationFuncs.isDataString(userId);
    validationFuncs.isSpaces(userId);
    userId = trimStr(userId);

    if (!/^[a-z0-9-]+$/.test(movieId)) {
        throw 'ID must have only lowercase characters, and numbers'
    }

    validationFuncs.isObjId(userId);

    const userCollection = await users();
    const deletedUser = await userCollection.findOneAndDelete(
        {_id: new ObjectId(userId)}
    );

    if (!deletedUser) {
        throw `Could not delete user with ID: ${userId}`
    } else {
        throw `Account deleted, ID: ${userId}`
    }
};  

//user to update info like first, last and user name, etc.
const updateUser = async() => {
    //TODO: implement updateUser
};

const userFunctions = {
    createUser,
    loginUser,
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUser
};

export default userFunctions;
