# Smart City Dashboard Project Report

## 6. DESIGN

### 6.1. System design

It is the procedure of describing the construction, components, modules, interfaces, and data for a system to satisfy specified requirements. One could understand it as the application of systems theory to product development. There is nearly a joint with the disciplines of systems analysis, systems architecture and systems engineering.

The use case diagram for our Smart City Dashboard system:

```plantuml
@startuml
left to right direction
actor "Citizen/User" as User
actor "Admin" as Admin
rectangle "Smart City Dashboard System" {
  usecase "Open Dashboard" as UC0
  usecase "View Weather" as UC1
  usecase "View AQI" as UC2
  usecase "Search Healthcare" as UC3
  usecase "Search Tourism" as UC4
  usecase "View/Manage Reports" as UC5
  usecase "Manage Notifications" as UC6
  usecase "View Profile/Settings" as UC7
  usecase "Login/Register" as UC8
  usecase "Emergency Alerts" as UC9
  usecase "View Health Tips" as UC10
  usecase "View Help" as UC11
  usecase "Manage Data" as UC12
  usecase "View System Status" as UC13

  User --> UC0
  User --> UC1
  User --> UC2
  User --> UC3
  User --> UC4
  User --> UC5
  User --> UC6
  User --> UC7
  User --> UC8
  User --> UC9
  User --> UC10
  User --> UC11

  Admin --> UC12
  Admin --> UC5
  Admin --> UC13

  UC8 ..> (Auth Page) : <<include>>
  UC7 ..> UC6 : <<include>>
  UC7 ..> UC5 : <<include>>
  UC12 ..> (Weather Data) : <<include>>
  UC12 ..> (AQI Data) : <<include>>
  UC12 ..> (Healthcare Data) : <<include>>
  UC12 ..> (Tourism Data) : <<include>>

  component "React Frontend" as Frontend
  component "Node.js/Express API" as Backend
  Frontend -down-> Backend : API Calls
}
@enduml
```

This diagram illustrates the main actors (Citizen/User and Admin), key use cases based on the project's frontend pages and backend routes, and high-level components (Frontend and Backend).

### 6.2. Class diagram

The class diagram represents the static structure of the Smart City Dashboard system, showing key entities, their attributes, methods, and relationships based on backend routes and frontend components.

```plantuml
@startuml

class User {
  +name : String
  +email : String
  +password : String
  +register()
  +login()
  +updateProfile()
  +viewNotifications()
}

class CityData {
  -city : String
  -data : Object
  -timestamp : Date
  -dataType : String
  +fetchData()
  +saveData()
  +updateData()
}

class Weather {
  -temperature : Double
  -humidity : Double
  -condition : String
  -cityId : Integer
  +getWeather()
  +forecast()
}

class AQI {
  -aqiValue : Integer
  -pm25 : Double
  -pm10 : Double
  -cityId : Integer
  +getAQI()
  +healthImpact()
}

class Healthcare {
  -hospitals : Array
  -clinics : Array
  -emergency : String
  -cityId : Integer
  +getHospitals()
  +findNearest()
}

class Report {
  -type : String
  -data : Object
  -generatedAt : Date
  -userId : Integer
  +generateReport()
  +exportReport()
}

class Notification {
  -message : String
  -type : String
  -timestamp : Date
  -userId : Integer
  +sendNotification()
  +getNotifications()
}

class Category {
  -name : String
  +getServices()
}

' Relationships
User --> CityData
User --> Report
User --> Notification

CityData <|-- Weather
CityData <|-- AQI
CityData <|-- Healthcare

Report --> Notification

Category --> "Weather"
Category --> "AQI"
Category --> "Healthcare"
Category --> "Tourism"
Category --> "Reports"

@enduml
```

This class diagram captures core domain classes derived from project features: User for authentication, CityData as base for services like Weather/AQI/Healthcare (matching backend routes), Report/Notification (matching pages/routes), with inheritance, associations, and categories.

### 6.3. Level 0 Data Flow Diagram (Context Diagram)

Level 0 DFD for Smart City Dashboard showing the system as a single process interacting with external entities.

```plantuml
@startuml
left to right direction

' External Entities
rectangle "Citizen/User" as User
rectangle "Admin" as Admin
rectangle "External APIs\n(OpenWeatherMap,\nGoogle Places)" as APIs

' Central Process - Level 0 Context
rectangle "Smart City Dashboard System\n(Context Level)" as System {
  note right
    MERN Stack Dashboard:
    * Auth & City Context
    * Data Aggregation from APIs
    * Real-time Dashboard/Alerts
  end note
}

' Major Data Flows
User --> System : city search, auth, reports, settings
System --> User : weather, AQI, hospitals, tourism, alerts, notifications
Admin --> System : data management, status checks
System --> Admin : system reports, analytics
APIs --> System : raw weather/AQI/places data
System --> APIs : geocoding/API queries

@enduml
```

### 6.6. User Activity Flowchart

Flowchart showing typical Citizen/User activities in the Smart City Dashboard.

```plantuml
@startuml user_flow
start
:User opens app;
if (Has token?) then (yes)
  :Go to Dashboard;
else (no)
  :Login/Register;
  if (Auth success?) then (yes)
    :Redirect to Dashboard;
  else (no)
    stop
  endif
endif

:Select service
(e.g. Weather, AQI, Healthcare);
:Enter city name;
note right
  Uses CityContext for global city
end note
:Fetch data from APIs
(OpenWeather/Google);
if (Data loaded?) then (yes)
  :Display results +
  dynamic alerts/tips;
else (no)
  :Show error +
  retry option;
endif

:Optional: Generate Report /
View Notifications;
:Update Profile/Settings;
stop
@enduml
```


### 6.4. Level 1 Data Flow Diagram

```plantuml
@startuml
left to right direction
rectangle "Citizen/User" as User
rectangle "Admin" as Admin
rectangle "External APIs" as APIs
circle "1.0 Auth & User" as P1
circle "2.0 City Data Fetch" as P2
circle "3.0 Dashboard & Alerts" as P3
circle "4.0 Reports & Notif" as P4
circle "5.0 Admin Mgmt" as P5
database "D1 City Context" as DS1
User --> P1 : login/register
P1 <--> DS1 : user data
User --> P3 : dashboard view
P3 <--> P2 : city data request
P2 <--> APIs : API calls/data
P3 --> User : processed data/alerts
User <--> P4 : reports/notifs
Admin <--> P5 : management
@enduml
```

### 6.5. Level 2 Data Flow Diagram (2.0 City Data Fetch Decomposition)

```plantuml
@startuml
left to right direction
rectangle "External APIs" as APIs
circle "2.1 Get Weather" as P21
circle "2.2 Get AQI" as P22
circle "2.3 Get Healthcare" as P23
circle "2.4 Get Tourism" as P24
database "D1 City Context" as DS1
' Flows from Level 1 parent (3.0) & to parent
P21 <--> APIs : OpenWeather calls
P22 <--> APIs : Air Pollution API
P23 <--> APIs : Google Places Hospitals
P24 <--> APIs : Google Places Tourism
P21 --> DS1 : weather data
P22 --> DS1 : aqi data
P23 --> DS1 : hospitals data
P24 --> DS1 : tourism data
DS1 --> P21 : city lat/lon
@enduml
```


