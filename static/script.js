// ============================================
// VEHICLE SALES DASHBOARD - script.js
// ============================================

Chart.defaults.color = "#ffffff";
Chart.defaults.font.family = "'Poppins', sans-serif";

let charts = {};


// ============================================
// COLOR PALETTES
// ============================================

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
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
    "#84CC16",
    "#F97316",
    "#a78245"
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


// ============================================
// FETCH DATA
// ============================================

async function fetchData(url) {

    const response = await fetch(url, {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error(
            `Failed to load ${url}: ${response.status}`
        );
    }

    return await response.json();
}


// ============================================
// DESTROY EXISTING CHART
// ============================================

function destroyChart(name) {

    if (charts[name]) {

        charts[name].destroy();

        charts[name] = null;
    }
}


// ============================================
// BAR CHART TOOLTIP
// ============================================

function barTooltip() {

    return {

        enabled: true,

        backgroundColor: "#021130",

        titleColor: "#f0d7a5",

        bodyColor: "#ffffff",

        borderColor: "#a78245",

        borderWidth: 2,

        padding: 12,

        cornerRadius: 10,

        displayColors: false,

        callbacks: {

            title: function(context) {

                return context[0].label;
            },

            label: function(context) {

                const value =
                    Number(context.parsed.y || 0);

                return `Sales: ${value.toLocaleString()} units`;
            }
        }
    };
}


// ============================================
// PIE CHART TOOLTIP
// ============================================

function pieTooltip() {

    return {

        enabled: true,

        backgroundColor: "#021130",

        titleColor: "#f0d7a5",

        bodyColor: "#ffffff",

        borderColor: "#a78245",

        borderWidth: 2,

        padding: 12,

        cornerRadius: 10,

        callbacks: {

            label: function(context) {

                const value =
                    Number(context.raw || 0);

                return ` ${context.label}: ${value.toLocaleString()} units`;
            }
        }
    };
}


// ============================================
// LINE CHART TOOLTIP
// ============================================

function lineTooltip() {

    return {

        enabled: true,

        backgroundColor: "#021130",

        titleColor: "#f0d7a5",

        bodyColor: "#ffffff",

        borderColor: "#a78245",

        borderWidth: 2,

        padding: 12,

        cornerRadius: 10,

        displayColors: false,

        callbacks: {

            label: function(context) {

                const value =
                    Number(context.parsed.y || 0);

                return `Sales: ${value.toLocaleString()} units`;
            }
        }
    };
}


// ============================================
// TOP 10 BRANDS
// ============================================

async function renderMakeChart() {

    const canvas =
        document.getElementById("makeChart");

    if (!canvas) {
        return;
    }

    destroyChart("makeChart");

    const data =
        await fetchData("/sales_by_make");

    console.log("Brand data:", data);


    charts.makeChart = new Chart(canvas, {

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

                borderColor: "#ffffff",

                borderWidth: 1,

                borderRadius: 8,

                borderSkipped: false,

                hoverBackgroundColor: "#f0d7a5",

                hoverBorderColor: "#ffffff",

                hoverBorderWidth: 2
            }]
        },


        options: {

            responsive: true,

            maintainAspectRatio: false,


            // ==========================
            // BAR ANIMATION
            // ==========================

            animation: {

                duration: 1800,

                easing: "easeOutQuart",

                delay: function(context) {

                    return context.dataIndex * 100;
                }
            },


            interaction: {

                mode: "nearest",

                axis: "x",

                intersect: true
            },


            plugins: {

                legend: {

                    display: false
                },

                tooltip:
                    barTooltip()
            },


            scales: {

                x: {

                    ticks: {

                        color: "#ffffff",

                        font: {

                            size: 12,

                            weight: "500"
                        },

                        autoSkip: false,

                        maxRotation: 45,

                        minRotation: 0
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
        }
    });

    console.log("Brand chart loaded.");
}


// ============================================
// SEGMENT PIE CHART
// ============================================

async function renderSegmentChart() {

    const canvas =
        document.getElementById("segmentChart");

    if (!canvas) {
        return;
    }

    destroyChart("segmentChart");

    const data =
        await fetchData("/sales_by_segment");

    console.log("Segment data:", data);


    charts.segmentChart = new Chart(canvas, {

        type: "pie",

        data: {

            labels: data.labels,

            datasets: [{

                data: data.values,

                backgroundColor:
                    segmentColors.slice(
                        0,
                        data.values.length
                    ),

                borderColor: "#021130",

                borderWidth: 3,

                hoverOffset: 18
            }]
        },


        options: {

            responsive: true,

            maintainAspectRatio: false,


            // ==========================
            // PIE ANIMATION
            // ==========================

            animation: {

                duration: 1800,

                easing: "easeOutQuart",

                animateRotate: true,

                animateScale: true
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


// ============================================
// MONTHLY SALES TREND
// ============================================

async function renderTrendChart() {

    const canvas =
        document.getElementById("trendChart");

    if (!canvas) {
        return;
    }

    destroyChart("trendChart");

    const data =
        await fetchData("/sales_trend");

    console.log("Trend data:", data);


    charts.trendChart = new Chart(canvas, {

        type: "line",

        data: {

            labels: data.labels,

            datasets: [{

                label: "Monthly Sales",

                data: data.values,

                borderColor: "#3B82F6",

                backgroundColor:
                    "rgba(59,130,246,0.15)",

                borderWidth: 3,

                fill: true,

                tension: 0.35,

                pointBackgroundColor:
                    "#a78245",

                pointBorderColor:
                    "#ffffff",

                pointBorderWidth: 2,

                pointRadius: 5,

                pointHoverRadius: 9
            }]
        },


        options: {

            responsive: true,

            maintainAspectRatio: false,


            // ==========================
            // LINE ANIMATION
            // ==========================

            animation: {

                duration: 1800,

                easing: "easeOutQuart"
            },


            interaction: {

                mode: "nearest",

                intersect: false
            },


            plugins: {

                legend: {

                    display: false
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


// ============================================
// BODY TYPE CHART
// ============================================

async function renderBodyChart() {

    const canvas =
        document.getElementById("bodyChart");

    if (!canvas) {
        return;
    }

    destroyChart("bodyChart");

    const data =
        await fetchData("/sales_by_body");

    console.log("Body type data:", data);


    charts.bodyChart = new Chart(canvas, {

        type: "bar",

        data: {

            labels: data.labels,

            datasets: [{

                label: "Sales by Body Type",

                data: data.values,

                // DIFFERENT COLOR FOR EACH BAR
                backgroundColor:
                    bodyColors.slice(
                        0,
                        data.values.length
                    ),

                borderColor: "#ffffff",

                borderWidth: 1,

                borderRadius: 8,

                borderSkipped: false,

                hoverBackgroundColor: "#f0d7a5",

                hoverBorderColor: "#ffffff",

                hoverBorderWidth: 2
            }]
        },


        options: {

            responsive: true,

            maintainAspectRatio: false,


            // ==========================
            // BODY TYPE ANIMATION
            // ==========================

            animation: {

                duration: 1800,

                easing: "easeOutQuart",

                delay: function(context) {

                    return context.dataIndex * 100;
                }
            },


            interaction: {

                mode: "nearest",

                axis: "x",

                intersect: true
            },


            plugins: {

                // No misleading single-color legend
                legend: {

                    display: false
                },

                tooltip:
                    barTooltip()
            },


            scales: {

                x: {

                    ticks: {

                        color: "#ffffff",

                        autoSkip: false,

                        font: {

                            size: 12,

                            weight: "500"
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

    console.log("Body chart loaded.");
}


// ============================================
// KPI
// ============================================

async function loadKPI() {

    const totalSales =
        document.getElementById("totalSales");

    if (!totalSales) {
        return;
    }


    const data =
        await fetchData("/kpi");


    document.getElementById(
        "totalSales"
    ).innerText =
        Number(
            data.total_sales
        ).toLocaleString();


    document.getElementById(
        "totalBrands"
    ).innerText =
        data.total_brands;


    document.getElementById(
        "totalSegments"
    ).innerText =
        data.total_segments;


    document.getElementById(
        "totalBodyTypes"
    ).innerText =
        data.total_body_types;
}


// ============================================
// INITIALIZE EVERYTHING
// ============================================

async function initDashboard() {

    console.log(
        "================================"
    );

    console.log(
        "Vehicle Dashboard started"
    );

    console.log(
        "Chart.js:",
        Chart.version
    );

    console.log(
        "================================"
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
            "DASHBOARD ERROR:",
            error
        );
    }
}


// ============================================
// START
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);
