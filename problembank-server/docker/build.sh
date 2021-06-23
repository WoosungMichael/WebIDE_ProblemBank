#!/bin/bash

# C
docker build -t c-problem-run:1.0 ./c

# C++
docker build -t cpp-problem-run:1.0 ./cpp

# Java
docker build -t java-problem-run:1.0 ./java

# python
docker build -t python-problem-run:1.0 ./python

# R
docker build -t r-problem-run:1.0 ./r
