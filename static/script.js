// ============================================
// VEHICLE SALES DASHBOARD - script.js
// ============================================

Chart.defaults.color = "#ffffff";
Chart.defaults.font.family = "'Poppins', sans-serif";
Chart.defaults.devicePixelRatio = window.devicePixelRatio || 2;


// ============================================
// CHART INSTANCES
// ============================================

let chartInstances = {};


// ============================================
// COLOR PALETTES
// ============================================

const brandPalette = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
    "#84CC16",
    "#F97316",
    "#a78245"
];


// ============================================
// FETCH HELPER
// ============================================

async function fetchData(url) {

    console.log("Fetching:", url);

    const response = await fetch(url, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(
            `${url} failed with status ${response.status}`
        );
    }

    const data = await response.json();

    console.log("Received:", url, data);

    return data;
}


// ============================================
// DESTROY OLD CHART
// ============================================

function destroyChart(id) {

    if (chartInstances[id]) {

        chartInstances[id].destroy();

        delete chartInstances[id];
    }
}


// ============================================
// COMMON TOOLTIP
// ============================================

function commonTooltip() {

    return {

        enabled: true,

        backgroundColor: "#021130",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        borderColor: "#a78245",

        borderWidth: 2,

        padding: 14,

        cornerRadius: 10,

        callbacks: {

            title: function(context) {

                return context[0].label;
            },

            label: function(context) {

                const value =
                    Number(context.raw || 0);

                return ` Sales: ${value.toLocaleString()}`;
            }
        }
    };
}


// ============================================
// LOAD KPI
// ============================================

async function loadKPI() {

    console.log("Loading KPI...");

    const totalSales =
        document.getElementById("totalSales");

    const totalBrands =
        document.getElementById("totalBrands");

    const totalSegments =
        document.getElementById("totalSegments");

    const totalBodyTypes =
        document.getElementById("totalBodyTypes");


    // If this page doesn't have KPI cards,
    // simply stop.

    if (
        !totalSales ||
        !totalBrands ||
        !totalSegments ||
        !totalBodyTypes
    ) {

        console.log("KPI elements not found.");

        return;
    }


    const data =
        await fetchData("/kpi");


    totalSales.innerText =
        Number(data.total_sales).toLocaleString();

    totalBrands.innerText =
        data.total_brands;

    totalSegments.innerText =
        data.total_segments;

    totalBodyTypes.innerText =
        data.total_body_types;


    console.log("KPI loaded.");
}


// ============================================
// TOP 10 BRANDS CHART
// ============================================

async function renderMakeChart() {

    const canvas =
        document.getElementById("makeChart");


    // Important:
    // Other pages may not have this chart.

    if (!canvas) {

        console.log("makeChart not found.");

        return;
    }


    destroyChart("makeChart");


    const data =
        await fetchData("/sales_by_make");


    chartInstances.makeChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: data.labels,

                datasets: [{

                    label:
                        "Top 10 Brands by Sales",

                    data:
                        data.values,

                    backgroundColor:
                        brandPalette,

                    borderColor:
                        "#ffffff",

                    borderWidth: 1.5,

                    borderRadius: 10,

                    hoverBackgroundColor:
                        "#f0d7a5"
                }]
            },


            options: {

                responsive: true,

                maintainAspectRatio: false,


                animation: {

                    duration: 1200,

                    easing: "easeOutBounce"
                },


                interaction: {

                    mode: "nearest",

                    intersect: true
                },


                plugins: {

                    legend: {

                        display: true,

                        labels: {

                            color: "#ffffff"
                        }
                    },


                    tooltip:
                        commonTooltip()
                },


                scales: {

                    x: {

                        ticks: {

                            color: "#ffffff",

                            font: {
                                size: 12
                            }
                        },

                        grid: {

                            color:
                                "rgba(255,255,255,0.08)"
                        }
                    },


                    y: {

                        beginAtZero: true,

                        ticks: {

                            color: "#ffffff",

                            font: {
                                size: 12
                            }
                        },

                        grid: {

                            color:
                                "rgba(255,255,255,0.08)"
                        }
                    }
                }
            }
        });


    console.log(
        "Top 10 Brands chart loaded."
    );
}


// ============================================
// MONTHLY SALES TREND
// ============================================

async function renderTrendChart() {

    const canvas =
        document.getElementById("trendChart");


    if (!canvas) {

        console.log("trendChart not found.");

        return;
    }


    destroyChart("trendChart");


    const data =
        await fetchData("/sales_trend");


    chartInstances.trendChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: data.labels,

                datasets: [{

                    label:
                        "Monthly Sales Trend",

                    data:
                        data.values,

                    borderColor:
                        "#3B82F6",

                    borderWidth: 3,

                    backgroundColor:
                        "rgba(59,130,246,0.18)",

                    fill: true,

                    tension: 0.32,


                    pointBackgroundColor:
                        "#60A5FA",

                    pointBorderColor:
                        "#ffffff",

                    pointBorderWidth: 2,

                    pointRadius: 5,

                    pointHoverRadius: 10,

                    pointHitRadius: 20
                }]
            },


            options: {

                responsive: true,

                maintainAspectRatio: false,


                animation: {

                    duration: 1500,

                    easing: "easeInOutQuart"
                },


                interaction: {

                    mode: "nearest",

                    intersect: true
                },


                plugins: {

                    legend: {

                        display: true,

                        labels: {

                            color: "#ffffff"
                        }
                    },


                    tooltip:
                        commonTooltip()
                },


                scales: {

                    x: {

                        ticks: {

                            color: "#ffffff",

                            font: {
                                size: 12
                            }
                        },

                        grid: {

                            color:
                                "rgba(255,255,255,0.08)"
                        }
                    },


                    y: {

                        beginAtZero: true,

                        ticks: {

                            color: "#ffffff",

                            font: {
                                size: 12
                            }
                        },

                        grid: {

                            color:
                                "rgba(255,255,255,0.08)"
                        }
                    }
                }
            }
        });


    console.log(
        "Monthly Sales Trend chart loaded."
    );
}


// ============================================
// INITIALIZE DASHBOARD
// ============================================

async function initDashboard() {

    console.log(
        "================================"
    );

    console.log(
        "Dashboard JavaScript started"
    );

    console.log(
        "Chart.js version:",
        Chart.version
    );


    try {

        // KPI

        await loadKPI();


        // Charts

        await renderMakeChart();

        await renderTrendChart();


        console.log(
            "Dashboard loaded successfully."
        );

    } catch (error) {

        console.error(
            "DASHBOARD ERROR:",
            error
        );
    }
}


// ============================================
// START AFTER HTML LOAD
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);
