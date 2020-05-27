const utils =  {
//对象封装，以下都是

/**
 * 
 * 
 */

getStyle :function  (obj, attr) {
  if (obj.currentStyle) {
    // 判断Obj有currentStyle这个属性，说明使用的是IE浏览器
    return obj.currentStyle[attr]
  } else {
    // obj没有currentStyle这个属性，说明用的不是IE
    return getComputedStyle(obj, false)[attr]
  }
},

/**
 * 添加事件监听
 * @param ele         <DOMObject> 添加事件的DOM元素
 * @param type        <string>    事件类型（不带on）
 * @param fn          <function>  事件处理函数
 * @param [isCapture] <boolean>   可选参数，是否捕获，true代表捕获，false代表冒泡，默认为false
 */
on:function  (ele, type, fn, isCapture) {
  // 如果参数没有传，默认值为false
  if (isCapture === undefined) isCapture = false
  if (ele.attachEvent) {
    // IE
    ele.attachEvent('on' + type, fn)
  } else {
    ele.addEventListener(type, fn, isCapture)
  }
},

/**
 * 移出事件监听
 * @param ele         <DOMObject> 添加事件的DOM元素
 * @param type        <string>    事件类型（不带on）
 * @param fn          <function>  事件处理函数
 * @param [isCapture] <boolean>   可选参数，是否捕获，true代表捕获，false代表冒泡，默认为false
 */
 off :function (ele, type, fn, isCapture) {
  // 如果参数没有传，默认值为false
  if (isCapture === undefined) isCapture = false
  if (ele.detachEvent) {
    ele.detachEvent('on' + type, fn)
  } else {
    ele.removeEventListener(type, fn, isCapture)
  }
},
  
   /**
    * 封装匀速运动
    * @param   ele  《domobject》 要运动的元素对象
    * @param   attr 《string》    运动的属性名
    * @param   end  《number》    运动的终点，单位px
    * @param   duration 《number》运动的总时长，单位是ms
    * @param   fn    《function》  回调函数，在运动结束
    */
  move: function(ele,attr,end,duration,fn){
    //获取起点  
    var start = parseInt(this.getStyle(ele,attr)) 
    //算总距离
    var distance = end - start
    //先计算从起点到终点的总步数
    var steps = Math.floor(duration/30)
    //计算每一步要走的像素值
    var speed = distance/steps

    var n = 0 //记录当前是第几步
    //开启新的定时器之前清楚上一次的
    clearInterval(ele.timer)
     ele.timer = setInterval(function(){
      n++
       ele.style[attr] = start + n * speed + 'px'
       //判断终点
       if(n === steps){
         clearInterval(ele.timer)
         ele.style[attr] = end +'px'
         //逻辑短路 前面不执行 后面不执行判断fn是否有效
         fn && fn()

       }
    },30)
  },
  /**
   * 封装一个缓冲运动，
   * @param   ele  《domobject》 要运动的元素对象
   * @param   attr 《string》    运动的属性名
   * @param   end  《number》    运动的终点，单位px
   * @param   fn    《function》  回调函数，在运动结束
   * 
   *  */ 

  move1 : function (ele,attr,end,fn){
    clearInterval(ele.timer)
    var start = parseInt(this.getStyle(ele,attr))
    ele.timer =  setInterval(function(){
      //计算剩下距离
      var distance = parseInt(end)  - start
      //计算当前这一步的速度，是剩下距离的十分之一
      //speed就是当前这一步要往前走的距离
      //如果运动是负方向，distance 小于0，speed也小于0，负数向下取整，正数向上取整
      var speed = distance>0? Math.ceil(distance /10 ):Math.floor(distance /10 )

      //走完一步之后start需要往前加
      start += speed
      //把更新之后的start值赋值给属性
      ele.style[attr] = start +'px'
      //判断终点
      if (start === end){
         clearInterval(ele.timer)
         fn && fn()
      }

    },30) 
  },
  /** 取cookie
   * @param key  要取cookie的名称
   * @return    返回的这条cookie的值
   * * */
  getCookie (key) {
    //取到所有cookie
    var str = document.cookie
    //先按照; 来切开每一条cookie
    var arr = str.split('; ')
   // console.log(arr);
    //按照=来切割
    var obj = {}
    arr.forEach((item)=>{
      var subArr = item.split('=')
      //suArr0元素是属性名，1元素是属性值
     // console.log(subArr);
      //subArr,这里不能用点，只能用中括号
      //subArr[1]是编码之后的属性值，
      obj[subArr[0]] = decodeURIComponent( subArr[1])

    })
    console.log(obj);
    return obj[key]

  },
  /** 存cookie
   * @param key       <siring>  cookie 的名称
   * @param value    《siring》 cookie的值
   * @param  [options] 《object》path 和expires参数，
   * 例如{path：‘/’，expires；7} ，意思是7天存根目录过期
    */
  setCookie (key, value,options) {
    //给value一个中文编码在存
    var str = `${key} = ${encodeURIComponent(value)}`
    if(options){
      //先判断options是否传递了
      if(options.path){
        str +=`;path = ${options.path}`
      }
      if(options.expires){
        var date = new Date()
        //日期设置为过期时间
        date.setDate(date.setDate()+options.expires)
        str +=`;expires=${date.toUTCString()}`

      }
    }  
    document.cookie = str

  },
  /**
   * ajax get请求
   * @param url    <string>   请求的路径
   * @param query  <object>   请求要携带的参数
   * @param fn     <function> 请求成功之后返回的函数
   * @param [isjson] 《boolean》 请求返回的数据是否是json格式，默认为true
   */
  get (url,quney,fn ,isjson = true){
    
    //isjson = true 为es6新语法  默认为true，可以传参改值
    //如果有参数把url上的参数拼接上去
    if(quney){
      url +='?'
      //遍历quney，把每一个属性都拼接到url后面去
      for(var key in quney){
        url +=`${key}=${quney[key]}&`
      }
      //拼接完成以后多出一个&
      //// 从0开始截取到倒数第一个结束，只保留了除最后一个&以外的字符串
      url = url.slice(0 , -1)
    }
    var xhr = new XMLHttpRequest()
    xhr.open('get',url)
    xhr.send()
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
        if(xhr.status == 200){
          //请求成功之后，把后端数据传过去
          var data = isjson? JSON.parse(xhr.responseText):xhr.responseText
          fn&&fn(data)
        }
      }

    }
  },
  /**
   * ajax post请求
   * @param url    <string>   请求的路径
   * @param query  <object>   请求要携带的参数
   * @param fn     <function> 请求成功之后返回的函数
   * @param [isjson] 《boolean》 请求返回的数据是否是json格式，默认为true
   */
  post (url,quney,fn ,isjson = true){
    var str = ''
    if(quney){
      for(var key in quney){
        str+=`${key}=${quney[key]}&`
      }
      str = str.slice(0,-1)
    }
    var xhr = new XMLHttpRequest()
    xhr.open('post',url)
    //post 请求参数在请求体里，所以要在send里传参，格式要自己设置
    //设置请求头的格式，如果有多个参数用&链接
    xhr.setRequestHeader("Conten-type","application/x-www-form-urlencoded")
    xhr.send(str)
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4)
      if(xhr.status === 200){
        var data = isjson? JSON.parse(xhr.responseText):xhr.responseText
        fn&&fn(data)
      }
    }

  }
}

