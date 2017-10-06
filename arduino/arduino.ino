

volatile byte elevation;
// volatile = kun jossakin on muuttuva arvo
// byte = tallennetaan 8-bittinen numero 0 – 255
unsigned int point;
// positiivinen luku rpm
unsigned long time;
// tarvitaan matemaattisissa komennoissa

void lift() // annetaan rotaatiolle +1
{
  if
  elevation++;
}

void setup()
{
  Serial.begin(9600);
  attachInterrupt(0, lift, FALLING);
  /* komentoa käytetään kun halutaan tietää loppuuko pin 2 tuleva virta
  * pyörässä reikä joka hyödyttää kierrosten laskemisessa.
  */
  elevation = 0;
  point = 0;
  time = 0;
}

void loop()
{
  delay(1000);
  detachInterrupt(0);
  point = elevation;
  time = millis();
  elevation = 0;

  //Print out result to lcd
  Serial.print("p");
  Serial.println(point);

  // käynnistetään keskeytys komento uudestaan.
  attachInterrupt(0, rpm_calc, FALLING);
}