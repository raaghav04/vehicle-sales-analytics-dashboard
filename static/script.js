Chart.defaults.color = "#ffffff";
Chart.defaults.font.family = "'Poppins', sans-serif";
Chart.defaults.devicePixelRatio = window.devicePixelRatio || 2;

Chart.defaults.animation = {
    duration: 600,
    easing: "easeOutCubic"
};

Chart.defaults.resizeDelay = 0;

Chart.defaults.transitions = {
    active: {
        animation: {
            duration: 120,
            easing: "easeOutCubic"
        }
    }
};

let chartInstances = {};


// ======================================================
// COLORS
// ======================================================

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


// ======================================================
// PAGE
// ======================================================

function getPageType() {

    const path = window.location.pathname || "/";

    const page = path
        .replace(/\/+$|^\//g, "")
        .split("/")[0];

    return page || "dashboard";
}


// ======================================================
// CHART ANIMATION
// ======================================================

function getChartAnimation(chartName) {

    if (chartName === "make") {
        return {
            duration: 1500,
            easing: "easeOutBounce"
        };
    }

    if (chartName === "segment") {
        return {
            duration: 800,
            easing: "easeOutCubic"
        };
    }

    if (chartName === "body") {
        return {
            duration: 800,
            easing: "easeOutCubic"
        };
    }

    if (chartName === "trend") {
        return {
            duration: 2000,
            easing: "easeInOutQuart"
        };
    }

    return {
        duration: 1500,
        easing: "easeOutQuart"
    };
}


// ======================================================
// FETCH
// ======================================================

async function fetchData(url) {

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load ${url}`);
    }

    return await response.json();
}


// ======================================================
// LEGEND
// ======================================================

function commonLegendStyle() {

    return {

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
    };
}


// ======================================================
// GRID
// ======================================================

function commonGridColor() {

    return "rgba(255,255,255,0.08)";
}


// ======================================================
// TICKS
// ======================================================

function commonTickStyle() {

    return {

        color: "#ffffff",

        font: {
            size: 12
        }
    };
}


// ======================================================
// TOOLTIP
// ======================================================

function commonTooltip() {

    return {

        // IMPORTANT
        enabled: true,

        mode: "nearest",

        intersect: false,

        position: "nearest",


        // TOOLTIP COLORS

        backgroundColor: "#021130",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        borderColor: "#a78245",

        borderWidth: 2,

        padding: 14,

        cornerRadius: 10,

        displayColors: true,


        // TITLE FONT

        titleFont: {

            family: "'Poppins', sans-serif",

            size: 14,

            weight: "600"
        },


        // BODY FONT

        bodyFont: {

            family: "'Poppins', sans-serif",

            size: 13,

            weight: "500"
        },


        // TOOLTIP CONTENT

        callbacks: {

            title: function(context) {

                if (!context || !context.length) {
                    return "";
                }

                return context[0].label;
            },


            label: function(context) {

                const chart = context.chart;

                const dataset =
                    chart.data.datasets[context.datasetIndex];


                // PIE / DOUGHNUT

                if (
                    chart.config.type === "pie" ||
                    chart.config.type === "doughnut"
                ) {

                    const value = Number(context.raw);

                    const total = dataset.data.reduce(
                        (sum, item) => sum + Number(item),
                        0
                    );

                    const percentage =
                        total > 0
                            ? ((value / total) * 100).toFixed(1)
                            : "0.0";


                    return [
                        `Sales: ${value.toLocaleString()}`,
                        `Share: ${percentage}%`
                    ];
                }


                // BAR / LINE

                const value = Number(
                    context.parsed?.y ??
                    context.raw
                );


                return `Sales: ${value.toLocaleString()}`;
            }
        }
    };
}


// ======================================================
// DESTROY CHART
// ======================================================

function destroyChart(id) {

    if (chartInstances[id]) {

        chartInstances[id].destroy();

        delete chartInstances[id];
    }
}


// ======================================================
// RESET CANVAS STYLE
// ======================================================

function resetCanvasStyle(id) {

    const el = document.getElementById(id);

    if (el) {

        el.style.transition = "";

        el.style.transform = "";

        el.style.transformOrigin = "";
    }
}


// ======================================================
// KPI
// ======================================================

async function loadKPI() {

    const totalSalesEl =
        document.getElementById("totalSales");

    const totalBrandsEl =
        document.getElementById("totalBrands");

    const totalSegmentsEl =
        document.getElementById("totalSegments");

    const totalBodyTypesEl =
        document.getElementById("totalBodyTypes");


    if (
        !totalSalesEl ||
        !totalBrandsEl ||
        !totalSegmentsEl ||
        !totalBodyTypesEl
    ) {
        return;
    }


    const data = await fetchData("/kpi");


    totalSalesEl.innerText =
        data.total_sales.toLocaleString();

    totalBrandsEl.innerText =
        data.total_brands;

    totalSegmentsEl.innerText =
        data.total_segments;

    totalBodyTypesEl.innerText =
        data.total_body_types;
}


// ======================================================
// MAKE / BRAND CHART
// ======================================================

async function renderMakeChart() {

    const canvas =
        document.getElementById("makeChart");

    if (!canvas) return;


    destroyChart("makeChart");


    const data =
        await fetchData("/sales_by_make");


    chartInstances["makeChart"] = new Chart(canvas, {

        type: "bar",


        data: {

            labels: data.labels,

            datasets: [

                {

                    label: "Top 10 Brands by Sales",

                    data: data.values,

                    backgroundColor: brandPalette,

                    borderColor: "#ffffff",

                    borderWidth: 1.5,

                    borderRadius: 10,

                    hoverBackgroundColor: "#f0d7a5"
                }

            ]
        },


        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation:
                getChartAnimation("make"),


            // HOVER DETECTION

            interaction: {

                mode: "nearest",

                intersect: false
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

                    ticks:
                        commonTickStyle(),

                    grid: {

                        color:
                            commonGridColor()
                    }
                },


                y: {

                    ticks:
                        commonTickStyle(),

                    grid: {

                        color:
                            commonGridColor()
                    }
                }
            }
        }
    });


    console.log("Make chart loaded");
}


// ======================================================
// SEGMENT PIE CHART
// ======================================================

async function renderSegmentChart() {

    const canvas =
        document.getElementById("segmentChart");

    if (!canvas) return;


    destroyChart("segmentChart");


    const data =
        await fetchData("/sales_by_segment");


    chartInstances["segmentChart"] =
        new Chart(canvas, {

            type: "pie",


            data: {

                labels: data.labels,

                datasets: [

                    {

                        data: data.values,

                        backgroundColor:
                            segmentPalette,

                        borderColor:
                            "#021130",

                        borderWidth: 3,

                        hoverOffset: 25
                    }
                ]
            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation:
                    getChartAnimation("segment"),


                // HOVER

                interaction: {

                    mode: "nearest",

                    intersect: false
                },


                plugins: {

                    legend:
                        commonLegendStyle(),

                    tooltip:
                        commonTooltip()
                }
            }
        });


    console.log("Segment chart loaded");
}


// ======================================================
// BODY TYPE DOUGHNUT
// ======================================================

async function renderBodyChart() {

    const canvas =
        document.getElementById("bodyChart");

    if (!canvas) return;


    destroyChart("bodyChart");


    resetCanvasStyle("bodyChart");


    const data =
        await fetchData("/sales_by_body");


    chartInstances["bodyChart"] =
        new Chart(canvas, {

            type: "doughnut",


            data: {

                labels: data.labels,

                datasets: [

                    {

                        data: data.values,

                        backgroundColor:
                            bodyPalette,

                        borderColor:
                            "#021130",

                        borderWidth: 3,

                        hoverOffset: 25
                    }
                ]
            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "58%",

                animation:
                    getChartAnimation("body"),


                // HOVER

                interaction: {

                    mode: "nearest",

                    intersect: false
                },


                plugins: {

                    legend:
                        commonLegendStyle(),

                    tooltip:
                        commonTooltip()
                }
            }
        });


    console.log("Body chart loaded");
}


// ======================================================
// SALES TREND LINE CHART
// ======================================================

async function renderTrendChart() {

    const canvas =
        document.getElementById("trendChart");

    if (!canvas) return;


    destroyChart("trendChart");


    const data =
        await fetchData("/sales_trend");


    chartInstances["trendChart"] =
        new Chart(canvas, {

            type: "line",


            data: {

                labels: data.labels,

                datasets: [

                    {

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

                        pointHoverRadius: 12,

                        pointHitRadius: 22,

                        pointHoverBorderWidth: 3,

                        pointStyle: "circle",

                        hoverBackgroundColor:
                            "#ffffff",

                        hoverBorderColor:
                            "#3B82F6"
                    }
                ]
            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation:
                    getChartAnimation("trend"),


                // HOVER

                interaction: {

                    mode: "nearest",

                    intersect: false
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

                        ticks:
                            commonTickStyle(),

                        grid: {

                            color:
                                commonGridColor()
                        }
                    },


                    y: {

                        ticks:
                            commonTickStyle(),

                        grid: {

                            color:
                                commonGridColor()
                        }
                    }
                }
            }
        });


    console.log("Trend chart loaded");
}


// ======================================================
// DASHBOARD INITIALIZATION
// ======================================================

let dashboardLoading = false;


async function initDashboard() {

    const dashboardEl =
        document.querySelector(".dashboard");


    if (!dashboardEl) return;


    if (dashboardLoading) return;


    dashboardLoading = true;


    try {

        await loadKPI();


        await Promise.all([

            renderMakeChart(),

            renderSegmentChart(),

            renderBodyChart(),

            renderTrendChart()

        ]);


        console.log(
            "Dashboard fully loaded"
        );

    } catch (error) {

        console.error(
            "Dashboard load error:",
            error
        );

    } finally {

        dashboardLoading = false;
    }
}


// ======================================================
// START
// ======================================================

function startDashboard() {

    requestAnimationFrame(() => {

        initDashboard();

    });
}


window.addEventListener(
    "DOMContentLoaded",
    startDashboard
);


window.addEventListener(
    "pageshow",
    (event) => {

        if (event.persisted) {

            dashboardLoading = false;


            setTimeout(() => {

                startDashboard();

            }, 50);
        }
    }
);
