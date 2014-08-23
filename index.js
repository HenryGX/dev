var server=  require ("./control/server");
var route=  require ("./control/router");
var requestHandle= require("./control/requestHandlers");

//构建路由映射表     a
var handle={};
handle["/"]=  requestHandle.start;
handle["/start"] = requestHandle.start;
handle["/upload"] = requestHandle.upload;

server.start(route.route,handle);