import sys
import os
import serial
import threading


def monitor():

    ser = serial.Serial(COMPORT, BAUDRATE, timeout=1)

    while (1):
        line = ser.readline()

        if (line != ""):
            print(line.decode('utf-8'))

            text_file.write(line.decode('utf-8'))

        # do some other things here

    print("Stop Monitoring")


""" -------------------------------------------
MAIN APPLICATION
"""

print("Start Serial Monitor")
print()
text_file = open("plow_data.log", "a")
COMPORT = "/dev/ttyACM0"
BAUDRATE = 9600

monitor()

text_file.close()
