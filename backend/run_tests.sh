#!/bin/bash
# Robust test runner for Eonix

# 1. Set Project Root (Current Directory)
export PYTHONPATH=$PYTHONPATH:$(pwd)

# 2. check python
if [ -d "venv" ]; then
    echo "🐍 Using virtual environment..."
    PYTHON_CMD="venv/bin/python"
else
    echo "⚠️  Virtual environment not found, using system python3..."
    PYTHON_CMD="python3"
fi

# 3. Check imports
echo "🔍 Checking dependencies..."
$PYTHON_CMD -c "import fastapi; import pydantic; import neo4j; print('✅ Dependencies OK')" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "❌ Missing dependencies. Installing critical packages..."
    $PYTHON_CMD -m pip install fastapi pydantic neo4j-driver sqlalchemy gitpython
fi

# 4. Run Test
echo "🚀 Running End-to-End Test..."
$PYTHON_CMD tests/test_e2e.py
