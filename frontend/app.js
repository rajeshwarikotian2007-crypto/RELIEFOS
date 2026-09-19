async function loadZones() {

    try {

        const response = await fetch("/api/zones");

        const data = await response.json();

        console.log("RELIEFOS ZONE DATA:", data);

        updateDashboard(data.zones);

    } catch (error) {

        console.error(
            "Unable to connect to Relief Engine:",
            error
        );

    }
}


function updateDashboard(zones) {

    const priorityItems =
        document.querySelectorAll(".priority-item");


    zones.forEach((zone, index) => {

        if (!priorityItems[index]) {
            return;
        }


        const item = priorityItems[index];

        const name =
            item.querySelector(".zone-name strong");

        const description =
            item.querySelector(".zone-name small");

        const score =
            item.querySelector(".score");


        name.textContent =
            `ZONE ${zone.id}`;

        description.textContent =
            zone.level;

        score.textContent =
            zone.priority;


        score.className = "score";


        if (zone.priority >= 80) {

            score.classList.add(
                "critical-score"
            );

        } else if (zone.priority >= 60) {

            score.classList.add(
                "elevated-score"
            );

        } else {

            score.classList.add(
                "stable-score"
            );
        }

    });
}


/* =========================
   SIMULATION CONTROLS
========================= */


const population =
    document.getElementById("population");

const water =
    document.getElementById("water");

const food =
    document.getElementById("food");

const medicine =
    document.getElementById("medicine");

const accessibility =
    document.getElementById("accessibility");


const populationValue =
    document.getElementById("populationValue");

const waterValue =
    document.getElementById("waterValue");

const foodValue =
    document.getElementById("foodValue");

const medicineValue =
    document.getElementById("medicineValue");

const accessibilityValue =
    document.getElementById("accessibilityValue");


population.addEventListener(
    "input",
    () => {

        populationValue.textContent =
            Number(population.value).toLocaleString();

    }
);


water.addEventListener(
    "input",
    () => {

        waterValue.textContent =
            `${water.value}%`;

    }
);


food.addEventListener(
    "input",
    () => {

        foodValue.textContent =
            `${food.value}%`;

    }
);


medicine.addEventListener(
    "input",
    () => {

        medicineValue.textContent =
            `${medicine.value}%`;

    }
);


accessibility.addEventListener(
    "input",
    () => {

        accessibilityValue.textContent =
            `${accessibility.value}%`;

    }
);


/* =========================
   RUN SIMULATION
========================= */


document
    .getElementById("simulateButton")
    .addEventListener(
        "click",
        runSimulation
    );


async function runSimulation() {

    const button =
        document.getElementById(
            "simulateButton"
        );


    button.textContent =
        "CALCULATING...";

    button.disabled = true;


    const simulationData = {

        population:
            Number(population.value),

        water:
            Number(water.value),

        food:
            Number(food.value),

        medicine:
            Number(medicine.value),

        accessibility:
            Number(accessibility.value)

    };


    try {

        const response = await fetch(
            "/api/simulate",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        simulationData
                    )
            }
        );


        const result =
            await response.json();


        displaySimulationResult(
            result
        );


    } catch (error) {

        console.error(
            "Simulation failed:",
            error
        );

    }


    button.textContent =
        "RUN SIMULATION";

    button.disabled = false;
}


/* =========================
   DISPLAY RESULT
========================= */


function displaySimulationResult(
    result
) {

    const score =
        document.getElementById(
            "simulationScore"
        );

    const level =
        document.getElementById(
            "simulationLevel"
        );


    score.textContent =
        result.priority;


    level.textContent =
        result.level;


    if (result.level === "CRITICAL") {

        score.style.color =
            "var(--red)";

        level.style.color =
            "var(--red)";

    }

    else if (
        result.level === "ELEVATED"
    ) {

        score.style.color =
            "var(--yellow)";

        level.style.color =
            "var(--yellow)";

    }

    else {

        score.style.color =
            "var(--green)";

        level.style.color =
            "var(--green)";

    }

}


/* INITIAL LOAD */

loadZones();
/* =========================
   RESOURCE OPTIMIZER
========================= */

document
    .getElementById("optimizeButton")
    .addEventListener(
        "click",
        runOptimizer
    );


async function runOptimizer() {

    const button =
        document.getElementById(
            "optimizeButton"
        );

    const resultBox =
        document.getElementById(
            "allocationResult"
        );


    button.textContent =
        "OPTIMIZING...";

    button.disabled = true;


    try {

        const response =
            await fetch("/api/optimize");


        const data =
            await response.json();


        displayAllocations(
            data.allocations
        );


    } catch (error) {

        console.error(
            "Optimization failed:",
            error
        );

        resultBox.innerHTML = `
            <div class="optimizer-placeholder">
                <strong>Optimization failed</strong>
                <small>
                    Could not connect to the Relief Engine.
                </small>
            </div>
        `;

    }


    button.textContent =
        "OPTIMIZE RESOURCES";

    button.disabled = false;
}


function displayAllocations(
    allocations
) {

    const resultBox =
        document.getElementById(
            "allocationResult"
        );


    resultBox.innerHTML = "";


    allocations.forEach(
        allocation => {

            let priorityClass =
                "stable-score";


            if (
                allocation.priority >= 80
            ) {

                priorityClass =
                    "critical-score";

            } else if (
                allocation.priority >= 60
            ) {

                priorityClass =
                    "elevated-score";
            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "allocation-card";


            card.innerHTML = `

                <div class="allocation-header">

                    <span class="allocation-zone">
                        ZONE ${allocation.zone}
                    </span>

                    <span
                        class="allocation-priority ${priorityClass}"
                    >
                        ${allocation.priority}
                    </span>

                </div>


                <div class="allocation-values">

                    <div>
                        <span>WATER</span>
                        <strong>
                            ${allocation.water.toLocaleString()} L
                        </strong>
                    </div>

                    <div>
                        <span>FOOD</span>
                        <strong>
                            ${allocation.food.toLocaleString()} KG
                        </strong>
                    </div>

                    <div>
                        <span>MEDICINE</span>
                        <strong>
                            ${allocation.medicine.toLocaleString()} UNITS
                        </strong>
                    </div>

                </div>


                <div class="allocation-reason">

                    WHY THIS ALLOCATION?

                    <br>

                    ${allocation.reason}

                </div>
            `;


            resultBox.appendChild(card);

        }
    );
}
/* =========================
   FORECAST INTELLIGENCE
========================= */

document
    .getElementById("forecastButton")
    .addEventListener(
        "click",
        runForecast
    );


async function runForecast() {

    const button =
        document.getElementById(
            "forecastButton"
        );

    const bars =
        document.getElementById(
            "forecastBars"
        );

    const warning =
        document.getElementById(
            "forecastWarning"
        );


    button.textContent =
        "CALCULATING FORECAST...";

    button.disabled = true;


    try {

        /*
         * Use the current simulation
         * conditions as the forecast input.
         */

        const populationValue =
            Number(
                document.getElementById(
                    "population"
                ).value
            );

        const waterValue =
            Number(
                document.getElementById(
                    "water"
                ).value
            );


        const response =
            await fetch(
                "/api/forecast",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        population:
                            populationValue,

                        water:
                            waterValue

                    })
                }
            );


        const data =
            await response.json();


        displayForecast(data);


    } catch (error) {

        console.error(
            "Forecast failed:",
            error
        );

        bars.innerHTML = `
            <div class="forecast-placeholder">
                Forecast engine unavailable
            </div>
        `;

    }


    button.textContent =
        "GENERATE 24H FORECAST";

    button.disabled = false;
}


/* =========================
   DISPLAY FORECAST
========================= */

function displayForecast(data) {

    const currentDemand =
        document.getElementById(
            "currentDemand"
        );

    const futureDemand =
        document.getElementById(
            "futureDemand"
        );

    const risk =
        document.getElementById(
            "forecastRisk"
        );

    const bars =
        document.getElementById(
            "forecastBars"
        );

    const warning =
        document.getElementById(
            "forecastWarning"
        );


    const forecast =
        data.forecast;


    currentDemand.textContent =
        `${forecast[0].demand.toLocaleString()} L`;


    futureDemand.textContent =
        `${forecast[
            forecast.length - 1
        ].demand.toLocaleString()} L`;


    risk.textContent =
        data.risk;


    if (data.risk === "HIGH") {

        risk.style.color =
            "var(--red)";

        warning.innerHTML =
            "⚠ HIGH DEMAND RISK — Resource requirements are projected to increase significantly within 24 hours.";

    }

    else if (
        data.risk === "MODERATE"
    ) {

        risk.style.color =
            "var(--yellow)";

        warning.innerHTML =
            "⚠ MODERATE DEMAND RISK — Additional water resources may be required.";

    }

    else {

        risk.style.color =
            "var(--green)";

        warning.innerHTML =
            "✓ LOW DEMAND RISK — Current water requirements remain relatively stable.";

    }


    const maxDemand =
        Math.max(
            ...forecast.map(
                item => item.demand
            )
        );


    bars.innerHTML = "";


    forecast.forEach(
        item => {

            const wrapper =
                document.createElement(
                    "div"
                );

            wrapper.className =
                "forecast-bar-wrapper";


            const percentage =
                (
                    item.demand /
                    maxDemand
                ) * 100;


            wrapper.innerHTML = `

                <div class="forecast-value">
                    ${item.demand.toLocaleString()}
                </div>

                <div
                    class="forecast-bar"
                    style="height: ${percentage}%"
                ></div>

                <div class="forecast-time">
                    ${item.time}
                </div>

            `;


            bars.appendChild(
                wrapper
            );

        }
    );
}
/* =========================
   DISASTER SCENARIO ENGINE
========================= */

const scenarioButtons =
    document.querySelectorAll(
        ".scenario-card"
    );


scenarioButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const scenario =
                    button.dataset.scenario;

                runScenario(
                    scenario
                );

            }
        );

    }
);


async function runScenario(
    scenario
) {

    const status =
        document.getElementById(
            "scenarioStatus"
        );


    scenarioButtons.forEach(
        button => {

            button.classList.remove(
                "active"
            );

        }
    );


    const selectedButton =
        document.querySelector(
            `[data-scenario="${scenario}"]`
        );


    if (selectedButton) {

        selectedButton.classList.add(
            "active"
        );

    }


    status.innerHTML = `
        <span>
            SCENARIO STATUS
        </span>

        <strong>
            LOADING SCENARIO...
        </strong>
    `;


    try {

        const response =
            await fetch(
                `/api/scenario/${scenario}`
            );


        const data =
            await response.json();


        if (data.error) {

            throw new Error(
                data.error
            );

        }


        applyScenario(
            data
        );


        status.innerHTML = `

            <span>
                SCENARIO STATUS
            </span>

            <strong>
                ${data.name}
                — PRIORITY ${data.priority}
            </strong>

        `;


    } catch (error) {

        console.error(
            "Scenario failed:",
            error
        );


        status.innerHTML = `

            <span>
                SCENARIO STATUS
            </span>

            <strong>
                SCENARIO ENGINE ERROR
            </strong>

        `;

    }

}


/* =========================
   APPLY SCENARIO
========================= */

function applyScenario(data) {

    const population =
        document.getElementById(
            "population"
        );

    const water =
        document.getElementById(
            "water"
        );

    const food =
        document.getElementById(
            "food"
        );

    const medicine =
        document.getElementById(
            "medicine"
        );

    const accessibility =
        document.getElementById(
            "accessibility"
        );


    population.value =
        data.population;

    water.value =
        data.water;

    food.value =
        data.food;

    medicine.value =
        data.medicine;

    accessibility.value =
        data.accessibility;


    /*
     * Update visible slider values.
     */

    document.getElementById(
        "populationValue"
    ).textContent =
        data.population.toLocaleString();


    document.getElementById(
        "waterValue"
    ).textContent =
        `${data.water}%`;


    document.getElementById(
        "foodValue"
    ).textContent =
        `${data.food}%`;


    document.getElementById(
        "medicineValue"
    ).textContent =
        `${data.medicine}%`;


    document.getElementById(
        "accessibilityValue"
    ).textContent =
        `${data.accessibility}%`;


    /*
     * Immediately show the scenario
     * priority in the simulation panel.
     */

    displaySimulationResult({
        priority: data.priority,
        level: data.level
    });

}
/* =========================
   MISSION BRIEF
========================= */

document
    .getElementById("missionButton")
    .addEventListener(
        "click",
        generateMissionBrief
    );


async function generateMissionBrief() {

    const population =
        Number(
            document.getElementById(
                "population"
            ).value
        );

    const water =
        Number(
            document.getElementById(
                "water"
            ).value
        );

    const food =
        Number(
            document.getElementById(
                "food"
            ).value
        );

    const medicine =
        Number(
            document.getElementById(
                "medicine"
            ).value
        );

    const accessibility =
        Number(
            document.getElementById(
                "accessibility"
            ).value
        );


    const button =
        document.getElementById(
            "missionButton"
        );


    button.textContent =
        "ANALYZING...";

    button.disabled = true;


    try {

        /*
         * Calculate priority.
         */

        const simulationResponse =
            await fetch(
                "/api/simulate",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        population,
                        water,
                        food,
                        medicine,
                        accessibility

                    })
                }
            );


        const simulation =
            await simulationResponse.json();


        /*
         * Calculate forecast.
         */

        const forecastResponse =
            await fetch(
                "/api/forecast",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        population,
                        water

                    })
                }
            );


        const forecast =
            await forecastResponse.json();


        displayMissionBrief(
            simulation,
            forecast
        );


    } catch (error) {

        console.error(
            "Mission brief failed:",
            error
        );

    }


    button.textContent =
        "GENERATE MISSION BRIEF";

    button.disabled = false;
}


/* =========================
   DISPLAY MISSION BRIEF
========================= */

function displayMissionBrief(
    simulation,
    forecast
) {

    const headline =
        document.getElementById(
            "missionHeadline"
        );

    const priority =
        document.getElementById(
            "missionPriority"
        );

    const severity =
        document.getElementById(
            "missionSeverity"
        );

    const demand =
        document.getElementById(
            "missionDemand"
        );

    const population =
        document.getElementById(
            "missionPopulation"
        );

    const action =
        document.getElementById(
            "missionAction"
        );

    const indicator =
        document.getElementById(
            "missionIndicator"
        );

    const status =
        document.getElementById(
            "missionStatus"
        );


    priority.textContent =
        simulation.priority;


    severity.textContent =
        simulation.level;


    demand.textContent =
        `${forecast.forecast[
            forecast.forecast.length - 1
        ].demand.toLocaleString()} L`;


    population.textContent =
        simulation.population.toLocaleString();


    /*
     * Generate operational recommendation.
     */

    if (
        simulation.level === "CRITICAL"
    ) {

        headline.textContent =
            "Critical conditions detected. Immediate resource prioritization is required.";

        action.textContent =
            "Prioritize critical zones and accelerate water, food and medicine allocation.";

        indicator.style.color =
            "var(--red)";

        status.textContent =
            "CRITICAL";

        status.style.color =
            "var(--red)";

    }

    else if (
        simulation.level === "ELEVATED"
    ) {

        headline.textContent =
            "Elevated disaster pressure detected. Resource demand requires active monitoring.";

        action.textContent =
            "Increase resource readiness and monitor demand growth over the next 24 hours.";

        indicator.style.color =
            "var(--yellow)";

        status.textContent =
            "ELEVATED";

        status.style.color =
            "var(--yellow)";

    }

    else {

        headline.textContent =
            "Current conditions remain relatively stable under the selected scenario.";

        action.textContent =
            "Maintain proportional allocation and continue monitoring conditions.";

        indicator.style.color =
            "var(--green)";

        status.textContent =
            "STABLE";

        status.style.color =
            "var(--green)";

    }

}
/* =========================
   RELIEFOS ZONE INTELLIGENCE
========================= */

let reliefZones = [];


async function loadInteractiveZones() {

    try {

        const response =
            await fetch("/api/zones");

        const data =
            await response.json();

        console.log(
            "RELIEFOS INTERACTIVE ZONES:",
            data
        );

        reliefZones =
            data.zones || [];

        setupZoneButtons();

    } catch (error) {

        console.error(
            "Zone Intelligence failed:",
            error
        );

    }
}


function setupZoneButtons() {

    const zoneButtons =
        document.querySelectorAll(
            ".interactive-zone"
        );


    console.log(
        "Interactive zones found:",
        zoneButtons.length
    );


    zoneButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const zoneId =
                        button.dataset.zone;

                    selectZone(
                        zoneId
                    );

                }
            );

        }
    );

}


function selectZone(zoneId) {

    const zone =
        reliefZones.find(
            item =>
                item.id === zoneId
        );


    if (!zone) {

        console.error(
            "Zone not found:",
            zoneId
        );

        return;
    }


    /*
     * Remove previous selection
     */

    document
        .querySelectorAll(
            ".interactive-zone"
        )
        .forEach(
            element => {

                element.classList.remove(
                    "selected"
                );

            }
        );


    /*
     * Highlight selected zone
     */

    const selected =
        document.querySelector(
            `[data-zone="${zoneId}"]`
        );


    if (selected) {

        selected.classList.add(
            "selected"
        );

    }


    /*
     * Zone name
     */

    const zoneName =
        document.getElementById(
            "selectedZoneName"
        );

    if (zoneName) {

        zoneName.textContent =
            `ZONE ${zone.id}`;

    }


    /*
     * Priority
     */

    const priority =
        document.getElementById(
            "selectedZonePriority"
        );

    if (priority) {

        priority.textContent =
            zone.priority;

    }


    /*
     * Population
     */

    const zonePopulation =
        document.getElementById(
            "zonePopulation"
        );

    if (zonePopulation) {

        zonePopulation.textContent =
            zone.population.toLocaleString();

    }


    /*
     * Water
     */

    const zoneWater =
        document.getElementById(
            "zoneWater"
        );

    if (zoneWater) {

        zoneWater.textContent =
            `${zone.water}%`;

    }


    /*
     * Food
     */

    const zoneFood =
        document.getElementById(
            "zoneFood"
        );

    if (zoneFood) {

        zoneFood.textContent =
            `${zone.food}%`;

    }


    /*
     * Medicine
     */

    const zoneMedicine =
        document.getElementById(
            "zoneMedicine"
        );

    if (zoneMedicine) {

        zoneMedicine.textContent =
            `${zone.medicine}%`;

    }


    /*
     * Accessibility
     */

    const zoneAccessibility =
        document.getElementById(
            "zoneAccessibility"
        );

    if (zoneAccessibility) {

        zoneAccessibility.textContent =
            `${zone.accessibility}%`;

    }


    /*
     * Zone level
     */

    const zoneLevel =
        document.getElementById(
            "zoneLevel"
        );


    if (zoneLevel) {

        zoneLevel.textContent =
            zone.level;


        if (
            zone.level === "CRITICAL"
        ) {

            zoneLevel.style.color =
                "var(--red)";

        }

        else if (
            zone.level === "ELEVATED"
        ) {

            zoneLevel.style.color =
                "var(--yellow)";

        }

        else {

            zoneLevel.style.color =
                "var(--green)";

        }

    }


    /*
     * Zone status
     */

    const zoneStatus =
        document.getElementById(
            "selectedZoneStatus"
        );


    if (zoneStatus) {

        zoneStatus.textContent =
            zone.level;


        if (
            zone.level === "CRITICAL"
        ) {

            zoneStatus.style.color =
                "var(--red)";

        }

        else if (
            zone.level === "ELEVATED"
        ) {

            zoneStatus.style.color =
                "var(--yellow)";

        }

        else {

            zoneStatus.style.color =
                "var(--green)";

        }

    }

}


/*
 * Load interactive zones
 */

loadInteractiveZones();
/* =========================
   RELIEFOS ZONE INTELLIGENCE
========================= */

(function () {

    let reliefZones = [];


    async function loadInteractiveZones() {

        try {

            const response =
                await fetch("/api/zones");

            if (!response.ok) {

                throw new Error(
                    "API returned " +
                    response.status
                );

            }

            const data =
                await response.json();

            console.log(
                "RELIEFOS ZONE INTELLIGENCE:",
                data
            );

            reliefZones =
                data.zones || [];

            setupZoneButtons();

        } catch (error) {

            console.error(
                "Zone Intelligence error:",
                error
            );

        }

    }


    function setupZoneButtons() {

        const zones =
            document.querySelectorAll(
                ".interactive-zone"
            );

        console.log(
            "Interactive zones found:",
            zones.length
        );


        zones.forEach(function (zoneElement) {

            zoneElement.addEventListener(
                "click",
                function () {

                    const zoneId =
                        zoneElement.dataset.zone;

                    showZone(zoneId);

                }
            );

        });

    }


    function showZone(zoneId) {

        const zone =
            reliefZones.find(
                function (item) {

                    return item.id === zoneId;

                }
            );


        if (!zone) {

            console.error(
                "Zone not found:",
                zoneId
            );

            return;

        }


        /* Highlight selected zone */

        document
            .querySelectorAll(
                ".interactive-zone"
            )
            .forEach(function (element) {

                element.classList.remove(
                    "selected"
                );

            });


        const selected =
            document.querySelector(
                '[data-zone="' +
                zoneId +
                '"]'
            );


        if (selected) {

            selected.classList.add(
                "selected"
            );

        }


        /* Zone name */

        const name =
            document.getElementById(
                "selectedZoneName"
            );

        if (name) {

            name.textContent =
                "ZONE " + zone.id;

        }


        /* Priority */

        const priority =
            document.getElementById(
                "selectedZonePriority"
            );

        if (priority) {

            priority.textContent =
                zone.priority;

        }


        /* Population */

        const population =
            document.getElementById(
                "zonePopulation"
            );

        if (population) {

            population.textContent =
                Number(
                    zone.population
                ).toLocaleString();

        }


        /* Water */

        const water =
            document.getElementById(
                "zoneWater"
            );

        if (water) {

            water.textContent =
                zone.water + "%";

        }


        /* Food */

        const food =
            document.getElementById(
                "zoneFood"
            );

        if (food) {

            food.textContent =
                zone.food + "%";

        }


        /* Medicine */

        const medicine =
            document.getElementById(
                "zoneMedicine"
            );

        if (medicine) {

            medicine.textContent =
                zone.medicine + "%";

        }


        /* Accessibility */

        const accessibility =
            document.getElementById(
                "zoneAccessibility"
            );

        if (accessibility) {

            accessibility.textContent =
                zone.accessibility + "%";

        }


        /* Risk level */

        const level =
            document.getElementById(
                "zoneLevel"
            );

        if (level) {

            level.textContent =
                zone.level;


            if (
                zone.level === "CRITICAL"
            ) {

                level.style.color =
                    "var(--red)";

            } else if (
                zone.level === "ELEVATED"
            ) {

                level.style.color =
                    "var(--yellow)";

            } else {

                level.style.color =
                    "var(--green)";

            }

        }


        /* Header status */

        const status =
            document.getElementById(
                "selectedZoneStatus"
            );

        if (status) {

            status.textContent =
                zone.level;


            if (
                zone.level === "CRITICAL"
            ) {

                status.style.color =
                    "var(--red)";

            } else if (
                zone.level === "ELEVATED"
            ) {

                status.style.color =
                    "var(--yellow)";

            } else {

                status.style.color =
                    "var(--green)";

            }

        }

    }


    /* Start */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            loadInteractiveZones
        );

    } else {

        loadInteractiveZones();

    }

})();
/* =========================================================
   RELIEFOS — ZONE INTELLIGENCE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("RELIEFOS Zone Intelligence starting...");

    const zoneElements =
        document.querySelectorAll(".interactive-zone");

    console.log(
        "Interactive zones found:",
        zoneElements.length
    );

    if (zoneElements.length === 0) {
        console.error(
            "RELIEFOS ERROR: No interactive zones found."
        );
        return;
    }

    zoneElements.forEach(function (zoneElement) {

        zoneElement.addEventListener("click", async function () {

            const zoneId =
                zoneElement.getAttribute("data-zone");

            console.log(
                "Zone clicked:",
                zoneId
            );

            try {

                const response =
                    await fetch("/api/zones");

                if (!response.ok) {
                    throw new Error(
                        "API error: " + response.status
                    );
                }

                const data =
                    await response.json();

                const zone =
                    data.zones.find(function (item) {
                        return item.id === zoneId;
                    });

                if (!zone) {
                    console.error(
                        "Zone not found:",
                        zoneId
                    );
                    return;
                }

                console.log(
                    "Selected zone:",
                    zone
                );

                updateZoneIntelligence(zone);

            } catch (error) {

                console.error(
                    "Zone Intelligence failed:",
                    error
                );

            }

        });

    });


    function updateZoneIntelligence(zone) {

        const elements = {

            name:
                document.getElementById(
                    "selectedZoneName"
                ),

            priority:
                document.getElementById(
                    "selectedZonePriority"
                ),

            population:
                document.getElementById(
                    "zonePopulation"
                ),

            water:
                document.getElementById(
                    "zoneWater"
                ),

            food:
                document.getElementById(
                    "zoneFood"
                ),

            medicine:
                document.getElementById(
                    "zoneMedicine"
                ),

            accessibility:
                document.getElementById(
                    "zoneAccessibility"
                ),

            level:
                document.getElementById(
                    "zoneLevel"
                )

        };


        if (elements.name) {
            elements.name.textContent =
                "ZONE " + zone.id;
        }


        if (elements.priority) {
            elements.priority.textContent =
                zone.priority;
        }


        if (elements.population) {
            elements.population.textContent =
                Number(
                    zone.population
                ).toLocaleString();
        }


        if (elements.water) {
            elements.water.textContent =
                zone.water + "%";
        }


        if (elements.food) {
            elements.food.textContent =
                zone.food + "%";
        }


        if (elements.medicine) {
            elements.medicine.textContent =
                zone.medicine + "%";
        }


        if (elements.accessibility) {
            elements.accessibility.textContent =
                zone.accessibility + "%";
        }


        if (elements.level) {

            elements.level.textContent =
                zone.level;

            if (zone.level === "CRITICAL") {

                elements.level.style.color =
                    "var(--red)";

            } else if (
                zone.level === "ELEVATED"
            ) {

                elements.level.style.color =
                    "var(--yellow)";

            } else {

                elements.level.style.color =
                    "var(--green)";

            }

        }


        /* Highlight selected zone */

        zoneElements.forEach(function (element) {

            element.classList.remove(
                "selected"
            );

        });


        const selectedZone =
            document.querySelector(
                '[data-zone="' +
                zone.id +
                '"]'
            );

        if (selectedZone) {

            selectedZone.classList.add(
                "selected"
            );

        }

    }

});
/* =========================================================
   RELIEFOS — COMMAND CENTER ENHANCEMENTS
   UI UNCHANGED
========================================================= */

(function () {

    console.log("RELIEFOS Command Enhancements Loaded");


    /* =====================================================
       1. CLICKABLE SIDEBAR NAVIGATION
    ===================================================== */

    const sidebarLinks =
        document.querySelectorAll(
            ".sidebar a, .sidebar button, .nav-item"
        );

    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const target =
                link.getAttribute("href");

            if (
                target &&
                target.startsWith("#")
            ) {

                event.preventDefault();

                const section =
                    document.querySelector(target);

                if (section) {

                    section.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }

        });

    });


    /* =====================================================
       2. INTERACTIVE MAP
    ===================================================== */

    let reliefZones = [];


    async function loadEnhancedZones() {

        try {

            const response =
                await fetch("/api/zones");

            if (!response.ok) {

                throw new Error(
                    "Zone API error: " +
                    response.status
                );

            }

            const data =
                await response.json();

            reliefZones =
                data.zones || [];

            console.log(
                "Enhanced map zones:",
                reliefZones
            );

            setupMap();

        }

        catch (error) {

            console.error(
                "Enhanced map failed:",
                error
            );

        }

    }


    function setupMap() {

        const mapZones =
            document.querySelectorAll(
                ".interactive-zone"
            );

        console.log(
            "Map zones:",
            mapZones.length
        );


        mapZones.forEach(function (element) {

            /* Avoid duplicate listeners */

            if (
                element.dataset.reliefosReady ===
                "true"
            ) {
                return;
            }

            element.dataset.reliefosReady =
                "true";


            element.addEventListener(
                "click",
                function () {

                    const zoneId =
                        element.dataset.zone;

                    selectMapZone(
                        zoneId
                    );

                }
            );


            /* Keyboard accessibility */

            element.setAttribute(
                "tabindex",
                "0"
            );


            element.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        selectMapZone(
                            element.dataset.zone
                        );

                    }

                }
            );

        });

    }


    function selectMapZone(zoneId) {

        const zone =
            reliefZones.find(
                function (item) {

                    return item.id === zoneId;

                }
            );


        if (!zone) {

            console.error(
                "Zone unavailable:",
                zoneId
            );

            return;

        }


        console.log(
            "COMMAND CENTER → Selected:",
            zone
        );


        /* Remove previous selection */

        document
            .querySelectorAll(
                ".interactive-zone"
            )
            .forEach(function (element) {

                element.classList.remove(
                    "selected"
                );

            });


        /* Highlight selected zone */

        const selected =
            document.querySelector(
                `[data-zone="${zoneId}"]`
            );


        if (selected) {

            selected.classList.add(
                "selected"
            );

        }


        /* Update Zone Intelligence */

        updateZonePanel(
            zone
        );

    }


    function updateZonePanel(zone) {

        setText(
            "selectedZoneName",
            "ZONE " + zone.id
        );


        setText(
            "selectedZonePriority",
            zone.priority
        );


        setText(
            "zonePopulation",
            Number(
                zone.population
            ).toLocaleString()
        );


        setText(
            "zoneWater",
            zone.water + "%"
        );


        setText(
            "zoneFood",
            zone.food + "%"
        );


        setText(
            "zoneMedicine",
            zone.medicine + "%"
        );


        setText(
            "zoneAccessibility",
            zone.accessibility + "%"
        );


        setText(
            "zoneLevel",
            zone.level
        );


        const level =
            document.getElementById(
                "zoneLevel"
            );


        if (level) {

            if (
                zone.level ===
                "CRITICAL"
            ) {

                level.style.color =
                    "var(--red)";

            }

            else if (
                zone.level ===
                "ELEVATED"
            ) {

                level.style.color =
                    "var(--yellow)";

            }

            else {

                level.style.color =
                    "var(--green)";

            }

        }

    }


    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                value;

        }

    }


    /* =====================================================
       3. PRIORITY QUEUE → CLICKABLE
    ===================================================== */

    const priorityItems =
        document.querySelectorAll(
            ".priority-item"
        );


    priorityItems.forEach(function (
        item,
        index
    ) {

        if (
            item.dataset.reliefosReady ===
            "true"
        ) {
            return;
        }


        item.dataset.reliefosReady =
            "true";


        item.style.cursor =
            "pointer";


        item.addEventListener(
            "click",
            function () {

                if (
                    reliefZones[index]
                ) {

                    selectMapZone(
                        reliefZones[index].id
                    );

                    const map =
                        document.querySelector(
                            ".map-panel"
                        );

                    if (map) {

                        map.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }

                }

            }
        );

    });


    /* =====================================================
       4. LIVE EVENT MONITOR
    ===================================================== */

    const eventLog = [];


    function addEvent(message) {

        const now =
            new Date();

        const time =
            now.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        eventLog.unshift({

            time: time,

            message: message

        });


        if (
            eventLog.length > 8
        ) {

            eventLog.pop();

        }


        console.log(
            `[${time}] ${message}`
        );

    }


    /* Log major system activity */

    addEvent(
        "RELIEFOS command center initialized"
    );


    /* =====================================================
       5. AUTOMATIC ZONE MONITOR
    ===================================================== */

    let previousCriticalZones =
        [];


    async function monitorZones() {

        try {

            const response =
                await fetch(
                    "/api/zones"
                );


            if (!response.ok) {
                return;
            }


            const data =
                await response.json();


            const zones =
                data.zones || [];


            const critical =
                zones
                    .filter(function (zone) {

                        return zone.level ===
                            "CRITICAL";

                    })
                    .map(function (zone) {

                        return zone.id;

                    });


            if (
                previousCriticalZones.length > 0
            ) {

                critical.forEach(
                    function (zoneId) {

                        if (
                            !previousCriticalZones
                                .includes(zoneId)
                        ) {

                            addEvent(
                                "Zone " +
                                zoneId +
                                " entered CRITICAL status"
                            );

                        }

                    }
                );

            }


            previousCriticalZones =
                critical;

        }

        catch (error) {

            console.warn(
                "Live monitor unavailable"
            );

        }

    }


    /* Check every 30 seconds */

    monitorZones();


    setInterval(
        monitorZones,
        30000
    );


    /* =====================================================
       6. KEYBOARD COMMAND SHORTCUTS
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            /*
             * Ignore shortcuts while typing
             */

            const tag =
                document.activeElement
                    ?.tagName;

            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT"
            ) {

                return;

            }


            /* R = Run simulation */

            if (
                event.key.toLowerCase() ===
                "r"
            ) {

                const button =
                    document.getElementById(
                        "simulateButton"
                    );

                if (button) {

                    button.click();

                }

            }


            /* F = Forecast */

            if (
                event.key.toLowerCase() ===
                "f"
            ) {

                const button =
                    document.getElementById(
                        "forecastButton"
                    );

                if (button) {

                    button.click();

                }

            }


            /* O = Optimize */

            if (
                event.key.toLowerCase() ===
                "o"
            ) {

                const button =
                    document.getElementById(
                        "optimizeButton"
                    );

                if (button) {

                    button.click();

                }

            }

        }
    );


    /* =====================================================
       7. GLOBAL COMMAND FUNCTION
       Runs the complete response pipeline
    ===================================================== */

    window.RELIEFOS_COMMAND =
        async function () {

            console.log(
                "RELIEFOS COMMAND → Full response analysis started"
            );


            addEvent(
                "Full response analysis started"
            );


            const simulationButton =
                document.getElementById(
                    "simulateButton"
                );


            if (simulationButton) {

                simulationButton.click();

            }


            await wait(700);


            const forecastButton =
                document.getElementById(
                    "forecastButton"
                );


            if (forecastButton) {

                forecastButton.click();

            }


            await wait(700);


            const optimizeButton =
                document.getElementById(
                    "optimizeButton"
                );


            if (optimizeButton) {

                optimizeButton.click();

            }


            await wait(700);


            const missionButton =
                document.getElementById(
                    "missionButton"
                );


            if (missionButton) {

                missionButton.click();

            }


            addEvent(
                "Response analysis completed"
            );


            console.log(
                "RELIEFOS COMMAND → Complete"
            );

        };


    function wait(ms) {

        return new Promise(
            function (resolve) {

                setTimeout(
                    resolve,
                    ms
                );

            }
        );

    }


    /* =====================================================
       START
    ===================================================== */

    loadEnhancedZones();


})();
/* =========================================================
   RELIEFOS — LIVE DISASTER SIMULATION
   UI UNCHANGED
========================================================= */

(function () {

    let liveSimulation = false;
    let liveTimer = null;

    window.RELIEFOS_LIVE_MODE = function () {

        if (liveSimulation) {

            stopLiveSimulation();

        } else {

            startLiveSimulation();

        }

    };


    function startLiveSimulation() {

        liveSimulation = true;

        console.log(
            "RELIEFOS LIVE MODE → STARTED"
        );

        runLiveCycle();

        liveTimer =
            setInterval(
                runLiveCycle,
                5000
            );

    }


    function stopLiveSimulation() {

        liveSimulation = false;

        if (liveTimer) {

            clearInterval(
                liveTimer
            );

            liveTimer = null;

        }

        console.log(
            "RELIEFOS LIVE MODE → STOPPED"
        );

    }


    async function runLiveCycle() {

        try {

            const response =
                await fetch(
                    "/api/zones"
                );

            if (!response.ok) {
                return;
            }

            const data =
                await response.json();

            const zones =
                data.zones || [];


            zones.forEach(
                function (zone) {

                    const element =
                        document.querySelector(
                            `[data-zone="${zone.id}"]`
                        );

                    if (!element) {
                        return;
                    }


                    /*
                     * Remove previous status classes.
                     */

                    element.classList.remove(
                        "critical",
                        "elevated",
                        "stable"
                    );


                    /*
                     * Add current status.
                     */

                    if (
                        zone.level ===
                        "CRITICAL"
                    ) {

                        element.classList.add(
                            "critical"
                        );

                    }

                    else if (
                        zone.level ===
                        "ELEVATED"
                    ) {

                        element.classList.add(
                            "elevated"
                        );

                    }

                    else {

                        element.classList.add(
                            "stable"
                        );

                    }

                }
            );


            /*
             * Update browser title.
             */

            const critical =
                zones.filter(
                    function (zone) {

                        return zone.level ===
                            "CRITICAL";

                    }
                ).length;


            document.title =
                "RELIEFOS • " +
                critical +
                " CRITICAL ZONES";


            console.log(
                "LIVE UPDATE:",
                zones
            );

        }

        catch (error) {

            console.error(
                "Live simulation error:",
                error
            );

        }

    }

})();
// ==========================================
// RELIEFOS COMMAND CENTER AUTOMATION
// ==========================================

(function () {

    function wait(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }

    async function runStep(buttonId, stepName) {

        const button = document.getElementById(buttonId);

        if (!button) {
            console.warn("RELIEFOS: Button not found →", buttonId);
            return;
        }

        console.log("RELIEFOS COMMAND → " + stepName);

        button.click();

        await wait(1500);
    }


    async function runCommandCenter() {

        console.log("=================================");
        console.log("RELIEFOS COMMAND CENTER STARTED");
        console.log("=================================");

        // STEP 1
        await runStep(
            "simulateButton",
            "SCANNING DISASTER CONDITIONS"
        );

        // STEP 2
        await runStep(
            "forecastButton",
            "FORECASTING FUTURE DEMAND"
        );

        // STEP 3
        await runStep(
            "optimizeButton",
            "OPTIMIZING RESOURCE ALLOCATION"
        );

        // STEP 4
        await runStep(
            "missionButton",
            "GENERATING RESPONSE MISSION"
        );

        console.log("=================================");
        console.log("RELIEFOS COMMAND CENTER COMPLETE");
        console.log("=================================");

    }


    // Make it available from browser console
    window.RELIEFOS_COMMAND_CENTER = runCommandCenter;

})();
(function () {

    // ==========================================
    // RELIEFOS RISK ESCALATION ENGINE
    // ==========================================

    window.RELIEFOS_RISK_CHECK = async function () {

        console.log("=================================");
        console.log("RELIEFOS RISK ANALYSIS STARTED");
        console.log("=================================");

        try {

            // Get current zones
            const zonesResponse = await fetch("/api/zones");

            if (!zonesResponse.ok) {
                throw new Error("Could not load zones");
            }

            const zoneData = await zonesResponse.json();
            const zones = zoneData.zones || [];

            for (const zone of zones) {

                const response = await fetch("/api/risk", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        population: zone.population,
                        water: zone.water,
                        food: zone.food,
                        medicine: zone.medicine,
                        accessibility: zone.accessibility
                    })
                });

                if (!response.ok) {
                    console.error(
                        "Risk analysis failed for Zone",
                        zone.id
                    );
                    continue;
                }

                const result = await response.json();

                console.log(
                    "ZONE " + zone.id,
                    "→",
                    result.escalation
                );

                console.log(
                    "Current:",
                    result.current_priority,
                    "| Future:",
                    result.future_priority,
                    "| Change:",
                    result.priority_increase
                );

                if (result.escalation === "ESCALATION DETECTED") {

                    console.warn(
                        "⚠️ ZONE " +
                        zone.id +
                        " MAY REQUIRE IMMEDIATE ATTENTION"
                    );
                }
            }

            console.log("=================================");
            console.log("RELIEFOS RISK ANALYSIS COMPLETE");
            console.log("=================================");

        } catch (error) {

            console.error(
                "RELIEFOS Risk Engine Error:",
                error
            );

        }
    };

})();
(function () {

    // ==========================================
    // RELIEFOS AUTOMATIC EARLY-WARNING MONITOR
    // ==========================================

    let earlyWarningActive = false;
    let earlyWarningTimer = null;

    window.RELIEFOS_EARLY_WARNING = function () {

        if (earlyWarningActive) {

            earlyWarningActive = false;

            if (earlyWarningTimer) {
                clearInterval(earlyWarningTimer);
                earlyWarningTimer = null;
            }

            console.log(
                "RELIEFOS EARLY-WARNING → STOPPED"
            );

            return;
        }

        earlyWarningActive = true;

        console.log(
            "RELIEFOS EARLY-WARNING → STARTED"
        );

        runEarlyWarningCheck();

        // Check every 15 seconds
        earlyWarningTimer = setInterval(
            runEarlyWarningCheck,
            15000
        );
    };


    async function runEarlyWarningCheck() {

        if (!earlyWarningActive) {
            return;
        }

        try {

            const zonesResponse =
                await fetch("/api/zones");

            if (!zonesResponse.ok) {
                throw new Error(
                    "Zone API unavailable"
                );
            }

            const zoneData =
                await zonesResponse.json();

            const zones =
                zoneData.zones || [];

            let escalationCount = 0;

            for (const zone of zones) {

                const response =
                    await fetch("/api/risk", {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            population:
                                zone.population,

                            water:
                                zone.water,

                            food:
                                zone.food,

                            medicine:
                                zone.medicine,

                            accessibility:
                                zone.accessibility
                        })
                    });

                if (!response.ok) {
                    continue;
                }

                const result =
                    await response.json();

                if (
                    result.escalation ===
                    "ESCALATION DETECTED"
                ) {

                    escalationCount++;

                    console.warn(
                        "🚨 EARLY WARNING → ZONE " +
                        zone.id +
                        " ESCALATING"
                    );

                    console.warn(
                        "Priority:",
                        result.current_priority,
                        "→",
                        result.future_priority
                    );
                }

                else if (
                    result.escalation ===
                    "RISK INCREASING"
                ) {

                    console.log(
                        "⚠️ Zone " +
                        zone.id +
                        " risk increasing"
                    );
                }

                else {

                    console.log(
                        "✓ Zone " +
                        zone.id +
                        " risk stable"
                    );
                }
            }

            console.log(
                "RELIEFOS EARLY-WARNING CHECK:",
                new Date().toLocaleTimeString(),
                "| Escalations:",
                escalationCount
            );

        }

        catch (error) {

            console.error(
                "Early-warning error:",
                error
            );
        }
    }

})();
// ==========================================
// RELIEFOS INTERACTIVE CONTROL SYSTEM
// UI/CSS UNCHANGED
// ==========================================

(function () {

    function clickElement(id, name) {

        const element = document.getElementById(id);

        if (!element) {
            console.warn(
                "RELIEFOS → " + name + " button not found"
            );
            return false;
        }

        element.click();

        console.log(
            "RELIEFOS → " + name + " activated"
        );

        return true;
    }


    // ------------------------------------------
    // 1. RUN FULL ANALYSIS
    // ------------------------------------------

    window.RELIEFOS_FULL_SCAN = async function () {

        console.log("=================================");
        console.log("RELIEFOS FULL SYSTEM SCAN");
        console.log("=================================");

        await wait(300);

        clickElement(
            "simulateButton",
            "DISASTER SIMULATION"
        );

        await wait(1200);

        clickElement(
            "forecastButton",
            "DEMAND FORECAST"
        );

        await wait(1200);

        clickElement(
            "optimizeButton",
            "RESOURCE OPTIMIZER"
        );

        await wait(1200);

        if (window.RELIEFOS_RISK_CHECK) {
            await window.RELIEFOS_RISK_CHECK();
        }

        await wait(1000);

        if (window.RELIEFOS_GENERATE_MISSION) {
            await window.RELIEFOS_GENERATE_MISSION();
        }

        console.log("=================================");
        console.log("FULL SYSTEM SCAN COMPLETE");
        console.log("=================================");
    };


    // ------------------------------------------
    // 2. SCAN ALL ZONES
    // ------------------------------------------

    window.RELIEFOS_SCAN_ZONES = async function () {

        console.log("RELIEFOS → SCANNING ALL ZONES");

        try {

            const response =
                await fetch("/api/zones");

            const data =
                await response.json();

            const zones =
                data.zones || [];

            zones.forEach(function (zone) {

                console.log(
                    "ZONE " + zone.id +
                    " | PRIORITY: " +
                    zone.priority +
                    " | LEVEL: " +
                    zone.level
                );

            });

        } catch (error) {

            console.error(
                "Zone scan failed:",
                error
            );
        }
    };


    // ------------------------------------------
    // 3. SHOW CRITICAL ZONES
    // ------------------------------------------

    window.RELIEFOS_CRITICAL_SCAN = async function () {

        try {

            const response =
                await fetch("/api/zones");

            const data =
                await response.json();

            const critical =
                (data.zones || []).filter(
                    function (zone) {
                        return zone.level === "CRITICAL";
                    }
                );

            console.log(
                "================================="
            );

            console.log(
                "CRITICAL ZONES:",
                critical.length
            );

            critical.forEach(function (zone) {

                console.warn(
                    "🚨 ZONE " +
                    zone.id +
                    " | PRIORITY " +
                    zone.priority
                );

            });

            console.log(
                "================================="
            );

        } catch (error) {

            console.error(
                "Critical scan failed:",
                error
            );
        }
    };


    // ------------------------------------------
    // 4. SELECT HIGHEST PRIORITY ZONE
    // ------------------------------------------

    window.RELIEFOS_AUTO_SELECT = async function () {

        try {

            const response =
                await fetch("/api/zones");

            const data =
                await response.json();

            const zones =
                data.zones || [];

            if (!zones.length) {
                return;
            }

            zones.sort(function (a, b) {
                return b.priority - a.priority;
            });

            const highest =
                zones[0];

            const element =
                document.querySelector(
                    '[data-zone="' +
                    highest.id +
                    '"]'
                );

            if (element) {

                element.click();

                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

            console.log(
                "RELIEFOS → AUTO SELECTED ZONE",
                highest.id
            );

        } catch (error) {

            console.error(
                "Auto-selection failed:",
                error
            );
        }
    };


    // ------------------------------------------
    // 5. RUN RESOURCE OPTIMIZER
    // ------------------------------------------

    window.RELIEFOS_OPTIMIZE = function () {

        clickElement(
            "optimizeButton",
            "RESOURCE OPTIMIZER"
        );

    };


    // ------------------------------------------
    // 6. RUN FORECAST
    // ------------------------------------------

    window.RELIEFOS_FORECAST = function () {

        clickElement(
            "forecastButton",
            "DEMAND FORECAST"
        );

    };


    // ------------------------------------------
    // 7. RUN SIMULATION
    // ------------------------------------------

    window.RELIEFOS_SIMULATE = function () {

        clickElement(
            "simulateButton",
            "DISASTER SIMULATION"
        );

    };


    // ------------------------------------------
    // 8. GENERATE MISSION
    // ------------------------------------------

    window.RELIEFOS_MISSION = function () {

        if (window.RELIEFOS_GENERATE_MISSION) {

            window.RELIEFOS_GENERATE_MISSION();

        } else {

            clickElement(
                "missionButton",
                "MISSION GENERATOR"
            );
        }
    };


    // ------------------------------------------
    // 9. START LIVE MONITOR
    // ------------------------------------------

    window.RELIEFOS_MONITOR = function () {

        if (window.RELIEFOS_EARLY_WARNING) {

            window.RELIEFOS_EARLY_WARNING();

        } else {

            console.warn(
                "Early-warning engine not loaded."
            );
        }
    };


    // ------------------------------------------
    // 10. RESET / RELOAD DATA
    // ------------------------------------------

    window.RELIEFOS_REFRESH = async function () {

        console.log(
            "RELIEFOS → REFRESHING SYSTEM DATA"
        );

        try {

            const response =
                await fetch("/api/zones");

            const data =
                await response.json();

            console.log(
                "Latest zone data:",
                data
            );

            if (typeof loadZones === "function") {
                loadZones();
            }

        } catch (error) {

            console.error(
                "Refresh failed:",
                error
            );
        }
    };


    // ------------------------------------------
    // DELAY HELPER
    // ------------------------------------------

    function wait(ms) {

        return new Promise(
            function (resolve) {
                setTimeout(resolve, ms);
            }
        );
    }


    // ------------------------------------------
    // KEYBOARD CONTROLS
    // ------------------------------------------

    document.addEventListener(
        "keydown",
        function (event) {

            // Ignore when typing
            if (
                event.target.tagName === "INPUT" ||
                event.target.tagName === "TEXTAREA"
            ) {
                return;
            }


            // CTRL + 1 → Full scan
            if (event.ctrlKey && event.key === "1") {

                event.preventDefault();

                RELIEFOS_FULL_SCAN();
            }


            // CTRL + 2 → Zone scan
            if (event.ctrlKey && event.key === "2") {

                event.preventDefault();

                RELIEFOS_SCAN_ZONES();
            }


            // CTRL + 3 → Critical scan
            if (event.ctrlKey && event.key === "3") {

                event.preventDefault();

                RELIEFOS_CRITICAL_SCAN();
            }


            // CTRL + 4 → Auto-select highest priority
            if (event.ctrlKey && event.key === "4") {

                event.preventDefault();

                RELIEFOS_AUTO_SELECT();
            }


            // CTRL + 5 → Mission
            if (event.ctrlKey && event.key === "5") {

                event.preventDefault();

                RELIEFOS_MISSION();
            }


            // CTRL + R → Refresh
            if (event.ctrlKey && event.key.toLowerCase() === "r") {

                event.preventDefault();

                RELIEFOS_REFRESH();
            }

        }
    );


    console.log(
        "RELIEFOS INTERACTIVE CONTROLS READY"
    );

})();
// ==========================================
// RELIEFOS SIDEBAR NAVIGATION
// UI UNCHANGED
// ==========================================

(function () {

    const sidebarLinks = document.querySelectorAll(
        ".sidebar a, .sidebar button, .nav-item"
    );

    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const text = link.textContent
                .trim()
                .toLowerCase();

            console.log(
                "RELIEFOS SIDEBAR →",
                text
            );

            // Dashboard
            if (text.includes("dashboard")) {
                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

            // Zones
            else if (
                text.includes("zone") ||
                text.includes("map")
            ) {
                event.preventDefault();

                const section =
                    document.querySelector(
                        ".map-section, #map, .dashboard-map"
                    );

                if (section) {
                    section.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }

            // Simulation
            else if (
                text.includes("simulation") ||
                text.includes("simulate")
            ) {
                event.preventDefault();

                const button =
                    document.getElementById(
                        "simulateButton"
                    );

                if (button) {
                    button.click();
                }
            }

            // Forecast
            else if (
                text.includes("forecast")
            ) {
                event.preventDefault();

                const button =
                    document.getElementById(
                        "forecastButton"
                    );

                if (button) {
                    button.click();
                }
            }

            // Resources / Optimizer
            else if (
                text.includes("resource") ||
                text.includes("optimizer")
            ) {
                event.preventDefault();

                const button =
                    document.getElementById(
                        "optimizeButton"
                    );

                if (button) {
                    button.click();
                }
            }

            // Mission
            else if (
                text.includes("mission")
            ) {
                event.preventDefault();

                if (window.RELIEFOS_MISSION) {
                    window.RELIEFOS_MISSION();
                }
                else {
                    const button =
                        document.getElementById(
                            "missionButton"
                        );

                    if (button) {
                        button.click();
                    }
                }
            }

        });

    });

    console.log(
        "RELIEFOS SIDEBAR → READY"
    );

})();
(function () {

    // ==========================================
    // RELIEFOS SMART MAP CONTROLS
    // ==========================================

    document.querySelectorAll(".interactive-zone")
        .forEach(function (zone) {

            zone.addEventListener("click", async function () {

                const zoneId =
                    zone.dataset.zone;

                console.log(
                    "RELIEFOS MAP → ZONE",
                    zoneId,
                    "SELECTED"
                );

                // Highlight selected zone
                document
                    .querySelectorAll(".interactive-zone")
                    .forEach(function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    });

                zone.classList.add("selected");

                // Load latest zone information
                try {

                    const response =
                        await fetch("/api/zones");

                    if (!response.ok) {
                        throw new Error(
                            "Zone API failed"
                        );
                    }

                    const data =
                        await response.json();

                    const selected =
                        data.zones.find(
                            function (item) {
                                return item.id === zoneId;
                            }
                        );

                    if (!selected) {
                        return;
                    }

                    // Update Zone Intelligence
                    const name =
                        document.getElementById(
                            "selectedZoneName"
                        );

                    const priority =
                        document.getElementById(
                            "selectedZonePriority"
                        );

                    const population =
                        document.getElementById(
                            "zonePopulation"
                        );

                    const water =
                        document.getElementById(
                            "zoneWater"
                        );

                    const food =
                        document.getElementById(
                            "zoneFood"
                        );

                    const medicine =
                        document.getElementById(
                            "zoneMedicine"
                        );

                    const accessibility =
                        document.getElementById(
                            "zoneAccessibility"
                        );

                    const level =
                        document.getElementById(
                            "zoneLevel"
                        );


                    if (name) {
                        name.textContent =
                            "ZONE " + selected.id;
                    }

                    if (priority) {
                        priority.textContent =
                            selected.priority;
                    }

                    if (population) {
                        population.textContent =
                            Number(
                                selected.population
                            ).toLocaleString();
                    }

                    if (water) {
                        water.textContent =
                            selected.water + "%";
                    }

                    if (food) {
                        food.textContent =
                            selected.food + "%";
                    }

                    if (medicine) {
                        medicine.textContent =
                            selected.medicine + "%";
                    }

                    if (accessibility) {
                        accessibility.textContent =
                            selected.accessibility + "%";
                    }

                    if (level) {

                        level.textContent =
                            selected.level;

                        if (
                            selected.level ===
                            "CRITICAL"
                        ) {

                            level.style.color =
                                "var(--red)";

                        } else if (
                            selected.level ===
                            "ELEVATED"
                        ) {

                            level.style.color =
                                "var(--yellow)";

                        } else {

                            level.style.color =
                                "var(--green)";
                        }
                    }


                    // Scroll to Zone Intelligence
                    const intelligence =
                        document.querySelector(
                            "#selectedZoneName"
                        );

                    if (intelligence) {

                        intelligence.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }

                } catch (error) {

                    console.error(
                        "Map interaction error:",
                        error
                    );

                }

            });

        });

    console.log(
        "RELIEFOS SMART MAP → READY"
    );

})();
// ==========================================
// RELIEFOS SIDEBAR FUNCTIONALITY
// EXISTING UI ONLY — NO DESIGN CHANGES
// ==========================================

(function () {

    const sidebarItems = document.querySelectorAll(
        ".sidebar a, .sidebar .nav-item"
    );

    sidebarItems.forEach(function (item) {

        item.addEventListener("click", function (event) {

            const href = item.getAttribute("href");

            // If the sidebar item already has a valid section link,
            // allow normal browser scrolling.
            if (href && href.startsWith("#")) {

                const section =
                    document.querySelector(href);

                if (section) {

                    event.preventDefault();

                    section.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                    return;
                }
            }

            // Existing sidebar actions
            const text =
                item.textContent
                    .trim()
                    .toLowerCase();

            event.preventDefault();

            if (text.includes("dashboard")) {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

            else if (
                text.includes("simulation")
            ) {

                const button =
                    document.getElementById(
                        "simulateButton"
                    );

                if (button) {
                    button.click();
                }

            }

            else if (
                text.includes("forecast")
            ) {

                const button =
                    document.getElementById(
                        "forecastButton"
                    );

                if (button) {
                    button.click();
                }

            }

            else if (
                text.includes("resource") ||
                text.includes("optimizer")
            ) {

                const button =
                    document.getElementById(
                        "optimizeButton"
                    );

                if (button) {
                    button.click();
                }

            }

            else if (
                text.includes("mission")
            ) {

                if (
                    window.RELIEFOS_GENERATE_MISSION
                ) {

                    window.RELIEFOS_GENERATE_MISSION();

                } else {

                    const button =
                        document.getElementById(
                            "missionButton"
                        );

                    if (button) {
                        button.click();
                    }
                }

            }

        });

    });

    console.log(
        "RELIEFOS → EXISTING SIDEBAR FUNCTIONALITY READY"
    );

})();
(function () {

    // ==========================================
    // EXISTING MAP ZONE FUNCTIONALITY
    // UI UNCHANGED
    // ==========================================

    const mapZones =
        document.querySelectorAll(
            ".interactive-zone"
        );

    mapZones.forEach(function (zone) {

        zone.addEventListener(
            "click",
            async function () {

                const zoneId =
                    zone.dataset.zone;

                if (!zoneId) {
                    return;
                }

                console.log(
                    "RELIEFOS → Zone selected:",
                    zoneId
                );

                try {

                    const response =
                        await fetch("/api/zones");

                    if (!response.ok) {
                        throw new Error(
                            "Zone API error"
                        );
                    }

                    const data =
                        await response.json();

                    const selectedZone =
                        data.zones.find(
                            function (item) {
                                return (
                                    item.id === zoneId
                                );
                            }
                        );

                    if (!selectedZone) {
                        return;
                    }

                    // Existing Zone Intelligence fields
                    const fields = {

                        selectedZoneName:
                            "ZONE " + selectedZone.id,

                        selectedZonePriority:
                            selectedZone.priority,

                        zonePopulation:
                            Number(
                                selectedZone.population
                            ).toLocaleString(),

                        zoneWater:
                            selectedZone.water + "%",

                        zoneFood:
                            selectedZone.food + "%",

                        zoneMedicine:
                            selectedZone.medicine + "%",

                        zoneAccessibility:
                            selectedZone.accessibility + "%",

                        zoneLevel:
                            selectedZone.level
                    };


                    Object.keys(fields).forEach(
                        function (id) {

                            const element =
                                document.getElementById(
                                    id
                                );

                            if (element) {

                                element.textContent =
                                    fields[id];

                            }

                        }
                    );


                    console.log(
                        "RELIEFOS → Zone data loaded:",
                        selectedZone
                    );

                }

                catch (error) {

                    console.error(
                        "RELIEFOS → Zone loading failed:",
                        error
                    );

                }

            }
        );

    });

    console.log(
        "RELIEFOS → MAP INTERACTION READY"
    );

})();
// ==========================================
// RELIEFOS CONTROL CENTER
// MAKES EXISTING BUTTONS FUNCTIONAL
// UI UNCHANGED
// ==========================================

(function () {

    function log(title, data) {
        console.log(
            "RELIEFOS → " + title,
            data || ""
        );
    }

    // -------------------------------
    // DASHBOARD REFRESH
    // -------------------------------

    window.RELIEFOS_REFRESH = async function () {

        log("REFRESH STARTED");

        try {

            const response =
                await fetch("/api/zones");

            if (!response.ok) {
                throw new Error(
                    "Zone API failed"
                );
            }

            const data =
                await response.json();

            log(
                "ZONES UPDATED",
                data.zones
            );

            if (
                typeof window.loadZones ===
                "function"
            ) {
                await window.loadZones();
            }

        }

        catch (error) {

            console.error(
                "RELIEFOS REFRESH ERROR:",
                error
            );

        }

    };


    // -------------------------------
    // SIMULATION
    // -------------------------------

    window.RELIEFOS_SIMULATE =
        async function () {

        log("SIMULATION STARTED");

        try {

            const response =
                await fetch(
                    "/api/simulate",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            population: 18000,
                            water: 25,
                            food: 40,
                            medicine: 30,
                            accessibility: 35
                        })
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Simulation API failed"
                );
            }

            const result =
                await response.json();

            log(
                "SIMULATION RESULT",
                result
            );

        }

        catch (error) {

            console.error(
                "SIMULATION ERROR:",
                error
            );

        }

    };


    // -------------------------------
    // FORECAST
    // -------------------------------

    window.RELIEFOS_FORECAST =
        async function () {

        log("FORECAST STARTED");

        try {

            const response =
                await fetch(
                    "/api/forecast",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            population: 18000,
                            water: 25
                        })
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Forecast API failed"
                );
            }

            const result =
                await response.json();

            log(
                "FORECAST RESULT",
                result
            );

        }

        catch (error) {

            console.error(
                "FORECAST ERROR:",
                error
            );

        }

    };


    // -------------------------------
    // RESOURCE OPTIMIZER
    // -------------------------------

    window.RELIEFOS_OPTIMIZE =
        async function () {

        log("RESOURCE OPTIMIZATION STARTED");

        try {

            const response =
                await fetch(
                    "/api/optimize"
                );

            if (!response.ok) {
                throw new Error(
                    "Optimizer API failed"
                );
            }

            const result =
                await response.json();

            log(
                "RESOURCE ALLOCATION",
                result
            );

        }

        catch (error) {

            console.error(
                "OPTIMIZER ERROR:",
                error
            );

        }

    };


    // -------------------------------
    // MISSION GENERATOR
    // -------------------------------

    window.RELIEFOS_MISSION =
        async function () {

        log("MISSION GENERATION STARTED");

        try {

            const zonesResponse =
                await fetch(
                    "/api/zones"
                );

            const zoneData =
                await zonesResponse.json();

            const zones =
                zoneData.zones || [];

            if (!zones.length) {
                return;
            }

            zones.sort(
                function (a, b) {
                    return b.priority -
                           a.priority;
                }
            );

            const target =
                zones[0];

            log(
                "MISSION TARGET",
                target
            );

            const response =
                await fetch(
                    "/api/response-plan",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            zone: target.id,

                            population:
                                target.population,

                            water:
                                target.water,

                            food:
                                target.food,

                            medicine:
                                target.medicine,

                            accessibility:
                                target.accessibility

                        })
                    }
                );

            if (!response.ok) {
                throw new Error(
                    "Mission API failed"
                );
            }

            const result =
                await response.json();

            log(
                "MISSION READY",
                result
            );

        }

        catch (error) {

            console.error(
                "MISSION ERROR:",
                error
            );

        }

    };


    // -------------------------------
    // EARLY WARNING
    // -------------------------------

    window.RELIEFOS_MONITOR =
        async function () {

        log("EARLY WARNING SCAN STARTED");

        try {

            const response =
                await fetch(
                    "/api/zones"
                );

            const data =
                await response.json();

            const zones =
                data.zones || [];

            for (
                const zone of zones
            ) {

                const riskResponse =
                    await fetch(
                        "/api/risk",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                population:
                                    zone.population,

                                water:
                                    zone.water,

                                food:
                                    zone.food,

                                medicine:
                                    zone.medicine,

                                accessibility:
                                    zone.accessibility

                            })
                        }
                    );

                const risk =
                    await riskResponse.json();

                log(
                    "ZONE " + zone.id +
                    " RISK",
                    risk
                );

            }

            log(
                "EARLY WARNING SCAN COMPLETE"
            );

        }

        catch (error) {

            console.error(
                "MONITOR ERROR:",
                error
            );

        }

    };


    // -------------------------------
    // MASTER SCAN
    // -------------------------------

    window.RELIEFOS_FULL_SCAN =
        async function () {

        log(
            "=============================="
        );

        log(
            "RELIEFOS FULL SYSTEM SCAN"
        );

        await window.RELIEFOS_REFRESH();

        await window.RELIEFOS_SIMULATE();

        await window.RELIEFOS_FORECAST();

        await window.RELIEFOS_OPTIMIZE();

        await window.RELIEFOS_MONITOR();

        await window.RELIEFOS_MISSION();

        log(
            "FULL SYSTEM SCAN COMPLETE"
        );

    };


    console.log(
        "RELIEFOS → CONTROL CENTER READY"
    );

})();