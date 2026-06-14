import pandas as pd
from functools import lru_cache


@lru_cache(maxsize=1)
def load_data():
    df = pd.read_excel("data/vehicle_sales.xlsx")
    df.columns = df.columns.str.strip()

    if "Months" in df.columns:
        df["Months"] = df["Months"].astype(str).str.strip()

    if "Make" in df.columns:
        df["Make"] = df["Make"].astype(str).str.strip()

    if "Segment" in df.columns:
        df["Segment"] = df["Segment"].astype(str).str.strip()

    if "Body Type" in df.columns:
        df["Body Type"] = df["Body Type"].astype(str).str.strip()

    return df


def kpi_metrics():
    df = load_data()
    return {
        "total_sales": int(df["Sales"].sum()),
        "total_brands": int(df["Make"].nunique()),
        "total_segments": int(df["Segment"].nunique()),
        "total_body_types": int(df["Body Type"].nunique())
    }


def sales_by_make():
    df = load_data()

    result = (
        df.groupby("Make")["Sales"]
        .sum()
        .sort_values(ascending=False)
        .head(10)
        .reset_index()
    )

    return {
        "labels": result["Make"].tolist(),
        "values": result["Sales"].tolist()
    }


def sales_by_segment():
    df = load_data()

    segment_map = {
        "A": "Entry Level Cars",
        "A1": "Mini Cars",
        "A2": "Small Hatchbacks",
        "A3": "Compact Hatchbacks",
        "B1": "Small Sedans",
        "B2": "Mid-size Cars",
        "C1": "Compact Cars",
        "C2": "Upper Compact Cars",
        "D1": "Executive Cars",
        "D2": "Premium Cars",
        "SUV": "SUV",
        "MUV": "MUV"
    }

    df = df.copy()
    df["Segment"] = df["Segment"].map(segment_map).fillna(df["Segment"])

    result = (
        df.groupby("Segment")["Sales"]
        .sum()
        .sort_values(ascending=False)
        .reset_index()
    )

    return {
        "labels": result["Segment"].tolist(),
        "values": result["Sales"].tolist()
    }


def sales_by_body_type():
    df = load_data()

    result = (
        df.groupby("Body Type")["Sales"]
        .sum()
        .sort_values(ascending=False)
        .reset_index()
    )

    return {
        "labels": result["Body Type"].tolist(),
        "values": result["Sales"].tolist()
    }


def monthly_sales_trend():
    df = load_data()

    month_order = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    df = df.copy()
    df["Months"] = pd.Categorical(df["Months"], categories=month_order, ordered=True)

    result = (
        df.groupby("Months", observed=False)["Sales"]
        .sum()
        .reset_index()
        .sort_values("Months")
    )

    return {
        "labels": result["Months"].astype(str).tolist(),
        "values": result["Sales"].tolist()
    }


def insights_data():
    df = load_data()

    # Top brand
    top_brand = df.groupby("Make")["Sales"].sum().idxmax()
    top_brand_sales = int(df.groupby("Make")["Sales"].sum().max())

    # Top model
    top_model = df.groupby("Model")["Sales"].sum().idxmax()
    top_model_sales = int(df.groupby("Model")["Sales"].sum().max())

    # Best month
    month_order = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    df2 = df.copy()
    df2["Months"] = pd.Categorical(df2["Months"], categories=month_order, ordered=True)
    monthly = df2.groupby("Months", observed=False)["Sales"].sum()
    best_month = str(monthly.idxmax())
    best_month_sales = int(monthly.max())

    # Top body type
    top_body = df.groupby("Body Type")["Sales"].sum().idxmax()
    top_body_sales = int(df.groupby("Body Type")["Sales"].sum().max())

    # Market share of top brand
    total = int(df["Sales"].sum())
    top_brand_share = round((top_brand_sales / total) * 100, 1)

    # Avg MoM growth (excluding -100 outliers)
    avg_mom = float(round(df[df["MoM %"] > -100]["MoM %"].mean(), 1))

    return {
        "top_brand": top_brand,
        "top_brand_sales": top_brand_sales,
        "top_brand_share": top_brand_share,
        "top_model": top_model,
        "top_model_sales": top_model_sales,
        "best_month": best_month,
        "best_month_sales": best_month_sales,
        "top_body_type": top_body,
        "top_body_type_sales": top_body_sales,
        "avg_mom_growth": avg_mom,
        "total_sales": total
    }
