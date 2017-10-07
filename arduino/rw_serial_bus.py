import sys
import os
import serial
import threading


def monitor(plow_state):
    
    ser = serial.Serial(COMPORT, BAUDRATE, timeout=1)
    state_change = 0
    changing = True
    first = 0
    while (changing):
        line = ser.readline()

        if (line != "" and first > 0):
            check = list(line.decode('utf-8'))
            del check[8:10]
            print(check)
            if all(ones == '1' for ones in check) or all(zeros == '0' for zeros in check):
                changing = False
                plow_state = plow_state
            else:
                if plow_state:
                    plow_state = False
                    state_change += 1
                else:
                    plow_state = True
                    state_change += 1

        print(plow_state)
        first = 1
    if state_change > 0:
        text_file.write("\n")
        text_file.write(str(state_change))
    print("Stop Monitoring")


""" -------------------------------------------
MAIN APPLICATION
"""

print("Start Serial Monitor")
print()
COMPORT = "/dev/ttyACM1"
BAUDRATE = 9600
plow_state = True
for i in range(0, 1000):
    text_file = open("plow_data.log", "a")
    monitor(plow_state)
    i += 1
    text_file.close()


