![build status](https://api.travis-ci.com/ozzi-/TestRunner.svg?branch=master)
![licence](https://img.shields.io/github/license/ozzi-/TestRunner.svg)
![open issues](https://img.shields.io/github/issues/ozzi-/TestRunner.svg)


# TR - Test Runner
Do you have a bunch of scripts that test applications / services during runtime?

Do you wish to have a unified interface for running those tests instead of using the command line?

Do you require testing evidence?

TR enables you to do all of this by giving you a unified way of running tests & storing results!

![s](https://i.imgur.com/oronXja.png) meep meep

## Main Page
![TR](https://i.imgur.com/kan52as.png)

## Results Page
![TR](https://i.imgur.com/1szWsK1.png)

# TR Principles
## Tests
Tests are a collection of one or more tasks.

        +-----------+
        | some test |
        +-----+-----+
              |
      +---------------+
      |       |       |
      v       v       v
    task1   task2   task3


A task defines the path to the exectuable (the actual test) and a optional timeout. When TR runs a test, all of its tasks will be executed and judging by their exit code and runtime as a success or fail.

Example of a test config:

      {
        "settings": {},
        "test": {
          "description": "Example",
          "tasks" : [{
            "name":"task1",
            "path":"scripts/task1.sh",
            "timeout": 1
          },{
            "name":"task2",
            "path":"scripts/task2.sh",
            "args":["--force"],
            "timeout": 2
          }]
        }
      }

### Task Results
A task knows two states, passed "true" or "false".
However there are different reasons why a task can fail:
- The task ran longer than the defined timeout and was killed
- The task returned a non zero exit code

If one task failes, the whole test will be marked as failed.
![example result](https://i.imgur.com/iULtQ1A.png)


## Test Groups
Test Groups allow to run multiple tests in one go and one report.

                      +-------+
                      | group |
                      +---+---+
                          |
              +-----------+-----------+
              |                       |
        +-----+-----+           +-----+-----+
        | mail test |           | auth test |
        +-----+-----+           +-----+-----+
              |                       |
      +---------------+       +---------------+
      |       |       |       |       |       |
      v       v       v       v       v       v
    task1   task2   task3   auth1   auth2   auth3


# Configuration
Under Windows, TR will create a folder called "TR" in your %APPDATA% folder. Under Linux, TR will create a folder called "/var/lib/TR". This is later referenced as "base path".
All configuration is saved as JSON files.

## Setup
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
Users are stored in basePath/users.json.
If you run TR the first time, a users.json file will be automatically generated.
Default login credentials are "admin" with the password "letmein".

Example of two defined users:

	[
	  {
		"username": "ozzi",
		"password": "6DA7851E78C929C04AF5D2750965E3D8A96E1F2F709B0FB9864D2A5C4703F43F58A5D0E17C6FC8578B41BD22373694791D3EFB053FD80830603D2B076DD7A9FA",
        "salt" : "5ZuIIFgezD",
		"role": "a"
	  },{
		"username": "read",
		"password": "BBFA187429F9C089455B8195896DC9EB10FE07AC0BB09954BD23CFD0721E1207ECA457BCF1BBA350E96C42A21C8503B2D6006B731AFE177E84A61F088CD596F2",
        "salt" : "JKbWLZo0IY",
		"role": "r"
	  }
	]

The role "r" - READ can only view results, "rx" READEXECUTE can additionally run the defined tests.

The role "rwx" READWRITEEXECUTE can additionally edit (write) test and testgroups.

The role "a" ADMIN can additionally administer users.

![settings page](https://i.imgur.com/i34HCAT.png)

## Tests
All tests are stored in basePath/tests/. Each test is defined in its own file.
The test files need to use the file extension ".test".
Example of a test file called "windows.test". The test name is taken from the filename, hence this tests name is "windows".

	{
	  "settings": {
	  },
	  "test": {
		"description": "Tests Windows",
		"tasks": [{
		  "name": "task1",
		  "path": "script1.bat",
		  "timeout": 10
		  },{
		  "name": "task2",
		  "path": "script2.bat",
                  "args": ["--force"],
		  "timeout": 3
		  },{
		  "name": "task3",
		  "path": "script3.bat",
                  "args": ["--force","--silent"],
		  "timeout": 5
		  }]
	  } 
	}

The paths defined can be absolute or relative (to the current directory).

### Hooks
You can define optional hooks which will be ran if the tests succeeds (successhook) or fails (failurehook).
Example of a test which will, when it runs successfully, execute "sendmail.exe" with a command line argument.

	{
	  "settings": {
		"successhook": "C:\\Program Files (x86)\\Mailer\\sendmail.exe \"windows test succeeded\""
	  },
	  "test": {
		"description": "test_windows",
		"tasks": [{
		  "name": "task1",
		  "path": "script1.bat",
		  "timeout": 1
		  }]
	  } 
	}

When using groups, the last hooks in order will be used. 

Example: The group consists of three tests: "1", "2", "3".

"1" defines a success hook

"2" defines a success hook and a failure hook

"3" defines a failure hook

This means the used success hook is from "2" and the failure hook from "3".

### Categories
Categories allow to group tests on the main page, as seen in the screenshot (Mail and SAML), in order to keep the overview when many tests are configured. In order to create categories, create a file called test.categories in your tests folder.
It follows the following syntax:
```
{
	"Mail" : ["MAIL_Performance", "MAIL_Smoke_Test"],
	"SAML": ["SAML_Preprod", "SAML_Prod", "SAML_Rebind"]
}
```
All tests that are not mapped are automatically assigned to the category "-". Tests can only be part of one category.


## Groups
Groups are stored in basePath/groups/. Every Group is defined in its own file.
The group files need to use the file extension ".group".
Example of a group file called "auth.test". The test name is taken from the filename, hence this tests name is "auth".
This group contains the two tests "auth_sso" and "auth_mail".

	{
	  "description": "Grouping all auth tests",
	  "tests": [{
		"test": "auth_sso",
		"name": "SSO"
	  },{
		"test": "auth_mail",
		"name": "Mail"
	  }]
	}
	
## Logs
Extensive logs are saved in the basePath/logs folder.


# API
You can find a swagger.json under https://github.com/ozzi-/TestRunner/blob/master/WebContent/swagger.json
