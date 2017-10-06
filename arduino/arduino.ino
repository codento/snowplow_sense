

volatile byte rotation;
// volatile = kun jossakin on muuttuva arvo
// byte = tallennetaan 8-bittinen numero 0 – 255
unsigned int rpm;
// positiivinen luku rpm
unsigned long time;
// tarvitaan matemaattisissa komennoissa

void rpm_calc() // annetaan rotaatiolle +1
{
  rotation++;
}

void setup()
{
  Serial.begin(9600);
  attachInterrupt(0, rpm_calc, FALLING);
  /* komentoa käytetään kun halutaan tietää loppuuko pin 2 tuleva virta
  * pyörässä reikä joka hyödyttää kierrosten laskemisessa.
  */
  rotation = 0;
  rpm = 0;
  time = 0;
}

void loop()
{
  delay(1000);
  detachInterrupt(0);
  rpm = 30 * 1000 / (millis() - time) * rotation;
  time = millis();
  rotation = 0;

  //Print out result to lcd
  Serial.print("RPM =");
  Serial.println(rpm);

  // käynnistetään keskeytys komento uudestaan.
  attachInterrupt(0, rpm_calc, FALLING);
}