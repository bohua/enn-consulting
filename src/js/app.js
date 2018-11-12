/*
 * Basic responsive mashup template
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf("/extensions") + 1);
var config = {
    host: window.location.hostname,
    prefix: prefix,
    port: window.location.port,
    isSecure: window.location.protocol === "https:"
};
require.config({
    baseUrl: (config.isSecure ? "https://" : "http://") + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
});

window.setImmediate = window.setTimeout;

require([
    "js/qlik",
    "jquery",
    "../extensions/qlik-consulting/js/qlik-helper",
    "../extensions/qlik-consulting/lib/onsenui.min"
], function (qlik, $, helper, ons) {
    qlik.setOnError(function (error) {
        $('#popupText').append(error.message + "<br>");
        $('#popup').fadeIn(1000);
    });
    $("#closePopup").click(function () {
        $('#popup').hide();
    });

    //open apps -- inserted here --

    var kpis = {
        "openOpp": null,
        "winRate": null
    };

    var app = helper.getApp();


    //callbacks -- inserted here --
    window.fn = {};
    window.fn.openKpi = function (id) {
        var kpi = kpis[id];

        if (kpi) {
            document.querySelector('#myNavigator').pushPage('page2.html', {data: {title: ''}});


            helper.getChart("商机LINECHART", "QV01", {showTitles: false});
            helper.getChart("盈率BARCHART", "QV02");
            helper.getChart("行业分类机会前10PIECHART", "QV03");

            helper.getVariable("行业分类机会签10维度变量").then(function (model) {
                var val = model.qContent.qString;


                if (val === "BusinessType") {
                    $("#QV03-btn-01").attr("modifier", "cta");
                } else if (val === "BusinessArea") {
                    $("#QV03-btn-02").attr("modifier", "cta");
                }
            });

            helper.getChart("工商户TOP10商机CHART", "QV04");

            setTimeout(function () {
                $("#detailKpi .kpi-title").text(kpi.title);
                $("#detailKpi .kpi-value").text(kpi.value);
                $("#detailKpi .kpi-compare").text(kpi.compare);

                $("#segment-1").off("postchange").on("postchange", function () {
                    window.fn.handleQV01(this.getActiveButtonIndex());
                });

                $("#segment-2").off("postchange").on("postchange", function () {
                    window.fn.handleQV04();
                });

                $("#segment-3").off("postchange").on("postchange", function () {
                    window.fn.handleQV04();
                });
            });
        }
    };

    window.fn.openOpportunity = function () {
        var sels = selState.selections;
        if (sels.length === 1 && sels[0].fieldName === "description" && sels[0].selectedCount === 1) {
            $("#qs-chart-tooltip>div[qva-chart-tooltip]").hide();
            document.querySelector('#myNavigator').pushPage('page3.html', {data: {title: ''}});


            setTimeout(function(){
                console.log(sels[0])
                $(".company-title").text(sels[0].qSelected);

                helper.getChart("商机标题", "QV05");
                helper.getChart("商机数据", "QV06");
                helper.getChart("客户标题", "QV07");
                helper.getChart("客户数据", "QV08");
            },300);
        }
    };

    window.fn.handleQV01=function(index){
        helper.setVariable("商机维度变量", index + 1);

        // 商机维度变量
    };

    window.fn.handleQV03Click = function (arg) {
        $("#QV03-btn-group").children().attr("modifier", "outline");

        if (arg === 1) {
            $("#QV03-btn-01").attr("modifier", "cta");
            helper.setVariable("行业分类机会签10维度变量", "BusinessType");
        } else if (arg === 2) {
            $("#QV03-btn-02").attr("modifier", "cta");
            helper.setVariable("行业分类机会签10维度变量", "BusinessArea");
        }
    };

    window.fn.handleQV04 = function () {
        var seg2 = $("#segment-2")[0].getActiveButtonIndex();
        var seg3 = $("#segment-3")[0].getActiveButtonIndex();

        if (seg2 === 0) {
            if (seg3 === 0) {
                helper.getChart("工商户TOP10商机CHART", "QV04", {showTitles: false});
            } else {
                helper.getChart("工商户TOP10商机TABLE", "QV04", {showTitles: false});
            }
        } else {
            if (seg3 === 0) {
                helper.getChart("民用户TOP10商机CHART", "QV04", {showTitles: false});
            } else {
                helper.getChart("民用户TOP10商机TABLE", "QV04", {showTitles: false});
            }
        }
    };

    window.fn.clearCompany = function () {
        var DescriptionField = app.field('description');
        DescriptionField.clear();
    };

    //get objects -- inserted here --
    helper.getKpi("开放机会KPI").then(function (data) {
        kpis.openOpp = data;
        kpis.openOpp.title = "开放机会";

        $("#openOpp .kpi-title").text(kpis.openOpp.title);
        $("#openOpp .kpi-value").text(kpis.openOpp.value);
        $("#openOpp .kpi-compare").text(kpis.openOpp.compare);
    });

    helper.getKpi("盈率KPI").then(function (data) {
        kpis.winRate = data;
        kpis.winRate.title = "盈率";

        $("#winRate .kpi-title").text(kpis.winRate.title);
        $("#winRate .kpi-value").text(kpis.winRate.value);
        $("#winRate .kpi-compare").text(kpis.winRate.compare);
    });
    //create cubes and lists -- inserted here --


    var selState = app.selectionState();
    selState.OnData.bind(window.fn.openOpportunity);

    // helper.getChart('商机详情', 'QV99').then(function(vis){
    //     vis.table.OnData.bind(function(){
    //         console.log(vis);
    //     })
    // });


    // helper.getData("商机详情");
});

