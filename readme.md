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
- The task ran longer than the defined timeout and was stopped
- The task exited a non zero exit code

If one task failes, the whole test will be marked as failed.

A test where all tasks succeeded, will look as such:

<img src="https://i.imgur.com/iULtQ1A.png" width="550">

### Hooks
Every task may have a success and/or a failure hook. A hook is a path to a file, that will be executed upon the task failing or succeeding.

Note: When using groups, the last hooks in order will be used. 
i.E. The group consists of three tests: "1", "2", "3".

"1" defines a success hook

"2" defines a success hook and a failure hook

"3" defines a failure hook

This means the group success hook is from "2" and the failure hook from "3".

### Archiving result files
For every task you can provide a path pointing to an arbitrary file. If the task is done running, the file under said path is copied and linked into the result and therefore archived by TestRunner. This is helpful if your task does not print all results to stdout/err but as an example into a HTML report file.

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

You can build your own WAR file using maven or you can download the latest binary from the projects GitHub page under the tab "Releases". Then deploy the WAR in your Tomcat (v10+) webapps folder.
Now TR should be up and running under localhost:8080/TR/frontend/index.html - When running TR for the first time, a user "admin" with the password "letmein" will be created for you - please change the password asap.

## Example configuration for lighttpd
I recommend adding a webserver acting as a reverse proxy infront of your tomcat. This is a an example configuration for lighttpd:
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
Extensive logs are saved in the basePath/logs folder. The latest logs are visible too in the web UI for all administrators:
<img src="https://i.imgur.com/taa9w6q.png" width="550">

# API
You can find the swagger documentation under https://github.com/ozzi-/TestRunner/blob/master/WebContent/swagger.json or during runtime under http://127.0.0.1:8080/testrunner/api/swagger.json

## Authentication
Authentication is performed by providing a sessionIdentifier. In order to generate the identifier, perform a login by sending your username & password as a POST to /user/login 
```
{
  "username": "string",
  "password": "string"
}
```
The response will contain a sessionIdentifier as well as further metadata:
```
{
  "username": "string",
  "sessionIdentifier": "string",
  "created": 0,
  "valid": true,
  "roleID": "string"
}
```
Now you can perform requests by providing the X-TR-Session-ID header with the value of the sessionIdentifier.

# User Guide
After deploying TestRunner, you may follow this guide to understand the basic usage.
First of all, use the default admin user to login (admin:letmein).

## Admin Settings
Lets start by changing the admin password as well as creating a second user.

Navigate to the admin settings by clicking on the cogwheel icon in the right upper corner:
<img src="https://i.imgur.com/DBNgQf9.png">

The admin settings allow you to change your own password, administer users as well as viewing the TestRunner log.
<img src="https://i.imgur.com/wgUZDgR.png" width=450>

When editing a user, you may change their password, role, deleting their open session as well as deleting the user.
<img src="https://i.imgur.com/QD6Rva3.png" width=450>

## Script
In order to create a test, you will first need a script.
If your current user has write privileges, you may create a script as following:

<img src="https://i.imgur.com/ry4OvM8.png" width=250>

There you may either upload a file:

<img src="https://i.imgur.com/lHXFS2Y.png" width=550>

Or you may use the integrated editor to type in your script:

<img src="https://i.imgur.com/j2hswam.png" width=500>

In order to better organize scripts, you can create folder structures:

<img src="https://i.imgur.com/fpgqLyB.png" width=400>


## Test
After creating the first script, it is time to create a test case.

<img src="https://i.imgur.com/7ubDQi3.png" width=400>

In the test create form, provide all required fields as well as add one or more tasks (= executing a specific script with parameters):

<img src="https://i.imgur.com/ytXYReT.png" width=400>

You may always edit the test later:

<img src="https://i.imgur.com/SRQCQDn.png" width=400>


## Testing
Now you are ready to run your tests:

<img src="https://i.imgur.com/Bfq7FOs.png" width=400>

After the test has completed, you will see its results:

<img src="https://i.imgur.com/NMD6iVf.png" width=400>

Furthermore, when navigating to a test, you will be able to see all previous test runs as well as their results
<img src="https://i.imgur.com/E7100mk.png" width=330>

### Custom Runs
Custom runs allow you to add further command line arguments and/or tagging the test run.

<img src="https://i.imgur.com/9YNwpoj.png" width=330>

<img src="https://i.imgur.com/E7Ojq8L.png" width=330>

In the test overview, you will then find the tag labels:

<img src="https://i.imgur.com/cUss2r2.png" width=330>

## Categories
Categories help you to organize your tests. 

Click on the cogwheel next to the tests:

<img src="https://i.imgur.com/g2lsyRi.png" width=330>

First, create a new category:

<img src="https://i.imgur.com/nQmIshx.png" width=400>

Now add a test to the newly created category:

<img src="https://i.imgur.com/6qd8wFY.png" width=400>

The settings will now show you the current category groupings:

<img src="https://i.imgur.com/T4XLheP.png" width=400>


On the dasboard, all tests are now grouped by their according categories:

<img src="https://i.imgur.com/UeYNrye.png" width=400>

## Groups
Groups allow you to group multiple tests into one test group. This not only runs multiple tests through one click, but aggregates the results too. 

For this, click on the cogwheel next to the groups:

<img src="https://i.imgur.com/bswOiYb.png" width=400>

First create a new group:

<img src="https://i.imgur.com/bgK4jVL.png" width=440>

Now you may start adding tests to the group:

<img src="https://i.imgur.com/nrAEgVf.png" width=440>

You can find the group on the dashboard:

<img src="https://i.imgur.com/qtuPj7p.png" width=440>

## History
TestRunner keeps track on all things happening, click on "Change History":

<img src="https://i.imgur.com/ZilHxpa.png" width=400>

Here you will see all changes (called commits, as this feature is based on Git):

<img src="https://i.imgur.com/Wc9wupv.png" width=400>

Clicking on a commit will show you the diff:

<img src="https://i.imgur.com/1pBGJ2F.png" width=400>

When navigating to a specific test, you may see only the changes of the test itself:

<img src="https://i.imgur.com/mCgctYB.png" width=400>

<img src="https://i.imgur.com/tB6YEze.png" width=400>


You are able to revet any change of a test or script at any time, using the "Revert to this commit" button
<img src="https://i.imgur.com/wlMoNMV.png" width=400>
