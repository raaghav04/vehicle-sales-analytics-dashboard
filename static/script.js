Chart.defaults.color = "#ffffff";
Chart.defaults.font.family = "'Poppins', sans-serif";
Chart.defaults.devicePixelRatio = window.devicePixelRatio || 2;

const chartInstances = {};

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

const segmentPalette = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
    "#84CC16"
];

const bodyPalette = [
    "#a78245",
    "#3B82F6",
    "#10B981",
    "#EF4444",
    "#8B5CF6",
    "#F59E0B",
    "#06B6D4",
    "#EC4899"
];


// ================================
// FETCH DATA
// ================================

async function fetchData(url) {

    const response = await fetch(url, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(
            `${url} returned ${response.status}`
        );
    }

    return await response.json();
}


// ================================
// TOOLTIP
// ================================

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

        displayColors: true,

        callbacks: {

            title(context) {
                return context[0].label;
            },

            label(context) {

                const chart = context.chart;
                const dataset =
                    chart.data.datasets[context.datasetIndex];

                const value = Number(
                    context.raw ?? 0
                );

                let result =
                    ` Sales: ${value.toLocaleString()}`;

                if (
                    chart.config.type === "pie" ||
                    chart.config.type === "doughnut"
                ) {

                    const total =
                        dataset.data.reduce(
                            (sum, value) =>
                                sum + Number(value),
                            0
                        );

                    const percentage =
                        total > 0
                            ? ((value / total) * 100).toFixed(1)
                            : "0.0";

                    result +=
                        ` | Share: ${percentage}%`;
                }

                return result;
            }
        }
    };
}


// ================================
// CHART DESTROY
// ================================

function destroyChart(id) {

    if (chartInstances[id]) {

        chartInstances[id].destroy();

        delete chartInstances[id];
    }
}


// ================================
// KPI
// ================================

async function loadKPI() {

    const totalSales =
        document.getElementById("totalSales");

    const totalBrands =
        document.getElementById("totalBrands");

    const totalSegments =
        document.getElementById("totalSegments");

    const totalBodyTypes =
        document.getElementById("totalBodyTypes");


    if (!totalSales) return;


    const data = await fetchData("/kpi");


    totalSales.innerText =
        Number(data.total_sales).toLocaleString();

    totalBrands.innerText =
        data.total_brands;

    totalSegments.innerText =
        data.total_segments;

    totalBodyTypes.innerText =
        data.total_body_types;
}


// ================================
// MAKE / BRAND CHART
// ================================

async function renderMakeChart() {

    const canvas =
        document.getElementById("makeChart");

    if (!canvas) return;


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
                            color: "#ffffff"
                        },

                        grid: {
                            color:
                                "rgba(255,255,255,0.08)"
                        }
                    },


                    y: {

                        ticks: {
                            color: "#ffffff"
                        },

                        grid: {
                            color:
                                "rgba(255,255,255,0.08)"
                        }
                    }
                }
            }
        });
}


// ================================
// SEGMENT PIE CHART
// ================================

async function renderSegmentChart() {

    const canvas =
        document.getElementById("segmentChart");

    if (!canvas) return;


    destroyChart("segmentChart");


    const data =
        await fetchData("/sales_by_segment");


    chartInstances.segmentChart =
        new Chart(canvas, {

            type: "pie",

            data: {

                labels: data.labels,

                datasets: [{

                    data: data.values,

                    backgroundColor:
                        segmentPalette,

                    borderColor:
                        "#021130",

                    borderWidth: 3,

                    hoverOffset: 15
                }]
            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {

                    mode: "nearest",

                    intersect: true
                },


                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {

                            color: "#ffffff",

                            usePointStyle: true,

                            padding: 18
                        }
                    },

                    tooltip:
                        commonTooltip()
                }
            }
        });
}


// ================================
// BODY DOUGHNUT
// ================================

async function renderBodyChart() {

    const canvas =
        document.getElementById("bodyChart");

    if (!canvas) return;


    destroyChart("bodyChart");


    const data =
        await fetchData("/sales_by_body");


    chartInstances.bodyChart =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels: data.labels,

                datasets: [{

                    data: data.values,

                    backgroundColor:
                        bodyPalette,

                    borderColor:
                        "#021130",

                    borderWidth: 3,

                    hoverOffset: 15
                }]
            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "58%",


                interaction: {

                    mode: "nearest",

                    intersect: true
                },


                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {

                            color: "#ffffff",

                            usePointStyle: true,

                            padding: 18
                        }
                    },

                    tooltip:
                        commonTooltip()
                }
            }
        });
}


// ================================
// TREND LINE CHART
// ================================

async function renderTrendChart() {

    const canvas =
        document.getElementById("trendChart");

    if (!canvas) return;


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
                            color: "#ffffff"
                        },

                        grid: {
                            color:
                                "rgba(255,255,255,0.08)"
                        }
                    },


                    y: {

                        ticks: {
                            color: "#ffffff"
                        },

                        grid: {
                            color:
                                "rgba(255,255,255,0.08)"
                        }
                    }
                }
            }
        });
}


// ================================
// INITIALIZE DASHBOARD
// ================================

async function initDashboard() {

    const dashboard =
        document.querySelector(".dashboard");

    if (!dashboard) return;


    console.log("Dashboard starting...");


    try {

        await loadKPI();

        await renderMakeChart();

        await renderSegmentChart();

        await renderBodyChart();

        await renderTrendChart();


        console.log(
            "Dashboard loaded successfully"
        );

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );
    }
}


// ================================
// START
// ================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initDashboard();

    }
);
