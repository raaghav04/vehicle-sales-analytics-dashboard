// ============================================
// VEHICLE SALES DASHBOARD - script.js
// ============================================

Chart.defaults.color = "#ffffff";
Chart.defaults.font.family = "'Poppins', sans-serif";
Chart.defaults.devicePixelRatio = window.devicePixelRatio || 2;


// ============================================
// CHART INSTANCES
// ============================================

const chartInstances = {};


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


// ============================================
// FETCH DATA
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
// DESTROY EXISTING CHART
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

        displayColors: true,

        callbacks: {

            title: function(context) {

                return context[0].label;
            },

            label: function(context) {

                const value = Number(context.raw || 0);

                let text =
                    ` Sales: ${value.toLocaleString()}`;

                // Percentage for pie/doughnut
                if (
                    context.chart.config.type === "pie" ||
                    context.chart.config.type === "doughnut"
                ) {

                    const dataset =
                        context.chart.data.datasets[0];

                    const total =
                        dataset.data.reduce(
                            (sum, value) =>
                                sum + Number(value || 0),
                            0
                        );

                    const percentage =
                        total > 0
                            ? ((value / total) * 100).toFixed(1)
                            : "0.0";

                    text += ` | Share: ${percentage}%`;
                }

                return text;
            }
        }
    };
}


// ============================================
// LOAD KPI
// ============================================

async function loadKPI() {

    const totalSales =
        document.getElementById("totalSales");

    const totalBrands =
        document.getElementById("totalBrands");

    const totalSegments =
        document.getElementById("totalSegments");

    const totalBodyTypes =
        document.getElementById("totalBodyTypes");


    // KPI cards don't exist on every page
    if (
        !totalSales ||
        !totalBrands ||
        !totalSegments ||
        !totalBodyTypes
    ) {

        console.log("KPI elements not found on this page.");

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
// TOP 10 BRANDS
// ============================================

async function renderMakeChart() {

    const canvas =
        document.getElementById("makeChart");


    if (!canvas) {

        console.log("makeChart not found on this page.");

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

                    label: "Top 10 Brands by Sales",

                    data: data.values,

                    backgroundColor: brandPalette,

                    borderColor: "#ffffff",

                    borderWidth: 1.5,

                    borderRadius: 10,

                    hoverBackgroundColor: "#f0d7a5"
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


    console.log("Make chart loaded.");
}


// ============================================
// SEGMENT PIE CHART
// ============================================

async function renderSegmentChart() {

    const canvas =
        document.getElementById("segmentChart");


    if (!canvas) {

        console.log(
            "segmentChart not found on this page."
        );

        return;
    }


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

                animation: {

                    duration: 800,

                    easing: "easeOutCubic"
                },

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

                            pointStyle: "circle",

                            padding: 18,

                            font: {
                                size: 13
                            }
                        }
                    },

                    tooltip:
                        commonTooltip()
                }
            }
        });


    console.log("Segment chart loaded.");
}


// ============================================
// BODY TYPE DOUGHNUT
// ============================================

async function renderBodyChart() {

    const canvas =
        document.getElementById("bodyChart");


    if (!canvas) {

        console.log(
            "bodyChart not found on this page."
        );

        return;
    }


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

                animation: {

                    duration: 800,

                    easing: "easeOutCubic"
                },

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

                            pointStyle: "circle",

                            padding: 18,

                            font: {
                                size: 13
                            }
                        }
                    },

                    tooltip:
                        commonTooltip()
                }
            }
        });


    console.log("Body chart loaded.");
}


// ============================================
// MONTHLY SALES TREND
// ============================================

async function renderTrendChart() {

    const canvas =
        document.getElementById("trendChart");


    if (!canvas) {

        console.log(
            "trendChart not found on this page."
        );

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


    console.log("Trend chart loaded.");
}


// ============================================
// INITIALIZE EVERYTHING
// ============================================

async function initDashboard() {

    console.log("================================");
    console.log("Vehicle Dashboard JavaScript started");
    console.log("Chart.js version:", Chart.version);
    console.log("================================");


    try {

        await loadKPI();

        await Promise.all([

            renderMakeChart(),

            renderTrendChart(),

            renderSegmentChart(),

            renderBodyChart()

        ]);


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
