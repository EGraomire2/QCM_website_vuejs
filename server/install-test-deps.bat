@echo off
echo Installing test dependencies...
npm install --save-dev vitest@^1.0.0 fast-check@^3.15.0 @vitest/ui@^1.0.0
echo.
echo Installation complete!
echo.
echo You can now run tests with:
echo   npm test
