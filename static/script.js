// ============================================
// VEHICLE SALES DASHBOARD
// ============================================

Chart.defaults.color = "#ffffff";

Chart.defaults.font.family =
    "'Poppins', sans-serif";


// ============================================
// CHART INSTANCES
// ============================================

let makeChartInstance = null;

let segmentChartInstance = null;

let trendChartInstance = null;

let bodyChartInstance = null;


// ============================================
// COLORS
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
    "#84CC16"

];


const bodyColors = [

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
// FETCH
// ============================================

async function fetchData(url) {

    console.log("Fetching:", url);

    const response = await fetch(url, {
        cache: "no-store"
    });

    if (!response.ok) {

        throw new Error(
            `Failed to load ${url}: ${response.status}`
        );

    }

    const data = await response.json();

    console.log("Received:", data);

    return data;
}


// ============================================
// TOOLTIP
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

                const value =
                    Number(context.raw || 0);

                let text =
                    ` Sales: ${value.toLocaleString()}`;


                // Percentage for pie/doughnut

                if (
                    context.chart.config.type === "pie" ||
                    context.chart.config.type === "doughnut"
                ) {

                    const values =
                        context.chart.data.datasets[0].data;

                    const total =
                        values.reduce(
                            (sum, value) =>
                                sum + Number(value || 0),
                            0
                        );

                    const percentage =
                        total > 0
                            ? ((value / total) * 100).toFixed(1)
                            : "0.0";

                    text +=
                        ` | Share: ${percentage}%`;

                }


                return text;

            }

        }

    };

}


// ============================================
// BRAND BAR CHART
// ============================================

async function renderMakeChart() {

    const canvas =
        document.getElementById("makeChart");


    if (!canvas) {

        console.log(
            "makeChart not found."
        );

        return;

    }


    const data =
        await fetchData("/sales_by_make");


    if (makeChartInstance) {

        makeChartInstance.destroy();

    }


    makeChartInstance =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels:
                    data.labels,

                datasets: [

                    {

                        label:
                            "Top 10 Brands by Sales",

                        data:
                            data.values,

                        backgroundColor:
                            brandColors,

                        borderColor:
                            "#ffffff",

                        borderWidth:
                            1.5,

                        borderRadius:
                            10,

                        hoverBackgroundColor:
                            "#f0d7a5"

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,


                // ONLY chart animation

                animation: {

                    duration: 1400,

                    easing: "easeOutQuart"

                },


                interaction: {

                    mode: "nearest",

                    intersect: true

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
        "Brand chart loaded."
    );

}


// ============================================
// MARKET SHARE PIE CHART
// ============================================

async function renderSegmentChart() {

    const canvas =
        document.getElementById("segmentChart");


    if (!canvas) {

        console.log(
            "segmentChart not found."
        );

        return;

    }


    const data =
        await fetchData("/sales_by_segment");


    if (segmentChartInstance) {

        segmentChartInstance.destroy();

    }


    segmentChartInstance =
        new Chart(canvas, {

            type: "pie",

            data: {

                labels:
                    data.labels,

                datasets: [

                    {

                        data:
                            data.values,

                        backgroundColor:
                            segmentColors,

                        borderColor:
                            "#021130",

                        borderWidth:
                            3,

                        hoverOffset:
                            18

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,


                // ONLY chart animation

                animation: {

                    duration: 1000,

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

                            padding: 15,

                            font: {

                                size: 12

                            }

                        }

                    },


                    tooltip:
                        commonTooltip()

                }

            }

        });


    console.log(
        "Market share chart loaded."
    );

}


// ============================================
// TREND CHART
// ============================================

async function renderTrendChart() {

    const canvas =
        document.getElementById("trendChart");


    if (!canvas) {

        return;

    }


    const data =
        await fetchData("/sales_trend");


    if (trendChartInstance) {

        trendChartInstance.destroy();

    }


    trendChartInstance =
        new Chart(canvas, {

            type: "line",

            data: {

                labels:
                    data.labels,

                datasets: [

                    {

                        label:
                            "Monthly Sales Trend",

                        data:
                            data.values,

                        borderColor:
                            "#3B82F6",

                        borderWidth:
                            3,

                        backgroundColor:
                            "rgba(59,130,246,0.18)",

                        fill:
                            true,

                        tension:
                            0.32,

                        pointBackgroundColor:
                            "#60A5FA",

                        pointBorderColor:
                            "#ffffff",

                        pointBorderWidth:
                            2,

                        pointRadius:
                            5,

                        pointHoverRadius:
                            10,

                        pointHitRadius:
                            20

                    }

                ]

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

                            color: "#ffffff"

                        },

                        grid: {

                            color:
                                "rgba(255,255,255,0.08)"

                        }

                    },

                    y: {

                        beginAtZero: true,

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


// ============================================
// BODY TYPE CHART
// ============================================

async function renderBodyChart() {

    const canvas =
        document.getElementById("bodyChart");


    if (!canvas) {

        return;

    }


    const data =
        await fetchData("/sales_by_body");


    if (bodyChartInstance) {

        bodyChartInstance.destroy();

    }


    bodyChartInstance =
        new Chart(canvas, {

            type: "doughnut",

            data: {

                labels:
                    data.labels,

                datasets: [

                    {

                        data:
                            data.values,

                        backgroundColor:
                            bodyColors,

                        borderColor:
                            "#021130",

                        borderWidth:
                            3,

                        hoverOffset:
                            18

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "58%",

                animation: {

                    duration: 1000,

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
                        commonTooltip()

                }

            }

        });

}


// ============================================
// KPI
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
        Number(data.total_sales).toLocaleString();

    totalBrands.innerText =
        data.total_brands;

    totalSegments.innerText =
        data.total_segments;

    totalBodyTypes.innerText =
        data.total_body_types;

}


// ============================================
// START
// ============================================

async function initDashboard() {

    console.log(
        "Vehicle dashboard started"
    );


    try {

        await Promise.all([

            loadKPI(),

            renderMakeChart(),

            renderTrendChart(),

            renderSegmentChart(),

            renderBodyChart()

        ]);


        console.log(
            "All charts loaded."
        );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    initDashboard
);
