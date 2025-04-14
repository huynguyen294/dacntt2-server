//[PATCH] /users/:id
export const updateUser = async (req, res) => {};

//[GET] /users/check-email/:email
export const checkUserByEMail = async (req, res) => {};

//[POST] /users/compare-password
export const compareUserPassword = async (req, res) => {};

//[GET] /users/forgot-password/:email
export const forgotPassword = async (req, res) => {};

//[GET] /users/verify-reset-password-code/:email/:code
export const verifyResetPasswordCode = async (req, res) => {};

//[PATCH] /users/reset-password/:email
export const resetPassword = async (req, res) => {};
