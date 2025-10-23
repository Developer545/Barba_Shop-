@echo off
setlocal

set MAVEN_PROJECTBASEDIR=%CD%

if not "%MAVEN_PROJECTBASEDIR%"=="" goto endOfMavenProjectBasedir
echo Unable to find Maven project base directory
goto error

:endOfMavenProjectBasedir

set MAVEN_OPTS=-Dmaven.repo.local=%MAVEN_PROJECTBASEDIR%\.m2\repository

if exist "%JAVA_HOME%\bin\java.exe" (
    set JAVA_CMD="%JAVA_HOME%\bin\java.exe"
) else (
    set JAVA_CMD=java.exe
)

%JAVA_CMD% -version >nul 2>&1
if %errorlevel% neq 0 goto error

echo Maven wrapper executing mvn %*
call mvn %*
goto end

:error
exit /b 1

:end
exit /b %errorlevel%