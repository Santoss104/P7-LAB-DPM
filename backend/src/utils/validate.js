const validateRegistration = (data) => {
    const errors = {};
    if (!data.username || data.username.trim() === '') {
      errors.username = 'Username is required';
    }
    if (!data.password || data.password.trim() === '') {
      errors.password = 'Password is required';
    }
    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email is required';
    }
    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  };
  
  const validateLogin = (data) => {
    const errors = {};
    if (!data.username || data.username.trim() === '') {
      errors.username = 'Username is required';
    }
    if (!data.password || data.password.trim() === '') {
      errors.password = 'Password is required';
    }
    return {
      errors,
      isValid: Object.keys(errors).length === 0,
    };
  };
  
  module.exports = {
    validateRegistration,
    validateLogin,
  };