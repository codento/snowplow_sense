const int sensorPin = A0; // Analog Pin 0

void setup()
{
  Serial.begin(9600);        // Avataan keskustelu koneen kanssa 9600bps
  pinMode(sensorPin, INPUT); // Kerrotaan että sensorPin tuo dataa sisään
}

void loop()
{
  int sensorVal = analogRead(sensorPin);

  if (sensorVal > 0){
    Serial.println(0);
  }else{
    Serial.println(1);
  }
  delay(200); // Annetaan koneen ja ihmisen levähtää 0,200 sekunniksi
}
