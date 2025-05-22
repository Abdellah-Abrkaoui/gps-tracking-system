#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "NMEA.h"

const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* jsonRpcEndpoint = "https://kjlg2k-ip-196-74-47-75.tunnelmole.net/rpc";

unsigned long lastRpcId = 0;
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 10000; // 10 seconds

NMEA gps(ALL); // Support both GPRMC and GPGGA

float latitude = 0;
float longitude = 0;
float speed = 0;
float altitude = 0;
bool gpsDataValid = false;

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, 16, 17); // RX=GPIO16, TX=GPIO17
 // GPS module serial

  // Connect to Wi-Fi
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
}

void loop() {
  // Read data from GPS
  while (Serial2.available()) {
    char serialData = Serial2.read();
    if (gps.decode(serialData)) {
      if (gps.gprmc_status() == 'A') {
        latitude  = gps.gprmc_latitude();
        longitude = gps.gprmc_longitude();
        speed     = gps.gprmc_speed(KMPH);
        altitude  = 0;
        gpsDataValid = true;
      } else {
        gpsDataValid = false;
      }
    }
  }

  // Send every 10 seconds
  if (gpsDataValid && millis() - lastSendTime >= sendInterval) {
    lastSendTime = millis();
    sendJsonRpcRequest(latitude, longitude, speed, altitude);
  }
}

void sendJsonRpcRequest(float lat, float lon, float spd, float alt) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected. Skipping request.");
    return;
  }

  DynamicJsonDocument doc(512);
  doc["jsonrpc"] = "2.0";
  doc["method"] = "insert_location";
  doc["id"] = ++lastRpcId;

  JsonObject params = doc.createNestedObject("params");
  params["device_id"] = 1;
  params["latitude"]  = lat;
  params["longitude"] = lon;
  params["speed"]     = spd;
  params["altitude"]  = alt;

  String jsonData;
  serializeJson(doc, jsonData);

  HTTPClient http;
  http.begin(jsonRpcEndpoint);
  http.addHeader("Content-Type", "application/json");

  Serial.println("Sending JSON-RPC Request:");
  Serial.println(jsonData);

  int httpCode = http.POST(jsonData);
  if (httpCode > 0) {
    String response = http.getString();
    Serial.println("Server Response:");
    Serial.println(response);
  } else {
    Serial.print("HTTP Error: ");
    Serial.println(http.errorToString(httpCode));
  }

  http.end();
}
