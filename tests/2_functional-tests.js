const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
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
          // assert.equal(res.body.issue_title, 'Fix error in posting data');

          assert.property(res.body, 'issue_text');
          // assert.equal(res.body.issue_text, 'When we post data it has an error.');

          assert.property(res.body, 'created_on');
          assert.isNotEmpty(res.body.created_on);

          assert.property(res.body, 'updated_on');
          assert.isNotEmpty(res.body.created_on);

          assert.property(res.body, 'created_by');
          // assert.equal(res.body.created_by, 'Max');

          assert.property(res.body, 'assigned_to');
          // assert.equal(res.body.assigned_to, 'Max');

          assert.property(res.body, 'open');
          assert.isBoolean(res.body.open);
          assert.isTrue(res.body.open);

          assert.property(res.body, 'status_text');
          // assert.equal(res.body.status_text, 'In QA');

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
          // assert.equal(res.body.issue_title, 'Fix error in posting data');

          assert.property(res.body, 'issue_text');
          // assert.equal(res.body.issue_text, 'When we post data it has an error.');

          assert.property(res.body, 'created_on');
          assert.isNotEmpty(res.body.created_on);

          assert.property(res.body, 'updated_on');
          assert.isNotEmpty(res.body.created_on);

          assert.property(res.body, 'created_by');
          // assert.equal(res.body.created_by, 'Max');

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
    // test('View issues on a project', function (done) {
    //   chai
    //     .request(server)
    //     .get('____')
    //     .query({ ____ })
    //     .end(function (err, res) {
    //       assert.equal(res.status, 200);
    //       // ____
    //       done();
    //     });
    // });

    // test('View issues on a project with one filter', function (done) {
    //   chai
    //     .request(server)
    //     .get('____')
    //     .query({ ____ })
    //     .end(function (err, res) {
    //       assert.equal(res.status, 200);
    //       // ____
    //       done();
    //     });
    // });

    // test('View issues on a project with multiple filters', function (done) {
    //   chai
    //     .request(server)
    //     .get('____')
    //     .query({ ____ })
    //     .end(function (err, res) {
    //       assert.equal(res.status, 200);
    //       // ____
    //       done();
    //     });
    // });
  });

  suite('PUT request to /api/issues/{project}', function () {
    // test('Update one field on an issue', function (done) {
    //   chai
    //     .request(server)
    //     .get('____')
    //     .query({ ____ })
    //     .end(function (err, res) {
    //       assert.equal(res.status, 200);
    //       // ____
    //       done();
    //     });
    // });

    // test('Update multiple fields on an issue', function (done) {
    //   chai
    //     .request(server)
    //     .get('____')
    //     .query({ ____ })
    //     .end(function (err, res) {
    //       assert.equal(res.status, 200);
    //       // ____
    //       done();
    //     });
    // });

    // test('Update an issue with missing _id', function (done) {
    //   chai
    //     .request(server)
    //     .get('____')
    //     .query({ ____ })
    //     .end(function (err, res) {
    //       assert.equal(res.status, 200);
    //       // ____
    //       done();
    //     });
    // });

    // test('Update an issue with no fields to update', function (done) {
    //   chai
    //     .request(server)
    //     .get('____')
    //     .query({ ____ })
    //     .end(function (err, res) {
    //       assert.equal(res.status, 200);
    //       // ____
    //       done();
    //     });
    // });

    // test('Update an issue with an invalid _id', function (done) {
    //   chai
    //     .request(server)
    //     .get('____')
    //     .query({ ____ })
    //     .end(function (err, res) {
    //       assert.equal(res.status, 200);
    //       // ____
    //       done();
    //     });
    // });
  });

  suite('DELETE request to /api/issues/{project}', function () {
    // test('Delete an issue', function (done) {
    //   chai
    //     .request(server)
    //     .get('____')
    //     .query({ ____ })
    //     .end(function (err, res) {
    //       assert.equal(res.status, 200);
    //       // ____
    //       done();
    //     });
    // });

    // test('Delete an issue with an invalid _id', function (done) {
    //   chai
    //     .request(server)
    //     .get('____')
    //     .query({ ____ })
    //     .end(function (err, res) {
    //       assert.equal(res.status, 200);
    //       // ____
    //       done();
    //     });
    // });

    // test('Delete an issue with missing _id', function (done) {
    //   chai
    //     .request(server)
    //     .get('____')
    //     .query({ ____ })
    //     .end(function (err, res) {
    //       assert.equal(res.status, 200);
    //       // ____
    //       done();
    //     });
    // });
  });
});
