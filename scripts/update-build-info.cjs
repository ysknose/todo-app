'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { format } = require('date-fns');

function getShortSha() {
	try {
		return cp.execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
			.toString()
			.trim();
	} catch {
		return 'unknown';
	}
}

function main() {
	const pkgPath = path.join(process.cwd(), 'package.json');
	const raw = fs.readFileSync(pkgPath, 'utf8');
	const pkg = JSON.parse(raw);

	const version = pkg.version || '0.0.0';
	const shortSha = process.env.NEXT_PUBLIC_BUILD_COMMIT || getShortSha();

	const prev = pkg.buildInfo || {};
	const prevCommit = prev.commit || '';
	let date = prev.date || '';
	if (!date || prevCommit !== shortSha) {
		date = format(new Date(), 'yyyyMMddHHmm');
	}

	const label = `${version}_${shortSha}_${date}`;

	pkg.buildInfo = { commit: shortSha, date, label };

	fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

main();
