# aW_assesment
**PROBLEM**: 
The user is unable to view the HD Space/RAM usage and running processes in a server. He needs an API that when called Returns all the system/server parameters.

**TECH STACK**: Nodejs. Express. Any No-SQL Db like MongoDB/CouchDB. Any NPM package as needed.
**API**: GET api endpoint returning response in JSON.
**RESPONSE** to have the following data:
1. HDD / Hard Disk
      a. Total Space (in MB)
      b. Free Space Available (in MB and in Percentage)
      c. Used Space (in MB and in Percentage)
      d. Available Drives and their corresponding details.
        i. Total Space (in MB)
        ii. Free Space Available (in MB and in Percentage)
        iii. Used Space (in MB and in Percentage)
2. MEMORY / RAM
      a. Total Memory (in MB)
      b. Free Memory Available (in MB and in Percentage)
      c. Used Memory (in MB and in Percentage)
3. Currently Running Services with their PIDs.
4. Timestamp: when the data was fetched
5. The NodeJs Server should run in UTC time only.
