#!/bin/bash
cd "$(dirname "$0")"
PUERTO=8765
echo "Abriendo Mac Bright en http://localhost:$PUERTO ..."
open "http://localhost:$PUERTO/index.html"
python3 -m http.server $PUERTO
