# aW_assesment
**PROBLEM**:<br>
The user is unable to view the HD Space/RAM usage and running processes in a server. He needs an API that when called Returns all the system/server parameters.

**TECH STACK**: Nodejs. Express. Any No-SQL Db like MongoDB/CouchDB. Any NPM package as needed.<br>
**API**: GET api endpoint returning response in JSON.<br>
**RESPONSE** to have the following data:<br>
1. HDD / Hard Disk
      a. Total Space (in MB)<br>
      b. Free Space Available (in MB and in Percentage)<br>
      c. Used Space (in MB and in Percentage)<br>
      d. Available Drives and their corresponding details.<br>
        i. Total Space (in MB)<br>
        ii. Free Space Available (in MB and in Percentage)<br>
        iii. Used Space (in MB and in Percentage)<br>
2. MEMORY / RAM<br>
      a. Total Memory (in MB)<br>
      b. Free Memory Available (in MB and in Percentage)<br>
      c. Used Memory (in MB and in Percentage)<br>
3. Currently Running Services with their PIDs.<br>
4. Timestamp: when the data was fetched<br>
5. The NodeJs Server should run in UTC time only.<br>

**Solution**<br>
Please find the solution to the above-mentioned issue in the repository.<br>
Setting up the repo is very easy, just clone the repo and run the command <br>

1. npm install
2. npm start

I have used @@NodeJs@@ as the programming language and its @express package@ for managing the logic of the route. 
``` I believe that there is no point in using the database for this GET API solution because this kind of data is very dynamic and will change very frequently.```
+ API Endpoint - /resources
+ API verb - GET

Functionality: <br>
To fetch the available RAM details I used the nodeJS inbuilt @os module@<br>
For Hard disk, I had to use @@diskusuage@@ because its implementation was very simple and straightforward.<br>
For listing the drives on the hard disk, I had to use the nodeJs @child process@ module and used the **df** command to get all the data <br>
FYI - I built this API in Mac, so my solution might perfectly work for Mac/Linux but there will be some tweaks required for the Windows system 
For processes, I have used the ps-list package
