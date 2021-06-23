@echo off
docker build -t c-problem-run:1.0 ./c
docker build -t cpp-problem-run:1.0 ./cpp
docker build -t java-problem-run:1.0 ./java
docker build -t python-problem-run:1.0 ./python
docker build -t r-problem-run:1.0 ./r