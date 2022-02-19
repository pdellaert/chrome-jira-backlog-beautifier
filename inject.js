function relocateStatus(mutations, observer) {
	console.log("Beautifying Jira backlog status")
	jiraIssues = document.getElementsByClassName("js-issue");
	for (i = 0; i < jiraIssues.length; i++) {
		jiraIssue = jiraIssues[i]
		jiraIssueRows = jiraIssue.getElementsByClassName("ghx-row")
		if (jiraIssueRows.length == 0) {
			continue;
		}
		jiraIssueLabels = jiraIssueRows[0].getElementsByClassName("aui-label")
		if (jiraIssueLabels.length == 0) {
			continue;
		}
		jiraIssueExtraFields = jiraIssue.getElementsByClassName("ghx-extra-field");
		jiraIssueStatusObj = null;
		for (j = 0; j < jiraIssueExtraFields.length; j++) {
			if ( jiraIssueExtraFields[j].hasAttribute("data-tooltip") && jiraIssueExtraFields[j].getAttribute("data-tooltip").includes("Status:") ) {
				jiraIssueStatusObj = jiraIssueExtraFields[j].getElementsByClassName("ghx-extra-field-content");
				break;
			}
		}
		if (jiraIssueStatusObj && jiraIssueStatusObj.length == 1) {
			jiraIssueStatusLabel = document.createElement('span');
			jiraIssueStatusLabel.className = "aui-label ghx-label-double";
			jiraIssueStatusLabel.title = jiraIssueStatusObj[0].textContent;
			jiraIssueStatusLabel.innerText = jiraIssueStatusObj[0].textContent;
			jiraIssueRows[0].insertBefore(jiraIssueStatusLabel, jiraIssueLabels[0]);
			if ( jiraIssueExtraFields.length > 1 ) {
				jiraIssueStatusObj[0].parentNode.remove();
			} else {
				jiraIssueStatusObj[0].parentNode.parentNode.remove();
			}
		}
	}
}

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		var backlog = document.getElementById("ghx-backlog");
		if (backlog) {
			MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
			var observer = new MutationObserver(relocateStatus)
			observer.observe(backlog, {
				subtree: true,
				childList: true
			  });
		}
	} 
}, 10);
});