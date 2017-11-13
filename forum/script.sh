#!/bin/bash
for number in {1..10}
do
node dmclient 127.0.0.1:9005 "get subject list" &
done
wait