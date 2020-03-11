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
![TR](https://i.imgur.com/fxkVzg0.png)

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

The role "r" can only view results, "rw" can additionally run the defined tests.
The role "a" stands for admin, it includes "rw" rights as well as the possibility to administer users.

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

## /TR/login
Expects a JSON object with two fields "username" and "password".

      {
        "username" : "ozzi",
        "password" : "letmein"
      }
Returns a JSON object containing the sessionIdentifier which needs to be sent as a header called "X-TR-Session-ID".

       {
           "username": "ozzi",
           "sessionIdentifier": "1S`Bv@LH{&nD*v:lgXrAZ0z\\n5=q7aJH",
           "role": "rw"
       }

## /TR/testLogin
Checks if a valid session identifier is sent. Returns either "OK" (200) or "NOK" (403).

## /TR/logout
Invalidates the current session identifier.

## /TR/getBasePath
Returns the base path where TR will look for the test file and will store results.

       /var/lib/TR/

## /TR/run/{testname}
Runs a test, returns a handle to the specific test run.
Requires the 'rw' role.

      {"name":"example","handle":"1562594955560"}

## /TR/runGroup/{groupname}
Runs a test group, returns a handle to the specific test run.
Requires the 'rw' role.

      {"name":"examplegroup","handle":"1562594955561"}

## /TR/getResults/{testname}
Returns all results for the specific test.
Example:

      [
            {
               "handle":"1560956995338",
               "result":{
                  "testName":"example",
                  "testStartTimestamp":1560956995338,
				  "testRunBy": "ozzi",
                  "testStartString":"2019-06-19 17:09:55",
                  "description":"Example",
                  "results":[
                     {
                        "name":"task1",
                        "passed": true,
                        "description":"Script executed successfully",
                        "output":"TASK 1!!\n",
                        "errorOutput":"",
                        "runTimeInMS":2523,
                        "startTimestamp":1560956996801,
                        "endTimestamp":1560956999400,
                        "startDate":"2019-06-19 17:09:56",
                        "endDate":"2019-06-19 17:09:59"
                     },
                     {
                        "name":"task2",
                        "passed":true,
                        "description":"Script executed successfully",
                        "output":"task 2\nnewline\n",
                        "errorOutput":"",
                        "runTimeInMS":462,
                        "startTimestamp":1560956999400,
                        "endTimestamp":1560956999863,
                        "startDate":"2019-06-19 17:09:59",
                        "endDate":"2019-06-19 17:09:59"
                     }
                  ]
               }
            },
            {
               "handle":"1559312003986",
               "result":{
                  "testName":"example",
                  "testStartTimestamp":1559312003986,
				  "testRunBy": "ozzi",
                  "testStartString":"2019-05-31 16:13:23",
                  "description":"Example",
                  "results":[
                     {
                        "name":"task1",
                        "passed":true,
                        "description":"Script executed successfully",
                         . . .
                     }
                  ]
               }
            }
      ]

## /TR/getTest/{testname}
Returns the test configuration JSON file for the specific test.

	{
	  "settings": {
		"successhook": "C:\\Program Files (x86)\\Reset\\reset.exe"
	  },
	  "test": {
	    "description": "test_windows",
	    "tasks": [{
	      "name": "task1",
	      "path": "script1.bat",
	      "timeout": 1
	      },{
	      "name": "task2",
	      "path": "script2.bat",
              "args": ["--force"],
	      "timeout": 1
	      },{
	      "name": "task3",
	      "path": "script3.bat"
	      }]
	  } 
	}

## /TR/getGroup/{groupname}
Generates a test configuration file consisting of all merged tests of the specific group.

	{
	  "settings": {
		"successhook": "C:\\Program Files (x86)\\Reset\\reset.exe"
	  },
	  "test": {
	    "description": "Group Test 'test_windows'",
	    "tasks": [{
	      "name": "task1",
	      "path": "script1.bat",
	      "timeout": 1
	      },{
	      "name": "task2",
	      "path": "script2.bat",
	      "timeout": 1
	      },{
	      "name": "task3",
	      "path": "script3.bat"
	      },{
	      "name": "task1",
	      "path": "script2_1.bat"
	      },{
	      "name": "task2",
	      "path": "script2_2.bat"
	      }]
	  } 
	}

## /TR/getGroupResults/{testname}
Returns all results for the specific test group.

	[
	   {
		  "handle":"1559295627973",
		  "result":{
			 "testName":"windowsgroup",
			 "testStartTimestamp":1559295627973,
			 "testRunBy": "ozzi",
			 "testStartString":"2019-05-31 11:40:27",
			 "description":"Group Test 'windowsgroup' consisting of tests: windows,windows2,",
			 "results":[
				{
				   "name":"task1",
				   "passed":true,
				   "description":"Script executed successfully",
				   "output":"\r\nC:\\Users\\ozzi\\Desktop>echo D \r\nD\r\n",
				   "errorOutput":"",
				   "runTimeInMS":45,
				   "startTimestamp":1559295627978,
				   "endTimestamp":1559295628023,
				   "startDate":"2019-05-31 11:40:27",
				   "endDate":"2019-05-31 11:40:28"
				},
				    . . . 
				{
				   "name":"task2",
				   "passed":false,
				   "description":"Script returned non zero return code \"2\"",
				   "output":"\r\nC:\\Users\\ozzi\\Desktop>echo D \r\nD\r\n\r\nC:\\Users\\ozzi\\Desktop>exit 2 \r\n",
				   "errorOutput":"",
				   "runTimeInMS":38,
				   "startTimestamp":1559295629119,
				   "endTimestamp":1559295629158,
				   "startDate":"2019-05-31 11:40:29",
				   "endDate":"2019-05-31 11:40:29"
				}
			 ]
		  }
	   },{
		. . .
	   }
	]

## /TR/getLatestResult/{testname}
Returns the latest result for the specific test.

		{
			"testName": "windows",
			"testStartTimestamp": 1562668638877,
			"testRunBy": "ozzi",
			"testStartString": "2019-07-09 12:37:18",
			"description": "test_windows",
			"results": [
				{
					"name": "task1",
					"passed": true,
					"description": "Script executed successfully",
					"output": "\r\nC:\\WINDOWS\\system32>echo D \r\nD\r\n",
					"errorOutput": "",
					"runTimeInMS": 70,
					"startTimestamp": 1562668638892,
					"endTimestamp": 1562668638970,
					"startDate": "2019-07-09 12:37:18",
					"endDate": "2019-07-09 12:37:18"
				},
				{
					"name": "task2",
					"passed": true,
					"description": "Script executed successfully",
					"output": "\r\nC:\\WINDOWS\\system32>echo foo \r\nfoo\r\n",
					"errorOutput": "",
					"runTimeInMS": 39,
					"startTimestamp": 1562668638970,
					"endTimestamp": 1562668639021,
					"startDate": "2019-07-09 12:37:18",
					"endDate": "2019-07-09 12:37:19"
				},
				{
					"name": "task3",
					"passed": true,
					"description": "Script executed successfully",
					"output": "\r\nC:\\WINDOWS\\system32>echo foooo \r\nfoooo\r\n",
					"errorOutput": "",
					"runTimeInMS": 38,
					"startTimestamp": 1562668639023,
					"endTimestamp": 1562668639048,
					"startDate": "2019-07-09 12:37:19",
					"endDate": "2019-07-09 12:37:19"
				}
			]
		}

## /TR/getLatestGroupResult/{groupname}
Returns the latest result for the specific test group.

	{
		  "handle":"1559295627973",
		  "result":{
			 "testName":"windowsgroup",
			 "testStartTimestamp":1559295627973,
			 "testRunBy": "ozzi",
			 "testStartString":"2019-05-31 11:40:27",
			 "description":"Group Test 'windowsgroup' consisting of tests: windows,windows2,",
			 "results":[
				{
				   "name":"task1",
				   "passed":true,
				   "description":"Script executed successfully",
				   "output":"\r\nC:\\Users\\ozzi\\Desktop>echo D \r\nD\r\n",
				   "errorOutput":"",
				   "runTimeInMS":45,
				   "startTimestamp":1559295627978,
				   "endTimestamp":1559295628023,
				   "startDate":"2019-05-31 11:40:27",
				   "endDate":"2019-05-31 11:40:28"
				},
				    . . . 
				{
				   "name":"task2",
				   "passed":"false",
				   "description":"Script returned non zero return code \"2\"",
				   "output":"\r\nC:\\Users\\ozzi\\Desktop>echo D \r\nD\r\n\r\nC:\\Users\\ozzi\\Desktop>exit 2 \r\n",
				   "errorOutput":"",
				   "runTimeInMS":38,
				   "startTimestamp":1559295629119,
				   "endTimestamp":1559295629158,
				   "startDate":"2019-05-31 11:40:29",
				   "endDate":"2019-05-31 11:40:29"
				}
			 ]
		  }
	   }

## /TR/getResult/{testname}/{handle}
Returns the test results for the specific test run.

		{
		   "testName":"windows",
		   "testStartTimestamp":1562668638877,
		   "testRunBy": "ozzi",
		   "testStartString":"2019-07-09 12:37:18",
		   "description":"test_windows",
		   "results":[
			  {
				 "name":"task1",
				 "passed":true,
				 "description":"Script executed successfully",
				 "output":"\r\nC:\\WINDOWS\\system32>echo D \r\nD\r\n",
				 "errorOutput":"",
				 "runTimeInMS":70,
				 "startTimestamp":1562668638892,
				 "endTimestamp":1562668638970,
				 "startDate":"2019-07-09 12:37:18",
				 "endDate":"2019-07-09 12:37:18"
			  },
			  {
				 "name":"task2",
				 "passed":true,
				 "description":"Script executed successfully",
				 "output":"\r\nC:\\WINDOWS\\system32>echo foo \r\nfoo\r\n",
				 "errorOutput":"",
				 "runTimeInMS":39,
				 "startTimestamp":1562668638970,
				 "endTimestamp":1562668639021,
				 "startDate":"2019-07-09 12:37:18",
				 "endDate":"2019-07-09 12:37:19"
			  },
			  {
				 "name":"task3",
				 "passed":true,
				 "description":"Script executed successfully",
				 "output":"\r\nC:\\WINDOWS\\system32>echo foooo \r\nfoooo\r\n",
				 "errorOutput":"",
				 "runTimeInMS":38,
				 "startTimestamp":1562668639023,
				 "endTimestamp":1562668639048,
				 "startDate":"2019-07-09 12:37:19",
				 "endDate":"2019-07-09 12:37:19"
			  }
		   ]
		}

## /TR/getGroupResult/{groupname}/{handle}
Returns the test group results for the specific test run.

	{
	   "testName":"windowsgroup",
	   "testStartTimestamp":1562589478619,
	   "testRunBy": "ozzi",
	   "testStartString":"2019-07-08 14:37:58",
	   "description":"Group Test 'windowsgroup' consisting of tests: windows,windows2,",
	   "results":[
		  {
			 "name":"task1",
			 "passed":true,
			 "description":"Script executed successfully",
			 "output":"\r\nC:\\WINDOWS\\system32>echo D \r\nD\r\n",
			 "errorOutput":"",
			 "runTimeInMS":45,
			 "startTimestamp":1562589478621,
			 "endTimestamp":1562589478655,
			 "startDate":"2019-07-08 14:37:58",
			 "endDate":"2019-07-08 14:37:58"
		  },
		  {
			 "name":"task2",
			 "passed":true,
			 "description":"Script executed successfully",
			 "output":"\r\nC:\\WINDOWS\\system32>echo fo \r\nfo\r\n",
			 "errorOutput":"",
			 "runTimeInMS":41,
			 "startTimestamp":1562589478655,
			 "endTimestamp":1562589478709,
			 "startDate":"2019-07-08 14:37:58",
			 "endDate":"2019-07-08 14:37:58"
		  },
		  {
			 "name":"task3",
			 "passed":true,
			 "description":"Script executed successfully",
			 "output":"\r\nC:\\WINDOWS\\system32>echo fooo \r\nfooo\r\n",
			 "errorOutput":"",
			 "runTimeInMS":35,
			 "startTimestamp":1562589478709,
			 "endTimestamp":1562589478745,
			 "startDate":"2019-07-08 14:37:58",
			 "endDate":"2019-07-08 14:37:58"
		  },
		  {
			 "name":"task1",
			 "passed":false,
			 "description":"Script execution longer than timeout",
			 "output":"\r\nC:\\WINDOWS\\system32>echo fo \r\nfo\r\n\r\nC:\\WINDOWS\\system32>choice /t 10 /C JN /CS /D J \r\n[J,N]?",
			 "errorOutput":"",
			 "runTimeInMS":1016,
			 "startTimestamp":1562589478745,
			 "endTimestamp":1562589479762,
			 "startDate":"2019-07-08 14:37:58",
			 "endDate":"2019-07-08 14:37:59"
		  },
		  {
			 "name":"task2",
			 "passed":false,
			 "description":"Script returned non zero return code \"2\"",
			 "output":"\r\nC:\\WINDOWS\\system32>echo D \r\nD\r\n\r\nC:\\WINDOWS\\system32>exit 2 \r\n",
			 "errorOutput":"",
			 "runTimeInMS":33,
			 "startTimestamp":1562589479762,
			 "endTimestamp":1562589479797,
			 "startDate":"2019-07-08 14:37:59",
			 "endDate":"2019-07-08 14:37:59"
		  }
	   ]
	}

## /TR/getStatus/{testname}/{handle}
Returns the current state of a specifc test run.

	{"state":"running"}

Two states exist, "running" or "done".

## /TR/getGroupStatus/{groupname}/{handle}
Returns the current state of a specifc test group run.

	{"state":"running"}

Two states exist, "running" or "done".

## /TR/getTestList
Returns all tests.

    [
	  {
        "name": "windows",
        "lastRunDate": "2019-07-11 14:50:45",
        "lastRunPassed": true,
		"totalRunTimeInMS": 154
      },
      {
        "name": "windows2",
        "lastRunDate": "2019-07-08 14:06:29",
        "lastRunPassed": false,
		"totalRunTimeInMS": 350
      }
	]

## /TR/getTestGroupList
Returns all test groups.

	[
	   {
		  "name":"windowsgroup",
		  "lastRunDate":"2019-07-12 14:41:34",
		  "totalRunTimeInMS": 350,
		  "lastRunPassed":true,
		  "tests":[
			 {
				"name":"windows"
			 },
			 {
				"name":"windows2"
			 }
		  ]
	   },
	   {
		  "name":"auth",
		  "lastRunDate":"2019-07-12 15:43:20",
		  "lastRunPassed":false,
		  "totalRunTimeInMS": 1842,
		  "tests":[
			 {
				"name":"smtp"
			 },
			 {
				"name":"sso"
			 }
		  ]
	   }
	]
## /TR/reload
Reloads the users.json file.
Requires the 'rw' role.

## /TR/createUser
Creates a new user.
Requires the 'a' role.

	  {
        "username": "USERNAME",
		"password": "PASSWORD",
		"role": "ROLE"
      }

## /TR/changePassword
Changes the current users password.
Requires the 'rw' or 'a' role.

Expects a JSON object as following:

	  {
		"password": "PASSWORD"
      }
	  
## /TR/changePasswordForUser
Changes the password for the defined user.
Requires the 'a' role.

Expects a JSON object as following:

	  {
		"password": "PASSWORD"
      }
	  
## /TR/deleteUser
Deletes a specified user.
Requires the 'a' role.

Expects a JSON object as following:

	  {
        "username": "USERNAME"
      }
