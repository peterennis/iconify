import 'mocha';
import { expect } from 'chai';
import { count, config, loadCache } from '../../lib/browser-storage/';
import {
	nextPrefix,
	createCache,
	reset,
	cachePrefix,
	cacheVersion,
	versionKey,
	countKey,
} from './fake_cache';

describe('Testing mocked localStorage', () => {
	const provider = '';

	it('No usable cache', () => {
		reset({});

		// Config before tests
		expect(config).to.be.eql({
			local: true,
			session: true,
		});
		expect(count).to.be.eql({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadCache();

		// Everything should be disabled
		expect(config).to.be.eql({
			local: false,
			session: false,
		});

		// Nothing should have loaded
		expect(count).to.be.eql({
			local: 0,
			session: 0,
		});
	});

	it('Empty localStorage', () => {
		reset({
			localStorage: createCache(),
		});

		// Config before tests
		expect(config).to.be.eql({
			local: true,
			session: true,
		});
		expect(count).to.be.eql({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadCache();

		// sessionStorage should be disabled
		expect(config).to.be.eql({
			local: true,
			session: false,
		});

		// Nothing should have loaded
		expect(count).to.be.eql({
			local: 0,
			session: 0,
		});
	});

	it('Restricted localStorage', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add one item
		cache.setItem(versionKey, cacheVersion);
		cache.setItem(countKey, '1');
		cache.setItem(
			cachePrefix + '0',
			JSON.stringify({
				cached: Date.now(),
				provider,
				data: {
					prefix: prefix,
					icons: {
						foo: {
							body: '<g></g>',
						},
					},
				},
			})
		);

		// Prevent reading and writing
		cache.canRead = false;
		cache.canWrite = false;

		// Set cache and test it
		reset({
			localStorage: cache,
			sessionStorage: cache,
		});

		// Config before tests
		expect(config).to.be.eql({
			local: true,
			session: true,
		});
		expect(count).to.be.eql({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadCache();

		// Everything should be disabled because read-only mock throws errors
		expect(config).to.be.eql({
			local: false,
			session: false,
		});

		// Nothing should have loaded
		expect(count).to.be.eql({
			local: 0,
			session: 0,
		});
	});

	it('localStorage with one item', () => {
		const prefix = nextPrefix();
		const cache = createCache();

		// Add one icon set
		cache.setItem(versionKey, cacheVersion);
		cache.setItem(countKey, '1');
		cache.setItem(
			cachePrefix + '0',
			JSON.stringify({
				cached: Date.now(),
				provider,
				data: {
					prefix: prefix,
					icons: {
						foo: {
							body: '<g></g>',
						},
					},
				},
			})
		);

		// Set cache and test it
		reset({
			localStorage: cache,
		});

		// Config before tests
		expect(config).to.be.eql({
			local: true,
			session: true,
		});
		expect(count).to.be.eql({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadCache();

		// sessionStorage should be disabled
		expect(config).to.be.eql({
			local: true,
			session: false,
		});

		// One item should be in localStorage
		expect(count).to.be.eql({
			local: 1,
			session: 0,
		});
	});

	it('localStorage and sessionStorage', () => {
		reset({
			localStorage: createCache(),
			sessionStorage: createCache(),
		});

		// Config before tests
		expect(config).to.be.eql({
			local: true,
			session: true,
		});
		expect(count).to.be.eql({
			local: 0,
			session: 0,
		});

		// Attempt to load
		loadCache();

		// Everything should be working
		expect(config).to.be.eql({
			local: true,
			session: true,
		});

		// Empty storage
		expect(count).to.be.eql({
			local: 0,
			session: 0,
		});
	});
});
