const jwt = require("jsonwebtoken");

const Authentication = async (req, res, next) => {
  try {
    let tmp = req.header("Authorization");
    const token = tmp && tmp.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not authorized, please login" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, decode) => {
      if (error) {
        return res.status(400).json({ message: "Not authorized, please login" });
      } else {
        req.userId = decode['data'];
        next();
      }
    });
  } catch (error) {
    return res.status(400).json({ message: "something went wrong" });
  }
};

module.exports = Authentication;




// const jwt = require("jsonwebtoken");



// const Authentication = async (req, res, next) => {
//   try {
//     // let tmp = req.headers("Authorization");
//     // const token = tmp && tmp.split(" ")[1];
//      const token = req.headers.authorization;
    
//     if (!token) {
//       res.status(401).json({ message: "Not authorized, please login" });
//     }
//     jwt.verify(token, process.env.SECRET_KEY, (error, decode) => {
//       if (error) {
//         res.status(400).json({ message: "Not authorized, please login" });
//       } else {
//         req.userId = decode['data'];
//         // console.log(req.userId)
//         next();
//       }
//     });
//   } catch (error) {
//     res.status(400).json({ message: "sometime went wrong" });
//   }
// };

// module.exports = Authentication;
