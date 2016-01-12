import _ from 'lodash';
import assert from 'yeoman-assert';
import { createAppGenerator, createSubGenerator } from './helper';
import path from 'path';

const appName = 'Test App Name';
const port    = 3030;

describe('generator:routes', function () {

    const prompts = {
        appName: appName,
        install: false,
        port:    port
    };

    const routeName = 'name';
    const routePath = 'path';

    beforeEach(function (done) {
        createAppGenerator(prompts)
            .on('end', () => {
                this.generator = createSubGenerator('router', []);

                // Hack to not clear the directory
                this.generator.inDirSet = true;

                done();
            });
    });

    it('should add new route with default label and icon', function (done) {
        const capitalized = _.capitalize(_.camelCase(routeName));

        this.generator
            .withArguments([routeName, routePath])
            .on('end', function () {
                assert.fileContent('config/routes.json', routeName);
                assert.fileContent('config/routes.json', routePath);
                assert.fileContent('config/routes.json', 'label');
                assert.fileContent('config/routes.json', 'help_outline');

                assert.file(`src/js/components/pages/${capitalized}.jsx`);

                done();
            });
    });

    it('should add new route with provided label and icon', function (done) {
        const label = 'Page Label';
        const icon  = 'ico';

        this.generator
            .withArguments([routeName, routePath, label, icon])
            .on('end', function () {
                assert.fileContent('config/routes.json', routeName);
                assert.fileContent('config/routes.json', routePath);
                assert.fileContent('config/routes.json', label);
                assert.fileContent('config/routes.json', icon);

                done();
            });
    });

    it('should add child route', function (done) {
        const routeName   = 'child';
        const capitalized = _.capitalize(_.camelCase(routeName));

        this.generator
            .withArguments([routeName, '/child'])
            .withOptions({parent: 'index'})
            .on('end', function () {
                assert.fileContent('config/routes.json', 'routes');
                assert.fileContent('config/routes.json', 'child');

                assert.file(`src/js/components/pages/Index/${capitalized}.jsx`);

                done();
            });
    });
});