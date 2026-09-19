def calculate_priority(
    population,
    water_level,
    food_level,
    medicine_level,
    accessibility
):
    population_score = min(population / 1000, 100)

    water_shortage = 100 - water_level
    food_shortage = 100 - food_level
    medicine_shortage = 100 - medicine_level
    access_risk = 100 - accessibility

    score = (
        population_score * 0.30
        + water_shortage * 0.20
        + food_shortage * 0.15
        + medicine_shortage * 0.20
        + access_risk * 0.15
    )

    return round(min(score, 100), 1)


def get_priority_level(score):

    if score >= 80:
        return "CRITICAL"

    if score >= 60:
        return "ELEVATED"

    return "STABLE"


def optimize_resources(zones):

    total_water = 25000
    total_food = 18000
    total_medicine = 5000

    scored_zones = []

    for zone in zones:

        score = calculate_priority(
            zone["population"],
            zone["water"],
            zone["food"],
            zone["medicine"],
            zone["accessibility"]
        )

        scored_zones.append({
            **zone,
            "priority": score
        })

    scored_zones.sort(
        key=lambda x: x["priority"],
        reverse=True
    )

    total_score = sum(
        zone["priority"]
        for zone in scored_zones
    )

    allocations = []

    for zone in scored_zones:

        share = zone["priority"] / total_score

        water = round(total_water * share)
        food = round(total_food * share)
        medicine = round(total_medicine * share)

        # ------------------------------------------
        # DECISION EXPLANATION
        # ------------------------------------------

        reasons = []

        if zone["population"] >= 15000:
            reasons.append("large affected population")

        if zone["water"] < 30:
            reasons.append("severe water shortage")

        elif zone["water"] < 50:
            reasons.append("water shortage")

        if zone["food"] < 40:
            reasons.append("critical food shortage")

        elif zone["food"] < 60:
            reasons.append("food availability is limited")

        if zone["medicine"] < 30:
            reasons.append("critical medicine shortage")

        elif zone["medicine"] < 50:
            reasons.append("medicine availability is limited")

        if zone["accessibility"] < 40:
            reasons.append("difficult physical access")

        elif zone["accessibility"] < 60:
            reasons.append("restricted accessibility")

        if not reasons:
            reasons.append("relatively stable conditions")

        explanation = "Priority based on " + ", ".join(reasons) + "."

        # ------------------------------------------
        # PRIORITY CATEGORY
        # ------------------------------------------

        if zone["priority"] >= 80:

            reason = (
                "CRITICAL RESPONSE: "
                + explanation
            )

        elif zone["priority"] >= 60:

            reason = (
                "ELEVATED RESPONSE: "
                + explanation
            )

        else:

            reason = (
                "STABLE RESPONSE: "
                + explanation
            )

        allocations.append({
            "zone": zone["id"],
            "priority": zone["priority"],
            "water": water,
            "food": food,
            "medicine": medicine,
            "reason": reason,
            "explanation": explanation
        })

    return allocations

# ==========================================
# DEMAND FORECAST ENGINE
# ==========================================

def forecast_water_demand(
    population,
    water_level
):

    # Base emergency water requirement.
    # Approx. 3 litres/person/day for this demo.
    base_daily_demand = population * 3

    # Disaster severity increases future demand.
    shortage_factor = (100 - water_level) / 100

    growth_rate = 0.08 + (shortage_factor * 0.12)

    forecasts = []

    time_points = [
        ("NOW", 0),
        ("6 HOURS", 6),
        ("12 HOURS", 12),
        ("18 HOURS", 18),
        ("24 HOURS", 24)
    ]

    for label, hours in time_points:

        growth = 1 + (
            growth_rate * (hours / 24)
        )

        demand = base_daily_demand * growth

        forecasts.append({
            "time": label,
            "hours": hours,
            "demand": round(demand)
        })

    final_demand = forecasts[-1]["demand"]

    if final_demand > base_daily_demand * 1.20:
        risk = "HIGH"

    elif final_demand > base_daily_demand * 1.10:
        risk = "MODERATE"

    else:
        risk = "LOW"

    return {
        "population": population,
        "current_water_level": water_level,
        "base_demand": round(base_daily_demand),
        "risk": risk,
        "forecast": forecasts
    }
# ==========================================
# DISASTER SCENARIO ENGINE
# ==========================================

SCENARIOS = {

    "flood": {
        "name": "MAJOR FLOOD",
        "population": 18000,
        "water": 18,
        "food": 35,
        "medicine": 25,
        "accessibility": 35
    },

    "heatwave": {
        "name": "EXTREME HEATWAVE",
        "population": 15000,
        "water": 20,
        "food": 60,
        "medicine": 55,
        "accessibility": 75
    },

    "earthquake": {
        "name": "EARTHQUAKE",
        "population": 16000,
        "water": 40,
        "food": 45,
        "medicine": 20,
        "accessibility": 25
    }

}


def get_scenario(name):

    return SCENARIOS.get(name)
# ==========================================
# RISK ESCALATION ENGINE
# ==========================================

def calculate_risk_escalation(
    population,
    water,
    food,
    medicine,
    accessibility
):

    current_score = calculate_priority(
        population,
        water,
        food,
        medicine,
        accessibility
    )

    # Simulate deterioration of conditions
    future_water = max(water - 15, 0)
    future_food = max(food - 10, 0)
    future_medicine = max(medicine - 12, 0)
    future_accessibility = max(accessibility - 15, 0)

    future_score = calculate_priority(
        population,
        future_water,
        future_food,
        future_medicine,
        future_accessibility
    )

    increase = round(
        future_score - current_score,
        1
    )

    current_level = get_priority_level(current_score)
    future_level = get_priority_level(future_score)

    if future_level != current_level:

        escalation = "ESCALATION DETECTED"

    elif increase >= 5:

        escalation = "RISK INCREASING"

    else:

        escalation = "RISK STABLE"

    return {
        "current_priority": current_score,
        "future_priority": future_score,
        "priority_increase": increase,
        "current_level": current_level,
        "future_level": future_level,
        "escalation": escalation,
        "projected_conditions": {
            "water": future_water,
            "food": future_food,
            "medicine": future_medicine,
            "accessibility": future_accessibility
        }
    }
# ==========================================
# RESPONSE PLAN ENGINE
# ==========================================

def generate_response_plan(
    zone_id,
    population,
    water,
    food,
    medicine,
    accessibility
):

    priority = calculate_priority(
        population,
        water,
        food,
        medicine,
        accessibility
    )

    level = get_priority_level(priority)

    actions = []

    # Water
    if water < 30:
        actions.append("Deploy emergency water supply")
    elif water < 50:
        actions.append("Increase water distribution")

    # Food
    if food < 30:
        actions.append("Deploy emergency food packages")
    elif food < 50:
        actions.append("Increase food distribution")

    # Medicine
    if medicine < 30:
        actions.append("Deploy medical supplies")
    elif medicine < 50:
        actions.append("Increase medical supply")

    # Accessibility
    if accessibility < 30:
        actions.append("Prioritize access-route clearance")
    elif accessibility < 50:
        actions.append("Coordinate alternative access routes")

    # Population
    if population >= 15000:
        actions.append("Increase response capacity for large population")

    if not actions:
        actions.append("Continue monitoring zone conditions")

    # Urgency
    if priority >= 80:
        urgency = "IMMEDIATE"
    elif priority >= 60:
        urgency = "HIGH"
    else:
        urgency = "MONITOR"

    return {
        "zone": zone_id,
        "priority": priority,
        "level": level,
        "urgency": urgency,
        "actions": actions,
        "conditions": {
            "population": population,
            "water": water,
            "food": food,
            "medicine": medicine,
            "accessibility": accessibility
        }
    }