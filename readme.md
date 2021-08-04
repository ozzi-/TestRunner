![build status](https://api.travis-ci.com/ozzi-/TestRunner.svg?branch=master)
![licence](https://img.shields.io/github/license/ozzi-/TestRunner.svg)
![open issues](https://img.shields.io/github/issues/ozzi-/TestRunner.svg)


# TR - Test Runner
Do you have a bunch of scripts that test your applications and services at runtime?

Do you wish to have a unified interface for running those tests instead of using the command line?

Do you require evidence of test runs?

TR enables you to do all of this by providing an unified way of running tests & storing results through a convinient web UI and REST API!

<img src="https://i.imgur.com/oronXja.png" width="300"> meep meep

# Screenshots
## Main Page
<img src="https://i.imgur.com/kan52as.png" width="750">

## Results Page
<img src="https://i.imgur.com/1szWsK1.png" width="750">

# TR Principles

## Full transparency 
Every change to your test and scripts is kept in a local GIT repository. This allows to have full transparency, ensuring that for every test result it is clear what exactly was tested, providing a chain of evidence of your test results.

<img src="https://i.imgur.com/htbhBLR.png" width="550">

<img src="https://i.imgur.com/zcjJwyJ.png" width="550">

<img src="https://i.imgur.com/12Stnky.png" width="350">


## Tests
A test is a collection of one or more tasks.

           +------+
           | Test |
           +------+
              |
      +---------------+
      |       |       |
      v       v       v
    Task1   Task2   Task3


A task defines the path to the exectuable (the actual test). TR will run all tasks subsequently while capturing their output.

## Task Results
A task knows two states, success or failure.
However, there are different reasons why a task can fail:
- The task ran longer than the defined timeout and was killed
- The task returned a non zero exit code

If one task failes, the whole test will be marked as failed.
<img src="https://i.imgur.com/iULtQ1A.png" width="550">

### Archiving result files
For every task you can provide a path pointing to an arbitrary file. If the task is run, the file under said path is copied into the result and is thus archived by TestRunner. This is helpful if your task does not print all results to stdout/err but as an example into a HTML report file.
<img src="https://i.imgur.com/u61O317.png" width="320">


## Test Groups
Test Groups allow to run multiple tests in one go and one report.

                      +-------+
                      | Group |
                      +---+---+
                          |
              +-----------+-----------+
              |                       |
        +-----+-----+           +-----+-----+
        | Mail Test |           | Auth Test |
        +-----+-----+           +-----+-----+
              |                       |
      +---------------+       +---------------+
      |       |       |       |       |       |
      v       v       v       v       v       v
    Task1   Task2   Task3   Auth1   Auth2   Auth3
    
    

# Configuration
Under Windows, TR will create a folder called "TR" in your %APPDATA% folder. Under Linux, TR will create a folder called "/var/lib/TR". This is later referenced as "base path".
All configuration is saved as JSON files.

## Deployment
Build your own war file using maven or get the newest binary from the projects GitHub page under the tab "Releases". Deploy it in your tomcat webapps folder.
Make sure the user running tomcat can create a folder "TR" under "/var/lib" (or "%APPDATA%" when using windows).
Now TR is ready to run your tests under localhost:8080/TR/frontend/index.html.

### Example configuration  for lighttpd
```
$HTTP["host"] == "testrunner.your.domain.com" {
  proxy.server = ( "" => ( ( "host" => "127.0.0.1", "port" => "8080" ) ) )
  setenv.add-environment = ("fqdn" => "true")

  url.redirect = ("^/$" => "/TR/frontend/index.html" )
  $HTTP["scheme"] == "http" {
    $HTTP["host"] =~ ".*" {
      url.redirect = (".*" => "https://%0$0")
    }
  }

  $SERVER["socket"] == ":443" {
    ssl.engine = "enable"
    ssl.pemfile = "/etc/lighttpd/certs/tr.pem"
    ssl.honor-cipher-order = "enable"
    ssl.cipher-list = "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH"
    ssl.use-compression = "disable"
    ssl.use-sslv2 = "disable"
    ssl.use-sslv3 = "disable"
  }
}
```
## Users
If you run TR the first time, a users.json file will be automatically generated.
Default login credentials are "admin" with the password "letmein". All passwords are hashed and use unique salts.

### Roles
The role "r" - READ can only view results, "rx" READEXECUTE can additionally run the defined tests.

The role "rwx" READWRITEEXECUTE can additionally edit (write) test and testgroups.

The role "a" ADMIN can additionally administer users.


## Logs
Extensive logs are saved in the basePath/logs folder. The logs are visible too under the web UI for all administrators:
<img src="https://i.imgur.com/taa9w6q.png" width="550">

# API
You can find a swagger.json under https://github.com/ozzi-/TestRunner/blob/master/WebContent/swagger.json or when during runtime under http://127.0.0.1:8080/testrunner/api/swagger.json
