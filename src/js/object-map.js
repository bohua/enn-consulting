define([], function(){
    var objMap = {
        //KPIs
        "开放机会KPI": "UtxwSV",
        "盈率KPI": "qNxx",

        //Charts
        "商机LINECHART": "EjvePwx",
        "盈率BARCHART": "pedJW",
        "行业分类机会前10PIECHART":"MnGpevq",
        "工商户TOP10商机CHART": "jChpUsz",
        "民用户TOP10商机CHART": "ksNkWy",
        "工商户TOP10商机TABLE": "jTWXJ",
        "民用户TOP10商机TABLE": "uGMYdg",
        "商机标题": "ypFzkFN",
        "商机数据": "pzxEh",
        "客户标题": "fyfZge",
        "客户数据": "JpBpmR",

        //Tables
        "商机详情": "JpuzjK",
        "客户详情": "DeyDXd",

        //Variables
        "商机维度变量": "vDimView",
        "行业分类机会签10维度变量": "vPieDimSelector"
    };

    return{
        "getObjByName": function(name){
            return objMap[name];
        }
    }
});