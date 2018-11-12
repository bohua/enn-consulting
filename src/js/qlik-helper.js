define(["js/qlik", "./object-map"], function (qlik, objMap) {
    var app = qlik.openApp('Qlik Consulting Data Profiling - Sales Opp (Everyone).qvf', config);

    return {
        getApp: function(){
            return app;
        },

        getKpi: function (name) {
            var objId = objMap.getObjByName(name);

            if (objId) {
                return app.visualization.get(objId).then(function (vis) {
                    return Promise.resolve({
                        value: vis.model.layout.qHyperCube.qGrandTotalRow[0].qText,
                        compare: vis.model.layout.qHyperCube.qGrandTotalRow[1].qText
                    });
                });
            } else {
                throw "Object Not Found";
            }
        },

        getChart: function (name, id, options) {
            var objId = objMap.getObjByName(name);

            if (objId) {
                return app.visualization.get(objId).then(function (vis) {
                    vis.setOptions(options);
                    vis.show(id);

                    return Promise.resolve(vis);
                });
            } else {
                throw "chart Not Found";
            }
        },

        getData: function(name){
            var objId = objMap.getObjByName(name);

            if (objId) {
                return app.visualization.get(objId).then(function (vis) {

                    vis.table.OnData.bind(function(){
                       console.log(this);
                    });
                    // return Promise.resolve({
                    //     title: vis.model.layout.title,
                    //     data: vis.model.layout.qHyperCube
                    // });
                });
            } else {
                throw "chart Not Found";
            }
        },

        getVariable: function (name) {
            var objId = objMap.getObjByName(name);

            if (objId) {
                return app.variable.getContent(objId);
            } else {
                throw "variable Not Found";
            }

        },

        setVariable: function (name, val) {
            var objId = objMap.getObjByName(name);

            if (objId) {
                if(isNaN(val)){
                    app.variable.setStringValue(objId, val);
                }else {
                    app.variable.setNumValue(objId, val);
                }

            } else {
                throw "variable Not Found";
            }


        }
    }
});