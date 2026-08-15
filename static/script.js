// =====================================================
// VEHICLE SALES ANALYTICS DASHBOARD
// Clean unified script.js
// =====================================================

Chart.defaults.color = "#ffffff";
Chart.defaults.font.family = "'Poppins', sans-serif";


// =====================================================
// CHART INSTANCES
// =====================================================

let charts = {};


// =====================================================
// COLOR PALETTES
// =====================================================

const brandColors = [
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

const segmentColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
    "#84CC16",
    "#F97316",
    "#EF4444",
    "#14B8A6"
];

const bodyColors = [
    "#a78245",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
    "#EF4444",
    "#84CC16",
    "#F97316"
];


// =====================================================
// FETCH HELPER
// =====================================================

async function fetchData(url) {

    console.log("Fetching:", url);

    const response = await fetch(url, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(
            `${url} returned ${response.status}`
        );
    }

    const data = await response.json();

    console.log("Received:", url, data);

    return data;
}


// =====================================================
// DESTROY EXISTING CHART
// =====================================================

function destroyChart(name) {

    if (charts[name]) {

        charts[name].destroy();

        charts[name] = null;
    }
}


// =====================================================
// BAR CHART TOOLTIP
// =====================================================

function barTooltip() {

    return {

        enabled: true,

        backgroundColor: "#021130",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        borderColor: "#a78245",

        borderWidth: 2,

        padding: 12,

        cornerRadius: 8,

        displayColors: false,

        callbacks: {

            title: function(context) {

                return context[0].label;
            },

            label: function(context) {

                const value =
                    Number(context.raw || 0);

                return `Sales: ${value.toLocaleString()} units`;
            }
        }
    };
}


// =====================================================
// LINE CHART TOOLTIP
// =====================================================

function lineTooltip() {

    return {

        enabled: true,

        backgroundColor: "#021130",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        borderColor: "#3B82F6",

        borderWidth: 2,

        padding: 12,

        cornerRadius: 8,

        displayColors: false,

        callbacks: {

            title: function(context) {

                return context[0].label;
            },

            label: function(context) {

                const value =
                    Number(context.raw || 0);

                return `Sales: ${value.toLocaleString()} units`;
            }
        }
    };
}


// =====================================================
// PIE CHART TOOLTIP
// =====================================================

function pieTooltip() {

    return {

        enabled: true,

        backgroundColor: "#021130",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        borderColor: "#a78245",

        borderWidth: 2,

        padding: 12,

        cornerRadius: 8,

        callbacks: {

            label: function(context) {

                const value =
                    Number(context.raw || 0);

                const total =
                    context.dataset.data.reduce(
                        (a, b) => a + Number(b),
                        0
                    );

                const percentage =
                    total > 0
                        ? ((value / total) * 100).toFixed(1)
                        : 0;

                return `${context.label}: ${value.toLocaleString()} units (${percentage}%)`;
            }
        }
    };
}


// =====================================================
// COMMON BAR OPTIONS
// =====================================================

function barOptions() {

    return {

        responsive: true,

        maintainAspectRatio: false,

        animation: {

            duration: 1400,

            easing: "easeOutQuart"
        },

        interaction: {

            mode: "index",

            intersect: false
        },

        plugins: {

            legend: {

                display: true,

                labels: {

                    color: "#ffffff",

                    usePointStyle: true
                }
            },

            tooltip: barTooltip()
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
                        "rgba(255,255,255,0.06)"
                }
            },

            y: {

                beginAtZero: true,

                ticks: {

                    color: "#ffffff",

                    font: {

                        size: 12
                    },

                    callback: function(value) {

                        return Number(value)
                            .toLocaleString();
                    }
                },

                grid: {

                    color:
                        "rgba(255,255,255,0.08)"
                }
            }
        }
    };
}


// =====================================================
// TOP 10 BRANDS
// =====================================================

async function renderMakeChart() {

    const canvas =
        document.getElementById("makeChart");

    if (!canvas) {

        return;
    }

    const data =
        await fetchData("/sales_by_make");

    destroyChart("makeChart");

    charts.makeChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: data.labels,

                datasets: [{

                    label: "Sales",

                    data: data.values,

                    backgroundColor:
                        brandColors.slice(
                            0,
                            data.values.length
                        ),

                    borderColor:
                        "#ffffff",

                    borderWidth: 1,

                    borderRadius: 8,

                    borderSkipped: false,

                    hoverBackgroundColor:
                        "#f0d7a5",

                    hoverBorderColor:
                        "#ffffff",

                    hoverBorderWidth: 2
                }]
            },

            options: barOptions()
        });

    console.log("Brand chart loaded.");
}


// =====================================================
// MONTHLY SALES TREND
// =====================================================

async function renderTrendChart() {

    const canvas =
        document.getElementById("trendChart");

    if (!canvas) {

        return;
    }

    const data =
        await fetchData("/sales_trend");

    destroyChart("trendChart");

    charts.trendChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels: data.labels,

                datasets: [{

                    label: "Monthly Sales",

                    data: data.values,

                    borderColor:
                        "#3B82F6",

                    backgroundColor:
                        "rgba(59,130,246,0.18)",

                    borderWidth: 3,

                    fill: true,

                    tension: 0.35,

                    pointRadius: 5,

                    pointHoverRadius: 9,

                    pointBackgroundColor:
                        "#3B82F6",

                    pointHoverBackgroundColor:
                        "#f0d7a5",

                    pointBorderColor:
                        "#ffffff",

                    pointHoverBorderColor:
                        "#ffffff",

                    pointBorderWidth: 2,

                    pointHoverBorderWidth: 3
                }]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: {

                    duration: 1600,

                    easing: "easeInOutQuart"
                },

                interaction: {

                    mode: "nearest",

                    intersect: false
                },

                plugins: {

                    legend: {

                        display: true,

                        labels: {

                            color: "#ffffff",

                            usePointStyle: true
                        }
                    },

                    tooltip:
                        lineTooltip()
                },

                scales: {

                    x: {

                        ticks: {

                            color: "#ffffff"
                        },

                        grid: {

                            color:
                                "rgba(255,255,255,0.06)"
                        }
                    },

                    y: {

                        beginAtZero: true,

                        ticks: {

                            color: "#ffffff",

                            callback: function(value) {

                                return Number(value)
                                    .toLocaleString();
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


// =====================================================
// SALES BY SEGMENT
// =====================================================

async function renderSegmentChart() {

    const canvas =
        document.getElementById("segmentChart");

    if (!canvas) {

        return;
    }

    const data =
        await fetchData("/sales_by_segment");

    destroyChart("segmentChart");

    charts.segmentChart =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels: data.labels,

                datasets: [{

                    data: data.values,

                    backgroundColor:
                        segmentColors.slice(
                            0,
                            data.values.length
                        ),

                    borderColor:
                        "#021130",

                    borderWidth: 3,

                    hoverOffset: 14,

                    hoverBorderColor:
                        "#ffffff",

                    hoverBorderWidth: 2
                }]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "55%",

                animation: {

                    duration: 1400,

                    easing: "easeOutCubic"
                },

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {

                            color: "#ffffff",

                            usePointStyle: true,

                            padding: 15
                        }
                    },

                    tooltip:
                        pieTooltip()
                }
            }
        });

    console.log("Segment chart loaded.");
}


// =====================================================
// SALES BY BODY TYPE
// =====================================================

async function renderBodyChart() {

    const canvas =
        document.getElementById("bodyChart");

    if (!canvas) {

        return;
    }

    const data =
        await fetchData("/sales_by_body");

    destroyChart("bodyChart");

    charts.bodyChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: data.labels,

                datasets: [{

                    label: "Sales by Body Type",

                    data: data.values,

                    backgroundColor:
                        bodyColors.slice(
                            0,
                            data.values.length
                        ),

                    borderColor:
                        "#ffffff",

                    borderWidth: 1,

                    borderRadius: 8,

                    borderSkipped: false,

                    hoverBackgroundColor:
                        "#f0d7a5",

                    hoverBorderColor:
                        "#ffffff",

                    hoverBorderWidth: 2
                }]
            },

            options: barOptions()
        });

    console.log("Body type chart loaded.");
}


// =====================================================
// KPI
// =====================================================

async function loadKPI() {

    const totalSales =
        document.getElementById("totalSales");

    const totalBrands =
        document.getElementById("totalBrands");

    const totalSegments =
        document.getElementById("totalSegments");

    const totalBodyTypes =
        document.getElementById("totalBodyTypes");

    if (
        !totalSales ||
        !totalBrands ||
        !totalSegments ||
        !totalBodyTypes
    ) {

        return;
    }

    const data =
        await fetchData("/kpi");

    totalSales.innerText =
        Number(data.total_sales)
            .toLocaleString();

    totalBrands.innerText =
        data.total_brands;

    totalSegments.innerText =
        data.total_segments;

    totalBodyTypes.innerText =
        data.total_body_types;
}


// =====================================================
// INITIALIZE
// =====================================================

async function initDashboard() {

    console.log(
        "Vehicle Sales Dashboard started"
    );

    try {

        await loadKPI();

        await renderMakeChart();

        await renderTrendChart();

        await renderSegmentChart();

        await renderBodyChart();

        console.log(
            "All dashboard components loaded."
        );

    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );
    }
}


// =====================================================
// START
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);
