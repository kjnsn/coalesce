import { expect } from 'chai';
import * as lolex from 'lolex';

import Coalesce from './index';

describe("The request coalescer", function() {
    it("coalesces requests", function() {
        const c = new Coalesce(50);

        let callbacks = 0;
        const callback = function() {
            callbacks++;
        }

        let calls = 0;
        const fn = function() {
            calls++;
        }

        const clock = lolex.install();

        for (let i = 0; i < 100; i++) {
            c.queueCommand("foo", fn, callback);            
        }

        expect(calls).to.equal(0);
        expect(callbacks).to.equal(0);

        clock.tick(51);

        expect(calls).to.equal(1);
        expect(callbacks).to.equal(100);

        clock.uninstall();

    });
});
