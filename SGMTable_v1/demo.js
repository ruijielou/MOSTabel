/*globals define*/
define(["qlik", "jquery", "./dataTables", "./fixedColumns", "./iscroll", "css!./bootstrap.css", "css!./style.css"], function(qlik, $, DataTables, FixedColumns, iscroll) {
    'use strict';
    //$( "<style>" ).html( cssContent ).appendTo( "head" );
    function createRows(rows, dimensionInfo, ) {
        var html = "";
        rows.forEach(function(row) {
            html += '<tr>';
            row.forEach(function(cell, key) {
                if (cell.qIsOtherCell) {
                    cell.qText = dimensionInfo[key].othersLabel;
                }
                html += "<td ";
                if (!isNaN(cell.qNum)) {
                    html += "class='numeric'";
                }
                html += '>' + cell.qText + '</td>';
            });
            html += '</tr>';
        });
        return html;
    }

    return {
        initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 10,
                    qHeight: 50
                }]
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                dimensions: {
                    uses: "dimensions",
                    min: 1
                },
                measures: {
                    uses: "measures",
                    min: 0
                },
                sorting: {
                    uses: "sorting"
                },
                settings: {
                    uses: "settings"
                }
            }
        },
        snapshot: {
            canTakeSnapshot: true
        },
        paint: function($element, layout) {
            var id = 'table' + Math.ceil(Math.random() * 100000);
            console.log(id)
            var html = "<div id='table-wrapper-box'><table class='table table-bordered browser-table table-striped' id='" + id + "'><thead><tr class='gradeX'>",
                self = this,
                morebutton = false,
                hypercube = layout.qHyperCube,
                rowcount = hypercube.qDataPages[0].qMatrix.length,
                colcount = hypercube.qDimensionInfo.length + hypercube.qMeasureInfo.length;
            //render titles
            hypercube.qDimensionInfo.forEach(function(cell) {
                html += '<th>' + cell.qFallbackTitle + '</th>';
            });
            hypercube.qMeasureInfo.forEach(function(cell) {
                html += '<th>' + cell.qFallbackTitle + '</th>';
            });
            html += "</tr></thead><tbody>";
            //render data
            html += createRows(hypercube.qDataPages[0].qMatrix, hypercube.qDimensionInfo);
            html += "</tbody></table></div>";
            //add 'more...' button
            if (hypercube.qSize.qcy > rowcount) {
                html += "<button class='more'>More...</button>";
                morebutton = true;
            }
            var str = $element.html(html);

            var ele = $element.find("#" + id);
            var tableHeight = $('#table-wrapper-box').height()
            var tableWidth = $('#table-wrapper-box').width()

            try {
                $.extend($.fn.dataTable.defaults, {
                    searching: false, //禁止搜索
                    ordering: false //禁止排序
                });

                ele.DataTable({

                    "scrollY": (tableHeight - 150) + 'px',
                    "scrollX": tableWidth + 'px',
                    "displayLength": "400",
                    "paging": false, //禁止分页
                    "autoWidth": false,
                    "scrollCollapse": true,
                    fixedColumns: { //需要第一列不滚动就设置1
                        leftColumns: 1
                    },
                    "initComplete": function() {

                    }

                });
            } catch (e) {

               $element.html(html);
            }




            return qlik.Promise.resolve();
        }
    };
});
