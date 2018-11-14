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
    "../extensions/enn-consulting/js/functions",
    "../extensions/enn-consulting/lib/onsenui.min"
], function (qlik, $) {
    qlik.setOnError(function (error) {
        $('#popupText').append(error.message + "<br>");
        $('#popup').fadeIn(1000);
    });
    $("#closePopup").click(function () {
        $('#popup').hide();
    });

    window.fn.currentPage = "page1";


    window.fn.toggleLoadMash(true);

    var preLoadKpis = [
        "开放机会KPI",
        "盈率KPI"];
    var preLoadCharts = [
        "商机LINECHART",
        "盈率BARCHART",
        "行业分类机会前10PIECHART",
        "工商户TOP10商机CHART",
        "民用户TOP10商机CHART",
        "工商户TOP10商机TABLE",
        "民用户TOP10商机TABLE",
        "商机标题",
        "商机数据",
        "客户标题",
        "客户数据",
    ];

    window.fn.preload(preLoadKpis, 'kpi').then(function () {
        window.fn.preload(preLoadCharts, 'chart').then(function () {
            window.fn.renderPage1();
            window.fn.toggleLoadMash(false);

            window.fn.renderDateSelector();
        });

    });
});

