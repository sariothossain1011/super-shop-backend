const jwt = require("jsonwebtoken");

exports.CreateToken = async (data) => {
  // console.log(data._id)
  let Payload = {
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    data: data._id,
  };
  return await jwt.sign(Payload, process.env.SECRET_KEY);
};
