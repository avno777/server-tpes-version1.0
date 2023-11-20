import jwt from "jsonwebtoken";
import config from "../config.mjs";
import Q from "q";

// Generate a JWT token
function getJWT(userId, DataBaseName) {
  const accessToken = jwt.sign(
    {
      UserName: userId,
      CName: DataBaseName,
      Permission: ["update", "get all school record", "delete"],
    },
    config.secret,
    {
      algorithm: "HS256",
      issuer: config.issuer,
    }
  );
  return accessToken;
}

// Create a JWT response object
function buildJWTResponse(userId, roles, DataBaseName, organization) {
  return {
    user: userId,
    roles,
    organization,
    accessToken: getJWT(userId, DataBaseName),
    iss: "Keo plus LMS",
    iat: new Date(),
  };
}
function getJWTResponse(userId, roles, DataBaseName, organization, callback) {
  const JWTResponseObject = buildJWTResponse(
    userId,
    roles,
    DataBaseName,
    organization
  );
  callback(null, JWTResponseObject);
}

function getJWTResult(username, role, dataBaseName, organization) {
  const deferred = Q.defer();
  getJWTResponse(
    username,
    role,
    dataBaseName,
    organization,
    (err, JWTResponse) => {
      if (err) {
        deferred.reject(err);
      }
      if (JWTResponse) {
        deferred.resolve(JWTResponse);
      } else {
        deferred.reject();
      }
    }
  );
  return deferred.promise;
}

export { getJWT, buildJWTResponse, getJWTResult, getJWTResponse };
