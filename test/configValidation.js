'use strict';

const tape = require( 'tape' );

const configValidation = require( '../configValidation' );

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test( 'missing datapath should throw error', function(t) {
    const config = {};

    t.throws(() => {
      configValidation.validate(config);
    }, /"datapath" is required/);

    t.end();
  });

  test( 'non-string datapath should throw error', function(t) {
    [null, 17, {}, [], false].forEach((value) => {
      const config = {
        datapath: value
      };

      t.throws(() => {
        configValidation.validate(config);
      }, /"datapath" must be a string/);

    });

    t.end();
  });

  test( 'non-array import should throw error', function(t) {
    [null, 17, {}, 'string', false].forEach((value) => {
      const config = {
        datapath: 'this is the datapath',
        import: value
      };

      t.throws(() => {
        configValidation.validate(config);
      }, /"import" must be an array/);
    });

    t.end();
  });

  test( 'non-object elements in import array should throw error', function(t) {
    [null, 17, 'string', [], false].forEach((value) => {
      const config = {
        datapath: 'this is the datapath',
        import: [value]
      };

      t.throws(() => {
        configValidation.validate(config);
      }, /"0" must be an object/, 'import elements must be objects');
    });

    t.end();
  });

  test( 'object elements in import array missing filename should throw error', function(t) {
    const config = {
      datapath: 'this is the datapath',
      import: [{}]
    };

    t.throws(() => {
      configValidation.validate(config);
    }, /"filename" is required/, 'import elements must contain filename');

    t.end();
  });

  test( 'non-string filenames in import array should throw error', function(t) {
    [null, 17, {}, [], false].forEach((value) => {
      const config = {
        datapath: 'this is the datapath',
        import: [{
          filename: value
        }]
      };

      t.throws(() => {
        configValidation.validate(config);
      }, /"filename" must be a string/);
    });

    t.end();
  });

  test( 'non-string leveldbpath should throw error', function(t) {
    [null, 17, {}, [], false].forEach((value) => {
      const config = {
        datapath: 'this is the datapath',
        leveldbpath: value
      };

      t.throws(() => {
        configValidation.validate(config);
      }, /"leveldbpath" must be a string/);

    });

    t.end();
  });

  test( 'non-boolean adminLookup should throw error', function(t) {
    [null, 17, {}, [], 'string'].forEach((value) => {
      const config = {
        datapath: 'this is the datapath',
        adminLookup: value
      };

      t.throws(() => {
        configValidation.validate(config);
      }, /"adminLookup" must be a boolean/);
    });

    t.end();
  });

  test( 'non-boolean deduplicate should throw error', function(t) {
    [null, 17, {}, [], 'string'].forEach((value) => {
      const config = {
        datapath: 'this is the datapath',
        deduplicate: value
      };

      t.throws(() => {
        configValidation.validate(config);
      }, /"deduplicate" must be a boolean/);
    });

    t.end();
  });

  test( 'unknown config fields should throw error', function(t) {
    const config = {
      datapath: 'this is the datapath',
      unknown: 'value'
    };

    t.throws(() => {
      configValidation.validate(config);
    }, /"unknown" is not allowed/, 'unknown fields should be disallowed');
    t.end();

  });

  test( 'configuration with only datapath should not throw error', function(t) {
    const config = {
      datapath: 'this is the datapath'
    };

    t.doesNotThrow(() => {
      configValidation.validate(config);
    }, 'config should be valid');
    t.end();

  });

  test( 'valid configuration with unknown fields in import objects should not throw error', function(t) {
    const config = {
      datapath: 'this is the datapath',
      deduplicate: false,
      adminLookup: false,
      import: [
        {
          filename: 'file 1',
          type: {
            node: 'value 1',
            way: 'value 2'
          }
        },
        {
          filename: 'file 2'
        }
      ]
    };

    t.doesNotThrow(() => {
      configValidation.validate(config);
    }, 'config should be valid');
    t.end();

  });

};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('configValidation: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
