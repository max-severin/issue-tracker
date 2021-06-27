const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let specialIssueId;

  suite('POST request to /api/issues/{project}', function () {
    test('Create an issue with every field', function (done) {
      const testData = {
        issue_title: 'Fix error in posting data',
        issue_text: 'When we post data it has an error.',
        created_by: 'Max',
        assigned_to: 'Max',
        status_text: 'In QA',
      };

      chai
        .request(server)
        .post('/api/issues/apitest')
        .send(testData)
        .end(function (err, res) {
          assert.equal(res.status, 200);  

          assert.nestedInclude(res.body, testData);
          assert.property(res.body, '_id');
          assert.isNotEmpty(res.body._id);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.isNotEmpty(res.body.created_on);
          assert.property(res.body, 'updated_on');
          assert.isNotEmpty(res.body.created_on);
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.isBoolean(res.body.open);
          assert.isTrue(res.body.open);
          assert.property(res.body, 'status_text');

          specialIssueId = res.body._id;

          done();
        });
    });

    test('Create an issue with only required fields', function (done) {
      const testData = {
        issue_title: 'Fix error in posting data',
        issue_text: 'When we post data it has an error.',
        created_by: 'Max',
      };

      chai
        .request(server)
        .post('/api/issues/apitest')
        .send(testData)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          
          assert.nestedInclude(res.body, testData);
          assert.property(res.body, '_id');
          assert.isNotEmpty(res.body._id);
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.isNotEmpty(res.body.created_on);
          assert.property(res.body, 'updated_on');
          assert.isNotEmpty(res.body.created_on);
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.isEmpty(res.body.assigned_to);
          assert.property(res.body, 'open');
          assert.isBoolean(res.body.open);
          assert.isTrue(res.body.open);
          assert.property(res.body, 'status_text');
          assert.isEmpty(res.body.status_text);
          
          done();
        });
    });

    test('Create an issue with missing required fields', function (done) {
      const testData = {
        issue_title: 'Fix error in posting data',
      };

      chai
        .request(server)
        .post('/api/issues/apitest')
        .send(testData)
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'required field(s) missing');

          done();
        });
    });
  });

  suite('GET request to /api/issues/{project}', function () {
    test('View issues on a project', function (done) {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .end(function (err, res) {
          assert.equal(res.status, 200);          
          
          assert.isArray(res.body);
          assert.isAbove(res.body.length, 0);

          res.body.forEach(function (issue) {          
            assert.property(issue, '_id');
            assert.property(issue, 'issue_title');
            assert.property(issue, 'issue_text');
            assert.property(issue, 'created_on');
            assert.property(issue, 'updated_on');
            assert.property(issue, 'created_by');
            assert.property(issue, 'assigned_to');
            assert.property(issue, 'open');
            assert.isBoolean(issue.open);
            assert.property(issue, 'status_text');
          });

          done();
        });
    });

    test('View issues on a project with one filter', function (done) {
      const filterData = {
        open: true,
      };

      chai
        .request(server)
        .get('/api/issues/apitest')
        .query(filterData)
        .end(function (err, res) {
          assert.equal(res.status, 200);          
          
          assert.isArray(res.body);
          assert.isAbove(res.body.length, 0);

          res.body.forEach(function (issue) {          
            assert.property(issue, '_id');
            assert.property(issue, 'issue_title');
            assert.property(issue, 'issue_text');
            assert.property(issue, 'created_on');
            assert.property(issue, 'updated_on');
            assert.property(issue, 'created_by');
            assert.property(issue, 'assigned_to');
            assert.property(issue, 'open');
            assert.isBoolean(issue.open);
            assert.isTrue(issue.open);
            assert.property(issue, 'status_text');
          });

          done();
        });
    });

    test('View issues on a project with multiple filters', function (done) {
      const filterData = {
        open: true,
        assigned_to: 'Max'
      };

      chai
        .request(server)
        .get('/api/issues/apitest')
        .query(filterData)
        .end(function (err, res) {
          assert.equal(res.status, 200);          
          
          assert.isArray(res.body);
          assert.isAbove(res.body.length, 0);

          res.body.forEach(function (issue) {     
            assert.nestedInclude(issue, filterData);     
            assert.property(issue, '_id');
            assert.property(issue, 'issue_title');
            assert.property(issue, 'issue_text');
            assert.property(issue, 'created_on');
            assert.property(issue, 'updated_on');
            assert.property(issue, 'created_by');
            assert.property(issue, 'assigned_to');
            assert.property(issue, 'open');
            assert.isBoolean(issue.open);
            assert.isTrue(issue.open);
            assert.property(issue, 'status_text');
          });
          
          done();
        });
    });
  });

  suite('PUT request to /api/issues/{project}', function () {
    test('Update one field on an issue', function (done) {
      const testData = {
        _id: specialIssueId,
        issue_title: 'Fix error in posting data -- updated',
      };

      chai
        .request(server)
        .put('/api/issues/apitest')
        .send(testData)
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.property(res.body, '_id');
          assert.equal(res.body._id, specialIssueId);
          assert.property(res.body, 'result');
          assert.equal(res.body.result, 'successfully updated');

          done();
        });
    });

    test('Update multiple fields on an issue', function (done) {
      const testData = {
        _id: specialIssueId,
        issue_title: 'Fix error in posting data -- updated -- updated',
        issue_text: 'When we post data it has an error. -- updated',
        created_by: 'Max',
        assigned_to: 'John',
        open: false,
      };

      chai
        .request(server)
        .put('/api/issues/apitest')
        .send(testData)
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.property(res.body, '_id');
          assert.equal(res.body._id, specialIssueId);
          assert.property(res.body, 'result');
          assert.equal(res.body.result, 'successfully updated');

          done();
        });
    });

    test('Update an issue with missing _id', function (done) {
      const testData = {
        issue_title: 'Fix error in posting data -- updated -- updated',
        open: false,
      };

      chai
        .request(server)
        .put('/api/issues/apitest')
        .send(testData)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'missing _id');

          done();
        });
    });

    test('Update an issue with no fields to update', function (done) {
      const testData = {
        _id: specialIssueId,
      };

      chai
        .request(server)
        .put('/api/issues/apitest')
        .send(testData)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          
          assert.property(res.body, '_id');
          assert.equal(res.body._id, specialIssueId);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'no update field(s) sent');

          done();
        });
    });

    test('Update an issue with an invalid _id', function (done) {
      const invalidId = 'TEST_ID';

      const testData = {
        _id: invalidId,
        issue_title: 'Fix error in posting data -- updated',
      };

      chai
        .request(server)
        .put('/api/issues/apitest')
        .send(testData)
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.property(res.body, '_id');
          assert.equal(res.body._id, invalidId);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'could not update');

          done();
        });
    });
  });

  suite('DELETE request to /api/issues/{project}', function () {
    test('Delete an issue', function (done) {
      const testData = {
        _id: specialIssueId,
      };

      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send(testData)
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.property(res.body, '_id');
          assert.equal(res.body._id, specialIssueId);
          assert.property(res.body, 'result');
          assert.equal(res.body.result, 'successfully deleted');
          
          done();
        });
    });

    test('Delete an issue with an invalid _id', function (done) {
      const invalidId = 'TEST_ID';

      const testData = {
        _id: invalidId,
      };

      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send(testData)
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.property(res.body, '_id');
          assert.equal(res.body._id, invalidId);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'could not delete');

          done();
        });
    });

    test('Delete an issue with missing _id', function (done) {
      const testData = {};

      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send(testData)
        .end(function (err, res) {
          assert.equal(res.status, 200);
          
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'missing _id');

          done();
        });
    });
  });
});
