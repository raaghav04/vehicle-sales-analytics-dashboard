from flask import Flask, render_template, jsonify
import analysis

app = Flask(__name__)


# ---------- Page Routes ----------

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/sales")
def sales_page():
    return render_template("sales.html")


@app.route("/brands")
def brands_page():
    return render_template("brands.html")


@app.route("/segments")
def segments_page():
    return render_template("segments.html")


@app.route("/insights")
def insights_page():
    return render_template("insights.html")


# ---------- API Routes ----------

@app.route("/kpi")
def kpi():
    return jsonify(analysis.kpi_metrics())


@app.route("/sales_by_make")
def sales_by_make():
    return jsonify(analysis.sales_by_make())


@app.route("/sales_by_segment")
def sales_by_segment():
    return jsonify(analysis.sales_by_segment())


@app.route("/sales_by_body")
def sales_by_body():
    return jsonify(analysis.sales_by_body_type())


@app.route("/sales_trend")
def sales_trend():
    return jsonify(analysis.monthly_sales_trend())


@app.route("/insights_data")
def insights_data():
    return jsonify(analysis.insights_data())


if __name__ == "__main__":
    app.run(debug=True)
