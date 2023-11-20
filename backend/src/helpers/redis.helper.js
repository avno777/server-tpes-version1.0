function storeDataInRedisServer(jwtResult, redisClient, callback) {
  const testredisData = {
    accessToken: jwtResult.accessToken,
    Permission: ["Update", "get all school record"].toString(),
  };
  jwtResult.organization.forEach((Obj) => {
    testredisData[Obj] = false;
  });
  redisClient.HMSET(jwtResult.accessToken, testredisData);
  callback(true);
}

export { storeDataInRedisServer };
