/**
 * Created by 刘爱陈 on 2017/5/10.
 */
var Mock=require("mockjs");
var url =require("url");
     exports.data=function(){
        return [
            {
                route:"/index",
                //res 请求头
                //req 请求的数据
                //res 请求头是模拟的后台数据返回告诉浏览器返回数据头
                // 没有头的话 数据出不来
                handle:function(req,res,next){
                    res.writeHead(200,{
                        "Content-Type":"application/json;charset=utf-8",
                        "Access-Control-Allow-Origin":"*"//允许所有主机访问
                    })
                     /*var data={
                        name:"liu",
                        age:2234,
                        address:"beijing"
                    }*/
                    var data = Mock.mock({
                        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
                        'list|1-10': [{
                            // 属性 id 是一个自增数，起始值为 1，每次增 1
                            'id|+1': 1,
                            'index': "222",
                            'name': "我最帅"
                        }]
                    })
                // 输出结果
                    console.log(JSON.stringify(data, null, 4))
                    res.write(JSON.stringify(data))
                    res.end()
                }
            }
        ]
    }