@echo off
setlocal
cd /d "%~dp0"
py -3.12 scripts\setup.py
if errorlevel 1 (
  echo Setup did not complete. Read the message above or ask your AI to fix setup.
)
pause
