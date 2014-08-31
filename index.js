var server = require("./control/server");
var route = require("./control/router");
var requestHandle = require("./control/requestHandlers");

//构建路由映射表
var handle = {};
handle["/"] = requestHandle.start;
handle["/start"] = requestHandle.start;
handle["/upload"] = requestHandle.upload;
handle["/show"] = requestHandle.show;
handle["/make_fiel"] = requestHandle.make_fiel;
handle["/download_img"] = requestHandle.download_img;
handle["/event"] = requestHandle.event;
//开启服务器  a
server.start(route.route, handle);