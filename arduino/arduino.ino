const int sensorPin = A0; // Analog Pin 0
volatile int r = 0;
void setup()
{
  Serial.begin(9600);        // Avataan keskustelu koneen kanssa 9600bps
  pinMode(sensorPin, INPUT); // Kerrotaan että sensorPin tuo dataa sisään
}

void loop()
{
  int sensorVal = analogRead(sensorPin);
  r= r+1;
  if (sensorVal > 0){
    Serial.print(0);
  }else{
    Serial.print(1);
  }
  if(r == 8){
    Serial.println();
    r = 0;
  }
  delay(100); // Annetaan koneen ja ihmisen levähtää 0,200 sekunniksi
}