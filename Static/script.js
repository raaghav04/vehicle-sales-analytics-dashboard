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

function getPageType() {
    const path = window.location.pathname || "/";
    const page = path.replace(/\/+$|^\//g, "").split("/")[0];
    return page || "dashboard";
}

function getChartAnimation(chartName) {

    if (chartName === "make") {
        return {
            duration: 1500,
            easing: "easeOutBounce"
        };
    }

    if (chartName === "segment") {
        return {
            duration: 1500,
            easing: "easeOutQuart"
        };
    }

    if (chartName === "body") {
        return {
            duration: 1500,
            easing: "easeOutQuart"
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
async function fetchData(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load ${url}`);
    }

    return await response.json();
}

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

function commonGridColor() {
    return "rgba(255,255,255,0.08)";
}

function commonTickStyle() {
    return {
        color: "#ffffff",
        font: {
            size: 12
        }
    };
}

function commonTooltip() {
    return {
        enabled: true,
        mode: "nearest",
        intersect: true,
        position: "nearest",
        backgroundColor: "#021130",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#a78245",
        borderWidth: 1.5,
        padding: 12,
        cornerRadius: 10,
        displayColors: true,
        animation: {
            duration: 120,
            easing: "easeOutCubic"
        },
        callbacks: {
            label: function(context) {
                const value =
                    context.parsed?.y ??
                    context.parsed ??
                    context.raw;

                return `${context.label}: ${Number(value).toLocaleString()}`;
            }
        }
    };
}

function destroyChart(id) {
    if (chartInstances[id]) {
        chartInstances[id].destroy();
        delete chartInstances[id];
    }
}

// Clear any transform/transition styles on the canvas with the given id
function resetCanvasStyle(id) {
    const el = document.getElementById(id);
    if (el) {
        el.style.transition = "";
        el.style.transform = "";
        el.style.transformOrigin = "";
    }
}

async function loadKPI() {
    const totalSalesEl = document.getElementById("totalSales");
    const totalBrandsEl = document.getElementById("totalBrands");
    const totalSegmentsEl = document.getElementById("totalSegments");
    const totalBodyTypesEl = document.getElementById("totalBodyTypes");

    if (
        !totalSalesEl ||
        !totalBrandsEl ||
        !totalSegmentsEl ||
        !totalBodyTypesEl
    ) {
        return;
    }

    const data = await fetchData("/kpi");

    totalSalesEl.innerText = data.total_sales.toLocaleString();
    totalBrandsEl.innerText = data.total_brands;
    totalSegmentsEl.innerText = data.total_segments;
    totalBodyTypesEl.innerText = data.total_body_types;
}

async function renderMakeChart() {
    const canvas = document.getElementById("makeChart");
    if (!canvas) return;

    destroyChart("makeChart");

    const data = await fetchData("/sales_by_make");

    chartInstances["makeChart"] = new Chart(canvas, {
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
            animation: getChartAnimation("make"),
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: "#ffffff"
                    }
                },
                tooltip: {
                    ...commonTooltip(),
                    mode: "nearest",
                    intersect: true,
                    position: "nearest"
                }
            },
            scales: {
                x: {
                    ticks: commonTickStyle(),
                    grid: {
                        color: commonGridColor()
                    }
                },
                y: {
                    ticks: commonTickStyle(),
                    grid: {
                        color: commonGridColor()
                    }
                }
            }
        }
    });

    console.log("Make chart loaded");
}

async function renderSegmentChart() {
    const canvas = document.getElementById("segmentChart");
    if (!canvas) return;

    destroyChart("segmentChart");

    const data = await fetchData("/sales_by_segment");
    console.log("Segment chart loaded");

    chartInstances["segmentChart"] = new Chart(canvas, {
        type: "pie",
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: segmentPalette,
                borderColor: "#021130",
                borderWidth: 3,
                hoverOffset: 25
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: getChartAnimation("segment"),
            plugins: {
                legend: commonLegendStyle(),
                tooltip: commonTooltip()
            }
        }
    });
}

async function renderBodyChart() {
    const canvas = document.getElementById("bodyChart");
    if (!canvas) return;

    destroyChart("bodyChart");
    resetCanvasStyle("bodyChart");

    const data = await fetchData("/sales_by_body");
    console.log("Body chart loaded");

    chartInstances["bodyChart"] = new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: bodyPalette,
                borderColor: "#021130",
                borderWidth: 3,
                hoverOffset: 25
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "58%",
            animation: getChartAnimation("body"),
            plugins: {
                legend: commonLegendStyle(),
                tooltip: commonTooltip()
            }
        }
    });

}

async function renderTrendChart() {
    const canvas = document.getElementById("trendChart");
    if (!canvas) return;

    destroyChart("trendChart");

    const data = await fetchData("/sales_trend");
    console.log("Trend chart loaded");

    chartInstances["trendChart"] = new Chart(canvas, {
        type: "line",
        data: {
            labels: data.labels,
            datasets: [{
                label: "Monthly Sales Trend",
                data: data.values,
                borderColor: "#3B82F6",
                borderWidth: 3,
                backgroundColor: "rgba(59,130,246,0.18)",
                fill: true,
                tension: 0.32,
                pointBackgroundColor: "#60A5FA",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 12,
                pointHitRadius: 22,
                pointHoverBorderWidth: 3,
                pointStyle: "circle",
                hoverBackgroundColor: "#ffffff",
                hoverBorderColor: "#3B82F6"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: getChartAnimation("trend"),
            interaction: {
                mode: "nearest",
                intersect: true
            },
            hover: {
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
                tooltip: {
                    ...commonTooltip(),
                    mode: "nearest",
                    intersect: true,
                    position: "nearest"
                }
            },
            scales: {
                x: {
                    ticks: commonTickStyle(),
                    grid: {
                        color: commonGridColor()
                    }
                },
                y: {
                    ticks: commonTickStyle(),
                    grid: {
                        color: commonGridColor()
                    }
                }
            }
        }
    });
}


async function initDashboard() {
    const dashboardEl = document.querySelector(".dashboard");
    if (!dashboardEl) return;

    try {
        await loadKPI();

        await renderMakeChart();
await renderSegmentChart();
await renderBodyChart();
await renderTrendChart();
        
    } catch (error) {
        console.error("Dashboard load error:", error);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(() => {
        initDashboard();
    });
});