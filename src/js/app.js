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
    "../extensions/enn-consulting/js/qlik-helper",
    "../extensions/enn-consulting/lib/onsenui.min"
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
    var selState = app.selectionState();

    //callbacks -- inserted here --
    window.fn = {};

    window.fn.currentPage = "page1";

    window.fn.toggleLoadMash = function (open) {
        $el = $(".load-mask");

        if (open) {
            $el.show();
        } else {
            $el.hide();
        }
    };

    window.fn.openFilter = function () {
        document.querySelector('#myNavigator').pushPage('filter.html', {animation: "fade"});

        setTimeout(function () {
            helper.getChart("筛选器", "QV99");
        });
    };

    window.fn.toggleMenu = function (open) {
        if (open) {
            document.querySelector('#myNavigator').pushPage('menu.html', {animation: "fade"});
        } else {
            document.querySelector('#myNavigator').popPage({animation: "fade"});
        }

    };

    window.fn.closeFilter = function () {
        document.querySelector('#myNavigator').popPage({animation: "fade"});
        setTimeout(function () {
            qlik.resize();
        });
    };

    window.fn.clearFilter = function () {
        app.clearAll();
    };

    window.fn.clearSigningSelector = function () {
        return helper.clearField('SigningSelector');
    };


    window.fn.renderDateSelector = function () {
        helper.getFieldValues('DateSelector').then(function (values) {
            var select = $("#dateSelector");

            values.forEach(function (val) {
                select.append("<option>" + val.qText + "</option>")
            });

            helper.setFieldByValue(values[0].qText);

            select.on("change", function () {
                helper.setFieldByValue('DateSelector', select.val());
            });
        });
    };

    window.fn.openKpi = function (id) {
        window.fn.currentKpi = kpis[id];

        if (window.fn.currentKpi) {
            document.querySelector('#myNavigator').pushPage('page2.html', {data: {title: ''}});
            window.fn.currentPage = "page2";

            setTimeout(function () {
                window.fn.renderPage2();
            }, 350);
        }
    };

    window.fn.openOpportunity = function () {
        let sels = selState.selections.filter(function (sel) {
            return sel.fieldName === "description";
        });
        if (sels.length > 0) {
            $("#qs-chart-tooltip>div[qva-chart-tooltip]").hide();
            document.querySelector('#myNavigator').pushPage('page3.html', {data: {title: ''}});
            window.fn.currentPage = "page3";

            setTimeout(function () {
                $(".company-title").text(sels[0].qSelected);

                helper.getChart("商机标题", "QV05");
                helper.getChart("商机数据", "QV06");
                helper.getChart("客户标题", "QV07");
                helper.getChart("客户数据", "QV08");

                helper.getFieldPossible("CustomerStage").then(function (hits) {
                    //console.log(hits);

                    hits.forEach(function (hit) {
                        $("." + hit.qText).attr("icon", "md-check-circle");
                    })
                });
            });
        }
    };

    window.fn.handleQV01 = function (index) {
        helper.setFieldByIndex("SigningSelector", index);
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

    window.fn.backToKpi = function () {
        var DescriptionField = app.field('description');

        document.querySelector('#myNavigator').popPage();
        window.fn.currentPage = "page2";

        setTimeout(function () {
            DescriptionField.clear().then(function () {
                //window.fn.renderPage2();
            });
        }, 300);


    };

    window.fn.backToScorecard = function () {
        document.querySelector('#myNavigator').popPage();
        window.fn.currentPage = "page1";

        setTimeout(function () {
            window.fn.clearSigningSelector()
        }, 300);

    };

    window.fn.renderPage2 = function () {
        helper.setFieldByValue("SigningSelector", "全部商机");
        helper.getChart("商机LINECHART", "QV01", {showTitles: false});
        helper.getChart("盈率BARCHART", "QV02");
        helper.getChart("行业分类机会前10PIECHART", "QV03");

        helper.getVariable("行业分类机会签10维度变量").then(function (val) {

            $("#QV03-btn-group ons-button").attr("modifier", "outline");

            if (val === "BusinessType") {
                $("#QV03-btn-01").attr("modifier", "cta");
            } else if (val === "BusinessArea") {
                $("#QV03-btn-02").attr("modifier", "cta");
            }
        });

        helper.getChart("工商户TOP10商机CHART", "QV04");

        let data = window.fn.currentKpi;

        data.table.OnData.bind(function () {
            window.fn.renderKpi(data, "detailKpi");
        });

        window.fn.renderKpi(data, "detailKpi");

        $("#segment-1").off("postchange").on("postchange", function () {
            window.fn.handleQV01(this.getActiveButtonIndex());
        });

        $("#segment-2").off("postchange").on("postchange", function () {
            window.fn.handleQV04();
        });

        $("#segment-3").off("postchange").on("postchange", function () {
            window.fn.handleQV04();
        });
    };

    window.fn.renderKpi = function (data, id) {
        let kpi = {
            title: data.model.layout.title,
            color1: data.model.layout.subtitle,
            value: data.model.layout.qHyperCube.qGrandTotalRow[0].qText,
            compare: data.model.layout.qHyperCube.qGrandTotalRow[1].qText,
            color2: data.model.layout.qHyperCube.qGrandTotalRow[1].qNum > 0 ? 'green' : 'red'
        };

        let element = $("#" + id);

        element.find(".kpi-title").text(kpi.title);
        element.find(".kpi-value").text(kpi.value);
        element.find(".kpi-compare>span").text(kpi.compare);
        element.find(".kpi-color-bar>div").removeClass().addClass(kpi.color1);
        element.find(".kpi-compare>span").removeClass().addClass(kpi.color2);

        kpis[id] = data;
    };

    window.fn.alwasySelect = function () {
        let field = "SigningSelector";
        let sels = selState.selections.filter(function (sel) {
            return field === sel.fieldName;
        });

        if (sels.length < 1) {
            helper.setFieldByIndex(field, 0);
        }
    };


    window.fn.renderPage1 = function () {
        helper.getKpi("开放机会KPI").then(function (data) {
            data.table.OnData.bind(function () {
                window.fn.renderKpi(data, "openOpp");
            });

            window.fn.renderKpi(data, "openOpp");
        });

        helper.getKpi("盈率KPI").then(function (data) {
            data.table.OnData.bind(function () {
                window.fn.renderKpi(data, "winRate");
            });

            window.fn.renderKpi(data, "winRate");
        });
    };


    window.fn.toggleLoadMash(true);

    var loadingPromises = [];

    loadingPromises.push(helper.getKpi("开放机会KPI"));
    loadingPromises.push(helper.getKpi("盈率KPI"));
    loadingPromises.push(helper.getChart("商机LINECHART"));
    loadingPromises.push(helper.getKpi("盈率BARCHART"));
    loadingPromises.push(helper.getKpi("行业分类机会前10PIECHART"));
    loadingPromises.push(helper.getKpi("工商户TOP10商机CHART"));
    loadingPromises.push(helper.getKpi("民用户TOP10商机CHART"));
    loadingPromises.push(helper.getKpi("工商户TOP10商机TABLE"));
    loadingPromises.push(helper.getKpi("民用户TOP10商机TABLE"));
    loadingPromises.push(helper.getKpi("商机标题"));
    loadingPromises.push(helper.getKpi("商机数据"));
    loadingPromises.push(helper.getKpi("客户标题"));
    loadingPromises.push(helper.getKpi("客户数据"));

    Promise.all(loadingPromises).then(function () {
        window.fn.renderPage1();
        selState.OnData.bind(window.fn.openOpportunity);
        window.fn.toggleLoadMash(false);
    });


    window.fn.renderPage1();

    window.fn.renderDateSelector();

});

