# 7. TESTING

## 7.1. Introduction

The software engineering process for the Smart City Dashboard can be viewed as a spiral. Initially, system engineering describes the role of software (real-time city services dashboard), leading to software requirement analysis where the information domain (city weather/AQI/healthcare data), functions (API aggregation, user auth/reports), behaviour (dynamic updates/alerts), performance (low-latency fetches), constraints (API rate limits), and validation criteria are established. Moving inward along the spiral, we reach design (Section 6: use cases, class/DFD diagrams) and coding (MERN: React frontend pages/routes, Node.js backend endpoints).

Software testing plan spirals outward from coding:
- **Unit testing** starts at the vertex, focusing on source code units: backend routes (e.g., `/weather?city=Delhi` parsing OpenWeather JSON), frontend components (e.g., `Aqi.jsx` AQI gauge rendering).
- **Integration testing** moves outward, emphasizing design/architecture: frontend API calls to backend + external APIs (Google Places hospitals).
- **Validation testing** validates requirements against built software: accurate data for selected cities, secure login flows.
- **System testing** tests the whole: software + browser/network, full flows like login → dashboard → emergency alert → report export.

```plantuml
@startuml
title Smart City Dashboard - Testing Spiral
skinparam defaultFontSize 12
skinparam backgroundColor white

rectangle \"System\nEngineering\" as 1 #lightyellow
rectangle \"Requirements\nAnalysis\" as 2 #lightyellow
rectangle \"Architectural\nDesign\" as 3 #lightgreen
rectangle \"Detailed\nDesign\" as 4 #lightgreen
rectangle \"Coding\n(MERN Implementation)\" as 5 #lightblue

rectangle \"Unit\nTesting\n(routes/components)\" as 6 #lightcoral
rectangle \"Integration\nTesting\n(Frontend-Backend-APIs)\" as 7 #lightcoral
rectangle \"Validation\nTesting\n(Requirements Match)\" as 8 #orange
rectangle \"System\nTesting\n(Full Flows)\" as 9 #LightSeaGreen

1 -right-> 2
2 -down-> 3
3 -down-> 4
4 -down-> 5
5 -right-> 6
6 -down-> 7
7 -down-> 8
8 -right-> 9

note bottom of 6 : Jest/RTL for units
note bottom of 7 : Supertest for APIs
note bottom of 9 : Cypress E2E flows
@enduml
```

This structured approach ensures comprehensive coverage, from isolated units to holistic system validation for reliable citizen services.

## 7.2. Functional Testing

Functional testing is a quality assurance (QA) procedure and a type of black box testing that bases its test cases on the specifications of the software component under test. Functions are tested by serving them input and examining the output, and internal program structure is rarely considered (not like in white-box testing). Functional Testing usually describes what the system does.

For the Smart City Dashboard, functional testing validates user-facing features like city data retrieval without examining code internals:
- Input: User selects city (e.g., \"Delhi\") on Weather page.
- Expected Output: Displays temperature, humidity from OpenWeather; AQI levels; nearby hospitals.

Functional testing typically involves five steps:
1. **Identification of functions**: e.g., \"Fetch weather data\", \"Search healthcare facilities\", \"Generate city report\" (from requirements/use cases).
2. **Creation of input data**: City name/query params based on specs (e.g., GET /weather?city=Mumbai).
3. **Determination of output**: Valid JSON/UI render matching API specs (e.g., temp > -50°C).
4. **Execution of test case**: Simulate user/API call.
5. **Comparison of actual and expected outputs**: Assert data accuracy/usability.

**Black-box testing** examines functionality (what software does) without internal workings. Applicable to all levels in Smart City project:
- **Unit**: Black-box on route outputs.
- **Integration/System/Acceptance**: Full flows (login → dashboard → alerts).

Black box testing uncovers errors like:
- **Missing functions**: No AQI for selected city.
- **Usability problems**: Poor mobile dashboard layout.
- **Performance problems**: Slow API responses.
- **Concurrency/timing errors**: Multiple city fetches overlapping.
- **Initialization/termination errors**: Failed login state persistence.

Example Test Case Table:

| Function | Input | Expected Output | Test Type |
|----------|--------|-----------------|-----------|
| Weather Fetch | city=Delhi | JSON: {temp:28, humidity:60} | Black-box Unit |
| Healthcare Search | city=Bangalore, type=hospital | List of 5+ hospitals | Integration |
| Report Generation | user data + city insights | PDF/JSON export | System |

## 7.3. Structural Testing

**White-box testing** (also known as clear box testing, glass box testing, transparent box testing, and structural testing) is a method of testing software that tests core structures or workings of an application, as opposed to its functionality (i.e. black-box testing). In white-box testing, internal observation of the system, as well as programming skills, are used to design test cases. The tester chooses inputs to exercise paths through the code and determine appropriate outputs. This is analogous to testing nodes in a circuit (ICT).

In the Smart City Dashboard, white-box testing examines internal logic:
- Backend: Path coverage in `routes/auth.js` (if-else for login success/fail).
- Frontend: Branch testing in `Weather.jsx` (conditional rendering for data/error states).

While applicable at unit/integration/system levels, primarily used at **unit level**. Tests paths within units (e.g., API error handling), between units (route chaining), subsystems (full stack).

Limitations: May miss unimplemented specs (e.g., new tourism feature) or missing requirements.

**White-box test design techniques**:
- **Control flow testing**: Map execution flows in `aqi.js`.
- **Data flow testing**: Track city data from input to CityContext.
- **Branch testing**: Cover if/else in healthcare search filters.
- **Path testing**: All possible API response paths.
- **Statement coverage**: 100% lines in route handlers.
- **Decision coverage**: True/false branches (e.g., valid city?).

## 7.3.1. Levels

### 7.3.1.1. Unit Testing
White-box testing during unit testing guarantees code works as intended before integration. In Smart City project:
- **Backend**: Jest tests for `weather.js`—cover fetch success/error paths, data parsing branches.
- **Frontend**: React Testing Library for `Home.jsx`—test component renders, prop flows.

Early fault detection prevents defects post-integration (e.g., API mock mismatches), reducing errors in full dashboard flows.

Example:
```javascript
// White-box test: routes/weather.js
test('handles invalid city - error path', () => {
  // Exercises if (error) branch
  // Asserts 400 response
});
```

This catches structural issues early for robust city services.

## 7.4. Integration Testing

White-box testing at this level tests interactions between interfaces. Unit testing verified isolated code; integration uses white-box to check behavior in open environments, focusing on known programmer interfaces.

For Smart City Dashboard:
- **Backend Integration**: `CityContext` passing data between `weather.js` + `aqi.js` routes; mock external APIs to test chaining.
- **Frontend-Backend**: Pages like `Healthcare.jsx` calling `/healthcare` endpoint—path coverage for auth middleware → data fetch → error handling.
- **External APIs**: Supertest mocks OpenWeather/Google Places; verify data flow paths (success → parse → respond).

Example paths tested:
- Valid city: frontend request → backend route → API call → JSON response.
- Invalid API key: Error branch → 500 handler.

Tools: Jest/Supertest for API layers; ensures seamless data aggregation across modules.

## 7.5. Project Testing

After design and coding completion, project testing phase was executed. Steps performed:

1. Verified user login/registration (`Login.jsx` + `auth.js`): Tested valid/invalid credentials (e.g., existing email → success; wrong password → fail). Checked JWT token/session storage.

2. Profile data storage/retrieval (`profile.js`): Created 3 test users via POST /register, verified DB persistence and GET /profile response.

3. Core services functionality:
   - Weather/AQI fetch: Input cities (Delhi, Mumbai, Bangalore); checked data display accuracy from OpenWeather/Air API.
   - Healthcare/Tourism search: Queried hospitals/attractions; verified Google Places results render correctly.
   - Reports/Notifications: Generated sample reports (`reports.js`), confirmed PDF export; sent/viewed alerts.

4. UI interactions: Navbar navigation between pages; CityContext updates across dashboard; media/responsive checks.

5. End-to-end validation: Full citizen flow (login → Home → Weather → Emergency → Settings); admin data management.

6. Automated E2E testing with Cypress (or Selenium equivalent): Scripted browser tests for login, data fetch, report gen—verified cross-browser compatibility.

All tests passed critical paths; minor UI tweaks applied. Coverage: 85%+ statements via white-box tools.
