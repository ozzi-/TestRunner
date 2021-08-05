![build status](https://api.travis-ci.com/ozzi-/TestRunner.svg?branch=master)
![licence](https://img.shields.io/github/license/ozzi-/TestRunner.svg)
![open issues](https://img.shields.io/github/issues/ozzi-/TestRunner.svg)


# TR - Test Runner
Do you have a bunch of scripts that test your applications and services at runtime?

Do you wish to have a unified interface for running those tests instead of using the command line?

Do you require evidence of test runs?

TR enables you to do all of this by providing an unified way of running tests & storing results through a convinient web UI and REST API!

<img src="https://i.imgur.com/oronXja.png" width="260"> meep meep

# Screenshot
<img src="https://i.imgur.com/kan52as.png" width="750">

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

## Tasks
A task knows two states, success or failure.
However, there are different reasons why a task can fail:
- The task ran longer than the defined timeout and was killed
- The task returned a non zero exit code

If one task failes, the whole test will be marked as failed.

<img src="https://i.imgur.com/iULtQ1A.png" width="550">

### Hooks
Every task may have a success and or failure hook. Those are paths that will be called upon the task failing or succeeding.

Note: When using groups, the last hooks in order will be used. 
i.E. The group consists of three tests: "1", "2", "3".

"1" defines a success hook

"2" defines a success hook and a failure hook

"3" defines a failure hook

This means the used success hook is from "2" and the failure hook from "3".

### Archiving result files
For every task you can provide a path pointing to an arbitrary file. If the task is run, the file under said path is copied into the result and is thus archived by TestRunner. This is helpful if your task does not print all results to stdout/err but as an example into a HTML report file.
<img src="https://i.imgur.com/u61O317.png" width="320">

## Test Groups
Test Groups allow you to run multiple tests in one go, resulting in a combined result.

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
    
    
## Test Categories
In order to structure your tests, you may create categories that will visually group them in your web UI.
<img src="https://i.imgur.com/eLAqzjV.png" width="450">

## User Roles
Different roles exist in TR:

The role "r" - READ can only view results, "rx" READEXECUTE can additionally run the defined tests.

The role "rwx" READWRITEEXECUTE can additionally edit (write) test and testgroups.

The role "a" ADMIN can additionally administer users.

# Deployment
Under Windows, TR will create a folder called "TR" in your %APPDATA% folder. Under Linux, TR will create a folder called "/var/lib/TR". This is later referenced as "base path".
All configuration is persisted as JSON files. Manual editing of the files is discouraged, please use the web UI or the API.

You can build your own WAR file using maven or you can download the latest binary from the projects GitHub page under the tab "Releases". Then deploy the WAR in your tomcat webapps folder.
Make sure the user running tomcat can create a folder "TR" under "/var/lib" (or "%APPDATA%" when using windows).
Now TR should be up and running under localhost:8080/TR/frontend/index.html - When running TR for the first time, a user "admin" with the password "letmein" will be created for you.

## Example configuration for lighttpd
I recommend adding a webserver acting as a reverse proxy infront of your tomcat, here an example for lighttpd:
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

## Logs
Extensive logs are saved in the basePath/logs folder. The logs are visible too under the web UI for all administrators:
<img src="https://i.imgur.com/taa9w6q.png" width="550">

# API
You can find a swagger.json under https://github.com/ozzi-/TestRunner/blob/master/WebContent/swagger.json or when during runtime under http://127.0.0.1:8080/testrunner/api/swagger.json

# Manual
work in progress

## Admin Settings
https://i.imgur.com/DBNgQf9.png

https://i.imgur.com/wgUZDgR.png

https://i.imgur.com/QD6Rva3.png

## Script
https://i.imgur.com/ry4OvM8.png

https://i.imgur.com/lHXFS2Y.png

https://i.imgur.com/fpgqLyB.png

https://i.imgur.com/j2hswam.png

## Test

https://i.imgur.com/7ubDQi3.png

https://i.imgur.com/ytXYReT.png

https://i.imgur.com/SRQCQDn.png


## Testing
https://i.imgur.com/Bfq7FOs.png

https://i.imgur.com/NMD6iVf.png

https://i.imgur.com/E7100mk.png

### Custom Runs
https://i.imgur.com/9YNwpoj.png

https://i.imgur.com/E7Ojq8L.png

https://i.imgur.com/YaBzqGa.png

https://i.imgur.com/cUss2r2.png

## Categories
https://i.imgur.com/g2lsyRi.png

https://i.imgur.com/nQmIshx.png

https://i.imgur.com/6qd8wFY.png

https://i.imgur.com/T4XLheP.png

https://i.imgur.com/UeYNrye.png

## Groups
https://i.imgur.com/bswOiYb.png

https://i.imgur.com/bgK4jVL.png

https://i.imgur.com/nrAEgVf.png

https://i.imgur.com/qtuPj7p.png

## History
https://i.imgur.com/ZilHxpa.png

https://i.imgur.com/Wc9wupv.png

https://i.imgur.com/1pBGJ2F.png

https://i.imgur.com/mCgctYB.png

https://i.imgur.com/tB6YEze.png

https://i.imgur.com/wlMoNMV.png
