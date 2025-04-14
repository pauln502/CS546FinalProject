import bycrypt from 'btcryptjs';

const userPasswordHash = async (plainTextPassword) => {
  
  plainTextPassword = trimStr(plainTextPassword);

  const saltRounds = 16;
  const hash = await brypt.hash(plainTextPassword, saltRounds);
  return hash;
}

const userPasswordCompare = async (inputPassword, hash) => {
  
  inputPassword = trimStr(inputPassword);

  const comparePassword = await bcrypt.compare(inputPassword, hash);
  return comparePassword;
}

const dataExists = (data, variable) => {
  if(data == undefined) {
    throw `${variable} does not exists.`
  }
}

const isDataString = (data, variable) => {
  if (typeof data !== 'string') {
    throw `${variable} must be a string`
  }
}

const isSpaces = (data, variale) => {
  if (data.length === 0) {
    throw `${variable} can't be empty`
  }

  if (data.trim() === '') {
    throw `${variable} can't be spaces`
  }

  if (/\s/.test(data) {
    throw `${variable} can't have spaces`
  }
}

const trimStr = (data) => {
  let trimData = data.trim();
  return trimData;
}

const nameHelper = (data, variable) => {
  isDataString(data, variable);
  isSpaces(data, variable);
  data = trimStr(data);

  if (/\d/.test(data) {
    throw `${variable} can't have numbers`
  }

  if (data.length > 2 && data.length <= 25) {
    return data;
  } else {
    throw `${variable} has to be more than 2 characters long, with a max of 25`
  }
}

const emailHelper = (data, variable) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  data = trimStr(data);
  data = data.toLowerCase();

  if (regex.test(data)) {
    return data;
  } else {
    throw `${variable} must be in the example@example.com format`
  }
}

const passwordHelper = (data, variable) => {
  isDataString(data, variable);
  isSpaces(data, variable);

  data = trimStr(data);

  if (data.length < 8) {
    throw 'Password must be 8 characters long'
  }

  if (!/[A-Z]/.test(data)) {
    throw 'Password must contain at least one upper case letter'
  }

  if (!/\d/.test(data)) {
    throw 'Password must contain at least one number'
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\\[\];'/`~]]/) {
    throw 'Password must contain at leas one special character'
  }

  return data;
}

const restrictionsHelper = (data, variable) => {
  data = trimSt(data);
  data = data.toLowerCase();

  if (
      data === 'lactose' ||
      data === 'gluten' ||
      data === 'vegetarian' ||
      data === 'vegan' ||
      data === 'kosher' ||
      data === 'keto' ||
      data === 'diabetes' ||
      data === 'dairyfree' ||
      data === 'lowcarb' ||
  ) {
    return data;
  } else if (data === 'foodalergy') {
    return false; 
  }
}

const roleHelper = (data) => {
  data = trimStr(data);
  data = data.toLowerCase();

  if (data === 'admin' || data === 'user') {
    return data;
  } else {
    throw 'Role must be either an admin or user'
  }
}

const validationFuncs = {
  userPasswordHash, 
  userPasswordCompare,
  dataExists, 
  nameHelper,
  emailHelper,
  passwordHelper,
  roleHelper
};

export default validationfuncs;
