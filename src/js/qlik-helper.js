define(["js/qlik", "jquery", "./object-map"], function (qlik, $, objMap) {
    var app = qlik.openApp('37974999-f241-4b51-b446-ea5944ba892c.qvf', config);

    var cache = {};

    return {
        getApp: function () {
            return app;
        },

        getKpi: function (name) {
            var objId = objMap.getObjByName(name);

            if (objId) {
                if (cache[objId]) {
                    return Promise.resolve(cache[objId]);;
                }

                return app.visualization.get(objId).then(function (vis) {
                    $("#cachePool").append("<div id='" + objId + "'></div>")
                    cache[objId] = vis;
                    vis.show(objId);
                    return Promise.resolve(cache[objId]);
                });
            } else {
                throw "Object Not Found";
            }
        },

        getChart: function (name, id, options) {
            var objId = objMap.getObjByName(name);

            if (objId) {
                if (cache[objId]) {
                    let vis = cache[objId];

                    if(options){
                        vis.setOptions(options);
                    }

                    if(id){
                        vis.show(id);
                    }

                    return Promise.resolve(cache[objId]);
                }

                return app.visualization.get(objId).then(function (vis) {
                    cache[objId] = vis;

                    if(options){
                        vis.setOptions(options);
                    }

                    if(id){
                        vis.show(id);
                    }

                    return Promise.resolve(vis);
                });
            } else {
                throw "chart Not Found";
            }
        },

        getData: function (name) {
            var objId = objMap.getObjByName(name);

            if (objId) {
                return app.visualization.get(objId).then(function (vis) {

                    vis.table.OnData.bind(function () {
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
                if (cache[objId]) {
                    return Promise.resolve(cache[objId]);
                }

                return app.variable.getContent(objId).then(function (model) {
                    let val = model.qContent.qString;
                    cache[objId] = val;

                    return Promise.resolve(val);
                });
            } else {
                throw "variable Not Found";
            }

        },

        setVariable: function (name, val) {
            var objId = objMap.getObjByName(name);

            if (objId) {
                cache[objId] = val;

                if (isNaN(val)) {
                    app.variable.setStringValue(objId, val);
                } else {
                    app.variable.setNumValue(objId, val);
                }

            } else {
                throw "variable Not Found";
            }
        },

        setFieldByIndex: function (field, index) {
            return app.field(field).select([index], false, true);
        },

        setFieldByValue: function (field, value) {
            return app.field(field).selectValues([value], false, true);
        },

        clearField: function (field) {
            return app.field(field).clear();
        },

        getFieldPossible: function (field) {
            var promise = new Promise(function(resolve, reject){
                var f = app.field(field).getData();
                f.OnData.bind( function(){
                    var hits = f.rows.filter(function(row){
                        //console.log(row);
                        return row.qState === 'O';
                    });

                    resolve(hits);
                });
            });


            return promise;
        },

        getFieldValues:function (field) {
            var promise = new Promise(function(resolve, reject){
                var f = app.field(field).getData();
                var listener = function(){
                    resolve(f.rows);
                    f.OnData.unbind(listener);
                };
                f.OnData.bind(listener);
            });


            return promise;
        }
    }
});