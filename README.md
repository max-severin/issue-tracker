# Issue Tracker

### Quality Assurance Projects for FCC

Example GET usage:

* /api/issues/{project}
* /api/issues/{project}?open=true&assigned_to=Max

Example return:

    [
      { 
        "_id": "5871dda29faedc3491ff93bb",
        "issue_title": "Fix error in posting data",
        "issue_text": "When we post data it has an error.",
        "created_on": "2021-01-08T06:35:14.240Z",
        "updated_on": "2021-01-08T06:35:14.240Z",
        "created_by": "Max",
        "assigned_to": "Max",
        "open": true,
        "status_text": "In QA"
      },
      ...
    ]

Examples:

* Go to /api/issues/apitest/ project 

Functional Tests:

* Create an issue with every field: **POST** request to **/api/issues/{project}**
* Create an issue with only required fields: **POST** request to **/api/issues/{project}**
* Create an issue with missing required fields: **POST** request to **/api/issues/{project}**
* View issues on a project: **GET** request to **/api/issues/{project}**
* View issues on a project with one filter: **GET** request to **/api/issues/{project}**
* View issues on a project with multiple filters: **GET** request to **/api/issues/{project}**
* Update one field on an issue: **PUT** request to **/api/issues/{project}**
* Update multiple fields on an issue: **PUT** request to **/api/issues/{project}**
* Update an issue with missing **_id**: **PUT** request to **/api/issues/{project}**
* Update an issue with no fields to update: **PUT** request to **/api/issues/{project}**
* Update an issue with an invalid **_id**: **PUT** request to **/api/issues/{project}**
* Delete an issue: **DELETE** request to **/api/issues/{project}**
* Delete an issue with an invalid **_id**: **DELETE** request to **/api/issues/{project}**
* Delete an issue with missing **_id**: **DELETE** request to **/api/issues/{project}**


The project available on replit.com  
https://issue-tracker.maxseverin.repl.co/
