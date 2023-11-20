const configObject = {
  issuer: "TPES",
  secret: "a sercret password",
  jwtExpiresOn: 86400,
  jwtExpiredAt: 1,
  redisDB: {
    DBHOST: "127.0.0.1",
    DBPORT: "6379",
  },
};

export default configObject;
