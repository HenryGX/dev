var http= require ("http");
var url= require ("url");

//处理模块定义
function startgo(route,handle){
    //服务器创建过程的回掉函数，也是程序的入口
    function onRequest(request,response){
        var postData ="";
        var pathname=url.parse(request.url).pathname;
        if(pathname!="/favicon.ico"){
            var date = new Date();
            var seperator1 = "-";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            console.log("["+(date.getYear() + seperator1 + month + seperator1 + strDate)+"]REQUEST "+pathname);
        }
        //调用路由模块，执行路由模块中的方法


        request.setEncoding("utf8");

        request.addListener("data",function(postDataChunk){
            postData += postDataChunk;
            console.log("Received POST data chunk '"+
                postDataChunk +"'.");
        });

        request.addListener("end",function(){
            route(pathname,handle,response,postData);
        });
    }
    //创建服务器
    http.createServer(onRequest).listen(8000);

    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    console.log("["+(date.getYear() + seperator1 + month + seperator1 + strDate)+"]The server has started!");
}

/**
 *导出start方法为一个自定义包，
 *第一个start是方法名，这个模块的对象可以调用start方法
 *第二个go是对应处理模块名字
 * */
 exports.start = startgo;