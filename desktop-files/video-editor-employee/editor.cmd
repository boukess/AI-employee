@echo off
setlocal
set "EDITOR_ROOT=%~dp0"
if exist "%EDITOR_ROOT%.venv\Scripts\python.exe" (
  "%EDITOR_ROOT%.venv\Scripts\python.exe" "%EDITOR_ROOT%scripts\editor.py" %*
) else (
  py -3 "%EDITOR_ROOT%scripts\editor.py" %*
)
exit /b %errorlevel%
