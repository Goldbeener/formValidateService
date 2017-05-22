appService.service('validator',function(){
     //策略对象
       const strategies = {
           isNonEmpty(value,errorMsg){
              return value === '' ? errorMsg : void 0;
           },
           minLength(value,length,errorMsg){
              return value.length < length ? errorMsg : void 0;
           },
           isMobile(value,errorMsg){
              return !/^1(3|5|7|8|9)[0-9]{9}$/.test(value) ? errorMsg : void 0;
           },
           isEmail(value,errorMsg){
              return !/^\w+([+-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) ? errorMsg : void 0;
           }
       };
       //validator 类
       class Validator {
           constructor (){
               this.cache = [];
           }
        //    add(json){
        //         for(var name in json){
        //             let dom = json[name][0];
        //             let rules = json[name][1];

        //             for(let rule of rules){
        //                 let strategyAry = rule.strategy.split(':');
        //                 let errorMsg = rule.errorMsg;
        //                 this.cache.push(() => {
        //                     let strategy = strategyAry.shift();//得到'isNonEmpty' || 'minLength'...
        //                     strategyAry.unshift(dom);  //传值  value，
        //                     strategyAry.push(errorMsg); //传值   errMsg
        //                     return strategies[strategy].apply(dom,strategyAry);
        //                 })
        //             }
        //         }
                
        //    }
           add(arr){
                for(var i = 0; i < arr.length; i+=2){
                    let dom = arr[i];
                    let rules = arr[i+1];

                    for(let rule of rules){
                        let strategyAry = rule.strategy.split(':');
                        let errorMsg = rule.errorMsg;
                        this.cache.push(() => {
                            let strategy = strategyAry.shift();//得到'isNonEmpty' || 'minLength'...
                            strategyAry.unshift(dom);  //传值  value，
                            strategyAry.push(errorMsg); //传值   errMsg
                            return strategies[strategy].apply(dom,strategyAry);
                        })
                    }
                    
                }
           }
           start(){
               for(let validatorFunc of this.cache){
                    let errorMsg = validatorFunc();
                    if(errorMsg){
                        return errorMsg;
                    }
               }
           }
       }
       //this.validate = new Validator();
       return Validator;
});


//usage
/*
1: 作为依赖注入
2：定义验证方法：
    1)：实例化注入对象；
    2)：调用add方法配置校验项
    3): 调用start方法开始校验各项；
    4): 返回start方法返回值；
3：判定校验方法返回值；为空则校验通过；有值那么校验失败，返回值就是错误提示信息；

//add方法用例
validate.add(json);

json = {
    key1：[dom,[
        {
            strategy: 'isNonEmpty'
            errorMsg: '非空'
        },
        {
            strategy: 'minLength: 8'
            errorMsg: '最小长度8位'
        }
    ]]
    key2：[dom,strategies]
    key3：[dom,strategies]
}

//start方法
validate.start（）  返回值是错误提醒信息；校验通过则返回空；


*/