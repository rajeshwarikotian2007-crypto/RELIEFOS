from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from pathlib import Path

from backend.engine import (
    calculate_priority,
    get_priority_level,
    optimize_resources,
    forecast_water_demand,
    get_scenario
)
from backend.data import zones


app = FastAPI(
    title="RELIEFOS",
    description="Disaster Response Intelligence System",
    version="1.0.0"
)


BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"


@app.get("/api/health")
def health():

    return {
        "status": "healthy",
        "system": "RELIEFOS"
    }


@app.get("/api/status")
def status():

    return {
        "affected": 67000,
        "critical_zones": 3,
        "active_zones": 5,
        "resources": 4
    }


@app.get("/api/zones")
def get_zones():

    results = []

    for zone in zones:

        score = calculate_priority(
            zone["population"],
            zone["water"],
            zone["food"],
            zone["medicine"],
            zone["accessibility"]
        )

        results.append({
            **zone,
            "priority": score,
            "level": get_priority_level(score)
        })

    results.sort(
        key=lambda x: x["priority"],
        reverse=True
    )

    return {
        "zones": results
    }


@app.post("/api/simulate")
def simulate(data: dict):

    population = data.get("population", 12000)
    water = data.get("water", 50)
    food = data.get("food", 50)
    medicine = data.get("medicine", 50)
    accessibility = data.get("accessibility", 50)

    score = calculate_priority(
        population,
        water,
        food,
        medicine,
        accessibility
    )

    return {
        "priority": score,
        "level": get_priority_level(score),
        "population": population,
        "water": water,
        "food": food,
        "medicine": medicine,
        "accessibility": accessibility
    }

@app.get("/api/optimize")
def optimize():

    allocations = optimize_resources(zones)

    return {
        "total_water": 25000,
        "total_food": 18000,
        "total_medicine": 5000,
        "allocations": allocations
    }
@app.post("/api/forecast")
def forecast(data: dict):

    population = data.get(
        "population",
        12000
    )

    water = data.get(
        "water",
        50
    )

    return forecast_water_demand(
        population,
        water
    )
@app.get("/api/scenario/{scenario_name}")
def scenario(scenario_name: str):

    scenario_data = get_scenario(
        scenario_name
    )

    if not scenario_data:

        return {
            "error": "Scenario not found"
        }

    score = calculate_priority(
        scenario_data["population"],
        scenario_data["water"],
        scenario_data["food"],
        scenario_data["medicine"],
        scenario_data["accessibility"]
    )

    return {
        **scenario_data,
        "priority": score,
        "level": get_priority_level(score)
    }
@app.post("/api/risk")
def risk_analysis(data: dict):

    population = data.get("population", 12000)
    water = data.get("water", 50)
    food = data.get("food", 50)
    medicine = data.get("medicine", 50)
    accessibility = data.get("accessibility", 50)

    from engine import calculate_risk_escalation

    return calculate_risk_escalation(
        population,
        water,
        food,
        medicine,
        accessibility
    )
@app.post("/api/response-plan")
def response_plan(data: dict):

    from engine import generate_response_plan

    return generate_response_plan(
        data.get("zone", "UNKNOWN"),
        data.get("population", 12000),
        data.get("water", 50),
        data.get("food", 50),
        data.get("medicine", 50),
        data.get("accessibility", 50)
    )
app.mount(
    "/static",
    StaticFiles(directory=FRONTEND_DIR),
    name="static"
)


@app.get("/")
def home():

    return FileResponse(
        FRONTEND_DIR / "index.html"
    )