/*
  ESP8266 Blink by Simon Peter
  Blink the blue LED on the ESP-01 module
  This example code is in the public domain

  The blue LED on the ESP-01 module is connected to GPIO1
  (which is also the TXD pin; so we cannot use Serial.print() at the same time)

  Note that this sketch uses LED_BUILTIN to find the pin with the internal LED
*/

#include <ArduinoWebsockets.h>
#include "ESP8266WiFi.h"
#include <Servo.h>

// ============== WebSocket Config ======================================================================
const char *ssid = "xxxxxxxxxxx";                          // Enter SSID
const char *password = "xxxxxxxxxxx";                      // Enter Password
const char *websockets_server = "ws://192.168.39.73:8080"; // server adress and port

using namespace websockets;

uint8_t LEDVAL = LOW;
bool isRegistered = false;
bool isClientConnected = false;

void onMessageCallback(WebsocketsMessage message)
{
  Serial.print("Got Message: ");
  String dataString = message.data();
  Serial.println(dataString);

  if (dataString == "toggle")
  {
    LEDVAL = !LEDVAL;
    digitalWrite(LED_BUILTIN, LEDVAL);
  }

  if (dataString == "registered")
  {
    isRegistered = true;
    Serial.print("Registered successfully");
  }
}

void onEventsCallback(WebsocketsEvent event, String data)
{
  if (event == WebsocketsEvent::ConnectionOpened)
  {
    Serial.println("Connnection Opened");
  }
  else if (event == WebsocketsEvent::ConnectionClosed)
  {
    Serial.println("Connnection Closed");
  }
  else if (event == WebsocketsEvent::GotPing)
  {
    Serial.println("Got a Ping!");
  }
  else if (event == WebsocketsEvent::GotPong)
  {
    Serial.println("Got a Pong!");
  }
}

WebsocketsClient client;

void WebSocketConfig()
{
  WiFi.begin(ssid, password);

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LEDVAL);

  // Wait some time to connect to wifi
  for (int i = 0; i < 20 && WiFi.status() != WL_CONNECTED; i++)
  {
    Serial.print(".");
    delay(1000);
  }

  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.print("Unable to connect");
  }
  else
  {
    Serial.print("Connected to wifi");
  }

  // Setup Callbacks
  client.onMessage(onMessageCallback);
  client.onEvent(onEventsCallback);

  // Connect to server
  client.connect(websockets_server);

  // Send a message
  client.send("register: board");
  // Send a ping
  client.ping();
}

// ============== Potentiometer ======================================================================

unsigned int updateTimeout = 200;
unsigned long lastUpdateTime = 0;
unsigned long startedMoving = 0;
unsigned long currTime;
bool shouldMove = false;

int prePotentiometerValue = -1;
int curPotentiometerValue = analogRead(A0);

Servo myservo;

void servo()
{
  if (shouldMove)
  {
    myservo.write(180);

    if (currTime - startedMoving > 1000)
    {
      shouldMove = false;
    }
  }
  else if (abs(curPotentiometerValue - prePotentiometerValue) > 50 && prePotentiometerValue != -1)
  {
    shouldMove = true;
    startedMoving = currTime;
    client.send("emergency");
  }
  else
  {
    myservo.write(0);
  }
}

// ============== Potentiometer State Sender ========================================================

void potentiometerStateUpdate()
{
  currTime = millis();

  prePotentiometerValue = curPotentiometerValue;
  curPotentiometerValue = analogRead(A0);

  if (currTime - lastUpdateTime > updateTimeout && isRegistered)
  {
    client.send(String(curPotentiometerValue));
    lastUpdateTime = currTime;
    servo();
  }
}

// ============== Status LED ======================================================================
#define LED 13

float in = 4.712;
float out = 0;

void StatusLEDConfig()
{
  pinMode(LED, OUTPUT); // set the digital pin as output.
  analogWrite(LED, out);
}

void statusLEDUpdate()
{

  in = in + 0.003;

  if (in > 10.995)
    in = 4.712;

  out = sin(in) * 127.5 + 127.5;
  analogWrite(LED, out);
}

// ============== Main Loop ======================================================================

void setup()
{
  Serial.begin(115200);
  WebSocketConfig();

  StatusLEDConfig();

  pinMode(A0, INPUT);
  myservo.attach(14);
}

void loop()
{
  // Web socket poll
  client.poll();
  myservo.attach(5);
  statusLEDUpdate();
  potentiometerStateUpdate();
}
