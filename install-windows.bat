@echo off
title EISGRC Ticket Organizer — Setup
echo.
echo Running installer...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0install-windows.ps1"
