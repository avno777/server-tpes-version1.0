// export const userLogin = async (username, password) => {
//   const userinfo = await user.findOne({
//     UserName: new RegExp("^" + username + "$", "i"),
//   });

//   if (!userinfo || !verifyPassword(password, userinfo.Password)) {
//     throw new Error("Authentication failed");
//   }

//   // Biến lưu trữ tên cơ sở dữ liệu mà người dùng sẽ kết nối
//   let targetDbName;

//   if (userinfo.Role === "Admin") {
//     targetDbName = userinfo.DataBaseName; // Cơ sở dữ liệu mặc định của Admin

//     // ... Bạn có thể thêm logic để lấy danh sách các người dùng Cấp độ 2 và cơ sở dữ liệu của họ nếu cần thiết
//   } else if (userinfo.Role === "Level2") {
//     const school = await user.findOne({
//       UserName: { $in: userinfo.organization },
//     });

//     if (!school) {
//       throw new Error("Organization not found");
//     }

//     targetDbName = school.DataBaseName; // Cơ sở dữ liệu được gán cho người dùng Cấp độ 2
//   } else {
//     throw new Error("Unknown user role");
//   }

//   // Tạo JWT và lưu trữ thông tin cần thiết
//   const jwtResult = await getJWTResult(username, userinfo.Role, targetDbName);
//   await storeDataInRedisServer(jwtResult);

//   return jwtResult;
// };

export const userLogin = async (username, password) => {
  const userinfo = await user.findOne({
    UserName: new RegExp("^" + username + "$", "i"),
  });
  if (!userinfo || !verifyPassword(password, userinfo.Password)) {
    throw new Error("Authentication failed");
  }

  let jwtPayload = {
    username: userinfo.UserName,
    role: userinfo.Role,
    dbName: userinfo.DataBaseName,
  };

  if (userinfo.Role === "Admin" || userinfo.Role === "Level1") {
    const level2Users = await user.find({
      UserName: { $in: userinfo.createdUsers },
    });
    const level2DbNames = level2Users.map((u) => u.DataBaseName);
    jwtPayload.level2Databases = level2DbNames;
  }

  const jwtResult = await getJWTResult(jwtPayload);
  await storeDataInRedisServer(jwtResult);

  return {
    jwt: jwtResult,
    level2Databases: jwtPayload.level2Databases, // chỉ trả về cho Admin và Level1
  };
};

const determineDatabase = (req, res, next) => {
  const jwt = req.headers.authorization; // hoặc dựa vào phương thức bạn sử dụng để truyền JWT
  const decoded = verifyJWT(jwt);

  if (!decoded.dbName) {
    return res.status(403).send("No database access");
  }

  // Thiết lập kết nối cơ sở dữ liệu dựa trên dbName
  const dbConnection = connectToDatabase(decoded.dbName);
  req.dbConnection = dbConnection;

  next();
};

const connectToDatabase = (dbName) => {
  // Sử dụng mongoose hoặc bất kỳ thư viện kết nối cơ sở dữ liệu nào khác để kết nối đến dbName
  return mongoose.connect(`yourConnectionString/${dbName}`);
};
