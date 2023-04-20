/**
 * Let's get the RCC Results from BigPanda and append them to the Incident ticket.
 * Frank Gallagher | April 2023 | github.com/frank-gallagher-jr 
 * This version is intended to be triggered via a script action by a event queue action (i.e. post creation of the incident)
 */

var request = new sn_ws.RESTMessageV2();

// Set http method params and timeout
request.setHttpMethod("get");
request.setHttpTimeout(5000);

var bpID = current.getValue("x_bip_panda_bigpanda_id");
request.setQueryParameter('incident_id', bpID);
request.setQueryParameter('include', 'change');
// Set headers
request.setRequestHeader("Authorization", "Bearer " + gs.getProperty('x_bip_panda.apiKey'));
request.setRequestHeader("Accept", "application/json");

// Set endpoint
request.setEndpoint("https://api.bigpanda.io/resources/v2.0/rcc");

var response = request.execute();
var jsonResponse = JSON.parse(response.getBody());

totalRelatedCount = jsonResponse.totalRelatedCount;
i = 0;

if (totalRelatedCount == "0") {
    
	gs.info("BigPanda Root Cause Change Correlation did not find any suspects for " + bpID);

} else {
	
	gs.info("BigPanda found " + totalRelatedCount + " suspect Root Cause Change for BigPanda Incident " + bpID);
	
	while(totalRelatedCount > i) {
	
        var sn_chgid = jsonResponse.relatedChanges[i].change.identifier; // change  
        var sn_chgurl = jsonResponse.relatedChanges[i].change.ticket_url; // change 
        var sn_chgsummary = jsonResponse.relatedChanges[i].change.summary; // change 
        var bp_certainty = jsonResponse.relatedChanges[i].match_certainty; // metadata
		
			// Optional 
				//bp_score = jsonResponse.relatedChanges[i].history[0].score; // history
                //var sn_chgstatus = jsonResponse.relatedChanges[i].change.status; // change 
                //var sn_chgstate = jsonResponse.relatedChanges[i].change.tags.state; // change tags
                //var bp_comment = jsonResponse.relatedChanges[i].comment; // metadata

        gs.info("BigPanda Incident: " + bpID + " has identified a potential Root Cause " + bp_certainty + " of Change ID: " + sn_chgid + " Change Summary: " + sn_chgsummary);
            us = i + 1;
			current.description += '\n' + '--------------------------------------------------------' + '\n';
            current.description += 'BigPanda ROOT CAUSE ' + bp_certainty + ' (' + us + ' of ' + totalRelatedCount + ') \n'; 
			current.description += sn_chgid + ':  "' + sn_chgsummary + '" \n';
            current.description += 'Change Details: ' + sn_chgurl + '\n';
			current.description += '--------------------------------------------------------';
		i++;
	}
		current.description += '---END BP RCC---' + '\n';
		current.update();  
}
