#!/bin/bash

coffeeProcess=`ps a | grep -v grep | grep coffee`

if [ -z "$coffeeProcess" ]
then
	cd /home/pi/Desktop/coffee-dash-button/dashButton
	sudo npm start &> /home/pi/Desktop/coffee-dash-button/dashButton/output.txt
else
	echo "Coffee script already running."
fi
