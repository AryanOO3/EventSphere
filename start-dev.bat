@echo off
echo Starting EventSphere development servers...

start cmd /k "cd eventsphere-backend && npm run dev"
timeout /t 5
start cmd /k "cd eventsphere-frontend && npm start"

echo Both servers started!