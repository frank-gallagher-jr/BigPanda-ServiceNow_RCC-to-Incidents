# BigPanda-ServiceNow_RCC-to-Incidents
Integrating BigPanda RCC with ServiceNow Incidents


**

## BigPanda Root Cause Changes in ServiceNow Incident Descriptions

**

**So you don't have all your users in BigPanda UI, but you still want to take advantage of the Root Cause Changes correlation feature of BigPanda in your ticketing system?** 

**No problem.** 
 A few simple steps and you're on your way. 


**Within ServiceNow, as an admin, under the BigPanda Application Scope - Complete the following steps:**

**1.) Register an event queue** - System Policy > Events > Registry 
    Example name "triggerAdditionalEnrichment", table = incident, give it a description

**2.) Create a Business Rule** - System Definition > Business Rules 
    "BigPanda Append RCC", table = incident, Active & Advanced boxes checked, When = After, Update = Checked, Filter conditions = BigPanda ID is not empty
    Advanced tab - 
          Condition = gs.getProperty('x_bip_panda.incidentsActive') === 'true'
          Script = 
            (function executeRule(current) {
            gs.eventQueue("x_bip_panda.triggerAdditionalEnrichment", current);
            })(current);

**3.) Create a script action** - System Policy > Events > Script Actions
Name it something like "ProcessBigPandaRCC", align the event x_bip_panda.triggerAdditionalEnrichment, set it to active, and then use the script in this folder in the script box. 


  

  **--- EXAMPLE OUTPUT - INCIDENT DESCRIPTION in SNOW ---** 
    
    Alert Summary: 1 Critical, 0 Warning, 0 Resolved 
    -------------------------------------------------------- 
    
    Alert: 1 / 1
    Status: Critical
    Source: oim.monitoring_system_a
    Host: prdapp6.hellowhirl.dev
    Check: Server Availability
    Cmdb Ci: prdapp6.hellowhirl.dev
    Application: Active Directory
    
    --------------------------------------------------------
    Incident Link: https://a.bigpanda.io/#/app/overview/exampleIncidentLink
    Incident Timeline Link: https://a.bigpanda.io/#/app/overview/ExampleEnvironment/active/incidents/ExampleIncident/timeline
    Incident Preview Link: http://bigp.io/anumberofsomesort
    --------------------------------------------------------
    BigPanda ROOT CAUSE SUSPECT (1 of 1) 
    CHG0030008:  "Production host prdapp6.hellowhirl.dev planned maintenance" 
    Change Details: https://dev107697.service-now.com/nav_to.do?uri=change_request.do?sys_id=7159ca35471621103ea2e80f136d4356
    -----------------------------------------------------------END BP RCC---
